const CACHE = 'pwabuilder-offline-page';

importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'
);

const offlineFallbackPage = 'offline.html';

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('install', async (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
	);
});

if (workbox.navigationPreload.isSupported()) {
	workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
	new RegExp('/*'),
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: CACHE,
	})
);

self.addEventListener('fetch', (event) => {
	console.log('1');
	if (event.request.mode === 'navigate') {
		event.respondWith(
			(async () => {
				try {
					const preloadResp = await event.preloadResponse;

					if (preloadResp) {
						return preloadResp;
					}

					const networkResp = await fetch(event.request);
					return networkResp;
				} catch (error) {
					const cache = await caches.open(CACHE);
					const cachedResp = await cache.match(offlineFallbackPage);
					return cachedResp;
				}
			})()
		);
	}
});

self.addEventListener('message', (event) => {
	if (event.data && event.data.action === 'test-push') {
		self.registration.showNotification('Test Notification', {
			body: 'Это тестовое push-уведомление без сервера!',
		});
	}
});

self.addEventListener('sync', (event) => {
	if (event.tag === 'database-sync') {
		event.waitUntil();
	}
});
