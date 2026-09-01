// Session and exercise definitions. Exercises are keyed by id so that
// shared exercises (the two protective drills) accumulate one history
// across every session variant, instead of tracking separately per session.

// Cardio is logged as structured data (see cardioEntry in storage.js), not
// a checklist line — machine/duration/speed/incline/resistance, so actual
// cardio habits are visible over time rather than just a checked box.
export const CARDIO_MACHINES = ['Treadmill', 'Bike', 'Rower', 'Elliptical', 'Other'];

export const WARMUP_CARDIO_HINT = 'Suggested: 5 min, easy conversational pace';
export const COOLDOWN_CARDIO_HINT = 'Suggested: 5-10 min, easy pace, let your heart rate settle';

export const WARMUP = [
  { label: 'Band pull-aparts', cue: '2 × 15 — light band at chest height, pull apart squeezing your shoulder blades together' },
  { label: 'Scapular wall slides', cue: '2 × 10 — back against a wall, arms in a goalpost position, slide overhead keeping contact with the wall' },
  { label: 'Bodyweight squats + hip openers', cue: '2 × 10 — a few bodyweight squats, then a few standing hip circles/openers each side' }
];

export const COOLDOWN = [
  { label: 'Stretch quads', cue: 'Standing, pull one heel toward your glutes, knees together, hold 20-30s each side' },
  { label: 'Stretch hip flexors', cue: 'Kneeling lunge position, back knee down, gently push hips forward until you feel a stretch at the front of the back hip, hold 20-30s each side' },
  { label: 'Stretch pecs', cue: 'Forearm on a wall or door frame at shoulder height, gently rotate your body away until you feel a stretch across the chest, hold 20-30s each side' }
];

