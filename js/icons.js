// SVG line icons per exercise pattern, plus the shared checkmark glyph.

export function patternIcon(pattern, color) {
  const c = color || 'currentColor';
  const icons = {
    squat: `<svg viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><circle cx="24" cy="10" r="4"/><path d="M24 14v10M24 24l-8 8M24 24l8 8M16 32v6M32 32v6"/></svg>`,
    pull: `<svg viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><circle cx="24" cy="9" r="4"/><path d="M24 13v14M14 15l10 6 10-6M18 27l6 3 6-3M20 30v10M28 30v10"/></svg>`,
    push: `<svg viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><circle cx="24" cy="9" r="4"/><path d="M24 13v12M12 20l12 5 12-5M20 25v13M28 25v13"/></svg>`,
    hinge: `<svg viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><circle cx="30" cy="8" r="4"/><path d="M30 12l-12 8M18 20l-4 8M18 20l6 4M14 28v8M24 24l2 4v8"/></svg>`,
    hold: `<svg viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><circle cx="24" cy="24" r="15"/><path d="M24 15v9l6 5"/></svg>`,
    rotation: `<svg viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><circle cx="16" cy="10" r="4"/><path d="M16 14v10"/><path d="M16 24c0 0 8 0 10-4"/><path d="M26 20a8 8 0 1 1 -3 6" /><path d="M24 20l3 1-1 3"/></svg>`,
    core: `<svg viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><circle cx="10" cy="30" r="4"/><path d="M14 30h24l4-10"/></svg>`
  };
  return icons[pattern] || '';
}

export const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#0d1114" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>`;

export const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;

export const BACK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
