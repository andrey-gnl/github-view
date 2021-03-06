import state from '../state';
import {handleErrors, convertBytes, objectIsEmpty} from '../utils';
import {BODY} from '../const';

BODY.addEventListener('click', function(e) {
  const target = e.target;

  if (target.closest('.repo')) {
    if(!Modal.loading) {
      const id = e.target.closest('.repo').dataset.id;
      const repo = state.cards.find(el => +el.id === +id);

      new Modal(repo, e.target.closest('.repo'));
    }

    e.preventDefault();
  }

  if (target.closest('#close-modal')) {
    Modal.closeModal();
    e.preventDefault();
  }
});
BODY.addEventListener('keyup', function(e) {
  e.keyCode === 27 && Modal.exists && Modal.closeModal();
});

class Modal {
  constructor(repo = {}, target) {
    const data = {};
    target.classList.add('loading');

    Modal.loading = true;

    fetch(`https://api.github.com/repos/${state.ownerName}/${repo.name}`)
      .then(handleErrors)
      .then((response) => response.json())
      .then((repository) => {
        const { full_name, html_url, fork, name, parent, contributors_url, languages_url } = repository;
        Object.assign(data, { full_name, html_url, fork, name, parent, contributors_url, languages_url });
        return fetch(contributors_url);
      })
      .then(handleErrors)
      .then((response) => response.json())
      .then((contributors) => {
        Object.assign(data, { contributors });
        return fetch(`https://api.github.com/repos/${state.ownerName}/${repo.name}/pulls?sort=popularity&per_page=5&type=open&direction=desc`);
      })
      .then(handleErrors)
      .then((response) => response.json())
      .then((pulls) => {
        Object.assign(data, { pulls });

        return fetch(data.languages_url);
      })
      .then(handleErrors)
      .then((response) => response.json())
      .then((langs) => {
        Object.assign(data, { langs });
        target.classList.remove('loading');
        Modal.loading = false;
        Modal.exists = true;
        BODY.insertAdjacentHTML('beforeEnd', this._getModal(data));

      })
      .catch(function(error) {
        target.classList.remove('loading');
        console.log(error);
        Modal.loading = false;
        Modal.exists = false;
      });
  }

  _getModal({full_name, html_url, fork, parent, contributors, pulls, langs}) {
    console.log(langs);
    return `<div class="modal" id="modal">
    <div class="modal__inner">

    <div class="modal__close">
      <button class="btn-close" id="close-modal">
        <svg viewBox="0 0 40 40">
          <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
        </svg>
        esc
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
          ${this._getContributors(contributors)}
        </div>
      </div>
      <div class="info">
        <div class="info__property">Languages</div>
        <div class="info__value">
          ${this._getLangs(langs)}
        </div>
      </div>
      <div class="info">
        <div class="info__property">Most commented PRs</div>
        <div class="info__value">
          ${this._getPulls(pulls)}
        </div>
      </div>
    </div>
  </div>
  </div>`;
  };

  _getLangs(langs) {
    if(objectIsEmpty(langs)) return 'there are no langs... :(';

    let template = Object.keys(langs).reduce((template,lang) => {
      const size = langs[lang];

      if (size > 1024) {
        return template += `<div class="info__row">
          <div class="info__cell">${lang}</div>
          <div class="info__cell">${convertBytes(size)}</div>
        </div>`;
      }

      return template;
    }, '');

    return template ? template : 'langs are less than 1 KB :(';
  }

  _getContributors(contributors) {
    const amount = contributors.length >= 3 ? 3 : contributors.length;
    let template = '';

    if (!amount) return 'there are no contributors... :(';

    for (let i = 0; i < amount; i++) {
      const contributor = contributors[i];

      template += `<div class="info__row">
      <div class="info__cell"><a href="${contributor.url}" class="info__name">${contributor.avatar_url ? `<div class="info__img" style="background-image: url('${contributor.avatar_url}')"></div>` : ''}${contributor.login}</a></div>
      <div class="info__cell">${contributor.contributions}</div>
    </div>`;

    }

    return template;
  }

  _getPulls(pulls) {
    const amount = pulls.length;
    let template = '';

    if (!amount) return 'there are no pulls... :(';

    for (let i = 0; i < amount; i++) {
      const pull = pulls[i];
      template += `<li><a href="${pull.html_url}">${pull.title}</a></li>`;
    }

    return `<ol>${template}</ol>`;
  };
}

Modal.closeModal = () => {
  const modal = document.getElementById('modal');
  modal.remove();
  Modal.exists = false;
};

export default Modal;
