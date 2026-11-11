// Abzeichen Bronze/Silber/Gold: pro Missions-Bereich (Bronze ab 1, Silber ab der Hälfte, Gold bei allen Missionen)
// sowie für Kundenfragen, Parkplatz-Action und das Pausenraum-Quiz. Neue Stufen werden kurz eingeblendet.
import { GRUPPEN } from './lerninhalte.js';
import { speicher } from './zustand.js';

export const STUFEN = ['noch offen', '🥉 Bronze', '🥈 Silber', '🥇 Gold'];

export function erstelleAbzeichen({ missionen, ui }) {
  const z = { kunden: 0, rallye: 0, blaster: 0, perfekt: 0, quiz: 0, quizVoll: 0, ...speicher.laden('abzeichen', {}) };
  let bekannt = null;

  function liste() {
    const erledigt = missionen.erledigteIds;
    const bereiche = Object.values(GRUPPEN).map((g) => {
      const n = g.missionen.filter((id) => erledigt.includes(id)).length, alle = g.missionen.length;
      return { name: g.name, zeichen: g.zeichen, stufe: n === 0 ? 0 : n === alle ? 3 : n >= Math.ceil(alle / 2) ? 2 : 1, info: `${n} von ${alle} Missionen` };
    });
    return [...bereiche,
      { name: 'Kundenprofi', zeichen: '❓', stufe: z.kunden >= 15 ? 3 : z.kunden >= 8 ? 2 : z.kunden >= 3 ? 1 : 0, info: `${z.kunden} Kundenfragen (3 / 8 / 15)` },
      { name: 'Parkplatz', zeichen: '🛒', stufe: z.perfekt ? 3 : z.blaster ? 2 : z.rallye ? 1 : 0, info: 'Rallye, Blaster, Blaster ohne Grummeln' },
      { name: 'Wissen', zeichen: '🧠', stufe: z.quizVoll ? 3 : z.quiz >= 3 ? 2 : z.quiz ? 1 : 0, info: `${z.quiz} Quiz-Runden, Gold bei 3 von 3` }];
  }

  // Vergleicht mit dem letzten Stand und meldet jede neu erreichte Stufe
  function pruefe() {
    const neu = liste();
    if (bekannt) neu.forEach((a, i) => { if (a.stufe > bekannt[i].stufe) ui.toast(`Abzeichen: ${a.zeichen} ${a.name} ${STUFEN[a.stufe]}!`, 4000); });
    bekannt = neu;
  }
  pruefe();

  return {
    liste,
    pruefe,
    // art: kunden, rallye, blaster, perfekt, quiz, quizVoll
    zaehle(art) {
      z[art]++;
      speicher.speichern('abzeichen', z);
      pruefe();
    },
  };
}
