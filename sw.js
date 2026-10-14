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

async function senderPicture(d){
  if (d.photo) { try { const r = await fetch(d.photo); if (r.ok) return d.photo; } catch (e) {} }
  return d.who ? avatar(d.who, d.colour) : '/icon-192-v6.png';
}

// A new Chat message arrived while Mavis is closed or in the background
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { title: 'Mavis', body: event.data ? event.data.text() : '' }; }
  event.waitUntil((async () => {
    // Stay quiet only if the person is looking at that exact chat right now (like WhatsApp Web)
    if (!d.force && d.thread && viewing.thread === d.thread && Date.now() - viewing.at < 45000) return;
    await self.registration.showNotification(d.title || 'Mavis', {
      body: d.body || 'New message',
      icon: await senderPicture(d),   // who sent it: their photo, or their initials (tests show the Mavis icon)
      badge: '/notify-badge-96.png',   // Android's small top-bar icon: white shape on see-through
      tag: 'chat-' + (d.thread || 'mavis'),     // one notification per chat, updated with the latest message
      renotify: true,
      data: { url: d.url || '/', thread: d.thread || null }
    });
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
