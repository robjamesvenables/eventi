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

// A new Chat message arrived while Mavis is closed or in the background
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { title: 'Mavis', body: event.data ? event.data.text() : '' }; }
  event.waitUntil((async () => {
    // Stay quiet only if the person is looking at that exact chat right now (like WhatsApp Web)
    if (!d.force && d.thread && viewing.thread === d.thread && Date.now() - viewing.at < 45000) return;
    await self.registration.showNotification(d.title || 'Mavis', {
      body: d.body || 'New message',
      icon: '/icon-192-v6.png',
      badge: '/icon-192-v6.png',
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
