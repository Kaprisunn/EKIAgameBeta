// Möbel-Baukasten für das Erdgeschoss und die Technik (Treppe, Aufzug, Tore).
// Jeder Typ: `teile` relativ zum Ursprung (Vorderseite zeigt nach +z), `fuss` = Kollisionskästen
// [breite, tiefe, dx, dz], `viele` = ab 3 Stück als InstancedMesh (ein Draw Call für alle).
import { quader, zylinder, kugel } from './formen.js';
import { FARBE as F } from './daten.js';

const Q = (b, h, t) => () => quader(b, h, t);
const Z = (ro, ru, h, n = 8) => () => zylinder(ro, ru, h, n);
const K = (r, w = 8, h = 6) => () => kugel(r, w, h);
const QUER = [0, 0, Math.PI / 2];
const WARE = [F.blau, F.gelb, F.orange, F.decke, F.sofa, F.weiss, F.wange, F.pflanzeHell];

function hochregal() {
  const t = [];
  for (const z of [-3.4, 0, 3.4]) for (const x of [-0.85, 0.85]) t.push([Q(0.12, 3.6, 0.12), F.blau, [x, 1.8, z]]);
  for (const y of [1.2, 2.4, 3.5]) for (const x of [-0.85, 0.85]) t.push([Q(0.1, 0.16, 7), F.orange, [x, y, 0]]);
  for (const y of [1.2, 2.4]) t.push([Q(1.7, 0.06, 6.9), F.grau, [0, y + 0.05, 0]]);
  [0, 1.28, 2.48].forEach((y, e) => [-2.3, 0, 2.3].forEach((z, i) => {
    const h = 0.6 + ((i + e) % 3) * 0.2;
    t.push([Q(1.4, h, 1.9), (i + e) % 2 ? F.karton : F.kartonHell, [0, y + h / 2, z]]);
  }));
  return t;
}

// Niedriges Markthallen-Regal mit bunter Ware auf beiden Seiten
function marktregal() {
  const t = [[Q(1.2, 0.15, 4), F.birkeDunkel, [0, 0.075, 0]], [Q(0.08, 1.3, 4), F.birke, [0, 0.8, 0]]];
  [0.5, 1.0].forEach((y, e) => {
    t.push([Q(1.15, 0.05, 3.9), F.weiss, [0, y, 0]]);
    for (const s of [-1, 1]) for (let i = 0; i < 5; i++) {
      const h = 0.22 + ((i + e + s + 2) % 3) * 0.08;
      t.push([Q(0.42, h, 0.62), WARE[(i * 3 + e * 2 + s + 8) % WARE.length], [s * 0.3, y + 0.025 + h / 2, -1.6 + i * 0.8]]);
    }
  });
  return t;
}

function wuehltisch() {
  const kissen = [F.blau, F.gelb, F.sofa, F.decke, F.weiss, F.orange].map((farbe, i) => [Q(0.62, 0.22, 0.62), farbe,
    [-1 + (i % 3) * 0.75, 0.82 + Math.floor(i / 3) * 0.23, -0.3 + Math.floor(i / 3) * 0.35], [0, i * 0.3, 0]]);
  return [[Q(3.2, 0.7, 2), F.birke, [0, 0.35, 0]], ...kissen,
    [Z(0.03, 0.03, 1.4, 6), F.dunkelgrau, [1.3, 1.1, 0.7]], [Q(0.7, 0.45, 0.06), F.gelb, [1.3, 1.9, 0.7]]];
}

function fundgrube() {
  const stuhl = (x, z, kipp) => [
    [Q(0.6, 0.08, 0.6), F.birke, [x, 0.75, z], [0, 0, kipp]], [Q(0.6, 0.7, 0.08), F.birke, [x, 1.1, z - 0.27], [0, 0, kipp]],
    [Q(0.4, 0.45, 0.4), F.weiss, [x, 0.52, z]], [Q(0.22, 0.3, 0.02), F.gelb, [x + 0.15, 1.1, z - 0.22]],
  ];
  return [[Q(4.6, 0.3, 3.6), F.birkeDunkel, [0, 0.15, 0]], ...stuhl(-1.2, 0.8, 0.12), ...stuhl(0.1, 1.0, -0.08),
    [Q(1.4, 0.08, 0.9), F.birke, [1.4, 1.0, -0.8], [0.05, 0, 0.04]], [Q(1.2, 0.7, 0.7), F.weiss, [1.4, 0.65, -0.8]],
    [Q(0.25, 0.35, 0.02), F.gelb, [1.8, 0.8, -0.44]], [Q(1.0, 1.4, 0.5), F.sofa, [-1.1, 1.0, -1.3]],
    [Q(0.25, 0.35, 0.02), F.gelb, [-0.9, 1.2, -1.04]]];
}

