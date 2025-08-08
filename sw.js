// Service Worker pour les notifications push

// Version du cache
const CACHE_NAME = 'sorbo-cache-v1';

// Fichiers à mettre en cache
const urlsToCache = [
  '/',
  '/index.html',
  '/actualites.html',
  '/css/style.css',
  '/js/script.js',
  '/images/logo.png'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        if (
          event.request.method === 'GET' &&
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.url.startsWith(self.location.origin)
        ) {
          // N'essaie pas de mettre en cache les schémas non supportés (chrome-extension, etc.)
          const responseClone = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseClone);
        }
        return networkResponse;
      } catch (e) {
        return caches.match(event.request);
      }
    })()
  );
});

// Gestion des notifications push
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || 'Découvrez notre dernier article sur Sorbo-Ingénierie!',
      icon: data.icon || '/images/logo.png',
      badge: data.badge || '/images/logo.png',
      data: {
        url: data.url || '/actualites.html'
      },
      actions: [
        {
          action: 'open',
          title: 'Lire l\'article'
        },
        {
          action: 'close',
          title: 'Fermer'
        }
      ],
      vibrate: [100, 50, 100],
      tag: data.tag || 'sorbo-notification',
      renotify: true
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Sorbo-Ingénierie', options)
    );
  }
});

// Gestion du clic sur une notification
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Ouvrir l'URL associée à la notification
  const urlToOpen = event.notification.data.url || '/actualites.html';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      // Vérifier si une fenêtre est déjà ouverte et naviguer vers l'URL
      let matchingClient = null;
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('sorbo') && 'focus' in client) {
          matchingClient = client;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus().then(client => client.navigate(urlToOpen));
      } else {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});