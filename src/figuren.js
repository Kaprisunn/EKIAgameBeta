// Figuren-Baukasten: baut jede Figur aus einem Steckbrief (src/daten.js).
// Kopf = 1 Einheit, Figur etwa 2,75 Köpfe hoch. Kopf, Augen, Arme und Beine sind eigene
// Gruppen, damit die Animation ohne Skelett auskommt. Jede Gruppe = 1 Mesh (+ Umriss).
import * as THREE from 'three';
import { baueNetz, kugel, kappe, kapsel, zylinder, quader, ring } from './formen.js';
import { FARBE, WESTE } from './daten.js';

function gruppe(eltern, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  eltern.add(g);
  return g;
}

// Unterteilung: Nebenfiguren (einfach) mit weniger Dreiecken, aus der Diorama-Höhe kaum zu sehen
let fein = 1;
const n = (k) => Math.max(3, Math.round(k * fein));

function frisur(s) {
  if (s.frisur === 'glatze') return [];
  const h = s.haare, liste = [
    [() => kappe(0.565, Math.PI * 0.44, n(14)), h, [0, 0.02, -0.02], [-0.32, 0, 0]],
    // Stirnsträhnen sitzen deutlich vor dem Gesicht, sonst verschwinden sie im Kopf
    [() => kugel(0.16, n(8), n(6)), h, [-0.2, 0.36, 0.36], [0, 0, 0.4], [1.2, 0.8, 0.9]],
    [() => kugel(0.15, n(8), n(6)), h, [0.04, 0.4, 0.38], [0, 0, -0.2], [1.3, 0.8, 0.9]],
    [() => kugel(0.12, n(8), n(6)), h, [0.25, 0.34, 0.36], [0, 0, -0.5], [1.1, 0.8, 0.9]],
  ];
  if (s.frisur === 'zopf') liste.push([() => kugel(0.2, n(10), n(8)), h, [0, -0.05, -0.62], [0.3, 0, 0], [0.9, 1.3, 0.9]]);
  if (s.frisur === 'dutt') liste.push([() => kugel(0.22, n(10), n(8)), h, [0, 0.52, -0.25]]);
  return liste;
}

