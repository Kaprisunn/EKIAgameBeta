// Baut eine Etage aus den Kartendaten (karte.js): Boden, Wände, Möbel, Zäune, Schranke, Pfeile, Schilder.
// Unbewegte Einzelstücke werden zu EINEM Mesh verschmolzen, häufige Möbel als InstancedMesh gebaut.
import * as THREE from 'three';
import { material, teil, verschmelzen, baueViele, quader, zylinder } from './formen.js';
import { MOEBEL } from './moebel.js';
import { MOEBEL_OG } from './moebel-og.js';
import { MOEBEL_DEKO } from './moebel-deko.js';
import { MOEBEL_AUSSEN } from './moebel-aussen.js';
import { FARBE as F, HALLE } from './daten.js';

const ALLE = { ...MOEBEL, ...MOEBEL_OG, ...MOEBEL_DEKO, ...MOEBEL_AUSSEN };
const GLAS = new THREE.MeshBasicMaterial({ color: 0xcfe9f7, transparent: true, opacity: 0.5, depthWrite: false });
const B = HALLE.breite / 2, T = HALLE.tiefe / 2, m4 = new THREE.Matrix4();
const Q = (b, h, t) => () => quader(b, h, t);

// Legt eine Teile-Liste an (x, z) mit Drehung um die Hochachse in die Sammelliste
function lege(ziel, teile, x, z, dreh = 0) {
  m4.makeRotationY(dreh).setPosition(x, 0, z);
  for (const [mach, farbe, pos, rot, skal] of teile) ziel.push(teil(mach(), farbe, pos, rot, skal).applyMatrix4(m4));
}

// Kollisionskasten [breite, tiefe, dx, dz], gedreht in Vielfachen von 90°
function kasten(kaesten, x, z, dreh, [b, t, dx = 0, dz = 0]) {
  const c = Math.round(Math.cos(dreh)), s = Math.round(Math.sin(dreh));
  const mx = x + dx * c + dz * s, mz = z - dx * s + dz * c, [hb, ht] = s ? [t / 2, b / 2] : [b / 2, t / 2];
  kaesten.push([mx - hb, mz - ht, mx + hb, mz + ht]);
}

