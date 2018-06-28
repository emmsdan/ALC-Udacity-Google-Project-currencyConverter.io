
const registerServiceWorker = () => {
  if (!navigator.serviceWorker) return toast('Service Worker not supported');

  navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
  .then((registration) => {
  console.log('welcome home again');
      // checking if controller is true/false
      if (!navigator.serviceWorker.controller) return;

      if(registration.waiting){
        toast('New Version Available', 'updateServiceWorker');
        registration.waiting.postMessage('skipWaiting');
        return;
      }
      if (registration.installing){
        serviceWorkerInstallation(registration.installing);
        return;
      }

      registration.addEventListener('updatefound', () => {
        serviceWorkerInstallation(registration.installing);
        return;
      });
  })
  .catch((err) => {
    console.log(`Error: SR2312, ${err}`)
  })
}
const serviceWorkerInstallation = (status) =>{
  status.addEventListener('statechange', () => {
    if (status.state == 'installed'){
      toast('you are now using latest version');
    }
  })
}
