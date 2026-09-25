# QuantumRain engine wire — 2026-09-25

## What Intercept does now

`src/App.jsx` calls `runGlassId` → DeadlineSF `engine.mjs` `decide()`.

Same JS port `the-engine-` uses (`vendor/deadlinesf/netlify/functions/engine.mjs`).
Packs from DeadlineSF `838c737` `packs.json` bundle `2bd41a911eae198a5406fbec79039b81577e97030ceca6c5c3619f33fa8ae350`.

## Drop file

**Drop file** reads your `.yaml` / `.json` in the browser, compiles it, then Intercept runs `decide` on that object. Receipts go to `localStorage.qr-receipts`.

## Decision proof (default Prestige facts, no controls submitted)

| law_id | applicability | outcome |
|---|---|---|
| cyclonedx-cbom-1.6 | APPLIES | HUMAN_REVIEW |
| cisa-sbom-2026 | APPLIES | HUMAN_REVIEW |
| cyclonedx-cbom-sbom | APPLIES | HUMAN_REVIEW |
| eo_14412 | DOES_NOT_APPLY | ALLOW |
| ab2013 | APPLIES | HUMAN_REVIEW |

HUMAN_REVIEW is correct: the pack applies and no control evidence was attached.

## Strength ledger (the-engine- receipts, not invented)

| pack | before | after | Δ |
|---|---:|---:|---:|
| PQC-FIPS204 | 41.5 | 44.5 | +3 |
| SUITE-TC01-36 | 44.5 | 87.5 | +43 |
| FRONTIER-TC37-46 | 87.5 | 92.5 | +5 |
| PROVENANCE-GAPS | 92.5 | 92.5 | 0 |
| EVIDENCE-REPLAY | 92.5 | 100 | +7.5 |

LIVE head is 100. A new QBOM/SBOM decision does not add fake points.

## How to use it yourself

1. Open quantumrain.grok.me
2. Drop pack until QBOM / SBOM / Frontier is showing, or Drop file your YAML
3. Intercept
4. Read outcome + applicability + score before → after on the delta card
