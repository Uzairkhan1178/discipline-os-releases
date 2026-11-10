/* Discipline OS service worker: the app shell is cached, served at once, and refreshed in the background. */
const VERSION = 'dos-202611100032-5294e1c';
const SHELL = ['./', './index.html', './manifest.webmanifest', './adhan.umd.min.js', './sync.js', './firebase-config.js', './mosque-charlottetown.json', './fonts.css',
  './fonts/cormorant-garamond-latin-400-italic.woff2', './fonts/cormorant-garamond-latin-400-normal.woff2', './fonts/cormorant-garamond-latin-500-italic.woff2', './fonts/cormorant-garamond-latin-500-normal.woff2', './fonts/cormorant-garamond-latin-600-normal.woff2',
  './fonts/manrope-latin-400-normal.woff2', './fonts/manrope-latin-500-normal.woff2', './fonts/manrope-latin-600-normal.woff2', './fonts/manrope-latin-700-normal.woff2',
  './fonts/jetbrains-mono-latin-400-normal.woff2', './fonts/jetbrains-mono-latin-500-normal.woff2', './fonts/amiri-arabic-400-normal.woff2', './fonts/amiri-quran-arabic-400-normal.woff2', './fonts/noto-nastaliq-urdu-arabic-400-normal.woff2', './quran-juz29-30.json',
  './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async c => {
    const cached = await c.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return cached || (await fresh) || Response.error();
  }));
});