// Facettierter Boden: Fliesen (EG) oder Dielen (OG), leicht gefleckt
function boden(def) {
  const geo = new THREE.PlaneGeometry(HALLE.breite, HALLE.tiefe, HALLE.breite / 2, HALLE.tiefe / 2).toNonIndexed();
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position, farben = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    const mx = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, mz = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    if (def.aussen) {
      // Parkplatz: heller Gehweg vor der Fassade, sonst Asphalt mit leichter Körnung
      c.set(mz < def.gehweg ? 0xb9bcc0 : def.boden).multiplyScalar(0.95 + Math.random() * 0.07);
    } else {
      const muster = def.dielen ? Math.floor(mz / 2) % 2 : (Math.floor(mx / 2) + Math.floor(mz / 2)) % 2;
      c.set(def.boden).multiplyScalar((muster ? (def.dielen ? 0.9 : 0.95) : 1) * (0.975 + Math.random() * 0.035));
    }
    for (let j = 0; j < 3; j++) farben.set([c.r, c.g, c.b], (i + j) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  const netz = new THREE.Mesh(geo, material('facette'));
  netz.position.y = 0.01;
  netz.receiveShadow = true;
  return netz;
}

// Diorama-Platte, Rückwand und Seitenwände (Südseite offen); im OG ein blauer Gebäudesockel darunter
function waende(def, statisch, kaesten) {
  const h = HALLE.wandHoehe, d = HALLE.wandDicke, band = 0.7;
  const wand = (x, z, b, t) => [[Q(b, h - band, t), F.wand, [x, (h - band) / 2, z]], [Q(b + 0.06, band, t + 0.06), F.blau, [x, h - band / 2, z]]];
  // Parkplatz: nur die blaue Hausfassade im Norden (höher, mit gelbem Band), keine Seitenwände
  const fassade = [[Q(HALLE.breite + 2 * d, 6, d), F.blau, [0, 3, -T - d / 2]], [Q(HALLE.breite + 2 * d + 0.06, 0.5, d + 0.06), F.gelb, [0, 5.75, -T - d / 2]]];
  const teile = [
    [Q(HALLE.breite + 1.2, 0.8, HALLE.tiefe + 1.2), F.birke, [0, -0.4, 0]],
    [Q(HALLE.breite + 1.3, 0.12, HALLE.tiefe + 1.3), F.birkeDunkel, [0, -0.06, 0]],
    ...(def.aussen ? fassade : [...wand(0, -T - d / 2, HALLE.breite + 2 * d, d), ...wand(-B - d / 2, 0, d, HALLE.tiefe), ...wand(B + d / 2, 0, d, HALLE.tiefe)]),
  ];
  if (def.sockel) teile.push([Q(HALLE.breite + 1.2, def.sockel, HALLE.tiefe + 1.2), F.blau, [0, -0.8 - def.sockel / 2, 0]]);
  lege(statisch, teile, 0, 0);
  kaesten.push([-B - 2, -T - 2, B + 2, -T], [-B - 2, -T, -B, T + 2], [B, -T, B + 2, T + 2], [-B, T - 0.6, B, T + 2]);
}

// Weiße Parklinie von (x1, z1) nach (x2, z2)
function linie(statisch, [x1, z1, x2, z2]) {
  lege(statisch, [[Q(0.12, 0.02, Math.hypot(x2 - x1, z2 - z1)), F.weiss, [0, 0.025, 0]]], (x1 + x2) / 2, (z1 + z2) / 2, Math.atan2(x2 - x1, z2 - z1));
}

// Glasschiebetür: zwei Glasflügel in einem Rahmen (Möbeltyp „tor“), die zur Seite gleiten, wenn jemand davorsteht
function schiebetuer(gruppe, { x, z, dreh = 0 }) {
  const halter = new THREE.Group(), geo = new THREE.BoxGeometry(2.0, 2.9, 0.08);
  const links = new THREE.Mesh(geo, GLAS), rechts = new THREE.Mesh(geo, GLAS);
  links.position.set(-1, 1.45, 0);
  rechts.position.set(1, 1.45, 0);
  halter.position.set(x, 0, z);
  halter.rotation.y = dreh;
  halter.add(links, rechts);
  gruppe.add(halter);
  return { x, z, links, rechts, auf: 0 };
}

// Gelb-schwarzer Zaun von (x1, z1) nach (x2, z2), achsenparallel
function zaun(statisch, kaesten, [x1, z1, x2, z2]) {
  const l = Math.hypot(x2 - x1, z2 - z1), n = Math.max(1, Math.round(l / 2));
  const teile = [[Q(0.08, 0.08, l), F.gelb, [0, 1.1, 0]], [Q(0.06, 0.06, l), F.schwarz, [0, 0.6, 0]], [Q(0.04, 0.18, l), F.gelb, [0, 0.12, 0]]];
  for (let i = 0; i <= n; i++) teile.push([() => zylinder(0.06, 0.06, 1.15, 6), i % 2 ? F.schwarz : F.gelb, [0, 0.575, -l / 2 + (i * l) / n]]);
  lege(statisch, teile, (x1 + x2) / 2, (z1 + z2) / 2, Math.atan2(x2 - x1, z2 - z1));
  kaesten.push([Math.min(x1, x2) - 0.15, Math.min(z1, z2) - 0.15, Math.max(x1, x2) + 0.15, Math.max(z1, z2) + 0.15]);
}

// Niedrige Trennwand aus Birkenholz (Umkleide, Büro) von (x1, z1) nach (x2, z2)
function trennwand(statisch, kaesten, [x1, z1, x2, z2]) {
  const l = Math.hypot(x2 - x1, z2 - z1);
  lege(statisch, [[Q(0.2, 2.4, l), F.birke, [0, 1.2, 0]], [Q(0.24, 0.12, l), F.blau, [0, 2.44, 0]]], (x1 + x2) / 2, (z1 + z2) / 2, Math.atan2(x2 - x1, z2 - z1));
  kaesten.push([Math.min(x1, x2) - 0.12, Math.min(z1, z2) - 0.12, Math.max(x1, x2) + 0.12, Math.max(z1, z2) + 0.12]);
}

// Kollisionskasten des geschlossenen Schrankenarms
function sperrKasten({ x, z, laenge, dreh = 0 }) {
  const x2 = x + laenge * Math.cos(dreh), z2 = z - laenge * Math.sin(dreh);
  return [Math.min(x, x2) - 0.25, Math.min(z, z2) - 0.25, Math.max(x, x2) + 0.25, Math.max(z, z2) + 0.25];
}

// Schranke mit Portal; der Arm ist ein eigenes Mesh, damit er sich heben kann
function schranke(gruppe, statisch, { x, z, laenge, dreh = 0 }) {
  lege(statisch, [
    [Q(0.3, 1.1, 0.3), F.gelb, [0, 0.55, 0]], [Q(0.25, 3.2, 0.25), F.gelb, [-0.35, 1.6, 0]],
    [Q(0.25, 3.2, 0.25), F.gelb, [laenge + 0.35, 1.6, 0]], [Q(laenge + 1, 0.35, 0.3), F.gelb, [laenge / 2, 3.1, 0]],
  ], x, z, dreh);
  const arm = [];
  for (let i = 0; i < 4; i++) arm.push(teil(quader(laenge / 4, 0.12, 0.12), i % 2 ? F.schwarz : F.gelb, [(i + 0.5) * laenge / 4, 0, 0]));
  const netz = new THREE.Mesh(verschmelzen(arm), material('bunt'));
  netz.castShadow = true;
  const drehpunkt = new THREE.Group();
  drehpunkt.position.set(x, 1.0, z);
  drehpunkt.rotation.y = dreh;
  drehpunkt.add(netz);
  gruppe.add(drehpunkt);
  return netz;
}

// Gelbe Pfeile entlang des Weges (Abstand etwa 2,6 Einheiten)
function pfeile(weg = []) {
  const stellen = [];
  for (let i = 0; i < weg.length - 1; i++) {
    const [x1, z1] = weg[i], [x2, z2] = weg[i + 1], dx = x2 - x1, dz = z2 - z1, l = Math.hypot(dx, dz);
    for (let s = 1.3; s < l; s += 2.6) stellen.push([x1 + dx * s / l, z1 + dz * s / l, Math.atan2(dx, dz)]);
  }
  return baueViele([[Q(0.2, 0.02, 0.5), F.gelb, [0, 0, -0.25]], [() => zylinder(0.32, 0.32, 0.02, 3), F.gelb, [0, 0, 0.1]]], stellen, { schatten: false, y: 0.025 });
}

export function baueEtage(id, def, schilder) {
  const gruppe = new THREE.Group(), kaesten = [], statisch = [];
  gruppe.add(boden(def));
  waende(def, statisch, kaesten);

  const nachTyp = {};
  for (const [typ, x, z, dreh = 0] of def.moebel) (nachTyp[typ] ??= []).push([x, z, dreh]);
  for (const [typ, stellen] of Object.entries(nachTyp)) {
    const m = ALLE[typ];
    if (!m) throw new Error('Unbekanntes Möbel in karte.js: ' + typ);
    if (m.viele && stellen.length > 2) gruppe.add(baueViele(m.teile, stellen, { farben: m.farben }));
    else stellen.forEach(([x, z, dreh]) => lege(statisch, m.teile, x, z, dreh));
    stellen.forEach(([x, z, dreh]) => (m.fuss ?? []).forEach((f) => kasten(kaesten, x, z, dreh, f)));
  }
  (def.zaeune ?? []).forEach((s) => zaun(statisch, kaesten, s));
  (def.trennwaende ?? []).forEach((w) => trennwand(statisch, kaesten, w));
  (def.linien ?? []).forEach((l) => linie(statisch, l));
  const tueren = (def.tueren ?? []).map((t) => schiebetuer(gruppe, t));
  const s = def.schranke, arm = s ? schranke(gruppe, statisch, s) : null;
  const schildNetz = schilder.baue(def.schilder, statisch);

  const netz = new THREE.Mesh(verschmelzen(statisch), material('bunt'));
  netz.castShadow = netz.receiveShadow = true;
  gruppe.add(netz, pfeile(def.pfeile), schildNetz);
  const sperre = s && sperrKasten(s);

  return {
    id, def, gruppe, kaesten, punkte: def.punkte ?? [],
    // Kollisionskasten der geschlossenen Schranke (null, wenn offen)
    get sperre() { return arm && arm.rotation.z < 1.0 ? sperre : null; },
    // Schranke öffnet für Logistik; hinaus kommt man immer (innen = abgesperrter Bereich)
    update(dt, pos, rolle) {
      for (const t of tueren) {
        const nah = Math.hypot(pos.x - t.x, pos.z - t.z) < 4;
        t.auf += ((nah ? 1 : 0) - t.auf) * (1 - Math.exp(-8 * dt));
        t.links.position.x = -1 - t.auf * 1.85;
        t.rechts.position.x = 1 + t.auf * 1.85;
      }
      if (!arm) return;
      const nah = Math.hypot(pos.x - (sperre[0] + sperre[2]) / 2, pos.z - (sperre[1] + sperre[3]) / 2) < 3.5;
      const [ix1, iz1, ix2, iz2] = s.innen, drinnen = pos.x > ix1 && pos.x < ix2 && pos.z > iz1 && pos.z < iz2;
      const auf = nah && (rolle === 'logistik' || drinnen);
      arm.rotation.z += ((auf ? 1.35 : 0) - arm.rotation.z) * (1 - Math.exp(-6 * dt));
    },
  };
}
