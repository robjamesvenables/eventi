// Guest page helpers for guests who aren't signed in (one function, to stay under Vercel's limit):
//   GET /api/gp?a=img&c=<company id>&p=<file path>   a photo on the guest page. Only serves a file that really is
//       on that company's guest page right now, by sending the browser to a short-lived private link.
//   GET /api/gp?a=hit&code=<keyring>&i=<card id>      a guest tapped Book / Tickets / WhatsApp on a card - counted for
//       the Numbers screen. Nothing personal is stored: just the company, which card and when.
//   GET  /api/gp?a=roster&t=<token>                  a department's roster for its live share link (no login).
//   POST /api/gp?a=offers&code=<keyring>&on=1|0       the member turns "Send me offers" on or off on their own page.
const L = require('./_lib');
const GP = require('./_gp');
const BUCKET = 'shared-files';

async function photo(req, res){
  const c = String((req.query && req.query.c) || ''), p = String((req.query && req.query.p) || '');
  if (!/^[0-9a-f-]{36}$/i.test(c) || !p || p.length > 400 || /\.\./.test(p) || !p.startsWith(c + '/guestpage/') || !L.SERVICE_KEY) { res.status(404).end(); return; }
  const row = (await L.db('guest_page?select=content&company_id=eq.' + encodeURIComponent(c)))[0];
  if (!row || !GP.paths(row.content).includes(p)) { res.status(404).end(); return; }
  const r = await fetch(L.SUPABASE_URL + '/storage/v1/object/sign/' + BUCKET + '/' + p.split('/').map(encodeURIComponent).join('/'), {
    method: 'POST', headers: Object.assign(L.serviceHeaders(), { 'Content-Type': 'application/json' }), body: JSON.stringify({ expiresIn: 86400 })
  });
  const d = await r.json().catch(() => ({}));
  const u = d.signedURL || d.signedUrl;
  if (!r.ok || !u) { res.status(404).end(); return; }
  res.setHeader('Cache-Control', 'public, max-age=21600');
  res.writeHead(302, { Location: L.SUPABASE_URL + '/storage/v1' + (u.startsWith('/') ? u : '/' + u) });
  res.end();
}

