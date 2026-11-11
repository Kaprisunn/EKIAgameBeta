# Stand: EKIA Kaiserslautern

**Spiel-Link:** https://claude.ai/artifact/RHUECknAuqPv52VwFmCeHA
**Letzter Meilenstein:** M5 Rollen, Streifen-Shirts, Warnweste & Minispiele (fertig) · **Nächster:** M6 Parkplatz & Wagen-Rallye

## Was funktioniert
- Startmenü = Charakter-Editor: Abteilung (Verkauf, Logistik, Restaurant, ComIn, P&C), Frau/Mann, Hautton, jung/60+ (weißes Haar,
  Männer mit Vollbart). Figur bleibt rechts neben dem Menü sichtbar. Dieselbe Auswahl an den Spinden („Umkleide“, EG und OG).
- Streifen-Shirts: Verkauf gelb/dunkelgelb, alle anderen blau/dunkelblau; Restaurant mit Schürze. Profil gespeichert.
- Warnweste: Ohne Weste stoppt die Schranke zur Logistik, Tafel mit [Weste anlegen]; mit Weste offen (getestet).
- 11 Missionen (Ampel Rot/Gelb/Grün). Minispiele: Timing „Teppich unterm Wagen“ (Ausgang EG), Sortieren „Regal-Sicherheit“ (Logistik).
  Die übrigen als Auswahl A/B/C. Kleiderordnung geprüft, Rot gilt immer. Leertaste/U steuert auch die Minispiele.
- Kund:innen mit ❓ (bis zu 2 je Etage) folgen kurz; „Helfen“ stellt eine Frage passend zur eigenen Abteilung (10 Fragen).
- Kolleg:innen: Verkauf gelb gestreift, Logistik blau mit Weste, Restaurant mit Schürze, ComIn (meist lange Haare), P&C im Büro.
- Zwei Etagen mit Treppe, Aufzug, Möbeln, Click & Collect, NPCs, Sprechblasen, HUD und Haus-Funk wie zuvor.
- Leistung im Test: 59–82 Draw Calls, ca. 67.000–84.000 Dreiecke (Budget 150 / 100.000).

## Technik-Notizen
- Profil → Figur: steckbriefAus() in spieler.js. Editor: editor.js. Minispiele: minispiele.js (auswahl, timing, sortieren, weste).
- Missionen in lerninhalte.js (typ: auswahl | timing | sortieren), Kundenfragen in kundenhilfe.js, Logik in kundenfragen.js.
- Nebenfiguren mit weniger Unterteilung (figuren.js: fein = 0,6). window.__test: etage, profil, weste, mission, fragende, pos.

## Was fehlt
- Parkplatz mit Glasschiebetür und Wagen-Rallye (M6), Multi-Blaster (M7), weitere Lernfälle und Schichtbericht (M8).
- Leistung auf dem echten iPad ungeprüft; die Dreiecke liegen je nach Blickwinkel nahe am Budget.

## Bekannte Fehler
- Kund:innen hängen manchmal kurz an Möbeln. Hängende Schilder verdecken die Figur kurz beim Darunterlaufen.
