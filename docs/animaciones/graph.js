// ===== Modelo mínimo de repositorio Git =====
let SEQ = 0;
class Repo {
  constructor(name) { this.name = name; this.c = {}; this.refs = {}; this.head = 'main'; this.order = ['main']; }
  newCommit(id, parents, msg) { const c = { id, parents: parents.filter(Boolean), msg, seq: ++SEQ }; this.c[id] = c; return c; }
  put(c) { this.c[c.id] = c; }
  tip(b) { return this.refs[b || this.head]; }
  commit(id, msg) { const c = this.newCommit(id, [this.tip()], msg); this.refs[this.head] = id; return c; }
  branch(name, at) { this.refs[name] = at || this.tip(); if (!this.order.includes(name)) this.order.push(name); }
  del(name) { delete this.refs[name]; this.order = this.order.filter(b => b !== name); }
  switch(name) { this.head = name; }
  ancestors(id) { const s = new Set(), st = [id]; while (st.length) { const x = st.pop(); if (!x || s.has(x) || !this.c[x]) continue; s.add(x); this.c[x].parents.forEach(p => st.push(p)); } return s; }
  isAnc(a, b) { return this.ancestors(b).has(a); }
  missingFrom(other, tipId) { return [...this.ancestors(tipId)].filter(id => !other.c[id]).map(id => this.c[id]).sort((a, b) => a.seq - b.seq); }
  merge(ref, id, msg) {
    const cur = this.tip(), t = this.refs[ref];
    if (!t || this.isAnc(t, cur)) return 'up-to-date';
    if (this.isAnc(cur, t)) { this.refs[this.head] = t; return 'ff'; }
    this.newCommit(id, [cur, t], msg); this.refs[this.head] = id; return 'merge';
  }
  mergeNoFF(ref, id, msg) { const cur = this.tip(), t = this.refs[ref]; this.newCommit(id, [cur, t], msg); this.refs[this.head] = id; return 'merge'; }
  rebase(onto, rename) {
    const base = this.refs[onto], ob = this.ancestors(base); const chain = []; let x = this.tip();
    while (x && !ob.has(x)) { chain.unshift(x); x = this.c[x].parents[0]; }
    let p = base; const out = [];
    for (const id of chain) { const n = this.newCommit(rename(id), [p], this.c[id].msg); n.copyOf = id; p = n.id; out.push(n); }
    this.refs[this.head] = p; return out;
  }
  reachable() { const s = new Set(); Object.values(this.refs).forEach(r => this.ancestors(r).forEach(x => s.add(x))); return s; }
  lanes() {
    const lane = {}; let L = 0; const reach = this.reachable();
    const names = this.order.filter(b => this.refs[b] !== undefined).concat(Object.keys(this.refs).filter(b => !this.order.includes(b)));
    const walk = s => { let x = s, used = false; while (x && this.c[x] && lane[x] === undefined) { lane[x] = L; used = true; x = this.c[x].parents[0]; } return used; };
    for (const b of names) if (walk(this.refs[b])) L++;
    [...reach].filter(x => lane[x] === undefined).sort((a, b) => this.c[b].seq - this.c[a].seq).forEach(x => { if (lane[x] === undefined && walk(x)) L++; });
    return lane;
  }
  aheadBehind(a, b) { const A = this.ancestors(this.refs[a]), B = this.ancestors(this.refs[b]); return [[...A].filter(x => !B.has(x)).length, [...B].filter(x => !A.has(x)).length]; }
}

