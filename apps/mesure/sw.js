// الإصدار 13 — يجلب الملفات من الشبكة أولاً ثم يرجع للذاكرة عند انقطاع الانترنت
const C="transfo-taza2-v13";
const F=["./","index.html","manifest.json","icon-v2-192.png","icon-v2-512.png","icon-v2-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>fetch(new Request(u,{cache:"reload"})).then(r=>r.ok?c.put(u,r):null).catch(()=>null)))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET"||new URL(q.url).origin!==location.origin)return;
e.respondWith(fetch(q,{cache:"no-cache"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp))}return r}).catch(()=>caches.match(q).then(r=>r||caches.match("index.html"))))});
