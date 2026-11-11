// Kundenfragen je Abteilung (reine Daten, Beispieltexte zum Prüfen durch das Team).
// Kund:innen mit ❓ stellen eine Frage passend zur Abteilung des Spielers.
const f = (titel, text, frage, antworten, richtig, warum, tipp) => ({ art: 'kunde', bereich: 'Kundenfrage', titel, text, frage, antworten, richtig, warum, tipp });

export const HILFE = {
  verkauf: [
    f('Kissen gesucht', '„Ei gude! Wo find ich denn Kissen?“', 'Was tust du?',
      ['„Keine Ahnung, fragen Sie woanders.“', 'Kurz zur Markthalle bei den Textilien begleiten.', '„Im Lager, gehen Sie einfach rein.“'], 1,
      'Kurz hinbringen statt nur zeigen: So findet der Kunde es sicher und fühlt sich gut beraten.', 'Wie fühlt sich der Kunde, wenn du ihn ein Stück begleitest?'),
    f('Passt das Sofa?', '„Passt des Sofa in mei Wohnzimmer?“', 'Was rätst du?',
      ['„Bestimmt, kaufen Sie einfach.“', '„Probieren Sie es zu Hause aus.“', 'Maße vom Preisschild mit den Raummaßen vergleichen, notfalls ausmessen.'], 2,
      'Mit den Maßen vom Preisschild lässt sich vorher prüfen, ob es passt. Das spart Rückgaben und Ärger.', 'Welche Angaben stehen auf dem Preisschild?'),
  ],
  logistik: [
    f('Paket selbst holen?', '„Kann ich mein Paket schnell selbst aus dem Lager holen?“', 'Was antwortest du?',
      ['Aus Sicherheitsgründen nicht, ich bringe es zur Warenausgabe.', '„Klar, gehen Sie einfach rein.“', '„Nur wenn Sie eine Warnweste haben.“'], 0,
      'Im Lager fahren Stapler und es wird schwer gehoben. Kund:innen bleiben draußen, die Ware kommt zur Ausgabe.', 'Wer darf sich im Lager zwischen Staplern bewegen?'),
    f('Wo ist meine Bestellung?', '„Ich will meine Click-&-Collect-Bestellung abholen.“', 'Wohin schickst du den Kunden?',
      ['Zum Wareneingang hinten im Lager.', 'Zur Click-&-Collect-Theke mit der Abholnummer.', '„Kommen Sie morgen wieder.“'], 1,
      'An der Theke wird die Abholnummer geprüft, und die Ware kommt direkt aus dem Lager durch das Tor.', 'Wo werden Bestellungen ausgegeben?'),
  ],
  restaurant: [
    f('Vegan essen?', '„Gibt’s bei Ihne aach was Veganes?“', 'Was antwortest du?',
      ['„Nein.“', 'Ja, die veganen Gerichte zeigen und auf die Allergen-Kennzeichnung hinweisen.', '„Fragen Sie in der Küche.“'], 1,
      'Klare Auskunft zu Zutaten und Allergenen schafft Vertrauen und schützt die Gesundheit.', 'Wo stehen Zutaten und Allergene?'),
    f('Hochstuhl gesucht', 'Eine Familie mit Baby sucht einen Platz.', 'Wie hilfst du?',
      ['Hochstuhl bringen und einen Tisch mit Platz für den Kinderwagen zeigen.', '„Setzen Sie sich irgendwo hin.“', '„Babys sind hier schwierig.“'], 0,
      'Familien sind wichtige Gäste. Ein Hochstuhl und Platz für den Kinderwagen machen den Besuch entspannt.', 'Was braucht eine Familie mit Baby am Tisch?'),
  ],
  comin: [
    f('Kleines Zimmer', '„Mei Zimmer is so klää. Wie wirkt’s größer?“', 'Was empfiehlst du?',
      ['Dunkle Farben und viele große Möbel.', 'Alle Lampen ausschalten.', 'Helle Farben, Spiegel und Möbel mit Beinen, die den Boden frei lassen.'], 2,
      'Helle Flächen, Spiegel und sichtbarer Boden lassen Räume offener und größer wirken.', 'Was lässt einen Raum heller und luftiger wirken?'),
    f('Gemütliches Licht', '„Wie wird mei Wohnzimmer gemütlicher?“', 'Was rätst du?',
      ['Mehrere Lichtquellen: Stehleuchte, Tischleuchte und warmes Licht.', 'Eine sehr helle Deckenlampe reicht.', 'Nur Kerzen.'], 0,
      'Mehrere warme Lichtquellen in verschiedenen Höhen schaffen eine gemütliche Stimmung.', 'Wie viele Lampen hat ein gemütliches Zimmer?'),
  ],
  pc: [
    f('Bewerbung', '„Ich möcht mich bei Ihne bewerbe. Wie geht des?“', 'Was antwortest du?',
      ['„Das geht nicht.“', 'Auf die Karriereseite verweisen und Ansprechpartner von People & Culture nennen.', '„Schreiben Sie irgendwem eine E-Mail.“'], 1,
      'Freundlich den richtigen Weg zeigen: So bekommt die Person alle Infos und fühlt sich willkommen.', 'Wer kümmert sich um Bewerbungen?'),
    f('Neue Kollegin', 'Eine neue Kollegin weiß nicht, wo sie sich melden soll.', 'Wie hilfst du?',
      ['„Such dir selbst was.“', '„Frag morgen nochmal.“', 'Zu ihrer Ansprechperson begleiten und den Einarbeitungsplan zeigen.'], 2,
      'Ein guter erster Tag mit klarer Begleitung hilft neuen Kolleg:innen, schnell anzukommen.', 'Was hilft dir an deinem ersten Arbeitstag?'),
  ],
};
