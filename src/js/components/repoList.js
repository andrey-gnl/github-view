import {getRepo} from './repo';
import {BODY} from '../const';
import state from '../state';

const createList = () => `<div class="list" id="list">${addRepos()}</div>`;

const addRepos = (repos = state.cards) => {
  return repos.reduce((result, repo) => result += `<div class="list__item">${getRepo(repo)}</div>`, '');
};

export const addMoreRepos = (repos) => {
  const content = document.getElementById('list');
  content.insertAdjacentHTML('beforeEnd', addRepos(repos));
};

export const resetRepos = (newRepos = state.cards) => {
  const content = document.getElementById('list');

  content.innerHTML = '';
  content.insertAdjacentHTML('beforeEnd', addRepos(newRepos));
};

export const sortRepos = (params = state.sortingParams) => {
  const repos = state.cards;
  const {order, type} = params;

  let sortedCards = [];

  switch(type) {
    case 'updated_at':
      sortedCards = repos.sort((a,b) => new Date(a[type]) - new Date(b[type]));
      break;
    case 'name':
      sortedCards = repos.sort((a,b) => {
        if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
      break;
    default:
      sortedCards = repos.sort((a,b) => a[type] - b[type]);
      break;
  }

  if(order === 'descending') sortedCards.reverse();

  state.cards = sortedCards;
  state.filterParams ? filterRepos() : resetRepos();
};

export const filterRepos = (params = state.filterParams) => {
  const {has_issues, stargazers_count, topics, date, language, type} = params;
  const repos = state.cards;
  const forked = type === 'fork' ? true : false;
  const filteredRepos = repos.filter(repo => {
    return (has_issues ? !!repo.open_issues_count : true)
      && repo.stargazers_count >= stargazers_count
      && (topics ? !!repo.topics.length: true)
      && (date !== 'none' ? repo.updated_at > date : true)
      && ( language !== 'all' ? repo.language === language : true)
      && ( type !== 'all' ? repo.fork === forked : true);
  });
  language !== 'all'
    ? BODY.classList.add('is-lang-filter')
    : BODY.classList.remove('is-lang-filter');

  type !== 'all'
    ? BODY.classList.add('is-type-filter')
    : BODY.classList.remove('is-type-filter');

  state.filteredRepos = filteredRepos;

  resetRepos(filteredRepos);
  updateCount();
};

const updateCount = () => {
  let count = document.getElementById('count');

  if (!count) {
    document
      .querySelector('#form-filters h2')
      .insertAdjacentHTML('beforeEnd', '<span id="count"></span>');
    count = document.getElementById('count');
  }
  count.innerHTML = `${state.filteredRepos.length} <em>/ ${state.cards.length}</em>`;
};

export default { createList, addMoreRepos, sortRepos, filterRepos };
