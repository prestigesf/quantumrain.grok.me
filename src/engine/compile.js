/** Normalize DeadlineSF YAML-shaped packs into engine.mjs pack objects. */

export function conditionFromYaml(node) {
  if (!node || typeof node !== "object") return null;
  if (node.all_of) return { combinator: "all_of", children: node.all_of.map(conditionFromYaml) };
  if (node.any_of) return { combinator: "any_of", children: node.any_of.map(conditionFromYaml) };
  if (node.none_of) return { combinator: "none_of", children: node.none_of.map(conditionFromYaml) };
  if (node.combinator) {
    return { combinator: node.combinator, children: (node.children || []).map(conditionFromYaml) };
  }
  if (node.fact) return { fact: node.fact, op: node.op || "truthy", value: node.value };
  return null;
}

export function compilePack(raw) {
  if (!raw || !raw.law_id) throw new Error("pack needs law_id");
  return {
    law_id: String(raw.law_id),
    version: String(raw.version || "1.0.0"),
    title: String(raw.title || raw.law_id),
    jurisdiction: String(raw.jurisdiction || ""),
    citation: String(raw.citation || ""),
    effective_date: raw.effective_date || null,
    metadata: raw.metadata || {},
    applicability: conditionFromYaml(raw.applicability),
    requirements: (raw.requirements || []).map((r) => ({
      id: String(r.id || r.requirement_id || ""),
      title: String(r.title || ""),
      citation: String(r.citation || ""),
      description: String(r.description || ""),
      applies_when: conditionFromYaml(r.applies_when),
      depends_on: r.depends_on || [],
      controls: (r.controls || []).map((c) => ({
        control_id: String(c.control_id || ""),
        title: String(c.title || ""),
        description: String(c.description || ""),
      })),
    })),
  };
}

/** Tiny YAML subset for law packs (maps, lists, |/> folded strings). */
export function parsePackText(text, filename = "pack.yaml") {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return compilePack(JSON.parse(trimmed));
  }
  return compilePack(parseYamlReliable(trimmed));
}

function parseSimpleYaml(src) {
  const lines = src.replace(/\t/g, "  ").split(/\r?\n/);
  const root = {};
  const stack = [{ indent: -1, obj: root, key: null, list: false }];

  function current() {
    return stack[stack.length - 1];
  }

  for (let raw of lines) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const indent = raw.match(/^ */)[0].length;
    let line = raw.slice(indent);
    while (stack.length > 1 && indent <= current().indent) stack.pop();
    const ctx = current();

    if (line.startsWith("- ")) {
      const rest = line.slice(2);
      if (!Array.isArray(ctx.obj[ctx.key]) && ctx.key) {
        // list under key already created
      }
      let list = ctx.listHolder;
      if (!list) {
        if (ctx.key && Array.isArray(ctx.obj[ctx.key])) list = ctx.obj[ctx.key];
        else throw new Error(`list without key near: ${line}`);
      }
      if (rest.includes(": ")) {
        const item = {};
        const idx = rest.indexOf(": ");
        const k = rest.slice(0, idx);
        let v = rest.slice(idx + 2);
        item[k] = parseScalar(v);
        list.push(item);
        stack.push({ indent, obj: item, key: null, list: false });
      } else if (rest.endsWith(":")) {
        const item = {};
        list.push(item);
        const k = rest.slice(0, -1);
        item[k] = {};
        stack.push({ indent, obj: item, key: k, list: false });
      } else {
        list.push(parseScalar(rest));
      }
      continue;
    }

    if (line.endsWith(":") || line.endsWith(": |") || line.endsWith(": >") || line.endsWith(": >-") || line.endsWith(": |-")) {
      const folded = /:\s*[|>]-?\s*$/.test(line);
      const key = line.replace(/:\s*[|>]-?\s*$/, "").replace(/:$/, "");
      ctx.obj[key] = folded ? "" : {};
      if (folded) {
        const buf = [];
        // collect following more-indented lines as string
        // handled below by peek — simpler: mark key as string builder
        ctx.obj[key] = collectFolded(lines, lines.indexOf(raw) + 1, indent);
        // skip those lines: mutate index by storing skip - do in second pass
      }
      if (!folded) {
        // peek next non-empty
        stack.push({ indent, obj: ctx.obj, key, list: false, listHolder: undefined });
      }
      continue;
    }

    const idx = line.indexOf(": ");
    if (idx === -1) {
      if (line.endsWith(":")) {
        const key = line.slice(0, -1);
        ctx.obj[key] = {};
        stack.push({ indent, obj: ctx.obj, key, list: false });
      }
      continue;
    }
    const key = line.slice(0, idx);
    const val = parseScalar(line.slice(idx + 2));
    ctx.obj[key] = val;
  }

  // Rebuild with a more reliable parser below
  return parseYamlReliable(src);
}

