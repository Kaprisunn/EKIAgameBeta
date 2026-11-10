// Animation ohne Animationsdateien: Laufen, Atmen, Umherschauen, Blinzeln, Winken.
// Alle Übergänge weich über lerp mit exponentieller Glättung.
const lerp = (a, b, t) => a + (b - a) * t;
const glatt = (rate, dt) => 1 - Math.exp(-rate * dt);

export function neueAnimation() {
  return {
    t: Math.random() * 10, phase: 0, tempo: 0,
    blinzelIn: 1 + Math.random() * 3, blinzel: 0,
    blickZiel: 0, blickIn: 2, winken: 0, winkGewicht: 0,
  };
}

const BLINZEL_DAUER = 0.12, WINK_DAUER = 1.6;

export function starteWinken(a) { a.winken = WINK_DAUER; }

// geschw: 0 (steht) bis 1 (rennt). Gibt true zurück, wenn ein Fuß aufsetzt (für Schrittgeräusche).
export function animiere(f, a, dt, geschw) {
  a.t += dt;
  a.tempo = lerp(a.tempo, geschw, glatt(10, dt));
  const v = a.tempo, ruhe = 1 - Math.min(1, v * 2.5);
  const altePhase = a.phase;
  a.phase += dt * (5 + 7 * v) * Math.min(1, v * 4);
  const sw = Math.sin(a.phase);

  // Laufen: Beine und Arme pendeln gegengleich, Körper wippt und neigt sich nach vorn
  f.beinL.rotation.x = sw * 0.75 * v;
  f.beinR.rotation.x = -sw * 0.75 * v;
  f.koerper.position.y = f.basisY + Math.abs(sw) * 0.09 * v;
  f.koerper.rotation.x = lerp(f.koerper.rotation.x, 0.13 * v, glatt(8, dt));
  f.koerper.rotation.z = Math.sin(a.phase) * 0.04 * v;

  // Atmen: Körperhöhe ±2 %
  const atem = Math.sin(a.t * 2.3);
  f.koerper.scale.set(1 - atem * 0.007 * ruhe, 1 + atem * 0.02 * ruhe, 1 - atem * 0.007 * ruhe);

  // Winken: rechter Arm hebt sich seitlich und schwenkt
  if (a.winken > 0) a.winken = Math.max(0, a.winken - dt);
  const zielGewicht = a.winken > 0.25 ? 1 : 0;
  a.winkGewicht = lerp(a.winkGewicht, zielGewicht, glatt(12, dt));
  const w = a.winkGewicht;
  f.armL.rotation.x = -sw * 0.65 * v;
  f.armL.rotation.z = 0.1 + atem * 0.02 * ruhe;
  f.armR.rotation.x = lerp(sw * 0.65 * v, 0, w);
  f.armR.rotation.z = lerp(-0.1 - atem * 0.02 * ruhe, -2.55 + Math.sin(a.t * 13) * 0.35, w);

  // Kopf: schaut im Stehen langsam umher, beim Winken nach vorn
  a.blickIn -= dt;
  if (a.blickIn <= 0) { a.blickZiel = (Math.random() * 2 - 1) * 0.65; a.blickIn = 1.8 + Math.random() * 2.5; }
  const blick = a.blickZiel * ruhe * (1 - w);
  f.kopf.rotation.y = lerp(f.kopf.rotation.y, blick, glatt(3, dt));
  f.kopf.rotation.x = Math.sin(a.t * 1.4) * 0.03 * ruhe - 0.05 * v;
  f.kopf.rotation.z = lerp(f.kopf.rotation.z, w * 0.12, glatt(6, dt));

  // Blinzeln alle 2 bis 5 Sekunden für 0,12 s
  a.blinzelIn -= dt;
  if (a.blinzelIn <= 0) { a.blinzel = BLINZEL_DAUER; a.blinzelIn = 2 + Math.random() * 3; }
  if (a.blinzel > 0) a.blinzel = Math.max(0, a.blinzel - dt);
  const zu = a.blinzel > 0 ? Math.sin(Math.PI * (1 - a.blinzel / BLINZEL_DAUER)) : 0;
  f.augen.scale.y = 1 - zu * 0.9;

  // Schritt: Vorzeichenwechsel des Pendels
  return v > 0.15 && Math.sign(Math.sin(altePhase)) !== Math.sign(sw);
}
