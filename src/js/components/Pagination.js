import state from '../state';
import repoList from './repoList';
import { getArrayOfFieldsValue, uniqueArray } from '../utils';
import form from './forms';

class Pagination {
  constructor() {
    this._isExists = false;
    this._disabled = false;

    this._template = '<button type="button" class="btn" id="load-more">Load more</button>';
    this._wrap = document.getElementById('pagination');
  }

  init() {
    this._wrap.insertAdjacentHTML('beforeEnd', this._template);
    this._button = document.getElementById('load-more');

    this._button.addEventListener('click', this._handleClick.bind(this));
    this._isExists = true;
  }

  isInited() {
    return this._isExists;
  }

  _makeDisable() {
    this._button.setAttribute('disabled', '');
    this._disabled = true;
  }

  _makeActive() {
    this._button.removeAttribute('disabled');
    this._disabled = false;
  }

  _handleClick() {

    this._makeDisable();

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
        } else if (state.filterParams) {
          repoList.filterRepos();
        } else {
          repoList.addMoreRepos(newCards);
        }
        this._makeActive();
        state.page++;
      });
  }

}

export default new Pagination();