export const EXERCISES = {
  'goblet-squat': {
    id: 'goblet-squat', name: 'Goblet squat', pattern: 'squat', type: 'weight',
    target: '2 sets × 12 reps · light-moderate dumbbell', sets: 2,
    cues: [
      'Hold the dumbbell vertically at your chest, elbows tucked',
      'Feet shoulder-width, toes slightly out',
      'Sit back and down, knees track over your toes',
      'Go as deep as feels comfortable today, don’t force it',
      'Drive through your whole foot to stand'
    ]
  },
  'lat-pulldown': {
    id: 'lat-pulldown', name: 'Lat pulldown / assisted pull-up', pattern: 'pull', type: 'weight',
    target: '2 sets × 10 reps · moderate weight', sets: 2,
    cues: [
      'Grip slightly wider than shoulders',
      'Pull the bar to your upper chest, lead with your elbows',
      'Squeeze your shoulder blades together at the bottom',
      'Control the return, don’t let the weight snap you back up'
    ]
  },
  'chest-press': {
    id: 'chest-press', name: 'Seated chest press', pattern: 'push', type: 'weight',
    target: '2 sets × 10 reps · light-moderate', sets: 2,
    note: 'Shoulder history — stop if you feel pinching, swap to landmine press instead',
    cues: [
      'Handles at chest height, seat set so hands align with your chest',
      'Press away smoothly, don’t lock your elbows hard at the top',
      'Stop immediately if the right shoulder pinches'
    ]
  },
  'rdl': {
    id: 'rdl', name: 'Romanian deadlift', pattern: 'hinge', type: 'weight',
    target: '2 sets × 10 reps · light dumbbells', sets: 2,
    cues: [
      'Soft bend in the knees — this is a hip movement, not a squat',
      'Push your hips back, dumbbells stay close to your legs',
      'Keep a flat back, stop when you feel a hamstring stretch',
      'Drive hips forward to stand, squeeze glutes at the top'
    ]
  },
  'spanish-squat': {
    id: 'spanish-squat', name: 'Spanish squat / wall sit', pattern: 'hold', type: 'hold',
    target: '2 × 20-30 sec hold', holdSeconds: 25, sets: 2, protect: 'knee',
    note: 'The single best exercise for protecting your knee tendon — don’t skip it, every session',
    cues: [
      'Hold a static position with tension through the front of your thighs',
      'Breathe normally through the hold, don’t brace and hold your breath'
    ]
  },
  'band-rotation': {
    id: 'band-rotation', name: 'Band external rotation', pattern: 'rotation', type: 'reps',
    target: '2 sets × 15 reps · light band', sets: 2, repsPerSet: 15, equipment: 'light band', protect: 'shoulder',
    note: 'Light resistance band only — never a loaded machine. This is about control, not load.',
    cues: [
      'Elbow tucked to your side at 90 degrees',
      'Rotate your forearm outward against the band, slow and controlled'
    ]
  },
  'plank': {
    id: 'plank', name: 'Plank', pattern: 'core', type: 'hold',
    target: '2 × 20-30 sec hold', holdSeconds: 25, sets: 2,
    cues: [
      'Forearms under shoulders, body in a straight line',
      'Squeeze glutes and brace your stomach, don’t let hips sag or pike',
      'Breathe steadily, don’t hold your breath'
    ]
  },

  'leg-press': {
    id: 'leg-press', name: 'Leg press', pattern: 'squat', type: 'weight',
    target: '2 sets × 12 reps · light-moderate load', sets: 2,
    cues: [
      'Feet flat, shoulder-width on the platform',
      'Lower under control until knees reach about 90°, don’t let them cave in',
      'Press through your heels, don’t lock your knees out hard at the top',
      'Keep your lower back flat against the pad'
    ]
  },
  'seated-row': {
    id: 'seated-row', name: 'Seated cable row', pattern: 'pull', type: 'weight',
    target: '2 sets × 10 reps · moderate weight', sets: 2,
    cues: [
      'Sit tall, chest up, slight lean back from the hips',
      'Pull the handle to your stomach, elbows close to your body',
      'Squeeze your shoulder blades together at the back of the movement',
      'Control the return, don’t let your shoulders round forward'
    ]
  },
  'incline-press': {
    id: 'incline-press', name: 'Incline chest press', pattern: 'push', type: 'weight',
    target: '2 sets × 10 reps · light-moderate', sets: 2,
    note: 'Shoulder history — stop if you feel pinching, ease the range of motion or swap to landmine press',
    cues: [
      'Seat set so handles start level with your upper chest',
      'Press up and slightly back, don’t flare elbows out to 90°',
      'Stop immediately if the right shoulder pinches'
    ]
  },
  'hip-thrust': {
    id: 'hip-thrust', name: 'Hip thrust', pattern: 'hinge', type: 'weight',
    target: '2 sets × 10 reps · bodyweight, band, or light barbell across hips', sets: 2,
    cues: [
      'Upper back braced on a bench, feet flat, knees bent',
      'Drive hips up by squeezing your glutes, not by arching your lower back',
      'Pause briefly at the top, ribs down, don’t overextend',
      'Lower under control back to the start'
    ]
  },
  'dead-bug': {
    id: 'dead-bug', name: 'Dead bug', pattern: 'core', type: 'reps',
    target: '2 sets × 8-10 reps per side', sets: 2, repsPerSet: '8-10', equipment: 'bodyweight, each side',
    cues: [
      'Lie on your back, arms up, knees bent at 90°',
      'Press your lower back gently into the floor and keep it there',
      'Slowly extend opposite arm and leg out, then return',
      'Move slowly — control matters more than reps here'
    ]
  },

  'split-squat': {
    id: 'split-squat', name: 'Split squat', pattern: 'squat', type: 'weight',
    target: '2 sets × 10 reps per leg · bodyweight or light dumbbells', sets: 2,
    cues: [
      'Stagger stance, back heel lifted, front foot flat',
      'Lower straight down, back knee drops toward the floor',
      'Front knee tracks over your foot, don’t let it cave in',
      'Push through the front foot to stand'
    ]
  },
  'single-arm-row': {
    id: 'single-arm-row', name: 'Single-arm dumbbell row', pattern: 'pull', type: 'weight',
    target: '2 sets × 10 reps per side · moderate dumbbell', sets: 2,
    cues: [
      'Support yourself with one hand/knee on a bench, flat back',
      'Pull the dumbbell to your hip, elbow close to your side',
      'Squeeze your shoulder blade back at the top',
      'Lower under control, don’t let your torso twist'
    ]
  },
  'landmine-press': {
    id: 'landmine-press', name: 'Landmine press', pattern: 'push', type: 'weight',
    target: '2 sets × 10 reps per side · light-moderate', sets: 2,
    note: 'Shoulder-friendly pressing angle — good option if flat/incline pressing pinches',
    cues: [
      'Half-kneeling or standing, barbell end at chest height',
      'Press up and slightly forward along the natural arc',
      'Stop if the right shoulder pinches at the top of the press'
    ]
  },
  'single-leg-rdl': {
    id: 'single-leg-rdl', name: 'Single-leg Romanian deadlift', pattern: 'hinge', type: 'weight',
    target: '2 sets × 8 reps per side · bodyweight or light dumbbell', sets: 2,
    cues: [
      'Soft bend in the standing knee, hinge from the hips',
      'Let the free leg extend back as your torso tips forward',
      'Keep hips square, don’t let them rotate open',
      'Light touch down or tap, then drive back up to standing'
    ]
  },
  'side-plank': {
    id: 'side-plank', name: 'Side plank', pattern: 'core', type: 'hold',
    target: '2 × 20-30 sec hold, alternate sides', holdSeconds: 25, sets: 2,
    cues: [
      'Stack feet, prop up on one forearm, hips lifted off the floor',
      'Body in a straight line from ankles to shoulders',
      'Alternate sides between sets — set 1 one side, set 2 the other'
    ]
  }
};

