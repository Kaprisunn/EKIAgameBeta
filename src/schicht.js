// Schicht: 6 Minuten Spielzeit (läuft nur im Spiel, nicht in Pause oder Tafeln). Danach oder über das Pausenmenü
// folgt der Schichtbericht: Punkte und Missionen dieser Schicht, 1 bis 3 Sterne, ein Lerntipp.
import { MISSIONEN } from './lerninhalte.js';

const DAUER = 360, STERNE = [35, 80]; // ab 35 Punkten 2 Sterne, ab 80 Punkten 3 Sterne

export function erstelleSchicht({ missionen }) {
  let zeit = 0, startPunkte = missionen.punkte, startErledigt = missionen.erledigt;
  return {
    get rest() { return Math.max(0, DAUER - zeit); },
    // liefert true, sobald die Schicht vorbei ist
    update(dt) { zeit += dt; return zeit >= DAUER; },
    bericht() {
      const punkte = missionen.punkte - startPunkte, erledigt = missionen.erledigt - startErledigt;
      const sterne = 1 + STERNE.filter((s) => punkte >= s).length;
      const tipp = MISSIONEN[Math.floor(Math.random() * MISSIONEN.length)].warum;
      return { punkte, erledigt, sterne, tipp, offen: missionen.gesamt - missionen.erledigt };
    },
    neu() { zeit = 0; startPunkte = missionen.punkte; startErledigt = missionen.erledigt; },
  };
}
