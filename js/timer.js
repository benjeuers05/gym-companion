// Shared start/stop countdown timer for hold exercises, with an audio
// cue at zero. Reused by every hold-type set row in the session runner.

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    // Audio isn't critical to the hold — ignore if unavailable.
  }
}

// callbacks: { onTick(remaining), onFinish(secondsHeld) }
export function createHoldTimer(targetSeconds, callbacks) {
  let remaining = targetSeconds;
  let interval = null;
  let running = false;

  function start() {
    if (running) return;
    running = true;
    remaining = targetSeconds;
    callbacks.onTick(remaining);
    interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        finish(targetSeconds);
      } else {
        callbacks.onTick(remaining);
      }
    }, 1000);
  }

  function finish(secondsHeld) {
    clearInterval(interval);
    running = false;
    beep();
    callbacks.onFinish(secondsHeld);
  }

  function stopEarly() {
    finish(targetSeconds - remaining);
  }

  return {
    toggle() {
      if (running) stopEarly();
      else start();
    },
    get running() {
      return running;
    }
  };
}
