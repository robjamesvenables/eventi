// Membership keyring card - what a guest sees when they scan their own keyring (no login).
// GET /api/member-card?code=5NKGZJ  ->  { ok, brand, first, tier, visits, favourite, since, perks, venues }
// Only first name + initial, tier, visit count and perks - never phone, email, birthday or notes.
const L = require('./_lib');

const clean = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);

module.exports = async (req, res) => {
  try {
    const code = clean((req.query && req.query.code) || '');
    if (!code) return L.send(res, 400, { ok: false, reason: 'no code' });
    const k = (await L.db('member_keyrings?select=code,company_id,member_id&code=eq.' + encodeURIComponent(code)))[0];
    if (!k) return L.send(res, 200, { ok: false, reason: 'unknown' });
    const [co, settings] = await Promise.all([
      L.db('companies?select=name&id=eq.' + encodeURIComponent(k.company_id)).catch(() => []),
      L.db('app_settings?select=value&key=eq.member_perks&company_id=eq.' + encodeURIComponent(k.company_id)).catch(() => [])
    ]);
    const brand = (co[0] && co[0].name) || 'Members Club';
    let perks = {};
    try { const v = settings[0] && settings[0].value; perks = (typeof v === 'string' ? JSON.parse(v) : v) || {}; } catch (e) {}
    if (!k.member_id) return L.send(res, 200, { ok: true, blank: true, brand });
    const m = (await L.db('members?select=id,name,tier,created_at&id=eq.' + encodeURIComponent(k.member_id)))[0];
    if (!m) return L.send(res, 200, { ok: true, blank: true, brand });
    const visits = await L.db('member_visits?select=venue&member_id=eq.' + encodeURIComponent(m.id) + '&limit=5000').catch(() => []);
    const byVenue = {};
    visits.forEach(v => { const n = v.venue || 'Other'; byVenue[n] = (byVenue[n] || 0) + 1; });
    const favourite = Object.keys(byVenue).sort((a, b) => byVenue[b] - byVenue[a])[0] || '';
    const parts = String(m.name || '').trim().split(/\s+/);
    const first = parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
    const tier = m.tier === 'vip' ? 'vip' : 'member';
    return L.send(res, 200, { ok: true, brand, code, first, tier, visits: visits.length, favourite,
      since: new Date(m.created_at).getFullYear(), perks: Array.isArray(perks[tier]) ? perks[tier].slice(0, 8) : [] });
  } catch (e) {
    console.error(e);
    return L.send(res, 500, { ok: false, reason: 'error' });
  }
};
