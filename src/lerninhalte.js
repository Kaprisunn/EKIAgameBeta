// Lern-Missionen als reine Daten (Ampel-System aus SPIEL.md 8.3). Beispieltexte: bitte vom Team prüfen lassen.
// art:   rot = Notfall (gilt für alle Shirts), gelb = Kollegenhilfe, gruen = Aufgabe
// zone:  verkauf = gelbes Shirt, logistik = blaues Shirt (Lager und Restaurant), buero und aussen = beide Farben
// ort:   [x, z, blickrichtung] der Person bzw. Gefahrenstelle; knopf = anderer Interaktionspunkt
// person: 'kunde' oder 'kollege' (rolle bestimmt die Kleidung), gefahr: 'pfuetze' oder 'karton'
// typ:   auswahl (3 Antworten, Standard), timing (im richtigen Moment auslösen, treffer = Anzahl), sortieren (tauschen),
//        tablett (bestellte Speisen auf vorbeigleitende Tabletts legen)
const P = Math.PI, R = Math.PI / 2;

export const PUNKTE = { gruen: 10, gelb: 20, rot: 30, kunde: 10 };
export const ART = { rot: { zeichen: '❗', name: 'Notfall' }, gelb: { zeichen: '🤝', name: 'Kollegenhilfe' }, gruen: { zeichen: '✅', name: 'Aufgabe' }, kunde: { zeichen: '❓', name: 'Kundenfrage' } };

// Abzeichen-Bereiche (abzeichen.js): welche Missionen zu welchem Bereich gehören
export const GRUPPEN = {
  verkauf: { name: 'Verkauf & Kasse', zeichen: '🛋️', missionen: ['preisschild', 'mehrpaket', 'diebstahl', 'transport', 'reparatur'] },
  logistik: { name: 'Logistik', zeichen: '📦', missionen: ['paletten', 'schwer'] },
  restaurant: { name: 'Restaurant', zeichen: '🍽️', missionen: ['frische', 'takt'] },
  sicherheit: { name: 'Sicherheit', zeichen: '🦺', missionen: ['pfuetze', 'karton', 'wagen'] },
  team: { name: 'Team & Draußen', zeichen: '🤝', missionen: ['stau', 'kofferraum'] },
};

