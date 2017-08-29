import {getRepo} from './repo';
import state from '../state';

const createList = () => `<div class="list" id="list">${addRepos()}</div>`;

const addRepos = (repos = state.cards) => {
  // const listEl = document.getElementById('list');
  let cards = '';
  // console.log(repos);
  repos.forEach(repo => cards += `<div class="list__item">${getRepo(repo)}</div>`);
  return cards;
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
  console.log('type', type);
  const sortedCards = type !== 'updated_at' ? repos.sort((a,b) => a[type] - b[type]) : repos.sort((a,b) => new Date(a[type]) - new Date(b[type]));

  if(order === 'descending') sortedCards.reverse();

  state.cards = sortedCards;

  if(state.filterParams) {
    filterRepos();
  } else {
    resetRepos();
  }
};

export const filterRepos = (params = state.filterParams) => {
  const {has_issues, stargazers_count, topics, date, language} = params;
  const repos = state.cards;

  const filteredRepos = repos.filter(repo => {
    return (has_issues ? !!repo.open_issues_count : true)
      && repo.stargazers_count >= stargazers_count
      && (topics ? !!repo.topics.length: true)
      && (date !== 'none' ? repo.updated_at > date : true)
      && ( language !== 'all' ? repo.language === language : true);
  });
  // console.log(filteredRepos);
  state.filteredRepos = filteredRepos;

  resetRepos(filteredRepos);
};

export default { createList, addMoreRepos, sortRepos, filterRepos };