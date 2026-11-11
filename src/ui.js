// HTML-Oberfläche über dem Spiel: Menü mit Charakter-Editor (auch als Umkleide), Pause, Knöpfe, HUD,
// Haus-Funk, Missions-Tafel für Fragen und Minispiele, Sprechblase, Überblendung und kurze Hinweise.
import { Z, speicher } from './zustand.js';
import { ton } from './audio.js';
import { ART } from './lerninhalte.js';

const $ = (id) => document.getElementById(id);
const AKTION = { rot: ['❗', 'Notfall'], gelb: ['🤝', 'Helfen'], gruen: ['✅', 'Aufgabe'] };

export function erstelleUI({ start, weiter, pause, aktion, zuruecksetzen }) {
  const el = {
    menue: $('menue'), pause: $('pause'), joy: $('joyzone'), aktion: $('aktion'), aktionText: $('aktionText'), pauseKnopf: $('pauseKnopf'),
    start: $('startKnopf'), toast: $('toast'), blende: $('blende'), hud: $('hud'), funk: $('funk'), blase: $('blase'), reset: $('resetKnopf'),
    dialog: $('dialog'), dTitel: $('dTitel'), dOrt: $('dOrt'), dText: $('dText'), dFrage: $('dFrage'), dBox: $('dAntworten'),
    dRueck: $('dRueck'), dWeiter: $('dWeiter'),
  };
  const tippen = (knopf, f) => knopf.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); f(); });
  let toastUhr = 0, aktionArt = null, dialogAktiv = false, dialogFertig = null, umkleideFertig = null, resetBereit = false;

  // Startknopf: im Startmenü „Schicht starten“, in der Umkleide „Fertig“
  tippen(el.start, () => {
    if (el.start.disabled) return;
    ton.klick();
    if (!umkleideFertig) { start(); return; }
    const f = umkleideFertig;
    umkleideFertig = null;
    el.menue.classList.remove('umkleide');
    el.menue.hidden = true;
    el.start.textContent = 'Schicht starten';
    document.body.classList.remove('dialog');
    f();
  });
  tippen($('weiterKnopf'), () => { ton.klick(); weiter(); });
  tippen(el.pauseKnopf, () => { ton.klick(); pause(); });
  tippen(el.aktion, aktion);
  // Zurücksetzen braucht zwei Tipper (Dialoge wie confirm() gibt es im Spiel-Link nicht)
  tippen(el.reset, () => {
    ton.klick();
    if (!resetBereit) { resetBereit = true; el.reset.textContent = 'Wirklich? Nochmal tippen'; return; }
    resetBereit = false;
    el.reset.textContent = 'Missionen zurücksetzen';
    zuruecksetzen();
  });

  function toast(text, ms = 3200) {
    el.toast.textContent = text;
    el.toast.hidden = false;
    clearTimeout(toastUhr);
    toastUhr = setTimeout(() => { el.toast.hidden = true; }, ms);
  }
  function schliesse() {
    el.dialog.hidden = true;
    el.dBox.replaceChildren();
    el.dBox.taste = null;
    dialogAktiv = false;
    document.body.classList.remove('dialog');
    const f = dialogFertig;
    dialogFertig = null;
    f?.();
  }
  tippen(el.dWeiter, () => { ton.klick(); schliesse(); });

  return {
    toast,
    schliesse,
    bereit() { el.start.disabled = false; el.start.textContent = 'Schicht starten'; },
    zeige(zustand) {
      const spiel = zustand === Z.SPIEL;
      el.menue.hidden = !(zustand === Z.MENUE || (spiel && umkleideFertig));
      el.pause.hidden = zustand !== Z.PAUSE;
      el.hud.hidden = zustand === Z.MENUE;
      el.joy.hidden = el.aktion.hidden = el.pauseKnopf.hidden = !spiel;
      el.aktionText.hidden = !spiel || !el.aktionText.textContent;
      el.dialog.hidden = !(spiel && dialogAktiv);
      if (!spiel) { el.blase.hidden = true; el.funk.hidden = true; resetBereit = false; el.reset.textContent = 'Missionen zurücksetzen'; }
      if (spiel && !speicher.laden('steuerungGesehen', false)) {
        toast('Zieh links, um zu laufen. Rechts tippen: helfen, umziehen, winken.', 5000);
        speicher.speichern('steuerungGesehen', true);
      }
    },
    // Umkleide: Charakter-Editor im Spiel öffnen; fertig() nach „Fertig“
    umkleide(fertig) {
      umkleideFertig = fertig;
      el.menue.classList.add('umkleide');
      el.start.textContent = 'Fertig';
      el.menue.hidden = false;
      document.body.classList.add('dialog');
    },
    // HUD oben links: Shirt-Farbe, Abteilung, Etage, Lernpunkte und erledigte Missionen
    hud({ def, shirt, abteilung, punkte, erledigt, gesamt }) {
      const symbol = document.createElement('span');
      symbol.className = 'shirt ' + shirt;
      symbol.textContent = '👕';
      el.hud.replaceChildren(symbol, ` ${abteilung} · ${def.kurz}   ⭐ ${punkte}   ✔ ${erledigt}/${gesamt}`);
    },
    // Funk-Streifen oben: rot für Notfälle, blau für die Wagen-Rallye
    funk(text, blau = false) {
      el.funk.hidden = !text;
      el.funk.classList.toggle('blau', blau);
      if (text && el.funk.textContent !== text) el.funk.textContent = text;
    },
    // Aktionsknopf zeigt, was in der Nähe möglich ist (sonst Winken)
    aktion(p) {
      const art = p ? p.art + (p.ziel ?? p.farbe ?? '') : '';
      if (art === aktionArt) return;
      aktionArt = art;
      const [symbol, text] = !p ? ['👋', ''] : p.art === 'aufzug' ? [p.ziel === 'og' ? '⬆️' : '⬇️', 'Aufzug']
        : p.art === 'spind' ? ['👕', 'Umkleide'] : p.art === 'kunde' ? ['❓', 'Helfen'] : p.art === 'rallye' ? ['🛒', 'Rallye'] : p.art === 'mission' ? AKTION[p.farbe] : ['❗', ''];
      el.aktion.textContent = symbol;
      el.aktion.setAttribute('aria-label', text || 'Winken');
      el.aktionText.textContent = text;
      el.aktionText.hidden = !text;
    },
    // Missions-Tafel: aufbau(box, melde) füllt den Inhalt (Antworten oder Minispiel); melde({ richtig, text })
    // zeigt Lob oder Denk-Tipp. Nach dem Erfolg erscheint „Weiter“, danach wird fertig() gerufen.
    tafel(m, aufbau, fertig) {
      el.dialog.dataset.art = m.art;
      el.dTitel.textContent = m.ueberschrift ?? `${ART[m.art].zeichen} ${ART[m.art].name}: ${m.titel}`;
      el.dOrt.textContent = m.bereich ?? '';
      el.dText.textContent = m.text ?? '';
      el.dFrage.textContent = m.frage ?? '';
      el.dRueck.hidden = el.dWeiter.hidden = true;
      el.dBox.replaceChildren();
      el.dBox.taste = null;
      aufbau(el.dBox, ({ richtig, text }) => {
        el.dRueck.textContent = text;
        el.dRueck.className = richtig ? 'ok' : 'falsch';
        el.dRueck.hidden = false;
        if (!richtig) { ton.falsch(); return; }
        ton.richtig();
        el.dBox.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        el.dBox.taste = null;
        el.dWeiter.hidden = false;
      });
      dialogFertig = fertig;
      dialogAktiv = true;
      document.body.classList.add('dialog');
      el.dialog.hidden = false;
    },
    // Leertaste / U bei offener Tafel: Minispiel-Aktion oder „Weiter“
    taste() {
      if (!dialogAktiv) return;
      if (!el.dWeiter.hidden) { ton.klick(); schliesse(); } else el.dBox.taste?.();
    },
    // Sprechblase an Bildschirmposition (x, y) über einem Kopf; text = null blendet sie aus
    blase(text, x, y) {
      if (!text) { el.blase.hidden = true; return; }
      if (el.blase.textContent !== text) el.blase.textContent = text;
      el.blase.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -100%)`;
      el.blase.hidden = false;
    },
    // Kurze Überblendung: abdunkeln, fn ausführen, wieder aufblenden
    blende(fn) {
      el.blende.classList.add('an');
      setTimeout(() => { try { fn(); } finally { el.blende.classList.remove('an'); } }, 280);
    },
  };
}
