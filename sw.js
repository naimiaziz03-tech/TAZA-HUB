/* تطبيقاتي — Service Worker
   يحفظ ملفات التطبيق وكل الأقسام ليعمل بدون إنترنت.
   لإجبار التحديث غيّر رقم VER. القائمة تُقرأ من apps.js. */
importScripts("apps.js");

const VER = "tazahub-v2";
const CORE = ["./", "index.html", "apps.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

function appFiles() {
  const f = [];
  (self.APPS || []).forEach(a => {
    (a.files && a.files.length ? a.files : [a.path]).forEach(x => f.push(x));
    (a.icon ? [a.icon] : []).forEach(x => f.push(x));
  });
  return f;
}
function cdnFiles() {
  const f = [];
  (self.APPS || []).forEach(a => (a.cdn || []).forEach(x => f.push(x)));
  return f;
}

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(VER);
    await c.addAll(CORE.map(u => new Request(u, { cache: "reload" })));
    await Promise.all(appFiles().map(async u => {
      try { const r = await fetch(new Request(u, { cache: "reload" })); if (r.ok) await c.put(u, r); } catch (_) {}
    }));
    await Promise.all(cdnFiles().map(async u => {
      try { const r = await fetch(new Request(u, { mode: "no-cors" })); await c.put(u, r); } catch (_) {}
    }));
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k.startsWith("tazahub-") && k !== VER).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", e => {
  if (e.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", e => {
  const q = e.request;
  if (q.method !== "GET") return;
  const u = new URL(q.url);
  const same = u.origin === location.origin;
  const cdn = /(^|\.)cdnjs\.cloudflare\.com$|(^|\.)cdn\.jsdelivr\.net$/.test(u.hostname);
  if (!same && !cdn) return;
  e.respondWith((async () => {
    const c = await caches.open(VER);
    const hit = await c.match(q, { ignoreSearch: same });
    const net = fetch(q).then(r => {
      if (r && (r.ok || r.type === "opaque")) c.put(q, r.clone());
      return r;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net;
    if (r) return r;
    if (q.mode === "navigate") return (await c.match("index.html")) || Response.error();
    return Response.error();
  })());
});
