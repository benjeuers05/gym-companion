import { renderPicker } from './picker.js';
import { renderRunner } from './runner.js';
import { renderHistory } from './history.js';

const app = document.getElementById('app');
const topnavTitle = document.getElementById('topnavTitle');

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);

  if (parts[0] === 'session' && parts[1]) {
    topnavTitle.textContent = 'Gym Companion';
    renderRunner(app, parts[1]);
  } else if (parts[0] === 'history') {
    topnavTitle.textContent = 'History';
    renderHistory(app, parts[1] || null);
  } else {
    topnavTitle.textContent = 'Gym Companion';
    renderPicker(app);
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
