// Renderer mit Schatten und ACESFilmic-Tonemapping sowie Leistungsanpassung:
// Liegt die Bildrate 2 s lang unter 45 Bildern/s, sinkt das Pixelverhältnis stufenweise (2 → 1,5 → 1,25).
import * as THREE from 'three';

export function erstelleRenderer(behaelter) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const stufen = [2, 1.5, 1.25].map((s) => Math.min(s, dpr)).filter((s, i, a) => a.indexOf(s) === i);
  let stufe = 0, messZeit = 0, messBilder = 0;
  renderer.setPixelRatio(stufen[0]);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  behaelter.appendChild(renderer.domElement);
  return {
    renderer,
    get pixelRatio() { return stufen[stufe]; },
    // echt = tatsächliche Bildzeit in Sekunden; nur während des Spiels aufrufen
    messe(echt) {
      if (echt >= 0.5) return;
      messZeit += echt;
      messBilder++;
      if (messZeit <= 2) return;
      if (messBilder / messZeit < 45 && stufe < stufen.length - 1) renderer.setPixelRatio(stufen[++stufe]);
      messZeit = messBilder = 0;
    },
  };
}
