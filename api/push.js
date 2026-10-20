// Phone notifications for Chat.
//   POST { msg_id }  - called by the sender's app right after a message is saved.
// Works out who should be notified (everyone in that chat except the sender, skipping muted chats
// and quiet hours - an @mention still gets through a muted chat), then sends to each of their devices.
// Needs the Vercel env var VAPID_PRIVATE_KEY (the public key is below and in the app).
const L = require('./_lib');
const webpush = require('web-push');
const avatar = require('./avatar');

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
// Every outcome is written to the Owner page (Health), so a missed notification can always be explained
function note(me, text){ return L.db('app_errors', { method: 'POST', body: { company_id: me.company_id, username: me.username, page: 'notify', message: 'Chat notification from ' + (fullName(me) || me.username) + ': ' + text } }).catch(() => {}); }
const ROLE_COLOURS = { superadmin:'#0F1E2E', director:'#DC2626', manager:'#16A34A', supervisor:'#2563EB', teammember:'#B8862F', dailyworker:'#7C8AA0' };
const initials = p => (((p.first_name || '?')[0] || '') + ((p.last_name || '')[0] || '')).toUpperCase();

// ── Requests ──
// POST { request_id, event }  event: new | accepted | assigned | closed | reopened | note
//   new      -> everyone who handles that department's requests
//   anything else -> the person who reported it and whoever is on it (and the department, if nobody is on it yet)
// Only sent straight after the caller really did that thing (checked against the request and its updates).
const truthy = v => v === 1 || v === '1' || v === true || v === 'true';
async function requestHandlers(companyId, dept){
  const [people, setting] = await Promise.all([
    L.db('profiles?select=id,role,is_owner,departments,active&active=eq.true&company_id=eq.' + encodeURIComponent(companyId)),
    L.db('app_settings?select=value&key=eq.role_perms&company_id=eq.' + encodeURIComponent(companyId)).catch(() => [])
  ]);
  let perms = {};
  try { const v = setting[0] && setting[0].value; perms = (typeof v === 'string' ? JSON.parse(v) : v) || {}; } catch (e) {}
  const can = (role, mod, dflt) => { const v = perms[role] && perms[role][mod]; return v === undefined || v === null ? dflt : truthy(v); };
  return people.filter(p => {
    if (p.is_owner || p.role === 'superadmin') return true;
    if (can(p.role, 'requestsall', ['director', 'manager'].includes(p.role))) return true;
    const depts = Array.isArray(p.departments) ? p.departments : [];
    return can(p.role, 'requestsmanage', ['director', 'manager', 'supervisor'].includes(p.role)) && depts.includes(dept);
  }).map(p => p.id);
}
async function requestPush(me, b, res){
  const log = text => L.db('app_errors', { method: 'POST', body: { company_id: me.company_id, username: me.username, page: 'notify', message: 'Request notification from ' + (fullName(me) || me.username) + ': ' + text } }).catch(() => {});
  const r = (await L.db('requests?select=id,ref,title,dept,location,priority,status,reported_by,assigned_to,company_id,created_at,updated_at&id=eq.' + encodeURIComponent(b.request_id)))[0];
  if (!r || String(r.company_id) !== String(me.company_id)) { await log('not sent - request not found'); return L.send(res, 200, { ok: true, sent: 0, why: 'request not found' }); }
  const ev = String(b.event || '');
  const fresh = t => Date.now() - new Date(t).getTime() < 3 * 60000;
  // did this person really just do this?
  let ok = false, noteText = '';
  if (ev === 'new') ok = (String(r.reported_by) === String(me.id) || fresh(r.updated_at)) && (fresh(r.created_at) || fresh(r.updated_at));
  else {
    const notes = await L.db('request_notes?select=kind,body,author_id,created_at&order=created_at.desc&limit=5&request_id=eq.' + encodeURIComponent(r.id));
    const mine = notes.find(n => String(n.author_id) === String(me.id) && fresh(n.created_at) && (ev === 'note' ? n.kind === 'note' : n.kind === 'event'));
    ok = !!mine; noteText = mine && mine.kind === 'note' ? (mine.body || 'Photo') : '';
  }
  if (!ok) { await log('not sent - nothing new on #' + r.ref); return L.send(res, 200, { ok: true, sent: 0, why: 'nothing new' }); }

  let to = [];
  if (ev === 'new') to = await requestHandlers(r.company_id, r.dept);
  else {
    to = [r.reported_by, r.assigned_to].filter(Boolean);
    if (!r.assigned_to && (ev === 'note' || ev === 'reopened')) to = to.concat(await requestHandlers(r.company_id, r.dept));
  }
  to = [...new Set(to.map(String))].filter(id => id !== String(me.id));
  if (!to.length) { return L.send(res, 200, { ok: true, sent: 0, why: 'no one else to tell' }); }

  const list = to.map(encodeURIComponent).join(',');
  const [prefs, subs] = await Promise.all([
    L.db('chat_prefs?select=*&profile_id=in.(' + list + ')').catch(() => []),
    L.db('push_subs?select=*&profile_id=in.(' + list + ')')
  ]);
  const prefBy = {}; prefs.forEach(p => prefBy[p.profile_id] = p);
  const who = me.first_name || 'Someone';
  const title = (r.priority === 'urgent' ? 'URGENT · ' : '') + 'Request #' + r.ref + ' · ' + r.dept;
  const assignee = r.assigned_to && String(r.assigned_to) !== String(me.id)
    ? ((await L.db('profiles?select=first_name&id=eq.' + encodeURIComponent(r.assigned_to)).catch(() => []))[0] || {}).first_name : null;
  const what = r.title.length > 90 ? r.title.slice(0, 87) + '…' : r.title;
  const bodyFor = pid => {
    if (ev === 'new') return who + ': ' + what + (r.location ? ' (' + r.location + ')' : '');
    if (ev === 'accepted') return who + ' is on it: ' + what;
    if (ev === 'assigned') return String(r.assigned_to) === String(pid) ? who + ' asked you to do this: ' + what : who + ' gave this to ' + (assignee || 'someone') + ': ' + what;
    if (ev === 'closed') return who + ' marked this as done: ' + what;
    if (ev === 'reopened') return who + ' reopened: ' + what;
    return who + ': ' + (noteText.length > 120 ? noteText.slice(0, 117) + '…' : noteText);
  };
  webpush.setVapidDetails('mailto:hello@getmavis.co', VAPID_PUBLIC, VAPID_PRIVATE);
  const now = new Date();
  let sent = 0; const skipped = [];
  await Promise.all(subs.map(async s => {
    // urgent requests ignore quiet hours - that's the point of urgent
    if (r.priority !== 'urgent' && inQuiet(prefBy[s.profile_id], now)) { skipped.push('quiet hours'); return; }
    const payload = JSON.stringify({ title, body: bodyFor(s.profile_id), thread: 'req-' + r.id, url: '/?request=' + r.id, from: me.id, who: initials(me), colour: ROLE_COLOURS[me.role] || '#0D9488' });
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 6 * 3600, urgency: 'high' });
      sent++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) await L.db('push_subs?endpoint=eq.' + encodeURIComponent(s.endpoint), { method: 'DELETE' }).catch(() => {});
      skipped.push('error ' + (e.statusCode || e.message));
    }
  }));
  if (sent < subs.length) await log('#' + r.ref + ' ' + ev + ': sent to ' + sent + ' of ' + subs.length + ' device(s) for ' + to.length + ' person(s)' + (skipped.length ? ' - skipped: ' + skipped.join(', ') : ''));
  return L.send(res, 200, { ok: true, sent, people: to.length, devices: subs.length, skipped });
}

