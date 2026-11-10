// Welt: Himmel, Nebel, Licht mit Schatten, facettierte Wiese, Diorama-Halle mit Wänden, Wald.
// Dazu die Kollision (Kreis gegen achsenparallele Kästen).
import * as THREE from 'three';
import { baueNetz, baueViele, material, quader, kegel, zylinder } from './formen.js';
import { FARBE, HALLE } from './daten.js';
import { baueRequisiten } from './requisiten.js';

const B = HALLE.breite / 2, T = HALLE.tiefe / 2;

function himmel(szene) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { oben: { value: new THREE.Color(FARBE.himmel) }, unten: { value: new THREE.Color(FARBE.horizont) } },
    vertexShader: 'varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 oben; uniform vec3 unten; varying float h; void main(){ gl_FragColor = vec4(mix(unten, oben, smoothstep(0.0, 0.55, h)), 1.0); }',
  });
  const kuppel = new THREE.Mesh(new THREE.SphereGeometry(200, 16, 10), mat);
  kuppel.renderOrder = -1;
  szene.add(kuppel);
  szene.fog = new THREE.Fog(FARBE.horizont, 38, 95);
  szene.background = new THREE.Color(FARBE.horizont);
}

function licht(szene) {
  szene.add(new THREE.HemisphereLight(FARBE.lichtHimmel, FARBE.lichtBoden, 1.3));
  const sonne = new THREE.DirectionalLight(FARBE.sonne, 2.2);
  sonne.castShadow = true;
  sonne.shadow.mapSize.set(1024, 1024);
  const k = sonne.shadow.camera;
  k.left = -15; k.right = 15; k.top = 15; k.bottom = -15; k.near = 1; k.far = 60;
  sonne.shadow.bias = -0.0006;
  sonne.shadow.normalBias = 0.03;
  sonne.shadow.radius = 3;
  szene.add(sonne, sonne.target);
  return sonne;
}

