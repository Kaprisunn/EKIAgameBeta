# Plan: EKIA Kaiserslautern (Teil 2)

Ein Meilenstein = eine Sitzung, jeder endet mit etwas Spielbarem. Status: ✅ fertig · ⬜ offen.
Zeichen: ⚠️ = vereinfacht fürs iPad. 🔶 = Annahme. In Klammern: benötigte Abschnitte aus SPIEL.md.

## Phase 1 – Spielwelt

### M1 – Grundgerüst ✅
Halle, Figur mit Animationen, Joystick/Tastatur, Kamera, Licht, Menü/Pause, Test-Skript.

### M2 – Etagen-System & Erdgeschoss ✅
Karte als Daten (karte.js), Möbel-Baukasten, Etagen-Bau, Text-Schilder, Interaktionspunkte, Treppe und Aufzug.

### M3 – Mehr Leben im Haus ✅
(7.1, 7.5) Halle 64 × 44, breitere SB-Halle (8 Gänge) und Kassenzone (5 Kassen, Absperrungen, 3 SB-Kassen).
Click & Collect mit offenem Lagertor, Säulen, Markthallen-Deko, Einkaufswagen, Hotdog-Bereich.
OG: vier Wohnkojen, großes Restaurant, Umkleide und Großraumbüro hinter Trennwänden.
NPCs (npc.js, leute.js): Kund:innen bummeln, Kolleg:innen arbeiten, ein Logistiker trägt Ware zur Theke,
Sprechblasen mit Pfälzer Sprüchen, Winken wird erwidert.

## Phase 3 – Gameplay & Lernen (vorgezogen)

### M4 – Haupt- und Nebenmissionen ⬜
(7.3, 7.5, 6.3)
- lerninhalte.js: je Rolle 4 Hauptmissionen (Beispieltexte, vom Team zu prüfen) und ein Pool Nebenmissionen.
- Leuchtende Zielpunkte (Lichtsäule mit Drehring) für die aktuelle Hauptmission, Pfeil am Bildrand zeigt die Richtung.
- missionen.js mit 2 Aufgabentypen als Tafel: Auswahl (3 Antworten + „Warum?“) und Zuordnen.
- Nebenmissionen: Kund:innen mit „?“ stellen Fachfragen (Auswahl-Tafel), Kolleg:innen bitten um Hilfe.
- Punkte, Häkchen und Missionsliste oben links, gespeichert.
**Spielbar:** Lernmissionen und Kundenfragen.

### M5 – Ein Tag im Haus ⬜
(6.2, 6.3)
- Schicht mit Schichtplan und Schichtbericht (Sterne, Lerntipp), Abzeichen pro Bereich.
- Mehr Fragen und Missionen, Schwierigkeit steigt, Töne für richtig/falsch.
**Spielbar:** runde Spielrunde mit Ziel.

## Phase 2 – Charaktere

### M6 – Figur 2.0 ⬜
(7.2, STIL.md)
- Weicherer Kopf, Ohren, Augenbrauen, Hals, taillierter Körper, Schuhe schwarz mit roter Sohle.
- Shirt-Streifen als schmale Ringe; Hose schwarz (Verkauf) oder dunkelblaue Cargohose (Logistik).
- frisuren.js: kurz, gebunden, Zopf, Halbglatze, Glatze. spieler.setzeFigur(steckbrief) ohne Neustart.

### M7 – Charakter-Editor & Umkleide ⬜
(7.2, 7.4)
- editor.js: Tafel mit großen Auswahlknöpfen, Figur groß im Bild. Beim ersten Start und in der Umkleide.
- Rolle bestimmt Kleidung, Logistik-Zugang und Missionen. Wahl wird gespeichert. Rollen-Testknopf entfällt.

### M8 – Feinschliff ⬜
Hochformat-Layout, Leistungstest auf dem iPad, Texte mit dem Team abgleichen.

## Später (zurückgestellt aus Teil 1)
Parkplatz mit Einkaufswagen-Drift und Multi-Blaster, zwei Währungen, Pausenraum-Upgrades, Timing- und Spur-Minispiele.
