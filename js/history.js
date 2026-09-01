import { EXERCISES, SESSIONS } from './data.js';
import * as Storage from './storage.js';
import { patternIcon } from './icons.js';

export function renderHistory(app, exerciseId) {
  const state = Storage.load();

  if (exerciseId && EXERCISES[exerciseId]) {
    renderExerciseHistory(app, EXERCISES[exerciseId]);
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

function defaultSets(ex) {
  return Array.from({ length: ex.sets }, () => ({ value: null, completed: false }));
}

function setsFormHtml(ex, sets, idPrefix) {
  return sets.map((s, i) => {
    if (ex.type === 'weight') {
      return `
        <div class="set-row">
          <div class="set-num">Set ${i + 1}</div>
          <div class="set-input">
            <input type="number" step="0.5" placeholder="—" id="${idPrefix}-val-${i}" value="${s.value ?? ''}">
            <span class="unit">kg</span>
          </div>
        </div>`;
    }
    if (ex.type === 'hold') {
      return `
        <div class="set-row">
          <div class="set-num">Set ${i + 1}</div>
          <div class="set-input">
            <input type="number" step="1" placeholder="—" id="${idPrefix}-val-${i}" value="${s.value ?? ''}">
            <span class="unit">sec</span>
          </div>
        </div>`;
    }
    return `
      <div class="set-row">
        <div class="set-num">Set ${i + 1}</div>
        <label class="reps-only-label"><input type="checkbox" id="${idPrefix}-val-${i}" ${s.completed ? 'checked' : ''}> Completed</label>
      </div>`;
  }).join('');
}

function readSetsFromForm(ex, idPrefix) {
  return Array.from({ length: ex.sets }, (_, i) => {
    const el = document.getElementById(`${idPrefix}-val-${i}`);
    if (ex.type === 'reps') {
      return { value: null, completed: el.checked };
    }
    const value = el.value !== '' ? parseFloat(el.value) : null;
    return { value, completed: value != null };
  });
}

function entryFormHtml(ex, sessionOptions, initial, idPrefix, isEdit) {
  const sessionField = sessionOptions.length > 1
    ? `<label>Session<select id="${idPrefix}-session">
        ${sessionOptions.map((s) => `<option value="${s.id}" ${s.id === initial.sessionId ? 'selected' : ''}>${s.label}</option>`).join('')}
      </select></label>`
    : `<input type="hidden" id="${idPrefix}-session" value="${sessionOptions[0].id}">`;

  return `
    <div class="entry-form-inner">
      <div class="entry-form-row">
        <label>Date<input type="date" id="${idPrefix}-date" value="${initial.date}"></label>
        ${sessionField}
      </div>
      <div class="sets">${setsFormHtml(ex, initial.sets, idPrefix)}</div>
      <div class="entry-form-actions">
        <button class="entry-save-btn" id="${idPrefix}-save">Save</button>
        ${isEdit ? `<button class="entry-delete-btn" id="${idPrefix}-delete">Delete</button>` : ''}
      </div>
    </div>
  `;
}

function attachEntryFormHandlers(state, ex, idPrefix, existingEntry) {
  document.getElementById(`${idPrefix}-save`).addEventListener('click', () => {
    const date = document.getElementById(`${idPrefix}-date`).value;
    const sessionId = document.getElementById(`${idPrefix}-session`).value;
    if (!date || !sessionId) return;
    if (existingEntry && (date !== existingEntry.date || sessionId !== existingEntry.sessionId)) {
      Storage.deleteEntry(state, ex.id, existingEntry.date, existingEntry.sessionId);
    }
    const sets = readSetsFromForm(ex, idPrefix);
    Storage.upsertEntry(state, ex.id, date, sessionId, sets);
    Storage.save(state);
    renderHistory(document.getElementById('app'), ex.id);
  });

  const deleteBtn = document.getElementById(`${idPrefix}-delete`);
  if (deleteBtn && existingEntry) {
    deleteBtn.addEventListener('click', () => {
      if (!confirm('Delete this entry?')) return;
      Storage.deleteEntry(state, ex.id, existingEntry.date, existingEntry.sessionId);
      Storage.save(state);
      renderHistory(document.getElementById('app'), ex.id);
    });
  }
}

function entryValuesLabel(ex, entry) {
  return entry.sets.map((s) => {
    if (!s.completed && s.value == null) return '—';
    if (ex.type === 'weight') return `${s.value ?? 0}kg`;
    if (ex.type === 'hold') return `${s.value ?? 0}s`;
    return s.completed ? '✓' : '—';
  }).join(', ');
}

function renderExerciseHistory(app, ex) {
  const state = Storage.load();
  const entries = Storage.getHistory(state, ex.id).slice().reverse();
  const sessionOptions = Object.values(SESSIONS).filter((s) => s.exerciseIds.includes(ex.id));

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
      <button class="add-entry-toggle" id="addEntryToggle">+ Log a past entry</button>
      <div class="entry-form" id="addEntryForm" hidden></div>
    </section>

    <section class="block">
      <div class="block-title">Logged history</div>
      ${entries.length ? '<div class="checklist" id="historyEntries"></div>' : '<div class="last-time">No entries logged yet.</div>'}
    </section>
  `;

  document.getElementById('addEntryToggle').addEventListener('click', () => {
    const formEl = document.getElementById('addEntryForm');
    formEl.hidden = !formEl.hidden;
    if (!formEl.hidden) {
      formEl.innerHTML = entryFormHtml(
        ex, sessionOptions,
        { date: Storage.todayISO(), sessionId: sessionOptions[0].id, sets: defaultSets(ex) },
        'add', false
      );
      attachEntryFormHandlers(state, ex, 'add', null);
    }
  });

  const entriesContainer = document.getElementById('historyEntries');
  if (entriesContainer) {
    entries.forEach((entry, idx) => {
      const idPrefix = `entry-${idx}`;
      const dateStr = Storage.parseLocalDate(entry.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
      const sessionLabel = SESSIONS[entry.sessionId] ? SESSIONS[entry.sessionId].label : entry.sessionId;

      const row = document.createElement('div');
      row.className = 'history-entry-block';
      row.innerHTML = `
        <div class="history-entry-row">
          <div class="history-entry-date">${dateStr}<span class="history-entry-session">${sessionLabel}</span></div>
          <div class="history-entry-values mono">${entryValuesLabel(ex, entry)}</div>
          <button class="history-edit-btn" id="${idPrefix}-toggle">Edit</button>
        </div>
        <div class="entry-form" id="${idPrefix}-form" hidden></div>
      `;
      entriesContainer.appendChild(row);

      document.getElementById(`${idPrefix}-toggle`).addEventListener('click', () => {
        const formEl = document.getElementById(`${idPrefix}-form`);
        formEl.hidden = !formEl.hidden;
        if (!formEl.hidden) {
          formEl.innerHTML = entryFormHtml(ex, sessionOptions, entry, idPrefix, true);
          attachEntryFormHandlers(state, ex, idPrefix, entry);
        }
      });
    });
  }
}
