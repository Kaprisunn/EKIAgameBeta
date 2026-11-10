// Requisiten der Halle aus einfachen Formen. Wiederholte Dinge als InstancedMesh,
// Einzelstücke zu einem einzigen Mesh verschmolzen. Jedes Hindernis landet als Kasten in `kaesten`.
import { baueNetz, baueViele, quader, zylinder, kugel } from './formen.js';
import { FARBE as F, PFEILWEG } from './daten.js';

const Q = (b, h, t) => () => quader(b, h, t);

function palettenregale(szene, kasten) {
  const teile = [];
  for (const z of [-3.4, 0, 3.4]) for (const x of [-0.85, 0.85]) teile.push([Q(0.12, 3.6, 0.12), F.blau, [x, 1.8, z]]);
  for (const y of [1.2, 2.4, 3.5]) for (const x of [-0.85, 0.85]) teile.push([Q(0.1, 0.16, 7), F.orange, [x, y, 0]]);
  for (const y of [1.2, 2.4]) teile.push([Q(1.7, 0.06, 6.9), F.grau, [0, y + 0.05, 0]]);
  [0, 1.28, 2.48].forEach((y, ebene) => [-2.3, 0, 2.3].forEach((z, i) => {
    const h = 0.6 + ((i + ebene) % 3) * 0.2;
    teile.push([Q(1.4, h, 1.9), (i + ebene) % 2 ? F.karton : F.kartonHell, [0, y + h / 2, z]]);
  }));
  const stellen = [[-20.4, -12], [-16.4, -12], [-12.4, -12]];
  szene.add(baueViele(teile, stellen));
  stellen.forEach(([x, z]) => kasten(x, z, 1.9, 7.1));
}

function paletten(szene, kasten) {
  const stellen = [[-20, -5.4, 0.1], [-16.6, -5.6, -0.15], [-13.2, -5.3, 0.05], [-20.2, -2.2, 1.6]];
  szene.add(baueViele([
    [Q(1.6, 0.1, 1.2), F.birkeDunkel, [0, 0.05, 0]],
    [Q(1.6, 0.08, 1.2), F.birke, [0, 0.16, 0]],
    [Q(1.5, 0.7, 1.1), F.karton, [0, 0.55, 0]],
    [Q(1.2, 0.55, 0.9), F.kartonHell, [0.05, 1.18, 0.02], [0, 0.2, 0]],
    [Q(0.7, 0.4, 0.6), F.karton, [-0.1, 1.65, -0.05], [0, -0.3, 0]],
  ], stellen));
  stellen.forEach(([x, z]) => kasten(x, z, 1.7, 1.7));
}

function wohnkojen(kasten) {
  const t = [];
  for (const x of [-7.3, -0.7, 6.3]) { t.push([Q(0.25, 2.4, 5.75), F.birke, [x, 1.2, -12.9]]); kasten(x, -12.9, 0.3, 5.8); }
  // Wohnzimmer
  t.push([Q(4.2, 0.03, 3.4), F.teppich, [-4, 0.03, -11.8]],
    [Q(3.2, 0.5, 1.1), F.sofa, [-4, 0.3, -14.6]], [Q(3.2, 0.85, 0.3), F.sofa, [-4, 0.75, -15.15]],
    [Q(0.3, 0.75, 1.1), F.sofa, [-5.55, 0.42, -14.6]], [Q(0.3, 0.75, 1.1), F.sofa, [-2.45, 0.42, -14.6]],
    [Q(1.6, 0.08, 0.9), F.birke, [-4, 0.45, -12]], [Q(1.4, 0.4, 0.7), F.weiss, [-4, 0.2, -12]],
    [() => zylinder(0.04, 0.04, 1.9, 6), F.weiss, [-6.5, 0.95, -14.9]], [() => zylinder(0.22, 0.4, 0.45, 10), F.gelb, [-6.5, 1.9, -14.9]],
    [Q(1.2, 1.8, 0.4), F.birke, [-1.5, 0.9, -15.5]], [Q(0.25, 0.4, 0.3), F.blau, [-1.85, 1.1, -15.4]],
    [Q(0.3, 0.32, 0.3), F.gelb, [-1.4, 1.06, -15.4]], [Q(0.5, 0.25, 0.3), F.pflanze, [-1.5, 1.6, -15.4]]);
  kasten(-4, -14.75, 3.4, 1.3); kasten(-4, -12, 1.6, 0.9); kasten(-1.5, -15.5, 1.2, 0.5); kasten(-6.5, -14.9, 0.5, 0.5);
  // Schlafzimmer
  t.push([Q(2.6, 0.45, 3.6), F.birke, [2.8, 0.23, -13.8]], [Q(2.5, 0.25, 3.4), F.bett, [2.8, 0.58, -13.8]],
    [Q(2.54, 0.12, 2.4), F.decke, [2.8, 0.76, -13.2]], [Q(1.6, 0.2, 0.5), F.weiss, [2.8, 0.8, -15.1]],
    [Q(2.6, 1.2, 0.15), F.birke, [2.8, 0.6, -15.6]], [Q(0.7, 0.6, 0.6), F.birke, [4.95, 0.3, -15.2]],
    [() => kugel(0.18, 10, 8), F.gelb, [4.95, 0.78, -15.2]], [Q(3.4, 0.03, 1.3), F.teppich, [2.8, 0.03, -11.3]]);
  kasten(2.8, -13.8, 2.6, 3.7); kasten(4.95, -15.2, 0.7, 0.6);
  return t;
}

