// Wagen-Rallye auf dem Parkplatz: 5 herrenlose Einkaufswagen in 30 Sekunden durch Berührung einsammeln.
// Eingesammelte Wagen hängen sich als Kette hinter die Figur. Gestartet am Wagenhäuschen („🛒 Wagen-Rallye“).
import * as THREE from 'three';
import { material, teil, verschmelzen, quader, zylinder } from './formen.js';
import { FARBE as F } from './daten.js';
import { ton } from './audio.js';

const ANZAHL = 5, ZEIT = 30, ABSTAND = 1.15, GREIFEN = 1.4;
// Freie Stellen auf den Fahrgassen, auf die die Wagen verteilt werden
const STELLEN = [[-24, -15], [-3, -15], [6, -14.5], [24, -15], [-26, 1], [-9, 1.5], [8, 0.5], [26, 1.2], [-8, 16.8], [4, 17.5], [17, 17], [29, -1]];

// Ein einzelner Einkaufswagen (Griff zeigt nach -x)
function wagenGeometrie() {
  const t = [teil(quader(1.0, 0.04, 0.6), F.metall, [0, 0.6, 0]), teil(quader(1.0, 0.45, 0.03), F.metall, [0, 0.82, 0.3]),
    teil(quader(1.0, 0.45, 0.03), F.metall, [0, 0.82, -0.3]), teil(quader(0.03, 0.45, 0.6), F.metall, [0.5, 0.82, 0]),
    teil(quader(0.06, 0.06, 0.64), F.blau, [-0.62, 1.1, 0]), teil(quader(0.04, 0.55, 0.04), F.dunkelgrau, [-0.45, 0.32, 0.25]),
    teil(quader(0.04, 0.55, 0.04), F.dunkelgrau, [-0.45, 0.32, -0.25])];
  for (const [dx, dz] of [[-0.4, 0.25], [-0.4, -0.25], [0.4, 0.25], [0.4, -0.25]]) t.push(teil(zylinder(0.07, 0.07, 0.05), F.schwarz, [dx, 0.07, dz], [Math.PI / 2, 0, 0]));
  return verschmelzen(t);
}

export function erstelleRallye({ welt, ui, missionen }) {
  const netz = new THREE.InstancedMesh(wagenGeometrie(), material('bunt'), ANZAHL);
  netz.castShadow = true;
  netz.frustumCulled = false;
  netz.visible = false;
  welt.etagen.pp.gruppe.add(netz);
  const o = new THREE.Object3D();
  let aktiv = false, zeit = 0, wagen = [], kette = [];

  function ende(text) {
    aktiv = false;
    netz.visible = false;
    ui.toast(text, 4500);
  }

  return {
    get aktiv() { return aktiv; },
    get text() { return `🛒 Wagen-Rallye: ${kette.length}/${ANZAHL} · noch ${Math.ceil(zeit)} s`; },
    starte() {
      const frei = [...STELLEN].sort(() => Math.random() - 0.5).slice(0, ANZAHL);
      wagen = frei.map(([x, z]) => ({ x, z, dreh: Math.random() * 6, drin: false }));
      kette = [];
      zeit = ZEIT;
      aktiv = true;
      netz.visible = true;
      ui.toast('Los! Sammle 5 Einkaufswagen in 30 Sekunden: einfach hinlaufen.', 3500);
    },
    update(dt, etage, pos) {
      if (!aktiv) return;
      if (etage !== 'pp') { ende('Wagen-Rallye abgebrochen.'); return; }
      zeit -= dt;
      for (const w of wagen) {
        if (w.drin || Math.hypot(w.x - pos.x, w.z - pos.z) > GREIFEN) continue;
        w.drin = true;
        kette.push(w);
        ton.sammeln();
      }
      // Kette: Jeder Wagen folgt seinem Vordermann in festem Abstand, der Griff zeigt nach vorn
      let vx = pos.x, vz = pos.z;
      for (const w of kette) {
        const dx = vx - w.x, dz = vz - w.z, d = Math.hypot(dx, dz);
        if (d > ABSTAND) { w.x += (dx / d) * (d - ABSTAND); w.z += (dz / d) * (d - ABSTAND); }
        if (d > 0.01) w.dreh = Math.atan2(dz, -dx);
        vx = w.x;
        vz = w.z;
      }
      wagen.forEach((w, i) => {
        o.position.set(w.x, 0, w.z);
        o.rotation.set(0, w.dreh, 0);
        o.updateMatrix();
        netz.setMatrixAt(i, o.matrix);
      });
      netz.instanceMatrix.needsUpdate = true;
      if (kette.length === ANZAHL) {
        const p = 30 + Math.floor(zeit);
        missionen.punkteDazu(p);
        ton.richtig();
        ende(`Geschafft! Alle 5 Wagen in ${Math.round(ZEIT - zeit)} s. +${p} Punkte. Die Wagen stehen jetzt sicher in der Box.`);
      } else if (zeit <= 0) {
        ende(`Zeit um: ${kette.length} von 5 Wagen. Am Wagenhäuschen kannst du es gleich nochmal versuchen.`);
      }
    },
  };
}
