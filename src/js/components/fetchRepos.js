import state from '../state';
import content from './content';
import Pagination from './Pagination';
import {getArrayOfFieldsValue, handleErrors} from '../utils';
import {REPOS_PER_PAGE} from '../const';

const input = document.getElementById('owner-name');
const form = document.getElementById('get-repos-form');
const button = document.getElementById('get-repos');
const errorMsg = (msg) => `<div class="danger" id="error-message">Error: ${msg}</div>`;
let isLoading = false;
let hasError = false;

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const ownerName = input.value;

  if(!ownerName.length || ownerName === state.ownerName || isLoading) return;

  isLoading = true;
  button.classList.add('loading');
  button.setAttribute('disabled', '');
  let myHeaders = new Headers({
    'Accept': 'application/vnd.github.mercy-preview+json'
  });

  fetch(`https://api.github.com/users/${ownerName}/repos?per_page=${REPOS_PER_PAGE}`, {
    headers: myHeaders
  })
    .then(handleErrors)
    .then((response) => response.json())
    .then((newCards) => {
      state.cards = newCards;
      state.langs = getArrayOfFieldsValue(state.cards, 'language');
      state.filterParams = null;
      state.sortParams = null;
      state.ownerName = ownerName;

      if(hasError) {
        input.classList.remove('has-error');
        document.getElementById('error-message').remove();
      }

      content.init();
      button.removeAttribute('disabled');
      button.classList.remove('loading');
      isLoading = false;
      hasError = false;
      !Pagination.isInited() && Pagination.init();

      newCards.length < REPOS_PER_PAGE ? Pagination.makeDisable() : Pagination.makeActive();

    })
    .catch((error) => {
      input.classList.add('has-error');
      input.insertAdjacentHTML('afterend', errorMsg(error.message));
      hasError = true;
      isLoading = false;
      button.removeAttribute('disabled');
      button.classList.remove('loading');

    });

  // content.init();
});
