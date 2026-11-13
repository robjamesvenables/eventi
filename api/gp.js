// Guest page helpers for guests who aren't signed in (one function, to stay under Vercel's limit):
//   GET /api/gp?a=img&c=<company id>&p=<file path>   a photo on the guest page. Only serves a file that really is
//       on that company's guest page right now, by sending the browser to a short-lived private link.
//   GET /api/gp?a=hit&code=<keyring>&i=<card id>      a guest tapped Book / Tickets / WhatsApp on a card - counted for
//       the Numbers screen. Nothing personal is stored: just the company, which card and when.
//   GET  /api/gp?a=roster&t=<token>                  a department's roster for its live share link (no login).
//   POST /api/gp?a=offers&code=<keyring>&on=1|0       the member turns "Send me offers" on or off on their own page.
//   POST /api/gp?a=fb&code=<keyring>  { stars, text, venue }   the member's own star rating after a visit. Saved for the
//       managers (Membership > Insights > Guest feedback); 1-3 stars also buzzes the managers' phones.
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
  if (require('./_prospects').get(code)) return L.send(res, 200, { ok: true, on });   // sales demo keyring: nothing to save
  const k = (await L.db('member_keyrings?select=member_id&code=eq.' + encodeURIComponent(code)))[0];
  if (!k || !k.member_id) return L.send(res, 404, { ok: false });
  await L.db('members?id=eq.' + encodeURIComponent(k.member_id), { method: 'PATCH', body: { consent: on }, headers: { Prefer: 'return=minimal' } });
  return L.send(res, 200, { ok: true, on });
}

