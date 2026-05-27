const CACHE_NAME = 'genou-rehab-v8';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // ← Force l'activation immédiate
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // ← Prend le contrôle immédiatement
});

const FILES_TO_CACHE = [
  '/genou-rehab/',
  '/genou-rehab/index.html',
  '/genou-rehab/style.css',
  '/genou-rehab/app.js',
  '/genou-rehab/manifest.json',
  '/genou-rehab/images/icon-192.png',
  '/genou-rehab/images/icon-512.png',
  '/genou-rehab/images/ex-circulatoires.jpg',
  '/genou-rehab/images/ex-fessiers.jpg',
  '/genou-rehab/images/ex-quadricep.jpg',
  '/genou-rehab/images/ex-ischio.jpg',
  '/genou-rehab/images/ex-triple-flexion.jpg',
  '/genou-rehab/images/ex-abduction.jpg',
  '/genou-rehab/images/ex-extension-couche.jpg',
  '/genou-rehab/images/ex-slr.jpg',
  '/genou-rehab/images/ex-flexion-assis.jpg',
  '/genou-rehab/images/ex-extension-assis.jpg',
  '/genou-rehab/images/ex-minisquat.jpg',
  '/genou-rehab/images/ex-flexion-hanche.jpg',
  '/genou-rehab/images/ex-flexion-debout.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});

// ← RÉCEPTION DES NOTIFICATIONS DEPUIS L'APP
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIF') {
    const { delay, title, body } = event.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'med-reminder',
        requireInteraction: true
      });
    }, delay);
  }
});

// Force la mise à jour immédiate chez tous les clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
