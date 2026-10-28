/* ريال بريال — service worker (iPhone / browser PWA). Version fa42e4e2fcbd */
const VERSION = "fa42e4e2fcbd";
const CACHE = "rbr-" + VERSION;
const RUNTIME = "rbr-runtime";
const PRECACHE = ["./","assets/index-C61OoqjE.js","assets/index-CicMtfis.js","assets/index-Cl8_0d2T.js","assets/index-DcWaV4xD.css","assets/index-evarCuMd.js","assets/index-g4NKWb84.js","assets/index-pY0MXCOy.js","assets/web-BnpvZb9J.js","assets/web-CKcSXufA.js","assets/web-CNb37sal.js","assets/web-Cs7E6qNs.js","assets/web-DOK6cgdo.js","assets/web-DWbtRHMa.js","assets/web-rdBJguFd.js","fonts/tajawal-400-arabic.woff2","fonts/tajawal-400-latin.woff2","fonts/tajawal-500-arabic.woff2","fonts/tajawal-500-latin.woff2","fonts/tajawal-700-arabic.woff2","fonts/tajawal-700-latin.woff2","fonts/tajawal-800-arabic.woff2","fonts/tajawal-800-latin.woff2","icons/icon-120.png","icons/icon-152.png","icons/icon-167.png","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","logo.svg","manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(PRECACHE.map((u) => new Request(u, { cache: "reload" })));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = (await caches.keys()).filter((k) => k.startsWith("rbr-") && k !== RUNTIME);
    // keep the current and the newest older version (an open old page may still lazy-load one of its chunks)
    const old = keys.filter((k) => k !== CACHE);
    for (const k of old.slice(0, Math.max(0, old.length - 1))) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("message", (e) => { if (e.data === "version" && e.source) e.source.postMessage({ sw: VERSION }); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // API / OCR / fonts elsewhere: straight to the network, never cached
  if (req.mode === "navigate") {
    // the app shell of THIS version (consistent with its precached assets) — works offline
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = (await c.match("./")) || (await c.match("index.html"));
      if (hit) return hit;
      try { return await fetch(req); } catch (err) { const any = await caches.match("./"); if (any) return any; throw err; }
    })());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: false });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok && (url.pathname.indexOf("/sqljs/") >= 0 || url.pathname.indexOf("/assets/") >= 0)) { const rc = await caches.open(RUNTIME); rc.put(req, res.clone()); }
      return res;
    } catch (err) {
      const any = await caches.match(req, { ignoreSearch: true });
      if (any) return any;
      throw err;
    }
  })());
});
