const toast = (msg, varibles= null) => {
  
  let toastContainer = document.querySelector("#snackbar");
  toastContainer.setAttribute('class', colors())
  toastContainer.innerHTML = `<span> ${msg} </span>`;
  if(varibles != null) {
    toastContainer.innerHTML += `<a href='./?'> Update </a>`;
  }

  toastContainer.classList.add('show');
  
  const removeToast = () => {
    toastContainer.classList.remove('show');
  }

}
setTimeout(
  document.querySelector('#snackbar').classList.remove('show')
, 5000);
