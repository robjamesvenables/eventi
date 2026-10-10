// POST { username, secret } -> { session, profile }   (username can also be the boss's email)
// 5 wrong tries locks that username for 15 minutes.
const L = require('./_lib');
module.exports = async (req, res) => {
  // GET = "are real logins switched on yet?" (the app keeps the old demo login until they are)
  if (req.method === 'GET') return L.send(res, 200, { ready: !!L.SERVICE_KEY });
  if (req.method !== 'POST') return L.send(res, 405, { ok: false });
  if (!L.SERVICE_KEY) return L.send(res, 503, { ok: false, reason: 'notset' });
  const { username, secret } = L.body(req);
  const raw = String(username || '').trim();
  if (!raw || !secret) return L.send(res, 400, { ok: false, reason: 'missing' });
  try {
    const isEmail = raw.includes('@');
    const q = isEmail ? 'email=eq.' + encodeURIComponent(raw.toLowerCase()) : 'username=eq.' + encodeURIComponent(raw.toUpperCase());
    const rows = await L.db('profiles?select=*&' + q + '&limit=1');
    const p = rows && rows[0];
    const key = p ? p.username : raw.toUpperCase();
    const att = (await L.db('login_attempts?select=*&username=eq.' + encodeURIComponent(key)))[0];
    if (att && att.locked_until && new Date(att.locked_until) > new Date()) {
      return L.send(res, 429, { ok: false, reason: 'locked', until: att.locked_until });
    }
    const fail = async () => {
      const fails = (att ? att.fails : 0) + 1;
      const row = { username: key, fails: fails >= 5 ? 0 : fails, locked_until: fails >= 5 ? new Date(Date.now() + 15 * 60000).toISOString() : null };
      await L.db('login_attempts', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: row });
      return L.send(res, 401, { ok: false, reason: fails >= 5 ? 'locked' : 'wrong', left: Math.max(0, 5 - fails) });
    };
    if (!p || !p.user_id) return fail();
    if (!p.active) return L.send(res, 403, { ok: false, reason: 'inactive' });
    const session = await L.passwordGrant(L.authEmailFor(p.username), secret);
    if (!session) return fail();
    if (att) await L.db('login_attempts?username=eq.' + encodeURIComponent(key), { method: 'DELETE' });
    await L.db('profiles?id=eq.' + p.id, { method: 'PATCH', body: { last_login: new Date().toISOString() } });
    const co = (await L.db('companies?select=id,code,name&id=eq.' + p.company_id))[0] || null;
    return L.send(res, 200, { ok: true, session, profile: L.publicProfile(p), company: co });
  } catch (e) {
    console.error('login error', e.message);
    return L.send(res, 500, { ok: false, reason: 'error' });
  }
};