function collectFolded() {
  return "";
}

function parseScalar(v) {
  const s = v.trim();
  if (s === "true") return true;
  if (s === "false") return false;
  if (s === "null" || s === "~") return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

function parseYamlReliable(src) {
  // Indent-stack parser that supports folded blocks and list-of-maps.
  const lines = src.replace(/\t/g, "  ").split(/\r?\n/);
  const root = {};
  const stack = [{ indent: -1, container: root, kind: "map" }];
  let i = 0;

  function peekIndent(n) {
    while (n < lines.length && (!lines[n].trim() || lines[n].trim().startsWith("#"))) n++;
    if (n >= lines.length) return -1;
    return lines[n].match(/^ */)[0].length;
  }

  while (i < lines.length) {
    const raw = lines[i];
    i++;
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const indent = raw.match(/^ */)[0].length;
    const line = raw.slice(indent);
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const top = stack[stack.length - 1];

    if (line.startsWith("- ")) {
      const rest = line.slice(2);
      if (!Array.isArray(top.container)) throw new Error("dash outside list: " + line);
      if (!rest.includes(":") && !rest.endsWith(":")) {
        top.container.push(parseScalar(rest));
        continue;
      }
      const item = {};
      top.container.push(item);
      if (rest.endsWith(":") || /:\s*[|>]/.test(rest)) {
        const key = rest.replace(/:\s*[|>]-?\s*$/, "").replace(/:$/, "");
        const next = peekIndent(i);
        if (/:\s*[|>]/.test(rest)) {
          const { text, nextIndex } = readBlock(lines, i, indent);
          item[key] = text;
          i = nextIndex;
        } else if (next > indent) {
          const childIsList = lines.find((l, idx) => idx >= i - 1 && l.trim() && !l.trim().startsWith("#") && idx >= i)?.trim().startsWith("- ");
          // look at next real line
          let n = i;
          while (n < lines.length && (!lines[n].trim() || lines[n].trim().startsWith("#"))) n++;
          const nxt = n < lines.length ? lines[n].trim() : "";
          if (nxt.startsWith("- ")) {
            item[key] = [];
            stack.push({ indent, container: item[key], kind: "list" });
          } else {
            item[key] = {};
            stack.push({ indent, container: item[key], kind: "map" });
          }
        } else {
          item[key] = null;
        }
      } else {
        const c = rest.indexOf(": ");
        item[rest.slice(0, c)] = parseScalar(rest.slice(c + 2));
        stack.push({ indent, container: item, kind: "map" });
      }
      continue;
    }

    const block = line.match(/^([^:]+):\s*([|>]-?)\s*$/);
    if (block) {
      const key = block[1];
      const { text, nextIndex } = readBlock(lines, i, indent);
      setKey(top, key, text);
      i = nextIndex;
      continue;
    }

    if (line.endsWith(":") && !line.includes(": ")) {
      const key = line.slice(0, -1);
      let n = i;
      while (n < lines.length && (!lines[n].trim() || lines[n].trim().startsWith("#"))) n++;
      const nxt = n < lines.length ? lines[n] : "";
      const nxtIndent = nxt ? nxt.match(/^ */)[0].length : -1;
      if (nxtIndent <= indent) {
        setKey(top, key, {});
        continue;
      }
      const childList = nxt.trim().startsWith("- ");
      const child = childList ? [] : {};
      setKey(top, key, child);
      stack.push({ indent, container: child, kind: childList ? "list" : "map" });
      continue;
    }

    const c = line.indexOf(": ");
    if (c !== -1) setKey(top, line.slice(0, c), parseScalar(line.slice(c + 2)));
  }
  return root;
}

function setKey(top, key, value) {
  if (Array.isArray(top.container)) return;
  top.container[key] = value;
}

function readBlock(lines, start, parentIndent) {
  const parts = [];
  let i = start;
  while (i < lines.length) {
    const raw = lines[i];
    if (!raw.trim()) {
      parts.push("");
      i++;
      continue;
    }
    const indent = raw.match(/^ */)[0].length;
    if (indent <= parentIndent) break;
    parts.push(raw.slice(parentIndent + 2));
    i++;
  }
  return { text: parts.join(" ").replace(/\s+/g, " ").trim(), nextIndex: i };
}