export function baueFigur(s) {
  fein = s.einfach ? 0.6 : 1;
  const opt = { umriss: s.umriss, dicke: 0.032, schatten: !s.einfach };
  const wurzel = new THREE.Group();
  const koerper = gruppe(wurzel, 0, 0.74, 0);

  koerper.add(baueNetz([
    [() => zylinder(0.36, 0.34, 0.34, n(12)), s.hose, [0, 0.06, 0]],
    [() => kapsel(0.4, 0.36, n(12)), s.shirt, [0, 0.5, 0]],
    ...(s.schild ? [[() => quader(0.17, 0.11, 0.05), s.schild, [-0.16, 0.66, 0.36], [0, -0.35, 0], [1, 1, 1], false]] : []),
    // Streifen-Shirt: drei schmale, dunklere Ringe um den Oberkörper
    ...(s.streifen ? [0.36, 0.5, 0.64].map((y) => [() => zylinder(0.406, 0.406, 0.065, n(14)), s.streifen, [0, y, 0], [0, 0, 0], [1, 1, 1], false]) : []),
    // Warnweste: leuchtend gelbe Hülle mit zwei Reflexstreifen über dem Shirt
    ...(s.weste ? [[() => zylinder(0.432, 0.43, 0.56, n(14)), WESTE.grund, [0, 0.5, 0], [0, 0, 0], [1, 1, 1], false],
      [() => zylinder(0.437, 0.437, 0.06, n(14)), WESTE.reflex, [0, 0.4, 0], [0, 0, 0], [1, 1, 1], false],
      [() => zylinder(0.437, 0.437, 0.06, n(14)), WESTE.reflex, [0, 0.6, 0], [0, 0, 0], [1, 1, 1], false]] : []),
    ...(s.schuerze ? [[() => quader(0.6, 0.62, 0.05), 0xf4f4f4, [0, 0.24, 0.42], [0, 0, 0], [1, 1, 1], false]] : []),
  ], opt));

  // Augen: weiße abgeflachte Kugel, dunkle Pupille, kleiner Glanzpunkt (y = Höhe über der Kopfmitte)
  const auge = (x, y = 0) => [
    [() => kugel(0.12, n(10), n(8)), FARBE.weiss, [x, y, 0.45], [0, x * 0.8, 0], [1, 1.2, 0.55], false],
    [() => kugel(0.07, n(8), n(6)), FARBE.pupille, [x * 1.02, y - 0.01, 0.502], [0, x * 0.8, 0], [1, 1.15, 0.5], false],
    [() => kugel(0.024, n(6), n(4)), FARBE.weiss, [x - 0.025, y + 0.035, 0.54], [0, 0, 0], [1, 1, 1], false],
  ];

  // Kopf mit Gesicht und Haaren; Ursprung = Kopfmitte
  const kopf = gruppe(koerper, 0, 1.4, 0);
  kopf.add(baueNetz([
    [() => kugel(0.52, n(16), n(12)), s.haut],
    [() => kugel(0.065, n(8), n(6)), s.haut, [0, -0.07, 0.51], [0, 0, 0], [1, 0.9, 1], false],
    [() => kugel(0.08, n(8), n(6)), FARBE.wange, [-0.3, -0.13, 0.4], [0, -0.6, 0], [1, 0.6, 0.45], false],
    [() => kugel(0.08, n(8), n(6)), FARBE.wange, [0.3, -0.13, 0.4], [0, 0.6, 0], [1, 0.6, 0.45], false],
    [() => ring(0.085, 0.022, Math.PI), FARBE.mund, [0, -0.19, 0.475], [0.25, 0, Math.PI], [1, 1, 1], false],
    // Ohren und Augenbrauen (Brauen in Haarfarbe, deutlich vor der Stirn)
    [() => kugel(0.11, n(8), n(6)), s.haut, [-0.5, -0.02, -0.02], [0, 0, 0], [0.6, 1, 0.8]],
    [() => kugel(0.11, n(8), n(6)), s.haut, [0.5, -0.02, -0.02], [0, 0, 0], [0.6, 1, 0.8]],
    [() => quader(0.17, 0.045, 0.05), s.haare, [-0.19, 0.25, 0.44], [0, -0.35, 0.12], [1, 1, 1], false],
    [() => quader(0.17, 0.045, 0.05), s.haare, [0.19, 0.25, 0.44], [0, 0.35, -0.12], [1, 1, 1], false],
    ...frisur(s),
    // Vollbart (deutlich vor dem Gesicht) mit Schnurrbart
    ...(s.bart ? [[() => kugel(0.34, n(12), n(9)), s.haare, [0, -0.47, 0.2], [0, 0, 0], [1.15, 0.8, 0.7]],
      [() => kugel(0.1, n(8), n(6)), s.haare, [-0.1, -0.13, 0.47], [0, 0, 0.3], [1.3, 0.6, 0.7], false],
      [() => kugel(0.1, n(8), n(6)), s.haare, [0.1, -0.13, 0.47], [0, 0, -0.3], [1.3, 0.6, 0.7], false]] : []),
    // Vereinfachte Figuren (Nebenfiguren): Augen direkt im Kopf, spart einen Draw Call
    ...(s.einfach ? [...auge(-0.19, 0.07), ...auge(0.19, 0.07)] : []),
  ], opt));

  // Augen-Gruppe wird zum Blinzeln gestaucht (bei vereinfachten Figuren leer)
  const augen = gruppe(kopf, 0, 0.07, 0);
  if (!s.einfach) augen.add(baueNetz([...auge(-0.19), ...auge(0.19)], { schatten: false }));

  // Arme: Drehpunkt an der Schulter; Ärmel in Shirtfarbe, Unterarm und Hand in Hautfarbe
  const arm = (seite) => {
    const g = gruppe(koerper, seite * 0.46, 0.84, 0);
    g.add(baueNetz([
      [() => kapsel(0.15, 0.14, n(10)), s.shirt, [seite * 0.02, -0.1, 0]],
      [() => kapsel(0.105, 0.3, n(8)), s.haut, [seite * 0.03, -0.38, 0]],
      [() => kugel(0.135, n(10), n(8)), s.haut, [seite * 0.03, -0.63, 0.02]],
      // Einkaufstasche in der rechten Hand (nur Kund:innen)
      ...(seite < 0 && s.tasche ? [[() => quader(0.36, 0.42, 0.16), s.tasche, [-0.05, -0.92, 0.02], [0, 0, 0], [1, 1, 1], false],
        [() => quader(0.04, 0.22, 0.04), s.tasche, [-0.05, -0.66, 0.02], [0, 0, 0], [1, 1, 1], false]] : []),
    ], opt));
    return g;
  };
  const armL = arm(1), armR = arm(-1);

  // Beine: Drehpunkt an der Hüfte
  const bein = (seite) => {
    const g = gruppe(wurzel, seite * 0.17, 0.76, 0);
    g.add(baueNetz([
      [() => kapsel(0.15, 0.34, n(10)), s.hose, [0, -0.33, 0]],
      [() => kugel(0.17, n(10), n(7)), s.schuhe, [0, -0.66, 0.07], [0, 0, 0], [1, 0.62, 1.4]],
      // Sohle (Mitarbeiter:innen: rot) und Cargo-Seitentasche (Logistik)
      [() => quader(0.3, 0.05, 0.46), s.sohle ?? s.schuhe, [0, -0.745, 0.07], [0, 0, 0], [1, 1, 1], false],
      ...(s.cargo ? [[() => quader(0.07, 0.17, 0.2), 0x16233f, [seite * 0.155, -0.3, 0.02], [0, 0, 0], [1, 1, 1], false]] : []),
    ], opt));
    return g;
  };
  const beinL = bein(1), beinR = bein(-1);

  wurzel.scale.setScalar(s.groesse ?? 1);
  return { wurzel, koerper, kopf, augen, armL, armR, beinL, beinR, basisY: koerper.position.y };
}