function hotdog() {
  const t = [
    [Q(3, 1.1, 1.2), F.weiss, [0, 0.55, 0]], [Q(3, 0.5, 0.05), F.blau, [0, 0.6, 0.62]], [Q(3.1, 0.08, 1.3), F.birke, [0, 1.14, 0]],
    [Q(3, 2.6, 0.2), F.blau, [0, 1.3, -0.9]], [Q(3.4, 0.15, 2.2), F.gelb, [0, 2.75, -0.1]],
    [Z(0.06, 0.06, 2.7), F.weiss, [-1.45, 1.35, 0.55]], [Z(0.06, 0.06, 2.7), F.weiss, [1.45, 1.35, 0.55]],
    [Z(0.07, 0.07, 0.3), F.rot, [0.8, 1.33, 0.2]], [Z(0.07, 0.07, 0.3), F.senf, [1.0, 1.33, 0.2]],
  ];
  for (const x of [-0.6, 0.1]) t.push([Z(0.09, 0.09, 0.42), F.birke, [x, 1.27, 0.1], QUER], [Z(0.05, 0.05, 0.5, 6), F.wurst, [x, 1.33, 0.1], QUER]);
  return t;
}

function stapler() {
  const t = [
    [Q(1.2, 0.8, 1.6), F.gelb, [0, 0.65, -0.1]], [Q(1.2, 0.9, 0.5), F.dunkelgrau, [0, 0.7, -0.95]],
    [Q(0.6, 0.15, 0.5), F.schwarz, [0, 1.12, -0.3]], [Q(0.6, 0.5, 0.12), F.schwarz, [0, 1.4, -0.55]],
    [Q(1.2, 0.07, 1.3), F.dunkelgrau, [0, 2.25, -0.15]], [Q(0.8, 0.1, 0.1), F.dunkelgrau, [0, 0.4, 0.85]],
    [Q(0.12, 2.5, 0.12), F.dunkelgrau, [-0.35, 1.25, 0.8]], [Q(0.12, 2.5, 0.12), F.dunkelgrau, [0.35, 1.25, 0.8]],
    [Q(0.12, 0.05, 1.1), F.metall, [-0.3, 0.1, 1.4]], [Q(0.12, 0.05, 1.1), F.metall, [0.3, 0.1, 1.4]],
  ];
  for (const x of [-0.55, 0.55]) {
    for (const z of [0.45, -0.75]) t.push([Q(0.07, 1.2, 0.07), F.dunkelgrau, [x, 1.65, z]]);
    for (const z of [0.5, -0.7]) t.push([Z(0.28, 0.28, 0.2, 10), F.schwarz, [x * 1.1, 0.28, z], QUER]);
  }
  return t;
}

function rollwagen() {
  const t = [[Q(0.8, 0.1, 1.2), F.metall, [0, 0.2, 0]]];
  for (const x of [-0.35, 0.35]) for (const z of [-0.5, 0.5]) t.push([Z(0.08, 0.08, 0.08), F.schwarz, [x, 0.08, z], QUER]);
  for (const x of [-0.4, 0.4]) {
    for (const z of [-0.58, 0, 0.58]) t.push([Q(0.04, 1.5, 0.04), F.metall, [x, 1.0, z]]);
    for (const y of [0.8, 1.3, 1.75]) t.push([Q(0.04, 0.04, 1.2), F.metall, [x, y, 0]]);
  }
  for (const x of [-0.2, 0.2]) t.push([Q(0.04, 1.5, 0.04), F.metall, [x, 1.0, -0.58]]);
  t.push([Q(0.8, 0.04, 0.04), F.metall, [0, 1.75, -0.58]], [Q(0.7, 0.45, 0.5), F.karton, [0, 0.48, 0.28]],
    [Q(0.6, 0.4, 0.5), F.kartonHell, [0, 0.46, -0.3]], [Q(0.5, 0.35, 0.45), F.karton, [0.05, 0.88, 0], [0, 0.3, 0]]);
  return t;
}

