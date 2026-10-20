// Service worker mínimo: solo para que el navegador considere la app instalable.
// A propósito NO cachea nada ni intercepta pedidos (todo va directo a la red).
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', () => {});
