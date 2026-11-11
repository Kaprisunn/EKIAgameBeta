# Stand: EKIA Kaiserslautern

**Spiel-Link:** https://claude.ai/artifact/RHUECknAuqPv52VwFmCeHA
**Letzter Meilenstein:** M4 Ampel-Missionen & Kleiderordnung (fertig) · **Nächster:** M5 Parkplatz & Glasschiebetür

## Was funktioniert
- Menü mit Shirt-Wahl (Gelb · Verkauf / Blau · Lager & Restaurant) → Spiel → Pause (Missionen zurücksetzen mit zwei Tippern).
- Zwei Etagen (64 × 44) mit Treppe, Aufzug, vielen Möbeln, Click & Collect, NPCs mit Sprechblasen und Winken.
- 10 Missionen mit schwebenden Symbolen (über Wände sichtbar): 🔴 Pfütze (Hauptgang EG), Karton (Gang 3), Wagen (Ausgang);
  🟡 schwerer Karton (Logistik), Kassen-Stau (Büro OG), Transport (Kundenservice); 🟢 Preisschild (Showroom OG),
  Mehrpaket (Kasse), Paletten (Logistik), Frische (Restaurant OG). Knopf zeigt ❗/🤝/✅ in der Nähe.
- Kleiderordnung geprüft (Rot gilt immer). Spinde: EG bei der SB-Halle (18.7, -12.5), OG in der Umkleide. Farb-Wirbel beim Umziehen.
- Punkte: Rot 30, Gelb 20, Grün 10, nach falscher Antwort die Hälfte. Fortschritt und Shirt gespeichert.
- HUD oben links, Haus-Funk oben (rot) bei offenen Notfällen. Logistik-Schranke öffnet mit blauem Shirt.
- Kolleg:innen tragen Gelb (Verkauf), Blau (Logistik, Restaurant mit Schürze) oder gemischt (Büro).
- Leistung im Test: 50–53 Draw Calls, ca. 55.000–68.000 Dreiecke (Budget 150 / 100.000).
- Getestet: Rot öffnet mit blauem Shirt, Verkaufsaufgabe mit Blau wird abgelehnt, Spind wechselt, Punkte zählen.

## Technik-Notizen
- Missionen nur in src/lerninhalte.js ändern (Texte, Orte, Antworten). Logik: missionen.js; Personen dazu baut npc.js.
- Spieler-Figur steckt in einer festen Hülle (spieler.js); setzeShirt baut die Figur neu.
- window.__test: etage(id, x, z), shirt('gelb'|'blau'), mission(id).

## Was fehlt
- Parkplatz, Blaster, Charakter-Profile, weitere Lernfälle (PLAN.md M5–M8). Leistung auf dem iPad ungeprüft.

## Bekannte Fehler
- Kund:innen hängen manchmal kurz an Möbeln. Hängende Schilder verdecken die Figur kurz beim Darunterlaufen.
