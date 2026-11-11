// Grundriss der drei Ebenen (Erdgeschoss, Obergeschoss, Parkplatz) als reine Daten.
// Fläche je 64 × 44 (x -32..32, z -22..22), Kamera schaut von Süden. Nur die aktive Ebene wird gezeichnet.
// moebel:   [typ, x, z, drehung]   (Typen in moebel.js, moebel-og.js, moebel-deko.js)
// schilder: [text, x, y, z, höhe, stil, kipp, drehY, seile]   (Stile: blau, gelb, weiss, warn)
// linien:   weiße Parklinien [x1, z1, x2, z2]; tueren: Glasschiebetüren { x, z } (Rahmen = Möbel „tor“)
// punkte:   Interaktionen. treppe/tuer/schranke lösen beim Betreten aus, der Rest über den Aktionsknopf.
//           ankunft = [x, z, blickrichtung] auf der Ziel-Etage.
// Wer im Haus unterwegs ist (Kund:innen, Kolleg:innen), steht in leute.js.
const R = Math.PI / 2, TREPPE = -29.4, AUFZUG = -25.4;
const SAEULEN = [[-26, -8], [-11, -8], [4, -7.5], [-4, 5], [13, 2.5]].map(([x, z]) => ['saeule', x, z]);
const REGALE = [-22, -17.5, -13, -8.5, -4, 0.5, 5, 9.5];
// Parkplatz: zwei Doppelreihen (Mittellinien bei z -8 und 9), Buchten 3 breit; Autos [x, z, Blick]
const P = Math.PI, BUCHT = (k) => -25.5 + 3 * k;
const AUTOS = [
  ...[0, 2, 6, 10, 12, 16].map((k) => [BUCHT(k), -10.5, 0]), ...[1, 5, 9, 13, 17].map((k) => [BUCHT(k), -5.5, P]),
  ...[0, 3, 7, 11, 16].map((k) => [BUCHT(k), 6.5, 0]), ...[2, 8, 12, 15].map((k) => [BUCHT(k), 11.5, P]),
].map(([x, z, d]) => ['auto', x, z, d]);