// ── Ordering ──
// POST { order_id, event }  event: new | hold | answered | approved | rejected | ordered | received | paid | note
//   new → approvers · hold/approved/rejected/ordered/paid → the person who asked
//   answered → whoever asked the question · approved → purchasing too · note / received → everyone involved
async function orderPeople(companyId, mod, dflt){
  const [people, setting] = await Promise.all([
    L.db('profiles?select=id,role,is_owner&active=eq.true&company_id=eq.' + encodeURIComponent(companyId)),
    L.db('app_settings?select=value&key=eq.role_perms&company_id=eq.' + encodeURIComponent(companyId)).catch(() => [])
  ]);
  let perms = {};
  try { const v = setting[0] && setting[0].value; perms = (typeof v === 'string' ? JSON.parse(v) : v) || {}; } catch (e) {}
  return people.filter(p => {
    if (p.is_owner || p.role === 'superadmin') return true;
    const v = perms[p.role] && perms[p.role][mod];
    return v === undefined || v === null ? dflt.includes(p.role) : truthy(v);
  }).map(p => p.id);
}
async function orderPush(me, b, res){
  const log = text => L.db('app_errors', { method: 'POST', body: { company_id: me.company_id, username: me.username, page: 'notify', message: 'Order notification from ' + (fullName(me) || me.username) + ': ' + text } }).catch(() => {});
  const o = (await L.db('orders?select=id,ref,title,kind,urgent,status,total,paid,hold_reason,hold_by,requested_by,approved_by,ordered_by,company_id,created_at&id=eq.' + encodeURIComponent(b.order_id)))[0];
  if (!o || String(o.company_id) !== String(me.company_id)) return L.send(res, 200, { ok: true, sent: 0, why: 'order not found' });
  const ev = String(b.event || '');
  const fresh = t => Date.now() - new Date(t).getTime() < 3 * 60000;
  // only straight after the caller really did it
  let ok = false, text = '';
  if (ev === 'new') ok = String(o.requested_by) === String(me.id) && fresh(o.created_at);
  else {
    const notes = await L.db('order_notes?select=kind,body,author_id,created_at&order=created_at.desc&limit=6&order_id=eq.' + encodeURIComponent(o.id));
    const mine = notes.filter(n => String(n.author_id) === String(me.id) && fresh(n.created_at));
    ok = mine.length > 0 || ev === 'note';
    const lastNote = mine.find(n => n.kind === 'note');
    text = lastNote ? lastNote.body : '';
    if (ev === 'note' && !lastNote) {
      const files = await L.db('order_files?select=created_at,added_by&order=created_at.desc&limit=1&order_id=eq.' + encodeURIComponent(o.id)).catch(() => []);
      ok = !!(files[0] && String(files[0].added_by) === String(me.id) && fresh(files[0].created_at));
      text = 'added a file';
    }
  }
  if (!ok) return L.send(res, 200, { ok: true, sent: 0, why: 'nothing new' });

  let to = [];
  const involved = [o.requested_by, o.approved_by, o.ordered_by, o.hold_by].filter(Boolean);
  if (ev === 'new') to = await orderPeople(o.company_id, 'orderingapprove', ['director', 'manager']);
  else if (ev === 'answered') to = [o.hold_by || o.approved_by].filter(Boolean);
  else if (ev === 'approved') to = [o.requested_by].concat(await orderPeople(o.company_id, 'orderingbuy', ['director', 'manager']));
  else if (['hold', 'rejected', 'ordered', 'paid'].includes(ev)) to = [o.requested_by];
  else to = involved;
  if (ev === 'answered' && !to.length) to = await orderPeople(o.company_id, 'orderingapprove', ['director', 'manager']);
  to = [...new Set(to.map(String))].filter(id => id !== String(me.id));
  if (!to.length) return L.send(res, 200, { ok: true, sent: 0, why: 'no one else to tell' });

  const list = to.map(encodeURIComponent).join(',');
  const [prefs, subs] = await Promise.all([
    L.db('chat_prefs?select=*&profile_id=in.(' + list + ')').catch(() => []),
    L.db('push_subs?select=*&profile_id=in.(' + list + ')')
  ]);
  const prefBy = {}; prefs.forEach(p => prefBy[p.profile_id] = p);
  const who = me.first_name || 'Someone';
  const money = v => 'Rp ' + Math.round(Number(v) || 0).toLocaleString('en-US');
  const what = o.title.length > 80 ? o.title.slice(0, 77) + '…' : o.title;
  const title = (o.urgent ? 'URGENT · ' : '') + 'Ordering · ' + what;
  const body = ({
    new: who + ' needs this' + (Number(o.total) ? ' - ' + money(o.total) : '') + '. Tap to approve.',
    hold: who + ' put it on hold: ' + (o.hold_reason || 'question') + (text ? ' - "' + text.slice(0, 90) + '"' : ''),
    answered: who + ' answered' + (text ? ': "' + text.slice(0, 100) + '"' : '') + ' - back to you',
    approved: who + ' approved it' + (Number(o.total) ? ' (' + money(o.total) + ')' : ''),
    rejected: who + ' rejected it',
    ordered: who + ' has ordered it',
    received: who + ' marked it received',
    paid: Number(o.paid) >= Number(o.total) && Number(o.total) ? 'Paid in full' : who + ' recorded a payment - ' + money(o.paid) + ' of ' + money(o.total) + ' paid',
    note: who + ': ' + (text || 'new message').slice(0, 120)
  })[ev] || who + ' updated it';
  webpush.setVapidDetails('mailto:hello@getmavis.co', VAPID_PUBLIC, VAPID_PRIVATE);
  const now = new Date();
  let sent = 0; const skipped = [];
  await Promise.all(subs.map(async s => {
    if (!o.urgent && inQuiet(prefBy[s.profile_id], now)) { skipped.push('quiet hours'); return; }
    const payload = JSON.stringify({ title, body, thread: 'ord-' + o.id, url: '/?order=' + o.id, from: me.id, who: initials(me), colour: ROLE_COLOURS[me.role] || '#0D9488' });
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 6 * 3600, urgency: 'high' });
      sent++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) await L.db('push_subs?endpoint=eq.' + encodeURIComponent(s.endpoint), { method: 'DELETE' }).catch(() => {});
      skipped.push('error ' + (e.statusCode || e.message));
    }
  }));
  if (sent < subs.length) await log(ordRefOf(o) + ' ' + ev + ': sent to ' + sent + ' of ' + subs.length + ' device(s)' + (skipped.length ? ' - skipped: ' + skipped.join(', ') : ''));
  return L.send(res, 200, { ok: true, sent, people: to.length, devices: subs.length, skipped });
}
function ordRefOf(o){ return 'Order #' + o.ref; }

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
    if (b.request_id) return await requestPush(me, b, res);
    if (b.order_id) return await orderPush(me, b, res);
    const msg = (await L.db('chat_msgs?select=*&id=eq.' + encodeURIComponent(b.msg_id || '')))[0];
    // only the person who sent it, and only straight after sending
    if (!msg) { await note(me, 'not sent - message not found'); return L.send(res, 200, { ok: true, sent: 0, why: 'message not found' }); }
    if (String(msg.sender_id) !== String(me.id)) { await note(me, 'not sent - not the sender'); return L.send(res, 200, { ok: true, sent: 0, why: 'not the sender' }); }
    if (msg.deleted_at || Date.now() - new Date(msg.created_at).getTime() > 3 * 60000) { await note(me, 'not sent - message too old or deleted'); return L.send(res, 200, { ok: true, sent: 0, why: 'too old' }); }
    const thread = (await L.db('chat_threads?select=*&id=eq.' + msg.thread_id))[0];
    if (!thread || String(thread.company_id) !== String(me.company_id)) { await note(me, 'not sent - chat not found'); return L.send(res, 200, { ok: true, sent: 0, why: 'chat not found' }); }

    const raw = await L.db('rpc/chat_member_ids', { method: 'POST', body: { th: thread.id } });
    const memberIds = (Array.isArray(raw) ? raw : []).map(x => (x && typeof x === 'object') ? Object.values(x)[0] : x);
    const others = memberIds.filter(id => String(id) !== String(me.id));
    if (!others.length) { await note(me, 'not sent - no one else in this chat'); return L.send(res, 200, { ok: true, sent: 0, why: 'no one else in this chat', raw: JSON.stringify(raw).slice(0, 200) }); }
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

    let sent = 0; const skipped = [];
    await Promise.all(subs.map(async s => {
      const pid = s.profile_id, pref = prefBy[pid];
      if (!personBy[pid] || personBy[pid].active === false) { skipped.push('inactive'); return; }
      if (inQuiet(pref, now)) { skipped.push('quiet hours'); return; }
      if (isMuted(pref, thread.id, now) && !mentioned(pid)) { skipped.push('muted'); return; }
      const payload = JSON.stringify({ title, body: (mentioned(pid) ? '@you · ' : '') + preview(msg), thread: thread.id, url: '/?chat=' + thread.id, from: me.id, who: initials(me), colour: ROLE_COLOURS[me.role] || '#0D9488', photo: me.photo ? '/api/avatar?p=' + encodeURIComponent(me.id) + '&s=' + avatar.sign(me.id) : null });
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 3600, urgency: 'high' });   // no 'topic': Google treats those as 'can wait' and delays them
        sent++;
      } catch (e) {
        // phone uninstalled the app or turned notifications off - forget that device
        if (e.statusCode === 404 || e.statusCode === 410) await L.db('push_subs?endpoint=eq.' + encodeURIComponent(s.endpoint), { method: 'DELETE' }).catch(() => {});
        else console.warn('push failed', e.statusCode, e.body);
        skipped.push('error ' + (e.statusCode || e.message));
      }
    }));
    // Record problems only (not every message that went through fine), so the Owner page (Health) shows what needs a look
    if (sent < subs.length || !subs.length) await note(me, 'in ' + (groupName || 'a direct chat') + ': sent to ' + sent + ' of ' + subs.length + ' device(s) for ' + others.length + ' other person(s)' + (skipped.length ? ' - skipped: ' + skipped.join(', ') : '') + (subs.length ? '' : ' - nobody has notifications turned on'));
    return L.send(res, 200, { ok: true, sent, people: others.length, devices: subs.length, skipped });
  } catch (e) {
    console.error('push error', e.message);
    try { const me = await L.caller(req); if (me) await note(me, 'FAILED - ' + String(e.message || e).slice(0, 160)); } catch (x) {}
    return L.send(res, 500, { ok: false, why: String(e.message || e).slice(0, 200) });
  }
};
