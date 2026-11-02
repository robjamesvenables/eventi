// A file from an event's Board, for the client link page.
//   GET /api/board-file?t=<client link token>&p=<file path>
// Only works while that event's client link is on, the Board is switched to "shown to client",
// and the file really is on that event's Board. Sends the browser to a short-lived private link.
const L = require('./_lib');
const BUCKET = 'shared-files';

module.exports = async (req, res) => {
  try {
    const t = String((req.query && req.query.t) || ''), p = String((req.query && req.query.p) || '');
    if (t.length < 20 || !p || p.length > 400 || /\.\./.test(p) || !L.SERVICE_KEY) { res.status(404).end(); return; }
    const ev = (await L.db('events?select=share_on,share_settings,plan&share_token=eq.' + encodeURIComponent(t) + '&limit=1'))[0];
    const st = (ev && ev.share_settings) || {};
    const items = (ev && ev.plan && ev.plan.board && Array.isArray(ev.plan.board.items)) ? ev.plan.board.items : [];
    const onBoard = items.some(it => (it.files || []).some(f => f && f.path === p));
    if (!ev || !ev.share_on || !st.board || !onBoard) { res.status(404).end(); return; }
    const r = await fetch(L.SUPABASE_URL + '/storage/v1/object/sign/' + BUCKET + '/' + p.split('/').map(encodeURIComponent).join('/'), {
      method: 'POST', headers: Object.assign(L.serviceHeaders(), { 'Content-Type': 'application/json' }), body: JSON.stringify({ expiresIn: 3600 })
    });
    const d = await r.json().catch(() => ({}));
    const u = d.signedURL || d.signedUrl;
    if (!r.ok || !u) { res.status(404).end(); return; }
    res.setHeader('Cache-Control', 'private, max-age=1800');
    res.writeHead(302, { Location: L.SUPABASE_URL + '/storage/v1' + (u.startsWith('/') ? u : '/' + u) });
    res.end();
  } catch (e) { res.status(404).end(); }
};
