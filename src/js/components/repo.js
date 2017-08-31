import {formatDate, roundNum} from '../utils';

const getRepo = ({id, name, description, stargazers_count, updated_at, language, fork}) => `
  <a href="#" class="repo" data-id="${id}">
    <div class="repo__name">${name}</div>
    ${fork ? '<div class="repo__forked">Is forked</div>' : ''}
    <div class="repo__description">${description ? description: '<em>No description</em>' }</div>
    <div class="repo__footer">
      <div class="repo__stars">&#9733; <strong>${roundNum(stargazers_count)}</strong>  </div>
      <div class="repo__lang">Lang: ${language ? language : '-' }</div>
      <div class="repo__date">Updated on ${formatDate(updated_at)}</div>
    </div>
  </a>
`;

export { getRepo };
