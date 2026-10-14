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

// Sender pictures are made by the app while it's open and kept here (on the phone), so when a message
// arrives on a locked phone there is nothing to draw or download - just pick the ready picture.
function picDb(){
  return new Promise((ok, bad) => {
    const r = indexedDB.open('mavis-notify', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('pics');
    r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error);
  });
}
async function savePics(map){
  const db = await picDb();
  await new Promise(res => { const tx = db.transaction('pics', 'readwrite'); const st = tx.objectStore('pics');
    Object.keys(map || {}).forEach(k => st.put(map[k], k)); tx.oncomplete = res; tx.onerror = res; });
}
async function readyPic(id){
  if (!id) return null;
  try {
    const db = await picDb();
    return await new Promise(res => { const q = db.transaction('pics').objectStore('pics').get(String(id)); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); });
  } catch (e) { return null; }
}
self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d.type === 'pics' && d.pics) event.waitUntil(savePics(d.pics).catch(() => {}));
});

// Computers (Windows/Mac) quietly drop notifications that carry a made-up picture, and only show one
// small picture anyway - so they always get the Mavis icon. Phones get the sender's ready-made picture.
const IS_PHONE = /Android|iPhone|iPad|iPod/i.test(self.navigator.userAgent || '');
function within(ms, p){ return Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]); }
async function senderPicture(d){
  if (!IS_PHONE) return '/icon-192-v6.png';
  const pic = await within(800, readyPic(d.from));
  return pic || '/icon-192-v6.png';
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