// Facettierte Wiese mit sanftem Höhenrauschen; unter der Halle flach.
function wiese(szene) {
  const geo = new THREE.PlaneGeometry(190, 190, 56, 56).toNonIndexed();
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position, farben = new Float32Array(p.count * 3), c = new THREE.Color(), d = new THREE.Color(FARBE.wieseDunkel);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const abstand = Math.max(Math.abs(x) - B - 3, Math.abs(z) - T - 3, 0);
    const h = (Math.sin(x * 0.21) * Math.cos(z * 0.17) + Math.sin(x * 0.05 + z * 0.08) * 1.6) * Math.min(1, abstand / 12);
    p.setY(i, h * 0.9 - 0.45);
  }
  for (let i = 0; i < p.count; i += 3) {
    c.set(FARBE.wiese).lerp(d, Math.random() * 0.6);
    for (let j = 0; j < 3; j++) farben.set([c.r, c.g, c.b], (i + j) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  geo.computeVertexNormals();
  const netz = new THREE.Mesh(geo, material('facette'));
  netz.receiveShadow = true;
  szene.add(netz);
}

// Hallenboden: leicht gefleckte Facetten in Hellgrau auf einer Diorama-Platte aus Birkenholz.
function halle(szene, kaesten) {
  const geo = new THREE.PlaneGeometry(HALLE.breite, HALLE.tiefe, 22, 16).toNonIndexed();
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position, farben = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    const mx = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, mz = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    const fliese = (Math.floor(mx / 2) + Math.floor(mz / 2)) % 2 ? 0.95 : 1;
    c.set(FARBE.boden).multiplyScalar(fliese * (0.975 + Math.random() * 0.035));
    for (let j = 0; j < 3; j++) farben.set([c.r, c.g, c.b], (i + j) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(farben, 3));
  const boden = new THREE.Mesh(geo, material('facette'));
  boden.position.y = 0.01;
  boden.receiveShadow = true;
  szene.add(boden);

  const h = HALLE.wandHoehe, d = HALLE.wandDicke, band = 0.7;
  const wand = (x, z, b, t) => [
    [() => quader(b, h - band, t), FARBE.wand, [x, (h - band) / 2, z]],
    [() => quader(b + 0.06, band, t + 0.06), FARBE.blau, [x, h - band / 2, z]],
  ];
  const huelle = baueNetz([
    [() => quader(HALLE.breite + 1.2, 0.8, HALLE.tiefe + 1.2), FARBE.birke, [0, -0.4, 0]],
    [() => quader(HALLE.breite + 1.3, 0.12, HALLE.tiefe + 1.3), FARBE.birkeDunkel, [0, -0.06, 0]],
    ...wand(0, -T - d / 2, HALLE.breite + 2 * d, d),
    ...wand(-B - d / 2, 0, d, HALLE.tiefe),
    ...wand(B + d / 2, 0, d, HALLE.tiefe),
  ]);
  szene.add(huelle);
  kaesten.push([-B - 2, -T - 2, B + 2, -T], [-B - 2, -T, -B, T + 2], [B, -T, B + 2, T + 2], [-B, T - 0.6, B, T + 2]);
}

// Pfälzerwald: Nadelbäume als ein InstancedMesh hinter und neben der Halle.
function wald(szene) {
  const stellen = [];
  for (let i = 0; i < 150; i++) {
    const x = (Math.random() * 2 - 1) * 70, z = -T - 4 - Math.random() * 40;
    const seite = Math.random() < 0.5 ? -1 : 1;
    if (i % 3 === 0) stellen.push([seite * (B + 5 + Math.random() * 30), (Math.random() * 2 - 1) * 30, Math.random() * 6, 0.8 + Math.random() * 0.7]);
    else stellen.push([x, z, Math.random() * 6, 0.8 + Math.random() * 0.8]);
  }
  szene.add(baueViele([
    [() => zylinder(0.25, 0.32, 1.4, 6), FARBE.stamm, [0, 0.7, 0]],
    [() => kegel(1.7, 3.2, 7), FARBE.wald, [0, 2.6, 0]],
    [() => kegel(1.3, 2.6, 7), FARBE.waldHell, [0, 3.9, 0]],
    [() => kegel(0.85, 1.9, 7), FARBE.wald, [0, 5.0, 0]],
  ], stellen, { y: -0.4, farbVar: 0.25, schatten: false }));
}

export function erstelleWelt(szene) {
  const kaesten = []; // [x1, z1, x2, z2]
  himmel(szene);
  const sonne = licht(szene);
  wiese(szene);
  halle(szene, kaesten);
  wald(szene);
  baueRequisiten(szene, kaesten);

  const SONNE_VERSATZ = new THREE.Vector3(9, 18, 10), texel = 30 / 1024;
  return {
    kaesten,
    // Schattenausschnitt folgt dem Spieler, auf Texel gerastert gegen Flimmern
    folgeSonne(pos) {
      const x = Math.round(pos.x / texel) * texel, z = Math.round(pos.z / texel) * texel;
      sonne.target.position.set(x, 0, z);
      sonne.position.set(x + SONNE_VERSATZ.x, SONNE_VERSATZ.y, z + SONNE_VERSATZ.z);
    },
    // Schiebt einen Kreis (Mittelpunkt p, Radius r) aus allen Kästen heraus
    schiebeRaus(p, r) {
      for (const [x1, z1, x2, z2] of kaesten) {
        const cx = Math.min(Math.max(p.x, x1), x2), cz = Math.min(Math.max(p.z, z1), z2);
        const dx = p.x - cx, dz = p.z - cz, d2 = dx * dx + dz * dz;
        if (d2 >= r * r) continue;
        if (d2 > 1e-8) { const d = Math.sqrt(d2), k = (r - d) / d; p.x += dx * k; p.z += dz * k; }
        else {
          const wege = [p.x - x1 + r, x2 - p.x + r, p.z - z1 + r, z2 - p.z + r], m = Math.min(...wege);
          if (m === wege[0]) p.x = x1 - r; else if (m === wege[1]) p.x = x2 + r; else if (m === wege[2]) p.z = z1 - r; else p.z = z2 + r;
        }
      }
    },
  };
}
