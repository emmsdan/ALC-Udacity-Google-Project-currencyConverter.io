/* 
  * author @emmsdan
  * for @alc 3.0
  * date @2018-june
*
/* 
      little polylling here 
      for converting money to currency type
  */
  
  String.prototype.toCurrencyString = (prefix, suffix) => {
    prefix = typeof prefix === 'undefined' ?  '' : prefix;
    suffix = typeof suffix === 'undefined' ?  '' : suffix;
    var _localeBug = new RegExp((1).toLocaleString().replace(/^1/, '').replace(/\./, '\\.') + "$");
    return prefix + (~~this).toLocaleString().replace(_localeBug, '') + (this % 1).toFixed(2).toLocaleString().replace(/^[+-]?0+/,'') + suffix;
  }

/* javascript */

/* 
  api routes and line
*/
  
const APIDomain = 'https://free.currencyconverterapi.com/api/v5/';
const APIRoute = {'convert':'convert', 'currency': 'currencies', 'country':'countries'};

/* users form */
const convertButton = document.querySelector('#userSubmit');
const amount = document.querySelector('#amountInput');
const currencyTo = document.querySelector('#currencyTo');
const currencyFrom = document.querySelector('#currencyFrom');

/* div's and containers for displaying errors and final output */
const notify = document.querySelector('.notification');
const exchangeRate = document.querySelector('.exchangeRate');

/* 
  event listeners for the 
    1. submit button,
    2. user input and 
    3. select options 
*/
convertButton.addEventListener('click', () => {
  checkData();
});
amount.addEventListener('keypress', () => {
  checkData();
});
currencyFrom.addEventListener('change', () => {
  checkData();
});
currencyTo.addEventListener('change', () => {
  checkData();
});

/* get user actions (clicks, inputs and selects) */
const getAmount = () => {
  return amount.value=='' ? false : amount.value;
}
const getFromCurrency = () => {
  return currencyFrom.value=='' ? false : currencyFrom.value;
}
const getToCurrency = () => {
  return currencyTo.value=='' ? false : currencyTo.value;
}

/* display user actions (exchange rate, calculation) */

const displayExchangeRate = (display) => {
  const { rate, date } = display;
  return exchangeRate.innerHTML = `${getToCurrency()}${rate} <small>as @ ${date} </small>`;
}

const setSelectOptions = (display, value) => {
  const getSelect = document.querySelectorAll('select');
  for (let option of getSelect){
    option.innerHTML += `<option value='${value}'> ${display}</option>`;
  }  
}

/* 
  define url for current convertion
*/
const getAPIUrl = (curFrom, curTo) => {
    return `${APIDomain}${APIRoute['convert']}?q=${curFrom}_${curTo}&compact=ultra`;
}

/* 
  check api server for list of available currencies
  and list them in the select list options
*/
const getCurrency = () => {
  fetch (`${APIDomain}${APIRoute['currency']}`)
  .then ((response)=>{
    return response.json();
  })
  .then ((jsonResponse)=>{
    const currency = jsonResponse.results;
    let currencySymbol = '';
    for(let key in currency){
      currencySymbol = currency[key].currencySymbol !== undefined ? `-${currency[key].currencySymbol}-` : '';
      setSelectOptions(`${currency[key].id} ${currencySymbol} ${currency[key].currencyName}`, key)
    }
  })
  .catch ((e)=>{
    notify.innerText = e;
  })
}
/*
  checks if exchange rate already exist in IndexDB
      if true opens and supply user
      else
  check online for exchange rate
      if true return and store in database
      else return false. tell the user nothing like that exist
*/
   
const getExchangeRate = () => {
  exchangeRate.innerHTML = "<img src='./img/AGNB-loading.gif'/>";
    const exchange = `${getFromCurrency()}_${getToCurrency()}`;

    localIndexStorage.open().then((idbase) => {
      console.log(idbase)
      return localIndexStorage.getExchangeRate(exchange, idbase)
    })
    .then((localResponse) => {
      if (!localResponse)         return onlineConvertion(null);
      const { value, dates } = localResponse;
          return displayExchangeRate({rate : conversion(value, getAmount()), 'date' : dates});
      })
    .catch((error) => {
      console.log(error)
      return onlineConvertion(null);
    });
};

/* conversion of amount to be converted and exchange rate to requested amount*/ 
const conversion = (dbcurrency, amount) => {
  if (dbcurrency) {
    return (Math.round((dbcurrency * amount) * 100) / 100);
  }
}

/* 
  check if all neccessary fields are filled and currencies are selected 
  before processing to exchange rate
*/
const checkData = () => {
  let returnInputs = getAmount() !== false && getToCurrency() !== 'convert to' && getFromCurrency() !== 'convert From' ? getExchangeRate() : amount.focus();
}

/* get date from user */
const getDate = () => {
  let date = new Date();
  let time = date.toLocaleTimeString();
  date = `${date.getDate()}/${date.getDay()}/${date.getFullYear()}`;
  time =  time.split(':');
  const amPM = time[2].split(' ');
  hour = `${time[0]}:${time[1]} ${amPM[1]}`
    return `${date}, ${hour}`;
}
/* random colors for toast button */
const colors = () => {
    const colors = ['blue', 'red', 'teal', 'blue-grey', 'black']
  return `w3-${colors[Math.floor(Math.random() * colors.length)]}`;
}
