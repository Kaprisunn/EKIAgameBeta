// Ampel-Missionen: schwebende Symbole (Rot = Notfall, Gelb = Kollegenhilfe, Grün = Aufgabe) über Personen
// und Gefahrenstellen. Vor dem Start wird die Kleiderordnung geprüft; rote Notfälle gelten immer für alle.
import * as THREE from 'three';
import { MISSIONEN, PUNKTE } from './lerninhalte.js';
import { material, teil, quader } from './formen.js';
import { FARBE } from './daten.js';
import { speicher } from './zustand.js';
import { auswahl, timing, sortieren } from './minispiele.js';

const NOETIG = { verkauf: 'gelb', logistik: 'blau' };
const SPIELE = { auswahl, timing, sortieren };
const SHIRT_NAME = { gelb: 'das gelbe Streifen-Shirt (Verkauf)', blau: 'das blaue Streifen-Shirt (Logistik, Restaurant, ComIn, P&C)' };

// Drei glänzende Symbole in einer kleinen, selbst gezeichneten Textur (je 128 × 128 Pixel)
function markerMaterialien() {
  const leinwand = document.createElement('canvas');
  leinwand.width = 384;
  leinwand.height = 128;
  const g = leinwand.getContext('2d');
  const symbole = [['rot', '#d9362b', '#ff9a8a', 'kreis', '!'], ['gelb', '#f2b705', '#ffe98a', 'raute', '🤝'], ['gruen', '#2e9e4f', '#93e6ab', 'kreis', '✓']];
  symbole.forEach(([, farbe, hell, form, zeichen], i) => {
    g.save();
    g.translate(i * 128 + 64, 64);
    const verlauf = g.createRadialGradient(-16, -20, 4, 0, 0, 60);
    verlauf.addColorStop(0, hell);
    verlauf.addColorStop(1, farbe);
    g.beginPath();
    if (form === 'raute') { g.moveTo(0, -57); g.lineTo(57, 0); g.lineTo(0, 57); g.lineTo(-57, 0); g.closePath(); } else g.arc(0, 0, 54, 0, Math.PI * 2);
    g.fillStyle = verlauf;
    g.fill();
    g.lineWidth = 7;
    g.strokeStyle = '#ffffff';
    g.stroke();
    g.fillStyle = '#ffffff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = form === 'raute' ? '46px sans-serif' : '900 68px "Arial Rounded MT Bold", Arial, sans-serif';
    g.fillText(zeichen, 0, 4);
    g.restore();
  });
  const basis = new THREE.CanvasTexture(leinwand);
  basis.colorSpace = THREE.SRGBColorSpace;
  const mats = {};
  symbole.forEach(([name], i) => {
    const t = basis.clone();
    t.repeat.set(1 / 3, 1);
    t.offset.set(i / 3, 0);
    t.needsUpdate = true;
    mats[name] = new THREE.SpriteMaterial({ map: t, depthTest: false, fog: false, toneMapped: false });
  });
  return mats;
}

function gefahrNetz(m) {
  const [x, z] = m.ort;
  if (m.gefahr === 'pfuetze') {
    const geo = new THREE.CircleGeometry(1, 20).rotateX(-Math.PI / 2).scale(1.4, 1, 0.9);
    const netz = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x8fc9e8, transparent: true, opacity: 0.75, depthWrite: false }));
    netz.position.set(x, 0.03, z);
    return netz;
  }
  if (m.gefahr === 'karton') {
    const netz = new THREE.Mesh(teil(quader(1.2, 0.7, 1.5), FARBE.karton), material('bunt'));
    netz.position.set(x, 2.85, z);
    netz.rotation.z = 0.45;
    netz.castShadow = true;
    return netz;
  }
  return null;
}

