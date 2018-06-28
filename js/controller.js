const registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;

      navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
      .then( (registration) => { 
          if (!navigator.serviceWorker.controller) return;

          // check if serviceWorker is waiting in queue
          if(registration.waiting){
            toast('new version is available', waitingServiceWorker())
            return;
          }
          // check installing serviceWorker state
          if(registration.installing){
            installingServiceWorker(registration.installing);
            return;
          }
          // update serviceWorker
          if(updateServiceWorker(registration)){
            return toast('updated to new verson');
          }
      }, (err) => {
        toast(`Its like we Got little Issues with Network`);
      });
}

const updateServiceWorker = (state) => {
  state.addEventListener('updatefound', ()=>{
    installingServiceWorker(state);
  })
  return;
}

const installingServiceWorker = (status) => {
  status.addEventListener('statechange', ()=>{
    if(status.state == 'installed'){
      toast('page updated new verson')
    }
  })
}

const waitingServiceWorker = (state) => {

}

// caching

const initializeCache = (cacheName, cacheFiles) => {
  caches.open(cacheName)
  .then((cache) => {
    return cache.addAll(cacheFiles);
  })
}

const activateCache = (cacheName) => {
  caches.keys()
  .then( (keys) => {
      return Promise.all(keys.map((key, i) => {
          if(key !== cacheName){
              return caches.delete(keys[i]);
          }
      }))
  })
}

const checkCache = (event) => {
  caches.match(event.request)
  .then((response) => {
    return false;
    // check for request exist and return request on true
    if (response)  return response;
    // check server for request if not exist
    _ServerResponse(event);
  })
}

const openCaches = (request, response) => {
  caches.open (cachNameVersion)
  .then((cache) => {
    cache.put(request, response);
  })
}

const _ServerResponse = (event) => {
  let url = event.request.clone();
  fetch(url)
  .then((response)=>{
      if (response || response.status == 200 || response == 'basic') return res;

      openCaches(event.request, response.clone());

      return response;
  })
}

