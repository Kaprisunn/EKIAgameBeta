// Leute im Haus: Kund:innen bummeln zwischen Wegpunkten, Kolleg:innen stehen, sitzen oder tragen Ware.
// Sie nutzen den Figuren-Baukasten (vereinfacht: ohne Umriss und echten Schatten) und die vorhandene Kollision.
// Nur die Leute der aktiven Etage werden bewegt; sie hängen an der Etagen-Gruppe und verschwinden mit ihr.
import * as THREE from 'three';
import { baueFigur } from './figuren.js';
import { neueAnimation, animiere, starteWinken } from './animation.js';
import { material, teil, quader } from './formen.js';
import { FARBE } from './daten.js';
import { LEUTE, SPRUECHE } from './leute.js';
import { MISSIONEN } from './lerninhalte.js';

const zufall = (l) => l[Math.floor(Math.random() * l.length)];
const HAUT = [0xf5d0b5, 0xf2c29b, 0xe8b48c, 0xc68a5e, 0x9b6a43, 0x6e4a2f];
const HAARE = [0x2e2522, 0x6b4a2f, 0xc9a35a, 0x9a9a9a, 0xb5532f, 0x1a1a1a];
const FRISUREN = ['kurz', 'zopf', 'dutt', 'glatze'];
const OBERTEILE = [0x7fb3d5, 0x9bc48b, 0xe8a87c, 0xb9a6d9, 0xd9483b, 0xf0e0c0, 0x5a7d9a, 0xc96b8a];
const HOSEN = [0x4a5a78, 0x3a3f47, 0x8c7a5b, 0x2b3550];
const RADIUS = 0.4, ABSTAND = 0.95, BLASE_ZEIT = 2.8;
const FLECK = new THREE.MeshBasicMaterial({ color: 0x1f2a36, transparent: true, opacity: 0.2, depthWrite: false });

// Kleiderordnung: Verkauf gelb gestreift, alle anderen Abteilungen blau gestreift (Restaurant mit Schürze,
// Logistik mit Warnweste, ComIn meist mit langen Haaren). Kund:innen in Freizeitkleidung, Ältere teils mit Bart.
function steckbrief(kollege, rolle) {
  const blau = rolle !== 'verkauf', shirt = !kollege ? zufall(OBERTEILE) : blau ? FARBE.blau : FARBE.gelb;
  const haare = zufall(HAARE), frisur = kollege && rolle === 'comin' ? zufall(['zopf', 'dutt', 'zopf', 'kurz']) : zufall(FRISUREN);
  return {
    haut: zufall(HAUT), haare, frisur, shirt, schuhe: FARBE.umriss,
    streifen: kollege ? (blau ? 0x003a75 : 0xd9a400) : null,
    hose: kollege ? (rolle === 'logistik' ? 0x1e2f55 : 0x2b2b30) : zufall(HOSEN),
    schild: kollege ? (blau ? FARBE.gelb : FARBE.blau) : null, schuerze: kollege && rolle === 'gastro', weste: kollege && rolle === 'logistik',
    bart: haare === 0x9a9a9a && (frisur === 'kurz' || frisur === 'glatze') && Math.random() < 0.6,
    tasche: !kollege && Math.random() < 0.5 ? zufall([FARBE.gelb, FARBE.blau]) : null,
    groesse: 0.9 + Math.random() * 0.14, umriss: false, einfach: true,
  };
}

// Kund:in mit Frage folgt dem Spieler kurz (höchstens 10 s) und bleibt in 1,6 Einheiten Abstand stehen
function folge(n, dt, sp) {
  const d = Math.hypot(n.pos.x - sp.x, n.pos.z - sp.z);
  if (d > 9) n.folgen = 0;
  if (d > 6 || n.folgen > 10) return;
  n.folgen += dt;
  if (d > 1.6) { n.ziel = [sp.x, sp.z]; n.warte = 0; } else { n.warte = 0.3; n.dreh = Math.atan2(sp.x - n.pos.x, sp.z - n.pos.z); }
}

function person(gruppe, typ, x, z, dreh, rolle = 'verkauf') {
  const f = baueFigur(steckbrief(typ !== 'kunde', rolle));
  f.wurzel.position.set(x, 0, z);
  f.wurzel.rotation.y = dreh;
  gruppe.add(f.wurzel);
  return { f, typ, rolle, pos: f.wurzel.position, dreh, dreh0: dreh, anim: neueAnimation(), warte: Math.random() * 3,
    tempo: 2 + Math.random() * 1.2, pruef: 0, rest: Infinity, blaseIn: Math.random() * 6, winkIn: 0, folgen: 0 };
}

