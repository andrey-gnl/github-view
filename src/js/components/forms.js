import state from '../state';
import repoList from './repoList';
import {formSerialize, getArrayOfFieldsValue} from '../utils';

export const templateInit = () => `
  <div class="forms">
    <form class="form" id="form-filters">
      <h2 class="h2">Filters</h2>
      <div class="form-group">
        <div class="form-item">
          <label class="checkbox">
            <input type="checkbox" name="has_issues">
            <span>Has open issues</span>
          </label>
        </div>
        <div class="form-item">
          <label class="checkbox">
            <input type="checkbox" name="topics">
            <span>Has topics</span>
          </label>
        </div>
        <div class="form-item">
          <label class="select">
            <span>Stars:</span>
            <select name="stargazers_count">
              <option value="0" selected>more than 0</option>
              <option value="50">more than 50</option>
              <option value="100">more than 100</option>
              <option value="1000">more than 1000</option>
            </select>
          </label>
        </div>
        <div class="form-item">
          <label class="select">
            <span>Updated after:</span>
            <select name="date">
              <option value="none">None</option>
              <option value="2016-10-01">November 2016</option>
              <option value="2017-01-01">January 2017</option>
              <option value="2017-03-01">March 2017</option>
              <option value="2017-05-01">May 2017</option>
              <option value="2017-07-01">July 2017</option>
            </select>
          </label>
        </div>
        <div class="form-item">
          <label class="select">
            <span>Type:</span>
            <select name="type">
              <option value="all">All</option>
              <option value="forks">Forks</option>
              <option value="sources">Sources</option>
            </select>
          </label>
        </div>
        <div class="form-item">
          <label class="select">
            <span>Language:</span>
            <select name="language" id="lang-select">
              <option value="all" selected>All</option>
              ${state.langs.map(el => `<option value="${el}">${el}</option>`)}
            </select>
          </label>
        </div>
      </div>
    </form>

    <form class="form" id="form-sorting">
      <h2 class="h2">Sorting</h2>
      <div class="form-group">
        <div class="form-item">
          <label class="select">
            <span>Order:</span>
            <select name="order">
              <option value="ascending" selected>Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </label>
        </div>
        <div class="form-item">
          <label class="select">
            <span>By:</span>
            <select name="type">
              <option value="name" selected>Name</option>
              <option value="stargazers_count">Stars</option>
              <option value="open_issues_count">Open issue count</option>
              <option value="updated_at">Updated date</option>
            </select>
          </label>
        </div>
      </div>
    </form>
  </div>
`;

export const updateLangSelect = (newLangs) => {
  const select = document.getElementById('lang-select');
  const selectOptions = select.querySelectorAll('option');
  const optionsArray = [...selectOptions].map(o => o.value);

  newLangs.forEach((lang) => {
    if (!optionsArray.includes(lang)) {
      select.insertAdjacentHTML('beforeEnd', `<option value="${lang}">${lang}</option>`);
    }
  });
};

export const init = () => {
  const formFilters = document.getElementById('form-filters');
  const formSorting = document.getElementById('form-sorting');

  formFilters.addEventListener('change', handleChangeFilters);
  formSorting.addEventListener('change', handleChangeSorting);
};

const handleChangeFilters = (e) => {
  const form = e.currentTarget;
  const serialize = formSerialize(form);

  state.filterParams = serialize;
  repoList.filterRepos();
};

const handleChangeSorting = (e) => {
  const form = e.currentTarget;
  const serialize = formSerialize(form);
  state.sortingParams = serialize;
  repoList.sortRepos();
};

export default {init, templateInit, updateLangSelect};