// ── Guest feedback: the stars a member taps on their own page (1-3 stars go privately to the managers) ──
async function feedback(req, res){
  const code = String((req.query && req.query.code) || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  if (req.method !== 'POST' || !code) return L.send(res, 400, { ok: false });
  let b = req.body || {}; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const stars = Math.round(+b.stars);
  if (!(stars >= 1 && stars <= 5)) return L.send(res, 400, { ok: false });
  const text = String(b.text || '').replace(/\s+/g, ' ').trim().slice(0, 500), venue = String(b.venue || '').trim().slice(0, 60);
  if (require('./_prospects').get(code)) return L.send(res, 200, { ok: true });   // sales demo keyring: nothing to save
  const k = (await L.db('member_keyrings?select=company_id,member_id&code=eq.' + encodeURIComponent(code)))[0];
  if (!k || !k.member_id) return L.send(res, 404, { ok: false });
  const co = k.company_id, q = encodeURIComponent;
  const m = (await L.db('members?select=id,name,phone&id=eq.' + q(k.member_id)))[0] || {};
  const row = (await L.db('app_settings?select=value&company_id=eq.' + q(co) + '&key=eq.mk_feedback'))[0];
  let list = []; try { let x = row && row.value; while (typeof x === 'string') x = JSON.parse(x); if (Array.isArray(x)) list = x; } catch (e) {}
  const today = new Date().toISOString().slice(0, 10);
  if (list.some(f => f.mid === m.id && String(f.at).slice(0, 10) === today && f.venue === venue)) return L.send(res, 200, { ok: true, dup: true });   // once a day per place
  list.unshift({ id: Date.now().toString(36), at: new Date().toISOString(), stars, text, venue, mid: m.id, name: String(m.name || '').slice(0, 60), done: stars >= 4 });
  list = list.slice(0, 300);
  await L.db('app_settings?on_conflict=company_id,key', { method: 'POST', body: { company_id: co, key: 'mk_feedback', value: JSON.stringify(list) }, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
  if (stars <= 3) await fbPush(co, stars, text, venue, m, list[0].id).catch(() => {});
  return L.send(res, 200, { ok: true });
}
async function fbPush(co, stars, text, venue, m, fid){
  const KEY = process.env.VAPID_PRIVATE_KEY || ''; if (!KEY) return;
  const webpush = require('web-push');
  const people = await L.db('profiles?select=id,role,is_owner,active&company_id=eq.' + encodeURIComponent(co));
  // Who: the people picked in Mavis Club > Settings > Guest feedback alerts; nobody picked = all managers
  const st = (await L.db('app_settings?select=value&key=eq.mk_settings&company_id=eq.' + encodeURIComponent(co)).catch(() => []))[0];
  let pick = []; try { let x = st && st.value; while (typeof x === 'string') x = JSON.parse(x); pick = (x && Array.isArray(x.fbto) ? x.fbto : []).map(String); } catch (e) {}
  const live = people.filter(p => p.active !== false);
  const ids = (pick.length ? live.filter(p => pick.includes(String(p.id))) : live.filter(p => p.is_owner || ['superadmin', 'director', 'manager'].includes(p.role))).map(p => encodeURIComponent(p.id));
  if (!ids.length) return;
  const subs = await L.db('push_subs?select=*&profile_id=in.(' + ids.join(',') + ')');
  webpush.setVapidDetails('mailto:hello@getmavis.co', 'BGfKLEwZ6ZDqoozMUz2jqNJonJni6l-sA2FU8yHkUAm5FnnwHb44ZGBlEolJXr4QSZospqPa1_z-N2dMjTtKCJc', KEY);
  const payload = JSON.stringify({ title: stars + '★ feedback' + (venue ? ' · ' + venue : ''), body: (String(m.name || 'A member').split(' ')[0]) + (text ? ': ' + text.slice(0, 120) : ' left ' + stars + ' star' + (stars === 1 ? '' : 's')), thread: 'mkfb-' + fid, url: '/?feedback=' + encodeURIComponent(fid), who: 'Feedback' });
  await Promise.all(subs.map(sub => webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload, { TTL: 86400 }).catch(() => {})));
}

// ── Phone alerts for members (news and offers) ──
//   POST /api/gp?a=sub&code=<keyring>  { endpoint, keys:{ p256dh, auth } }   the member turned alerts on (on = 0 turns them off)
// Saved per venue in app_settings 'mk_push' (newest first, one per phone). Sent from Members Club > Messages > Phone alert.
const PUSH_HOSTS = /^https:\/\/([a-z0-9-]+\.)*(googleapis\.com|mozilla\.com|mozaws\.net|windows\.com|notify\.windows\.com|push\.apple\.com)\//i;
async function subscribe(req, res){
  const code = String((req.query && req.query.code) || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
  if (req.method !== 'POST' || !code) return L.send(res, 400, { ok: false });
  const b = L.body(req), off = String((req.query && req.query.on) || '1') === '0';
  const ep = String(b.endpoint || ''), k = b.keys || {};
  if (!PUSH_HOSTS.test(ep) || ep.length > 900) return L.send(res, 400, { ok: false });
  if (!off && !(/^[\w-]{40,200}$/.test(String(k.p256dh || '')) && /^[\w-]{10,60}$/.test(String(k.auth || '')))) return L.send(res, 400, { ok: false });
  const kr = (await L.db('member_keyrings?select=company_id,member_id&code=eq.' + encodeURIComponent(code)))[0];
  if (!kr) return L.send(res, 200, { ok: true, saved: false });   // a sales sample with no venue behind it: nothing to save
  const co = kr.company_id, q = encodeURIComponent;
  const row = (await L.db('app_settings?select=value&company_id=eq.' + q(co) + '&key=eq.mk_push'))[0];
  let list = []; try { let x = row && row.value; while (typeof x === 'string') x = JSON.parse(x); if (Array.isArray(x)) list = x; } catch (e) {}
  list = list.filter(x => x && x.endpoint !== ep);
  if (!off) list.unshift({ code, mid: kr.member_id || null, endpoint: ep, p256dh: String(k.p256dh), auth: String(k.auth), at: new Date().toISOString() });
  list = list.slice(0, 4000);
  await L.db('app_settings?on_conflict=company_id,key', { method: 'POST', body: [{ company_id: co, key: 'mk_push', value: JSON.stringify(list) }, { company_id: co, key: 'mk_push_n', value: JSON.stringify({ n: list.length, codes: [...new Set(list.map(x => x.code))].length, mids: [...new Set(list.map(x => x.mid).filter(Boolean).map(String))], at: new Date().toISOString() }) }], headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
  return L.send(res, 200, { ok: true, saved: true, on: !off });
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
    L.db('companies?select=name,code&id=eq.' + q(co)),
    L.db('app_settings?select=key,value&company_id=eq.' + q(co) + '&key=eq.roster_setup'),
    L.db('rosters?select=week,cells,updated_at&company_id=eq.' + q(co) + '&venue=eq.' + q(link.venue) + '&dept=eq.' + q(link.dept) + '&week=in.(' + w1 + ',' + w2 + ')'),
    L.db('profiles?select=id,first_name,last_name,role,departments,active&company_id=eq.' + q(co))
  ]);
  const setup = rsParse(sets[0] && sets[0].value) || {};
  const isDemo = String((cos[0] || {}).code || '').toUpperCase() === 'MAVIS';
  if (isDemo && !(setup.areas && typeof setup.areas === 'object')) { const A = ['Beach Club', 'Sunset Bar', 'Pool Deck', 'Garden Restaurant']; setup.areas = { 'operations': A.slice(), 'front of house': A.slice() }; }
  const shifts = Array.isArray(setup.shifts) && setup.shifts.length ? setup.shifts : RS_DEF_SHIFTS;
  const lc = s => String(s || '').toLowerCase().trim();
  const inDept = ppl.filter(p => p.active !== false && (p.departments || []).some(d => lc(d) === lc(link.dept)));
  const ROLE = { superadmin: 'Manager', director: 'Director', manager: 'Manager', supervisor: 'Supervisor', teammember: '' };
  const splitAreas = (a => a.length >= 2 ? a : [])(((setup.areas || {})[lc(link.dept)] || []).slice(0, 20));
  // Demo company: an empty week shows the same sample week the app shows (same people, same pattern)
  const demoWeek = (w, dws) => {
    let list = inDept.map(p => ({ id: String(p.id), f: p.first_name || '', l: p.last_name || '' })).concat(dws.map(x => ({ id: String(x.id), f: x.name, l: '' })));
    const extra = [];
    if (list.length < 4) ['Kadek','Putu','Wayan','Komang','Ayu','Gede'].slice(0, 6 - list.length).forEach((n, i) => { const x = { id: 'demo-' + lc(link.dept).replace(/\W+/g, '') + '-' + i, first_name: n, last_name: ['S','R','A','P','L','M'][i], role: i ? 'teammember' : 'supervisor' }; extra.push(x); list.push({ id: x.id, f: n, l: x.last_name }); });
    list.sort((a, b) => (a.f + a.l).localeCompare(b.f + b.l));
    const P = ['s:m','s:m','off','s:e','s:e','s:e','off'], Q = ['s:e','s:e','s:e','off','off','s:s','s:s'], R = ['hol','hol','hol','s:m','s:m','off','s:m'], S = ['s:m','off','sick','s:m','s:e','s:e','off'], T = ['off','s:e','s:e','s:e','s:m','off','t:17:00-01:00'], U = ['s:s','s:s','s:m','off','off','s:e','s:e'];
    const cells = {}; list.forEach((p, i) => { cells[p.id] = {}; [P, Q, R, S, T, U][i % 6].forEach((v, d) => { cells[p.id][rsAdd(w, d)] = v + (splitAreas.length && /^[st]:/.test(v) ? '@' + splitAreas[(i + d) % splitAreas.length] : ''); }); });
    return { cells, extra };
  };
  const week = w => { const r = rows.find(x => String(x.week).slice(0, 10) === w) || {}; let cells = rsParse(r.cells) || {};
    const dws = ((setup.dw || {})[lc(link.dept)] || []).filter(x => x && x.id && x.name);
    let extra = [];
    if (isDemo && !Object.keys(cells).length) ({ cells, extra } = demoWeek(w, dws));
    const ids = new Set(inDept.map(p => String(p.id))); dws.forEach(x => ids.add(String(x.id))); Object.keys(cells).forEach(id => ids.add(id));
    const people = [...ids].map(id => { const w0 = dws.find(x => String(x.id) === id);
      if (w0) return { name: String(w0.name).slice(0, 30), role: 'Daily worker', dw: true, days: Array.from({ length: 7 }, (_, i) => rsCell((cells[id] || {})[rsAdd(w, i)], shifts)) };
      const p = ppl.find(x => String(x.id) === id) || extra.find(x => x.id === id); if (!p) return null;
      const days = Array.from({ length: 7 }, (_, i) => rsCell((cells[id] || {})[rsAdd(w, i)], shifts));
      return { name: (p.first_name || '') + (p.last_name ? ' ' + p.last_name[0] + '.' : ''), role: ROLE[p.role] || '', days }; }).filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
    return { start: w, days: Array.from({ length: 7 }, (_, i) => rsAdd(w, i)), people, updated: r.updated_at || null }; };
  res.setHeader('Cache-Control', 'no-store');
  return L.send(res, 200, { ok: true, company: (cos[0] || {}).name || '', dept: link.dept, areas: splitAreas, area: link.area || '', today, weeks: [week(w1), week(w2)] });
}

module.exports = async (req, res) => {
  try {
    const a = String((req.query && req.query.a) || '');
    if (a === 'kpage') return require('./_kpage')(req, res);
    if (a === 'gpage') return require('./_gpage')(req, res);
    if (a === 'guide') {   // guest guide (/g/<slug>): the guide's content + today's activities from the venue's member page
      const g = require('./_guides').get(String((req.query && req.query.g) || '').replace(/[^a-z0-9-]/gi, '').slice(0, 30));
      if (!g) return L.send(res, 404, { ok: false });
      const pro = g.member ? require('./_prospects').get(g.member) : null;
      const acts = ((pro && pro.acts) || []).map(x => ({ title: x.title, line: x.line || '', every: x.every, start: x.start || '', end: x.end || '', venue: x.venue || '' }));
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
      return L.send(res, 200, Object.assign({ ok: true, acts }, g, { member: undefined }));
    }   // demo keyrings: guest page with the venue's own link preview
    if (a === 'demo') {   // the Mavis demo company dressed as a sales prospect (only demo content that is already public on its sample keyring)
      const sd = require('./_prospects').seed(String((req.query && req.query.as) || '').replace(/[^a-z]/g, ''), String((req.query && req.query.d) || '').replace(/[^0-9-]/g, '').slice(0, 10) || new Date().toISOString().slice(0, 10));
      return sd ? L.send(res, 200, Object.assign({ ok: true }, sd)) : L.send(res, 404, { ok: false });
    }
    if (a === 'sub') return await subscribe(req, res);
    if (a === 'img') return await photo(req, res);
    if (a === 'hit') return await hit(req, res);
    if (a === 'offers') return await offers(req, res);
    if (a === 'fb') return await feedback(req, res);
    if (a === 'roster') return await roster(req, res);
    if (a === 'mf') {   // the guest page saved to a phone's home screen: its own app per venue - their logo, their name, opens on this member's page
      const q = req.query || {}, code = String(q.c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16), name = String(q.n || 'Members Club').replace(/[<>"]/g, '').trim().slice(0, 40);
      const col = /^#[0-9a-f]{6}$/i.test(String(q.t || '')) ? q.t : '#0F1E2E';
      if (!code) return res.status(404).end();
      const pro = require('./_prospects').get(code);
      const icon = pro && pro.logo ? pro.logo : '/api/gp?a=icon&c=' + code;   // a plain image file where we have one (phones are fussy about icons behind redirects)
      const icons = pro && pro.icon ? [{ src: pro.icon + '-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: pro.icon + '-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }] : null;
      res.setHeader('Content-Type', 'application/manifest+json'); res.setHeader('Cache-Control', 'public, max-age=300');
      return res.status(200).send(JSON.stringify({ id: '/k/' + code, name: name + ' Membership', short_name: 'Membership',   // under the icon: never clashes with the venue's own app; their logo says whose it is
        start_url: '/k/' + code + '?home=1', scope: '/k/' + code, display: 'standalone',
        background_color: col, theme_color: col, icons: icons || [{ src: icon, sizes: '192x192', type: /\.png$/.test(icon) ? 'image/png' : undefined, purpose: 'any' }, { src: icon, sizes: '512x512', type: /\.png$/.test(icon) ? 'image/png' : undefined, purpose: 'any' }] }));
    }
    if (a === 'icon') {   // the venue's own logo as the app icon on the guest's home screen (Mavis icon if they have none)
      const code = String((req.query && req.query.c) || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
      const back = () => { res.setHeader('Cache-Control', 'public, max-age=3600'); res.writeHead(302, { Location: '/icon-512-v6.png' }); res.end(); };
      const pro = require('./_prospects').get(code);
      if (pro && pro.logo) { res.setHeader('Cache-Control', 'public, max-age=86400'); res.writeHead(302, { Location: pro.logo }); return res.end(); }
      const kr = code ? (await L.db('member_keyrings?select=company_id&code=eq.' + encodeURIComponent(code)).catch(() => []))[0] : null;
      const co = kr ? (await L.db('companies?select=logo&id=eq.' + encodeURIComponent(kr.company_id)).catch(() => []))[0] : null;
      const lg = String((co && co.logo) || '');
      const m = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(lg);
      if (m) { res.setHeader('Content-Type', m[1]); res.setHeader('Cache-Control', 'public, max-age=86400'); return res.status(200).send(Buffer.from(m[2], 'base64')); }
      if (/^https:\/\/[^\s"'<>]+$/.test(lg)) { res.setHeader('Cache-Control', 'public, max-age=86400'); res.writeHead(302, { Location: lg }); return res.end(); }
      return back();
    }
    res.status(404).end();
  } catch (e) { try { res.status(404).end(); } catch (x) {} }
};
