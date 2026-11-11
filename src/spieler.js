// Spielfigur: Bewegung mit weichem Beschleunigen, Drehen in Laufrichtung, Kollision, Animation, Shirt-Wechsel.
// Die Figur steckt in einer festen Hülle; so bleibt `pos` gültig, auch wenn die Figur neu gebaut wird.
import * as THREE from 'three';
import { baueFigur } from './figuren.js';
import { neueAnimation, animiere, starteWinken } from './animation.js';
import { FIGUREN, FARBE, START, SPIELER } from './daten.js';
import { ton } from './audio.js';

// Kleiderordnung: Gelb = Verkauf (schwarze Hose), Blau = Logistik und Restaurant (dunkelblaue Hose)
const KLEIDUNG = {
  gelb: { shirt: FARBE.gelb, hose: 0x2b2b30, schild: FARBE.blau },
  blau: { shirt: FARBE.blau, hose: 0x1e2f55, schild: FARBE.gelb },
};
const WIRBEL_DAUER = 0.45;

// Farb-Wirbel beim Umziehen: ein kleiner Sternchen-Kreis, der sich hochschraubt und verblasst
function wirbel() {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(18 * 3), 3));
  const punkte = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.3, transparent: true, depthWrite: false }));
  punkte.visible = false;
  punkte.frustumCulled = false;
  return punkte;
}

export function erstelleSpieler(szene, welt, shirt = 'gelb') {
  const huelle = new THREE.Group(), pos = huelle.position.set(START.x, 0, START.z), funken = wirbel();
  huelle.add(funken);
  szene.add(huelle);
  const anim = neueAnimation(), tempo = new THREE.Vector3();
  let figur = null, blickwinkel = 0, wirbelZeit = 0;

  function kleide(farbe) {
    if (figur) {
      huelle.remove(figur.wurzel);
      figur.wurzel.traverse((o) => o.geometry?.dispose());
    }
    figur = baueFigur({ ...FIGUREN.spieler, ...KLEIDUNG[farbe] });
    huelle.add(figur.wurzel);
  }
  kleide(shirt);

  return {
    pos,
    tempo,
    winken() { starteWinken(anim); ton.winken(); },
    // Versetzt die Figur (Etagenwechsel); dreh = Blickrichtung (0 = zur Kamera)
    teleport(x, z, dreh = 0) {
      pos.set(x, 0, z);
      tempo.set(0, 0, 0);
      blickwinkel = dreh;
      huelle.rotation.y = dreh;
    },
    // Shirt wechseln: Figur neu bauen und kurz einen Farb-Wirbel zeigen
    setzeShirt(farbe) {
      kleide(farbe);
      funken.material.color.set(KLEIDUNG[farbe].shirt);
      wirbelZeit = WIRBEL_DAUER;
      funken.visible = true;
    },
    // richtung: {x, z} mit Länge 0..1, aktiv: false im Menü oder bei offener Tafel (Figur steht und atmet nur)
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
        let d = Math.atan2(tempo.x, tempo.z) - blickwinkel;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        blickwinkel += d * (1 - Math.exp(-dt * 14));
        huelle.rotation.y = blickwinkel;
      }
      if (animiere(figur, anim, dt, Math.min(1, v / max))) ton.schritt();

      if (wirbelZeit > 0) {
        wirbelZeit -= dt;
        const t = 1 - Math.max(0, wirbelZeit) / WIRBEL_DAUER, a = funken.geometry.attributes.position;
        for (let i = 0; i < a.count; i++) {
          const w = (i / a.count) * Math.PI * 2 + t * 7, r = 0.9 + t * 0.4;
          a.setXYZ(i, Math.cos(w) * r, 0.3 + t * 2.4 + (i % 3) * 0.2, Math.sin(w) * r);
        }
        a.needsUpdate = true;
        funken.material.opacity = 1 - t;
        if (wirbelZeit <= 0) funken.visible = false;
      }
    },
  };
}
