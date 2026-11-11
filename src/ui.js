// HTML-Oberfläche über dem Spiel: Menü (mit Shirt-Wahl), Pause, Knöpfe, HUD, Haus-Funk, Frage-Tafel,
// Sprechblase, Überblendung und kurze Hinweise.
import { Z, speicher } from './zustand.js';
import { ton } from './audio.js';
import { ART } from './lerninhalte.js';

const $ = (id) => document.getElementById(id);
const AKTION = { rot: ['❗', 'Notfall'], gelb: ['🤝', 'Helfen'], gruen: ['✅', 'Aufgabe'] };

export function erstelleUI({ start, weiter, pause, aktion, shirt, zuruecksetzen }) {
  const el = {
    menue: $('menue'), pause: $('pause'), joy: $('joyzone'), aktion: $('aktion'), aktionText: $('aktionText'), pauseKnopf: $('pauseKnopf'),
    start: $('startKnopf'), toast: $('toast'), blende: $('blende'), hud: $('hud'), funk: $('funk'), blase: $('blase'), reset: $('resetKnopf'),
    dialog: $('dialog'), dTitel: $('dTitel'), dOrt: $('dOrt'), dText: $('dText'), dFrage: $('dFrage'), dAntworten: $('dAntworten'),
    dRueck: $('dRueck'), dWeiter: $('dWeiter'), wahlGelb: $('wahlGelb'), wahlBlau: $('wahlBlau'),
  };
  const tippen = (knopf, f) => knopf.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); f(); });
  tippen(el.start, () => { if (!el.start.disabled) { ton.klick(); start(); } });
  tippen($('weiterKnopf'), () => { ton.klick(); weiter(); });
  tippen(el.pauseKnopf, () => { ton.klick(); pause(); });
  tippen(el.aktion, aktion);
  tippen(el.wahlGelb, () => { ton.klick(); shirt('gelb'); });
  tippen(el.wahlBlau, () => { ton.klick(); shirt('blau'); });
  // Zurücksetzen braucht zwei Tipper (Dialoge wie confirm() gibt es im Spiel-Link nicht)
  let resetBereit = false;
  tippen(el.reset, () => {
    ton.klick();
    if (!resetBereit) { resetBereit = true; el.reset.textContent = 'Wirklich? Nochmal tippen'; return; }
    resetBereit = false;
    el.reset.textContent = 'Missionen zurücksetzen';
    zuruecksetzen();
  });

  let toastUhr = 0, aktionArt = null, dialogAktiv = false, dialogFertig = null;
  function toast(text, ms = 3200) {
    el.toast.textContent = text;
    el.toast.hidden = false;
    clearTimeout(toastUhr);
    toastUhr = setTimeout(() => { el.toast.hidden = true; }, ms);
  }
  tippen(el.dWeiter, () => {
    ton.klick();
    el.dialog.hidden = true;
    dialogAktiv = false;
    document.body.classList.remove('dialog');
    dialogFertig?.();
  });

  return {
    toast,
    bereit() { el.start.disabled = false; el.start.textContent = 'Schicht starten'; },
    zeige(zustand) {
      const spiel = zustand === Z.SPIEL;
      el.menue.hidden = zustand !== Z.MENUE;
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
    // HUD oben links: Shirt-Farbe, Etage, Lernpunkte und erledigte Missionen
    hud({ def, shirt: farbe, punkte, erledigt, gesamt }) {
      const symbol = document.createElement('span');
      symbol.className = 'shirt ' + farbe;
      symbol.textContent = '👕';
      el.hud.replaceChildren(symbol, ` ${def.kurz} · ${def.name}   ⭐ ${punkte}   ✔ ${erledigt}/${gesamt}`);
    },
    funk(text) {
      el.funk.hidden = !text;
      if (text && el.funk.textContent !== text) el.funk.textContent = text;
    },
    wahl(farbe) {
      el.wahlGelb.classList.toggle('gewaehlt', farbe === 'gelb');
      el.wahlBlau.classList.toggle('gewaehlt', farbe === 'blau');
    },
    // Aktionsknopf zeigt, was in der Nähe möglich ist (sonst Winken)
    aktion(p) {
      const art = p ? p.art + (p.ziel ?? p.farbe ?? '') : '';
      if (art === aktionArt) return;
      aktionArt = art;
      const [symbol, text] = !p ? ['👋', ''] : p.art === 'aufzug' ? [p.ziel === 'og' ? '⬆️' : '⬇️', 'Aufzug']
        : p.art === 'spind' ? ['👕', 'Umziehen'] : p.art === 'mission' ? AKTION[p.farbe] : ['❗', ''];
      el.aktion.textContent = symbol;
      el.aktion.setAttribute('aria-label', text || 'Winken');
      el.aktionText.textContent = text;
      el.aktionText.hidden = !text;
    },
    // Frage-Tafel mit drei Antworten. beantworten(i) liefert { richtig, text }; fertig() nach „Weiter“.
    frage(m, beantworten, fertig) {
      el.dialog.dataset.art = m.art;
      el.dTitel.textContent = `${ART[m.art].zeichen} ${ART[m.art].name}: ${m.titel}`;
      el.dOrt.textContent = m.bereich;
      el.dText.textContent = m.text;
      el.dFrage.textContent = m.frage;
      el.dRueck.hidden = el.dWeiter.hidden = true;
      el.dAntworten.replaceChildren(...m.antworten.map((a, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'antwort';
        b.textContent = `${'ABC'[i]}  ${a}`;
        tippen(b, () => {
          if (b.disabled) return;
          const r = beantworten(i);
          el.dRueck.textContent = r.text;
          el.dRueck.className = r.richtig ? 'ok' : 'falsch';
          el.dRueck.hidden = false;
          if (r.richtig) {
            ton.richtig();
            el.dAntworten.querySelectorAll('button').forEach((x) => { x.disabled = true; });
            b.classList.add('richtig');
            el.dWeiter.hidden = false;
          } else {
            ton.falsch();
            b.disabled = true;
          }
        });
        return b;
      }));
      dialogFertig = fertig;
      dialogAktiv = true;
      document.body.classList.add('dialog');
      el.dialog.hidden = false;
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
