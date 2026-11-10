# Plan: EKIA Kaiserslautern

Ein Meilenstein = eine Sitzung, jeder endet mit etwas Spielbarem. Status: ✅ fertig · ⬜ offen.
Zeichen: ⚠️ = für iPad oder Tokenbudget zu aufwendig, daneben die Vereinfachung. 🔶 = Annahme (siehe SPIEL.md Abschnitt 6).
Abschnitte aus SPIEL.md, die der Meilenstein braucht, stehen in Klammern.

## M1 – Grundgerüst ✅
(6.5 Figuren-Pass, 6.6 Palette, 6.8 Grundriss)
Diorama-Halle mit Boden, Wänden, Palettenregalen, Kartons, Wohnkojen, Restaurant-Tischen, Kassen, Pflanzen, gelben Pfeilen und Pfälzerwald dahinter. Mitarbeiter-Figur mit Lauf-, Atem-, Blinzel- und Winkanimation, Joystick und Tastatur, Kamera, Licht, Menü und Pause.
**Spielbar:** durch die Halle laufen und winken.

## M2 – Halle lebt ⬜
(3.1, 3.2 nur Säulen, 6.4)
- Gelber Pfeilweg mit +15 % Tempo-Bonus, 7 rotierende Lichtsäulen mit Namensschild, Abkürzungstüren.
- Staubwölkchen (Partikel-Pool), Kaufhaus-Gong, Schrittgeräusche, Minikarte als kleine HTML-Karte.
- 2–3 Kolleg:innen als Nebenfiguren, die zurückwinken. 10 goldene Inbusschlüssel zum Sammeln.
- ⚠️ Y-Sorting → entfällt, das macht der Tiefenpuffer in 3D automatisch. Hohe Regale stehen so, dass ihre Gänge zur Kamera zeigen.
**Spielbar:** Halle erkunden, Säulen finden, Schlüssel sammeln.

## M3 – Timing-Balken: Kasse & Fundgrube ⬜
(3.2 Nr. 3 und 5, 4, 6.3)
- Gemeinsamer Timing-Balken als HTML-Tafel, gesteuert über Daten (Tempo, Zielbreite, Anzahl Treffer).
- Kasse: Laser im grünen Bereich auslösen; Fundgrube: dreimal das goldene Fenster treffen.
- Zwei Währungen mit Anzeige oben, Lernkarte „Warum?“ nach jeder Runde, Mentor-Erklärung beim ersten Besuch.
- ⚠️ Artikel unter Teppichen als 3D-Szene → stattdessen gezeichnete Artikel-Symbole auf dem Band in der Tafel.
**Spielbar:** 2 Abteilungen mit Belohnung.

## M4 – Spur-Sortierung: Logistik & Restaurant ⬜
(3.2 Nr. 1 und 6, 6.3 Nr. 6)
- Gemeinsames 3-Spuren-Minispiel (Wischen oder Pfeiltasten): Kartons auf die farbige Palette, Tabletts mit der bestellten Kombination bestücken.
- Gabelstapler-Moment „Sicher gearbeitet“ in der Logistik.
- ⚠️ 5 Speisen frei kombinierbar → pro Tablett höchstens 3 Zutaten aus 5, als große Symbole.
**Spielbar:** 4 Abteilungen.

## M5 – Auswahlrad: Verkauf, Kundenservice & Kunden ⬜
(3.2 Nr. 2 und 4, 3.3, 6.3 Nr. 1–2)
- 3-Optionen-Rad mit Zeitbalken, Antworten und Erklärungen aus einer Lernkarten-Datei (Beispieltexte zum Prüfen).
- Kundenservice zweistufig: erst beruhigen, dann Ersatzteil zuordnen.
- Kund:innen mit „!“ laufen durch die Halle und sprechen dich an (höchstens 12 gleichzeitig, ohne Umriss).
- ⚠️ „Skizzierte Montage-Karten“ als Bilder → einfache Symbole aus CSS und Emoji.
**Spielbar:** 6 Abteilungen und zufällige Kunden-Ereignisse.

## M6 – Büro, Pausenraum & Schicht ⬜
(3.2 Nr. 7, 4, 6.2, 6.3 Nr. 5 und 7)
- Büro: Grundriss als HTML-Karte, Engpässe blinken, Kolleg:innen per Tippen zuteilen.
- Pausenraum mit 5 sichtbaren Upgrades (Espresso, Akkuschrauber, Dubbeglas-Vitrine; Rollen und Doppel-Blaster wirken ab M7).
- Schicht von 6 Minuten mit Schichtplan, Schichtbericht (Sterne, Lerntipp), Abzeichen. Speichern im Browser.
**Spielbar:** kompletter Innen-Kreislauf mit Fortschritt.

## M7 – Parkplatz & Multi-Blaster ⬜
(5, 4 Nr. 4–5, 6.7)
- Szenenwechsel durch die Glasschiebetür, Parkplatz mit Hecken-Inseln, Wagenhäuschen, Spielplatz und Wald.
- Einkaufswagen mit Trägheit und Drift, Wellen ungeduldiger Kund:innen, zwei Projektile, Herz-Partikel, Belohnung.
- ⚠️ „Nahtloser“ Übergang → kurze Überblendung (0,4 s) mit Schiebetür-Geräusch; die Halle wird dabei freigegeben (dispose).
- ⚠️ Reifenspuren auf dem Asphalt → Ring aus 80 flachen Streifen als InstancedMesh, ältere werden wiederverwendet.
- ⚠️ Viele Kund:innen gleichzeitig → höchstens 20, vereinfachte Figuren als InstancedMesh.
**Spielbar:** Action-Modus mit Rückweg in die Halle.

## M8 – Feinschliff & Lernpaket ⬜
(6.3, 6.4)
- Schwierigkeit steigt über die Schichten, Combo-Serien mit Konfetti, Sonderlagen.
- Freiwilliges Wissens-Quiz im Pausenraum, Übersicht aller Lernkarten.
- Ton-Feinschliff, Hochformat-Layout, Leistungsstufen prüfen, Texte mit dem Team abstimmen.
**Spielbar:** rundes Gesamtspiel zum Weitergeben.

## Offene Fragen an dich
- Passt die Schicht-Idee (6 Minuten pro Runde) und die neue Option „An Kolleg:in übergeben“?
- Soll das Spiel an Kolleg:innen weitergegeben werden? Dann prüfen wir echte Markennamen (siehe SPIEL.md 6.7).
- Kommt noch „Teil 2“ des Konzepts? Dann ergänze ihn in SPIEL.md, und ich passe diesen Plan an.
