const CACHE="xixi-fox-week-v9";
const ASSETS=['./','./index.html?v=9','./manifest.webmanifest?v=9','./icon-192.png?v=9','./icon-512.png?v=9','./apple-touch-icon.png?v=9','./apple-touch-icon-precomposed.png?v=9','./favicon.png?v=9','./fox-app-icon.png','./top-avatar.png','./icon-lang.svg','./icon-math.svg','./icon-eng.svg','./icon-rhyme.svg','./icon-music.svg','./icon-lesson.svg','./icon-ext.svg','./icon-other.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request)));});
