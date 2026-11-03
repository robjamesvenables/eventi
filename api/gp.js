// Guest page helpers for guests who aren't signed in (one function, to stay under Vercel's limit):
//   GET /api/gp?a=img&c=<company id>&p=<file path>   a photo on the guest page. Only serves a file that really is
//       on that company's guest page right now, by sending the browser to a short-lived private link.
//   GET /api/gp?a=hit&code=<keyring>&i=<card id>      a guest tapped Book / Tickets / WhatsApp on a card - counted for
//       the Numbers screen. Nothing personal is stored: just the company, which card and when.
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

module.exports = async (req, res) => {
  try {
    const a = String((req.query && req.query.a) || '');
    if (a === 'img') return await photo(req, res);
    if (a === 'hit') return await hit(req, res);
    res.status(404).end();
  } catch (e) { try { res.status(404).end(); } catch (x) {} }
};
