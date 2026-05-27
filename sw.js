const CACHE_NAME = 'genou-rehab-v6';

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
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/ex-circulatoires.jpg',
  '/images/ex-fessiers.jpg',
  '/images/ex-quadricep.jpg',
  '/images/ex-ischio.jpg',
  '/images/ex-triple-flexion.jpg',
  '/images/ex-abduction.jpg',
  '/images/ex-extension-couche.jpg',
  '/images/ex-slr.jpg',
  '/images/ex-flexion-assis.jpg',
  '/images/ex-extension-assis.jpg',
  '/images/ex-minisquat.jpg',
  '/images/ex-flexion-hanche.jpg',
  '/images/ex-flexion-debout.jpg'
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
