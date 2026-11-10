// Spielfigur: Bewegung mit weichem Beschleunigen, Drehen in Laufrichtung, Kollision, Animation.
import * as THREE from 'three';
import { baueFigur } from './figuren.js';
import { neueAnimation, animiere, starteWinken } from './animation.js';
import { FIGUREN, START, SPIELER } from './daten.js';
import { ton } from './audio.js';

export function erstelleSpieler(szene, welt) {
  const figur = baueFigur(FIGUREN.spieler);
  const anim = neueAnimation();
  const pos = figur.wurzel.position.set(START.x, 0, START.z);
  const tempo = new THREE.Vector3();
  let blickwinkel = 0;
  szene.add(figur.wurzel);

  return {
    pos,
    tempo,
    winken() { starteWinken(anim); ton.winken(); },
    // Versetzt die Figur (Etagenwechsel); dreh = Blickrichtung (0 = zur Kamera)
    teleport(x, z, dreh = 0) {
      pos.set(x, 0, z);
      tempo.set(0, 0, 0);
      blickwinkel = dreh;
      figur.wurzel.rotation.y = dreh;
    },
    // richtung: {x, z} mit Länge 0..1, aktiv: false im Menü (Figur steht und atmet nur)
    update(dt, richtung, aktiv = true) {
      const max = SPIELER.tempo, rx = aktiv ? richtung.x : 0, rz = aktiv ? richtung.z : 0;
      const k = 1 - Math.exp(-dt * 12);
      tempo.x += (rx * max - tempo.x) * k;
      tempo.z += (rz * max - tempo.z) * k;
      pos.x += tempo.x * dt;
      pos.z += tempo.z * dt;
      welt.schiebeRaus(pos, SPIELER.radius);

      const v = Math.hypot(tempo.x, tempo.z);
      if (v > 0.3) {
        const ziel = Math.atan2(tempo.x, tempo.z);
        let d = ziel - blickwinkel;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        blickwinkel += d * (1 - Math.exp(-dt * 14));
        figur.wurzel.rotation.y = blickwinkel;
      }
      if (animiere(figur, anim, dt, Math.min(1, v / max))) ton.schritt();
    },
  };
}
