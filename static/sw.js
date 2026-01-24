// Service Worker for PWA
const CACHE_NAME = 'adolf-pwa-v3';

// Install event
self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
});

// Activate event  
self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});

// Fetch event - basic pass-through
self.addEventListener('fetch', (event) => {
	event.respondWith(fetch(event.request));
});