async function hit(req, res){
  const code = String((req.query && req.query.code) || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  const item = String((req.query && req.query.i) || '').replace(/[^\w-]/g, '').slice(0, 40);
  if (code && item) {
    const k = (await L.db('member_keyrings?select=company_id&code=eq.' + encodeURIComponent(code)))[0];
    if (k) await L.db('guest_page_hits', { method: 'POST', body: [{ company_id: k.company_id, item, kind: 'tap' }], headers: { Prefer: 'return=minimal' } }).catch(() => {});
  }
  res.status(204).end();
}

async function offers(req, res){
  const code = String((req.query && req.query.code) || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  const on = String((req.query && req.query.on) || '') === '1';
  if (req.method !== 'POST' || !code) return L.send(res, 400, { ok: false });
  const k = (await L.db('member_keyrings?select=member_id&code=eq.' + encodeURIComponent(code)))[0];
  if (!k || !k.member_id) return L.send(res, 404, { ok: false });
  await L.db('members?id=eq.' + encodeURIComponent(k.member_id), { method: 'PATCH', body: { consent: on }, headers: { Prefer: 'return=minimal' } });
  return L.send(res, 200, { ok: true, on });
}

// ── Roster live link: /r/<token> shows one department's roster (this week and next), no login ──
const RS_DEF_SHIFTS = [{ id: 'm', name: 'Morning', a: '08:00', b: '16:00', c: 'teal' }, { id: 'e', name: 'Evening', a: '16:00', b: '00:00', c: 'indigo' }, { id: 's', name: 'Split', a: '11:00', b: '15:00', a2: '18:00', b2: '23:00', c: 'amber' }];
const rsParse = v => { if (!v) return null; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch (e) { return null; } };
const rsHm = t => { const m = /^(\d{1,2}):(\d{2})/.exec(t || ''); if (!m) return ''; let h = +m[1]; if (h === 0 && m[2] === '00') return '12am'; const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + (m[2] !== '00' ? ':' + m[2] : '') + ap; };
const rsH = t => { const m = /^(\d{1,2}):(\d{2})/.exec(t || ''); if (!m) return ''; return ((+m[1]) % 12 || 12) + (m[2] !== '00' ? ':' + m[2] : ''); };
const rsMonday = d => { const x = new Date(d + 'T12:00:00Z'); const k = (x.getUTCDay() + 6) % 7; x.setUTCDate(x.getUTCDate() - k); return x.toISOString().slice(0, 10); };
const rsAdd = (d, n) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
function rsCell(v, shifts){
  if (!v) return null;
  const [code, area] = String(v).split('@');
  const out = { area: (area || '').slice(0, 30) };
  if (code === 'off') return Object.assign(out, { k: 'off', label: 'Off' });
  if (code === 'hol') return Object.assign(out, { k: 'hol', label: 'Holiday', short: 'Hol' });
  if (code === 'sick') return Object.assign(out, { k: 'sick', label: 'Sick' });
  if (code.startsWith('s:')) { const sh = shifts.find(x => x.id === code.slice(2)); if (!sh) return null;
    return Object.assign(out, { k: sh.c || 'teal', label: String(sh.name || '').slice(0, 20), short: sh.a2 ? String(sh.name || '').slice(0, 20) : rsH(sh.a) + '–' + rsH(sh.b), time: rsHm(sh.a) + '–' + rsHm(sh.b) + (sh.a2 ? ' · ' + rsHm(sh.a2) + '–' + rsHm(sh.b2) : '') }); }
  if (code.startsWith('t:')) { const [a, b] = code.slice(2).split('-'); return Object.assign(out, { k: 'sky', label: rsHm(a) + '–' + rsHm(b), short: rsH(a) + '–' + rsH(b), time: '' }); }
  return null;
}
async function roster(req, res){
  const t = String((req.query && req.query.t) || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 40);
  if (!t) return L.send(res, 404, { ok: false });
  const link = (await L.db('roster_links?select=company_id,venue,dept,area&token=eq.' + encodeURIComponent(t)))[0];
  if (!link) return L.send(res, 404, { ok: false, reason: 'gone' });
  const co = link.company_id, q = encodeURIComponent;
  const tz = 'Asia/Makassar';
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const w1 = rsMonday(today), w2 = rsAdd(w1, 7);
  const [cos, sets, rows, ppl] = await Promise.all([
    L.db('companies?select=name&id=eq.' + q(co)),
    L.db('app_settings?select=key,value&company_id=eq.' + q(co) + '&key=eq.roster_setup'),
    L.db('rosters?select=week,cells,updated_at&company_id=eq.' + q(co) + '&venue=eq.' + q(link.venue) + '&dept=eq.' + q(link.dept) + '&week=in.(' + w1 + ',' + w2 + ')'),
    L.db('profiles?select=id,first_name,last_name,role,departments,active&company_id=eq.' + q(co))
  ]);
  const setup = rsParse(sets[0] && sets[0].value) || {};
  const shifts = Array.isArray(setup.shifts) && setup.shifts.length ? setup.shifts : RS_DEF_SHIFTS;
  const lc = s => String(s || '').toLowerCase().trim();
  const inDept = ppl.filter(p => p.active !== false && (p.departments || []).some(d => lc(d) === lc(link.dept)));
  const ROLE = { superadmin: 'Manager', director: 'Director', manager: 'Manager', supervisor: 'Supervisor', teammember: '' };
  const week = w => { const r = rows.find(x => String(x.week).slice(0, 10) === w) || {}; const cells = rsParse(r.cells) || {};
    const dws = ((setup.dw || {})[lc(link.dept)] || []).filter(x => x && x.id && x.name);
    const ids = new Set(inDept.map(p => String(p.id))); dws.forEach(x => ids.add(String(x.id))); Object.keys(cells).forEach(id => ids.add(id));
    const people = [...ids].map(id => { const w0 = dws.find(x => String(x.id) === id);
      if (w0) return { name: String(w0.name).slice(0, 30), role: 'Daily worker', dw: true, days: Array.from({ length: 7 }, (_, i) => rsCell((cells[id] || {})[rsAdd(w, i)], shifts)) };
      const p = ppl.find(x => String(x.id) === id); if (!p) return null;
      const days = Array.from({ length: 7 }, (_, i) => rsCell((cells[id] || {})[rsAdd(w, i)], shifts));
      return { name: (p.first_name || '') + (p.last_name ? ' ' + p.last_name[0] + '.' : ''), role: ROLE[p.role] || '', days }; }).filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
    return { start: w, days: Array.from({ length: 7 }, (_, i) => rsAdd(w, i)), people, updated: r.updated_at || null }; };
  res.setHeader('Cache-Control', 'no-store');
  return L.send(res, 200, { ok: true, company: (cos[0] || {}).name || '', dept: link.dept, areas: (a => a.length >= 2 ? a : [])(((setup.areas || {})[lc(link.dept)] || []).slice(0, 20)), area: link.area || '', today, weeks: [week(w1), week(w2)] });
}

module.exports = async (req, res) => {
  try {
    const a = String((req.query && req.query.a) || '');
    if (a === 'img') return await photo(req, res);
    if (a === 'hit') return await hit(req, res);
    if (a === 'offers') return await offers(req, res);
    if (a === 'roster') return await roster(req, res);
    res.status(404).end();
  } catch (e) { try { res.status(404).end(); } catch (x) {} }
};