export const MISSIONEN = [
  {
    id: 'preisschild', art: 'gruen', zone: 'verkauf', etage: 'og', person: 'kunde', ort: [-13.2, -14.6, P],
    titel: 'Preisschild lesen', bereich: 'Showroom',
    text: 'Ein Kunde zeigt auf das Preisschild am Bett: „Wo find ich des denn zum Mitnehmen?“',
    frage: 'Was zeigst du ihm?',
    antworten: ['Ihn zur Kasse schicken, dort wird alles geklärt.', 'Die Maße prüfen und Gang- und Fachnummer für die SB-Halle zeigen.', 'Sagen, dass er im Lager selbst suchen soll.'],
    richtig: 1,
    warum: 'Auf dem Preisschild stehen die Maße und der Lagerort in der SB-Halle. So findet der Kunde sein Paket und weiß vorher, ob es passt.',
    tipp: 'Schau, was alles auf dem Preisschild steht. Welche Angabe führt in die SB-Halle?',
  },
  {
    id: 'mehrpaket', art: 'gruen', zone: 'verkauf', etage: 'eg', person: 'kunde', ort: [4, 9.3, 0],
    titel: 'Mehrpaket-Kontrolle', bereich: 'Kasse',
    text: 'Auf dem Band liegt ein Schrankpaket mit dem Aufdruck „Paket 1 von 2“. Das zweite Paket fehlt.',
    frage: 'Was machst du vor dem Bezahlen?',
    antworten: ['Einfach kassieren, der Kunde merkt es zu Hause.', 'Paket 1 zurück ins Lager bringen.', 'Den Kunden freundlich auf Paket 2 hinweisen und zeigen, wo es liegt.'],
    richtig: 2,
    warum: 'Ohne Paket 2 lässt sich der Schrank nicht aufbauen. Ein Hinweis vor dem Bezahlen spart dem Kunden eine zweite Fahrt.',
    tipp: 'Was passiert, wenn der Kunde zu Hause merkt, dass ein Teil fehlt?',
  },
  {
    id: 'paletten', art: 'gruen', zone: 'logistik', etage: 'eg', person: 'kollege', rolle: 'logistik', ort: [27.6, -8.25, R], typ: 'sortieren',
    titel: 'Regal-Sicherheit', bereich: 'Logistik',
    text: 'Ein Regal ist falsch eingeräumt: Schwere Kartons stehen oben, leichte unten.',
    frage: 'Tippe zwei Kartons an, um sie zu tauschen. Schwer nach unten, leicht nach oben!',
    kisten: [['Kommode', 25], ['Kissen', 2], ['Regal', 18], ['Lampe', 4]],
    warum: 'Schwer unten macht Regal und Palette stabil, nichts kippt und niemand muss schwer über Kopf heben. Fluchtwege bleiben immer frei.',
    tipp: 'Der schwerste Karton gehört ganz nach unten, der leichteste ganz nach oben.',
  },
  {
    id: 'frische', art: 'gruen', zone: 'logistik', etage: 'og', person: 'kollege', rolle: 'gastro', ort: [21, -19.9, 0],
    titel: 'Frische-Taktung', bereich: 'Restaurant',
    text: 'Es ist 11:15 Uhr. In der Ausgabe liegen noch zwei Bleche Köttbullar, um 12 Uhr kommt der Mittags-Ansturm.',
    frage: 'Was tust du?',
    antworten: ['Warten, bis das letzte Blech leer ist.', 'Jetzt Nachschub aus der Küche anfordern.', 'Die Ausgabe schließen, bis die Küche von selbst liefert.'],
    richtig: 1,
    warum: 'Die Küche braucht Vorlauf. Wer vor dem Ansturm bestellt, hat frische Ware, wenn viele Gäste kommen.',
    tipp: 'Wie lange dauert es wohl, bis neue Köttbullar fertig sind?',
  },
  {
    id: 'schwer', art: 'gelb', zone: 'logistik', etage: 'eg', person: 'kollege', rolle: 'logistik', ort: [23, -4, 0],
    titel: 'Schwerer Karton', bereich: 'Logistik',
    text: 'Ein Kollege will allein einen Karton mit über 25 kg anheben: „Hilf mir mal kurz!“',
    frage: 'Wie hebt ihr den Karton?',
    antworten: ['Mit rundem Rücken schnell hochreißen.', 'Er soll es allein versuchen, du schaust zu.', 'Zu zweit, mit geradem Rücken aus den Beinen heben.'],
    richtig: 2,
    warum: 'Schwere Lasten hebt man zu zweit und aus den Beinen. So schont ihr den Rücken und vermeidet Verletzungen.',
    tipp: 'Welche Muskeln sind stärker: die im Rücken oder die in den Beinen?',
  },
  {
    id: 'stau', art: 'gelb', zone: 'buero', etage: 'og', person: 'kollege', rolle: 'pc', ort: [18.5, 15, 0],
    titel: 'Kassen-Stau', bereich: 'Großraumbüro',
    text: 'Der Funk meldet lange Schlangen an den Kassen. In der Markthalle ist gerade wenig los.',
    frage: 'Wie koordinierst du?',
    antworten: ['Geschulte Kolleg:innen aus der ruhigen Markthalle an weitere Kassen schicken.', 'Abwarten, die Schlange löst sich von selbst.', 'Alle Kolleg:innen aus der Logistik an die Kasse schicken.'],
    richtig: 0,
    warum: 'Wer an der Kasse geschult ist und gerade Zeit hat, hilft sofort, ohne dass anderswo Arbeit liegen bleibt.',
    tipp: 'Wer kann an der Kasse arbeiten, und wo ist gerade wenig los?',
  },
  {
    id: 'transport', art: 'gelb', zone: 'verkauf', etage: 'eg', person: 'kollege', rolle: 'verkauf', ort: [22.5, 14.6, 0],
    titel: 'Transportproblem', bereich: 'Kundenservice',
    text: 'Eine Kollegin ruft dich: Ein Kunde bekommt sein großes Regal nicht ins Auto.',
    frage: 'Welche Hilfe bietet ihr an?',
    antworten: ['Das Paket aufreißen und die Teile lose stapeln.', 'Den Umklapp-Trick für die Rücksitze zeigen oder Lieferservice bzw. Miettransporter anbieten.', 'Sagen, dass das nicht unser Problem ist.'],
    richtig: 1,
    warum: 'Mit umgeklappten Sitzen passt oft mehr ins Auto. Sonst sorgen Lieferservice oder Transporter dafür, dass der Kauf klappt.',
    tipp: 'Welche Möglichkeiten bleiben, wenn das Auto zu klein ist?',
  },
  {
    id: 'pfuetze', art: 'rot', etage: 'eg', gefahr: 'pfuetze', ort: [-19, -7.5], hoehe: 1.9,
    titel: 'Rutschgefahr!', bereich: 'Hauptgang',
    text: 'Auf dem Hauptgang ist ein Getränk ausgelaufen. Kund:innen laufen direkt darauf zu.',
    frage: 'Was tust du zuerst?',
    antworten: ['Schnell Putzzeug holen und die Stelle so lange allein lassen.', 'An der Stelle bleiben, absichern und Kolleg:innen um Reinigungsset und Warnschild bitten.', 'Weitergehen, die Reinigung kommt bestimmt bald.'],
    richtig: 1,
    warum: 'Eine unbewachte Pfütze ist eine Sturzgefahr. Wer stehen bleibt und warnt, schützt alle, bis das Warnschild da ist.',
    tipp: 'Was passiert, wenn niemand bei der Pfütze steht, während du weg bist?',
  },
  {
    id: 'karton', art: 'rot', etage: 'eg', gefahr: 'karton', ort: [-14.2, -14.5], knopf: [-15.25, -11.6], radius: 2.4, hoehe: 4.5,
    titel: 'Karton droht zu fallen!', bereich: 'SB-Halle, Gang 3',
    text: 'Im Hochregal in Gang 3 hängt ein schwerer Karton schief über der Kante.',
    frage: 'Was ist jetzt richtig?',
    antworten: ['Selbst hochklettern und den Karton zurückschieben.', 'Ein Schild „Vorsicht“ aufhängen und weitergehen.', 'Den Gang sofort für Kund:innen sperren und das Sicherungs-Team rufen.'],
    richtig: 2,
    warum: 'Ein fallender Karton kann schwer verletzen. Erst Menschen schützen, dann sichern Fachleute den Karton mit Gerät.',
    tipp: 'Wer ist in Gefahr, solange der Karton dort hängt?',
  },
  {
    id: 'wagen', art: 'rot', etage: 'pp', ort: [26, 19.5], knopf: [26, 17.8], hoehe: 2.5,
    titel: 'Wagen rollen weg!', bereich: 'Parkplatz',
    text: 'Eine Reihe Einkaufswagen rollt über den Parkplatz Richtung Fahrbahn.',
    frage: 'Was tust du?',
    antworten: ['Die Reihe sicher am Griff stoppen und in der Wagenbox sichern.', 'Hinterherrufen und hoffen, dass jemand sie aufhält.', 'Ausweichen, das ist Aufgabe der Logistik.'],
    richtig: 0,
    warum: 'Rollende Wagen können Autos und Menschen treffen. Stoppen und in der Box sichern verhindert Unfälle.',
    tipp: 'Wo stehen Einkaufswagen sicher und rollen nicht weg?',
  },
  {
    id: 'diebstahl', art: 'gruen', zone: 'verkauf', etage: 'eg', person: 'kunde', ort: [10.2, 17.4, 0], typ: 'timing',
    titel: 'Teppich unterm Wagen', bereich: 'Kasse / Ausgang',
    text: 'Ein Kunde schiebt seinen Wagen zum Ausgang. Unten im Wagen liegt ein Teppich, der nicht gescannt wurde.',
    frage: 'Tippe auf „Scannen!“ (oder Leertaste), wenn der rote Laser im grünen Feld steht.',
    warum: 'Freundlich ansprechen und nachscannen statt beschuldigen: Oft ist es nur ein Versehen, und die Ware wird bezahlt.',
    tipp: 'Warte, bis der Laser genau im grünen Feld steht.',
  },
  {
    id: 'kofferraum', art: 'gruen', zone: 'aussen', etage: 'pp', person: 'kunde', ort: [-1.5, 14.6, Math.PI], typ: 'sortieren',
    titel: 'Kofferraum-Tetris', bereich: 'Parkplatz',
    text: 'Ein Kunde bekommt seine Pakete nicht sicher ins Auto.',
    frage: 'Hilf beim Packen: Tippe zwei Pakete an, um sie zu tauschen. Schwer und flach nach unten, leicht nach oben!',
    kisten: [['Kissen', 2], ['Regal-Paket', 22], ['Lampe', 4], ['Kommoden-Paket', 30]], oben: '⬆ oben im Kofferraum', unten: '⬇ Kofferraumboden',
    warum: 'Schwere, flache Pakete liegen unten sicher und rutschen beim Bremsen nicht. Leichtes oben wird nicht zerdrückt.',
    tipp: 'Das schwerste Paket gehört ganz nach unten.',
  },
  {
    id: 'reparatur', art: 'gruen', zone: 'verkauf', etage: 'eg', person: 'kollege', rolle: 'verkauf', ort: [8.2, -1.4, Math.PI], typ: 'timing',
    treffer: 3, knopf: '🔧 Festdrehen!', titel: 'Zweite Chance', bereich: 'Fundgrube',
    text: 'Ein Ausstellungsstuhl wackelt. Mit dem Inbusschlüssel ziehst du drei Schrauben nach, dann bekommt er das gelbe Zweite-Chance-Preisschild.',
    frage: 'Tippe dreimal auf „Festdrehen!“, wenn der Laser im grünen Feld steht.',
    warum: 'Reparieren statt wegwerfen: Gut gemachte Stücke bekommen in der Fundgrube eine zweite Chance. Das spart Abfall und freut Kund:innen.',
    tipp: 'Ruhig bleiben und warten, bis der Laser genau im grünen Feld steht.',
  },
  {
    id: 'takt', art: 'gruen', zone: 'logistik', etage: 'og', person: 'kollege', rolle: 'gastro', ort: [17, -19.9, 0], typ: 'tablett',
    titel: 'Restaurant-Takt', bereich: 'Restaurant',
    text: 'Mittags-Ansturm! Die Tabletts der Gäste gleiten durch die Ausgabe.',
    frage: 'Tippe die drei bestellten Speisen an, bevor das Tablett durchgerutscht ist.',
    speisen: [['🧆', 'Köttbullar'], ['🥦', 'Gemüsebällchen'], ['🥣', 'Rahmsoße'], ['🍒', 'Preiselbeeren'], ['🍟', 'Pommes']],
    warum: 'Genau nach Bestellung und im Takt: So bekommt jeder Gast das Richtige, und die Schlange bleibt kurz.',
    tipp: 'Lies die Bestellung oben und tippe nur diese drei Speisen an.',
  },
];
