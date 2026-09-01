# Gym Companion

A personal, single-user gym session tracker. Static site, no backend, no
accounts — all history is stored in the browser's `localStorage`.

## Structure

- `index.html` — single-page shell; view containers are filled in by JS based on the URL hash.
- `js/data.js` — Session A/B/C definitions (warm-up, exercises, cool-down, protective drills).
- `js/storage.js` — localStorage schema and read/write helpers.
- `js/timer.js` — shared countdown timer + audio cue for hold exercises.
- `js/picker.js`, `js/runner.js`, `js/history.js` — the three screens.
- `js/main.js` — hash-based router (`#/picker`, `#/session/a`, `#/history/:exerciseId`).
- `reference/gym-session.html` — the original single-file prototype this app is based on (kept for reference, not used at runtime).

## Adding YouTube links

Each exercise card has a "Paste YouTube link" field. Paste a link and it's
saved locally in your browser; a play button appears next to the exercise
name that opens it in a new tab.

## Data

Everything you log — weights, hold times, reps, notes, niggle flags — lives
in your browser's `localStorage` under the key `gymCompanion:v1`. It does
not sync anywhere and is not part of this repo. Clearing your browser data
for this site will erase your history.

## Running locally

No build step. Serve the folder over HTTP (ES modules don't load over
`file://`) and open it:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Hosted on GitHub Pages, served from the `main` branch root.
