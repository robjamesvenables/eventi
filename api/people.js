// Admin actions on people (managers and above only). POST { action, ... } with the caller's session token.
//  create   { first_name, last_name, role, departments, venues, email } -> { profile, link }
//  update   { id, first_name, last_name, role, departments, venues, email }
//  reset    { id } -> { link }          new one-time link to choose a new PIN/password
//  deactivate / reactivate { id }
//  company  { name, code, boss_first, boss_last, boss_email }  (Mavis owner only) -> new client + boss link
//  departments { departments: [...] }   (Directors and above) -> saves the company's department list
const L = require('./_lib');

async function makeInvite(profileId, createdBy){
  const token = L.newToken();
  await L.db('invites', { method: 'POST', body: { token, profile_id: profileId, created_by: createdBy, expires_at: new Date(Date.now() + 48 * 3600000).toISOString() } });
  return token;
}
async function uniqueUsername(code, first, last){
  const base = [code, L.slug(first), L.slug(last)].filter(Boolean).join('-');
  let name = base, n = 2;
  while ((await L.db('profiles?select=id&username=eq.' + encodeURIComponent(name))).length) { name = base + '-' + n; n++; }
  return name;
}
function cleanList(v){ return Array.isArray(v) ? v.map(x => String(x).trim()).filter(Boolean).slice(0, 40) : []; }

