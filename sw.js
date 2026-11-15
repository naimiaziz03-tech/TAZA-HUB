
/* TAZA HUB — Service Worker */
importScripts("./apps.js");

const VER = "tazahub-v5";
const CORE = [
  "./",
  "index.html",
  "apps.js",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png"
];

function appFiles() {
  const files = [];
  (self.APPS || []).forEach(app => {
    (app.files && app.files.length ? app.files : [app.path])
      .forEach(file => files.push(file));
    if (app.icon) files.push(app.icon);
  });
  return [...new Set(files)];
}

function cdnFiles() {
  const files = [];
  (self.APPS || []).forEach(app => {
    (app.cdn || []).forEach(file => files.push(file));
  });
  return [...new Set(files)];
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VER);

    await cache.addAll(
      CORE.map(url => new Request(url, { cache: "reload" }))
    );

    await Promise.all(appFiles().map(async url => {
      try {
        const response = await fetch(
          new Request(url, { cache: "reload" })
        );
        if (response.ok) await cache.put(url, response);
      } catch (_) {}
    }));

    await Promise.all(cdnFiles().map(async url => {
      try {
        const response = await fetch(
          new Request(url, { mode: "no-cors" })
        );
        await cache.put(url, response);
      } catch (_) {}
    }));

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key =>
          key.startsWith("tazahub-") && key !== VER
        )
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const cdn =
    /(^|\.)cdnjs\.cloudflare\.com$|(^|\.)cdn\.jsdelivr\.net$/
      .test(url.hostname);

  if (!sameOrigin && !cdn) return;

  event.respondWith((async () => {
    const cache = await caches.open(VER);

    if (sameOrigin) {
      try {
        const response = await fetch(
          new Request(request, { cache: "no-cache" })
        );

        if (response && response.ok) {
          event.waitUntil(
            cache.put(request, response.clone()).catch(() => {})
          );
        }

        return response;
      } catch (_) {
        const cached = await cache.match(
          request,
          { ignoreSearch: true }
        );

        if (cached) return cached;

        if (request.mode === "navigate") {
          return (await cache.match("index.html")) ||
            Response.error();
        }

        return Response.error();
      }
    }

    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);

      if (response && (response.ok || response.type === "opaque")) {
        event.waitUntil(
          cache.put(request, response.clone()).catch(() => {})
        );
      }

      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
