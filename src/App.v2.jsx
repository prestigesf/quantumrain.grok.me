import { useMemo, useRef, useState } from "react";
import {
  LIVE_HEAD,
  BUNDLE_SHA,
  STRENGTH_CHAIN,
  runGlassId,
  loadDroppedFile,
  allCompiledGlass,
  satisfiedControls,
} from "./engine/client.js";

const PIN = "ead75ac1e016";
const HOST = "prestigesf-the-engine";
const LIVE_HASH = "9999656c896009545a9c778b72191907f0f71d221f3dbcec1f000547c5e63681";

function receiptId() {
  return Math.random().toString(16).slice(2, 10);
}

export default function App() {
  const catalog = useMemo(() => allCompiledGlass(), []);
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
    `HOST  DeadlineSF engine.mjs  bundle ${BUNDLE_SHA.slice(0, 12)}`,
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
