// run-all-packs.v2.mjs — added 2026-10-04. Runs every pack in src/engine/packs.v2.json
// (deadlinesf@ad10d68, 15 packs) through src/engine/engine.mjs decide() with the same
// default Prestige facts as RUN-LOG.json. No controls submitted. Writes docs/*.v2.* only.
import { readFileSync, writeFileSync } from "node:fs";
import { decide, applicabilityOf } from "../src/engine/engine.mjs";
const bundle = JSON.parse(readFileSync(new URL("../src/engine/packs.v2.json", import.meta.url)));
const runLog = JSON.parse(readFileSync(new URL("../docs/RUN-LOG.json", import.meta.url)));
const facts = runLog.facts_used;
const rows = Object.values(bundle.packs).map((pack) => {
  const app = applicabilityOf(pack, facts);
  const d = decide(pack, facts, []);
  return {
    law_id: pack.law_id, title: pack.title, jurisdiction: pack.jurisdiction, version: pack.version,
    requirements: (pack.requirements || []).length,
    controls: (pack.requirements || []).reduce((n, r) => n + (r.controls || []).length, 0),
    applicability: d.applicability, outcome: d.outcome, confidence: d.confidence, escalation: d.escalation,
    missing: app.missing || [], reasons: (d.reason_codes || []).map((r) => `${r.code}: ${r.message}`),
  };
});
const by = (k) => rows.reduce((m, r) => ((m[r[k]] = (m[r[k]] || 0) + 1), m), {});
const report = {
  generated_at: new Date().toISOString(), engine: "src/engine/engine.mjs (deadlinesf blob 64adde4)",
  packs_commit: "ad10d68", bundle_sha256: bundle.bundle_sha256, pack_count: rows.length,
  facts_used: facts, controls_submitted: 0, outcomes: by("outcome"), applicability: by("applicability"), rows,
};
writeFileSync(new URL("../docs/ALL-PACKS-REPORT.v2.json", import.meta.url), JSON.stringify(report, null, 1) + "\n");
const md = [`# All packs report v2 — ${report.generated_at}`, "",
  `Engine \`engine.mjs\` (blob 64adde4). Packs deadlinesf \`ad10d68\`, bundle \`${report.bundle_sha256}\`, ${rows.length} packs.`,
  "Default Prestige facts (same as RUN-LOG.json). No control evidence submitted, so HUMAN_REVIEW means \"applies or unresolved, no evidence\" — not a pass.", "",
  `Outcomes: ${JSON.stringify(report.outcomes)}. Applicability: ${JSON.stringify(report.applicability)}.`, "",
  "| law_id | version | reqs | controls | applicability | outcome | confidence | escalation |", "|---|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.law_id} | ${r.version} | ${r.requirements} | ${r.controls} | ${r.applicability} | ${r.outcome} | ${r.confidence} | ${r.escalation} |`),
  "", "Earlier 14-pack report (838c737) stays in ALL-PACKS-REPORT.md / .json, unchanged."].join("\n");
writeFileSync(new URL("../docs/ALL-PACKS-REPORT.v2.md", import.meta.url), md + "\n");
console.log(report.outcomes, report.applicability);
