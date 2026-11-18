// Tell the Mavis owner's phone when a problem is reported (from the staff app or a guest page).
// At most one alert an hour, so a bad day doesn't buzz the phone non-stop - the Owner page (Health) has the full list.
const L = require('./_lib');
const VAPID_PUBLIC = 'BGfKLEwZ6ZDqoozMUz2jqNJonJni6l-sA2FU8yHkUAm5FnnwHb44ZGBlEolJXr4QSZospqPa1_z-N2dMjTtKCJc';

module.exports = async function ownerAlert(companyId, where){
  try {
    const KEY = process.env.VAPID_PRIVATE_KEY || ''; if (!KEY) return;
    const last = (await L.db('owner_settings?select=value&key=eq.err_alert_at').catch(() => []))[0];
    const at = last && last.value && Date.parse(last.value.at);
    if (at && Date.now() - at < 3600000) return;   // already told them this hour
    await L.db('owner_settings', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: { key: 'err_alert_at', value: { at: new Date().toISOString() } } });
    const owners = await L.db('profiles?select=id&is_owner=eq.true&active=eq.true');
    if (!owners.length) return;
    const subs = await L.db('push_subs?select=*&profile_id=in.(' + owners.map(o => encodeURIComponent(o.id)).join(',') + ')');
    if (!subs.length) return;
    const co = companyId ? (await L.db('companies?select=name&id=eq.' + encodeURIComponent(companyId)).catch(() => []))[0] : null;
    const webpush = require('web-push');
    webpush.setVapidDetails('mailto:hello@getmavis.co', VAPID_PUBLIC, KEY);
    const payload = JSON.stringify({ title: 'Mavis · something went wrong', body: (co && co.name ? co.name : 'A venue') + ' · ' + where + '. Open the Owner page to see it.', url: '/owner.html', thread: 'mavis-health', force: true });
    await Promise.all(subs.map(s => webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 86400, urgency: 'high' }).catch(() => {})));
  } catch (e) { console.error('owner alert failed', e.message); }
};
