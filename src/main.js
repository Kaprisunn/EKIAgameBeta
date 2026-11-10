// Einstieg: Renderer, Szene, Spielschleife mit Zuständen, Leistungsanpassung, Fehleranzeige.
import * as THREE from 'three';
import { erstelleWelt } from './welt.js';
import { erstelleSpieler } from './spieler.js';
import { erstelleKamera } from './kamera.js';
import { erstelleEingabe } from './eingabe.js';
import { erstelleUI } from './ui.js';
import { erstelleZustand, Z } from './zustand.js';

const zeigeFehler = window.__zeigeFehler || ((e) => console.error(e));

function starte() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const stufen = [2, 1.5, 1.25].map((s) => Math.min(s, dpr)).filter((s, i, a) => a.indexOf(s) === i);
  let stufe = 0;
  renderer.setPixelRatio(stufen[0]);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.getElementById('spiel').appendChild(renderer.domElement);

  const szene = new THREE.Scene();
  const welt = erstelleWelt(szene);
  const spieler = erstelleSpieler(szene, welt);
  const kam = erstelleKamera();
  const zustand = erstelleZustand();
  let neuZeichnen = true;

  const umschaltenPause = () => {
    if (zustand.get() === Z.SPIEL) zustand.setze(Z.PAUSE);
    else if (zustand.get() === Z.PAUSE) zustand.setze(Z.SPIEL);
  };
  const ui = erstelleUI({
    start: () => zustand.setze(Z.SPIEL),
    weiter: () => zustand.setze(Z.SPIEL),
    pause: umschaltenPause,
    aktion: () => { if (zustand.get() === Z.SPIEL) spieler.winken(); },
  });
  const eingabe = erstelleEingabe({
    aktion: () => { if (zustand.get() === Z.SPIEL) spieler.winken(); },
    pause: umschaltenPause,
    start: () => { if (zustand.get() !== Z.SPIEL) zustand.setze(Z.SPIEL); },
  });
  zustand.beiWechsel((neu) => { ui.zeige(neu); eingabe.zuruecksetzen(); neuZeichnen = true; });
  ui.zeige(Z.MENUE);
  document.addEventListener('visibilitychange', () => { if (document.hidden && zustand.get() === Z.SPIEL) zustand.setze(Z.PAUSE); });

  function groesse() {
    const b = window.innerWidth, h = window.innerHeight;
    renderer.setSize(b, h);
    kam.groesse(b, h);
    neuZeichnen = true;
  }
  window.addEventListener('resize', groesse);
  window.visualViewport?.addEventListener('resize', groesse);
  groesse();
  kam.folge(spieler.pos, spieler.tempo, 0, true);

  const info = (window.__info = { drawCalls: 0, dreiecke: 0, pixelRatio: stufen[0], zustand: Z.MENUE });
  let letzte = performance.now(), messZeit = 0, messBilder = 0;

  renderer.setAnimationLoop((jetzt) => {
    try {
      const echt = (jetzt - letzte) / 1000;
      letzte = jetzt;
      const dt = Math.min(echt, 0.05);
      const z = zustand.get();
      info.zustand = z;
      if (z === Z.PAUSE && !neuZeichnen) return;
      neuZeichnen = false;

      if (z !== Z.PAUSE) {
        spieler.update(dt, eingabe.richtung(), z === Z.SPIEL);
        kam.folge(spieler.pos, spieler.tempo, dt);
        welt.folgeSonne(spieler.pos);
      }
      renderer.render(szene, kam.kamera);
      info.drawCalls = renderer.info.render.calls;
      info.dreiecke = renderer.info.render.triangles;

      // Leistung: nach je 2 s Spielzeit unter 45 Bildern/s das Pixelverhältnis stufenweise senken
      if (z === Z.SPIEL && echt < 0.5) {
        messZeit += echt; messBilder++;
        if (messZeit > 2) {
          if (messBilder / messZeit < 45 && stufe < stufen.length - 1) {
            renderer.setPixelRatio(stufen[++stufe]);
            info.pixelRatio = stufen[stufe];
          }
          messZeit = messBilder = 0;
        }
      }
    } catch (e) {
      renderer.setAnimationLoop(null);
      zeigeFehler(e);
    }
  });

  ui.bereit();
  window.__bereit = true;
}

try { starte(); } catch (e) { zeigeFehler(e); }
