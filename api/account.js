// "My Account" - things a signed-in person can do for themselves.
//   POST { action:'change_secret', current, secret }  -> change own PIN/password (current one required)
//   POST { action:'photo', photo }                    -> change own photo ('' removes it)
//   POST { action:'logout_all' }                      -> sign out on every device
// 5 wrong "current" tries locks the account's login for 15 minutes (same rule as signing in).
const L = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, { ok: false });
  if (!L.SERVICE_KEY) return L.send(res, 503, { ok: false, reason: 'notset' });
  try {
    const me = await L.caller(req);
    if (!me) return L.send(res, 401, { ok: false, reason: 'not signed in' });
    const b = L.body(req);
    const token = (req.headers.authorization || '').slice(7);

    if (b.action === 'change_secret') {
      const key = me.username;
      const att = (await L.db('login_attempts?select=*&username=eq.' + encodeURIComponent(key)))[0];
      if (att && att.locked_until && new Date(att.locked_until) > new Date()) {
        return L.send(res, 429, { ok: false, reason: 'locked', message: 'Too many wrong tries - please wait 15 minutes.' });
      }
      const email = L.authEmailFor(me.username);
      const check = await L.signInProfile(me, String(b.current || ''));
      if (!check) {
        const fails = (att ? att.fails : 0) + 1;
        await L.db('login_attempts', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' },
          body: { username: key, fails: fails >= 5 ? 0 : fails, locked_until: fails >= 5 ? new Date(Date.now() + 15 * 60000).toISOString() : null } });
        return L.send(res, 401, { ok: false, reason: 'wrong', message: fails >= 5 ? 'Too many wrong tries - please wait 15 minutes.' : 'Your current one is not right.' });
      }
      if (att) await L.db('login_attempts?username=eq.' + encodeURIComponent(key), { method: 'DELETE' });
      const bad = L.secretOk(me.role, b.secret);
      if (bad) return L.send(res, 400, { ok: false, reason: 'weak', message: bad });
      if (String(b.secret) === String(b.current)) return L.send(res, 400, { ok: false, reason: 'same', message: 'Please choose a new one, different from your current one.' });
      await L.authAdmin('users/' + me.user_id, { method: 'PUT', body: { password: L.authSecret(me.id, String(b.secret)) } });
      // Sign out every OTHER device, then hand this device a fresh session.
      await fetch(L.SUPABASE_URL + '/auth/v1/logout?scope=others', { method: 'POST', headers: { apikey: L.ANON_KEY, Authorization: 'Bearer ' + token } }).catch(() => {});
      const session = await L.passwordGrant(email, L.authSecret(me.id, String(b.secret)));
      return L.send(res, 200, { ok: true, session });
    }

    if (b.action === 'photo') {
      const photo = String(b.photo || '');
      if (photo && (!photo.startsWith('data:image/') || photo.length > 3000000)) return L.send(res, 400, { ok: false, reason: 'bad photo', message: 'That photo could not be used - please try another.' });
      const p = (await L.db('profiles?id=eq.' + me.id, { method: 'PATCH', body: { photo: photo || null } }))[0];
      return L.send(res, 200, { ok: true, profile: L.publicProfile(p) });
    }

    if (b.action === 'seen') {
      // "Last active" for the owner page - at most once every 10 minutes per person
      if (!me.last_seen || Date.now() - new Date(me.last_seen).getTime() > 10 * 60000) {
        await L.db('profiles?id=eq.' + me.id, { method: 'PATCH', body: { last_seen: new Date().toISOString() } }).catch(() => {});
      }
      return L.send(res, 200, { ok: true });
    }

    if (b.action === 'report_error') {
      const msg = String(b.message || '').slice(0, 500);
      if (msg) await L.db('app_errors', { method: 'POST', body: { company_id: me.company_id, username: me.username, page: String(b.page || '').slice(0, 60), message: msg } }).catch(() => {});
      return L.send(res, 200, { ok: true });
    }

    if (b.action === 'logout_all') {
      await fetch(L.SUPABASE_URL + '/auth/v1/logout?scope=global', { method: 'POST', headers: { apikey: L.ANON_KEY, Authorization: 'Bearer ' + token } });
      return L.send(res, 200, { ok: true });
    }

    return L.send(res, 400, { ok: false, reason: 'unknown action' });
  } catch (e) {
    console.error('account error', e.message);
    return L.send(res, 500, { ok: false, reason: 'error' });
  }
};
