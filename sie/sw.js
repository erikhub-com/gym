// Offline-Cache: mit Internet immer zuerst die neueste Datei holen, ohne Netz (oder bei sehr langsamem Netz) aus dem Cache.
// Bei Änderungen CACHE-Version erhöhen.
const CACHE = 'wieder-fit-v13';
const FILES = ['./', './index.html', './style.css', './plan.js', './logic.js', './howto.js', './app.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const NET_TIMEOUT_MS = 3000;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(FILES.map(f =>
        fetch(f, { cache: 'reload' }).then(r => { if (!r.ok) throw new Error(f); return c.put(f, r); })
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function fromNetwork(req) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), NET_TIMEOUT_MS);
    fetch(req, { cache: 'no-cache' }).then(
      r => { clearTimeout(t); resolve(r); },
      err => { clearTimeout(t); reject(err); }
    );
  });
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fromNetwork(e.request)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});

// Tipp auf die Benachrichtigung (oder auf der Uhr): App in den Vordergrund holen
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(list => (list.length ? list[0].focus() : self.clients.openWindow('./'))));
});
