import forms from './forms';
import repos from './repoList';

const content = document.getElementById('content');

const init = () => {
  content.innerHTML = '';
  forms.inited ? forms.reset() : content.insertAdjacentHTML('beforeEnd', forms.templateInit());
  content.insertAdjacentHTML('beforeEnd', repos.createList());

  forms.init();
};


export default {init};

