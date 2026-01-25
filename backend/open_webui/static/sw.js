// Service Worker for PWA
const CACHE_NAME = 'adolf-pwa-v8';

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
	console.log('[SW] Installing new version:', CACHE_NAME);
	event.waitUntil(self.skipWaiting());
});

// Activate event - clear ALL old caches
self.addEventListener('activate', (event) => {
	console.log('[SW] Activating:', CACHE_NAME);
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					console.log('[SW] Deleting old cache:', cacheName);
					return caches.delete(cacheName);
				})
			);
		}).then(() => {
			console.log('[SW] All caches cleared, claiming clients');
			return self.clients.claim();
		})
	);
});

// Fetch event - always fetch from network, no caching
self.addEventListener('fetch', (event) => {
	event.respondWith(
		fetch(event.request).catch(() => {
			// Fallback for offline - return basic response
			return new Response('Offline', { status: 503 });
		})
	);
});

// Listen for message to force update
self.addEventListener('message', (event) => {
	if (event.data === 'skipWaiting') {
		self.skipWaiting();
	}
});