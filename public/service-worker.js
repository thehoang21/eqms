/**
 * Service Worker for Ngoc Thien Pharma QMS
 * Enables offline functionality, caching strategies, and PWA features
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `ntp-qms-${CACHE_VERSION}`;
const API_CACHE_NAME = `ntp-qms-api-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `ntp-qms-images-${CACHE_VERSION}`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles/globals.css',
  '/src/assets/images/logo_nobg.png',
  '/src/assets/images/LOGO.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// API endpoints to cache (network-first strategy)
const API_ROUTES = [
  '/api/auth/me',
  '/api/dashboard',
  '/api/tasks',
  '/api/documents',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old versions
              return cacheName.startsWith('ntp-qms-') && 
                     cacheName !== CACHE_NAME &&
                     cacheName !== API_CACHE_NAME &&
                     cacheName !== IMAGE_CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network First strategy
  if (isAPIRequest(url.pathname)) {
    event.respondWith(networkFirstStrategy(request, API_CACHE_NAME));
    return;
  }

  // Images - Cache First strategy
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE_NAME));
    return;
  }

  // Static assets - Stale While Revalidate
  event.respondWith(staleWhileRevalidateStrategy(request, CACHE_NAME));
});

// Message event - handle commands from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('NTP QMS', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-documents') {
    event.waitUntil(syncDocuments());
  }
});

// Periodic background sync (experimental)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-documents') {
    event.waitUntil(updateDocuments());
  }
});

// ==================== Helper Functions ====================

/**
 * Check if request is an API call
 */
function isAPIRequest(pathname) {
  return pathname.startsWith('/api/');
}

/**
 * Check if request is an image
 */
function isImageRequest(request) {
  return request.destination === 'image' ||
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
}

/**
 * Network First Strategy - Try network, fallback to cache
 * Best for: API calls, dynamic content
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Clone response before caching (response can only be read once)
    const responseToCache = networkResponse.clone();
    
    // Update cache with fresh data
    const cache = await caches.open(cacheName);
    await cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'No network connection and no cached data available' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }
}

/**
 * Cache First Strategy - Try cache, fallback to network
 * Best for: Images, fonts, static assets that rarely change
 */
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const responseToCache = networkResponse.clone();
    
    const cache = await caches.open(cacheName);
    await cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache and network failed:', error);
    
    // Return placeholder image for failed image requests
    if (isImageRequest(request)) {
      return new Response(
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f1f5f9"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b">Image</text></svg>',
        {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store'
          }
        }
      );
    }
    
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy - Return cache immediately, update in background
 * Best for: Static assets that can be slightly stale
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    const responseToCache = networkResponse.clone();
    
    caches.open(cacheName).then((cache) => {
      cache.put(request, responseToCache);
    });
    
    return networkResponse;
  });
  
  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

/**
 * Sync documents in background
 */
async function syncDocuments() {
  try {
    const response = await fetch('/api/documents/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('[Service Worker] Document sync successful');
    }
  } catch (error) {
    console.error('[Service Worker] Document sync failed:', error);
  }
}

/**
 * Update documents periodically
 */
async function updateDocuments() {
  try {
    const response = await fetch('/api/documents/latest');
    const data = await response.json();
    
    const cache = await caches.open(API_CACHE_NAME);
    await cache.put('/api/documents', new Response(JSON.stringify(data)));
    
    console.log('[Service Worker] Documents updated');
  } catch (error) {
    console.error('[Service Worker] Document update failed:', error);
  }
}
