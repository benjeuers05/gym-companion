import { SESSIONS, EXERCISES, WARMUP, COOLDOWN, CARDIO_MACHINES, WARMUP_CARDIO_HINT, COOLDOWN_CARDIO_HINT } from './data.js';
import * as Storage from './storage.js';
import { createHoldTimer } from './timer.js';
import { patternIcon, CHECK_SVG, PLAY_SVG } from './icons.js';

let flashTimeout;
function flashSaved() {
  const el = document.getElementById('saveStatus');
  if (!el) return;
  el.textContent = 'Saved';
  clearTimeout(flashTimeout);
  flashTimeout = setTimeout(() => { el.textContent = ' '; }, 1200);
}

function persist(state) {
  Storage.save(state);
  flashSaved();
}

export function renderRunner(app, sessionId) {
  const session = SESSIONS[sessionId];
  if (!session) {
    location.hash = '#/picker';
    return;
  }
  const state = Storage.load();
  const exercises = session.exerciseIds.map((id) => EXERCISES[id]);

  app.innerHTML = `
    <header class="session-header">
      <div class="date" id="dateLabel"></div>
      <h1>${session.label}</h1>
      <div class="progress-row">
        <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
        <div class="progress-label mono" id="progressLabel"></div>
      </div>
    </header>

    <section class="block">
      <div class="block-title">Warm-up</div>
      <div id="warmupCardio"></div>
      <div class="checklist" id="warmupList"></div>
    </section>

    <section class="block">
      <div class="block-title">Main block · in order</div>
      <div id="exerciseList"></div>
    </section>

    <section class="block">
      <div class="block-title">Cool-down</div>
      <div id="cooldownCardio"></div>
      <div class="checklist" id="cooldownList"></div>
    </section>

    <section class="notes-block">
      <div class="notes-card">
        <h3>How did it feel?</h3>
        <div class="flag-row">
          <button class="flag-btn" id="shoulderFlag">Shoulder niggle</button>
          <button class="flag-btn" id="kneeFlag">Knee niggle</button>
        </div>
        <textarea id="sessionNotes" placeholder="Anything worth remembering for next time..."></textarea>
      </div>
    </section>

    <section class="finish-block">
      <button class="finish-btn" id="finishSessionBtn">Finish session</button>
    </section>

    <div class="save-status" id="saveStatus">&nbsp;</div>
  `;

  document.getElementById('dateLabel').textContent =
    new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  renderCardioCard(state, sessionId, 'warmup', WARMUP_CARDIO_HINT, document.getElementById('warmupCardio'));
  renderCardioCard(state, sessionId, 'cooldown', COOLDOWN_CARDIO_HINT, document.getElementById('cooldownCardio'));

  renderChecklist(state, sessionId, 'warmup', WARMUP, document.getElementById('warmupList'));
  renderChecklist(state, sessionId, 'cooldown', COOLDOWN, document.getElementById('cooldownList'));

  document.getElementById('exerciseList').innerHTML =
    exercises.map((ex) => exerciseCardHtml(state, sessionId, ex)).join('');

  const updateProgress = () => {
    let total = 0;
    let done = 0;
    exercises.forEach((ex) => {
      for (let i = 0; i < ex.sets; i++) {
        total++;
        const el = document.getElementById(`${ex.id}-check-${i}`);
        if (el && el.classList.contains('checked')) done++;
      }
    });
    document.getElementById('progressFill').style.width = `${total ? (done / total * 100) : 0}%`;
    document.getElementById('progressLabel').textContent = `${done}/${total} sets`;
  };

  exercises.forEach((ex) => attachExerciseHandlers(state, sessionId, ex, updateProgress));
  updateProgress();
  attachNotesHandlers(state, sessionId);

  document.getElementById('finishSessionBtn').addEventListener('click', () => {
    let total = 0;
    let done = 0;
    exercises.forEach((ex) => {
      for (let i = 0; i < ex.sets; i++) {
        total++;
        const el = document.getElementById(`${ex.id}-check-${i}`);
        if (el && el.classList.contains('checked')) done++;
      }
    });
    if (done < total) {
      const remaining = total - done;
      const proceed = confirm(`${remaining} set${remaining === 1 ? '' : 's'} not logged yet — finish anyway?`);
      if (!proceed) return;
    }
    location.hash = '#/picker';
  });
}

