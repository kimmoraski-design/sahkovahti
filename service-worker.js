const CACHE = "sahkovahti-shell-v1";
const DATA = "sahkovahti-data-v1";
const SHELL = ["./","./index.html","./app.js","./manifest.webmanifest","./icon.svg"];
const PRICE_URL = "https://api.porssisahko.net/v2/price.json";
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>![CACHE,DATA].includes(k)).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (event.request.url.startsWith(PRICE_URL)) {
    event.respondWith(fetch(event.request).then(async response=>{const c=await caches.open(DATA);c.put(event.request,response.clone());return response;}).catch(()=>caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
self.addEventListener("periodicsync", event => {
  if (event.tag === "update-price") {
    const url = PRICE_URL + "?date=" + encodeURIComponent(new Date().toISOString());
    event.waitUntil(fetch(url,{cache:"no-store"}).then(async response=>{if(response.ok){const c=await caches.open(DATA);await c.put(url,response.clone());}}));
  }
});