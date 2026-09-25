import bundle from "./packs.json";
import runLog from "./run-log.json";
import { decide, applicabilityOf } from "./engine.mjs";
import { parsePackText } from "./compile.js";

export const DEFAULT_FACTS = {
  ships_or_operates_software: true,
  implements_cryptography: true,
  consumes_cryptographic_libraries: true,
  terminates_tls_or_issues_certificates: true,
  claims_pqc_or_quantum_safe: true,
  claims_supply_chain_transparency: true,
  sells_to_us_federal_government: false,
  contract_requires_sbom: true,
  in_scope_eu_cyber_resilience_act: false,
  system_tier_high_value_asset: false,
  system_tier_federal_covered: false,
  federal_covered_system: false,
  develops_generative_ai_system: true,
  provides_generative_ai_system: true,
  publicly_accessible_in_ca: true,
  genai_released_on_or_after_2022_01_01: true,
  sole_purpose_security_aircraft_or_defense: false,
};

export const GLASS_TO_LAW = {
  AB2013: "ab2013",
  "PQC-FIPS204": "eo_14412",
  "QBOM-CBOM-16": "cyclonedx-cbom-1.6",
  "SBOM-CISA-2026": "cisa-sbom-2026",
  "SBOM-QBOM": "cyclonedx-cbom-sbom",
};

export const STRENGTH_CHAIN = runLog.hardening_strength_chain;
export const LIVE_HEAD = runLog.live_head_score;
export const BUNDLE_SHA = runLog.bundle_sha256;

export function lawPack(id) {
  return bundle.packs[id] || null;
}

export function runPack(pack, facts = DEFAULT_FACTS, controls = []) {
  const app = applicabilityOf(pack, facts);
  const decision = decide(pack, facts, controls);
  const hardening = STRENGTH_CHAIN.find((row) => row.pack_id === pack.law_id);
  return {
    at: new Date().toISOString(),
    law_id: pack.law_id,
    title: pack.title,
    requirements: (pack.requirements || []).length,
    applicability: decision.applicability,
    outcome: decision.outcome,
    confidence: decision.confidence,
    escalation: decision.escalation,
    reasons: decision.reason_codes || [],
    missing: app.missing || [],
    strength: hardening || {
      pack_id: pack.law_id,
      source: "DeadlineSF engine.mjs on this page",
      score_before: LIVE_HEAD,
      score_after: LIVE_HEAD,
      change: 0,
      result: "VALIDATED_NO_CHANGE",
      note: "LIVE head is 100. Decision ran. Strength ledger does not invent points.",
    },
  };
}

export function runGlassId(glassId, extraPack, controls = []) {
  if (extraPack && extraPack.law_id) return runPack(extraPack, DEFAULT_FACTS, controls);
  const lawId = GLASS_TO_LAW[glassId] || glassId;
  if (lawId && bundle.packs[lawId]) return runPack(bundle.packs[lawId], DEFAULT_FACTS, controls);
  const hardening = STRENGTH_CHAIN.find((row) => row.pack_id === glassId);
  if (hardening) {
    return {
      at: new Date().toISOString(),
      law_id: glassId,
      title: glassId,
      requirements: 0,
      applicability: "HARDENING_LEDGER",
      outcome: hardening.result,
      confidence: "HIGH",
      escalation: "NONE",
      reasons: [{ code: "LEDGER", message: `${hardening.score_before} → ${hardening.score_after}` }],
      missing: [],
      strength: hardening,
    };
  }
  return {
    at: new Date().toISOString(),
    law_id: glassId,
    title: glassId,
    requirements: 0,
    applicability: "NOT_IN_BUNDLE",
    outcome: "NO_ENGINE_PACK",
    confidence: "LOW",
    escalation: "NONE",
    reasons: [{ code: "NOT_IN_DEADLINESF_BUNDLE", message: "This glass id is not a compiled DeadlineSF pack." }],
    missing: [],
    strength: {
      pack_id: glassId,
      source: "glass-only",
      score_before: LIVE_HEAD,
      score_after: LIVE_HEAD,
      change: 0,
      result: "NO_ENGINE_PACK",
    },
  };
}

export function loadDroppedFile(text, name) {
  return parsePackText(text, name);
}

export function allCompiledGlass() {
  return Object.values(bundle.packs).map((pack) => ({
    id: pack.law_id,
    name: pack.metadata?.short_name || pack.title,
    file: `${pack.law_id}.yaml`,
    sections: (pack.requirements || []).map((r) => r.id).slice(0, 8),
    compiled: pack,
  }));
}

export function satisfiedControls(pack) {
  if (!pack?.requirements) return [];
  return pack.requirements.flatMap((r) =>
    (r.controls || []).map((c) => ({ control_id: c.control_id, satisfaction: "SATISFIED" })),
  );
}

export { bundle, runLog };