module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, { ok: false });
  if (!L.SERVICE_KEY) return L.send(res, 503, { ok: false, reason: 'notset' });
  try {
    const me = await L.caller(req);
    if (!me) return L.send(res, 401, { ok: false, reason: 'login' });
    const b = L.body(req);
    const myRank = me.is_owner ? 99 : (L.ROLE_RANK[me.role] || 0);
    if (myRank < L.MANAGE_MIN_RANK) return L.send(res, 403, { ok: false, reason: 'not allowed' });

    if (b.action === 'company') {
      if (!me.is_owner) return L.send(res, 403, { ok: false, reason: 'owner only' });
      const code = L.slug(b.code).replace(/-/g, '').slice(0, 12);
      if (!code || !b.name || !b.boss_first || !b.boss_email) return L.send(res, 400, { ok: false, reason: 'missing' });
      if ((await L.db('companies?select=id&code=eq.' + code)).length) return L.send(res, 409, { ok: false, reason: 'code taken' });
      const co = (await L.db('companies', { method: 'POST', body: { code, name: String(b.name).trim() } }))[0];
      const username = await uniqueUsername(code, b.boss_first, b.boss_last);
      const p = (await L.db('profiles', { method: 'POST', body: { company_id: co.id, username, first_name: String(b.boss_first).trim(), last_name: String(b.boss_last || '').trim(), role: 'superadmin', email: String(b.boss_email).trim().toLowerCase() } }))[0];
      const token = await makeInvite(p.id, me.id);
      return L.send(res, 200, { ok: true, company: co, profile: L.publicProfile(p), token });
    }

    if (b.action === 'departments') {
      if (!me.is_owner && myRank < 5) return L.send(res, 403, { ok: false, reason: 'not allowed' });
      const list = cleanList(b.departments);
      const co = (await L.db('companies?id=eq.' + me.company_id, { method: 'PATCH', body: { departments: list } }))[0];
      return L.send(res, 200, { ok: true, departments: co.departments });
    }

    const target = b.id ? (await L.db('profiles?select=*&id=eq.' + encodeURIComponent(b.id)))[0] : null;
    if (b.action !== 'create') {
      if (!target) return L.send(res, 404, { ok: false, reason: 'not found' });
      if (!me.is_owner && target.company_id !== me.company_id) return L.send(res, 403, { ok: false, reason: 'not allowed' });
      // You can only manage people below your own level (the boss can manage everyone).
      if (!me.is_owner && me.role !== 'superadmin' && (L.ROLE_RANK[target.role] || 0) >= myRank && target.id !== me.id) return L.send(res, 403, { ok: false, reason: 'higher role' });
    }
    const wantRole = b.role || (target && target.role) || 'teammember';
    if (!L.ROLE_RANK[wantRole]) return L.send(res, 400, { ok: false, reason: 'bad role' });
    if (!me.is_owner && me.role !== 'superadmin' && L.ROLE_RANK[wantRole] >= myRank) return L.send(res, 403, { ok: false, reason: 'cannot give that role' });
    if (wantRole === 'superadmin' && !me.is_owner && me.role !== 'superadmin') return L.send(res, 403, { ok: false, reason: 'cannot give that role' });

    if (b.action === 'create') {
      if (!b.first_name) return L.send(res, 400, { ok: false, reason: 'missing' });
      const companyId = (me.is_owner && b.company_id) ? b.company_id : me.company_id;
      const co = (await L.db('companies?select=*&id=eq.' + companyId))[0];
      const username = await uniqueUsername(co.code, b.first_name, b.last_name);
      if (wantRole === 'superadmin' && !b.email) return L.send(res, 400, { ok: false, reason: 'email needed', message: 'A Super Admin needs an email address' });
      const p = (await L.db('profiles', { method: 'POST', body: {
        company_id: companyId, username, first_name: String(b.first_name).trim(), last_name: String(b.last_name || '').trim(), role: wantRole,
        departments: cleanList(b.departments), venues: cleanList(b.venues), email: b.email ? String(b.email).trim().toLowerCase() : null, photo: b.photo || null } }))[0];
      const token = await makeInvite(p.id, me.id);
      return L.send(res, 200, { ok: true, profile: L.publicProfile(p), token });
    }
    if (b.action === 'update') {
      const patch = { role: wantRole };
      if (b.first_name !== undefined) patch.first_name = String(b.first_name).trim();
      if (b.last_name !== undefined) patch.last_name = String(b.last_name || '').trim();
      if (b.departments !== undefined) patch.departments = cleanList(b.departments);
      if (b.venues !== undefined) patch.venues = cleanList(b.venues);
      if (b.email !== undefined) patch.email = b.email ? String(b.email).trim().toLowerCase() : null;
      if (b.photo !== undefined) patch.photo = b.photo || null;
      if (wantRole === 'superadmin' && !(patch.email || target.email)) return L.send(res, 400, { ok: false, reason: 'email needed', message: 'A Super Admin needs an email address' });
      const p = (await L.db('profiles?id=eq.' + target.id, { method: 'PATCH', body: patch }))[0];
      return L.send(res, 200, { ok: true, profile: L.publicProfile(p) });
    }
    if (b.action === 'reset') {
      await L.db('invites?profile_id=eq.' + target.id + '&used_at=is.null', { method: 'DELETE' });
      const token = await makeInvite(target.id, me.id);
      return L.send(res, 200, { ok: true, token, kind: L.PIN_ROLES.includes(target.role) ? 'pin' : 'password' });
    }
    if (b.action === 'deactivate' || b.action === 'reactivate') {
      if (target.id === me.id) return L.send(res, 400, { ok: false, reason: 'yourself' });
      const active = b.action === 'reactivate';
      const p = (await L.db('profiles?id=eq.' + target.id, { method: 'PATCH', body: { active } }))[0];
      if (target.user_id) await L.authAdmin('users/' + target.user_id, { method: 'PUT', body: { ban_duration: active ? 'none' : '876000h' } });
      if (!active) await L.db('invites?profile_id=eq.' + target.id + '&used_at=is.null', { method: 'DELETE' });
      return L.send(res, 200, { ok: true, profile: L.publicProfile(p) });
    }
    return L.send(res, 400, { ok: false, reason: 'unknown action' });
  } catch (e) {
    console.error('people error', e.message);
    return L.send(res, 500, { ok: false, reason: 'error' });
  }
};