// ===== Vista animada sobre canvas =====
const LANE_COLORS = ['#1A375E', '#3D6FD9', '#E07A2E', '#2E9E6B', '#8E5BD6', '#C8423B'];
class GraphView {
  constructor(canvas, regions, opts = {}) {
    this.cv = canvas; this.ctx = canvas.getContext('2d'); this.regions = regions; this.opts = opts;
    this.W = opts.width || 1200; this.H = opts.height || 360; this.nodes = {}; this.labels = {}; this.flash = [];
    this.resize(); window.addEventListener('resize', () => this.resize());
    this.last = performance.now(); requestAnimationFrame(t => this.loop(t));
  }
  resize() { const r = window.devicePixelRatio || 1; const w = this.cv.clientWidth || 1000; this.scale = w / this.W; this.cv.width = w * r; this.cv.height = this.H * this.scale * r; this.cv.style.height = (this.H * this.scale) + 'px'; this.ctx.setTransform(r * this.scale, 0, 0, r * this.scale, 0, 0); }
  layout(instant) {
    const seen = new Set(), seenL = new Set();
    this.regions.forEach((R, ri) => {
      const repo = R.repo, reach = repo.reachable(), lane = repo.lanes();
      const list = [...reach].map(id => repo.c[id]).sort((a, b) => a.seq - b.seq);
      const n = list.length, padL = 60, padR = R.padR || 170;
      const dx = Math.min(R.dx || 95, (R.w - padL - padR) / Math.max(1, n - 1));
      const rank = {}; list.forEach((c, i) => rank[c.id] = i);
      list.forEach(c => {
        const key = ri + ':' + c.id; seen.add(key);
        const tx = R.x + padL + rank[c.id] * dx, ty = R.y + (R.top || 90) + lane[c.id] * (R.laneH || 78);
        let nd = this.nodes[key];
        if (!nd) {
          let sx = tx, sy = ty;
          const twin = Object.entries(this.nodes).find(([k, v]) => k.split(':').slice(1).join(':') === c.id && !k.startsWith(ri + ':') && v.ta > 0);
          const par = c.parents[0] && this.nodes[ri + ':' + c.parents[0]];
          const src = c.copyOf && this.nodes[ri + ':' + c.copyOf];
          if (twin) { sx = twin[1].x; sy = twin[1].y; } else if (src) { sx = src.x; sy = src.y; } else if (par) { sx = par.x; sy = par.y; }
          nd = this.nodes[key] = { ri, id: c.id, x: instant ? tx : sx, y: instant ? ty : sy, a: instant ? 1 : 0, s: instant ? 1 : .4 };
          if (!instant && (twin || src)) nd.a = .9;
        }
        Object.assign(nd, { tx, ty, ta: 1, ts: 1, lane: lane[c.id], c });
      });
      const by = {}; Object.entries(repo.refs).forEach(([b, id]) => { if (id) (by[id] = by[id] || []).push(b); });
      Object.entries(by).forEach(([id, bs]) => {
        bs.sort((a, b) => (a === repo.head ? -1 : b === repo.head ? 1 : repo.order.indexOf(a) - repo.order.indexOf(b)));
        const nd = this.nodes[ri + ':' + id]; const up = (lane[id] || 0) === 0;
        bs.forEach((b, k) => {
          const key = ri + '|' + b; seenL.add(key);
          const tx = nd.tx, ty = nd.ty + (up ? -(40 + k * 32) : (40 + k * 32));
          let lb = this.labels[key];
          if (!lb) lb = this.labels[key] = { x: instant ? tx : nd.x, y: instant ? ty : nd.y, a: instant ? 1 : 0 };
          Object.assign(lb, { tx, ty, ta: 1, name: b, head: b === repo.head && !R.noHead, remote: b.includes('/'), up, k, nk: ri + ':' + id });
        });
      });
    });
    Object.entries(this.nodes).forEach(([k, v]) => { if (!seen.has(k)) { v.ta = 0; v.ts = .3; } });
    Object.entries(this.labels).forEach(([k, v]) => { if (!seenL.has(k)) v.ta = 0; });
  }
  pulse(ri, id, color) { this.flash.push({ ri, id, t: performance.now(), color: color || '#3D6FD9' }); }
  loop(t) {
    const dt = Math.min(64, t - this.last); this.last = t; const k = 1 - Math.exp(-dt / (this.opts.ease || 140));
    Object.entries(this.nodes).forEach(([key, n]) => { n.x += (n.tx - n.x) * k; n.y += (n.ty - n.y) * k; n.a += (n.ta - n.a) * k; n.s += (n.ts - n.s) * k; if (n.ta === 0 && n.a < .02) delete this.nodes[key]; });
    Object.entries(this.labels).forEach(([key, l]) => { l.x += (l.tx - l.x) * k; l.y += (l.ty - l.y) * k; l.a += (l.ta - l.a) * k; if (l.ta === 0 && l.a < .02) delete this.labels[key]; });
    this.draw(t); requestAnimationFrame(tt => this.loop(tt));
  }
  rr(x, y, w, h, r) { const c = this.ctx; c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  draw(t) {
    const c = this.ctx; c.clearRect(0, 0, this.W, this.H);
    this.regions.forEach(R => {
      if (R.bg) { c.fillStyle = R.bg; this.rr(R.x, R.y, R.w, R.h, 16); c.fill(); }
      if (R.title) { c.fillStyle = '#293B8F'; c.font = '700 15px Montserrat, Arial'; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText(R.title.toUpperCase(), R.x + 20, R.y + 32); }
      if (R.subtitle) { c.fillStyle = '#5B6B8C'; c.font = '500 14px Montserrat, Arial'; c.fillText(R.subtitle, R.x + 20, R.y + 52); }
    });
    Object.values(this.nodes).forEach(n => {
      n.c.parents.forEach((p, i) => {
        const pn = this.nodes[n.ri + ':' + p]; if (!pn) return;
        c.globalAlpha = Math.min(n.a, pn.a); c.strokeStyle = LANE_COLORS[(i === 0 ? n.lane : pn.lane) % 6] || '#999'; c.lineWidth = 4;
        c.beginPath(); c.moveTo(pn.x, pn.y);
        if (Math.abs(pn.y - n.y) < 2) c.lineTo(n.x, n.y);
        else { const mx = (pn.x + n.x) / 2; c.bezierCurveTo(mx, pn.y, mx, n.y, n.x, n.y); }
        c.stroke();
      });
    });
    c.globalAlpha = 1;
    this.flash = this.flash.filter(f => t - f.t < 900);
    this.flash.forEach(f => { const n = this.nodes[f.ri + ':' + f.id]; if (!n) return; const p = (t - f.t) / 900; c.globalAlpha = 1 - p; c.strokeStyle = f.color; c.lineWidth = 4; c.beginPath(); c.arc(n.x, n.y, 22 + p * 26, 0, 7); c.stroke(); });
    c.globalAlpha = 1;
    Object.values(this.nodes).forEach(n => {
      c.globalAlpha = n.a; const r = 21 * n.s; const col = LANE_COLORS[n.lane % 6];
      c.fillStyle = n.c.parents.length > 1 ? '#fff' : col; c.strokeStyle = col; c.lineWidth = 4;
      c.beginPath(); c.arc(n.x, n.y, r, 0, 7); c.fill(); c.stroke();
      c.fillStyle = n.c.parents.length > 1 ? col : '#fff'; c.font = '700 ' + Math.round(15 * n.s) + 'px Montserrat, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(n.c.id, n.x, n.y + 1);
    });
    Object.values(this.labels).forEach(l => {
      c.globalAlpha = l.a; c.font = '700 15px "JetBrains Mono", Consolas, monospace'; const w = c.measureText(l.name).width + 26, h = 28;
      const x = l.x - w / 2, y = l.y - h / 2;
      const nd = this.nodes[l.nk];
      if (nd && l.k === 0) { c.strokeStyle = l.remote ? '#9AA8C7' : '#293B8F'; c.lineWidth = 2; c.beginPath(); c.moveTo(l.x, l.up ? y + h : y); c.lineTo(nd.x, l.up ? nd.y - 22 : nd.y + 22); c.stroke(); }
      this.rr(x, y, w, h, 14);
      if (l.head) { c.fillStyle = '#293B8F'; c.fill(); c.fillStyle = '#fff'; }
      else if (l.remote) { c.fillStyle = '#fff'; c.fill(); c.setLineDash([5, 4]); c.strokeStyle = '#9AA8C7'; c.stroke(); c.setLineDash([]); c.fillStyle = '#5B6B8C'; }
      else { c.fillStyle = '#fff'; c.fill(); c.strokeStyle = '#293B8F'; c.stroke(); c.fillStyle = '#293B8F'; }
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(l.name, l.x, l.y + 1);
      if (l.head) { c.font = '700 11px Montserrat, Arial'; const hw = 46; this.rr(l.x + w / 2 + 6, l.y - 10, hw, 20, 10); c.fillStyle = '#E07A2E'; c.fill(); c.fillStyle = '#fff'; c.fillText('HEAD', l.x + w / 2 + 6 + hw / 2, l.y + 1); }
    });
    c.globalAlpha = 1;
  }
}

// ===== Terminal =====
class Term {
  constructor(el, prompt) { this.el = el; this.prompt = prompt || '$'; }
  clear() { this.el.innerHTML = ''; }
  add(cls, text) { const d = document.createElement('div'); d.className = 'line ' + cls; d.textContent = text; this.el.appendChild(d); this.el.scrollTop = this.el.scrollHeight; return d; }
  cmd(text) { const d = document.createElement('div'); d.className = 'line'; d.innerHTML = '<span class="p">' + this.prompt + '</span> <span class="c"></span>'; d.querySelector('.c').textContent = text; this.el.appendChild(d); this.el.scrollTop = this.el.scrollHeight; }
  out(text, cls) { text.split('\n').forEach(l => this.add(cls || 'o', l)); }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