function fundgrube(kasten) {
  kasten(10.5, -13.4, 4.6, 3.6);
  const stuhl = (x, z, kipp) => [
    [Q(0.6, 0.08, 0.6), F.birke, [x, 0.75, z], [0, 0, kipp]], [Q(0.6, 0.7, 0.08), F.birke, [x, 1.1, z - 0.27], [0, 0, kipp]],
    [Q(0.4, 0.45, 0.4), F.weiss, [x, 0.52, z]], [Q(0.22, 0.3, 0.02), F.gelb, [x + 0.15, 1.1, z - 0.22]],
  ];
  return [[Q(4.6, 0.3, 3.6), F.birkeDunkel, [10.5, 0.15, -13.4]],
    ...stuhl(9.3, -12.6, 0.12), ...stuhl(10.6, -12.4, -0.08),
    [Q(1.4, 0.08, 0.9), F.birke, [11.9, 1.0, -14.2], [0.05, 0, 0.04]], [Q(1.2, 0.7, 0.7), F.weiss, [11.9, 0.65, -14.2]],
    [Q(0.25, 0.35, 0.02), F.gelb, [12.3, 0.8, -13.84]], [Q(1.0, 1.4, 0.5), F.sofa, [9.4, 1.0, -14.7]],
    [Q(0.25, 0.35, 0.02), F.gelb, [9.6, 1.2, -14.44]]];
}

function restaurant(szene, kasten) {
  const stuhl = (x, z, d) => [
    [Q(0.5, 0.07, 0.5), F.birke, [x, 0.45, z]], [Q(0.5, 0.55, 0.07), F.birke, [x, 0.78, z + d * 0.24]],
    [Q(0.06, 0.42, 0.42), F.weiss, [x, 0.21, z]],
  ];
  const stellen = [[15.5, -11.5], [19.5, -11.5], [15.5, -7], [19.5, -7], [15.5, -2.5], [19.5, -2.5]];
  szene.add(baueViele([
    [Q(1.6, 0.08, 1.1), F.birke, [0, 0.78, 0]], [() => zylinder(0.07, 0.07, 0.74, 8), F.weiss, [0, 0.38, 0]],
    [() => zylinder(0.4, 0.4, 0.04, 12), F.weiss, [0, 0.02, 0]],
    ...stuhl(-0.42, -0.85, -1), ...stuhl(0.42, -0.85, -1), ...stuhl(-0.42, 0.85, 1), ...stuhl(0.42, 0.85, 1),
  ], stellen));
  stellen.forEach(([x, z]) => kasten(x, z, 1.8, 2.3));
  kasten(17.8, -15.1, 7.2, 1.3);
  const teller = [];
  for (let i = 0; i < 4; i++) {
    const x = 15.4 + i * 1.6;
    teller.push([() => zylinder(0.3, 0.26, 0.05, 12), F.weiss, [x, 1.1, -15]]);
    for (let k = 0; k < 3; k++) teller.push([() => kugel(0.09, 7, 5), 0x8a4f2a, [x - 0.1 + k * 0.1, 1.18, -15 + (k % 2) * 0.08]]);
  }
  return [[Q(7, 1, 1.1), F.weiss, [17.8, 0.5, -15.1]], [Q(7.1, 0.08, 1.2), F.birke, [17.8, 1.04, -15.1]],
    [Q(7, 0.45, 0.05), F.blau, [17.8, 0.55, -14.53]], ...teller];
}

function kassen(kasten) {
  const t = [];
  for (const x of [-14, -10, -6]) {
    t.push([Q(1.1, 0.9, 3.6), F.weiss, [x, 0.45, 11.5]], [Q(0.9, 0.05, 2.6), F.schwarz, [x, 0.93, 11]],
      [Q(0.05, 0.7, 3.6), F.blau, [x + 0.57, 0.45, 11.5]], [Q(0.25, 0.9, 0.25), F.dunkelgrau, [x - 0.3, 1.3, 13]],
      [Q(0.55, 0.38, 0.06), F.blau, [x - 0.3, 1.9, 13], [-0.3, 0, 0]],
      [() => zylinder(0.04, 0.04, 2.6, 6), F.dunkelgrau, [x + 0.42, 1.3, 9.85]],
      [Q(0.5, 0.5, 0.08), F.gelb, [x + 0.42, 2.75, 9.85]]);
    kasten(x, 11.5, 1.3, 3.7);
  }
  for (const x of [3, 5]) {
    t.push([Q(0.6, 1.2, 0.5), F.weiss, [x, 0.6, 13.4]], [Q(0.56, 0.42, 0.06), F.blau, [x, 1.35, 13.3], [-0.5, 0, 0]],
      [Q(0.3, 0.05, 0.2), F.gelb, [x, 1.0, 13.12]]);
    kasten(x, 13.4, 0.7, 0.6);
  }
  // Kundenservice-Tresen an der Westwand
  t.push([Q(1.2, 1.05, 4.5), F.weiss, [-19.6, 0.53, 8]], [Q(1.3, 0.08, 4.6), F.birke, [-19.6, 1.09, 8]],
    [Q(0.05, 0.6, 4.4), F.blau, [-18.98, 0.5, 8]], [() => zylinder(0.04, 0.04, 2.4, 6), F.dunkelgrau, [-21, 1.2, 8]],
    [() => zylinder(0.45, 0.45, 0.08, 16), F.gelb, [-21, 2.6, 8], [Math.PI / 2, 0, 0]]);
  kasten(-19.6, 8, 1.3, 4.6); kasten(-21, 8, 0.3, 0.3);
  return t;
}

