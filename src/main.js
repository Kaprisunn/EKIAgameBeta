// Einstieg: Renderer, Szene, Spielschleife mit Zuständen, Etagenwechsel, Charakter-Profil (Abteilung, Aussehen,
// Warnweste), Missionen mit Minispielen, Kundenfragen, Leistungsanpassung und Fehleranzeige.
import * as THREE from 'three';
import { erstelleWelt } from './welt.js';
import { erstelleSpieler, steckbriefAus } from './spieler.js';
import { erstelleKamera } from './kamera.js';
import { erstelleEingabe } from './eingabe.js';
import { erstelleUI } from './ui.js';
import { erstelleInteraktion } from './interaktion.js';
import { erstelleLeute } from './npc.js';
import { erstelleMissionen } from './missionen.js';
import { erstelleKundenfragen } from './kundenfragen.js';
import { erstelleRallye } from './rallye.js';
import { erstelleEditor } from './editor.js';
import { weste } from './minispiele.js';
import { ABTEILUNGEN } from './daten.js';
import { erstelleZustand, Z, speicher } from './zustand.js';
import { ton } from './audio.js';

const zeigeFehler = window.__zeigeFehler || ((e) => console.error(e));
const STANDARD = { abteilung: 'verkauf', geschlecht: 'w', haut: 'mittel', alter: 'jung' };
const BREIT = () => window.innerWidth >= 1000; // Menü steht links, Figur rechts daneben

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
  // Profil: Abteilung (bestimmt das Streifen-Shirt) und Aussehen, gespeichert. Die Warnweste gilt pro Schicht.
  const profil = { ...STANDARD, ...speicher.laden('profil', {}), weste: false };
  const shirt = () => ABTEILUNGEN[profil.abteilung].shirt;
  const spieler = erstelleSpieler(szene, welt, steckbriefAus(profil));
  const leute = erstelleLeute(welt);
  const kam = erstelleKamera();
  const zustand = erstelleZustand();
  let neuZeichnen = true, tafelOffen = false;

  const hud = () => ui.hud({ def: welt.etage.def, shirt: shirt(), abteilung: ABTEILUNGEN[profil.abteilung].name,
    punkte: missionen.punkte, erledigt: missionen.erledigt, gesamt: missionen.gesamt });
  function kleiden(effekt = true) {
    spieler.setze(steckbriefAus(profil), effekt);
    const { weste: _, ...gespeichert } = profil;
    speicher.speichern('profil', gespeichert);
    hud();
  }
  // Warnweste: Ohne Weste bleibt die Logistik-Schranke zu; die Tafel bietet die Weste an
  function warnweste() {
    tafelOffen = true;
    const m = { art: 'rot', ueberschrift: '🦺 Halt! Sicherheit geht vor.', bereich: 'Logistik',
      text: 'Im Lager fahren Stapler, und es wird schwer gehoben. Ohne Warnweste kein Zutritt!',
      frage: 'Warnweste anziehen?', abbrechen: () => ui.schliesse() };
    ui.tafel(m, (box, melde) => weste(box, m, () => {
      profil.weste = true;
      kleiden();
      ton.wechsel();
      melde({ richtig: true, text: 'Weste an! Jetzt sehen dich Staplerfahrer:innen sofort. Die Schranke öffnet sich.' });
    }), () => { tafelOffen = false; });
  }
  // Ebenenwechsel mit kurzer Überblendung; die Figur landet am Ankunftspunkt der Ziel-Ebene.
  // Danach kurze Sperre, damit Tür oder Treppe nicht sofort wieder auslösen (gegen Flackern).
  let sperreBis = 0;
  function wechsleEtage(p) {
    if (performance.now() < sperreBis) return;
    sperreBis = performance.now() + 900;
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
    tuer: (p) => { ton.tuer(); wechsleEtage(p); },
    rallye: () => { if (!rallye.aktiv) rallye.starte(); },
    schranke: () => { if (!profil.weste) warnweste(); },
    spind: () => {
      tafelOffen = true;
      if (BREIT()) kam.seitlich(-4.5);
      ui.umkleide(() => { tafelOffen = false; kam.seitlich(0); ui.toast(`Umgezogen: ${ABTEILUNGEN[profil.abteilung].name}.`); });
    },
    mission: (p) => { if (missionen.starte(p.mission, shirt(), missionFertig)) tafelOffen = true; },
    kunde: (p) => { tafelOffen = true; kundenfragen.starte(p, profil.abteilung, () => { tafelOffen = false; hud(); }); },
  });

  const aktion = () => {
    if (zustand.get() !== Z.SPIEL) return;
    if (tafelOffen) { ui.taste(); return; }
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
    zuruecksetzen: () => { missionen.zuruecksetzen(); hud(); ui.toast('Alle Missionen sind wieder offen.'); },
  });
  const missionen = erstelleMissionen({ welt, leute, ui });
  const kundenfragen = erstelleKundenfragen({ welt, leute, ui, missionen });
  const rallye = erstelleRallye({ welt, ui, missionen });
  // Neue Abteilung = neue Kleidung, die Warnweste muss dann neu angelegt werden
  erstelleEditor(document.getElementById('editor'), profil, (feld) => {
    if (feld === 'abteilung') profil.weste = false;
    kleiden(zustand.get() === Z.SPIEL);
  });
  const eingabe = erstelleEingabe({
    aktion,
    pause: umschaltenPause,
    start: () => { if (zustand.get() === Z.MENUE) zustand.setze(Z.SPIEL); },
  });
  zustand.beiWechsel((neu) => { ui.zeige(neu); eingabe.zuruecksetzen(); neuZeichnen = true; if (neu === Z.SPIEL && !tafelOffen) kam.seitlich(0); });
  ui.zeige(Z.MENUE);
  if (BREIT()) kam.seitlich(-4.5);
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
    profil: (p) => { Object.assign(profil, p); kleiden(false); },
    weste: warnweste,
    fragende: () => leute.fragende(welt.etage.id).length,
    rallye: () => rallye.starte(),
    pos: () => [Math.round(spieler.pos.x * 10) / 10, Math.round(spieler.pos.z * 10) / 10],
    mission: (id) => missionen.starte(id, shirt(), missionFertig) && (tafelOffen = true),
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
        kundenfragen.update(dt, welt.etage.id);
        rallye.update(dt, welt.etage.id, spieler.pos);
        welt.update(dt, spieler.pos, profil.weste ? 'logistik' : 'ohneWeste');
        const funk = missionen.update(dt, welt.etage.id);
        if (z === Z.SPIEL) {
          ui.aktion(tafelOffen ? null : interaktion.update(welt.etage.punkte, spieler.pos));
          ui.funk(rallye.aktiv ? rallye.text : funk, rallye.aktiv);
          if (rallye.aktiv) hud();
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
