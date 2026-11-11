// Ausstattung und Deko: Säulen, Markthallen-Deko, Einkaufswagen, Absperrungen, Click & Collect.
// Format wie in moebel.js: teile (Vorderseite nach +z), fuss = Kollisionskästen, viele = InstancedMesh.
import { quader, zylinder, kugel, kegel } from './formen.js';
import { FARBE as F } from './daten.js';

const Q = (b, h, t) => () => quader(b, h, t);
const Z = (ro, ru, h, n = 8) => () => zylinder(ro, ru, h, n);
const K = (r, w = 8, h = 6) => () => kugel(r, w, h);
const QUER = [0, 0, Math.PI / 2], LIEGT = [Math.PI / 2, 0, 0];
const BUNT = [F.sofa, F.orange, F.decke, F.blau, F.wange, F.gelb];

// Tisch mit Tischleuchten, darüber drei Pendelleuchten an einem Galgen
function lampen() {
  const t = [[Q(3, 0.75, 1.4), F.birke, [0, 0.375, 0]], [Q(2.9, 0.06, 0.06), F.dunkelgrau, [0, 3.2, -0.6]]];
  for (const x of [-1.4, 1.4]) t.push([Z(0.05, 0.05, 3.2, 6), F.dunkelgrau, [x, 1.6, -0.6]]);
  [-0.9, 0, 0.9].forEach((x, i) => t.push([Z(0.01, 0.01, 0.8, 4), F.dunkelgrau, [x, 2.8, -0.6]],
    [() => kegel(0.28, 0.32, 10), [F.gelb, F.weiss, F.orange][i], [x, 2.3, -0.6]], [K(0.09), F.weiss, [x, 2.15, -0.6]],
    [Z(0.1, 0.12, 0.05), F.dunkelgrau, [x, 0.78, 0.3]], [Z(0.02, 0.02, 0.4, 4), F.dunkelgrau, [x, 0.98, 0.3]],
    [Z(0.12, 0.2, 0.22, 10), [F.weiss, F.gelb, F.decke][i], [x, 1.22, 0.3]]));
  return t;
}

// Freistehende Bilderwand mit fünf Rahmen
function bilderwand() {
  const t = [[Q(3.2, 2.2, 0.15), F.birke, [0, 1.1, 0]], [Q(3.4, 0.1, 0.5), F.birkeDunkel, [0, 0.05, 0]]];
  for (const [x, y, b, h, farbe] of [[-1.05, 1.5, 0.7, 0.9, F.blau], [-0.1, 1.6, 0.8, 0.6, F.decke], [0.95, 1.45, 0.6, 0.8, F.orange],
    [-0.6, 0.65, 0.9, 0.5, F.sofa], [0.6, 0.7, 0.7, 0.6, F.gelb]]) {
    t.push([Q(b, h, 0.05), F.schwarz, [x, y, 0.1]], [Q(b - 0.12, h - 0.12, 0.05), farbe, [x, y, 0.12]]);
  }
  return t;
}

// Stufenregal mit kleinen Topfpflanzen
function pflanzenstand() {
  const t = [[Q(0.08, 1.2, 1.6), F.birke, [-1.2, 0.6, 0]], [Q(0.08, 1.2, 1.6), F.birke, [1.2, 0.6, 0]]];
  for (let s = 0; s < 3; s++) {
    const y = 0.3 + s * 0.4, z = 0.5 - s * 0.5;
    t.push([Q(2.4, 0.08, 0.5), F.birke, [0, y, z]]);
    for (let i = 0; i < 4; i++) {
      const x = -0.9 + i * 0.6;
      t.push([Z(0.12, 0.1, 0.2), F.topf, [x, y + 0.14, z]], [K(0.17), (i + s) % 2 ? F.pflanze : F.pflanzeHell, [x, y + 0.35, z]]);
    }
  }
  return t;
}

// Einkaufswagen-Reihe: vier ineinandergeschobene Wagen
function wagenreihe() {
  const t = [];
  for (let i = 0; i < 4; i++) {
    const x = -1.1 + i * 0.45;
    t.push([Q(1.0, 0.04, 0.6), F.metall, [x, 0.6, 0]], [Q(1.0, 0.45, 0.03), F.metall, [x, 0.82, 0.3]], [Q(1.0, 0.45, 0.03), F.metall, [x, 0.82, -0.3]],
      [Q(0.03, 0.45, 0.6), F.metall, [x + 0.5, 0.82, 0]], [Q(0.06, 0.06, 0.64), F.blau, [x - 0.62, 1.1, 0]],
      [Q(0.04, 0.55, 0.04), F.dunkelgrau, [x - 0.45, 0.32, 0.25]], [Q(0.04, 0.55, 0.04), F.dunkelgrau, [x - 0.45, 0.32, -0.25]]);
    for (const [dx, dz] of [[-0.4, 0.25], [-0.4, -0.25], [0.4, 0.25], [0.4, -0.25]]) t.push([Z(0.07, 0.07, 0.05), F.schwarz, [x + dx, 0.07, dz], LIEGT]);
  }
  return t;
}

function ccTheke() {
  const t = [[Q(11.6, 1.05, 1.1), F.weiss, [0, 0.53, 0]], [Q(11.7, 0.08, 1.2), F.birke, [0, 1.09, 0]], [Q(11.6, 0.5, 0.05), F.blau, [0, 0.6, 0.57]]];
  for (const x of [-3.5, 0.5]) t.push([Q(0.6, 0.4, 0.05), F.schwarz, [x, 1.45, -0.1], [-0.2, 0, 0]], [Q(0.1, 0.25, 0.1), F.dunkelgrau, [x, 1.2, -0.15]]);
  t.push([K(0.08), F.gelb, [-2.4, 1.17, 0.25]]);
  [[2.5, F.karton], [3.2, F.kartonHell], [4.4, F.karton]].forEach(([x, f], i) => t.push([Q(0.6, 0.4 + i * 0.1, 0.5), f, [x, 1.33 + i * 0.05, 0]]));
  return t;
}

