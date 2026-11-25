let sharedAudioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx();
  }
  return sharedAudioCtx;
}

export function unlockOrderAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch {
    // Ignore audio unlock errors
  }
}

export function playOrderSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Warm luxury ascending chord chime (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.085;
      const osc = ctx.createOscillator();
      const shimmerOsc = ctx.createOscillator();
      const gain = ctx.createGain();
      const shimmerGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      shimmerOsc.type = 'triangle';
      shimmerOsc.frequency.setValueAtTime(freq * 2, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.15, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.65);

      shimmerGain.gain.setValueAtTime(0.0001, start);
      shimmerGain.gain.exponentialRampToValueAtTime(0.035, start + 0.025);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);

      osc.connect(gain);
      shimmerOsc.connect(shimmerGain);
      gain.connect(ctx.destination);
      shimmerGain.connect(ctx.destination);

      osc.start(start);
      shimmerOsc.start(start);
      osc.stop(start + 0.7);
      shimmerOsc.stop(start + 0.45);
    });
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}
