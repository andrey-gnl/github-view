import state from '../state';
import repoList from './repoList';
import {getArrayOfFieldsValue, uniqueArray} from '../utils';
import form from './forms';

const loadMoreBtn = document.getElementById('load-more');

loadMoreBtn.addEventListener('click', function() {

  let myHeaders = new Headers({
    'Accept': 'application/vnd.github.mercy-preview+json'
  });

  fetch(`https://api.github.com/users/${state.ownerName}/repos?page=${state.page + 1}`, {
    headers: myHeaders
  })
    .then((response) => response.json())
    .then((newCards) => {

      state.cards = [...state.cards, ...newCards];

      const newLangs = getArrayOfFieldsValue(newCards, 'language');
      state.langs = uniqueArray([...state.langs, ...newLangs]);
      form.updateLangSelect(newLangs);

      if (state.sortingParams) {
        repoList.sortRepos();
      } else if(state.filterParams) {
        repoList.filterRepos();
      } else {
        repoList.addMoreRepos(newCards);
      }

      state.page++;
    });
});
