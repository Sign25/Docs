// Service Worker for PWA - ADOLF
const CACHE_NAME = 'adolf-pwa-v11';

// Static assets to cache on install
const STATIC_ASSETS = [
	'/',
	'/static/favicon.ico?v=5',
	'/static/favicon.svg?v=5',
	'/static/favicon.png?v=5',
	'/static/favicon-dark.png?v=5',
	'/static/favicon-96x96.png?v=5',
	'/static/apple-touch-icon.png?v=5',
	'/static/splash.png?v=5',
	'/static/splash-dark.png?v=5',
	'/static/web-app-manifest-192x192.png?v=5',
	'/static/web-app-manifest-512x512.png?v=5',
	'/static/content-factory-icon.svg'
];

// Install - cache static assets and activate immediately
self.addEventListener('install', (event) => {
	console.log('[SW] Installing:', CACHE_NAME);
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[SW] Caching static assets');
			return cache.addAll(STATIC_ASSETS).catch((err) => {
				console.warn('[SW] Some assets failed to cache:', err);
			});
		}).then(() => self.skipWaiting())
	);
});

// Activate - clean ALL old caches and take control immediately
self.addEventListener('activate', (event) => {
	console.log('[SW] Activating:', CACHE_NAME);
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME)
					.map((name) => {
						console.log('[SW] Deleting old cache:', name);
						return caches.delete(name);
					})
			);
		}).then(() => self.clients.claim())
	);
});

// Fetch - Network first for everything, cache as fallback
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip API calls and websockets - always network only
	if (url.pathname.startsWith('/api/') ||
		url.pathname.startsWith('/ws/') ||
		url.pathname.startsWith('/oauth/') ||
		url.pathname.startsWith('/auth/')) {
		return;
	}

	// Network first for EVERYTHING - ensures fresh content
	event.respondWith(
		fetch(request)
			.then((response) => {
				// Cache successful responses
				if (response.ok) {
					const clone = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(request, clone);
					});
				}
				return response;
			})
			.catch(() => {
				// Network failed - try cache
				return caches.match(request).then((cached) => {
					if (cached) {
						return cached;
					}
					// No cache - return offline page for navigation
					if (request.mode === 'navigate') {
						return caches.match('/');
					}
					return new Response('Offline', { status: 503 });
				});
			})
	);
});

// Handle messages - force update
self.addEventListener('message', (event) => {
	if (event.data === 'skipWaiting') {
		self.skipWaiting();
	}
	if (event.data === 'clearCache') {
		caches.keys().then((names) => {
			names.forEach((name) => caches.delete(name));
		});
	}
});
