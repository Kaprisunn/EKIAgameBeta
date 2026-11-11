# Stand: EKIA Kaiserslautern

**Spiel-Link:** https://claude.ai/artifact/RHUECknAuqPv52VwFmCeHA
**Letzter Meilenstein:** M6 Parkplatz, Glasschiebetür & Wagen-Rallye (fertig) · **Nächster:** M7 Multi-Blaster (PLAN.md)

## Was funktioniert
- Drei Ebenen: Erdgeschoss, Obergeschoss (Treppe, Aufzug) und Parkplatz (Glasschiebetür am Ausgang EG ↔ Tür in der Fassade).
  Nur die aktive Ebene wird gezeichnet; nach jedem Wechsel 0,9 s Sperre gegen Flackern.
- Parkplatz: Fassade „EKIA KAISERSLAUTERN“, Gehweg, Parklinien, 20 bunte Autos, Hecken, Wagenboxen, Laternen, Spielplatz,
  6 Kund:innen (auch mit ❓), ein Logistik-Kollege an der Wagenbox.
- Wagen-Rallye: am Wagenhäuschen (🛒) starten, 5 Wagen in 30 s einsammeln (Kette folgt), Anzeige im blauen Funk-Streifen,
  30 Punkte + 1 je Restsekunde. Bei Zeitablauf kein Verlust, neuer Versuch möglich.
- 12 Missionen (Ampel). Neu draußen: 🔴 „Wagen rollen weg“, 🟢 „Kofferraum-Tetris“ (Sortieren, jedes Shirt).
- Charakter-Editor (Abteilung inkl. ComIn, P&C; Frau/Mann, Hautton, Alter mit Bart), Streifen-Shirts, Warnweste vor der Logistik,
  Minispiele (Timing, Sortieren), Kundenfragen je Abteilung, NPCs, HUD, Haus-Funk wie zuvor.
- Leistung im Test: EG 66 Draw Calls / ca. 68.000 Dreiecke (Budget 150 / 100.000).
- Getestet: Tür in beide Richtungen, Rallye bis zum Sieg, Kofferraum-Mission startet.

## Technik-Notizen
- Ebenen in karte.js (eg, og, pp); Außen-Ebene: aussen: true (Asphalt, Fassade statt Wänden), linien, tueren.
- Möbel draußen: moebel-aussen.js (Autos mit Farbe je Instanz über `farben`). Rallye: rallye.js.
- window.__test: etage(id, x, z), profil, weste, mission(id), rallye(), fragende(), pos().

## Was fehlt
- Multi-Blaster (M7), mehr Lernfälle, Schichtbericht und Figur-Feinschliff (M8). Leistung auf dem iPad ungeprüft.

## Bekannte Fehler
- Kund:innen hängen manchmal kurz an Möbeln oder Autos. Hängende Schilder verdecken die Figur kurz beim Darunterlaufen.
