/* 
  * author @emmsdan
  * for @alc 3.0
  * date @2018-june
*/

const cacheVersion = '2.0';
const cacheName = 'currencyConverter.io';
const cachNameVersion= `${cacheName}-${cacheVersion}`;

/* add api files to be cached */
const cachableAPI = [
  'https://free.currencyconverterapi.com/api/v5/currencies',
  'https://fonts.googleapis.com/css?family=Markazi+Text',
];
/* other files to be cached */
const cachableFiles = [
  './',
  './img/AGNB-loading.gif',
  './img/51Tn1CC9wlL.png',
  './img/calculator-icon.png',
  './index.html',
  './css/alcproject.css',
  './js/emmsdanExtra.js',
  './js/controller.js',
  './js/converter.js',
  './js/database.js',
  './serviceWorker.js'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    //add cache to system
    caches.open(cachNameVersion)
    .then((cache) => {
      try {
        return cache.addAll(cachableFiles.concat(cachableAPI))
      }catch (e) {
        return 'Could not Access Server';
      }
    })
  );
});

/* removes old cached files and update it to the latest version */
self.addEventListener('activate', (event) => {
  event.waitUntil(
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

/* 
  handles all request made by the browser.
*/
self.addEventListener('fetch', (event) => {
  let url = event.request.clone();
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {

    event.respondWith(
      fetch(event.request).catch(error => {
        console.log('Oops, You are offline, Currently');
        return caches.match('index.html');
      })
    );
    
  }else{
    event.respondWith(
      caches.match(event.request)
      .then((res) => {
        if(res){
          return res;
        }
        return fetch(url).then((res) => {        
          if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
          }
          let response = res.clone();
          caches.open(cachNameVersion)
          .then((cache) => {
            cache.put(event.request, response);
          });
          return res;
        }).catch ((error)=> {
          return error;        
        })
      })
    )
  }
});

self.addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});

self.addEventListener('controllerchange', () => {
    window.location.assign('./');
})