function pflanzen(szene, kasten) {
  const stellen = [[-8.2, 4], [8.5, -10.2], [13, 3.5], [-0.5, 5.5], [7.5, 12.5], [-21, 14.3], [21, 14.3], [-8.6, -15], [13.4, -15.1], [21, 1.5]];
  szene.add(baueViele([
    [() => zylinder(0.38, 0.3, 0.6, 10), F.topf, [0, 0.3, 0]],
    [() => kugel(0.5, 10, 8), F.pflanze, [0, 1.05, 0]], [() => kugel(0.38, 9, 7), F.pflanzeHell, [0.25, 1.4, 0.1]],
    [() => kugel(0.34, 9, 7), F.pflanze, [-0.2, 1.5, -0.12]],
  ], stellen.map(([x, z]) => [x, z, x * 7, 0.9 + (Math.abs(x * z) % 3) * 0.1]), { farbVar: 0.15 }));
  stellen.forEach(([x, z]) => kasten(x, z, 0.8, 0.8));
}

// Gelbe Pfeile entlang des Rundwegs (Abstand etwa 2,6 Einheiten)
function pfeile(szene) {
  const stellen = [];
  for (let i = 0; i < PFEILWEG.length - 1; i++) {
    const [x1, z1] = PFEILWEG[i], [x2, z2] = PFEILWEG[i + 1], dx = x2 - x1, dz = z2 - z1, l = Math.hypot(dx, dz);
    for (let s = 1.3; s < l; s += 2.6) stellen.push([x1 + dx * s / l, z1 + dz * s / l, Math.atan2(dx, dz)]);
  }
  szene.add(baueViele([
    [Q(0.2, 0.02, 0.5), F.gelb, [0, 0, -0.25]],
    [() => zylinder(0.32, 0.32, 0.02, 3), F.gelb, [0, 0, 0.1]],
  ], stellen, { schatten: false, y: 0.025 }));
}

// Aktionsinseln in der Hallenmitte: Kissenstapel mit Preisschild, Flachpakete und Taschen-Tonne
function inseln(kasten) {
  const kissen = [F.blau, F.gelb, F.sofa, F.decke, F.weiss, F.orange].map((farbe, i) =>
    [Q(0.62, 0.22, 0.62), farbe, [3 + (i % 3) * 0.75, 0.82 + Math.floor(i / 3) * 0.23, 1.2 + Math.floor(i / 3) * 0.35], [0, i * 0.3, 0]]);
  kasten(4, 1.5, 3.3, 2.1); kasten(1.4, -3, 1.8, 1.4); kasten(3.1, -3.1, 1.1, 1.1);
  return [[Q(3.2, 0.7, 2), F.birke, [4, 0.35, 1.5]], ...kissen,
    [() => zylinder(0.03, 0.03, 1.4, 6), F.dunkelgrau, [5.3, 1.1, 2.2]], [Q(0.7, 0.45, 0.06), F.gelb, [5.3, 1.9, 2.2]],
    [Q(1.6, 0.18, 1.2), F.birkeDunkel, [1.4, 0.09, -3]], [Q(1.5, 0.5, 1.1), F.karton, [1.4, 0.43, -3]],
    [Q(1.4, 0.4, 1.0), F.kartonHell, [1.4, 0.88, -3], [0, 0.08, 0]],
    [() => zylinder(0.5, 0.45, 0.85, 12), F.blau, [3.1, 0.43, -3.1]], [Q(0.5, 0.35, 0.08), F.blau, [3.0, 1.0, -3.0], [0, 0.4, 0.2]],
    [Q(0.45, 0.3, 0.08), F.gelb, [3.25, 0.95, -3.25], [0, -0.3, -0.2]]];
}

export function baueRequisiten(szene, kaesten) {
  const kasten = (x, z, b, t) => kaesten.push([x - b / 2, z - t / 2, x + b / 2, z + t / 2]);
  palettenregale(szene, kasten);
  paletten(szene, kasten);
  pflanzen(szene, kasten);
  pfeile(szene);
  szene.add(baueNetz([...restaurant(szene, kasten), ...wohnkojen(kasten), ...fundgrube(kasten), ...kassen(kasten), ...inseln(kasten)]));
}
