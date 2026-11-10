// Spielzustände und Speichern. Speichern klappt auch ohne localStorage (privates Fenster).
export const Z = { MENUE: 'menue', SPIEL: 'spiel', PAUSE: 'pause', ENDE: 'ende' };

export function erstelleZustand() {
  let jetzt = Z.MENUE;
  const hoerer = [];
  return {
    get: () => jetzt,
    setze(neu) {
      if (neu === jetzt) return;
      const alt = jetzt;
      jetzt = neu;
      hoerer.forEach((f) => f(neu, alt));
    },
    beiWechsel: (f) => hoerer.push(f),
  };
}

const PREFIX = 'ekia-kl:';
export const speicher = {
  laden(schluessel, standard) {
    try {
      const roh = localStorage.getItem(PREFIX + schluessel);
      return roh === null ? standard : JSON.parse(roh);
    } catch { return standard; }
  },
  speichern(schluessel, wert) {
    try { localStorage.setItem(PREFIX + schluessel, JSON.stringify(wert)); } catch { /* ohne Speicher weiterspielen */ }
  },
};
