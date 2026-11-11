// Wissens-Quiz im Pausenraum: 3 zufällige Fragen aus Missionen und Kundenfragen, je 5 Extrapunkte,
// wenn die erste Antwort stimmt. Einmal pro Schicht.
import { MISSIONEN } from './lerninhalte.js';
import { HILFE, ENGLISCH } from './kundenhilfe.js';
import { auswahl } from './minispiele.js';

const POOL = [...MISSIONEN.filter((m) => !m.typ), ...Object.values(HILFE).flat(), ...ENGLISCH];

export function erstelleQuiz({ ui, missionen, abzeichen }) {
  let gespielt = false;
  return {
    neueSchicht() { gespielt = false; },
    starte(fertig) {
      if (gespielt) { ui.toast('Das Wissens-Quiz gibt es in der nächsten Schicht wieder.'); return false; }
      gespielt = true;
      const fragen = [...POOL].sort(() => Math.random() - 0.5).slice(0, 3);
      let i = 0, richtig = 0;
      const naechste = () => {
        const f = fragen[i], m = { ...f, art: 'kunde', ueberschrift: `🧠 Wissens-Quiz · Frage ${i + 1} von 3`, bereich: `Pausenraum · ${f.bereich}` };
        let erster = true;
        ui.tafel(m, (box, melde) => auswahl(box, f, (ok) => {
          if (!ok) { erster = false; melde({ richtig: false, text: `Noch nicht ganz. Denk-Tipp: ${f.tipp}` }); return; }
          if (erster) { richtig++; missionen.punkteDazu(5); }
          melde({ richtig: true, text: `${erster ? 'Richtig! +5 Punkte.' : 'Jetzt stimmt es.'} ${f.warum}` });
        }), () => {
          if (++i < fragen.length) { naechste(); return; }
          abzeichen.zaehle('quiz');
          if (richtig === fragen.length) abzeichen.zaehle('quizVoll');
          ui.toast(`Quiz geschafft: ${richtig} von ${fragen.length} auf Anhieb richtig.`, 4000);
          fertig();
        });
      };
      naechste();
      return true;
    },
  };
}
