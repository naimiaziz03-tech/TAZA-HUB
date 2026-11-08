const C="reservation-v6",F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.open(C).then(async c=>{
    const r=await c.match(e.request);
    const n=fetch(e.request).then(res=>{if(res.ok||res.type==="opaque")c.put(e.request,res.clone());return res}).catch(()=>r);
    return r||n;
  }));
});
