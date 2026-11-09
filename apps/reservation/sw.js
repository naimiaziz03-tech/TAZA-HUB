const C="reservation-v9",F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
const put=(rq,res)=>{const cp=res.clone();caches.open(C).then(c=>c.put(rq,cp));return res};
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(new URL(e.request.url).origin===location.origin){
    e.respondWith(fetch(e.request,{cache:"reload"}).then(r=>put(e.request,r)).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>put(e.request,res))));
  }
});
