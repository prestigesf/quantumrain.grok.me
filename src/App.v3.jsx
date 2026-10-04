import { useMemo, useRef, useState } from "react";
import {
  LIVE_HEAD,
  BUNDLE_SHA,
  STRENGTH_CHAIN,
  runGlassId,
  loadDroppedFile,
  allCompiledGlass,
  satisfiedControls,
  PACKS_COMMIT,
} from "./engine/client.v2.js";

// App.v3.jsx — added 2026-10-04. App.v2 on the 15-pack DeadlineSF bundle (deadlinesf@ad10d68),
// plus the live site's pack inventory kept word for word. App.jsx and App.v2.jsx are unchanged.

// Live site inventory (quantumrain.grok.me, pack-inventory chunk as served 2026-10-04). Kept as-is.
const LIVE_INVENTORY = {
  engine_wording: "11 registered engines",
  pack_wording: "14 active compliance/control packs",
  breakdown_wording: "3 newly executed through Prestige Engine · 11 pre-existing mapped packs",
  executed: [
    { id: "PACK-11-DGCL-GOV", label: "PACK-11-DGCL-GOV", kind: "statute" },
    { id: "PACK-01-HIPAA-HITECH", label: "PACK-01-HIPAA-HITECH", kind: "regulation" },
    { id: "PACK-02-NACHA-REGE", label: "PACK-02-NACHA-REGE", kind: "standard" },
  ],
  mapped: [
    { id: "CA-AB-2013", label: "California AB 2013", kind: "statute" },
    { id: "CA-SB-942", label: "California SB 942", kind: "statute" },
    { id: "EU-AI-ACT-ART-50", label: "EU AI Act Article 50", kind: "regulation" },
    { id: "ANSI-X12-837-835", label: "ANSI X12 837/835", kind: "standard" },
    { id: "NIST-PQC-FIPS-203-204", label: "NIST PQC Migration — FIPS 203/FIPS 204", kind: "standard" },
    { id: "SOC2-TYPE-II", label: "SOC 2 Type II", kind: "framework" },
    { id: "FCRA-FAIR-LENDING", label: "FCRA/Fair Lending", kind: "statute" },
    { id: "CA-CCPA-CPRA", label: "California CCPA/CPRA", kind: "statute" },
    { id: "GLBA-SAFEGUARDS", label: "GLBA Safeguards Rule", kind: "regulation" },
    { id: "PCI-DSS-4.0", label: "PCI-DSS 4.0", kind: "standard" },
    { id: "USPTO-ALICE", label: "USPTO 35 U.S.C. §§101/102/103 and Alice guidance", kind: "guidance" },
  ],
};

// Glass entries from App.jsx (760ebbd). Their pack JSON files are not in GitHub (see docs/PACK-XX-SOURCES.md),
// so Intercept on them reports NOT_IN_DEADLINESF_BUNDLE instead of inventing a result.
const GLASS = [
  { id: "PACK-11-DGCL-GOV", name: "Delaware General Corporation Law (DGCL)", file: "PACK-11-DGCL-GOV.json", sections: ["§141(a)", "§151", "§152", "§153", "§228", "§242", "§262", "§145"] },
  { id: "PACK-01-HIPAA-HITECH", name: "HIPAA / HITECH", file: "PACK-01-HIPAA-HITECH.json", sections: ["164.308", "164.312", "164.316", "13402"] },
  { id: "PACK-02-NACHA-REGE", name: "PACK-02-NACHA-REGE", file: "PACK-02-NACHA-REGE.json", sections: [] },
];

const PIN = "ead75ac1e016";
const HOST = "prestigesf-the-engine";
const LIVE_HASH = "9999656c896009545a9c778b72191907f0f71d221f3dbcec1f000547c5e63681";

function receiptId() {
  return Math.random().toString(16).slice(2, 10);
}

