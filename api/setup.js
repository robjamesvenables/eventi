// Invite / reset links.  GET ?t=TOKEN -> who it's for.  POST { t, secret } -> sets the PIN/password and signs in.
const L = require('./_lib');
module.exports = async (req, res) => {
  if (!L.SERVICE_KEY) return L.send(res, 503, { ok: false, reason: 'notset' });
  const t = req.method === 'GET' ? String((req.query && req.query.t) || '') : String(L.body(req).t || '');
  if (t.length < 20) return L.send(res, 400, { ok: false, reason: 'invalid' });
  try {
    const inv = (await L.db('invites?select=*&token=eq.' + encodeURIComponent(t)))[0];
    if (!inv || inv.used_at || new Date(inv.expires_at) < new Date()) return L.send(res, 410, { ok: false, reason: inv && inv.used_at ? 'used' : 'expired' });
    const p = (await L.db('profiles?select=*&id=eq.' + inv.profile_id))[0];
    if (!p || !p.active) return L.send(res, 410, { ok: false, reason: 'inactive' });
    const co = (await L.db('companies?select=id,code,name&id=eq.' + p.company_id))[0] || null;
    const kind = L.PIN_ROLES.includes(p.role) ? 'pin' : 'password';
    if (req.method === 'GET') {
      return L.send(res, 200, { ok: true, first_name: p.first_name, username: p.username, kind, company: co ? co.name : '', reset: !!p.user_id });
    }
    if (req.method !== 'POST') return L.send(res, 405, { ok: false });
    const secret = String(L.body(req).secret || '');
    const bad = L.secretOk(p.role, secret);
    if (bad) return L.send(res, 400, { ok: false, reason: 'weak', message: bad });
    const email = L.authEmailFor(p.username);
    let userId = p.user_id;
    if (userId) {
      await L.authAdmin('users/' + userId, { method: 'PUT', body: { password: secret, ban_duration: 'none' } });
    } else {
      const u = await L.authAdmin('users', { method: 'POST', body: { email, password: secret, email_confirm: true, user_metadata: { username: p.username } } });
      userId = u.id || (u.user && u.user.id);
      await L.db('profiles?id=eq.' + p.id, { method: 'PATCH', body: { user_id: userId } });
    }
    await L.db('invites?token=eq.' + encodeURIComponent(t), { method: 'PATCH', body: { used_at: new Date().toISOString() } });
    await L.db('login_attempts?username=eq.' + encodeURIComponent(p.username), { method: 'DELETE' });
    const session = await L.passwordGrant(email, secret);
    await L.db('profiles?id=eq.' + p.id, { method: 'PATCH', body: { last_login: new Date().toISOString() } });
    const fresh = (await L.db('profiles?select=*&id=eq.' + p.id))[0];
    return L.send(res, 200, { ok: true, session, profile: L.publicProfile(fresh), company: co });
  } catch (e) {
    console.error('setup error', e.message);
    return L.send(res, 500, { ok: false, reason: 'error' });
  }
};
