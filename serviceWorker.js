const cacheVersion = '0.2';
const cacheName = 'currencyConverter.io';
const cachNameVersion= `${cacheName}-${cacheVersion}`;

//const Controller = new PageController();

const cachableAPI = [
  'https://free.currencyconverterapi.com/api/v5/currencies',
  'https://free.currencyconverterapi.com/api/v5/countries'
];

/*
const cachableAPI = [
  './api/countries.json',
  './api/currencies.json'
];
*/
const cachableFiles = [
  './',
  './img/currency_icon.png',
  './index.html',
  './css/currency.css',
  './js/PageController.js',
  './js/converter.js',
  './js/calculator.js'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    //store cache first time
    caches.open(cachNameVersion)
    .then((cache) => {
      cache.addAll(cachableFiles.concat(cachableAPI));
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
  const url = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      return false;
      // check for request exist and return request on true
      if (response)  return response;
      // check server for request if not exist
      let url = event.request.clone();
  fetch(url)
  .then((response)=>{
      if (response || response.status == 200 || response == 'basic') return res;

      caches.open (cachNameVersion)
  .then((cache) => {
    cache.put(event.request, response.clone());
  })
      return response;
  })
    })
  );
});