// EKIA-Multi-Blaster auf dem Parkplatz: Drei Wellen grummeliger Kund:innen laufen zum Eingang.
// Barcode-Ringe (schnell, weit) und Köttbullar-Snacks (Fläche) machen sie glücklich: Herzchen, blaue Tasche,
// sie drehen entspannt um. Niemand wird verletzt. Gestartet an der Station vor der Wagenbox (🎯).
import * as THREE from 'three';
import { baueFigur } from './figuren.js';
import { neueAnimation, animiere } from './animation.js';
import { material, teil, quader } from './formen.js';
import { FARBE } from './daten.js';
import { ton } from './audio.js';

const WELLEN = [4, 6, 8], TUER = [12, -18.5], RING = { tempo: 18, weite: 16 }, SNACK = { weite: 7, radius: 2.6, pause: 2.5, flug: 0.6 };
const HAUT = [0xf5d0b5, 0xf2c29b, 0xe8b48c, 0xc68a5e, 0x9b6a43, 0x6e4a2f], HAARE = [0x2e2522, 0x6b4a2f, 0xc9a35a, 0x9a9a9a, 0x1a1a1a];
const zufall = (l) => l[Math.floor(Math.random() * l.length)];

// Kleines Symbol aus einer selbst gezeichneten Textur (Grummel-Wolke oder Herz)
function symbol(zeichne) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  zeichne(c.getContext('2d'));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.SpriteMaterial({ map: t, fog: false, toneMapped: false });
}
const herzZeichen = (g, x, y, s) => { g.font = `${s}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('❤️', x, y); };
const WOLKE = () => symbol((g) => {
  g.fillStyle = '#5b6470';
  for (const [x, y, r] of [[44, 72, 30], [70, 58, 34], [94, 74, 26], [64, 82, 28]]) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#ffd23f';
  g.font = '900 44px sans-serif';
  g.textAlign = 'center';
  g.fillText('#!', 66, 86);
});
const HERZ = () => symbol((g) => herzZeichen(g, 64, 70, 90));

export function erstelleBlaster({ welt, ui, missionen, abzeichen }) {
  const gruppe = welt.etagen.pp.gruppe;
  let kunden = null, mats = null, aktiv = false, welle = 0, zuKommen = 0, spawnIn = 0, pauseIn = 0, snackIn = 0;
  let froh = 0, drin = 0, punkte = 0;

  // Projektile: Ringe (Torus) und Snacks (drei Bällchen), wiederverwendet
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x2ea8ff });
  const ringe = Array.from({ length: 6 }, () => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.07, 6, 16), ringMat);
    m.visible = false;
    gruppe.add(m);
    return { m, an: false, x: 0, z: 0, dx: 0, dz: 0, weg: 0 };
  });
  const snackGeo = new THREE.SphereGeometry(0.16, 8, 6), snackMat = new THREE.MeshBasicMaterial({ color: 0x8a4f2a });
  const snacks = Array.from({ length: 3 }, () => {
    const m = new THREE.Group();
    for (const [x, z] of [[-0.15, 0], [0.15, 0], [0, 0.18]]) { const b = new THREE.Mesh(snackGeo, snackMat); b.position.set(x, 0, z); m.add(b); }
    m.visible = false;
    gruppe.add(m);
    return { m, an: false, x0: 0, z0: 0, x1: 0, z1: 0, t: 0 };
  });

  // Herzchen-Partikel: ein Points-Pool, abgelaufene Teilchen werden unter den Boden geschoben
  const N = 80, hpos = new Float32Array(N * 3).fill(-50), leben = new Float32Array(N);
  const hgeo = new THREE.BufferGeometry();
  hgeo.setAttribute('position', new THREE.BufferAttribute(hpos, 3));
  const herzTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; herzZeichen(c.getContext('2d'), 32, 36, 48); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const herzen = new THREE.Points(hgeo, new THREE.PointsMaterial({ map: herzTex, size: 0.55, transparent: true, depthWrite: false, alphaTest: 0.1 }));
  herzen.frustumCulled = false;
  gruppe.add(herzen);
  let naechstes = 0;
  function herzRegen(x, z, anzahl) {
    for (let i = 0; i < anzahl; i++) {
      const k = naechstes++ % N;
      hpos.set([x + (Math.random() - 0.5) * 1.4, 1.5 + Math.random() * 1.5, z + (Math.random() - 0.5) * 1.4], k * 3);
      leben[k] = 0.8 + Math.random() * 0.6;
    }
  }

  // Grummelige Kund:innen in roter Kleidung (einmal gebaut, für alle Wellen wiederverwendet)
  function baueKunden() {
    mats = { wolke: WOLKE(), herz: HERZ() };
    kunden = Array.from({ length: Math.max(...WELLEN) }, () => {
      const f = baueFigur({ haut: zufall(HAUT), haare: zufall(HAARE), frisur: zufall(['kurz', 'zopf', 'dutt', 'glatze']), shirt: 0xd9483b,
        hose: zufall([0x4a5a78, 0x3a3f47, 0x8c7a5b]), schuhe: FARBE.umriss, groesse: 0.9 + Math.random() * 0.12, umriss: false, einfach: true });
      const tasche = new THREE.Mesh(teil(quader(0.36, 0.42, 0.16), FARBE.blau), material('bunt'));
      tasche.position.set(-0.05, -0.92, 0.02);
      f.armR.add(tasche);
      const zeichen = new THREE.Sprite(mats.wolke);
      zeichen.position.y = 3.2;
      zeichen.scale.setScalar(1.0);
      f.wurzel.add(zeichen);
      f.wurzel.visible = false;
      gruppe.add(f.wurzel);
      return { f, anim: neueAnimation(), zustand: 'aus', pos: f.wurzel.position, tasche, zeichen, tempo: 1.6, pruef: 0, rest: Infinity };
    });
  }

  function spawne() {
    const k = kunden.find((x) => x.zustand === 'aus');
    if (!k) return;
    k.zustand = 'kommt';
    k.pos.set(-16 + Math.random() * 44, 0, 21);
    k.tempo = 1.4 + Math.random() * 0.7 + welle * 0.15;
    k.tasche.visible = false;
    k.zeichen.material = mats.wolke;
    k.zeichen.visible = true;
    k.f.wurzel.visible = true;
    k.rest = Infinity;
  }

  function bekehre(k) {
    k.zustand = 'froh';
    k.tasche.visible = true;
    k.zeichen.material = mats.herz;
    herzRegen(k.pos.x, k.pos.z, 8);
    ton.sammeln();
    froh++;
    punkte += 3;
    missionen.punkteDazu(3);
  }

  function ende(text) {
    aktiv = false;
    kunden?.forEach((k) => { k.zustand = 'aus'; k.f.wurzel.visible = false; });
    ringe.forEach((r) => { r.an = false; r.m.visible = false; });
    snacks.forEach((s) => { s.an = false; s.m.visible = false; });
    ui.toast(text, 5000);
  }

  // Bewegt eine Person zum Ziel; hängt sie fest, gibt es einen kleinen Schubs zur Seite
  function gehe(k, dt, zx, zz) {
    const dx = zx - k.pos.x, dz = zz - k.pos.z, d = Math.hypot(dx, dz), s = Math.min(d, k.tempo * dt);
    if (d < 0.01) return d;
    k.pos.x += (dx / d) * s;
    k.pos.z += (dz / d) * s;
    welt.schiebeRaus(k.pos, 0.4);
    k.f.wurzel.rotation.y = Math.atan2(dx, dz);
    if ((k.pruef += dt) > 1.2) {
      if (d > k.rest - 0.4) { k.pos.x += (Math.random() < 0.5 ? -1 : 1) * 1.2; welt.schiebeRaus(k.pos, 0.4); }
      k.rest = d;
      k.pruef = 0;
    }
    return d;
  }

  // Nächste Person in Reichweite, optional nur innerhalb eines Blickkegels
  function ziel(px, pz, weite, blick = null) {
    let beste = null, bd = weite;
    for (const k of kunden) {
      if (k.zustand !== 'kommt') continue;
      const dx = k.pos.x - px, dz = k.pos.z - pz, d = Math.hypot(dx, dz);
      if (d > bd) continue;
      if (blick !== null) { let w = Math.atan2(dx, dz) - blick; w = Math.atan2(Math.sin(w), Math.cos(w)); if (Math.abs(w) > 0.6) continue; }
      bd = d;
      beste = k;
    }
    return beste;
  }

  return {
    get aktiv() { return aktiv; },
    get text() {
      const offen = kunden.filter((k) => k.zustand === 'kommt').length + zuKommen;
      return `🎯 Multi-Blaster · Welle ${Math.min(welle + 1, WELLEN.length)}/${WELLEN.length} · 😊 ${froh} · 😠 ${offen}`;
    },
    starte() {
      if (!kunden) baueKunden();
      aktiv = true;
      welle = 0;
      zuKommen = WELLEN[0];
      spawnIn = 1.5;
      pauseIn = 0;
      snackIn = 0;
      froh = drin = punkte = 0;
      ui.toast('Grummelige Kund:innen kommen! 📡 Ring: schnell und weit. 🧆 Köttbullar: wirkt im Umkreis.', 4500);
    },
    // art: 'ring' fliegt in Blickrichtung (mit leichter Zielhilfe), 'snack' landet bei der nächsten Person im Umkreis
    feuer(art, pos, blick) {
      if (!aktiv) return;
      if (art === 'ring') {
        const r = ringe.find((x) => !x.an);
        if (!r) return;
        const k = ziel(pos.x, pos.z, RING.weite, blick);
        let dx = Math.sin(blick), dz = Math.cos(blick);
        if (k) { const d = Math.hypot(k.pos.x - pos.x, k.pos.z - pos.z); dx = (k.pos.x - pos.x) / d; dz = (k.pos.z - pos.z) / d; }
        Object.assign(r, { an: true, x: pos.x, z: pos.z, dx, dz, weg: 0 });
        r.m.visible = true;
        ton.ring();
        return;
      }
      const s = snacks.find((x) => !x.an);
      if (!s || snackIn > 0) { ton.falsch(); return; }
      const k = ziel(pos.x, pos.z, SNACK.weite);
      const x1 = k ? k.pos.x : pos.x + Math.sin(blick) * 5, z1 = k ? k.pos.z : pos.z + Math.cos(blick) * 5;
      Object.assign(s, { an: true, x0: pos.x, z0: pos.z, x1, z1, t: 0 });
      s.m.visible = true;
      snackIn = SNACK.pause;
      ton.wurf();
    },
    update(dt, etage, pos) {
      for (let k = 0; k < N; k++) if (leben[k] > 0 && (leben[k] -= dt) > 0) hpos[k * 3 + 1] += dt * 1.6; else hpos[k * 3 + 1] = -50;
      hgeo.attributes.position.needsUpdate = true;
      if (!aktiv) return;
      if (etage !== 'pp') { ende('Multi-Blaster beendet.'); return; }
      snackIn = Math.max(0, snackIn - dt);

      // Wellen: Personen nacheinander am Straßenrand starten lassen
      if (zuKommen > 0 && (spawnIn -= dt) <= 0) { spawne(); zuKommen--; spawnIn = 1.3; }
      for (const k of kunden) {
        let v = 0;
        if (k.zustand === 'kommt') {
          if (gehe(k, dt, TUER[0], TUER[1]) < 1.6 || k.pos.z < -17.5) { k.zustand = 'aus'; k.f.wurzel.visible = false; drin++; }
          v = k.tempo / 6.5;
        } else if (k.zustand === 'froh') {
          if (gehe(k, dt, k.pos.x, 22.5) < 0.6) { k.zustand = 'aus'; k.f.wurzel.visible = false; }
          v = k.tempo / 6.5;
        }
        if (k.zustand !== 'aus') animiere(k.f, k.anim, dt, v);
      }

      // Ringe fliegen geradeaus und treffen die erste Person in ihrer Nähe
      for (const r of ringe) {
        if (!r.an) continue;
        r.x += r.dx * RING.tempo * dt;
        r.z += r.dz * RING.tempo * dt;
        r.weg += RING.tempo * dt;
        r.m.position.set(r.x, 1.4, r.z);
        r.m.rotation.set(Math.PI / 2, 0, r.weg * 2);
        const k = kunden.find((x) => x.zustand === 'kommt' && Math.hypot(x.pos.x - r.x, x.pos.z - r.z) < 0.9);
        if (k) bekehre(k);
        if (k || r.weg > RING.weite) { r.an = false; r.m.visible = false; }
      }
      // Snacks fliegen im Bogen und machen alle im Umkreis glücklich
      for (const s of snacks) {
        if (!s.an) continue;
        s.t += dt / SNACK.flug;
        const t = Math.min(1, s.t);
        s.m.position.set(s.x0 + (s.x1 - s.x0) * t, 1.4 + 3 * t * (1 - t), s.z0 + (s.z1 - s.z0) * t);
        if (t < 1) continue;
        s.an = false;
        s.m.visible = false;
        herzRegen(s.x1, s.z1, 5);
        for (const k of kunden) if (k.zustand === 'kommt' && Math.hypot(k.pos.x - s.x1, k.pos.z - s.z1) < SNACK.radius) bekehre(k);
      }

      // Welle geschafft? Kurze Pause, dann die nächste; nach der letzten das Ergebnis
      if (zuKommen === 0 && !kunden.some((k) => k.zustand === 'kommt')) {
        if ((pauseIn += dt) < 2) return;
        pauseIn = 0;
        if (++welle < WELLEN.length) { zuKommen = WELLEN[welle]; spawnIn = 1; ui.toast(`Welle ${welle + 1} kommt!`, 2000); return; }
        const gesamt = WELLEN.reduce((a, b) => a + b, 0), bonus = drin === 0 ? 15 : 0;
        if (bonus) missionen.punkteDazu(bonus);
        abzeichen?.zaehle('blaster');
        if (!drin) abzeichen?.zaehle('perfekt');
        ton.richtig();
        ende(`Geschafft! ${froh} von ${gesamt} Kund:innen glücklich gemacht. +${punkte + bonus} Punkte${bonus ? ' (mit Bonus: niemand blieb grummelig)' : ''}.`);
      }
    },
  };
}
