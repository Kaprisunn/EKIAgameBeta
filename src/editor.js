// Charakter-Editor im Startmenü und in der Umkleide: Abteilung (bestimmt das Streifen-Shirt) und Aussehen.
import { ABTEILUNGEN } from './daten.js';
import { ton } from './audio.js';

const GRUPPEN = [
  ['abteilung', 'Abteilung', Object.entries(ABTEILUNGEN).map(([k, a]) => [k, a.name])],
  ['geschlecht', 'Figur', [['w', 'Frau'], ['m', 'Mann']]],
  ['haut', 'Hautton', [['hell', 'Hell'], ['mittel', 'Mittel'], ['dunkel', 'Dunkel']]],
  ['alter', 'Alter', [['jung', 'Jung'], ['alt', 'Erfahren 60+']]],
];

// aendern(feld) wird nach jeder Wahl aufgerufen; profil wird direkt geändert
export function erstelleEditor(container, profil, aendern) {
  const knoepfe = [];
  for (const [feld, titel, optionen] of GRUPPEN) {
    const zeile = document.createElement('div'), name = document.createElement('span');
    zeile.className = 'zeile';
    name.textContent = titel;
    zeile.append(name);
    for (const [wert, text] of optionen) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (feld === 'abteilung' ? ' ' + ABTEILUNGEN[wert].shirt : '');
      b.textContent = text;
      b.dataset.feld = feld;
      b.dataset.wert = wert;
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ton.klick();
        profil[feld] = wert;
        markiere();
        aendern(feld);
      });
      zeile.append(b);
      knoepfe.push(b);
    }
    container.append(zeile);
  }
  function markiere() { for (const b of knoepfe) b.classList.toggle('gewaehlt', profil[b.dataset.feld] === b.dataset.wert); }
  markiere();
  return { markiere };
}
