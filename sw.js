// Mavis service worker - makes the app installable and shows Chat notifications.
// Not doing offline caching yet; that's a separate improvement for later.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass everything straight through to the network for now.
  event.respondWith(fetch(event.request));
});

// The app tells us which chat (if any) the person is actually looking at right now
let viewing = { thread: null, at: 0 };
self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d.type === 'viewing') viewing = { thread: d.thread || null, at: Date.now() };
});

// The sender's picture for the notification: their initials on their role colour (like in Chat)
async function avatar(letters, colour){
  try{
    const c = new OffscreenCanvas(192, 192), g = c.getContext('2d');
    g.fillStyle = colour || '#0D9488'; g.beginPath(); g.arc(96, 96, 96, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#FFFFFF'; g.font = '700 76px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(String(letters || '?').slice(0, 2), 96, 100);
    const buf = await (await c.convertToBlob({ type: 'image/png' })).arrayBuffer();
    let bin = ''; new Uint8Array(buf).forEach(b => { bin += String.fromCharCode(b); });
    return 'data:image/png;base64,' + btoa(bin);
  }catch(e){ return '/icon-192-v6.png'; }
}

// Never let the picture hold up the notification: give it 3 seconds at most
function within(ms, p){ return Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]); }
// Computers (Windows/Mac) quietly drop notifications that carry a made-up picture, and only show one
// small picture anyway - so they always get the Mavis icon. Phones get the sender's photo or initials.
const IS_PHONE = /Android|iPhone|iPad|iPod/i.test(self.navigator.userAgent || '');
async function senderPicture(d){
  if (!IS_PHONE) return '/icon-192-v6.png';
  if (d.photo) {
    const ok = await within(3000, fetch(d.photo).then(r => r.ok).catch(() => false));
    if (ok) return new URL(d.photo, self.location.origin).href;
  }
  if (d.who) { const a = await within(1500, avatar(d.who, d.colour)); if (a) return a; }
  return '/icon-192-v6.png';
}

// A new Chat message arrived while Mavis is closed or in the background
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { title: 'Mavis', body: event.data ? event.data.text() : '' }; }
  event.waitUntil((async () => {
    // Stay quiet only if the person is looking at that exact chat right now (like WhatsApp Web)
    // (double-checked: a Mavis window must really be on screen and in focus right now - so a stale
    //  "viewing" from a just-closed app can never swallow a notification)
    if (!d.force && d.thread && viewing.thread === d.thread && Date.now() - viewing.at < 30000) {
      const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      if (wins.some(w => w.visibilityState === 'visible' && w.focused)) return;
    }
    const opts = {
      body: d.body || 'New message',
      badge: '/notify-badge-96.png',   // Android's small top-bar icon: white shape on see-through
      tag: 'chat-' + (d.thread || 'mavis') + '-' + Date.now(),   // every message gets its own notification and buzz (the phone groups them)
      data: { url: d.url || '/', thread: d.thread || null }
    };
    let icon = null;
    try { icon = await senderPicture(d); } catch (e) {}
    try {
      await self.registration.showNotification(d.title || 'Mavis', icon ? Object.assign({ icon }, opts) : opts);
    } catch (e) {
      // if the picture is the problem, show it without one rather than nothing
      await self.registration.showNotification(d.title || 'Mavis', opts);
    }
  })());
});

// Tapping a notification opens that chat
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if (new URL(w.url).origin === self.location.origin) {
        await w.focus();
        w.postMessage({ type: 'open-chat', thread: data.thread });
        return;
      }
    }
    await self.clients.openWindow(data.url || '/');
  })());
});
