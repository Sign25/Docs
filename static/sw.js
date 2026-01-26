// Service Worker for PWA - ADOLF
const CACHE_NAME = 'adolf-pwa-v10';

// Static assets to cache on install
const STATIC_ASSETS = [
	'/',
	'/static/favicon.ico',
	'/static/favicon.svg',
	'/static/favicon.png',
	'/static/favicon-dark.png',
	'/static/favicon-96x96.png',
	'/static/apple-touch-icon.png',
	'/static/splash.png',
	'/static/splash-dark.png',
	'/static/web-app-manifest-192x192.png',
	'/static/web-app-manifest-512x512.png',
	'/static/content-factory-icon.svg'
];

// Install - cache static assets
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

// Activate - clean old caches
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

// Fetch - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip API calls and websockets - always network
	if (url.pathname.startsWith('/api/') ||
		url.pathname.startsWith('/ws/') ||
		url.pathname.startsWith('/oauth/') ||
		url.pathname.startsWith('/auth/')) {
		return;
	}

	// For static assets - cache first, then network
	if (url.pathname.startsWith('/static/') ||
		url.pathname.endsWith('.png') ||
		url.pathname.endsWith('.svg') ||
		url.pathname.endsWith('.ico') ||
		url.pathname.endsWith('.woff2')) {
		event.respondWith(
			caches.match(request).then((cached) => {
				if (cached) {
					// Return cached, but also update cache in background
					fetch(request).then((response) => {
						if (response.ok) {
							caches.open(CACHE_NAME).then((cache) => {
								cache.put(request, response);
							});
						}
					}).catch(() => {});
					return cached;
				}
				// Not in cache - fetch and cache
				return fetch(request).then((response) => {
					if (response.ok) {
						const clone = response.clone();
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(request, clone);
						});
					}
					return response;
				});
			})
		);
		return;
	}

	// For pages - network first, fallback to cache
	event.respondWith(
		fetch(request)
			.then((response) => {
				// Cache successful page responses
				if (response.ok && request.mode === 'navigate') {
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

// Handle messages
self.addEventListener('message', (event) => {
	if (event.data === 'skipWaiting') {
		self.skipWaiting();
	}
});
