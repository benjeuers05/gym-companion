// All persistence lives in a single localStorage key, real browser
// storage only — no backend, no accounts, entirely client-side.

import { EXERCISES, SEED_SESSION, DEFAULT_LINKS } from './data.js';

const STORAGE_KEY = 'gymCompanion:v1';

function defaultState() {
  return { history: {}, checklist: {}, notes: {}, links: {}, cardio: {}, seeded: false };
}

export function todayISO() {
  // Local calendar date, not UTC — toISOString() would file a late-night
  // session under the wrong day whenever local time and UTC disagree.
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// Parses a "YYYY-MM-DD" storage date as a local-midnight Date, not UTC —
// new Date("YYYY-MM-DD") parses as UTC and can display as the wrong day
// depending on the viewer's timezone offset.
export function parseLocalDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}

export function load() {
  let state;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? JSON.parse(raw) : defaultState();
  } catch (e) {
    state = defaultState();
  }
  state.history = state.history || {};
  state.checklist = state.checklist || {};
  state.notes = state.notes || {};
  state.links = state.links || {};
  state.cardio = state.cardio || {};
  seedIfNeeded(state);
  return state;
}

export function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedIfNeeded(state) {
  if (state.seeded) return;
  const { date, sessionId, values } = SEED_SESSION;
  Object.entries(values).forEach(([exerciseId, setValues]) => {
    const exercise = EXERCISES[exerciseId];
    if (!exercise) return;
    const entry = {
      date,
      sessionId,
      sets: setValues.map((value) => ({ value, completed: true }))
    };
    state.history[exerciseId] = state.history[exerciseId] || [];
    state.history[exerciseId].push(entry);
  });
  state.seeded = true;
  save(state);
}

// ---------- Exercise history ----------

export function getHistory(state, exerciseId) {
  return (state.history[exerciseId] || []).slice().sort((a, b) => a.date.localeCompare(b.date));
}

export function getLastEntryBeforeToday(state, exerciseId) {
  const today = todayISO();
  const entries = getHistory(state, exerciseId).filter((e) => e.date !== today);
  return entries.length ? entries[entries.length - 1] : null;
}

export function ensureTodayEntry(state, exerciseId, sessionId, numSets) {
  const today = todayISO();
  state.history[exerciseId] = state.history[exerciseId] || [];
  let entry = state.history[exerciseId].find((e) => e.date === today && e.sessionId === sessionId);
  if (!entry) {
    entry = {
      date: today,
      sessionId,
      sets: Array.from({ length: numSets }, () => ({ value: null, completed: false }))
    };
    state.history[exerciseId].push(entry);
  }
  return entry;
}

export function upsertEntry(state, exerciseId, date, sessionId, sets) {
  state.history[exerciseId] = state.history[exerciseId] || [];
  const existing = state.history[exerciseId].find((e) => e.date === date && e.sessionId === sessionId);
  if (existing) {
    existing.sets = sets;
  } else {
    state.history[exerciseId].push({ date, sessionId, sets });
  }
}

export function deleteEntry(state, exerciseId, date, sessionId) {
  state.history[exerciseId] = (state.history[exerciseId] || []).filter(
    (e) => !(e.date === date && e.sessionId === sessionId)
  );
}

export function getLastSessionDate(state, sessionId) {
  let latest = null;
  Object.values(state.history).forEach((entries) => {
    entries.forEach((entry) => {
      if (entry.sessionId === sessionId && (!latest || entry.date > latest)) {
        latest = entry.date;
      }
    });
  });
  return latest;
}

// ---------- Checklist (warm-up / cool-down), per day + session ----------

export function getChecklistState(state, sessionId, kind, length) {
  const key = `${todayISO()}:${sessionId}:${kind}`;
  if (!state.checklist[key]) {
    state.checklist[key] = Array.from({ length }, () => false);
  }
  return { key, values: state.checklist[key] };
}

// ---------- Cardio (warm-up / cool-down), per day + session ----------

export function getCardioEntry(state, sessionId, kind) {
  const key = `${todayISO()}:${sessionId}:${kind}`;
  if (!state.cardio[key]) {
    state.cardio[key] = { machine: '', durationMin: null, speedKmh: null, incline: null, resistance: null, notes: '' };
  }
  return { key, entry: state.cardio[key] };
}

// ---------- Session notes ("how did it feel") ----------

export function getTodayNotes(state, sessionId) {
  const key = todayISO();
  if (!state.notes[key]) {
    state.notes[key] = { sessionId, shoulder: false, knee: false, text: '' };
  }
  return state.notes[key];
}

// ---------- YouTube links ----------

export function getLink(state, exerciseId) {
  if (Object.prototype.hasOwnProperty.call(state.links, exerciseId)) {
    return state.links[exerciseId];
  }
  return DEFAULT_LINKS[exerciseId] || '';
}

export function setLink(state, exerciseId, url) {
  state.links[exerciseId] = url;
}
