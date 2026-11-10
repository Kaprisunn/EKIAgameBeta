# Stand: EKIA Kaiserslautern

**Spiel-Link:** https://claude.ai/artifact/RHUECknAuqPv52VwFmCeHA
**Letzter Meilenstein:** M2 Etagen-System & Erdgeschoss (fertig) · **Nächster:** M3 Obergeschoss vollständig (PLAN.md)

## Was funktioniert
- Menü → Spiel → Pause (Knopf oben rechts, P/Esc, Tab-Wechsel pausiert). Etagen-Anzeige oben links.
- Zwei Etagen (52 × 36), nur die aktive ist sichtbar. Treppe: hineinlaufen wechselt automatisch.
  Aufzug: davor stellen, rechter Knopf zeigt ⬆️/⬇️ „Aufzug“. Kurze Überblendung, „Ding“-Ton.
- EG: Eingang/Ausgang, Markthalle (6 Regale, 2 Wühltische), SB-Halle (5 Hochregale, Gang 1–5), 3 Kassen,
  2 SB-Kassen, Hotdog-Stand mit Stehtischen, Fundgrube, Logistik hinter gelb-schwarzem Zaun mit Schranke,
  Stapler, Rollwagen, Wareneingang. Schranke öffnet nur für Rolle Logistik (sonst Hinweis); hinaus geht immer.
- OG (Vorstufe): Wohnzimmer- und Schlafzimmer-Koje, Restaurant mit 6 Tischgruppen und Theke, Holzdielen,
  blauer Gebäudesockel, Außenwelt liegt tiefer.
- Schilder mit Text (Atlas), u. a. „EKIA Kaiserslautern“ und „Willkommen in Kaiserslautern“.
- Rolle Verkauf/Logistik per Testknopf im Pausenmenü (gespeichert), bis der Editor (M5) kommt.
- Figur, Animationen, Joystick, Tastatur, Töne, Fehleranzeige wie in M1.
- Leistung im Test: EG 36 Draw Calls / 46.178 Dreiecke, OG 31 / ca. 38.000 (Budget 150 / 100.000).

## Technik-Notizen
- Grundriss nur in src/karte.js ändern (Möbel, Schilder, Punkte, Pfeile). Neue Möbeltypen in moebel.js / moebel-og.js.
- etage.js verschmilzt Einzelstücke zu 1 Mesh, häufige Möbel (ab 3) werden InstancedMesh; Kollision aus `fuss`.
- interaktion.js: Punkte mit art/x/z/r; treppe und schranke lösen automatisch aus, der Rest per Aktionsknopf.
- window.__test.etage(id, x, z) versetzt die Figur (für Tests und Fehlersuche).

## Was fehlt
- M3: Umkleide, Großraumbüro, weitere Kojen. Danach Figur 2.0, Editor, Missionen, Kund:innen (PLAN.md).
- Leistung auf dem echten iPad ungeprüft.

## Bekannte Fehler
- Keine bekannt. Im Hochformat nur Hinweis und etwas weitere Kamera.
