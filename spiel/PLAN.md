# Plan: EKIA Kaiserslautern

Ein Meilenstein = eine Sitzung, jeder endet mit etwas Spielbarem. Status: ✅ fertig · ⬜ offen.
Zeichen: ⚠️ = vereinfacht fürs iPad. 🔶 = Annahme. In Klammern: benötigte Abschnitte aus SPIEL.md.

### M1 – Grundgerüst ✅
Halle, Figur mit Animationen, Joystick/Tastatur, Kamera, Licht, Menü/Pause, Test-Skript.

### M2 – Etagen-System & Erdgeschoss ✅
Karte als Daten (karte.js), Möbel-Baukasten, Etagen-Bau, Text-Schilder, Interaktionspunkte, Treppe und Aufzug.

### M3 – Mehr Leben im Haus ✅
Halle 64 × 44, weite SB-Halle und Kassen, Click & Collect mit offenem Lagertor, Deko, Umkleide, Büro, NPCs mit Sprechblasen.

### M4 – Ampel-Missionen & Kleiderordnung ✅
(8.2–8.4) 10 Lern-Missionen (lerninhalte.js, missionen.js) mit schwebenden Symbolen Rot/Gelb/Grün, Frage-Tafel A/B/C,
Erklärung und Denk-Tipp. Gelb/Blau-Shirt im Startmenü und an Spinden (EG und OG) mit Farb-Wirbel. Kolleg:innen nach
Kleiderordnung (Restaurant mit Schürze). HUD mit Punkten, Haus-Funk für Notfälle. Fortschritt gespeichert, im Pausenmenü zurücksetzbar.

### M5 – Rollen, Streifen-Shirts, Warnweste & Minispiele ✅
(9.1–9.3) Charakter-Editor im Startmenü und an den Spinden (Abteilung, Figur, Hautton, Alter mit weißem Bart), Streifen-Shirts,
Warnweste vor der Logistik, Minispiele Timing (Teppich scannen) und Sortieren (Regal-Sicherheit), Kund:innen mit ❓ folgen kurz
und stellen Fragen je Abteilung. Nebenfiguren mit weniger Dreiecken.

### M6 – Parkplatz, Glasschiebetür & Wagen-Rallye ✅
(8.1, 9.3 Nr. 4) Dritte Ebene „Parkplatz“ (karte.js, moebel-aussen.js): blaue Fassade „EKIA KAISERSLAUTERN“, Gehweg, Asphalt mit
Parklinien, 20 Autos, Berberitzen-Hecken, 2 Wagenboxen, Laternen, Spielplatz. Glasschiebetür am Ausgang (öffnet, wenn man davorsteht;
Sperre gegen Flackern). Wagen-Rallye (rallye.js): 5 Wagen in 30 s einsammeln, sie hängen sich als Kette an. Missionen „Wagen rollen weg“
(jetzt draußen) und „Kofferraum-Tetris“ (Sortier-Minispiel). Kund:innen und ein Kollege auf dem Parkplatz.

### M7 – Multi-Blaster ✅
(5, 9.4) blaster.js: Station vor der zweiten Wagenbox, 3 Wellen grummeliger Kund:innen (rot, Grummel-Wolke), 📡 Barcode-Ring und
🧆 Köttbullar-Snack (zweiter Knopf), Herzchen-Partikel, blaue Tasche, Umkehren, Punkte und Bonus. Zähler im blauen Funk-Streifen.

### M8 – Mehr Lernfälle, Schicht & Feinschliff ✅
(6.2, 6.3, 8.3) Minispiele „Zweite Chance“ (Fundgrube, dreimal festdrehen) und „Restaurant-Takt“ (Tabletts nach Bestellung),
jetzt 14 Missionen. Schicht von 6 Minuten mit Uhr im HUD, Schichtbericht (Sterne, Werte, Lerntipp; auch über das Pausenmenü).
Figur: Ohren, Augenbrauen, schwarze Schuhe mit roter Sohle, Cargo-Tasche für Logistik. Hochformat: kleinere Tafeln und HUD.

### M9 – Abzeichen, Pausenraum-Quiz & Englisch ✅
(9.5) abzeichen.js (8 Abzeichen, Meldung bei neuer Stufe), quiz.js (Pausenraum, 3 Fragen pro Schicht), englischsprachige
Kundenfragen, Pausenraum mit Espresso-Station, Hinweise in einer Warteschlange, Renderer in renderer.js ausgelagert.

## Vorschläge für danach
- Leistung auf dem iPad prüfen (Rückmeldung von dir) und bei Bedarf Details sparen.
- Lerntexte mit dem Team prüfen; neue Fälle einfach in lerninhalte.js und kundenhilfe.js ergänzen.
- main.js (ca. 240 Zeilen) und blaster.js (ca. 255 Zeilen) bei Gelegenheit aufteilen.

## Später (zurückgestellt)
Zwei Währungen, Pausenraum-Upgrades.