// Kolleg:in am Schreibtisch: Hüfte auf Stuhlhöhe, Beine nach vorn, Hände tippen
function sitzen(n) {
  const f = n.f, t = n.anim.t;
  f.beinL.rotation.x = f.beinR.rotation.x = -1.45;
  f.armL.rotation.x = -0.8 + Math.sin(t * 9) * 0.05;
  f.armR.rotation.x = -0.8 + Math.sin(t * 9 + 2) * 0.05;
}

export function erstelleLeute(welt) {
  const etagen = {}, missionsLeute = {};
  for (const [id, d] of Object.entries(LEUTE)) {
    const gruppe = welt.etagen[id].gruppe, liste = [];
    for (let i = 0; i < d.kunden; i++) {
      const [x, z] = zufall(d.wege), n = person(gruppe, 'kunde', x, z, Math.random() * 6);
      n.ziel = zufall(d.wege);
      liste.push(n);
    }
    for (const [x, z, dreh, haltung, rolle] of d.kollegen) {
      const n = person(gruppe, 'kollege', x, z, dreh, rolle);
      if (haltung === 'sitzt') { n.sitzt = true; n.pos.y = -0.27; }
      liste.push(n);
    }
    for (const l of d.laeufer) {
      const n = person(gruppe, 'laeufer', l.weg[0][0], l.weg[0][1], 0, l.rolle);
      Object.assign(n, { weg: l.weg, index: 1, ziel: l.weg[1], traegt: true, tempo: 2.4 });
      n.kiste = new THREE.Mesh(teil(quader(0.62, 0.45, 0.5), FARBE.karton), material('bunt'));
      n.kiste.position.set(0, 0.45, 0.55);
      n.f.koerper.add(n.kiste);
      liste.push(n);
    }
    // Personen der Lern-Missionen (lerninhalte.js): Kund:innen warten, bis ihnen geholfen ist
    for (const mi of MISSIONEN.filter((x) => x.etage === id && x.person)) {
      const [x, z, dreh] = mi.ort, n = person(gruppe, mi.person, x, z, dreh, mi.rolle);
      if (n.typ === 'kunde') { n.steht = true; n.ziel = zufall(d.wege); }
      n.mission = mi.id;
      missionsLeute[mi.id] = n;
      liste.push(n);
    }
    const flecken = new THREE.InstancedMesh(new THREE.CircleGeometry(0.5, 14).rotateX(-Math.PI / 2), FLECK, liste.length);
    flecken.frustumCulled = false;
    gruppe.add(flecken);
    etagen[id] = { liste, d, flecken, fragerIn: 2 };
  }

  const m = new THREE.Matrix4();
  let aktiv = null, blase = null;

  // Geht ein Stück Richtung Ziel; liefert die Laufgeschwindigkeit (0..1) für die Animation
  function bewege(n, dt, d, spieler) {
    if (n.warte > 0) { n.warte -= dt; return 0; }
    const dx = n.ziel[0] - n.pos.x, dz = n.ziel[1] - n.pos.z, abst = Math.hypot(dx, dz);
    if (abst < 0.35) {
      if (n.typ === 'laeufer') {
        n.index = 1 - n.index;
        n.ziel = n.weg[n.index];
        n.traegt = n.index === 1;
        n.warte = 2.5;
      } else {
        n.ziel = zufall(d.wege);
        n.warte = 1.5 + Math.random() * 5;
      }
      n.rest = Infinity;
      return 0;
    }
    const s = Math.min(abst, n.tempo * dt);
    n.pos.x += (dx / abst) * s;
    n.pos.z += (dz / abst) * s;
    // dem Spieler ausweichen, dann aus Möbeln herausschieben
    const px = n.pos.x - spieler.x, pz = n.pos.z - spieler.z, pd = Math.hypot(px, pz);
    if (pd < ABSTAND && pd > 1e-4) { n.pos.x += (px / pd) * (ABSTAND - pd); n.pos.z += (pz / pd) * (ABSTAND - pd); }
    welt.schiebeRaus(n.pos, RADIUS);
    n.dreh = Math.atan2(dx, dz);
    // Steckengeblieben? Alle 1,5 s prüfen, ob es vorangeht, sonst ein neues Ziel wählen
    n.pruef += dt;
    if (n.pruef > 1.5) {
      if (abst > n.rest - 0.5 && n.typ === 'kunde') n.ziel = zufall(d.wege);
      n.rest = abst;
      n.pruef = 0;
    }
    return n.tempo / 6.5;
  }

  return {
    // Sprechblase der Person in der Nähe: { text, x, y, z } (Kopfhöhe) oder null
    get blase() {
      if (!blase) return null;
      const p = blase.n.pos;
      return { text: blase.text, x: p.x, y: p.y + 3.0 * blase.n.f.wurzel.scale.y, z: p.z };
    },
    update(dt, id, spieler) {
      const e = etagen[id];
      if (!e) return;
      aktiv = e;
      // Höchstens zwei Kund:innen je Etage haben eine Frage (Symbol und Interaktion: kundenfragen.js)
      if ((e.fragerIn -= dt) <= 0) {
        e.fragerIn = 15;
        const frei = e.liste.filter((n) => n.typ === 'kunde' && !n.steht && !n.mission && !n.frage);
        if (e.liste.filter((n) => n.frage).length < 2 && frei.length) zufall(frei).frage = true;
      }
      e.liste.forEach((n, i) => {
        if (n.frage) folge(n, dt, spieler);
        const v = n.typ === 'kollege' || n.steht ? 0 : bewege(n, dt, e.d, spieler);
        let dd = n.dreh - n.f.wurzel.rotation.y;
        dd = Math.atan2(Math.sin(dd), Math.cos(dd));
        n.f.wurzel.rotation.y += dd * (1 - Math.exp(-8 * dt));
        if (n.winkIn > 0 && (n.winkIn -= dt) <= 0) starteWinken(n.anim);
        animiere(n.f, n.anim, dt, v);
        if (n.sitzt) sitzen(n);
        if (n.kiste) {
          n.kiste.visible = n.traegt;
          if (n.traegt) n.f.armL.rotation.x = n.f.armR.rotation.x = -1.25;
        }
        n.blaseIn -= dt;
        e.flecken.setMatrixAt(i, m.makeTranslation(n.pos.x, 0.03, n.pos.z));
      });
      e.flecken.instanceMatrix.needsUpdate = true;

      // Wer dem Spieler nahe kommt, sagt kurz etwas (pro Person höchstens alle 20 s)
      if (blase && ((blase.zeit -= dt) <= 0 || blase.e !== e)) {
        if (blase.n.typ === 'kollege' && !blase.n.sitzt) blase.n.dreh = blase.n.dreh0;
        blase = null;
      }
      if (!blase) {
        let beste = null, bd = 2.8;
        for (const n of e.liste) {
          const abst = Math.hypot(n.pos.x - spieler.x, n.pos.z - spieler.z);
          if (abst < bd && n.blaseIn <= 0 && !n.mission) { bd = abst; beste = n; }
        }
        if (beste) {
          beste.blaseIn = 20;
          const art = beste.typ === 'kunde' ? 'kunden' : beste.rolle === 'logistik' ? 'logistik' : 'kollegen';
          blase = { n: beste, e, zeit: BLASE_ZEIT, text: zufall(SPRUECHE[art]) };
          if (beste.typ === 'kollege' && !beste.sitzt) beste.dreh = Math.atan2(spieler.x - beste.pos.x, spieler.z - beste.pos.z);
        }
      }
    },
    missionsPerson: (id) => missionsLeute[id] ?? null,
    fragende: (id) => etagen[id]?.liste.filter((n) => n.frage) ?? [],
    // Nach der Hilfe: Symbol weg, Dank in der Sprechblase, weiterbummeln
    bedanke(n) {
      n.frage = false;
      n.folgen = 0;
      n.warte = 1;
      if (aktiv) { n.ziel = zufall(aktiv.d.wege); blase = { n, e: aktiv, zeit: BLASE_ZEIT, text: 'Danke, super Hilfe!' }; }
    },
    // Stehende und sitzende Personen sind feste Hindernisse für den Spieler
    schiebeSpieler(p) {
      for (const n of aktiv?.liste ?? []) {
        if (n.typ !== 'kollege' && !n.steht) continue;
        const dx = p.x - n.pos.x, dz = p.z - n.pos.z, d = Math.hypot(dx, dz);
        if (d < ABSTAND && d > 1e-4) { p.x += (dx / d) * (ABSTAND - d); p.z += (dz / d) * (ABSTAND - d); }
      }
    },
    // Spieler winkt: Leute in der Nähe winken meistens zurück
    winken(p) {
      for (const n of aktiv?.liste ?? []) {
        if (n.sitzt || n.traegt || Math.hypot(n.pos.x - p.x, n.pos.z - p.z) > 6 || Math.random() < 0.25) continue;
        n.winkIn = 0.2 + Math.random() * 0.5;
      }
    },
  };
}
