// Reine Spieldaten (keine Logik): Palette, Figuren-Steckbriefe, Hallenmaße, Pfeilweg.
// Quelle: spiel/SPIEL.md Abschnitt 6.5 (Figuren-Pass), 6.6 (Palette), 6.8 (Grundriss).

export const FARBE = {
  blau: 0x0058ab, gelb: 0xfbd914, weiss: 0xffffff, birke: 0xe5c99b, birkeDunkel: 0xc9a877,
  boden: 0xc9cdd2, wand: 0xf5f3ee, orange: 0xe8833a, karton: 0xc9a06a, kartonHell: 0xdcb985,
  pflanze: 0x4c8c4a, pflanzeHell: 0x6aa85a, topf: 0xf5f3ee, sofa: 0x7c9cc0, teppich: 0xe9dcc3,
  bett: 0xf7f4ef, decke: 0x9cc3a6, grau: 0x8a929b, dunkelgrau: 0x4a5560, schwarz: 0x2b2b30, glas: 0xbfe0f2,
  wiese: 0x8dbf6a, wieseDunkel: 0x6fa25a, wald: 0x2f6b3a, waldHell: 0x3f7f45, stamm: 0x6b4a2f,
  himmel: 0x8ec9f0, horizont: 0xf3e7cf, lichtHimmel: 0xcfe8ff, lichtBoden: 0xe5c99b, sonne: 0xfff1d6,
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

export const HALLE = { breite: 44, tiefe: 32, wandHoehe: 4.5, wandDicke: 0.5 };
export const START = { x: 0, z: 10 };
export const SPIELER = { tempo: 6.5, radius: 0.55 };

// Gelber Pfeilweg als Rundweg (x, z). Die Pfeile zeigen in Laufrichtung.
export const PFEILWEG = [
  [-3, 13], [-3, 2], [-9, -1], [-9, -6.5], [-3, -8], [7, -8], [11, -4], [11, 4], [5, 9], [-3, 13],
];
