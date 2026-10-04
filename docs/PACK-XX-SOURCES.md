# PACK-xx source files: where they are (2026-10-04)

Added 2026-10-04. Record only. No existing file was changed.

## IDs cited

| ID | Where it is cited |
|---|---|
| PACK-11-DGCL-GOV | live quantumrain.grok.me (`pack-inventory-4vl63AdL.js`, `routes-Dmss469o.js`), `src/App.jsx` (760ebbd, 326d8ca) as `PACK-11-DGCL-GOV.json`, goldtrac.3 `witness/chain.json` (8 engine receipts) |
| PACK-01-HIPAA-HITECH | live site, `src/App.jsx` as `PACK-01-HIPAA-HITECH.json`, goldtrac.3 (17 engine receipts + 3 BindDecision, pack_version `desk-1.0.0`) |
| PACK-02-NACHA-REGE | live site, `src/App.jsx` (label only, no file name) |
| PACK-04-GDPR-CORE | goldtrac.3 (2 Phase-1 engine receipts) only |
| CA-AB-2013 … USPTO-ALICE (11 "mapped") | live site labels only |
| PACK_01 … PACK_12 | prestigesf/the-engine- `src/lib/console/registry.ts`. Different family: marked `ILLUSTRATIVE_EXAMPLE` |

## Searched, not found

- All 52 prestigesf repos, every branch, full history: `git log --all -S` for `PACK-11`, `PACK-01`, `PACK-02`, `PACK-04`, `DGCL-GOV`, `HIPAA-HITECH`, `NACHA-REGE`, plus file names matching `PACK-[0-9]`. The only hits are `quantumrain.grok.me` (760ebbd, 326d8ca: labels and section lists in App.jsx) and `goldtrac.3` (0181ccd: receipts in witness/chain.json). No commit has ever held a `PACK-xx-*.json` file.
- The live quantumrain.grok.me JS bundle has only id, label, kind and category. There is no pack body.
- Google Drive (both connectors): no file.
- Gmail (both connectors): no message.

## What exists instead

goldtrac.3 receipts give only the pack id and version, an HMAC `receipt_hash` and a verdict. For example, the first PACK-11 receipt (2026-09-10 3:42 PM PT) has
`receipt_hash 09679c6a4a7436d82cda46076dd35b320285a7fccc66bcd5e1a7a8d8f5aae4c5`, verdict `VALIDATED_NO_CHANGE`.
These prove a run happened against some pack bytes. They do not contain those bytes.

## Why they are not in the quantumrain repos

The live site is a Grok App Builder project (app id `01a07abc-50b8-7f10-835c-f77d810d9582`, TanStack build with server functions). The PACK-xx runs (Sept 10–11) happened before this repo was rebuilt on Sept 13 (760ebbd, "Restore Grok-buildable Control Plane app matching the live site"). That rebuild copied the UI labels and section lists. It did not copy the pack JSON, which most likely stayed in the Grok App Builder workspace that produced the receipts and was never exported to GitHub. The next place to look is that Grok project's files, or a fresh "Export to GitHub" of it.

No pack content was written here, because writing it from memory would invent pack data.
