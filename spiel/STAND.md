# Stand: EKIA Kaiserslautern

**Spiel-Link:** https://claude.ai/artifact/RHUECknAuqPv52VwFmCeHA
**Letzter Meilenstein:** M1 Grundgerüst (fertig) · **Nächster:** M2 „Halle lebt“ (siehe PLAN.md)

## Was funktioniert
- Menü → Spiel → Pause (Knopf oben rechts, Taste P/Esc, Tab-Wechsel pausiert automatisch).
- Diorama-Halle 44 × 32: Fliesenboden, Wände mit blauem Band, Birkenholz-Platte, Pfälzerwald dahinter, Nebel, Himmelsverlauf.
- Requisiten: 3 Palettenregale, 4 Paletten, 2 Wohnkojen, Fundgrube, Restaurant (6 Tischgruppen, Theke), 3 Kassen, 2 SB-Kassen, Kundenservice, 2 Aktionsinseln, 10 Pflanzen, gelbe Pfeile.
- Hauptfigur aus dem Figuren-Baukasten (Steckbrief in src/daten.js) mit Umriss, Augen, Blinzeln, Atmen, Umherschauen, Laufen, Winken.
- Steuerung: Joystick links (erscheint unter dem Finger), Wink-Knopf rechts; Tastatur WASD/Pfeile, Leertaste/E, Enter, P.
- Kollision mit Wänden und Möbeln, Kamera folgt weich und schaut voraus.
- Töne (synthetisch): Klick, Schritte, Winken; Ton startet beim ersten Tippen.
- Fehler werden im Spiel angezeigt; window.__info liefert Draw Calls und Dreiecke.
- Leistung im Test: 35 Draw Calls, ca. 43.000 Dreiecke (Budget 150 / 100.000). Pixelverhältnis sinkt automatisch bei unter 45 Bildern/s.

## Technik-Notizen
- Jede Figurengruppe ist EIN Mesh mit Vertex-Farben (ein gemeinsames Toon-Material) plus Umriss-Hülle: spart viele Draw Calls.
- PCFSoftShadowMap gibt es in three r186 nicht mehr: PCFShadowMap mit shadow.radius = 3 für weiche Schatten.
- Dateien: main, zustand, eingabe, kamera, welt, requisiten, formen, figuren, animation, spieler, ui, audio, daten.

## Was fehlt
- Alles ab M2: Säulen, Tempo-Bonus auf dem Pfeilweg, Minispiele, Währungen, Kund:innen, Pausenraum, Parkplatz.
- Leistung auf dem echten iPad noch ungeprüft.

## Bekannte Fehler
- Keine bekannt. Im Hochformat erscheint nur ein Hinweis, die Kamera zoomt etwas heraus.
