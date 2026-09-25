import { useMemo, useRef, useState } from "react";
import { LIVE_HEAD, BUNDLE_SHA, STRENGTH_CHAIN, runGlassId, loadDroppedFile } from "./engine/client.js";

const PIN = "ead75ac1e016";
const HOST = "prestigesf-the-engine";
const LIVE_HASH = "9999656c896009545a9c778b72191907f0f71d221f3dbcec1f000547c5e63681";
const EXECUTED = [
  "PACK-11-DGCL-GOV",
  "PACK-01-HIPAA-HITECH",
  "PACK-02-NACHA-REGE",
  "PQC-FIPS204",
  "FRONTIER-TC37-46",
  "QBOM-CBOM-16",
  "SBOM-CISA-2026",
  "SBOM-QBOM",
];
const MAPPED = [
  "California AB 2013",
  "California SB 942",
  "EU AI Act Article 50",
  "ANSI X12 837/835",
  "NIST PQC Migration — FIPS 203/FIPS 204",
  "SOC 2 Type II",
  "FCRA/Fair Lending",
  "California CCPA/CPRA",
  "GLBA Safeguards Rule",
  "PCI-DSS 4.0",
  "USPTO 35 U.S.C. §§101/102/103 and Alice guidance",
];
const PACKS = [
  { id: "PACK-11-DGCL-GOV", name: "Delaware General Corporation Law (DGCL)", file: "PACK-11-DGCL-GOV.json", sections: ["§141(a)", "§151", "§152", "§153", "§228", "§242", "§262", "§145"], delta: 0 },
  { id: "PACK-01-HIPAA-HITECH", name: "HIPAA / HITECH", file: "PACK-01-HIPAA-HITECH.json", sections: ["164.308", "164.312", "164.316", "13402"], delta: 0 },
  { id: "AB2013", name: "California AB 2013", file: "AB2013.json", sections: ["Civ. Code 3110", "training-data", "public CA"], delta: 0 },
  { id: "PQC-FIPS204", name: "NIST PQC — FIPS 203/204", file: "PQC-FIPS204.json", sections: ["ML-KEM", "ML-DSA-65", "EO 14412"], delta: 0 },
  { id: "FRONTIER-TC37-46", name: "Adversarial Frontier TC-37..TC-46", file: "FRONTIER-TC37-46.json", sections: ["TC-37", "TC-46", "c7f4b91c"], delta: 0 },
  { id: "QBOM-CBOM-16", name: "QBOM / CycloneDX 1.6 CBOM", file: "QBOM-CBOM-16.json", sections: ["cryptographic-asset", "nistQuantumSecurityLevel", "ML-KEM / ML-DSA"], delta: 0 },
  { id: "SBOM-CISA-2026", name: "SBOM — CISA 2026 Minimum Elements", file: "SBOM-CISA-2026.json", sections: ["Component Producer", "Component Hash", "SBOM Tool Name"], delta: 0 },
  { id: "SBOM-QBOM", name: "SBOM + QBOM joint release", file: "SBOM-QBOM.json", sections: ["same release", "crypto-to-component", "no secrets"], delta: 0 },
];

function receiptId() {
  return Math.random().toString(16).slice(2, 10);
}

