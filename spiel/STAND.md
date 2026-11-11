# Stand: EKIA Kaiserslautern

**Spiel-Link:** https://claude.ai/artifact/RHUECknAuqPv52VwFmCeHA
**Letzter Meilenstein:** M9 Abzeichen, Pausenraum-Quiz & Englisch (fertig) · **Nächstes:** Vorschläge in PLAN.md

## Was funktioniert
- Startmenü = Charakter-Editor (Abteilung inkl. ComIn, P&C; Frau/Mann, Hautton, jung/60+ mit Bart), auch an den Spinden.
- Drei Ebenen: Erdgeschoss, Obergeschoss (Treppe, Aufzug), Parkplatz (Glasschiebetür). NPCs, Sprechblasen, Winken.
- 14 Missionen im Ampel-System (Rot = Notfall für alle, Gelb, Grün mit Kleiderordnung). Minispiele: Auswahl, Timing
  (Teppich scannen, Zweite Chance mit 3 Treffern), Sortieren (Regal, Kofferraum), Restaurant-Takt (3 Tabletts).
- Kund:innen mit ❓ folgen kurz und stellen Fragen passend zur Abteilung. Warnweste vor der Logistik.
- Parkplatz: Wagen-Rallye (5 Wagen in 30 s) und Multi-Blaster (3 Wellen, Ring und Köttbullar).
- Schicht: 6 Minuten (Uhr im HUD, pausiert bei Tafeln, Rallye und Blaster), danach Schichtbericht mit 1–3 Sternen
  (ab 35 / 80 Punkten), Werten und Lerntipp. Im Pausenmenü: Schicht beenden, Missionen zurücksetzen.
- Abzeichen (Bronze/Silber/Gold) für 5 Missions-Bereiche, Kundenprofi, Parkplatz und Wissen; im Pausenmenü und Schichtbericht.
- Pausenraum (OG zwischen Umkleide und Büro): Wissens-Quiz 🧠 mit 3 Fragen, einmal pro Schicht. Etwa jede dritte Kundenfrage auf Englisch.
- Figur: Streifen-Shirt, Ohren, Augenbrauen, schwarze Schuhe mit roter Sohle, Cargo-Tasche (Logistik), Schürze (Restaurant).
- Hochformat: Menü zentriert, kleinere Tafeln, Hinweis zum Querhalten.
- Leistung im Test: 55–65 Draw Calls, ca. 66.000–68.000 Dreiecke (Budget 150 / 100.000).
- Getestet: Quiz (auch Sperre bis zur nächsten Schicht), Abzeichen-Meldung, Pausenmenü mit Abzeichen.

## Technik-Notizen
- Inhalte: lerninhalte.js (Missionen), kundenhilfe.js (Kundenfragen), leute.js (NPCs), karte.js (Ebenen).
- Abzeichen: abzeichen.js (Bereiche in lerninhalte.js GRUPPEN). Quiz: quiz.js. Renderer und Leistung: renderer.js.
- Minispiele: minispiele.js (auswahl, timing mit treffer/knopf, tablett, sortieren mit oben/unten, weste). Schicht: schicht.js.
- window.__test: etage, profil, weste, mission, quiz, abzeichen, rallye, blaster, feuer, fragende, pos.

## Was fehlt
- Leistung auf dem echten iPad ungeprüft. Lerntexte sind Beispiele und sollten vom Team geprüft werden.
- main.js und blaster.js sind etwas länger als 200 Zeilen.

## Bekannte Fehler
- Kund:innen hängen manchmal kurz an Möbeln oder Autos. Hängende Schilder verdecken die Figur kurz beim Darunterlaufen.
