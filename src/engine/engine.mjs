/**
 * Decision + findings engine, ported for the edge.
 *
 * This mirrors the Python engines exactly in behaviour, and the law packs it
 * reads are compiled from the same YAML rather than rewritten. The properties
 * that matter are preserved deliberately:
 *
 *  - three-valued logic, so a missing fact escalates instead of silently
 *    passing or silently failing
 *  - applicability gates everything: an organization the statute does not
 *    reach gets zero findings, never a list of violations
 *  - locked findings are built without remediation text, so there is nothing
 *    in the response for a client to un-hide
 */

const TRUE = "TRUE";
const FALSE = "FALSE";
const UNKNOWN = "UNKNOWN";

const MISSING = Symbol("missing");

function compare(op, actual, expected) {
  switch (op) {
    case "eq": return actual === expected ? TRUE : FALSE;
    case "ne": return actual !== expected ? TRUE : FALSE;
    case "truthy": return actual ? TRUE : FALSE;
    case "in": return Array.isArray(expected) && expected.includes(actual) ? TRUE : FALSE;
    case "not_in": return Array.isArray(expected) && !expected.includes(actual) ? TRUE : FALSE;
    case "contains":
      if (actual == null) return UNKNOWN;
      return Array.isArray(actual) || typeof actual === "string"
        ? (actual.includes(expected) ? TRUE : FALSE)
        : UNKNOWN;
    case "gt": case "gte": case "lt": case "lte": {
      // An ordering against a non-number is unanswerable, not false: the fact
      // came in a shape we cannot rank.
      if (typeof actual !== "number" || typeof expected !== "number") return UNKNOWN;
      if (op === "gt") return actual > expected ? TRUE : FALSE;
      if (op === "gte") return actual >= expected ? TRUE : FALSE;
      if (op === "lt") return actual < expected ? TRUE : FALSE;
      return actual <= expected ? TRUE : FALSE;
    }
    default: return UNKNOWN;
  }
}

function negate(value) {
  if (value === TRUE) return FALSE;
  if (value === FALSE) return TRUE;
  return UNKNOWN;
}

export function evaluate(condition, facts) {
  if (!condition) return { value: TRUE, missing: [] };

  if (!condition.combinator) {
    const key = condition.fact;
    const present = Object.prototype.hasOwnProperty.call(facts, key);
    const actual = present ? facts[key] : MISSING;

    if (condition.op === "exists") {
      return { value: present ? TRUE : FALSE, missing: [] };
    }
    if (!present) return { value: UNKNOWN, missing: [key] };
    if (actual === null) {
      return ["eq", "ne", "truthy"].includes(condition.op)
        ? { value: compare(condition.op, actual, condition.value), missing: [] }
        : { value: UNKNOWN, missing: [key] };
    }
    return { value: compare(condition.op, actual, condition.value), missing: [] };
  }

  const results = condition.children.map((c) => evaluate(c, facts));
  const missing = [...new Set(results.flatMap((r) => r.missing))];
  const values = results.map((r) => r.value);

  if (condition.combinator === "all_of") {
    if (values.includes(FALSE)) return { value: FALSE, missing };
    if (values.includes(UNKNOWN)) return { value: UNKNOWN, missing };
    return { value: TRUE, missing };
  }
  if (condition.combinator === "any_of") {
    if (values.includes(TRUE)) return { value: TRUE, missing };
    if (values.includes(UNKNOWN)) return { value: UNKNOWN, missing };
    return { value: FALSE, missing };
  }
  if (condition.combinator === "none_of") {
    const inner = evaluate({ combinator: "any_of", children: condition.children }, facts);
    return { value: negate(inner.value), missing: inner.missing };
  }
  return { value: UNKNOWN, missing };
}

export function applicabilityOf(pack, facts) {
  const result = evaluate(pack.applicability, facts);
  if (result.value === TRUE) return { applicability: "APPLIES", missing: result.missing };
  if (result.value === FALSE) return { applicability: "DOES_NOT_APPLY", missing: result.missing };
  return { applicability: "INDETERMINATE", missing: result.missing };
}

function requirementStatus(requirement, facts, submitted) {
  const scope = evaluate(requirement.applies_when, facts);
  if (scope.value === FALSE) {
    return { inScope: false, satisfaction: "SATISFIED", reason: "out of scope for these facts" };
  }
  if (scope.value === UNKNOWN) {
    return {
      inScope: true,
      satisfaction: "UNKNOWN",
      reason: "cannot determine whether this requirement is in scope",
    };
  }

  const statuses = [];
  const unmentioned = [];
  const failed = [];
  for (const spec of requirement.controls) {
    const check = submitted[spec.control_id];
    if (!check) {
      unmentioned.push(spec.control_id);
      statuses.push("UNKNOWN");
    } else {
      statuses.push(check.satisfaction);
      if (check.satisfaction === "NOT_SATISFIED") failed.push(spec.control_id);
    }
  }
  if (statuses.includes("NOT_SATISFIED")) {
    return { inScope: true, satisfaction: "NOT_SATISFIED", reason: `controls not satisfied: ${failed.join(", ")}` };
  }
  if (statuses.includes("UNKNOWN")) {
    return {
      inScope: true,
      satisfaction: "UNKNOWN",
      reason: unmentioned.length
        ? `no evidence submitted for: ${unmentioned.join(", ")}`
        : "control status reported as unknown",
    };
  }
  return { inScope: true, satisfaction: "SATISFIED", reason: "all declared controls satisfied" };
}