export default function App() {
  const [packIndex, setPackIndex] = useState(0);
  const [rain, setRain] = useState(true);
  const [paused, setPaused] = useState(false);
  const [score] = useState(LIVE_HEAD);
  const [dropped, setDropped] = useState(null);
  const fileRef = useRef(null);
  const [stream, setStream] = useState([
    "LIVE  PrestigeSF Control Plane  rain on the glass",
    `HOST  DeadlineSF engine.mjs  bundle ${BUNDLE_SHA.slice(0, 12)}`,
    "WAIT  Intercept runs the loaded pack through engine.decide",
    "DROP  use Drop file to load your own YAML",
  ]);
  const [delta, setDelta] = useState("No live run yet. Intercept to run engine.decide on the loaded pack.");
  const pack = dropped || PACKS[packIndex];
  const drops = useMemo(
    () => Array.from({ length: 48 }, (_, i) => ({ left: `${(i * 17) % 100}%`, delay: `${(i % 12) * 0.22}s`, dur: `${1.4 + (i % 7) * 0.18}s` })),
    [],
  );
  function push(line) { setStream((s) => [line, ...s].slice(0, 24)); }
  function intercept() {
    const result = runGlassId(pack.id, pack.compiled);
    const s = result.strength;
    const rid = `edr_${receiptId()}`;
    const line = `${result.law_id} · ${result.outcome} · ${result.applicability} · ${s.score_before} → ${s.score_after} (Δ ${s.change}) · ${rid}`;
    setDelta(line);
    try {
      const log = JSON.parse(localStorage.getItem("qr-receipts") || "[]");
      log.unshift({ id: rid, ...result });
      localStorage.setItem("qr-receipts", JSON.stringify(log.slice(0, 50)));
    } catch {
      /* ignore */
    }
    push(`RUN   ${result.law_id}  ${result.outcome}  ${s.score_before}→${s.score_after}`);
    push(`APP   ${result.applicability}`);
    if (result.reasons[0]) push(`WHY   ${result.reasons[0].code}`);
    push("WAIT  drop a pack or intercept");
  }
  function dropPack() {
    setDropped(null);
    const next = (packIndex + 1) % PACKS.length;
    setPackIndex(next);
    push(`PACK  loaded ${PACKS[next].id}`);
    push("WAIT  intercept to measure");
  }
  async function onFile(ev) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const compiled = loadDroppedFile(text, file.name);
      setDropped({
        id: compiled.law_id,
        name: compiled.title,
        file: file.name,
        sections: (compiled.requirements || []).map((r) => r.id).slice(0, 8),
        compiled,
      });
      push(`PACK  dropped ${compiled.law_id} (${compiled.requirements.length} requirements)`);
      push("WAIT  intercept to run engine.decide");
    } catch (err) {
      push(`ERR   ${err.message || String(err)}`);
    }
  }
  return (
    <div className="stage">
      {rain && !paused ? (
        <div className="rain" aria-hidden="true">
          {drops.map((d, i) => (
            <span key={i} style={{ left: d.left, animationDelay: d.delay, animationDuration: d.dur }} />
          ))}
        </div>
      ) : null}
      <header className="bar">
        <div className="brand">
          <span className="tri" aria-hidden="true" />
          <div>
            <b>PrestigeSF Control Plane</b>
            <small>PACK IN → REAL ENGINE → DELTA</small>
          </div>
        </div>
        <div className="pills">
          <span>{score} / 100</span>
          <span>DRIFT NONE</span>
          <span>V2 BENCH</span>
          <span>11 ENGINES</span>
          <span>17 PACKS</span>
        </div>
      </header>
      <button className="rain-btn" type="button" onClick={() => setRain((v) => !v)}>
        {rain ? "Mute rain" : "Tap for rain"}
      </button>
      <aside className="console">
        <p className="kicker">Left console</p>
        <h1>Drop the law pack.</h1>
        <p className="pack-id">{pack.id} · {pack.name}</p>
        <p className="file">{HOST} · {pack.file}</p>
        <ul className="secs">{pack.sections.map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="actions">
          <button className="primary" type="button" onClick={intercept}>Intercept</button>
          <button type="button" onClick={dropPack}>Drop pack</button>
          <button type="button" onClick={() => fileRef.current?.click()}>Drop file</button>
          <input ref={fileRef} type="file" accept=".yaml,.yml,.json" hidden onChange={onFile} />
          <button type="button" onClick={() => setPaused((v) => !v)}>{paused ? "Resume" : "Pause"}</button>
        </div>
        <p className="hint">Intercept runs engine.decide from DeadlineSF engine.mjs. Drop file loads your YAML. Strength chain is the engine ledger; a new pack at 100 does not invent points.</p>
        <p className="kicker" style={{ marginTop: 22 }}>Inventory</p>
        <p className="stat">11 registered engines</p>
        <p className="stat">17 active compliance/control packs</p>
        <p className="muted">8 newly executed through Prestige Engine · 11 pre-existing mapped packs</p>
        <p className="kicker" style={{ marginTop: 16 }}>Strength ledger</p>
        {STRENGTH_CHAIN.map((row) => (
          <p key={row.pack_id} className="stat">{row.pack_id} {row.score_before}→{row.score_after} Δ{row.change}</p>
        ))}
        {EXECUTED.map((id) => <p key={id} className="stat">{id}</p>)}
        <p className="kicker" style={{ marginTop: 16 }}>Pre-existing mapped packs</p>
        {MAPPED.map((name) => <p key={name} className="muted">{name}</p>)}
      </aside>
      <section className="right">
        <div className="card">
          <p className="kicker">Engine delta</p>
          <p>{delta}</p>
        </div>
        <div className="card">
          <p className="kicker">Stream</p>
          <p className="mono pin">ENGINE PINNED {HOST} {PIN}<br />LIVE STATE {LIVE_HASH.slice(0, 16)}… score {score}/100</p>
          <ol>{stream.map((line, i) => <li key={i}>{line}</li>)}</ol>
        </div>
      </section>
    </div>
  );
}
