import { EXERCISES, SESSIONS } from './data.js';
import * as Storage from './storage.js';
import { patternIcon } from './icons.js';

export function renderHistory(app, exerciseId) {
  const state = Storage.load();

  if (exerciseId && EXERCISES[exerciseId]) {
    renderExerciseHistory(app, state, EXERCISES[exerciseId]);
  } else {
    renderExerciseList(app, state);
  }
}

function renderExerciseList(app, state) {
  const exercises = Object.values(EXERCISES);

  app.innerHTML = `
    <section class="block">
      <div class="block-title">All exercises</div>
      <div class="checklist history-exercise-list">
        ${exercises.map((ex) => historyListRow(state, ex)).join('')}
      </div>
    </section>
  `;
}

function historyListRow(state, ex) {
  const entries = Storage.getHistory(state, ex.id);
  const countLabel = entries.length ? `${entries.length} logged` : 'No entries yet';
  return `
    <a class="check-row history-row" href="#/history/${ex.id}">
      <div class="ex-icon ${ex.protect ? 'protect' : ''}">${patternIcon(ex.pattern, ex.protect ? '#4fb0c9' : '#e8a33d')}</div>
      <div class="check-content">
        <div class="check-label">${ex.name}</div>
        <div class="check-cue">${countLabel}</div>
      </div>
    </a>
  `;
}

function renderExerciseHistory(app, state, ex) {
  const entries = Storage.getHistory(state, ex.id).slice().reverse();

  app.innerHTML = `
    <section class="block">
      <a class="back-link" href="#/history">← All exercises</a>
      <div class="ex-head" style="margin-top:14px;">
        <div class="ex-icon ${ex.protect ? 'protect' : ''}">${patternIcon(ex.pattern, ex.protect ? '#4fb0c9' : '#e8a33d')}</div>
        <div class="ex-head-text">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-target">${ex.target}</div>
        </div>
      </div>
    </section>
    <section class="block">
      ${entries.length ? historyTable(ex, entries) : '<div class="last-time">No entries logged yet.</div>'}
    </section>
  `;
}

function historyTable(ex, entries) {
  const rows = entries.map((entry) => {
    const dateStr = new Date(entry.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const sessionLabel = SESSIONS[entry.sessionId] ? SESSIONS[entry.sessionId].label : entry.sessionId;
    const values = entry.sets.map((s) => {
      if (!s.completed && s.value == null) return '—';
      if (ex.type === 'weight') return `${s.value ?? 0}kg`;
      if (ex.type === 'hold') return `${s.value ?? 0}s`;
      return s.completed ? '✓' : '—';
    }).join(', ');
    return `
      <div class="history-entry-row">
        <div class="history-entry-date">${dateStr}<span class="history-entry-session">${sessionLabel}</span></div>
        <div class="history-entry-values mono">${values}</div>
      </div>
    `;
  }).join('');

  return `<div class="checklist history-table">${rows}</div>`;
}