// Offenes Lagertor: gelb-schwarze Pfosten, oben die aufgerollte Tür, gelbe Bodenmarkierung
function torOffen() {
  const t = [[Q(4.8, 0.6, 0.5), F.dunkelgrau, [0, 3.6, 0]], [Z(0.25, 0.25, 4.4, 12), F.metall, [0, 3.6, 0.1], QUER], [Q(4.0, 0.02, 0.6), F.gelb, [0, 0.02, 0]]];
  for (const x of [-2.2, 2.2]) {
    t.push([Q(0.35, 3.9, 0.35), F.gelb, [x, 1.95, 0]]);
    for (const y of [0.4, 1.2, 2.0, 2.8]) t.push([Q(0.36, 0.25, 0.36), F.schwarz, [x, y, 0]]);
  }
  return t;
}

export const MOEBEL_DEKO = {
  // Schnellwechsel-Spinde zum Umziehen (Gelb ⇄ Blau)
  spindklein: {
    teile: [0, 1, 2].flatMap((i) => [[Q(0.58, 2, 0.5), F.grau, [-0.6 + i * 0.6, 1, 0]], [Q(0.5, 1.85, 0.03), i === 1 ? F.blau : F.metall, [-0.6 + i * 0.6, 1, 0.26]],
      [Q(0.04, 0.15, 0.03), F.gelb, [-0.42 + i * 0.6, 1, 0.285]]]),
    fuss: [[1.9, 0.6]],
  },
  saeule: { teile: [[Q(0.8, 4.5, 0.8), F.wand, [0, 2.25, 0]], [Q(0.86, 0.6, 0.86), F.blau, [0, 4.2, 0]], [Q(0.9, 0.25, 0.9), F.birke, [0, 0.12, 0]]], fuss: [[0.9, 0.9]], viele: true },
  lampen: { teile: lampen(), fuss: [[3, 1.4]] },
  bilderwand: { teile: bilderwand(), fuss: [[3.4, 0.5]] },
  pflanzenstand: { teile: pflanzenstand(), fuss: [[2.5, 1.6]] },
  koerbe: {
    teile: [-0.85, 0, 0.85].flatMap((x, i) => [[Z(0.38, 0.34, 0.7, 12), F.weiss, [x, 0.35, 0]], [K(0.33, 9, 6), BUNT[i], [x, 0.7, 0], [0, 0, 0], [1, 0.5, 1]],
      [K(0.2), BUNT[i + 3], [x + 0.1, 0.82, 0.05]]]),
    fuss: [[2.5, 0.8]],
  },
  teppiche: {
    teile: [[Q(2.2, 0.15, 1.3), F.birkeDunkel, [0, 0.08, 0]],
      ...[[-0.4, 0.33], [0, 0.33], [0.4, 0.33], [-0.2, 0.67], [0.2, 0.67]].map(([z, y], i) => [Z(0.19, 0.19, 2.1, 10), BUNT[i], [0, y, z], QUER])],
    fuss: [[2.3, 1.4]],
  },
  wagenreihe: { teile: wagenreihe(), fuss: [[3.2, 0.9]] },
  absperrung: {
    teile: [[Q(3, 0.08, 0.03), F.blau, [0, 0.9, 0]], ...[-1.5, 0, 1.5].flatMap((x) => [[Z(0.05, 0.05, 0.95, 6), F.metall, [x, 0.48, 0]], [Z(0.18, 0.18, 0.03, 10), F.dunkelgrau, [x, 0.02, 0]]])],
    fuss: [[3.1, 0.3]], viele: true,
  },
  taschen: {
    teile: [[Q(0.9, 0.06, 0.6), F.dunkelgrau, [0, 0.03, 0]], [Q(0.06, 1.4, 0.06), F.dunkelgrau, [-0.4, 0.7, 0]], [Q(0.06, 1.4, 0.06), F.dunkelgrau, [0.4, 0.7, 0]],
      [Q(0.86, 0.05, 0.05), F.dunkelgrau, [0, 1.38, 0]], ...[-0.25, 0, 0.25].map((x, i) => [Q(0.22, 0.5, 0.35), i % 2 ? F.blau : F.gelb, [x, 1.1, 0]])],
    fuss: [[1, 0.7]],
  },
  hubwagen: {
    teile: [[Q(0.15, 0.08, 1.15), F.orange, [-0.2, 0.06, 0.3]], [Q(0.15, 0.08, 1.15), F.orange, [0.2, 0.06, 0.3]], [Q(0.55, 0.4, 0.3), F.orange, [0, 0.25, -0.35]],
      [Z(0.03, 0.03, 1.1, 6), F.dunkelgrau, [0, 0.9, -0.55], [-0.3, 0, 0]], [Q(0.3, 0.05, 0.05), F.schwarz, [0, 1.42, -0.72]]],
    fuss: [[0.6, 1.4, 0, 0.1]],
  },
  ccTheke: { teile: ccTheke(), fuss: [[11.7, 1.3]] },
  torOffen: { teile: torOffen(), fuss: [[0.45, 0.45, -2.2, 0], [0.45, 0.45, 2.2, 0]] },
};
