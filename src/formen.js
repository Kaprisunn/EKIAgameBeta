// Formen-Werkzeug: Toon-Materialien (jede Sorte nur einmal) und Teile mit Vertex-Farben,
// die zu einer Geometrie verschmolzen werden. So bleibt jede Gruppe ein einziger Draw Call.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { FARBE } from './daten.js';

let verlauf = null;
function toonVerlauf() {
  if (verlauf) return verlauf;
  verlauf = new THREE.DataTexture(new Uint8Array([95, 175, 255]), 3, 1, THREE.RedFormat);
  verlauf.minFilter = verlauf.magFilter = THREE.NearestFilter;
  verlauf.generateMipmaps = false;
  verlauf.needsUpdate = true;
  return verlauf;
}

const cache = new Map();
// 'bunt' = Toon mit Vertex-Farben, 'facette' = dasselbe facettiert, 'umriss' = dunkle Rückseiten-Hülle.
export function material(art) {
  if (cache.has(art)) return cache.get(art);
  let m;
  if (art === 'umriss') m = new THREE.MeshBasicMaterial({ color: FARBE.umriss, side: THREE.BackSide });
  else m = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: toonVerlauf(), flatShading: art === 'facette' });
  cache.set(art, m);
  return m;
}

// Grundformen (klein unterteilt, damit die Dreieckszahl niedrig bleibt)
export const kugel = (r, w = 12, h = 9) => new THREE.SphereGeometry(r, w, h);
export const kappe = (r, winkel, w = 14) => new THREE.SphereGeometry(r, w, 7, 0, Math.PI * 2, 0, winkel);
export const kapsel = (r, laenge, rund = 10) => new THREE.CapsuleGeometry(r, laenge, 3, rund);
export const zylinder = (ro, ru, h, rund = 10) => new THREE.CylinderGeometry(ro, ru, h, rund);
export const quader = (b, h, t) => new THREE.BoxGeometry(b, h, t);
export const kegel = (r, h, rund = 8) => new THREE.ConeGeometry(r, h, rund);
export const ring = (r, dicke, bogen) => new THREE.TorusGeometry(r, dicke, 5, 10, bogen);

const hilf = { m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), p: new THREE.Vector3(), s: new THREE.Vector3(), c: new THREE.Color() };

// Färbt eine Geometrie einfarbig und setzt sie an Position, Drehung und Skalierung.
export function teil(geo, farbe, pos = [0, 0, 0], rot = [0, 0, 0], skal = [1, 1, 1]) {
  geo.deleteAttribute('uv');
  const n = geo.attributes.position.count, farben = new Float32Array(n * 3);
  hilf.c.set(farbe);
  for (let i = 0; i < n; i++) { farben[i * 3] = hilf.c.r; farben[i * 3 + 1] = hilf.c.g; farben[i * 3 + 2] = hilf.c.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  hilf.m.compose(hilf.p.fromArray(pos), hilf.q.setFromEuler(hilf.e.set(rot[0], rot[1], rot[2])), hilf.s.fromArray(skal));
  return geo.applyMatrix4(hilf.m);
}

// Bläht eine Geometrie entlang ihrer Normalen auf: Grundlage für die Umriss-Hülle.
export function aufblasen(geo, d) {
  const p = geo.attributes.position, nrm = geo.attributes.normal;
  for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + nrm.getX(i) * d, p.getY(i) + nrm.getY(i) * d, p.getZ(i) + nrm.getZ(i) * d);
  return geo;
}

export function verschmelzen(teile) {
  const geo = mergeGeometries(teile, false);
  teile.forEach((t) => t.dispose());
  return geo;
}

// Baut aus einer Teile-Liste ein Mesh (plus Umriss-Hülle). Eintrag: [machGeo, farbe, pos, rot, skal, mitUmriss]
export function baueNetz(liste, { umriss = false, dicke = 0.03, schatten = true, art = 'bunt' } = {}) {
  const geos = [], huellen = [];
  for (const [mach, farbe, pos, rot, skal, rand = true] of liste) {
    geos.push(teil(mach(), farbe, pos, rot, skal));
    if (umriss && rand) huellen.push(teil(aufblasen(mach(), dicke), FARBE.umriss, pos, rot, skal));
  }
  const netz = new THREE.Mesh(verschmelzen(geos), material(art));
  netz.castShadow = schatten;
  netz.receiveShadow = true;
  if (huellen.length) netz.add(new THREE.Mesh(verschmelzen(huellen), material('umriss')));
  return netz;
}

// Viele gleiche Requisiten als InstancedMesh: ein Draw Call für alle. stellen: [x, z, drehungY, skal]
export function baueViele(liste, stellen, { schatten = true, y = 0, farbVar = 0 } = {}) {
  const geo = verschmelzen(liste.map(([mach, farbe, pos, rot, skal]) => teil(mach(), farbe, pos, rot, skal)));
  const netz = new THREE.InstancedMesh(geo, material('bunt'), stellen.length);
  const o = new THREE.Object3D(), c = new THREE.Color();
  stellen.forEach(([x, z, dreh = 0, s = 1], i) => {
    o.position.set(x, y, z); o.rotation.set(0, dreh, 0); o.scale.setScalar(s); o.updateMatrix();
    netz.setMatrixAt(i, o.matrix);
    if (farbVar) netz.setColorAt(i, c.setScalar(1 - Math.random() * farbVar));
  });
  netz.castShadow = schatten;
  netz.receiveShadow = true;
  netz.computeBoundingSphere();
  return netz;
}
