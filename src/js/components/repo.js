import {formatDate} from '../utils';
import {handleErrors} from '../const';
import {BODY} from '../const';
import state from '../state';

const getRepo = ({id, name, description, stargazers_count, updated_at, language, fork}) => `
  <a href="#" class="repo" data-id="${id}">
    <div class="repo__name">${name}</div>
    ${fork ? '<div class="repo__forked">Is forked</div>' : ''}
    <div class="repo__description">${description ? description: '<em>No description</em>' }</div>
    <div class="repo__footer">
      <div class="repo__stars">Stars: <strong>${stargazers_count}</strong>  </div>
      <div class="repo__lang">Lang: ${language ? language : '-' }</div>
      <div class="repo__date">Updated on ${formatDate(updated_at)}</div>
    </div>
  </a>
`;

BODY.addEventListener('click', function(e) {
  const target = e.target;
  if(target.closest('.repo')) {
    showModal(e);
    e.preventDefault();
  }
  if(target.closest('#close-modal')) {
    closeModal(e);
    e.preventDefault();
  }
});

const getContributors = (contributors) => {
  const amount = contributors.length >= 3 ? 3 : contributors.length;
  let template = '';

  if (!amount) return 'there is no contributors... :(';

  for (let i = 0; i < amount; i++) {
    const contributor = contributors[i];

    template += `<div class="info__row">
    <div class="info__cell"><a href="${contributor.url}" class="info__name">${contributor.avatar_url ? `<div class="info__img" style="background-image: url('${contributor.avatar_url}')"></div>` : ''}${contributor.login}</a></div>
    <div class="info__cell">${contributor.contributions}</div>
  </div>`;

  }

  return template ;
};

const getPulls = (pulls) => {
  const amount = pulls.length >= 5 ? 5 : pulls.length;
  let template = '';

  if (!amount) return 'there is no pulls... :(';

  for (let i = 0; i < amount; i++) {
    const pull = pulls[i];

    template += `<li><a href="${pull.html_url}">${pull.title}</a></li>`;

  }

  return `<ol>${template}</ol>`;
};

const modalTemplate = ({full_name, html_url, fork, parent, contributors, pulls}) => {
  return `<div class="modal" id="modal">
  <div class="modal__inner">

  <div class="modal__close">
    <button class="btn-close" id="close-modal">
      <svg viewBox="0 0 40 40">
        <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
      </svg>
    </button>
  </div>

  <div class="modal__title">${full_name}</div>
  <div class="modal__body">
    <div class="info">
      <div class="info__property">link to repo</div>
      <div class="info__value">
        <a href="${html_url}">${html_url}</a>
      </div>
    </div>

    ${fork ? `<div class="info">
    <div class="info__property">Source</div>
    <div class="info__value">
      <a href="${parent.html_url}">${parent.html_url}</a>
    </div>
  </div>` : ''}

    <div class="info">
      <div class="info__property">Contributors</div>
      <div class="info__value">
        ${getContributors(contributors)}
      </div>
    </div>
    <div class="info">
      <div class="info__property">Most commented PRs</div>
      <div class="info__value">
        ${getPulls(pulls)}
      </div>
    </div>
  </div>
</div>
</div>`;
};

const showModal = (e) => {
  const id = e.target.closest('.repo').dataset.id;
  const repo = state.cards.find(el => +el.id === +id);
  const data = {};

  fetch(`https://api.github.com/repos/${state.ownerName}/${repo.name}`)
    .then(handleErrors)
    .then((response) => response.json())
    .catch(function(error) {
      console.log('error with repository access');
      console.log(error.message);
    })
    .then((repository) => {
      const {full_name, html_url, fork, name, parent, contributors_url} = repository;
      console.log('contributors_url',contributors_url);
      Object.assign(data, {full_name, html_url, fork, name, parent, contributors_url});
      return fetch(contributors_url);
    })
    .then(handleErrors)
    .then((response) => response.json())
    .catch(function(error) {
      console.log('error with contributors');
      console.log(error);
    })
    .then((contributors) => {
      Object.assign(data, {contributors});
      return fetch(`https://api.github.com/repos/${state.ownerName}/${repo.name}/pulls?sort=popularity`);
    })
    .then(handleErrors)
    .then((response) => response.json())
    .catch(function(error) {
      console.log('error with pulls');
      console.log(error);
    })
    .then((pulls) => {
      console.log(pulls);
      Object.assign(data, {pulls: pulls.reverse()});

      BODY.insertAdjacentHTML('beforeEnd', modalTemplate(data));
    });

};

const closeModal = (e) => {
  const modal = document.getElementById('modal');
  modal.remove();
};

export { getRepo };