export const ETAGEN = {
  eg: {
    name: 'Erdgeschoss', kurz: 'EG', wo: 'im Erdgeschoss', boden: 0xc9cdd2, sockel: 0, tueren: [{ x: 12, z: 21.4 }],
    moebel: [
      ['treppeAuf', TREPPE, 10.5], ['aufzug', AUFZUG, 8.5], ['tor', -20, 21.4], ['tor', 12, 21.4], ...SAEULEN,
      // Markthalle
      ...[-21, -17, -13].flatMap((x) => [['marktregal', x, -3], ['marktregal', x, 3.5]]),
      ['wuehltisch', -17, 10.5], ['wuehltisch', -8.5, 0], ['lampen', -9, 7.5], ['bilderwand', -11, 14],
      ['pflanzenstand', -8.5, -6], ['koerbe', -21.5, 9.5], ['teppiche', -12.5, 9.5],
      // SB-Halle mit breiten Gängen und Abholbereich
      ...REGALE.map((x) => ['hochregal', x, -16]),
      ['palette', -0.5, -9.6], ['palette', 14, -18], ['palette', 16.6, -18], ['palette', 14, -14.4], ['hubwagen', 16.4, -11],
      // Logistik (hinter Zaun und Schranke)
      ['hochregal', 26, -19.8, R], ['hochregal', 26, -15.2, R], ['stapler', 23.5, -9, R], ['rolltor', 31.9, -6, -R],
      ['palette', 29, -10], ['palette', 29, -6.5], ['palette', 29.5, 3],
      ['rollwagen', 22.5, 2], ['rollwagen', 23.8, 2], ['rollwagen', 30.5, -14],
      // Click & Collect: Theke vor dem offenen Lagertor
      ['ccTheke', 26, 11.5], ['torOffen', 26.5, 8], ['spindklein', 18.7, -12.5],
      // Fundgrube, Kassen, Ausgang
      ['fundgrube', 10, -4],
      ...[-2, 2, 6, 10, 14].map((x) => ['kasse', x, 12]), ...[-2, 6, 14].map((x) => ['absperrung', x, 8.4, R]),
      ['sbkasse', 17.5, 10.5, -R], ['sbkasse', 17.5, 12, -R], ['sbkasse', 17.5, 13.5, -R],
      ['hotdog', 0, 17.6], ['bistro', -4.2, 16.4], ['bistro', 4.2, 16.4], ['taschen', 16, 15.6],
      ['wagenreihe', -27, 19.5], ['wagenreihe', 5, 20.2],
      ['pflanze', -30.5, -6], ['pflanze', -30.5, 18], ['pflanze', -12, 19.8], ['pflanze', 18.6, 18], ['pflanze', 31, 18],
      ['pflanze', -6, 13], ['pflanze', 17, 1],
    ],
    zaeune: [[20, -22, 20, -5], [20, -1.6, 20, 11.4], [20, 8, 24.1, 8], [28.9, 8, 32, 8]],
    schranke: { x: 20, z: -5, laenge: 3.4, dreh: -R, innen: [20, -22, 32, 11] },
    schilder: [
      ['EKIA Kaiserslautern', -6, 3.9, -21.7, 1.2, 'blau'],
      ['Hej Kaiserslautern!', -28, 3.0, -21.7, 0.8, 'gelb'],
      ['Angebote der Woche', 15.5, 3.0, -21.7, 0.6, 'weiss'],
      ['Willkommen in Kaiserslautern', -20, 3.95, 21.66, 0.5, 'blau'],
      ['Eingang', -20, 3.3, 21.68, 0.42, 'gelb'], ['Ausgang', 12, 3.3, 21.68, 0.42, 'gelb'],
      ['Treppe zum Obergeschoss', TREPPE, 3.2, 14.9, 0.5, 'weiss', 0.4, 0, true],
      ['Aufzug', AUFZUG, 3.75, 10.08, 0.45, 'weiss'],
      ['Markthalle', -15, 3.5, 0.3, 0.8, 'gelb', 0.45, 0, true],
      ['SB-Halle', -6, 4.3, -10.5, 0.8, 'gelb', 0.45, 0, true],
      ...REGALE.map((x, i) => [`Gang ${i + 1}`, x, 3.95, -12.35, 0.42, 'blau', 0.3]),
      ['Kassen', 6, 3.5, 7.6, 0.75, 'gelb', 0.45, 0, true],
      ['Hot Dogs', 0, 3.05, 18.65, 0.5, 'blau', 0.2],
      ['Fundgrube', 10, 3.3, -6.4, 0.7, 'gelb', 0.45, 0, true],
      ['Nur für Logistik', 19.8, 3.1, -3.3, 0.32, 'warn', 0, -0.8],
      ['Wareneingang', 29.5, 4.3, -3, 0.5, 'weiss', 0.4, 0, true],
      ['Click & Collect', 26, 3.75, 13, 0.75, 'blau', 0.45, 0, true],
      ['Kundenservice · Warenausgabe', 26, 2.95, 13.05, 0.4, 'weiss', 0.45],
      ['Lager · Warenausgabe', 26.5, 3.6, 8.3, 0.4, 'warn'],
      ['👕 Spind', 18.7, 2.4, -12.2, 0.4, 'weiss'],
    ],
    punkte: [
      { art: 'treppe', x: TREPPE, z: 13.7, r: 1.2, ziel: 'og', ankunft: [TREPPE, 5.4, Math.PI] },
      { art: 'aufzug', x: AUFZUG, z: 11.3, r: 1.7, ziel: 'og', ankunft: [AUFZUG, 11.6, 0] },
      { art: 'schranke', x: 18.4, z: -3.3, r: 2.2 },
      { art: 'spind', x: 18.7, z: -11.2, r: 1.6 },
      { art: 'tuer', x: 12, z: 20.6, r: 0.9, ziel: 'pp', ankunft: [12, -18.8, 0] },
    ],
    pfeile: [[-27.5, 16.5], [-19.5, 15], [-19, -7], [-15, -11.2], [14, -11.2], [17, -8], [17, 4], [8, 6.5], [8, 15.5], [12, 20.8]],
  },

  og: {
    name: 'Obergeschoss', kurz: 'OG', wo: 'im Obergeschoss', boden: 0xb98e60, dielen: true, sockel: 5,
    moebel: [
      ['treppeAb', TREPPE, 10.5], ['aufzug', AUFZUG, 8.5], ...SAEULEN,
      // Showroom: vier Wohnkojen an der Rückwand
      ['wohnzimmer', -20, -18.25], ['schlafzimmer', -13.2, -18.25], ['kueche', -6.2, -18.25], ['kinderzimmer', 0.4, -18.25],
      // Restaurant
      ...[17, 21.5, 26].flatMap((x) => [-17, -12.5, -8].map((z) => ['tischgruppe', x, z])), ['theke', 24, -21.35],
      // Umkleide und Großraumbüro (hinter niedrigen Trennwänden)
      ['spinde', -12.8, 13.45], ['spiegel', -10.1, 13.45], ['kabine', -19.6, 18.5],
      ...[6, 11, 16, 21, 26].map((x) => ['schreibtische', x, 17]),
      // Pausenraum zwischen Umkleide und Büro
      ['tischgruppe', -4, 17.2], ['kaffee', -8.4, 16.5, R], ['quiztafel', -2, 14.2],
      ['pflanze', -30, -20], ['pflanze', 7, -20], ['pflanze', 12, -20], ['pflanze', 31, -2], ['pflanze', -30, 0],
      ['pflanze', 3.5, 20], ['pflanze', 30.5, 20], ['pflanze', -7, 19.5], ['pflanze', -23, 20],
    ],
    trennwaende: [[-21, 13, -19.5, 13], [-16.5, 13, -9, 13], [-21, 13, -21, 21.4], [-9, 13, -9, 21.4],
      [1, 13, 11.5, 13], [14.5, 13, 32, 13], [1, 13, 1, 21.4]],
    schilder: [
      ['EKIA Kaiserslautern', 10, 3.6, -21.7, 1.3, 'blau'],
      ['Showroom', -10, 3.6, -13.5, 0.8, 'gelb', 0.45, 0, true],
      ['Restaurant', 21.5, 3.6, -5, 0.8, 'gelb', 0.45, 0, true],
      ['Obergeschoss', -16, 3.4, 4, 0.7, 'blau', 0.45, 0, true],
      ['Umkleide', -18, 2.65, 13.25, 0.45, 'weiss', 0.3],
      ['Großraumbüro', 13, 2.65, 13.25, 0.45, 'weiss', 0.3],
      ['👕 Spind', -12.8, 2.35, 13.75, 0.4, 'weiss'],
      ['Pausenraum', -4, 3.1, 13.6, 0.45, 'weiss', 0.3, 0, true], ['🧠 Wissens-Quiz', -2, 1.45, 14.27, 0.32, 'gelb'],
      ['Treppe zum Erdgeschoss', TREPPE, 3.2, 14.6, 0.5, 'weiss', 0.4, 0, true],
      ['Aufzug', AUFZUG, 3.75, 10.08, 0.45, 'weiss'],
    ],
    punkte: [
      { art: 'treppe', x: TREPPE, z: 7.9, r: 1.2, ziel: 'eg', ankunft: [TREPPE, 15.6, 0] },
      { art: 'aufzug', x: AUFZUG, z: 11.3, r: 1.7, ziel: 'eg', ankunft: [AUFZUG, 11.6, 0] },
      { art: 'spind', x: -12.8, z: 14.9, r: 1.6 },
      { art: 'quiz', x: -2, z: 15.4, r: 1.7 },
    ],
    pfeile: [[-29.4, 4], [-24, -11], [4, -12], [10, -4], [8, 8], [-6, 9], [-20, 6]],
  },

  pp: {
    name: 'Parkplatz', kurz: 'Parkplatz', wo: 'auf dem Parkplatz', aussen: true, gehweg: -16, boden: 0x6e7378, sockel: 0,
    moebel: [
      ['tor', 12, -21.6], ...AUTOS,
      ['hecke', -29.5, -8], ['hecke', 29.5, -8], ['hecke', -29.5, 9], ['hecke', 29.5, 9],
      ['wagenbox', -13.5, -10.5, R], ['wagenbox', 16.5, 6.5, R], ...[-15, 0, 15].flatMap((x) => [['laterne', x, -8], ['laterne', x, 9]]),
      ['spielplatz', -23, 18.5], ['pakete', -0.2, 14.6], ['wagenreihe', 26, 19.5],
      ['pflanze', -6, -19.5], ['pflanze', 30, -19.5], ['pflanze', -30, -19.5],
    ],
    linien: [-8, 9].flatMap((zm) => [[-27, zm, 27, zm], ...Array.from({ length: 19 }, (_, k) => [-27 + 3 * k, zm - 5, -27 + 3 * k, zm + 5])]),
    tueren: [{ x: 12, z: -21.6 }],
    schilder: [
      ['EKIA KAISERSLAUTERN', -6, 4.6, -21.95, 1.7, 'blau'],
      ['Eingang · Ausgang', 12, 3.3, -21.32, 0.42, 'gelb'],
      ['🛒 Wagen-Rallye', -13.5, 3.1, -13.3, 0.45, 'gelb', 0.3],
      ['🎯 Multi-Blaster', 16.5, 3.1, 3.7, 0.45, 'gelb', 0.3],
      ['Spielplatz', -23, 2.9, 15.8, 0.45, 'weiss', 0.3],
    ],
    punkte: [
      { art: 'tuer', x: 12, z: -21.1, r: 0.9, ziel: 'eg', ankunft: [12, 18.6, Math.PI] },
      { art: 'rallye', x: -13.5, z: -14.4, r: 1.8 },
      { art: 'blaster', x: 16.5, z: 2.4, r: 1.8 },
    ],
    pfeile: [[12, -19.5], [12, -14.8], [-10, -14.8]],
  },
};