// Treppe nach oben (Erdgeschoss): 12 Stufen von +z (unten) nach -z (oben), dahinter der Treppenturm
function treppeAuf() {
  const t = [], d = 7 / 12;
  for (let i = 0; i < 12; i++) { const h = (i + 1) * 0.375; t.push([Q(3, h, d), i % 2 ? F.wand : F.boden, [0, h / 2, 3.5 - (i + 0.5) * d]]); }
  for (const x of [-1.45, 1.45]) t.push([Z(0.05, 0.05, 8.32, 6), F.metall, [x, 3.25, 0], [-1.0, 0, 0]],
    [Z(0.04, 0.04, 1.1, 6), F.metall, [x, 0.9, 3.3]], [Z(0.04, 0.04, 1.0, 6), F.metall, [x, 2.75, 0]]);
  t.push([Q(3.2, 5.2, 0.3), F.blau, [0, 2.6, -3.65]], [Q(2.6, 0.7, 0.05), F.schwarz, [0, 4.85, -3.48]]);
  return t;
}

// Treppenloch nach unten (Obergeschoss): Einstieg von Norden, Geländer an Ost- und Südseite
function treppeAb() {
  const t = [[Q(3, 0.02, 7), F.dunkelgrau, [0, 0.015, 0]]];
  for (let i = 0; i < 8; i++) t.push([Q(2.9, 0.02, 0.4), i % 2 ? F.grau : F.schwarz, [0, 0.03, -3 + i * 0.85]]);
  for (let i = 0; i < 5; i++) t.push([Z(0.04, 0.04, 1.1, 6), F.metall, [1.55, 0.55, -3.4 + i * 1.7]]);
  t.push([Q(0.08, 0.07, 7.1), F.metall, [1.55, 1.1, 0]], [Q(0.06, 0.05, 7.1), F.metall, [1.55, 0.6, 0]],
    [Q(3.2, 0.07, 0.08), F.metall, [0, 1.1, 3.55]], [Z(0.04, 0.04, 1.1, 6), F.metall, [-1.45, 0.55, 3.55]]);
  return t;
}

function aufzug() {
  return [
    [Q(3, 4.7, 3), F.wand, [0, 2.35, 0]], [Q(3.06, 0.5, 3.06), F.blau, [0, 4.95, 0]], [Q(2, 2.7, 0.1), F.dunkelgrau, [0, 1.35, 1.52]],
    [Q(0.92, 2.5, 0.06), F.metall, [-0.47, 1.25, 1.57]], [Q(0.92, 2.5, 0.06), F.metall, [0.47, 1.25, 1.57]],
    [Q(0.25, 0.4, 0.06), F.dunkelgrau, [1.25, 1.3, 1.53]], [K(0.06), F.gelb, [1.25, 1.35, 1.58]],
    [Q(0.7, 0.3, 0.06), F.schwarz, [0, 2.95, 1.53]], [Q(0.16, 0.12, 0.04), F.gelb, [0, 2.95, 1.57]],
  ];
}

function rolltor() {
  const t = [[Q(5, 3.6, 0.1), F.metall, [0, 1.8, 0]]];
  for (let y = 0.5; y < 3.5; y += 0.55) t.push([Q(5.02, 0.04, 0.12), F.grau, [0, y, 0]]);
  for (const x of [-2.6, 2.6]) {
    t.push([Q(0.25, 3.8, 0.2), F.gelb, [x, 1.9, 0]]);
    for (const y of [0.4, 1.2, 2.0, 2.8, 3.6]) t.push([Q(0.26, 0.2, 0.21), F.schwarz, [x, y, 0]]);
  }
  return t;
}

