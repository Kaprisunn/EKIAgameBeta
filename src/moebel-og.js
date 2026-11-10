// Möbel fürs Obergeschoss (aus Meilenstein 1 übernommen, jetzt relativ zum Ursprung).
// Wohnkojen: Ursprung = Kojenmitte, Rückwand bei z = -3.75. Format wie in moebel.js.
import { quader, zylinder, kugel } from './formen.js';
import { FARBE as F } from './daten.js';

const Q = (b, h, t) => () => quader(b, h, t);
const Z = (ro, ru, h, n = 8) => () => zylinder(ro, ru, h, n);
const K = (r, w = 8, h = 6) => () => kugel(r, w, h);
const trennwand = (x) => [Q(0.25, 2.4, 5.75), F.birke, [x, 1.2, -0.9]];

function stuhl(x, z, d) {
  return [[Q(0.5, 0.07, 0.5), F.birke, [x, 0.45, z]], [Q(0.5, 0.55, 0.07), F.birke, [x, 0.78, z + d * 0.24]], [Q(0.06, 0.42, 0.42), F.weiss, [x, 0.21, z]]];
}

function theke() {
  const t = [[Q(7, 1, 1.1), F.weiss, [0, 0.5, 0]], [Q(7.1, 0.08, 1.2), F.birke, [0, 1.04, 0]], [Q(7, 0.45, 0.05), F.blau, [0, 0.55, 0.57]]];
  for (let i = 0; i < 4; i++) {
    const x = -2.4 + i * 1.6;
    t.push([Z(0.3, 0.26, 0.05, 12), F.weiss, [x, 1.1, 0.1]]);
    for (let k = 0; k < 3; k++) t.push([K(0.09, 7, 5), F.wurst, [x - 0.1 + k * 0.1, 1.18, 0.1 + (k % 2) * 0.08]]);
  }
  return t;
}

export const MOEBEL_OG = {
  wohnzimmer: {
    teile: [trennwand(-3.3), trennwand(3.3),
      [Q(4.2, 0.03, 3.4), F.teppich, [0, 0.03, 0.2]], [Q(3.2, 0.5, 1.1), F.sofa, [0, 0.3, -2.6]], [Q(3.2, 0.85, 0.3), F.sofa, [0, 0.75, -3.15]],
      [Q(0.3, 0.75, 1.1), F.sofa, [-1.55, 0.42, -2.6]], [Q(0.3, 0.75, 1.1), F.sofa, [1.55, 0.42, -2.6]],
      [Q(1.6, 0.08, 0.9), F.birke, [0, 0.45, 0]], [Q(1.4, 0.4, 0.7), F.weiss, [0, 0.2, 0]],
      [Z(0.04, 0.04, 1.9, 6), F.weiss, [-2.5, 0.95, -2.9]], [Z(0.22, 0.4, 0.45, 10), F.gelb, [-2.5, 1.9, -2.9]],
      [Q(1.2, 1.8, 0.4), F.birke, [2.5, 0.9, -3.5]], [Q(0.25, 0.4, 0.3), F.blau, [2.15, 1.1, -3.4]],
      [Q(0.3, 0.32, 0.3), F.gelb, [2.6, 1.06, -3.4]], [Q(0.5, 0.25, 0.3), F.pflanze, [2.5, 1.6, -3.4]]],
    fuss: [[0.3, 5.8, -3.3, -0.9], [0.3, 5.8, 3.3, -0.9], [3.4, 1.3, 0, -2.75], [1.6, 0.9, 0, 0], [1.2, 0.5, 2.5, -3.5], [0.5, 0.5, -2.5, -2.9]],
  },
  schlafzimmer: {
    teile: [trennwand(3.5),
      [Q(2.6, 0.45, 3.6), F.birke, [0, 0.23, -1.8]], [Q(2.5, 0.25, 3.4), F.bett, [0, 0.58, -1.8]], [Q(2.54, 0.12, 2.4), F.decke, [0, 0.76, -1.2]],
      [Q(1.6, 0.2, 0.5), F.weiss, [0, 0.8, -3.1]], [Q(2.6, 1.2, 0.15), F.birke, [0, 0.6, -3.6]], [Q(0.7, 0.6, 0.6), F.birke, [2.15, 0.3, -3.2]],
      [K(0.18, 10, 8), F.gelb, [2.15, 0.78, -3.2]], [Q(3.4, 0.03, 1.3), F.teppich, [0, 0.03, 0.7]]],
    fuss: [[2.6, 3.7, 0, -1.8], [0.7, 0.6, 2.15, -3.2], [0.3, 5.8, 3.5, -0.9]],
  },
  tischgruppe: {
    teile: [[Q(1.6, 0.08, 1.1), F.birke, [0, 0.78, 0]], [Z(0.07, 0.07, 0.74), F.weiss, [0, 0.38, 0]], [Z(0.4, 0.4, 0.04, 12), F.weiss, [0, 0.02, 0]],
      ...stuhl(-0.42, -0.85, -1), ...stuhl(0.42, -0.85, -1), ...stuhl(-0.42, 0.85, 1), ...stuhl(0.42, 0.85, 1)],
    fuss: [[1.8, 2.3]], viele: true,
  },
  theke: { teile: theke(), fuss: [[7.2, 1.3]] },
};
