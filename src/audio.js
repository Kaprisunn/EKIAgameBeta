// Synthetische Töne mit WebAudio. Der AudioContext startet erst beim ersten Tippen (iPad-Regel).
let ctx = null, haupt = null, rauschen = null;

function starte() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      haupt = ctx.createGain();
      haupt.gain.value = 0.55;
      haupt.connect(ctx.destination);
      rauschen = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const d = rauschen.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    }
    if (ctx.state === 'suspended') ctx.resume();
  } catch { ctx = null; }
}
for (const art of ['pointerup', 'touchend', 'click', 'keydown']) window.addEventListener(art, starte, { passive: true });

function piep(frequenz, dauer, { typ = 'sine', laut = 0.2, ende = frequenz, start = 0 } = {}) {
  if (!ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime + start, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = typ;
  o.frequency.setValueAtTime(frequenz, t);
  o.frequency.exponentialRampToValueAtTime(ende, t + dauer);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(laut, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
  o.connect(g).connect(haupt);
  o.start(t);
  o.stop(t + dauer + 0.02);
}

export const ton = {
  klick() { piep(660, 0.08, { ende: 880, laut: 0.15 }); },
  ding() { piep(1046, 0.6, { laut: 0.16 }); piep(784, 0.9, { laut: 0.14, start: 0.18 }); },
  winken() { piep(520, 0.12, { typ: 'triangle', ende: 700 }); piep(700, 0.16, { typ: 'triangle', ende: 900, start: 0.13 }); },
  schritt() {
    if (!ctx || ctx.state !== 'running') return;
    const q = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    q.buffer = rauschen;
    q.playbackRate.value = 0.8 + Math.random() * 0.4;
    f.type = 'lowpass';
    f.frequency.value = 700;
    g.gain.value = 0.12;
    q.connect(f).connect(g).connect(haupt);
    q.start();
  },
};
