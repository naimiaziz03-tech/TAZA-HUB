
const CACHE_NAME = "reservation-v14";
 2.-work/rapport-mensual-integration

const APP_CACHE_PREFIX = "reservation-";
 main

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
 2.-work/rapport-mensual-integration
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )

      .then(keys => Promise.all(
        keys
          .filter(key =>
            key.startsWith(APP_CACHE_PREFIX) &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      ))
 main
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
 2.-work/rapport-mensual-integration

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request, { cache: "no-cache" })
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, copy));
        }

        return response;
      })
      .catch(() =>
        caches.match(request).then(cached => {
          if (cached) return cached;

          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }

          return new Response("غير متصل بالإنترنت", {
=======
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      const response = await fetch(request, {
        cache: "no-cache"
      });

      if (response && response.ok) {
        event.waitUntil(
          cache.put(request, response.clone())
        );
      }

      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;

      if (request.mode === "navigate") {
        return (await cache.match("./index.html")) ||
          new Response("التطبيق غير متاح دون اتصال بالإنترنت.", {
 main
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          });
 2.-work/rapport-mensual-integration
        })
      )
  );

      }

      return new Response("غير متصل بالإنترنت", {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        }
      });
    }
  })());
 main
});
