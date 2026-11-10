// Reine Spieldaten (keine Logik): Palette, Figuren-Steckbriefe, Hallenmaße. Grundriss: karte.js.
// Quelle: spiel/SPIEL.md Abschnitt 6.5 (Figuren-Pass), 6.6 (Palette), 6.8 (Grundriss).

export const FARBE = {
  blau: 0x0058ab, gelb: 0xfbd914, weiss: 0xffffff, birke: 0xe5c99b, birkeDunkel: 0xc9a877,
  boden: 0xc9cdd2, wand: 0xf5f3ee, orange: 0xe8833a, karton: 0xc9a06a, kartonHell: 0xdcb985,
  pflanze: 0x4c8c4a, pflanzeHell: 0x6aa85a, topf: 0xf5f3ee, sofa: 0x7c9cc0, teppich: 0xe9dcc3,
  bett: 0xf7f4ef, decke: 0x9cc3a6, grau: 0x8a929b, dunkelgrau: 0x4a5560, schwarz: 0x2b2b30, glas: 0xbfe0f2,
  wiese: 0x8dbf6a, wieseDunkel: 0x6fa25a, wald: 0x2f6b3a, waldHell: 0x3f7f45, stamm: 0x6b4a2f,
  himmel: 0x8ec9f0, horizont: 0xf3e7cf, lichtHimmel: 0xcfe8ff, lichtBoden: 0xe5c99b, sonne: 0xfff1d6,
  metall: 0xaab2ba, rot: 0xd9483b, wurst: 0xb5553a, senf: 0xe0b020,
  umriss: 0x3b2a20, haut: 0xf2c29b, wange: 0xf09c94, mund: 0x7a3b2e, pupille: 0x2a211c,
};

// Figuren-Steckbriefe: Farben als Hex-Werte, Frisur, Größe, Umriss nur für Hauptfiguren.
export const FIGUREN = {
  spieler: {
    haut: FARBE.haut, haare: 0x6b4a2f, frisur: 'kurz', shirt: FARBE.gelb, hose: FARBE.blau,
    schuhe: FARBE.umriss, schild: FARBE.blau, groesse: 1, umriss: true,
  },
  kollegin: {
    haut: 0xe8b48c, haare: 0xc9772e, frisur: 'zopf', shirt: FARBE.gelb, hose: FARBE.blau,
    schuhe: FARBE.umriss, schild: FARBE.blau, groesse: 0.97, umriss: false,
  },
};

export const HALLE = { breite: 52, tiefe: 36, wandHoehe: 4.5, wandDicke: 0.5 };
export const START = { x: -14, z: 14.5 }; // am Eingang im Erdgeschoss
export const SPIELER = { tempo: 6.5, radius: 0.55 };

