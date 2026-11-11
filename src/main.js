// Einstieg: Renderer, Szene, Spielschleife mit Zuständen, Etagenwechsel, Kleiderordnung, Missionen,
// Leistungsanpassung und Fehleranzeige.
import * as THREE from 'three';
import { erstelleWelt } from './welt.js';
import { erstelleSpieler } from './spieler.js';
import { erstelleKamera } from './kamera.js';
import { erstelleEingabe } from './eingabe.js';
import { erstelleUI } from './ui.js';
import { erstelleInteraktion } from './interaktion.js';
import { erstelleLeute } from './npc.js';
import { erstelleMissionen } from './missionen.js';
import { erstelleZustand, Z, speicher } from './zustand.js';
import { ton } from './audio.js';

const zeigeFehler = window.__zeigeFehler || ((e) => console.error(e));
const SHIRT_TEXT = { gelb: 'Gelb: Verkauf, Kasse, Service und Fundgrube', blau: 'Blau: Logistik und Restaurant' };

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
  // Kleiderordnung: gelbes oder blaues Shirt (gespeichert). Blau öffnet auch die Logistik-Schranke.
  let shirt = speicher.laden('shirt', 'gelb');
  const spieler = erstelleSpieler(szene, welt, shirt);
  const leute = erstelleLeute(welt);
  const kam = erstelleKamera();
  const zustand = erstelleZustand();
  let neuZeichnen = true, tafelOffen = false;

  const hud = () => ui.hud({ def: welt.etage.def, shirt, punkte: missionen.punkte, erledigt: missionen.erledigt, gesamt: missionen.gesamt });
  function setzeShirt(farbe) {
    shirt = farbe;
    speicher.speichern('shirt', shirt);
    spieler.setzeShirt(shirt);
    ui.wahl(shirt);
    hud();
  }
  // Etagenwechsel mit kurzer Überblendung; die Figur landet am Ankunftspunkt der Ziel-Etage
  function wechsleEtage(p) {
    ui.blende(() => {
      welt.zeige(p.ziel);
      const [x, z, dreh] = p.ankunft;
      spieler.teleport(x, z, dreh);
      kam.folge(spieler.pos, spieler.tempo, 0, true);
      welt.folgeSonne(spieler.pos);
      hud();
    });
  }
  function missionFertig() {
    tafelOffen = false;
    hud();
    if (missionen.erledigt === missionen.gesamt) ui.toast('Alle Missionen geschafft! Starke Schicht! 🎉', 5000);
  }
  const interaktion = erstelleInteraktion({
    treppe: wechsleEtage,
    aufzug: (p) => { ton.ding(); wechsleEtage(p); },
    schranke: () => { if (shirt !== 'blau') ui.toast('Nur für Logistik: Mit gelbem Shirt kein Zutritt. Am Spind kannst du dich umziehen.'); },
    spind: () => { setzeShirt(shirt === 'gelb' ? 'blau' : 'gelb'); ton.wechsel(); ui.toast(`Umgezogen! ${SHIRT_TEXT[shirt]}.`); },
    mission: (p) => { if (missionen.starte(p.mission, shirt, missionFertig)) tafelOffen = true; },
  });

  const aktion = () => {
    if (zustand.get() !== Z.SPIEL || tafelOffen) return;
    if (interaktion.nah) interaktion.ausloesen();
    else { spieler.winken(); leute.winken(spieler.pos); }
  };
  const umschaltenPause = () => {
    if (zustand.get() === Z.SPIEL) zustand.setze(Z.PAUSE);
    else if (zustand.get() === Z.PAUSE) zustand.setze(Z.SPIEL);
  };
  const ui = erstelleUI({
    start: () => zustand.setze(Z.SPIEL),
    weiter: () => zustand.setze(Z.SPIEL),
    pause: umschaltenPause,
    aktion,
    shirt: setzeShirt,
    zuruecksetzen: () => { missionen.zuruecksetzen(); hud(); ui.toast('Alle Missionen sind wieder offen.'); },
  });
  const missionen = erstelleMissionen({ welt, leute, ui });
  const eingabe = erstelleEingabe({
    aktion,
    pause: umschaltenPause,
    start: () => { if (zustand.get() === Z.MENUE) zustand.setze(Z.SPIEL); },
  });
  zustand.beiWechsel((neu) => { ui.zeige(neu); eingabe.zuruecksetzen(); neuZeichnen = true; });
  ui.zeige(Z.MENUE);
  ui.wahl(shirt);
  hud();
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

  const info = (window.__info = { drawCalls: 0, dreiecke: 0, pixelRatio: stufen[0], zustand: Z.MENUE, etage: welt.etage.id });
  // Testhilfe für tools/check.mjs und Fehlersuche
  window.__test = {
    etage: (id, x = -20, z = 18.5) => { welt.zeige(id); spieler.teleport(x, z); kam.folge(spieler.pos, spieler.tempo, 0, true); hud(); },
    shirt: setzeShirt,
    mission: (id) => missionen.starte(id, shirt, missionFertig) && (tafelOffen = true),
  };
  let letzte = performance.now(), messZeit = 0, messBilder = 0;

  // Sprechblase über dem Kopf: 3D-Punkt in Bildschirmkoordinaten umrechnen
  const kopf = new THREE.Vector3();
  function zeigeBlase(b) {
    if (!b) return ui.blase(null);
    kopf.set(b.x, b.y, b.z).project(kam.kamera);
    ui.blase(b.text, (kopf.x * 0.5 + 0.5) * window.innerWidth, (-kopf.y * 0.5 + 0.5) * window.innerHeight);
  }

  renderer.setAnimationLoop((jetzt) => {
    try {
      const echt = (jetzt - letzte) / 1000;
      letzte = jetzt;
      const dt = Math.min(echt, 0.05);
      const z = zustand.get();
      info.zustand = z;
      info.etage = welt.etage.id;
      if (z === Z.PAUSE && !neuZeichnen) return;
      neuZeichnen = false;

      if (z !== Z.PAUSE) {
        spieler.update(dt, eingabe.richtung(), z === Z.SPIEL && !tafelOffen);
        leute.update(dt, welt.etage.id, spieler.pos);
        leute.schiebeSpieler(spieler.pos);
        welt.update(dt, spieler.pos, shirt === 'blau' ? 'logistik' : 'verkauf');
        const funk = missionen.update(dt, welt.etage.id);
        if (z === Z.SPIEL) {
          ui.aktion(tafelOffen ? null : interaktion.update(welt.etage.punkte, spieler.pos));
          ui.funk(funk);
        }
        kam.folge(spieler.pos, spieler.tempo, dt);
        welt.folgeSonne(spieler.pos);
        zeigeBlase(z === Z.SPIEL && !tafelOffen ? leute.blase : null);
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
