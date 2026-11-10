// Grundriss beider Etagen als reine Daten. Halle 52 × 36 (x -26..26, z -18..18), Kamera schaut von Süden.
// moebel:   [typ, x, z, drehung]                       (Typen in moebel.js und moebel-og.js)
// schilder: [text, x, y, z, höhe, stil, kipp, drehY, seile]  (Stile: blau, gelb, weiss, warn)
// punkte:   Interaktionen. treppe/schranke lösen beim Betreten aus, aufzug über den Aktionsknopf.
//           ankunft = [x, z, blickrichtung] auf der Ziel-Etage.
const R = Math.PI / 2, TREPPE = -24.4, AUFZUG = -20.4;

export const ETAGEN = {
  eg: {
    name: 'Erdgeschoss', kurz: 'EG', boden: 0xc9cdd2, sockel: 0,
    moebel: [
      ['treppeAuf', TREPPE, 8.5], ['aufzug', AUFZUG, 6.5], ['tor', -14, 17.4], ['tor', 21, 17.4],
      // Markthalle
      ['marktregal', -16, -1], ['marktregal', -12.5, -1], ['marktregal', -9, -1],
      ['marktregal', -16, 5], ['marktregal', -12.5, 5], ['marktregal', -9, 5],
      ['wuehltisch', -12.5, 11.5], ['wuehltisch', -5, 2],
      // SB-Halle
      ['hochregal', -14, -11], ['hochregal', -10, -11], ['hochregal', -6, -11], ['hochregal', -2, -11], ['hochregal', 2, -11],
      ['palette', -16.5, -5.5], ['palette', 4.5, -6],
      // Logistik (hinter Zaun und Schranke)
      ['hochregal', 21, -16.6, R], ['stapler', 12.5, -13.5, R], ['rolltor', 12.5, -17.9],
      ['palette', 19, -11.5], ['palette', 21.5, -11.2], ['palette', 24, -11.6],
      ['rollwagen', 10, -9.6], ['rollwagen', 11.4, -9.6], ['rollwagen', 24.6, -14.2],
      // Fundgrube, Kassen, Hotdog-Stand
      ['fundgrube', 20, -2],
      ['kasse', 4, 11], ['kasse', 8, 11], ['kasse', 12, 11], ['sbkasse', 15.5, 13.6], ['sbkasse', 17.5, 13.6],
      ['hotdog', 22.5, 9], ['bistro', 19.2, 11.2], ['bistro', 22, 12.8],
      ['pflanze', -19, 15.8], ['pflanze', -9, 15.8], ['pflanze', -0.5, 4], ['pflanze', 6.5, -4.5],
      ['pflanze', 15, 2], ['pflanze', 25, 16], ['pflanze', -25, -4], ['pflanze', 1.5, 15.8],
    ],
    zaeune: [[8, -8, 14, -8], [17.4, -8, 26, -8], [8, -18, 8, -8]],
    schranke: { x: 14, z: -8, laenge: 3.4 },
    schilder: [
      ['EKIA Kaiserslautern', -4, 3.5, -17.7, 1.5, 'blau'],
      ['Willkommen in Kaiserslautern', -11, 3.4, 13.2, 0.7, 'blau', 0.45, 0, true],
      ['Eingang', -14, 3.3, 17.68, 0.42, 'gelb'], ['Ausgang', 21, 3.3, 17.68, 0.42, 'gelb'],
      ['Treppe zum Obergeschoss', TREPPE, 3.2, 12.9, 0.5, 'weiss', 0.4, 0, true],
      ['Aufzug', AUFZUG, 3.75, 8.08, 0.45, 'weiss'],
      ['Markthalle', -12.5, 3.5, 2, 0.8, 'gelb', 0.45, 0, true],
      ['SB-Halle', -6, 4.3, -6, 0.8, 'gelb', 0.45, 0, true],
      ...[1, 2, 3, 4, 5].map((n) => [`Gang ${n}`, -18 + n * 4, 3.95, -7.35, 0.42, 'blau', 0.3]),
      ['Kassen', 8, 3.5, 7.8, 0.75, 'gelb', 0.45, 0, true],
      ['Hot Dogs', 22.5, 3.05, 10.05, 0.5, 'blau', 0.2],
      ['Fundgrube', 20, 3.3, -4.4, 0.7, 'gelb', 0.45, 0, true],
      ['Nur für Logistik', 15.7, 3.1, -7.8, 0.32, 'warn'],
      ['Wareneingang', 12.5, 4.05, -17.75, 0.5, 'weiss'],
    ],
    punkte: [
      { art: 'treppe', x: TREPPE, z: 11.7, r: 1.2, ziel: 'og', ankunft: [TREPPE, 3.4, Math.PI] },
      { art: 'aufzug', x: AUFZUG, z: 9.3, r: 1.7, ziel: 'og', ankunft: [AUFZUG, 9.6, 0] },
      { art: 'schranke', x: 15.7, z: -6.9, r: 2.4 },
    ],
    pfeile: [[-22, 14], [-17.5, 12], [-17.5, -4.5], [0, -5.5], [6, -2], [6, 15.2], [19, 15.6], [21, 17.2]],
  },

  og: {
    name: 'Obergeschoss', kurz: 'OG', boden: 0xb98e60, dielen: true, sockel: 5,
    moebel: [
      ['treppeAb', TREPPE, 8.5], ['aufzug', AUFZUG, 6.5],
      // Showroom und Restaurant (Umkleide und Großraumbüro folgen in M3)
      ['wohnzimmer', -4, -14.25], ['schlafzimmer', 2.8, -14.25],
      ['tischgruppe', 15.5, -12.5], ['tischgruppe', 19.5, -12.5], ['tischgruppe', 15.5, -8],
      ['tischgruppe', 19.5, -8], ['tischgruppe', 15.5, -3.5], ['tischgruppe', 19.5, -3.5], ['theke', 18, -17.35],
      ['pflanze', -10, -16.8], ['pflanze', 8.5, -16.8], ['pflanze', -12, 12], ['pflanze', 10, 10], ['pflanze', 24.5, 15.5], ['pflanze', 24.5, -16.8],
    ],
    schilder: [
      ['EKIA Kaiserslautern', 8, 3.5, -17.7, 1.3, 'blau'],
      ['Showroom', -1, 3.6, -9.5, 0.8, 'gelb', 0.45, 0, true],
      ['Restaurant', 17.5, 3.6, -10.2, 0.8, 'gelb', 0.45, 0, true],
      ['Obergeschoss', -12, 3.4, 9, 0.7, 'blau', 0.45, 0, true],
      ['Umkleide & Büro folgen bald', -16, 3.2, -6, 0.5, 'weiss', 0.45, 0, true],
      ['Treppe zum Erdgeschoss', TREPPE, 3.2, 12.4, 0.5, 'weiss', 0.4, 0, true],
      ['Aufzug', AUFZUG, 3.75, 8.08, 0.45, 'weiss'],
    ],
    punkte: [
      { art: 'treppe', x: TREPPE, z: 5.9, r: 1.2, ziel: 'eg', ankunft: [TREPPE, 13.4, 0] },
      { art: 'aufzug', x: AUFZUG, z: 9.3, r: 1.7, ziel: 'eg', ankunft: [AUFZUG, 9.6, 0] },
    ],
    pfeile: [[-22.5, 2.5], [-8, 1.5], [-8, -10], [8, -10], [11, 0], [0, 7], [-14, 8]],
  },
};