function renderCardioCard(state, sessionId, kind, hint, container) {
  const { key, entry } = Storage.getCardioEntry(state, sessionId, kind);
  const prefix = `cardio-${kind}`;

  container.innerHTML = `
    <div class="cardio-card">
      <div class="cardio-hint">${hint}</div>
      <select id="${prefix}-machine">
        <option value="">Machine…</option>
        ${CARDIO_MACHINES.map((m) => `<option value="${m}" ${entry.machine === m ? 'selected' : ''}>${m}</option>`).join('')}
      </select>
      <div class="cardio-grid">
        <label>Duration<input type="number" inputmode="decimal" placeholder="min" id="${prefix}-duration" value="${entry.durationMin ?? ''}"></label>
        <label>Speed<input type="number" inputmode="decimal" step="0.1" placeholder="km/h" id="${prefix}-speed" value="${entry.speedKmh ?? ''}"></label>
        <label>Incline<input type="number" inputmode="decimal" step="0.5" placeholder="%" id="${prefix}-incline" value="${entry.incline ?? ''}"></label>
        <label>Resistance<input type="number" inputmode="decimal" placeholder="level" id="${prefix}-resistance" value="${entry.resistance ?? ''}"></label>
      </div>
      <input type="text" class="cardio-notes" placeholder="Notes — e.g. started resistance 9, dropped to 7" id="${prefix}-notes" value="${entry.notes || ''}">
    </div>
  `;

  const fields = [
    ['machine', 'machine', (v) => v],
    ['duration', 'durationMin', (v) => (v ? parseFloat(v) : null)],
    ['speed', 'speedKmh', (v) => (v ? parseFloat(v) : null)],
    ['incline', 'incline', (v) => (v ? parseFloat(v) : null)],
    ['resistance', 'resistance', (v) => (v ? parseFloat(v) : null)],
    ['notes', 'notes', (v) => v]
  ];
  fields.forEach(([idSuffix, prop, parse]) => {
    const el = document.getElementById(`${prefix}-${idSuffix}`);
    el.addEventListener('change', () => {
      entry[prop] = parse(el.value);
      state.cardio[key] = entry;
      persist(state);
    });
  });
}

function renderChecklist(state, sessionId, kind, items, container) {
  const { key, values } = Storage.getChecklistState(state, sessionId, kind, items.length);
  container.innerHTML = items.map((item, i) => `
    <div class="check-row">
      <div class="check-box ${values[i] ? 'checked' : ''}" id="${kind}-${i}">${CHECK_SVG}</div>
      <div class="check-content">
        <div class="check-label ${values[i] ? 'done' : ''}" id="${kind}-label-${i}">${item.label}</div>
        <div class="check-cue">${item.cue}</div>
      </div>
    </div>
  `).join('');

  items.forEach((_, i) => {
    const box = document.getElementById(`${kind}-${i}`);
    const label = document.getElementById(`${kind}-label-${i}`);
    box.addEventListener('click', () => {
      values[i] = !values[i];
      state.checklist[key] = values;
      box.classList.toggle('checked');
      label.classList.toggle('done');
      persist(state);
    });
  });
}

