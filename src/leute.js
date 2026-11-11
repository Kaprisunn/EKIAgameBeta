// Wer im Haus unterwegs ist (reine Daten), je Etage:
// kunden:   Anzahl Kund:innen, die zwischen den Wegpunkten `wege` bummeln
// kollegen: [x, z, blickrichtung, haltung ('steht' | 'sitzt'), rolle]
//           rolle: verkauf = gelb gestreift; logistik (Weste), gastro (Schürze), comin, pc = blau gestreift
// laeufer:  Kolleg:innen, die einen festen Weg hin und her gehen und auf dem Hinweg Ware tragen
const R = Math.PI / 2, P = Math.PI;

export const LEUTE = {
  eg: {
    kunden: 9,
    wege: [[-19, -1], [-15, -1], [-19, 6.5], [-15, 7.2], [-10.5, 4], [-6, -2], [-19.5, -9.5], [-19.75, -14], [-15.25, -14],
      [-10.75, -14], [-6.25, -14], [-1.75, -14], [2.75, -14], [7.25, -14], [0, -11.2], [8, -11], [6, -2], [0, 2], [4, 4.5],
      [8, 8.5], [0, 20], [-4, 19.5], [6.5, 17.5], [24, 14.2], [27.5, 14.5], [30, 14], [16, 17.5], [-24, 16.5], [-12, 17.2]],
    kollegen: [
      [3.15, 12.6, -R, 'steht', 'verkauf'], [7.15, 12.6, -R, 'steht', 'verkauf'], [11.15, 12.6, -R, 'steht', 'verkauf'],
      [23.5, 10.2, 0, 'steht', 'logistik'], [25, -11.6, P, 'steht', 'logistik'], [-15, 0.2, -R, 'steht', 'verkauf'],
      [-17, 19.3, 0, 'steht', 'verkauf'], [10, -1.4, P, 'steht', 'verkauf'], [-11, 15.4, P, 'steht', 'comin'],
    ],
    laeufer: [{ weg: [[26.5, -12], [26.5, 10.1]], rolle: 'logistik' }],
  },
  og: {
    kunden: 8,
    wege: [[-20, -14], [-13.2, -13.6], [-6.2, -13.6], [0.4, -13.6], [-16, -4], [-4, -2], [6, -4], [0, 1], [19.25, -14.75],
      [23.75, -10.25], [19.25, -5.5], [28.8, -12], [23.75, -14.75], [-6, 9], [8, 6], [-20, 4], [14, -1]],
    kollegen: [
      [-10, -12.5, 0, 'steht', 'verkauf'], [24, -19.9, 0, 'steht', 'gastro'], [28.8, -4, -R, 'steht', 'gastro'],
      [6, 18.25, P, 'sitzt', 'pc'], [11, 15.75, 0, 'sitzt', 'pc'], [21, 18.25, P, 'sitzt', 'pc'],
      [26, 15.75, 0, 'sitzt', 'pc'], [-15.5, 16.8, P, 'steht', 'pc'], [-6.2, -15.6, P, 'steht', 'comin'],
    ],
    laeufer: [],
  },
};

// Kurze Sprechblasen (höchstens 12 Wörter), Pfälzer Humor freundlich
export const SPRUECHE = {
  kunden: ['Ei gude!', 'Alla hopp, weiter geht’s!', 'Gell, schee hier!', 'Wo gibt’s’n die Köttbullar?', 'Hajo, des passt!',
    'Ich such nur schnell Kerzen.', 'Wo is’n die Fundgrube?', 'Ei, wie? Schon Mittag?'],
  kollegen: ['Moin! Heute ist viel los.', 'Schön, dass du da bist!', 'Gang 5 ist wieder aufgefüllt.', 'Denk an deine Pause!',
    'Brauchst du Hilfe? Sag Bescheid!'],
  logistik: ['Ware für Click & Collect kommt!', 'Achtung, Stapler unterwegs!', 'Das Lager ist heute gut gefüllt.'],
};
