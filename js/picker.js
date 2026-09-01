import { SESSIONS } from './data.js';
import * as Storage from './storage.js';

export function renderPicker(app) {
  const state = Storage.load();

  app.innerHTML = `
    <section class="block">
      <div class="block-title">Choose today's session</div>
      <div class="session-cards">
        ${Object.values(SESSIONS).map((session) => sessionCard(state, session)).join('')}
      </div>
    </section>
  `;
}

function sessionCard(state, session) {
  const lastDate = Storage.getLastSessionDate(state, session.id);
  const lastLabel = lastDate
    ? `Last done ${new Date(lastDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}`
    : 'Not done yet';

  return `
    <a class="session-card" href="#/session/${session.id}">
      <div class="session-card-label">${session.label}</div>
      <div class="session-card-subtitle">${session.subtitle}</div>
      <div class="session-card-last">${lastLabel}</div>
    </a>
  `;
}
