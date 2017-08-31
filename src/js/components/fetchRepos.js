import state from '../state';
import content from './content';
import Pagination from './Pagination';
import {getArrayOfFieldsValue} from '../utils';
import {handleErrors} from '../utils';

const input = document.getElementById('owner-name');
const form = document.getElementById('get-repos-form');
const button = document.getElementById('get-repos');
const errorMsg = '<div class="danger" id="error-message">Invalid Name</div>';
let isLoading = false;
let hasError = false;

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const ownerName = input.value;

  if(!ownerName.length || ownerName === state.ownerName || isLoading) return;

  state.ownerName = ownerName;
  isLoading = true;
  button.setAttribute('disabled', '');
  let myHeaders = new Headers({
    'Accept': 'application/vnd.github.mercy-preview+json'
  });

  fetch(`https://api.github.com/users/${ownerName}/repos`, {
    headers: myHeaders
  })
    .then(handleErrors)
    .then((response) => response.json())
    .then((newCards) => {
      state.cards = newCards;
      state.langs = getArrayOfFieldsValue(state.cards, 'language');
      state.filterParams = null;
      state.sortParams = null;
      if(hasError) {
        input.classList.remove('has-error');
        document.getElementById('error-message').remove();
      }

      content.init();
      button.removeAttribute('disabled');
      isLoading = false;
      hasError = false;
      !Pagination.isInited() && Pagination.init();
    })
    .catch(() => {
      input.classList.add('has-error');
      input.insertAdjacentHTML('afterend', errorMsg);
      hasError = true;
      isLoading = false;
      button.removeAttribute('disabled');
    });

  // content.init();
});
