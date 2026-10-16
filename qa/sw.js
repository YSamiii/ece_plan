const CACHE="xixi-ece-v20261016-20mweek2-qa2";
const QA_CACHE_PATTERN=/^xixi-ece-v\d+-.*-qa\d+$/;
const SHELL=["./","./index.html","./manifest.webmanifest","./apple-touch-icon.png","./icon-192.png","./icon-512.png","./top-avatar.png","./fox-app-icon.png","./triangle-reference.png","./icon-lang.svg","./icon-math.svg","./icon-eng.svg","./icon-lesson.svg","./icon-other.svg","./data/curriculum.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&QA_CACHE_PATTERN.test(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const u=new URL(e.request.url);
  const qaCache=caches.open(CACHE);
  if(u.pathname.endsWith("/data/curriculum.json")){
    e.respondWith(
      fetch(e.request,{cache:"no-store"}).then(res=>{
        const copy=res.clone();
        qaCache.then(c=>c.put(e.request,copy));
        return res;
      }).catch(()=>qaCache.then(c=>c.match(e.request)))
    );
    return;
  }
  e.respondWith(
    qaCache.then(c=>c.match(e.request)).then(r=>r||fetch(e.request).then(res=>{
      if(res && res.ok){
        const copy=res.clone();
        qaCache.then(c=>c.put(e.request,copy));
      }
      return res;
    }))
  );
});



