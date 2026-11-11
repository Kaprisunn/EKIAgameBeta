// Möbel für den Parkplatz: Autos, Berberitzen-Hecken, Wagenboxen, Laternen, Spielplatz, Pakete.
// Format wie in moebel.js: teile (Vorderseite nach +z), fuss = Kollisionskästen, viele = InstancedMesh, farben = je Instanz.
import { quader, zylinder, kugel, kegel } from './formen.js';
import { FARBE as F } from './daten.js';
import { MOEBEL_DEKO } from './moebel-deko.js';

const Q = (b, h, t) => () => quader(b, h, t);
const Z = (ro, ru, h, n = 8) => () => zylinder(ro, ru, h, n);
const K = (r, w = 8, h = 6) => () => kugel(r, w, h);
const QUER = [0, 0, Math.PI / 2];

// Spielzeugauto: weißer Grundkörper wird pro Instanz eingefärbt, Fenster und Räder bleiben dunkel
function auto() {
  const t = [[Q(1.9, 0.7, 4.0), F.weiss, [0, 0.55, 0]], [Q(1.7, 0.6, 2.0), F.weiss, [0, 1.15, -0.2]],
    [Q(1.74, 0.36, 1.9), 0x37414d, [0, 1.18, -0.2]], [Q(1.5, 0.15, 0.05), 0xfff2b0, [0, 0.72, 2.0]], [Q(1.5, 0.12, 0.05), 0xa83228, [0, 0.72, -2.0]]];
  for (const x of [-0.95, 0.95]) for (const z of [-1.3, 1.3]) t.push([Z(0.33, 0.33, 0.25, 10), F.schwarz, [x, 0.33, z], QUER]);
  return t;
}

function spielplatz() {
  const t = [[Q(8, 0.06, 5), 0xe8d39a, [0, 0.03, 0]], [Q(1.2, 0.1, 1.2), F.birke, [-2, 1.55, -0.8]], [() => kegel(0.95, 0.8, 4), F.rot, [-2, 2.5, -0.8], [0, Math.PI / 4, 0]],
    [Q(0.8, 0.06, 2.6), F.gelb, [-2, 0.83, 0.9], [0.58, 0, 0]], [Z(0.07, 0.07, 2.2), F.blau, [1.2, 1.1, 0]], [Z(0.07, 0.07, 2.2), F.blau, [3.8, 1.1, 0]],
    [Z(0.06, 0.06, 2.8), F.blau, [2.5, 2.2, 0], QUER]];
  for (const x of [-2.55, -1.45]) for (const z of [-1.35, -0.25]) t.push([Z(0.06, 0.06, 2.1, 6), F.weiss, [x, 1.05, z]]);
  for (const x of [2.0, 3.0]) {
    t.push([Q(0.5, 0.06, 0.25), F.rot, [x, 0.55, 0]]);
    for (const dx of [-0.2, 0.2]) t.push([Z(0.012, 0.012, 1.62, 4), F.dunkelgrau, [x + dx, 1.38, 0]]);
  }
  return t;
}

export const MOEBEL_AUSSEN = {
  auto: { teile: auto(), fuss: [[2.0, 4.2]], viele: true,
    farben: [0xd9483b, 0x2f6fb5, 0xf2f2f2, 0x4a5058, 0x9bc48b, 0xe8a87c, 0xb9a6d9, 0xc0c4c9, 0xfbd914] },
  hecke: {
    teile: [[Q(1.6, 0.15, 10.2), F.grau, [0, 0.08, 0]], [Q(1.3, 0.75, 9.6), 0x3e7d3a, [0, 0.5, 0]],
      ...[-4, -2, 0, 2, 4].map((z) => [K(0.55, 9, 7), 0x4f8f44, [0, 0.85, z]])],
    fuss: [[1.6, 10.2]], viele: true,
  },
  wagenbox: {
    teile: [[Q(4.8, 0.12, 2.6), F.blau, [0, 2.4, 0]], [Q(4.6, 1.4, 0.05), F.glas, [0, 1.0, -1.25]], ...MOEBEL_DEKO.wagenreihe.teile,
      ...[-2.3, 2.3].flatMap((x) => [-1.2, 1.2].map((z) => [Z(0.06, 0.06, 2.4, 6), F.metall, [x, 1.2, z]]))],
    fuss: [[4.9, 2.7]],
  },
  laterne: { teile: [[Z(0.08, 0.1, 4.2, 6), F.dunkelgrau, [0, 2.1, 0]], [Q(0.9, 0.08, 0.08), F.dunkelgrau, [0.4, 4.15, 0]], [Q(0.5, 0.12, 0.3), F.weiss, [0.8, 4.08, 0]]], fuss: [[0.4, 0.4]], viele: true },
  spielplatz: { teile: spielplatz(), fuss: [[1.3, 1.3, -2, -0.8], [0.8, 2.4, -2, 1.0], [2.9, 0.4, 2.5, 0]] },
  pakete: { teile: [[Q(1.0, 0.25, 1.6), F.karton, [0, 0.13, 0]], [Q(0.6, 0.5, 0.5), F.kartonHell, [0.1, 0.5, 0.3]], [Q(0.9, 0.2, 1.2), F.karton, [-0.05, 0.36, -0.3]]], fuss: [[1.3, 1.7]] },
};
