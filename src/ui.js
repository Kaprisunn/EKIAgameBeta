// HTML-Oberfläche über dem Spiel: Menü, Pause, Knöpfe, kurze Hinweise.
import { Z, speicher } from './zustand.js';
import { ton } from './audio.js';

const $ = (id) => document.getElementById(id);

export function erstelleUI({ start, weiter, pause, aktion }) {
  const el = {
    menue: $('menue'), pause: $('pause'), joy: $('joyzone'), aktion: $('aktion'),
    pauseKnopf: $('pauseKnopf'), start: $('startKnopf'), toast: $('toast'),
  };
  const tippen = (knopf, f) => knopf.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); f(); });
  tippen(el.start, () => { if (!el.start.disabled) { ton.klick(); start(); } });
  tippen($('weiterKnopf'), () => { ton.klick(); weiter(); });
  tippen(el.pauseKnopf, () => { ton.klick(); pause(); });
  tippen(el.aktion, aktion);

  let toastUhr = 0;
  function toast(text, ms = 3200) {
    el.toast.textContent = text;
    el.toast.hidden = false;
    clearTimeout(toastUhr);
    toastUhr = setTimeout(() => { el.toast.hidden = true; }, ms);
  }

  return {
    toast,
    bereit() { el.start.disabled = false; el.start.textContent = 'Schicht starten'; },
    zeige(zustand) {
      const spiel = zustand === Z.SPIEL;
      el.menue.hidden = zustand !== Z.MENUE;
      el.pause.hidden = zustand !== Z.PAUSE;
      el.joy.hidden = el.aktion.hidden = el.pauseKnopf.hidden = !spiel;
      if (spiel && !speicher.laden('steuerungGesehen', false)) {
        toast('Zieh links mit dem Finger, um zu laufen. 👋 rechts zum Winken.', 5000);
        speicher.speichern('steuerungGesehen', true);
      }
    },
  };
}