export default function App() {
  const catalog = useMemo(() => allCompiledGlass().concat(GLASS), []);
  const [extras, setExtras] = useState([]);
  const packs = catalog.concat(extras);
  const [packIndex, setPackIndex] = useState(
    Math.max(0, catalog.findIndex((p) => p.id === "cyclonedx-cbom-1.6")),
  );
  const [rain, setRain] = useState(true);
  const [paused, setPaused] = useState(false);
  const [evidenceOn, setEvidenceOn] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const fileRef = useRef(null);
  const [stream, setStream] = useState([
    "LIVE  QuantumRain operator console",
    `HOST  DeadlineSF engine.mjs  bundle ${BUNDLE_SHA.slice(0, 12)}  packs ${PACKS_COMMIT}`,
    "DROP  cycle compiled packs or Drop file your YAML",
    "INT   Intercept = engine.decide on this pack",
  ]);
  const [delta, setDelta] = useState("Load a pack. Intercept to grade it.");
  const pack = packs[packIndex] || catalog[0];
  const drops = useMemo(
    () => Array.from({ length: 48 }, (_, i) => ({ left: `${(i * 17) % 100}%`, delay: `${(i % 12) * 0.22}s`, dur: `${1.4 + (i % 7) * 0.18}s` })),
    [],
  );
  function push(line) {
    setStream((s) => [line, ...s].slice(0, 24));
  }
  function intercept() {
    const controls = evidenceOn ? satisfiedControls(pack.compiled) : [];
    const result = runGlassId(pack.id, pack.compiled, controls);
    const s = result.strength;
    const rid = `edr_${receiptId()}`;
    const line = `${result.law_id} · ${result.outcome} · ${result.applicability} · ${s.score_before} → ${s.score_after} (Δ ${s.change}) · ${rid}`;
    setDelta(line);
    const row = { id: rid, evidence: evidenceOn, ...result };
    setReceipts((r) => [row, ...r].slice(0, 40));
    try {
      localStorage.setItem("qr-receipts", JSON.stringify([row, ...receipts].slice(0, 50)));
    } catch {
      /* ignore */
    }
    push(`RUN   ${result.law_id}  ${result.outcome}`);
    push(`APP   ${result.applicability}  Δ ${s.change}`);
    if (result.reasons[0]) push(`WHY   ${result.reasons[0].code}`);
  }
  function dropPack() {
    const next = (packIndex + 1) % packs.length;
    setPackIndex(next);
    setEvidenceOn(false);
    push(`PACK  loaded ${packs[next].id}`);
  }
  async function onFile(ev) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    try {
      const compiled = loadDroppedFile(await file.text(), file.name);
      const item = {
        id: compiled.law_id,
        name: compiled.title,
        file: file.name,
        sections: (compiled.requirements || []).map((r) => r.id).slice(0, 8),
        compiled,
      };
      setExtras((xs) => [item, ...xs]);
      setPackIndex(catalog.length);
      setEvidenceOn(false);
      push(`PACK  dropped ${compiled.law_id} (${compiled.requirements.length} reqs)`);
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
            <small>PACK IN → ENGINE.DECIDE → DELTA</small>
          </div>
        </div>
        <div className="pills">
          <span>{LIVE_HEAD} / 100 ledger</span>
          <span>{packs.length} PACKS</span>
          <span>{receipts.length} RECEIPTS</span>
        </div>
      </header>
      <button className="rain-btn" type="button" onClick={() => setRain((v) => !v)}>
        {rain ? "Mute rain" : "Tap for rain"}
      </button>
      <aside className="console">
        <p className="kicker">Operator</p>
        <h1>Drop the law pack.</h1>
        <p className="pack-id">{pack.id} · {pack.name}</p>
        <p className="file">{pack.file}</p>
        <ul className="secs">{(pack.sections || []).map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="actions">
          <button className="primary" type="button" onClick={intercept}>Intercept</button>
          <button type="button" onClick={dropPack}>Drop pack</button>
          <button type="button" onClick={() => fileRef.current?.click()}>Drop file</button>
          <input ref={fileRef} type="file" accept=".yaml,.yml,.json" hidden onChange={onFile} />
          <button type="button" onClick={() => setEvidenceOn((v) => !v)}>
            {evidenceOn ? "Evidence ON" : "Evidence off"}
          </button>
          <button type="button" onClick={() => setPaused((v) => !v)}>{paused ? "Resume" : "Pause"}</button>
        </div>
        <p className="hint">
          Drop pack cycles every compiled DeadlineSF pack. Drop file is your YAML.
          Intercept runs engine.decide. Evidence ON pretends every control is SATISFIED so you can see ALLOW vs HUMAN_REVIEW.
        </p>
        <p className="kicker" style={{ marginTop: 22 }}>Strength ledger</p>
        {STRENGTH_CHAIN.map((row) => (
          <p key={row.pack_id} className="stat">{row.pack_id} {row.score_before}→{row.score_after} Δ{row.change}</p>
        ))}
        <p className="kicker" style={{ marginTop: 16 }}>Inventory</p>
        <p className="stat">{LIVE_INVENTORY.engine_wording}</p>
        <p className="stat">{LIVE_INVENTORY.pack_wording}</p>
        <p className="stat">{LIVE_INVENTORY.breakdown_wording}</p>
        <p className="kicker" style={{ marginTop: 10 }}>Newly executed through Prestige Engine</p>
        {LIVE_INVENTORY.executed.map((p) => <p key={p.id} className="stat">{p.label}</p>)}
        <p className="kicker" style={{ marginTop: 10 }}>Pre-existing mapped packs</p>
        {LIVE_INVENTORY.mapped.map((p) => <p key={p.id} className="stat">{p.label}</p>)}
        <p className="kicker" style={{ marginTop: 16 }}>Compiled packs</p>
        {packs.map((p) => (
          <p key={p.id + p.file} className="stat">{p.id}</p>
        ))}
      </aside>
      <section className="right">
        <div className="card">
          <p className="kicker">Engine delta</p>
          <p>{delta}</p>
        </div>
        <div className="card">
          <p className="kicker">Your receipts this session</p>
          {receipts.length === 0 ? <p className="muted">None yet. Intercept writes one.</p> : null}
          {receipts.map((r) => (
            <p key={r.id} className="stat">{r.law_id} {r.outcome} {r.applicability}</p>
          ))}
        </div>
        <div className="card">
          <p className="kicker">Stream</p>
          <p className="mono pin">ENGINE {HOST} {PIN}<br />BUNDLE {BUNDLE_SHA.slice(0, 16)}… ledger {LIVE_HEAD}/100</p>
          <ol>{stream.map((line, i) => <li key={i}>{line}</li>)}</ol>
        </div>
      </section>
    </div>
  );
}
