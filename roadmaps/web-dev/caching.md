---
id: caching
parent: performance
label: Caching & Service Workers
explored: false
order: 2
---

# Caching & Service Workers

Le cache est la technique de performance la plus impactante. HTTP cache, Service Workers et CDN permettent de servir les ressources sans toucher le serveur.

## HTTP Cache — headers essentiels

```
Cache-Control: public, max-age=31536000, immutable
  └─ public       : cacheable par CDN et navigateur
  └─ max-age      : durée en secondes (31536000 = 1 an)
  └─ immutable    : ne pas revalider (même si Ctrl+F5)

Cache-Control: no-cache
  └─ revalider systématiquement (ETag/Last-Modified)
  └─ le contenu est en cache mais doit être vérifié

Cache-Control: no-store
  └─ jamais en cache (données sensibles)

ETag: "abc123"                → empreinte du contenu
Last-Modified: Thu, 01 Jan 2025 00:00:00 GMT

Revalidation → 304 Not Modified (si non modifié) = 0 bytes de body
```

## Stratégie de versionnage (cache busting)

```
Assets avec hash dans le nom → cache 1 an (immutable)
  /js/main.a3f2b1c.js
  /css/styles.8d9e2f1.css

HTML → no-cache (toujours revalidé)
  /index.html

API → dépend du cas d'usage
```

## Service Workers — cache offline

```javascript
// sw.js — Service Worker
const CACHE_VERSION = 'v2';
const STATIC_CACHE  = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/js/main.js',
  '/css/styles.css',
];

// Installation — pré-cache les assets statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activation — nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — stratégies selon le type de ressource
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API → Network First (données fraîches, fallback cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Assets statiques → Cache First (performance)
  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Autres → Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request) || caches.match('/offline.html');
  }
}

async function cacheFirst(request) {
  return (await caches.match(request)) || fetch(request);
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(response => {
    caches.open(DYNAMIC_CACHE).then(c => c.put(request, response.clone()));
    return response;
  });
  return cached || fetchPromise;
}
```

## Workbox — Service Worker simplifié

```javascript
// vite-plugin-pwa — génère le SW automatiquement
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          { urlPattern: /^https:\/\/api\.example\.com\//, handler: 'NetworkFirst' },
          { urlPattern: /\.(?:png|jpg|webp|avif)$/, handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 86400 } }
          },
        ],
      },
    }),
  ],
});
```

## Liens

- [web.dev — HTTP caching](https://web.dev/articles/http-cache)
- [MDN — Service Worker API](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API)
- [Workbox](https://developer.chrome.com/docs/workbox/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
