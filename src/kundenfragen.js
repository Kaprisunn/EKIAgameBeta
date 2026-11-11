// Kund:innen mit ❓-Symbol folgen dem Spieler kurz (npc.js). „Helfen“ öffnet eine Frage passend zur
// eigenen Abteilung (kundenhilfe.js). Pro Etage höchstens zwei gleichzeitig.
import * as THREE from 'three';
import { HILFE, ENGLISCH } from './kundenhilfe.js';
import { PUNKTE } from './lerninhalte.js';
import { auswahl } from './minispiele.js';

function frageMaterial() {
  const leinwand = document.createElement('canvas');
  leinwand.width = leinwand.height = 128;
  const g = leinwand.getContext('2d');
  const verlauf = g.createRadialGradient(-16 + 64, -20 + 64, 4, 64, 64, 60);
  verlauf.addColorStop(0, '#5fa2e6');
  verlauf.addColorStop(1, '#0058ab');
  g.beginPath();
  g.arc(64, 64, 54, 0, Math.PI * 2);
  g.fillStyle = verlauf;
  g.fill();
  g.lineWidth = 7;
  g.strokeStyle = '#ffffff';
  g.stroke();
  g.fillStyle = '#ffffff';
  g.font = '900 72px "Arial Rounded MT Bold", Arial, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('?', 64, 68);
  const textur = new THREE.CanvasTexture(leinwand);
  textur.colorSpace = THREE.SRGBColorSpace;
  return new THREE.SpriteMaterial({ map: textur, depthTest: false, fog: false, toneMapped: false });
}

export function erstelleKundenfragen({ welt, leute, ui, missionen, abzeichen }) {
  const mat = frageMaterial(), plaetze = {}, benutzt = new Set();
  for (const [id, etage] of Object.entries(welt.etagen)) {
    plaetze[id] = [0, 1].map(() => {
      const s = new THREE.Sprite(mat);
      s.visible = false;
      s.renderOrder = 10;
      s.scale.setScalar(0.9);
      etage.gruppe.add(s);
      return { s, punkt: { art: 'kunde', x: 0, z: 0, r: 2.2, person: null } };
    });
  }
  let t = 0;

  return {
    // Symbole über den fragenden Kund:innen; Interaktionspunkte wandern mit
    update(dt, id) {
      t += dt;
      const fragende = leute.fragende(id), punkte = welt.etagen[id].punkte;
      plaetze[id].forEach((p, i) => {
        const n = fragende[i], idx = punkte.indexOf(p.punkt);
        p.s.visible = !!n;
        if (!n) { if (idx >= 0) punkte.splice(idx, 1); return; }
        p.s.position.set(n.pos.x, 3.2 + Math.sin(t * 3 + i) * 0.1, n.pos.z);
        p.punkt.x = n.pos.x;
        p.punkt.z = n.pos.z;
        p.punkt.person = n;
        if (idx < 0) punkte.push(p.punkt);
      });
    },
    // Frage passend zur Abteilung; jede Frage kommt erst wieder, wenn alle einmal dran waren
    starte(punkt, abteilung, fertig) {
      // Etwa jede dritte Frage kommt auf Englisch, sonst passend zur Abteilung
      const pool = Math.random() < 0.3 ? ENGLISCH : HILFE[abteilung] ?? HILFE.verkauf;
      let offen = pool.filter((q) => !benutzt.has(q));
      if (!offen.length) { pool.forEach((q) => benutzt.delete(q)); offen = pool; }
      const f = offen[Math.floor(Math.random() * offen.length)];
      benutzt.add(f);
      let fehler = 0;
      ui.tafel(f, (box, melde) => auswahl(box, f, (ok) => {
        if (!ok) { fehler++; melde({ richtig: false, text: `Noch nicht ganz. Denk-Tipp: ${f.tipp}` }); return; }
        const p = fehler ? Math.ceil(PUNKTE.kunde / 2) : PUNKTE.kunde;
        missionen.punkteDazu(p);
        abzeichen?.zaehle('kunden');
        if (punkt.person) leute.bedanke(punkt.person);
        melde({ richtig: true, text: `Richtig! +${p} Punkte. ${f.warum}` });
      }), fertig);
    },
  };
}
