// Schilder mit Text: Alle Wörter werden einmal in EINE selbst gezeichnete Textur (Atlas) gemalt.
// Alle Schilder einer Etage zusammen sind ein Mesh und kosten nur einen Draw Call.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { teil, zylinder } from './formen.js';
import { FARBE } from './daten.js';

const STIL = { blau: ['#0058ab', '#fbd914'], gelb: ['#fbd914', '#0058ab'], weiss: ['#ffffff', '#0058ab'], warn: ['#fbd914', '#1f1f1f'] };
const BREITE = 2048, HOEHE = 1024, ZEILE = 80;
const schrift = (px) => `800 ${px}px ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Helvetica Neue", Arial, sans-serif`;

export function erstelleSchilder() {
  const leinwand = document.createElement('canvas');
  leinwand.width = BREITE;
  leinwand.height = HOEHE;
  const ctx = leinwand.getContext('2d');
  const textur = new THREE.CanvasTexture(leinwand);
  textur.colorSpace = THREE.SRGBColorSpace;
  textur.anisotropy = 4;
  const mat = new THREE.MeshBasicMaterial({ map: textur, alphaTest: 0.5, toneMapped: false });
  const plaetze = new Map();
  let x = 0, y = 0;

  // Reserviert einen Platz im Atlas und malt das Schild (abgerundetes Feld mit Text)
  function platz(text, stil) {
    const schluessel = stil + '|' + text;
    if (plaetze.has(schluessel)) return plaetze.get(schluessel);
    let px = 50;
    do { ctx.font = schrift(px); px -= 4; } while (ctx.measureText(text).width + 56 > BREITE && px > 20);
    const b = Math.ceil(ctx.measureText(text).width) + 56;
    if (x + b > BREITE) { x = 0; y += ZEILE; }
    if (y + ZEILE > HOEHE) throw new Error('Schilder-Atlas ist voll');
    const [grund, farbe] = STIL[stil] ?? STIL.gelb;
    ctx.fillStyle = grund;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x + 4, y + 4, b - 8, ZEILE - 8, 20); else ctx.rect(x + 4, y + 4, b - 8, ZEILE - 8);
    ctx.fill();
    ctx.fillStyle = farbe;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + b / 2, y + ZEILE / 2 + 2);
    const p = { u0: x / BREITE, u1: (x + b) / BREITE, v0: 1 - (y + ZEILE) / HOEHE, v1: 1 - y / HOEHE, verh: b / ZEILE };
    x += b;
    plaetze.set(schluessel, p);
    return p;
  }

  return {
    // liste: [text, x, y, z, höhe, stil, kipp, drehY, seile]; Halteseile kommen als Teile in `statisch`
    baue(liste = [], statisch) {
      const geos = [], e = new THREE.Euler(), m = new THREE.Matrix4();
      for (const [text, sx, sy, sz, h, stil = 'gelb', kipp = 0, dreh = 0, seile = false] of liste) {
        const p = platz(text, stil), b = h * p.verh, geo = new THREE.PlaneGeometry(b, h), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, p.u0 + uv.getX(i) * (p.u1 - p.u0), p.v0 + uv.getY(i) * (p.v1 - p.v0));
        geos.push(geo.applyMatrix4(m.makeRotationFromEuler(e.set(-kipp, dreh, 0, 'YXZ')).setPosition(sx, sy, sz)));
        if (seile) for (const s of [-0.4, 0.4]) statisch.push(teil(zylinder(0.015, 0.015, 5.2 - sy, 4), FARBE.dunkelgrau, [sx + s * b, (5.2 + sy) / 2, sz]));
      }
      textur.needsUpdate = true;
      return geos.length ? new THREE.Mesh(mergeGeometries(geos), mat) : new THREE.Group();
    },
  };
}
