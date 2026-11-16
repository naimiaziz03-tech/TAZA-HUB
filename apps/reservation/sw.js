// Reservation – service worker (network-first: les mises à jour s'affichent toujours)
const V=new URL(self.location.href).searchParams.get("v")||"base";
const CACHE="reservation-"+V;
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:"reload"})).catch(()=>{})))));
});
self.addEventListener("activate",e=>e.waitUntil((async()=>{
  const ks=await caches.keys();
  await Promise.all(ks.filter(k=>k.startsWith("reservation")&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}
      return res;
    }).catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match("index.html"))));
  }else{
    e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{
      const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res;
    })));
  }
});
