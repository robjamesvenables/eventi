// Phone notifications for Chat.
//   POST { msg_id }  - called by the sender's app right after a message is saved.
// Works out who should be notified (everyone in that chat except the sender, skipping muted chats
// and quiet hours - an @mention still gets through a muted chat), then sends to each of their devices.
// Needs the Vercel env var VAPID_PRIVATE_KEY (the public key is below and in the app).
const L = require('./_lib');
const webpush = require('web-push');

const VAPID_PUBLIC = 'BGfKLEwZ6ZDqoozMUz2jqNJonJni6l-sA2FU8yHkUAm5FnnwHb44ZGBlEolJXr4QSZospqPa1_z-N2dMjTtKCJc';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';

function inQuiet(pref, now){
  if(!pref || !pref.quiet_from || !pref.quiet_to) return false;
  let hm;
  try { hm = now.toLocaleTimeString('en-GB', { timeZone: pref.tz || 'Asia/Makassar', hour: '2-digit', minute: '2-digit', hour12: false }); }
  catch (e) { return false; }
  const f = pref.quiet_from, t = pref.quiet_to;
  return f <= t ? (hm >= f && hm < t) : (hm >= f || hm < t);   // e.g. 23:00 - 07:00 wraps past midnight
}
function isMuted(pref, threadId, now){
  const m = pref && pref.muted && pref.muted[threadId];
  if(!m) return false;
  return m === 'always' || new Date(m) > now;
}
function preview(msg){
  if(msg.body) return msg.body.length > 140 ? msg.body.slice(0, 137) + '…' : msg.body;
  return { image: 'Photo', video: 'Video', voice: 'Voice note' }[msg.attachment_type] || ('Document: ' + (msg.attachment_name || 'file'));
}
const fullName = p => ((p.first_name || '') + ' ' + (p.last_name || '')).trim();

module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, { ok: false });
  if (!L.SERVICE_KEY) return L.send(res, 503, { ok: false, reason: 'notset' });
  if (!VAPID_PRIVATE) return L.send(res, 200, { ok: false, reason: 'notifications not switched on yet' });
  try {
    const me = await L.caller(req);
    if (!me) return L.send(res, 401, { ok: false });
    const b = L.body(req);
    // "Send me a test" from My Account: notify only my own devices and say exactly what happened
    if (b.test) {
      const subs = await L.db('push_subs?select=*&profile_id=eq.' + encodeURIComponent(me.id));
      if (!subs.length) return L.send(res, 200, { ok: false, reason: 'no-devices' });
      webpush.setVapidDetails('mailto:hello@getmavis.co', VAPID_PUBLIC, VAPID_PRIVATE);
      let sent = 0; const errors = [];
      for (const s of subs) {
        try {
          await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            JSON.stringify({ title: 'Mavis', body: 'Test notification - it works ✓', force: true, url: '/' }), { TTL: 600, urgency: 'high' });
          sent++;
        } catch (e) {
          errors.push(e.statusCode || e.message);
          if (e.statusCode === 404 || e.statusCode === 410) await L.db('push_subs?endpoint=eq.' + encodeURIComponent(s.endpoint), { method: 'DELETE' }).catch(() => {});
        }
      }
      return L.send(res, 200, { ok: sent > 0, sent, devices: subs.length, errors });
    }
    const msg = (await L.db('chat_msgs?select=*&id=eq.' + encodeURIComponent(b.msg_id || '')))[0];
    // only the person who sent it, and only straight after sending
    if (!msg || msg.sender_id !== me.id || msg.deleted_at || Date.now() - new Date(msg.created_at).getTime() > 3 * 60000) return L.send(res, 200, { ok: true, sent: 0 });
    const thread = (await L.db('chat_threads?select=*&id=eq.' + msg.thread_id))[0];
    if (!thread || String(thread.company_id) !== String(me.company_id)) return L.send(res, 200, { ok: true, sent: 0 });

    const memberIds = (await L.db('rpc/chat_member_ids', { method: 'POST', body: { th: thread.id } })).map(x => typeof x === 'object' ? Object.values(x)[0] : x);
    const others = memberIds.filter(id => String(id) !== String(me.id));
    if (!others.length) return L.send(res, 200, { ok: true, sent: 0 });
    const list = others.map(encodeURIComponent).join(',');
    const [people, prefs, subs] = await Promise.all([
      L.db('profiles?select=id,first_name,last_name,active&id=in.(' + list + ')'),
      L.db('chat_prefs?select=*&profile_id=in.(' + list + ')'),
      L.db('push_subs?select=*&profile_id=in.(' + list + ')')
    ]);
    const prefBy = {}; prefs.forEach(p => prefBy[p.profile_id] = p);
    const personBy = {}; people.forEach(p => personBy[p.id] = p);
    const now = new Date();
    const body = msg.body ? msg.body.toLowerCase() : '';
    const mentioned = id => personBy[id] && body.includes('@' + fullName(personBy[id]).toLowerCase());

    const groupName = thread.kind === 'direct' ? null : (thread.name || 'Group');
    const title = groupName ? (me.first_name || 'Someone') + ' · ' + groupName : (fullName(me) || 'New message');
    webpush.setVapidDetails('mailto:hello@getmavis.co', VAPID_PUBLIC, VAPID_PRIVATE);

    let sent = 0;
    await Promise.all(subs.map(async s => {
      const pid = s.profile_id, pref = prefBy[pid];
      if (!personBy[pid] || personBy[pid].active === false) return;
      if (inQuiet(pref, now)) return;
      if (isMuted(pref, thread.id, now) && !mentioned(pid)) return;
      const payload = JSON.stringify({ title, body: (mentioned(pid) ? '@you · ' : '') + preview(msg), thread: thread.id, url: '/?chat=' + thread.id });
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 3600, urgency: 'high', topic: String(thread.id).replace(/-/g, '').slice(0, 32) });
        sent++;
      } catch (e) {
        // phone uninstalled the app or turned notifications off - forget that device
        if (e.statusCode === 404 || e.statusCode === 410) await L.db('push_subs?endpoint=eq.' + encodeURIComponent(s.endpoint), { method: 'DELETE' }).catch(() => {});
        else console.warn('push failed', e.statusCode, e.body);
      }
    }));
    return L.send(res, 200, { ok: true, sent });
  } catch (e) {
    console.error('push error', e.message);
    return L.send(res, 500, { ok: false });
  }
};