function formatLastTime(ex, entry) {
  const dateStr = Storage.parseLocalDate(entry.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  const sessionLabel = SESSIONS[entry.sessionId] ? SESSIONS[entry.sessionId].label : '';
  const parts = entry.sets.map((s) => {
    if (ex.type === 'weight') return `${s.value ?? 0}kg`;
    if (ex.type === 'hold') return `${s.value ?? 0}s`;
    return 'done';
  });
  return `Last time (${dateStr}${sessionLabel ? ', ' + sessionLabel : ''}): <b>${parts.join(', ')}</b>`;
}

function exerciseCardHtml(state, sessionId, ex) {
  const last = Storage.getLastEntryBeforeToday(state, ex.id);
  const todayEntry = Storage.ensureTodayEntry(state, ex.id, sessionId, ex.sets);
  const link = Storage.getLink(state, ex.id);
  const protectColor = ex.protect ? '#4fb0c9' : '#e8a33d';

  let setsHtml = '';
  for (let i = 0; i < ex.sets; i++) {
    const setData = todayEntry.sets[i] || { value: null, completed: false };
    if (ex.type === 'weight') {
      setsHtml += `
        <div class="set-row">
          <div class="set-num">Set ${i + 1}</div>
          <div class="set-input">
            <input type="number" inputmode="decimal" step="0.5" placeholder="—"
              id="${ex.id}-val-${i}" value="${setData.value ?? ''}">
            <span class="unit">kg</span>
          </div>
          <div class="set-check ${setData.completed ? 'checked' : ''}" id="${ex.id}-check-${i}">${CHECK_SVG}</div>
        </div>`;
    } else if (ex.type === 'reps') {
      setsHtml += `
        <div class="set-row">
          <div class="set-num">Set ${i + 1}</div>
          <div class="reps-only-label">${ex.repsPerSet} reps, ${ex.equipment}</div>
          <div class="set-check ${setData.completed ? 'checked' : ''}" id="${ex.id}-check-${i}">${CHECK_SVG}</div>
        </div>`;
    } else if (ex.type === 'hold') {
      setsHtml += `
        <div class="set-row">
          <div class="set-num">Set ${i + 1}</div>
          <button class="timer-btn" id="${ex.id}-timerbtn-${i}">Start ${ex.holdSeconds}s</button>
          <div class="timer-display mono" id="${ex.id}-display-${i}">${setData.value ? setData.value + 's' : ''}</div>
          <div class="set-check ${setData.completed ? 'checked' : ''}" id="${ex.id}-check-${i}">${CHECK_SVG}</div>
        </div>`;
    }
  }

  return `
    <div class="exercise-card">
      <div class="ex-head">
        <div class="ex-icon ${ex.protect ? 'protect' : ''}">${patternIcon(ex.pattern, protectColor)}</div>
        <div class="ex-head-text">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-target">${ex.target}</div>
          ${ex.protect ? `<div class="ex-badge">${ex.protect === 'knee' ? 'Knee protection' : 'Shoulder protection'}</div>` : ''}
        </div>
        <a class="video-play ${link ? '' : 'disabled'}" id="${ex.id}-video-link" href="${link || '#'}" target="_blank" rel="noopener" aria-label="Watch demo">${PLAY_SVG}</a>
      </div>
      <ul class="cues">${ex.cues.map((c) => `<li>${c}</li>`).join('')}</ul>
      ${ex.note ? `<div class="note">${ex.note}</div>` : ''}
      <input type="url" class="video-input" placeholder="Paste YouTube link" id="${ex.id}-video" value="${link}">
      ${last ? `<div class="last-time">${formatLastTime(ex, last)}</div>` : `<div class="last-time">First time logging this one — today sets the baseline.</div>`}
      <div class="sets">${setsHtml}</div>
      <a class="history-link" href="#/history/${ex.id}">View history →</a>
    </div>
  `;
}

function attachExerciseHandlers(state, sessionId, ex, updateProgress) {
  const todayEntry = Storage.ensureTodayEntry(state, ex.id, sessionId, ex.sets);

  for (let i = 0; i < ex.sets; i++) {
    const checkEl = document.getElementById(`${ex.id}-check-${i}`);
    checkEl.addEventListener('click', () => {
      todayEntry.sets[i].completed = !todayEntry.sets[i].completed;
      checkEl.classList.toggle('checked');
      persist(state);
      updateProgress();
    });

    if (ex.type === 'weight') {
      const input = document.getElementById(`${ex.id}-val-${i}`);
      input.addEventListener('change', () => {
        todayEntry.sets[i].value = input.value ? parseFloat(input.value) : null;
        persist(state);
      });
    }

    if (ex.type === 'hold') {
      const btn = document.getElementById(`${ex.id}-timerbtn-${i}`);
      const display = document.getElementById(`${ex.id}-display-${i}`);
      const timer = createHoldTimer(ex.holdSeconds, {
        onTick: (remaining) => { display.textContent = `${remaining}s`; },
        onFinish: (secondsHeld) => {
          btn.textContent = `Start ${ex.holdSeconds}s`;
          btn.classList.remove('running');
          display.textContent = `${secondsHeld}s`;
          todayEntry.sets[i].value = secondsHeld;
          todayEntry.sets[i].completed = true;
          checkEl.classList.add('checked');
          persist(state);
          updateProgress();
        }
      });
      btn.addEventListener('click', () => {
        timer.toggle();
        if (timer.running) {
          btn.textContent = 'Stop';
          btn.classList.add('running');
        }
      });
    }
  }

  const videoInput = document.getElementById(`${ex.id}-video`);
  const videoLink = document.getElementById(`${ex.id}-video-link`);
  videoInput.addEventListener('change', () => {
    const url = videoInput.value.trim();
    Storage.setLink(state, ex.id, url);
    persist(state);
    videoLink.href = url || '#';
    videoLink.classList.toggle('disabled', !url);
  });
  videoLink.addEventListener('click', (e) => {
    if (videoLink.classList.contains('disabled')) e.preventDefault();
  });
}

function attachNotesHandlers(state, sessionId) {
  const notes = Storage.getTodayNotes(state, sessionId);
  const shoulderBtn = document.getElementById('shoulderFlag');
  const kneeBtn = document.getElementById('kneeFlag');
  const textarea = document.getElementById('sessionNotes');

  shoulderBtn.classList.toggle('active', notes.shoulder);
  kneeBtn.classList.toggle('active', notes.knee);
  textarea.value = notes.text || '';

  shoulderBtn.addEventListener('click', () => {
    notes.shoulder = !notes.shoulder;
    shoulderBtn.classList.toggle('active');
    persist(state);
  });
  kneeBtn.addEventListener('click', () => {
    notes.knee = !notes.knee;
    kneeBtn.classList.toggle('active');
    persist(state);
  });
  textarea.addEventListener('change', () => {
    notes.text = textarea.value;
    persist(state);
  });
}