// Suggested form-demo videos, seeded as defaults — edit the link field on
// any exercise card to override. Primarily ScottHermanFitness for standard
// gym-equipment lifts (consistent "How To" style); the two rehab-specific
// drills are sourced from PT-run channels instead (E3 Rehab, and Champion
// PT & Performance for the Spanish squat specifically).
export const DEFAULT_LINKS = {
  'goblet-squat': 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
  'lat-pulldown': 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
  'chest-press': 'https://www.youtube.com/watch?v=xUm0BiZCWlQ',
  'rdl': 'https://www.youtube.com/watch?v=FQKfr1YDhEk',
  'spanish-squat': 'https://www.youtube.com/watch?v=qrBEigyHW4k',
  'band-rotation': 'https://www.youtube.com/watch?v=X46R4sDzm5E',
  'plank': 'https://www.youtube.com/watch?v=A2b2EmIg0dA',
  'leg-press': 'https://www.youtube.com/watch?v=oujca3_Shgw',
  'seated-row': 'https://www.youtube.com/watch?v=7o2oolbmzeI',
  'incline-press': 'https://www.youtube.com/watch?v=ig0NyNlSce4',
  'hip-thrust': 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
  'dead-bug': 'https://www.youtube.com/watch?v=bxn9FBrt4-A',
  'split-squat': 'https://www.youtube.com/watch?v=hPC8-z6QXco',
  'single-arm-row': 'https://www.youtube.com/watch?v=KRN38chlkds',
  'landmine-press': 'https://www.youtube.com/watch?v=7i64SnEJv6A',
  'single-leg-rdl': 'https://www.youtube.com/watch?v=MsE_T9nAsSE',
  'side-plank': 'https://www.youtube.com/watch?v=9kuthTttTUs'
};

export const SESSIONS = {
  a: {
    id: 'a', label: 'Session A', subtitle: 'Squat · Pull · Push · Hinge',
    exerciseIds: ['goblet-squat', 'lat-pulldown', 'chest-press', 'rdl', 'spanish-squat', 'band-rotation', 'plank']
  },
  b: {
    id: 'b', label: 'Session B', subtitle: 'Leg press · Row · Incline press · Hip thrust',
    exerciseIds: ['leg-press', 'seated-row', 'incline-press', 'hip-thrust', 'spanish-squat', 'band-rotation', 'dead-bug']
  },
  c: {
    id: 'c', label: 'Session C', subtitle: 'Split squat · Single-arm row · Landmine press · Single-leg RDL',
    exerciseIds: ['split-squat', 'single-arm-row', 'landmine-press', 'single-leg-rdl', 'spanish-squat', 'band-rotation', 'side-plank']
  }
};

// First-session data, already validated with no niggles — seeded into
// history on first load so progression tracking starts from a real point.
export const SEED_SESSION = {
  date: '2026-08-29',
  sessionId: 'a',
  values: {
    'goblet-squat': [7, 7],
    'lat-pulldown': [32, 32],
    'chest-press': [18, 23],
    'rdl': [9, 9],
    'spanish-squat': [25, 25],
    'band-rotation': [null, null],
    'plank': [25, 25]
  }
};
