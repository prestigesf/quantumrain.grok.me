# quantumrain.grok.me

**PACK IN → DELTA OUT**

Public operator face for the PrestigeSF Engine Console. Drop a law pack. Watch the engine strength score move. A run is not done until it produces a measurable hardening delta or a signed `VALIDATED_NO_CHANGE` receipt.

This repository is the *face*. The fully wired console — DeadlineSF Decision API, compiled packs, Engine Hardening Layer, frozen receipts — stays in the private repo `prestigesf/the-engine-`. That repo must stay private. Do not vendor engines here.

## Loop

```
ENGINE → PACK → BEFORE STATE → RUN → NATIVE OUTPUT
  → AFTER STATE → HARDENING LAYER → DELTA OUT
  → STRENGTH SCORE → RECEIPT → LEDGER
```

| Result | Meaning |
| --- | --- |
| `IMPROVED` | Measured structural delta. Not declared. |
| `VALIDATED_NO_CHANGE` | Completeness gate passed. No invented improvement. |
| `REGRESSED` | Overrides improvement. |

## Local

```bash
python3 -m http.server 8080
```

Static site. Operator runs persist in the browser.

## What this is not

- Not a rewrite of DeadlineSF
- Not a rewrite of law packs
- Not the private hardening library
- Not a physics explainer (that was a wrong first fill)