export const MOEBEL = {
  hochregal: { teile: hochregal(), fuss: [[1.9, 7.1]], viele: true },
  palette: {
    teile: [[Q(1.6, 0.1, 1.2), F.birkeDunkel, [0, 0.05, 0]], [Q(1.6, 0.08, 1.2), F.birke, [0, 0.16, 0]], [Q(1.5, 0.7, 1.1), F.karton, [0, 0.55, 0]],
      [Q(1.2, 0.55, 0.9), F.kartonHell, [0.05, 1.18, 0.02], [0, 0.2, 0]], [Q(0.7, 0.4, 0.6), F.karton, [-0.1, 1.65, -0.05], [0, -0.3, 0]]],
    fuss: [[1.7, 1.7]], viele: true,
  },
  marktregal: { teile: marktregal(), fuss: [[1.3, 4.1]], viele: true },
  wuehltisch: { teile: wuehltisch(), fuss: [[3.3, 2.1]] },
  kasse: {
    teile: [[Q(1.1, 0.9, 3.6), F.weiss, [0, 0.45, 0]], [Q(0.9, 0.05, 2.6), F.schwarz, [0, 0.93, -0.5]], [Q(0.05, 0.7, 3.6), F.blau, [0.57, 0.45, 0]],
      [Q(0.25, 0.9, 0.25), F.dunkelgrau, [-0.3, 1.3, 1.5]], [Q(0.55, 0.38, 0.06), F.blau, [-0.3, 1.9, 1.5], [-0.3, 0, 0]],
      [Z(0.04, 0.04, 2.6, 6), F.dunkelgrau, [0.42, 1.3, -1.65]], [Q(0.5, 0.5, 0.08), F.gelb, [0.42, 2.75, -1.65]]],
    fuss: [[1.3, 3.7]], viele: true,
  },
  sbkasse: { teile: [[Q(0.6, 1.2, 0.5), F.weiss, [0, 0.6, 0]], [Q(0.56, 0.42, 0.06), F.blau, [0, 1.35, 0.1], [-0.5, 0, 0]], [Q(0.3, 0.05, 0.2), F.gelb, [0, 1.0, 0.28]]], fuss: [[0.7, 0.6]] },
  pflanze: {
    teile: [[Z(0.38, 0.3, 0.6, 10), F.topf, [0, 0.3, 0]], [K(0.5, 10, 8), F.pflanze, [0, 1.05, 0]], [K(0.38, 9, 7), F.pflanzeHell, [0.25, 1.4, 0.1]], [K(0.34, 9, 7), F.pflanze, [-0.2, 1.5, -0.12]]],
    fuss: [[0.8, 0.8]], viele: true,
  },
  fundgrube: { teile: fundgrube(), fuss: [[4.6, 3.6]] },
  hotdog: { teile: hotdog(), fuss: [[3.4, 2.2]] },
  bistro: { teile: [[Z(0.5, 0.5, 0.05, 14), F.weiss, [0, 1.05, 0]], [Z(0.05, 0.05, 1.05, 6), F.dunkelgrau, [0, 0.52, 0]], [Z(0.3, 0.3, 0.04, 12), F.dunkelgrau, [0, 0.02, 0]]], fuss: [[0.9, 0.9]] },
  stapler: { teile: stapler(), fuss: [[1.4, 2.6, 0, 0.35]] },
  rollwagen: { teile: rollwagen(), fuss: [[1, 1.3]], viele: true },
  rolltor: { teile: rolltor() },
  tor: { teile: [[Q(0.4, 3.3, 0.4), F.blau, [-2.2, 1.65, 0]], [Q(0.4, 3.3, 0.4), F.blau, [2.2, 1.65, 0]], [Q(4.8, 0.6, 0.5), F.blau, [0, 3.3, 0]]], fuss: [[0.5, 0.5, -2.2, 0], [0.5, 0.5, 2.2, 0]] },
  treppeAuf: { teile: treppeAuf(), fuss: [[3.1, 5.9, 0, -0.55]] },
  treppeAb: { teile: treppeAb(), fuss: [[0.25, 7.2, 1.55, 0], [3.2, 0.25, 0, 3.55]] },
  aufzug: { teile: aufzug(), fuss: [[3.1, 3.1]] },
};
