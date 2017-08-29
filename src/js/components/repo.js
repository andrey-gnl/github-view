import {formatDate} from '../utils';

const getRepo = ({name, description, stargazers_count, updated_at, language, fork}) => `
  <a href="#" class="repo">
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

export { getRepo };
