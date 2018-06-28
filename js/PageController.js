class PageController {
  constructor() {
    this.registerServiceWorker();
  }
  registerServiceWorker (){
    if (!navigator.serviceWorker) return;

        navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
        .then( (registration) => { 
            if (!navigator.serviceWorker.controller) return;

            // check if serviceWorker is waiting in queue
            if(registration.waiting){
              toast('new version is available', this.waitingServiceWorker())
              return;
            }
            // check installing serviceWorker state
            if(registration.installing){
              this.installingServiceWorker(registration.installing);
              return;
            }
            // update serviceWorker
            if(this.updateServiceWorker(registration)){
              return toast('updated to new verson');
            }
        }, (err) => {
          toast(`Its like we Got little Issues with Network`);
        });
  }
  
  updateServiceWorker(state) {
    state.addEventListener('updatefound', ()=>{
      this.installingServiceWorker(state);
    })
    return;
  }
  
  installingServiceWorker (status) {
    status.addEventListener('statechange', ()=>{
      if(status.state == 'installed'){
        toast('page updated new verson')
      }
    })
  }

  waitingServiceWorker (state) {

  }

  // caching

  initializeCache(cacheName, cacheFiles){
    caches.open(cacheName)
    .then((cache) => {
      return cache.addAll(cacheFiles);
    })
  }

  activateCache(cacheName){
    caches.keys()
    .then( (keys) => {
        return Promise.all(keys.map((key, i) => {
            if(key !== cacheName){
                return caches.delete(keys[i]);
            }
        }))
    })
  }

  checkCache(event){
    caches.match(event.request)
    .then((response) => {
      return false;
      // check for request exist and return request on true
      if (response)  return response;
      // check server for request if not exist
      this._ServerResponse(event);
    })
  }

  openCaches (request, response) {
    caches.open (cachNameVersion)
    .then((cache) => {
      cache.put(request, response);
    })
  }

  _ServerResponse(event){
    let url = event.request.clone();
    fetch(url)
    .then((response)=>{
        if (response || response.status == 200 || response == 'basic') return res;

        this.openCaches(event.request, response.clone());

        return response;
    })
  }

}

