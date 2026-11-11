// Figuren-Baukasten: baut jede Figur aus einem Steckbrief (src/daten.js).
// Kopf = 1 Einheit, Figur etwa 2,75 Köpfe hoch. Kopf, Augen, Arme und Beine sind eigene
// Gruppen, damit die Animation ohne Skelett auskommt. Jede Gruppe = 1 Mesh (+ Umriss).
import * as THREE from 'three';
import { baueNetz, kugel, kappe, kapsel, zylinder, quader, ring } from './formen.js';
import { FARBE } from './daten.js';

function gruppe(eltern, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  eltern.add(g);
  return g;
}

function frisur(s) {
  if (s.frisur === 'glatze') return [];
  const h = s.haare, liste = [
    [() => kappe(0.565, Math.PI * 0.44), h, [0, 0.02, -0.02], [-0.32, 0, 0]],
    // Stirnsträhnen sitzen deutlich vor dem Gesicht, sonst verschwinden sie im Kopf
    [() => kugel(0.16, 8, 6), h, [-0.2, 0.36, 0.36], [0, 0, 0.4], [1.2, 0.8, 0.9]],
    [() => kugel(0.15, 8, 6), h, [0.04, 0.4, 0.38], [0, 0, -0.2], [1.3, 0.8, 0.9]],
    [() => kugel(0.12, 8, 6), h, [0.25, 0.34, 0.36], [0, 0, -0.5], [1.1, 0.8, 0.9]],
  ];
  if (s.frisur === 'zopf') liste.push([() => kugel(0.2, 10, 8), h, [0, -0.05, -0.62], [0.3, 0, 0], [0.9, 1.3, 0.9]]);
  if (s.frisur === 'dutt') liste.push([() => kugel(0.22, 10, 8), h, [0, 0.52, -0.25]]);
  return liste;
}

export function baueFigur(s) {
  const opt = { umriss: s.umriss, dicke: 0.032, schatten: !s.einfach };
  const wurzel = new THREE.Group();
  const koerper = gruppe(wurzel, 0, 0.74, 0);

  koerper.add(baueNetz([
    [() => zylinder(0.36, 0.34, 0.34, 12), s.hose, [0, 0.06, 0]],
    [() => kapsel(0.4, 0.36, 12), s.shirt, [0, 0.5, 0]],
    ...(s.schild ? [[() => quader(0.17, 0.11, 0.05), s.schild, [-0.16, 0.66, 0.36], [0, -0.35, 0], [1, 1, 1], false]] : []),
    ...(s.schuerze ? [[() => quader(0.6, 0.62, 0.05), 0xf4f4f4, [0, 0.24, 0.42], [0, 0, 0], [1, 1, 1], false]] : []),
  ], opt));

  // Augen: weiße abgeflachte Kugel, dunkle Pupille, kleiner Glanzpunkt (y = Höhe über der Kopfmitte)
  const auge = (x, y = 0) => [
    [() => kugel(0.12, 10, 8), FARBE.weiss, [x, y, 0.45], [0, x * 0.8, 0], [1, 1.2, 0.55], false],
    [() => kugel(0.07, 8, 6), FARBE.pupille, [x * 1.02, y - 0.01, 0.502], [0, x * 0.8, 0], [1, 1.15, 0.5], false],
    [() => kugel(0.024, 6, 4), FARBE.weiss, [x - 0.025, y + 0.035, 0.54], [0, 0, 0], [1, 1, 1], false],
  ];

  // Kopf mit Gesicht und Haaren; Ursprung = Kopfmitte
  const kopf = gruppe(koerper, 0, 1.4, 0);
  kopf.add(baueNetz([
    [() => kugel(0.52, 16, 12), s.haut],
    [() => kugel(0.065, 8, 6), s.haut, [0, -0.07, 0.51], [0, 0, 0], [1, 0.9, 1], false],
    [() => kugel(0.08, 8, 6), FARBE.wange, [-0.3, -0.13, 0.4], [0, -0.6, 0], [1, 0.6, 0.45], false],
    [() => kugel(0.08, 8, 6), FARBE.wange, [0.3, -0.13, 0.4], [0, 0.6, 0], [1, 0.6, 0.45], false],
    [() => ring(0.085, 0.022, Math.PI), FARBE.mund, [0, -0.19, 0.475], [0.25, 0, Math.PI], [1, 1, 1], false],
    ...frisur(s),
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
      [() => kapsel(0.15, 0.14, 10), s.shirt, [seite * 0.02, -0.1, 0]],
      [() => kapsel(0.105, 0.3, 8), s.haut, [seite * 0.03, -0.38, 0]],
      [() => kugel(0.135, 10, 8), s.haut, [seite * 0.03, -0.63, 0.02]],
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
      [() => kapsel(0.15, 0.34, 10), s.hose, [0, -0.33, 0]],
      [() => kugel(0.17, 10, 7), s.schuhe, [0, -0.66, 0.07], [0, 0, 0], [1, 0.62, 1.4]],
    ], opt));
    return g;
  };
  const beinL = bein(1), beinR = bein(-1);

  wurzel.scale.setScalar(s.groesse ?? 1);
  return { wurzel, koerper, kopf, augen, armL, armR, beinL, beinR, basisY: koerper.position.y };
}
