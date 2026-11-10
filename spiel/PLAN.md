# Plan: EKIA Kaiserslautern (Teil 2)

Ein Meilenstein = eine Sitzung, jeder endet mit etwas Spielbarem. Status: ✅ fertig · ⬜ offen.
Zeichen: ⚠️ = vereinfacht fürs iPad. 🔶 = Annahme. In Klammern: benötigte Abschnitte aus SPIEL.md.

## Phase 1 – Spielwelt

### M1 – Grundgerüst ✅
Halle, Figur mit Animationen, Joystick/Tastatur, Kamera, Licht, Menü/Pause, Test-Skript.

### M2 – Etagen-System & Erdgeschoss ✅
(7.1, 7.4) Karte als Daten (karte.js), Möbel-Baukasten (moebel.js, moebel-og.js), Etagen-Bau (etage.js),
Text-Schilder „EKIA Kaiserslautern“ (schilder.js), Interaktionspunkte (interaktion.js). EG: Markthalle, SB-Halle
mit Gängen, Kassen, SB-Kassen, Hotdog-Stand, Fundgrube, Logistik hinter Zaun und Schranke. Treppe (automatisch)
und Aufzug (Knopf) wechseln die Etage. OG-Vorstufe: Showroom-Kojen und Restaurant. Rolle per Testknopf im Pausenmenü.

### M3 – Obergeschoss vollständig ⬜
(7.1)
- Umkleide: Spinde, Bank, Spiegel, Kabine mit Vorhang (Interaktionspunkt „Umziehen“, Funktion ab M5).
- Großraumbüro: Schreibtisch-Inseln mit Monitoren und Stühlen (InstancedMesh).
- Showroom erweitern: Küche und Kinderzimmer als weitere Kojen. Staff-Bereich mit Tür abgetrennt.
- Pfeilweg im OG überarbeiten, Staubwölkchen beim Laufen (Partikel-Pool).
**Spielbar:** beide Etagen komplett.

## Phase 2 – Charaktere

### M4 – Figur 2.0 ⬜
(7.2, STIL.md)
- Weicherer Kopf, Ohren, Augenbrauen, Hals, taillierter Körper, Daumen, Schuhe schwarz mit roter Sohle.
- Shirt-Streifen als schmale dunklere Ringe (keine Textur); Hose schwarz (Verkauf) oder dunkelblaue Cargohose mit Taschen (Logistik).
- frisuren.js: kurz, gebunden, Zopf, Halbglatze, Glatze. Steckbrief-Optionen in daten.js.
- spieler.setzeFigur(steckbrief) tauscht die Figur ohne Neustart (alte Geometrien mit dispose freigeben).
**Spielbar:** Testknopf „Zufallsfigur“ im Pausenmenü.

### M5 – Charakter-Editor & Umkleide ⬜
(7.2, 7.4)
- editor.js: Tafel mit großen Auswahlknöpfen, Figur groß im Bild (Nahmodus der Kamera).
- Beim ersten Start und in der Umkleide („Umziehen“). Rolle bestimmt Kleidung, Logistik-Zugang und Missionen.
- Wahl wird gespeichert, 🎲 würfelt eine Figur. Der Rollen-Testknopf entfällt.
**Spielbar:** eigene Figur gestalten.

## Phase 3 – Gameplay & Lernen

### M6 – Missionen & Zielpunkte ⬜
(7.3, 6.3)
- lerninhalte.js: je Rolle 4 Missionen (Beispieltexte, vom Team zu prüfen).
- Leuchtende Zielpunkte (Lichtsäule mit Drehring) in Rollenfarbe, nur die eigenen sichtbar.
- missionen.js mit 2 Aufgabentypen als Tafel: Auswahl (3 Antworten + „Warum?“) und Zuordnen.
- Punkte und Häkchen pro Mission (gespeichert), Aufgabenliste oben links.
**Spielbar:** alle Missionen der eigenen Rolle.

### M7 – Kund:innen mit Fachfragen ⬜
(7.3, 6.3)
- npc.js: Kund:innen aus baueFigur (Freizeitkleidung, ohne Umriss) laufen zwischen Wegpunkten.
- Mit „?“ kommen sie auf dich zu; „Zuhören“ öffnet die Auswahl-Tafel aus M6 mit einer Fachfrage.
- ⚠️ Höchstens 8 pro Etage, nur auf der aktiven Etage, runde Schattenflecken statt echter Schatten.
**Spielbar:** lebendiges Haus mit Kundenfragen.

### M8 – Feinschliff ⬜
Mehr Fragen und Missionen, Töne, Hochformat-Layout, Leistungstest auf dem iPad, Texte mit dem Team abgleichen.

## Später (zurückgestellt aus Teil 1)
Parkplatz mit Einkaufswagen-Drift und Multi-Blaster, zwei Währungen, Pausenraum-Upgrades, Timing- und Spur-Minispiele.
