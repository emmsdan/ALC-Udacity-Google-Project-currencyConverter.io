const cacheVersion = '0.1';
const cacheName = 'currencyConverter.io';
const cachNameVersion= `${cacheName}-${cacheVersion}`;

const cachableAPI = [
  'https://free.currencyconverterapi.com/api/v5/currencies',
  'https://free.currencyconverterapi.com/api/v5/countries'
];

const cachableFiles = [
  './',
  './index.html',
  './css/currency.css',
  './js/controller.js',
  './js/converter.js'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    //get cache first time
    caches.open(cachNameVersion)
    .then((cache) => {
      return cache.addAll(cachableFiles.concat(cachableAPI))
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    //activate new cache
    caches.keys()
    .then( (keys) => {
        return Promise.all(keys.map((key, i) => {
          if(key !== cachNameVersion){
            return caches.delete(keys[i]);
          }
      }))
    })  
  )
});

self.addEventListener('fetch', (event) => {
  let url = event.request.clone();

  event.respondWith(
    caches.match(event.request)
    .then((res) => {
      if(res){
        return res;
      }
      return fetch(url)
      .then((res) => {        
        if(!res || res.status !== 200 || res.type !== 'basic'){
          return res;
        }
        let response = res.clone();
        caches.open(cachNameVersion)
        .then((cache) => {
          cache.put(event.request, response);
        });
        return res;
      })
    })
  )
});

self.addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});

self.addEventListener('controllerchange', () => {
  console.log('sdadasasd')
    window.location.assign('./');
})