export function erstelleMissionen({ welt, leute, ui }) {
  const mats = markerMaterialien();
  const stand = speicher.laden('missionen', { erledigt: [], punkte: 0 });
  const eintraege = MISSIONEN.map((m) => {
    const gruppe = welt.etagen[m.etage].gruppe, marker = new THREE.Sprite(mats[m.art]), gefahr = gefahrNetz(m);
    marker.renderOrder = 10;
    gruppe.add(marker);
    if (gefahr) gruppe.add(gefahr);
    const [kx, kz] = m.knopf ?? m.ort;
    return { m, marker, gefahr, person: leute.missionsPerson(m.id), versuche: 0,
      punkt: { art: 'mission', x: kx, z: kz, r: m.radius ?? 2.0, mission: m.id, farbe: m.art } };
  });
  const offen = (e) => !stand.erledigt.includes(e.m.id);

  // Symbole, Gefahren und Interaktionspunkte passend zum Spielstand ein- oder ausblenden
  function aufbauen() {
    for (const e of eintraege) {
      const an = offen(e), punkte = welt.etagen[e.m.etage].punkte, i = punkte.indexOf(e.punkt);
      e.marker.visible = an;
      if (e.gefahr) e.gefahr.visible = an;
      if (an && i < 0) punkte.push(e.punkt);
      if (!an && i >= 0) punkte.splice(i, 1);
      // Kund:innen warten, bis geholfen ist, und bummeln danach zufrieden weiter
      if (e.person?.typ === 'kunde') {
        e.person.steht = an;
        if (an) { e.person.pos.set(e.m.ort[0], 0, e.m.ort[1]); e.person.dreh = e.m.ort[2]; }
      }
    }
  }
  aufbauen();
  let t = 0;

  return {
    gesamt: MISSIONEN.length,
    get punkte() { return stand.punkte; },
    get erledigt() { return stand.erledigt.length; },
    // Prüft zuerst „Notfall?“, dann die Shirt-Farbe, und öffnet die Frage-Tafel. fertig() nach dem Schließen.
    starte(id, shirt, fertig) {
      const e = eintraege.find((x) => x.m.id === id);
      if (!e || !offen(e)) return false;
      const m = e.m, noetig = m.art === 'rot' ? null : NOETIG[m.zone];
      if (noetig && noetig !== shirt) {
        ui.toast(`Für diese Aufgabe brauchst du ${SHIRT_NAME[noetig]}. Umziehen am Spind: EG neben der SB-Halle, OG in der Umkleide.`, 4500);
        return false;
      }
      // Je nach Typ ein Minispiel (Timing, Sortieren) oder die Auswahl mit drei Antworten
      ui.tafel(m, (box, melde) => SPIELE[m.typ ?? 'auswahl'](box, m, (ok) => {
        if (!ok) {
          e.versuche++;
          melde({ richtig: false, text: `Noch nicht ganz. Denk-Tipp: ${m.tipp}` });
          return;
        }
        const p = e.versuche ? Math.ceil(PUNKTE[m.art] / 2) : PUNKTE[m.art];
        stand.punkte += p;
        stand.erledigt.push(m.id);
        speicher.speichern('missionen', stand);
        aufbauen();
        melde({ richtig: true, text: `Geschafft! +${p} Punkte. ${m.warum}` });
      }), fertig);
      return true;
    },
    punkteDazu(p) {
      stand.punkte += p;
      speicher.speichern('missionen', stand);
    },
    zuruecksetzen() {
      stand.erledigt = [];
      stand.punkte = 0;
      eintraege.forEach((e) => { e.versuche = 0; });
      speicher.speichern('missionen', stand);
      aufbauen();
    },
    // Symbole schweben und pulsieren; liefert den Text für den Haus-Funk (offene Notfälle) oder null
    update(dt, etageId) {
      t += dt;
      let funk = null;
      for (const e of eintraege) {
        if (!offen(e)) continue;
        const x = e.person ? e.person.pos.x : e.m.ort[0], z = e.person ? e.person.pos.z : e.m.ort[1];
        const h = e.m.hoehe ?? 3.4;
        e.marker.position.set(x, h + Math.sin(t * 3 + x) * 0.12, z);
        e.marker.scale.setScalar(1.05 + Math.sin(t * 6 + z) * 0.06);
        if (e.m.art !== 'rot') continue;
        const hier = e.m.etage === etageId;
        if (hier || !funk) funk = hier ? `📻 Notfall auf dieser Etage: ${e.m.titel}` : `📻 Haus-Funk: Notfall im ${welt.etagen[e.m.etage].def.name}: ${e.m.titel}`;
      }
      return funk;
    },
  };
}
