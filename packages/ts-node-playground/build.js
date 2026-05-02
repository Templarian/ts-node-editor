'use strict';
const fs = require('fs');
const path = require('path');
const { parseScript } = require('../ts-node-parser/dist/index.js');

const scriptsDir = path.resolve(__dirname, '../../src/scripts');
const outFile = path.resolve(__dirname, 'index.html');

const scriptFiles = fs.readdirSync(scriptsDir)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.spec.ts') && f !== 'verify.ts')
    .sort();

const scripts = scriptFiles.map(f => {
    const src = fs.readFileSync(path.join(scriptsDir, f), 'utf-8');
    return parseScript(src, f);
});

const scriptsJson = JSON.stringify(scripts);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ts-node Playground</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #0f1117; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; }

  header { background: #1a1d2e; border-bottom: 1px solid #2d3148; padding: 12px 20px; display: flex; align-items: center; gap: 12px; }
  header h1 { font-size: 16px; font-weight: 600; color: #7c8cf8; letter-spacing: 0.5px; }
  select { background: #252840; color: #e2e8f0; border: 1px solid #3d4270; border-radius: 6px; padding: 6px 10px; font-size: 14px; cursor: pointer; outline: none; }
  select:focus { border-color: #7c8cf8; }

  .layout { display: flex; flex: 1; gap: 0; overflow: hidden; }

  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .script-info { padding: 12px 20px; background: #13162a; border-bottom: 1px solid #2d3148; }
  .script-info .name { font-size: 13px; font-weight: 600; color: #7c8cf8; margin-bottom: 2px; }
  .script-info .desc { font-size: 12px; color: #94a3b8; }

  .history { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }

  .card { border-radius: 10px; border: 1px solid #2d3148; padding: 14px 16px; background: #1a1d2e; }
  .card.past { opacity: 0.45; }
  .card.current { border-color: #7c8cf8; background: #1e2244; }
  .card.done { border-color: #34d399; background: #0d2e24; opacity: 0.8; }
  .card.error-card { border-color: #f87171; background: #2e1414; }

  .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-coinFlip      { background: #7c3aed22; color: #c4b5fd; border: 1px solid #7c3aed55; }
  .badge-dialog        { background: #0369a122; color: #7dd3fc; border: 1px solid #0369a155; }
  .badge-dialogChoice  { background: #05966922; color: #6ee7b7; border: 1px solid #05966955; }
  .badge-random        { background: #dc262622; color: #fca5a5; border: 1px solid #dc262655; }
  .badge-randomChoice  { background: #ea580c22; color: #fdba74; border: 1px solid #ea580c55; }
  .badge-get           { background: #0891b222; color: #67e8f9; border: 1px solid #0891b255; }
  .badge-set           { background: #b4530022; color: #fdba74; border: 1px solid #b4530055; }
  .badge-add           { background: #05966922; color: #6ee7b7; border: 1px solid #05966955; }
  .badge-subtract      { background: #e11d4822; color: #fda4af; border: 1px solid #e11d4855; }
  .badge-multiply      { background: #7c3aed22; color: #c4b5fd; border: 1px solid #7c3aed55; }
  .badge-divide        { background: #0369a122; color: #7dd3fc; border: 1px solid #0369a155; }
  .badge-unset         { background: #47556922; color: #94a3b8; border: 1px solid #47556955; }
  .badge-conditional      { background: #d9770622; color: #fb923c; border: 1px solid #d9770655; }
  .badge-conditionalGet   { background: #0891b222; color: #67e8f9; border: 1px solid #0891b255; }
  .badge-and              { background: #1d4ed822; color: #93c5fd; border: 1px solid #1d4ed855; }
  .badge-or               { background: #7e22ce22; color: #d8b4fe; border: 1px solid #7e22ce55; }
  .badge-greaterThan      { background: #05966922; color: #6ee7b7; border: 1px solid #05966955; }
  .badge-greaterThanOrEqual { background: #05966922; color: #6ee7b7; border: 1px solid #05966955; }
  .badge-lessThan         { background: #be123c22; color: #fda4af; border: 1px solid #be123c55; }
  .badge-lessThanOrEqual  { background: #be123c22; color: #fda4af; border: 1px solid #be123c55; }
  .badge-equalTo          { background: #71717122; color: #d4d4d8; border: 1px solid #71717155; }
  .badge-notEqualTo       { background: #71717122; color: #d4d4d8; border: 1px solid #71717155; }
  .badge-between          { background: #0369a122; color: #7dd3fc; border: 1px solid #0369a155; }
  .badge-contains         { background: #92400022; color: #fcd34d; border: 1px solid #92400055; }
  .badge-startsWith       { background: #92400022; color: #fcd34d; border: 1px solid #92400055; }
  .badge-endsWith         { background: #92400022; color: #fcd34d; border: 1px solid #92400055; }
  .badge-in               { background: #92400022; color: #fcd34d; border: 1px solid #92400055; }
  .badge-match            { background: #92400022; color: #fcd34d; border: 1px solid #92400055; }
  .badge-empty            { background: #47556922; color: #94a3b8; border: 1px solid #47556955; }
  .badge-notEmpty         { background: #47556922; color: #94a3b8; border: 1px solid #47556955; }
  .badge-isSet            { background: #47556922; color: #94a3b8; border: 1px solid #47556955; }
  .badge-isNotSet         { background: #47556922; color: #94a3b8; border: 1px solid #47556955; }
  .badge-isTrue           { background: #16a34a22; color: #86efac; border: 1px solid #16a34a55; }
  .badge-isFalse          { background: #dc262622; color: #fca5a5; border: 1px solid #dc262655; }
  .badge-log           { background: #71717122; color: #d4d4d8; border: 1px solid #71717155; }
  .badge-include       { background: #92400022; color: #fcd34d; border: 1px solid #92400055; }
  .badge-end           { background: #16a34a22; color: #86efac; border: 1px solid #16a34a55; }
  .badge-default       { background: #33333322; color: #aaa; border: 1px solid #44444455; }
  .node-id { font-size: 11px; color: #64748b; }

  .card-body { font-size: 13px; display: flex; flex-direction: column; gap: 6px; }
  .card-body .row { display: flex; gap: 6px; }
  .card-body .label { color: #64748b; min-width: 80px; font-size: 12px; }
  .card-body .val { color: #e2e8f0; word-break: break-all; }
  .card-body .val.mono { font-family: monospace; color: #93c5fd; }
  .card-body .outcome { color: #7c8cf8; font-style: italic; font-size: 12px; margin-top: 4px; }

  .choices { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .choice-btn { background: #252840; color: #e2e8f0; border: 1px solid #3d4270; border-radius: 8px; padding: 8px 16px; font-size: 13px; cursor: pointer; transition: all 0.15s; }
  .choice-btn:hover { background: #7c8cf8; border-color: #7c8cf8; color: #fff; }

  .action-bar { display: flex; gap: 8px; margin-top: 10px; }
  .btn { padding: 7px 16px; border-radius: 7px; font-size: 13px; cursor: pointer; border: none; font-weight: 500; transition: all 0.15s; }
  .btn-primary { background: #7c8cf8; color: #fff; }
  .btn-primary:hover { background: #6370e8; }
  .btn-reset { background: #252840; color: #94a3b8; border: 1px solid #3d4270; }
  .btn-reset:hover { background: #3d4270; color: #e2e8f0; }

  .arg-input { background: #0f1117; border: 1px solid #3d4270; color: #e2e8f0; border-radius: 6px; padding: 5px 8px; font-size: 13px; width: 100%; font-family: monospace; outline: none; }
  .arg-input:focus { border-color: #7c8cf8; }

  .side { width: 260px; border-left: 1px solid #2d3148; background: #13162a; display: flex; flex-direction: column; overflow: hidden; }
  .side h2 { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; padding: 12px 16px; border-bottom: 1px solid #2d3148; }
  .state-list { flex: 1; overflow-y: auto; padding: 10px 16px; font-size: 13px; }
  .state-empty { color: #475569; font-style: italic; font-size: 12px; padding: 8px 0; }
  .state-item { display: flex; flex-direction: column; padding: 6px 0; border-bottom: 1px solid #1e2244; }
  .state-key { color: #64748b; font-size: 11px; margin-bottom: 1px; }
  .state-val { color: #7dd3fc; font-family: monospace; word-break: break-all; }
</style>
</head>
<body>
<header>
  <h1>ts-node playground</h1>
  <select id="scriptSelect"></select>
  <button class="btn btn-reset" onclick="resetScript()">↺ Reset</button>
</header>
<div class="layout">
  <div class="main">
    <div class="script-info">
      <div class="name" id="scriptName"></div>
      <div class="desc" id="scriptDesc"></div>
    </div>
    <div class="history" id="history"></div>
  </div>
  <div class="side">
    <h2>State</h2>
    <div class="state-list" id="stateList"></div>
  </div>
</div>

<script>
const SCRIPTS = ${scriptsJson};

let currentScript = null;
let state = new Map();
let historyCards = [];

function nodeById(id) {
  return currentScript.nodes.find(n => n.id === id) || null;
}

function badgeClass(type) {
  const t = (type || '').toLowerCase();
  const map = { coinflip: 'coinFlip', dialog: 'dialog', dialogchoice: 'dialogChoice', random: 'random', randomchoice: 'randomChoice', get: 'get', set: 'set', add: 'add', subtract: 'subtract', multiply: 'multiply', divide: 'divide', unset: 'unset', conditional: 'conditional', conditionalget: 'conditionalGet', and: 'and', or: 'or', greaterthan: 'greaterThan', greaterthanorequal: 'greaterThanOrEqual', lessthan: 'lessThan', lessthanorequal: 'lessThanOrEqual', equalto: 'equalTo', notequalto: 'notEqualTo', between: 'between', contains: 'contains', startswith: 'startsWith', endswith: 'endsWith', in: 'in', match: 'match', empty: 'empty', notempty: 'notEmpty', isset: 'isSet', isnotset: 'isNotSet', istrue: 'isTrue', isfalse: 'isFalse', log: 'log', include: 'include', end: 'end' };
  return 'badge-' + (map[t] || 'default');
}

function evalValue(val) {
  const s = String(val);
  if (s.startsWith('\`') && s.endsWith('\`')) {
    return s.slice(1, -1).replace(/\\\${state\\.get\\('([^']+)'\\)}/g, (_, k) => state.get(k) ?? '');
  }
  return s;
}

function renderState() {
  const el = document.getElementById('stateList');
  const entries = [...state.entries()].filter(([k]) => !k.startsWith('$'));
  if (entries.length === 0) {
    el.innerHTML = '<div class="state-empty">empty</div>';
    return;
  }
  el.innerHTML = entries.map(([k, v]) =>
    \`<div class="state-item"><span class="state-key">\${esc(k)}</span><span class="state-val">\${esc(String(v))}</span></div>\`
  ).join('');
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function addHistoryCard(html) {
  historyCards.push(html);
}

function renderHistory(activeHtml) {
  const el = document.getElementById('history');
  const past = historyCards.map(h => \`<div class="card past">\${h}</div>\`).join('');
  const active = activeHtml ? \`<div class="card current" id="activeCard">\${activeHtml}</div>\` : '';
  el.innerHTML = past + active;
  el.scrollTop = el.scrollHeight;
}

function cardHeaderHtml(type, id) {
  return \`<div class="card-header">
    <span class="badge \${badgeClass(type)}">\${esc(type)}</span>
    <span class="node-id">node #\${id}</span>
  </div>\`;
}

function executeNode(nodeId) {
  if (nodeId === 0) {
    showEnd();
    return;
  }
  const node = nodeById(nodeId);
  if (!node) {
    showError(\`Node \${nodeId} not found\`);
    return;
  }

  const type = node.type;

  if (type === 'get') {
    const key = String(node.args.key || '');
    const opNodeIds = Array.isArray(node.args.nodes) ? node.args.nodes : [];
    const ops = opNodeIds.map(id => nodeById(id)).filter(Boolean);
    let nextId = 0;
    const opSummary = [];
    for (const op of ops) {
      const cur = state.has(key) ? parseFloat(String(state.get(key))) || 0 : 0;
      const val = op.args.value;
      if (op.type === 'set') state.set(key, evalValue(String(val ?? '')));
      else if (op.type === 'add') state.set(key, cur + Number(val));
      else if (op.type === 'subtract') state.set(key, cur - Number(val));
      else if (op.type === 'multiply') state.set(key, cur * Number(val));
      else if (op.type === 'divide') state.set(key, cur / Number(val));
      else if (op.type === 'unset') state.delete(key);
      opSummary.push(val !== undefined ? \`\${op.type} \${val}\` : op.type);
      if (nextId === 0) nextId = Array.isArray(op.args.nodes) ? (op.args.nodes[0] ?? 0) : 0;
    }
    renderState();
    const newVal = state.has(key) ? String(state.get(key)) : '(unset)';
    const body = \`<div class="card-body">
      <div class="row"><span class="label">key</span><span class="val mono">\${esc(key)}</span></div>
      <div class="row"><span class="label">ops</span><span class="val mono">\${esc(opSummary.join(', '))}</span></div>
      <div class="row"><span class="label">result</span><span class="val mono">\${esc(newVal)}</span></div>
      <div class="outcome">→ state updated</div>
    </div>\`;
    addHistoryCard(cardHeaderHtml(type, node.id) + body);
    executeNode(nextId);

  } else if (type === 'log') {
    const msg = evalValue(String(node.args.message || ''));
    const body = \`<div class="card-body">
      <div class="row"><span class="label">message</span><span class="val">\${esc(msg)}</span></div>
      <div class="outcome">→ logged</div>
    </div>\`;
    const next = Array.isArray(node.args.nodes) ? node.args.nodes[0] : 0;
    const nextId = next ?? 0;
    renderHistory(cardHeaderHtml(type, node.id) + body +
      \`<div class="action-bar"><button class="btn btn-primary" onclick="advance(\${nextId})">Continue</button></div>\`);
    renderState();

  } else if (type === 'coinFlip') {
    const isHeads = Math.random() < 0.5;
    const branch = isHeads ? 't' : 'f';
    const nextNodes = Array.isArray(node.args[branch]) ? node.args[branch] : [];
    const nextId = nextNodes[0] ?? 0;
    const body = \`<div class="card-body">
      <div class="row"><span class="label">result</span><span class="val">\${isHeads ? 'Heads (true)' : 'Tails (false)'}</span></div>
      <div class="row"><span class="label">→ branch</span><span class="val mono">\${branch}</span></div>
    </div>\`;
    addHistoryCard(cardHeaderHtml(type, node.id) + body);
    executeNode(nextId);

  } else if (type === 'dialog') {
    const character = evalValue(String(node.args.character || ''));
    const text = evalValue(String(node.args.text || ''));
    const choiceNodeIds = Array.isArray(node.args.nodes) ? node.args.nodes : [];
    const choices = choiceNodeIds.map(cid => nodeById(cid)).filter(Boolean);
    const choiceButtons = choices.map(c => {
      const choiceText = evalValue(String(c.args.text || 'Choice'));
      const nextId = Array.isArray(c.args.nodes) ? (c.args.nodes[0] ?? 0) : 0;
      return \`<button class="choice-btn" onclick="pickChoice(\${c.id}, '\${esc(choiceText)}', \${nextId})">\${esc(choiceText)}</button>\`;
    }).join('');
    const body = \`<div class="card-body">
      <div class="row"><span class="label">character</span><span class="val">\${esc(character)}</span></div>
      <div class="row"><span class="label">text</span><span class="val">\${esc(text)}</span></div>
      <div class="choices">\${choiceButtons || '<span style="color:#64748b;font-size:12px">no choices</span>'}</div>
    </div>\`;
    renderHistory(cardHeaderHtml(type, node.id) + body);
    renderState();
    window._pendingDialogNode = node.id;

  } else if (type === 'random') {
    const choiceNodeIds = Array.isArray(node.args.nodes) ? node.args.nodes : [];
    const choices = choiceNodeIds.map(cid => nodeById(cid)).filter(Boolean);
    const totalWeight = choices.reduce((sum, c) => sum + (Number(c.args.weight) || 1), 0);
    let pick = Math.random() * totalWeight;
    let chosen = choices[choices.length - 1];
    for (const c of choices) {
      pick -= Number(c.args.weight) || 1;
      if (pick <= 0) { chosen = c; break; }
    }
    const nextId = chosen && Array.isArray(chosen.args.nodes) ? (chosen.args.nodes[0] ?? 0) : 0;
    const body = \`<div class="card-body">
      <div class="row"><span class="label">choices</span><span class="val">\${choices.length}</span></div>
      <div class="row"><span class="label">selected</span><span class="val mono">#\${chosen ? chosen.id : '?'} (weight \${chosen ? (chosen.args.weight ?? 1) : 1})</span></div>
    </div>\`;
    addHistoryCard(cardHeaderHtml(type, node.id) + body);
    executeNode(nextId);

  } else if (type === 'conditional') {
    const chain = [];
    let nextChainId = Array.isArray(node.args.nodes) ? node.args.nodes[0] : null;
    while (nextChainId !== null && nextChainId !== undefined && nextChainId !== 0) {
      const cn = nodeById(nextChainId);
      if (!cn) break;
      chain.push(cn);
      const cnNext = Array.isArray(cn.args.nodes) ? cn.args.nodes : [];
      nextChainId = cnNext.length > 0 ? cnNext[0] : null;
    }
    // Evaluate the condition chain inline
    let result = false;
    let pendingOp = null; // 'and' | 'or' | null
    let i = 0;
    while (i < chain.length) {
      const n = chain[i];
      if (n.type === 'conditionalGet') {
        const key = String(n.args.key || '');
        state.set('$conditional.value', state.has(key) ? state.get(key) : undefined);
        state.set('$conditional.key', key);
        i++;
      } else if (n.type === 'and') {
        if (!result) { break; }
        pendingOp = 'and';
        result = false;
        i++;
      } else if (n.type === 'or') {
        if (result) { break; }
        pendingOp = 'or';
        result = false;
        i++;
      } else {
        // comparator node
        const val = n.args.value;
        const ignoreCase = n.args.ignoreCase ?? false;
        const raw = String(state.get('$conditional.value') ?? '');
        const a = ignoreCase ? raw.toLowerCase() : raw;
        const num = parseFloat(raw) || 0;
        let cmp = false;
        if (n.type === 'greaterThan') cmp = num > Number(val);
        else if (n.type === 'greaterThanOrEqual') cmp = num >= Number(val);
        else if (n.type === 'lessThan') cmp = num < Number(val);
        else if (n.type === 'lessThanOrEqual') cmp = num <= Number(val);
        else if (n.type === 'between') cmp = n.args.inclusive ? num >= Number(n.args.min) && num <= Number(n.args.max) : num > Number(n.args.min) && num < Number(n.args.max);
        else if (n.type === 'equalTo') cmp = a === (ignoreCase ? String(val).toLowerCase() : String(val));
        else if (n.type === 'notEqualTo') cmp = a !== (ignoreCase ? String(val).toLowerCase() : String(val));
        else if (n.type === 'contains') cmp = a.includes(ignoreCase ? String(val).toLowerCase() : String(val));
        else if (n.type === 'startsWith') cmp = a.startsWith(ignoreCase ? String(val).toLowerCase() : String(val));
        else if (n.type === 'endsWith') cmp = a.endsWith(ignoreCase ? String(val).toLowerCase() : String(val));
        else if (n.type === 'in') { const list = (Array.isArray(val) ? val : []).map(v => ignoreCase ? String(v).toLowerCase() : String(v)); cmp = list.includes(a); }
        else if (n.type === 'match') cmp = new RegExp(String(val), ignoreCase ? 'i' : '').test(raw);
        else if (n.type === 'empty') cmp = raw === '' || raw === '0' || raw === 'undefined' || !state.has(state.get('$conditional.key'));
        else if (n.type === 'notEmpty') cmp = raw !== '' && raw !== '0' && raw !== 'undefined' && state.has(state.get('$conditional.key'));
        else if (n.type === 'isSet') cmp = state.has(state.get('$conditional.key'));
        else if (n.type === 'isNotSet') cmp = !state.has(state.get('$conditional.key'));
        else if (n.type === 'isTrue') cmp = raw === 'true' || raw === '1';
        else if (n.type === 'isFalse') cmp = raw === 'false' || raw === '0';
        result = cmp;
        i++;
      }
    }
    state.delete('$conditional.value');
    state.delete('$conditional.key');
    const tNodes = Array.isArray(node.args.t) ? node.args.t : [];
    const fNodes = Array.isArray(node.args.f) ? node.args.f : [];
    const nextId = result ? (tNodes[0] ?? 0) : (fNodes[0] ?? 0);
    const chainSummary = chain.map(n => n.type === 'conditionalGet' ? \`get(\${n.args.key})\` : n.type === 'and' ? 'AND' : n.type === 'or' ? 'OR' : n.type).join(' → ');
    const body = \`<div class="card-body">
      <div class="row"><span class="label">chain</span><span class="val mono">\${esc(chainSummary)}</span></div>
      <div class="row"><span class="label">result</span><span class="val" style="color:\${result ? '#34d399' : '#f87171'}">\${result ? 'true → t' : 'false → f'}</span></div>
    </div>\`;
    addHistoryCard(cardHeaderHtml(type, node.id) + body);
    executeNode(nextId);

  } else if (type === 'include') {
    const scriptName = String(node.args.script || '');
    const target = SCRIPTS.find(s => s.name.toLowerCase() === scriptName.toLowerCase() ||
      s.name.toLowerCase() === ('hello' + scriptName).toLowerCase() ||
      s.name.endsWith(scriptName));
    if (target) {
      const body = \`<div class="card-body">
        <div class="row"><span class="label">script</span><span class="val">\${esc(scriptName)}</span></div>
        <div class="outcome">→ including script</div>
      </div>\`;
      addHistoryCard(cardHeaderHtml(type, node.id) + body);
      loadScript(target, state);
    } else {
      showError(\`Script "\${scriptName}" not found\`);
    }

  } else {
    // Generic node — show args and let user continue
    const argRows = Object.entries(node.args).filter(([k]) => k !== 'nodes' && k !== 'state' && k !== 'callstack').map(([k, v]) =>
      \`<div class="row"><span class="label">\${esc(k)}</span><span class="val mono">\${esc(JSON.stringify(v))}</span></div>\`
    ).join('');
    const nextIds = Array.isArray(node.args.nodes) ? node.args.nodes : [];
    const nextId = nextIds[0] ?? 0;
    const body = \`<div class="card-body">\${argRows}<div class="action-bar"><button class="btn btn-primary" onclick="advance(\${nextId})">Continue</button></div></div>\`;
    renderHistory(cardHeaderHtml(type, node.id) + body);
    renderState();
  }
}

function pickChoice(choiceId, text, nextId) {
  const choiceNode = nodeById(choiceId);
  const dialogNode = window._pendingDialogNode != null ? nodeById(window._pendingDialogNode) : null;
  if (dialogNode) {
    const character = evalValue(String(dialogNode.args.character || ''));
    const dialogText = evalValue(String(dialogNode.args.text || ''));
    const body = \`<div class="card-body">
      <div class="row"><span class="label">character</span><span class="val">\${esc(character)}</span></div>
      <div class="row"><span class="label">text</span><span class="val">\${esc(dialogText)}</span></div>
      <div class="row"><span class="label">selected</span><span class="val">\${esc(text)}</span></div>
    </div>\`;
    addHistoryCard(cardHeaderHtml(dialogNode.type, dialogNode.id) + body);
  }
  window._pendingDialogNode = null;
  executeNode(nextId);
}

function advance(nextId) {
  executeNode(nextId);
}

function showEnd() {
  renderHistory(\`<div class="card-header"><span class="badge badge-end">complete</span></div>
    <div class="card-body"><div class="outcome">Script finished.</div></div>\`);
  renderState();
}

function showError(msg) {
  renderHistory(\`<div class="card-header"><span class="badge" style="background:#f8717122;color:#fca5a5;border:1px solid #f8717155">error</span></div>
    <div class="card-body"><div class="val" style="color:#fca5a5">\${esc(msg)}</div></div>\`);
}

function loadScript(script, inheritedState) {
  currentScript = script;
  historyCards = [];
  state = inheritedState || new Map(Object.entries(script.initialState || {}));
  window._pendingDialogNode = null;
  document.getElementById('scriptName').textContent = script.name;
  document.getElementById('scriptDesc').textContent = script.description || '';
  renderState();
  executeNode(1);
}

function resetScript() {
  const idx = document.getElementById('scriptSelect').value;
  loadScript(SCRIPTS[idx]);
}

function init() {
  const sel = document.getElementById('scriptSelect');
  SCRIPTS.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = s.name;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => loadScript(SCRIPTS[sel.value]));
  if (SCRIPTS.length > 0) loadScript(SCRIPTS[0]);
}

init();
</script>
</body>
</html>`;

fs.writeFileSync(outFile, html, 'utf-8');
console.log('Built: ' + outFile);
