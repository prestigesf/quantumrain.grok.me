# What you are looking at on QuantumRain

You built QuantumRain so you can drop a pack and watch a measurement.

## Drop pack

The page has an array of packs in `src/App.jsx`.

Drop pack does this:

1. Move to the next item in that array.
2. Show that pack’s id, name, and sections on the left.
3. Write `PACK loaded …` in the stream.

That is how PQC, Frontier, QBOM, and SBOM show up one after another.

## Intercept

Intercept does this:

1. Read the pack that is currently showing.
2. Write a delta line: pack id, result, score, receipt id.
3. Write `RUN …` in the stream.

On the current site the result is always `VALIDATED_NO_CHANGE` and the score stays `100 → 100`. That is the page recording “this pack was selected and intercept was pressed.”

## Why the number does not jump

The 100 on the glass is the last LIVE head from the engine ledger (EVIDENCE-REPLAY).

The click does not load `lawpacks/cbom.yaml` into DeadlineSF’s Decision API from the browser. So QBOM and SBOM appearing on the list is real inventory. The click is not yet a new ledger receipt.

## What “stronger” would look like

A later Intercept that talks to the engine would return one of:

- `IMPROVED` and a higher score
- `VALIDATED_NO_CHANGE` and the same score
- `REGRESSED` if a test broke

Until that wire exists, Intercept is the operator log on the glass.
