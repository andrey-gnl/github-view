import state from '../state';
import content from './content';
import {getArrayOfFieldsValue} from '../utils';

const input = document.getElementById('ownerName');
const form = document.getElementById('getReposForm');

form.addEventListener('submit', function(e) {
  const ownerName = input.value;
  if(!ownerName.length) return;
  state.ownerName = ownerName;

  let myHeaders = new Headers({
    'Accept': 'application/vnd.github.mercy-preview+json'
  });

  fetch(`https://api.github.com/users/${ownerName}/repos`, {
    headers: myHeaders
  })
    .then((response) => response.json())
    .then((newCards) => {
      state.cards = newCards;
      state.langs = getArrayOfFieldsValue(state.cards, 'language');
      content.init();
    });

  // content.init();
  e.preventDefault();
});