export function decide(pack, facts, controls = []) {
  const { applicability, missing } = applicabilityOf(pack, facts);

  if (applicability === "INDETERMINATE") {
    return {
      outcome: "HUMAN_REVIEW",
      applicability,
      confidence: "LOW",
      escalation: "APPLICABILITY_UNRESOLVED",
      reason_codes: [
        { code: "APPLICABILITY_UNRESOLVED", message: "Cannot establish whether this law reaches the organization." },
        { code: "MISSING_FACTS", message: `missing facts: ${missing.sort().join(", ")}` },
      ],
    };
  }
  if (applicability === "DOES_NOT_APPLY") {
    return {
      outcome: "ALLOW",
      applicability,
      confidence: "HIGH",
      escalation: "NONE",
      reason_codes: [{ code: "LAW_NOT_APPLICABLE", message: "Applicability conditions are not met for these facts." }],
    };
  }

  const submitted = Object.fromEntries(controls.map((c) => [c.control_id, c]));
  const statuses = pack.requirements.map((r) => ({ requirement: r, ...requirementStatus(r, facts, submitted) }));
  const inScope = statuses.filter((s) => s.inScope);
  const unsatisfied = inScope.filter((s) => s.satisfaction === "NOT_SATISFIED");
  const unknown = inScope.filter((s) => s.satisfaction === "UNKNOWN");

  const reason_codes = [
    ...unsatisfied.map((s) => ({ code: "REQUIREMENT_NOT_SATISFIED", message: `${s.requirement.id}: ${s.reason}` })),
    ...unknown.map((s) => ({ code: "REQUIREMENT_STATUS_UNKNOWN", message: `${s.requirement.id}: ${s.reason}` })),
  ];

  let outcome = "ALLOW";
  let confidence = "HIGH";
  let escalation = "NONE";
  if (unsatisfied.length) {
    outcome = "REMEDIATE";
  } else if (unknown.length) {
    outcome = "HUMAN_REVIEW";
    confidence = "LOW";
    escalation = "INSUFFICIENT_EVIDENCE";
  } else {
    reason_codes.push({ code: "ALL_REQUIREMENTS_SATISFIED", message: "Every in-scope requirement is satisfied." });
  }

  return { outcome, applicability, confidence, escalation, reason_codes, statuses };
}

const SEVERITY_RANK = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export function buildReport(pack, facts, controls = [], freeFindings = 1) {
  const { applicability } = applicabilityOf(pack, facts);

  // Applicability gates findings. Telling an organization it violates a law
  // that does not reach it is the one mistake this product cannot make.
  if (applicability !== "APPLIES") {
    return {
      law_id: pack.law_id,
      law_version: pack.version,
      total_findings: 0,
      unlocked_count: 0,
      locked_count: 0,
      findings: [],
    };
  }

  const submitted = Object.fromEntries(controls.map((c) => [c.control_id, c]));
  const scored = [];
  pack.requirements.forEach((requirement, order) => {
    const status = requirementStatus(requirement, facts, submitted);
    if (!status.inScope || status.satisfaction === "SATISFIED") return;
    const severity = status.satisfaction === "NOT_SATISFIED" ? "HIGH" : "MEDIUM";
    scored.push({ requirement, status, severity, order });
  });
  scored.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || a.order - b.order);

  const findings = scored.map(({ requirement, status, severity }, index) => {
    const unlocked = index < Math.max(0, freeFindings);
    const finding = {
      requirement_id: requirement.id,
      title: requirement.title,
      citation: requirement.citation,
      severity,
      summary: status.reason,
      locked: !unlocked,
    };
    // Built only when unlocked. A locked finding has no paid content on it.
    if (unlocked) {
      finding.remediation = requirement.controls
        .filter((spec) => !submitted[spec.control_id] || submitted[spec.control_id].satisfaction !== "SATISFIED")
        .map((spec) => `${spec.title}.${spec.description ? " " + spec.description.trim() : ""}`.trim());
    }
    return finding;
  });

  return {
    law_id: pack.law_id,
    law_version: pack.version,
    total_findings: findings.length,
    unlocked_count: findings.filter((f) => !f.locked).length,
    locked_count: findings.filter((f) => f.locked).length,
    findings,
  };
}
