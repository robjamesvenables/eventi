// Members' page helper (guest side, /k/...): shows the venue's news alerts and opens their page when tapped.
// Kept apart from the staff app's sw.js on purpose: nothing here caches or changes how pages load.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { title: 'News', body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(d.title || d.brand || 'Members Club', {
    body: d.body || '',
    icon: '/icon-192-v6.png',
    badge: '/notify-badge-96.png',
    tag: 'mv-' + Date.now(),
    data: { url: d.url || '/' }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const page = wins.find(w => new URL(w.url).pathname.startsWith('/k/'));
    if (page) { try { await page.navigate(url); } catch (e) {} return page.focus(); }
    return self.clients.openWindow(url);
  })());
});
