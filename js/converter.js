 /* javascript */

/* 
  define varibles
*/
const APIDomain = 'https://free.currencyconverterapi.com/api/v5/';	
const APIRoute = {'convert':'convert', 'currency': 'currencies', 'country':'countries'};

/* users form */
const convertButton = document.querySelector('#userSubmit');
const amount = document.querySelector('#amountInput');
const currencyTo = document.querySelector('#currencyTo');
const currencyFrom = document.querySelector('#currencyFrom');

/* div's and containers */
const notify = document.querySelector('.notification');
const exchangeRate = document.querySelector('.exchangeRate');

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

const displayExchangeRate = (exRate) => {
  return exchangeRate.innerText = `${getToCurrency()}${exRate.toCurrencyString()}`;
}

const setSelectOptions = (display, value) => {
  const getSelect = document.querySelectorAll('select');
  for (let option of getSelect){
    option.innerHTML += `<option value='${value}'> ${display}</option>`;
  }
}

/* 
  start writing code
*/

const getAPIUrl = () => {
    return `${APIDomain}${APIRoute['convert']}?q=${getFromCurrency()}_${getToCurrency()}&compact=ultra`;
}

const getCurrency = () => {
  fetch (`${APIDomain}${APIRoute['currency']}`)
  .then ((response)=>{
    return response.json();
  })
  .then ((jsonResponse)=>{
    const currency = jsonResponse.results;
    for(let key in currency){
      setSelectOptions(`${currency[key].id} -- ${currency[key].currencyName}`, key)
    }
  })
  .catch ((e)=>{
    notify.innerText = e;
  })
}
const getExchangeRate = () => {
  fetch (getAPIUrl())
  .then ((response)=>{
    return response.json();
  })
  .then ((jsonResponse)=>{
    const currency = jsonResponse[`${getFromCurrency()}_${getToCurrency()}`];
    displayExchangeRate((Math.round(currency*getAmount() * 100) / 100))
  })
  .catch ((e)=>{
    notify.innerText = e;
  })
} 
const checkData = () => {
  let returnInputs = getAmount() !== false && getToCurrency() !== 'convert to' && getFromCurrency() !== 'convert From' ? getExchangeRate() : amount.focus();
}
getCurrency();
