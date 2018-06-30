/* 
  * author @emmsdan
  * for @alc 3.0
  * date @2018-june
*/

/* a little toast, won't kill */
const toast = (msg, varibles= null) => {
  
  let toastContainer = document.querySelector("#snackbar");
  toastContainer.setAttribute('class', colors())
  toastContainer.innerHTML = `<span> ${msg} </span>`;
  
  varibles != null ? toastContainer.innerHTML += `<a href='./?'> Update </a>` : '';
  
  toastContainer.classList.add('show');
  
  const removeToast = () => {
    toastContainer.classList.remove('show');
  }

}
setTimeout(
  document.querySelector('#snackbar').classList.remove('show')
, 5000);
