const CACHE="xixi-ece-v20261027-20mweek3-1";
const PRODUCTION_CACHE_PATTERN=/^xixi-ece-v\d+-.*-\d+$/;
const SHELL=["./","./index.html","./manifest.webmanifest","./apple-touch-icon.png","./icon-192.png","./icon-512.png","./top-avatar.png","./fox-app-icon.png","./triangle-reference.png","./icon-lang.svg","./icon-math.svg","./icon-eng.svg","./icon-lesson.svg","./icon-other.svg","./data/curriculum.json"];
const SCOPE_URL=new URL(self.registration.scope);
const QA_PATH=new URL("qa/",SCOPE_URL).pathname;
const ownCache=()=>caches.open(CACHE);
function isQaRequest(url){return url.origin===SCOPE_URL.origin&&(url.pathname===QA_PATH.slice(0,-1)||url.pathname.startsWith(QA_PATH));}

self.addEventListener("install",event=>{
  event.waitUntil(ownCache().then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(key=>key!==CACHE&&PRODUCTION_CACHE_PATTERN.test(key)).map(key=>caches.delete(key))
  )).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(isQaRequest(url)) return;
  if(url.origin!==SCOPE_URL.origin) return;

  if(url.pathname.endsWith("/data/curriculum.json")){
    event.respondWith(fetch(event.request,{cache:"no-store"}).then(response=>{
      if(response&&response.ok){const copy=response.clone();ownCache().then(cache=>cache.put(event.request,copy));}
      return response;
    }).catch(()=>ownCache().then(cache=>cache.match(event.request))));
    return;
  }

  event.respondWith(ownCache().then(cache=>cache.match(event.request)).then(cached=>cached||fetch(event.request).then(response=>{
    if(response&&response.ok){const copy=response.clone();ownCache().then(cache=>cache.put(event.request,copy));}
    return response;
  })));
});



