/* 
  * author @emmsdan
  * for @alc 3.0
  * date @2018-june
*
/* naming and settings for indexDB */
let dbname = {exchange: '', currency: ''}

const startDb = () => {
// for browser compactibility
  const dBase = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  localIndexStorage = window.LocalIndexedStorage;

  // Check for service worker and IndexedDB
  if (!navigator.serviceWorker || !window.LocalIndexedStorage){ 
    toast('Your Browser is a little outdated. Please Make a date with the latest Browser to browse offline');
    return Promise.resolve();
  }


  const registerServiceWorker = () => {
    navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
    .then((registration) => {
        // checking if controller is available or free
        if (!navigator.serviceWorker.controller) return;

        if(registration.waiting){
          serviceWorkerInstallation(registration.installing);
          return;
        }
        if (registration.installing){
          serviceWorkerInstallation(registration.installing);
          return;
        }
        registration.addEventListener('updatefound', () => {
          toast('New Version Available', 'updateServiceWorker');
          registration.waiting.postMessage('skipWaiting');
          return;
        });
    })
    .catch((err) => {
      console.log(`Error: SR2312, ${err}`)
    })
  }
  registerServiceWorker();
}

/* check user is using the latest version */
const serviceWorkerInstallation = (status) =>{
  status.addEventListener('statechange', () => {
    if (status.state == 'installed'){
          toast('New Version Available', 'updateServiceWorker');
          registration.waiting.postMessage('skipWaiting');
    }
  })
}

/*
  the following two functions are for online conversion of currencies.
    they both  go online to get requested exchange rate and store it in the indexdb
    the difference is.
        * onlineConvertion(): access the requested currencies directly while
        * onlineReverseConvertion() : access the requested currencies in a reverse order.
*/
const onlineConvertion = () => {
  let fromCurrency = getFromCurrency();;
  let toCurrency = getToCurrency();
    
  fetch (getAPIUrl(toCurrency, fromCurrency))
  .then ((response)=>{
    return response.json();
  })
  .then ((jsonResponse)=>{
    const currency = jsonResponse[`${toCurrency}_${fromCurrency}`];
    //display exchange rate.
      displayExchangeRate({rate :conversion(currency, getAmount()), date: getDate()})
    // go online again and get the reserve for future use.
      onlineReverseConvertion(getFromCurrency(), getToCurrency());
    //now store the previos exchange rate into database
      storeIntoDatabase(`${toCurrency}_${fromCurrency}`, currency);
      return; 
  })
  .catch ((e)=>{
    toast('Oops, connection issues. Reconnecting...');
  })
}

const onlineReverseConvertion = (fromCurrency, toCurrency) => {

  fetch (getAPIUrl(fromCurrency, toCurrency))
  .then ((response)=>{
    return response.json();
  })
  .then ((jsonResponse)=>{
    const currency = jsonResponse[`${fromCurrency}_${toCurrency}`];
      storeIntoDatabase(`${fromCurrency}_${toCurrency}`, currency);
  })
  .catch ((e)=>{
    toast('Error Connecting to the server. try again...');
  })
}

/* get and store exchange rate into IndexDB */
const storeIntoDatabase = (conversions, amount) => {
  return localIndexStorage.open()
  .then((idb) => {
    localIndexStorage.setExchangeRate(conversions, amount, idb)
    toast('Do you know this exchange is now available offline?')
  })
  .catch((error) => {
    console.log('Database error: ', error.message)
  })
}
