// Runs every minute (started by the Supabase scheduler - see the setup SQL).
// Event timeline alerts: a timeline row with a bell tells its department(s) X minutes before it starts.
// Each alert is sent once (remembered in the alerts_sent table). Times are Bali time (Asia/Makassar).
const L = require('./_lib');
const webpush = require('web-push');

const VAPID_PUBLIC = 'BGfKLEwZ6ZDqoozMUz2jqNJonJni6l-sA2FU8yHkUAm5FnnwHb44ZGBlEolJXr4QSZospqPa1_z-N2dMjTtKCJc';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
const TZ = 'Asia/Makassar';

const clean = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => { const m = tag.match(new RegExp(name + '="([^"]*)"')); return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"') : ''; };
function localNow(){
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const g = t => (parts.find(p => p.type === t) || {}).value;
  return { date: g('year') + '-' + g('month') + '-' + g('day'), mins: (Number(g('hour')) % 24) * 60 + Number(g('minute')) };
}
// Timeline rows from the saved plan HTML: time, what, departments, minutes before
function timelineRows(html){
  const out = [];
  String(html || '').split(/(?=<div class="rd-item)/).forEach(chunk => {
    if (!chunk.startsWith('<div class="rd-item')) return;
    const tag = chunk.slice(0, chunk.indexOf('>') + 1);
    const depts = attr(tag, 'data-alert').split('|').map(s => s.trim()).filter(Boolean);
    if (!depts.length) return;
    const before = Math.max(1, Math.min(120, parseInt(attr(tag, 'data-mins'), 10) || 10));
    const t = (chunk.match(/class="rd-time"[^>]*>([\s\S]*?)<\/div>/) || [])[1];
    const a = (chunk.match(/class="rd-act"[^>]*>([\s\S]*?)<\/div>/) || [])[1];
    const tm = clean(t).match(/(\d{1,2})[:.](\d{2})/);
    if (!tm) return;
    out.push({ time: tm[1].padStart(2, '0') + ':' + tm[2], start: Number(tm[1]) * 60 + Number(tm[2]), what: clean(a), depts, before });
  });
  return out;
}
async function sendTo(profileIds, payload, log){
  if (!profileIds.length) return 0;
  const subs = await L.db('push_subs?select=*&profile_id=in.(' + profileIds.map(encodeURIComponent).join(',') + ')').catch(() => []);
  let sent = 0;
  await Promise.all(subs.map(async s => {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 1800, urgency: 'high' }); sent++; }
    catch (e) { if (e.statusCode === 404 || e.statusCode === 410) await L.db('push_subs?endpoint=eq.' + encodeURIComponent(s.endpoint), { method: 'DELETE' }).catch(() => {}); }
  }));
  return sent;
}
// remember it - returns false if it was already sent (so it never goes twice)
async function claim(key){
  try { await L.db('alerts_sent', { method: 'POST', body: { key } }); return true; }
  catch (e) { return false; }
}

module.exports = async (req, res) => {
  if (!L.SERVICE_KEY || !VAPID_PRIVATE) return L.send(res, 503, { ok: false, reason: 'notset' });
  // only the Supabase scheduler can run this (it sends the secret saved by the setup SQL)
  const given = String(req.headers['x-cron-key'] || '');
  const row = given.length > 20 ? (await L.db('cron_secret?select=key&limit=1').catch(() => []))[0] : null;
  if (!row || row.key !== given) return L.send(res, 401, { ok: false });
  webpush.setVapidDetails('mailto:hello@getmavis.co', VAPID_PUBLIC, VAPID_PRIVATE);
  const now = localNow(), done = [];

  // 1. Event timeline alerts (today's events)
  const events = await L.db('events?select=id,name,company_id,plan,event_date&event_date=eq.' + now.date).catch(() => []);
  const peopleBy = {};
  for (const ev of events) {
    const rows = timelineRows(ev.plan && ev.plan.timeline);
    for (const r of rows) {
      const at = r.start - r.before;
      if (!(now.mins >= at && now.mins <= r.start)) continue;   // due now - or late (e.g. a row added 2 min before) but before it starts
      if (!(await claim('ev:' + ev.id + ':' + now.date + ':' + r.time + ':' + r.what.slice(0, 60)))) continue;
      if (!peopleBy[ev.company_id]) peopleBy[ev.company_id] = await L.db('profiles?select=id,departments&active=eq.true&company_id=eq.' + encodeURIComponent(ev.company_id)).catch(() => []);
      const to = peopleBy[ev.company_id].filter(p => (Array.isArray(p.departments) ? p.departments : []).some(d => r.depts.includes(d))).map(p => p.id);
      const left = r.start - now.mins;
      const sent = await sendTo(to, { title: (left > 0 ? 'In ' + left + ' min · ' : 'Now · ') + r.time + ' ' + (r.what || 'Timeline'), body: ev.name + ' · for ' + r.depts.join(', '), thread: 'ev-' + ev.id, url: '/?event=' + ev.id });
      done.push({ event: ev.name, time: r.time, people: to.length, sent });
    }
  }

  return L.send(res, 200, { ok: true, at: now, done });
};
