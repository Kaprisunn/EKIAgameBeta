# Stand: EKIA Kaiserslautern

**Spiel-Link:** https://claude.ai/artifact/RHUECknAuqPv52VwFmCeHA
**Letzter Meilenstein:** M3 Mehr Leben im Haus (fertig) · **Nächster:** M4 Haupt- und Nebenmissionen (PLAN.md)

## Was funktioniert
- Menü → Spiel → Pause (Knopf oben rechts, P/Esc, Tab-Wechsel pausiert). Etagen-Anzeige oben links.
- Halle 64 × 44, zwei Etagen; Treppe (hineinlaufen) und Aufzug (Knopf ⬆️/⬇️) wechseln mit Überblendung.
- EG: Markthalle (Regale, Wühltische, Lampentisch, Bilderwand, Körbe, Teppiche, Pflanzenregal), SB-Halle mit
  8 breiten Gängen und Abholbereich, 5 Kassen mit Absperrungen, 3 SB-Kassen, Hotdog-Bereich, Fundgrube, Säulen,
  Einkaufswagen. Logistik hinter Zaun und Schranke (öffnet nur für Rolle Logistik). Click & Collect:
  Theke vor dem offenen Lagertor, ein Logistiker trägt Kartons vom Lager zur Theke.
- OG: Wohnzimmer, Schlafzimmer, Küche, Kinderzimmer, Restaurant (9 Tischgruppen), Umkleide (Spinde, Spiegel,
  Kabine, Knopf „Umziehen“ zeigt Hinweis), Großraumbüro mit 5 Schreibtisch-Inseln.
- NPCs: 9 Kund:innen im EG, 8 im OG (bunt, verschiedene Hauttöne, teils mit Tüte); 8 Kolleg:innen je Etage
  (stehen, sitzen am Schreibtisch, Kasse, Theke). Sprechblasen in der Nähe, Winken wird meist erwidert.
- Rolle Verkauf/Logistik per Testknopf im Pausenmenü (gespeichert).
- Leistung im Test: Eingang EG 61 Draw Calls / ca. 72.000 Dreiecke; OG 46 / 54.000 (Budget 150 / 100.000).

## Technik-Notizen
- Grundriss: src/karte.js. Leute: src/leute.js (Wegpunkte, Kolleg:innen, Sprüche). Möbeltypen: moebel.js,
  moebel-og.js, moebel-deko.js. NPC-Logik: npc.js (nur aktive Etage, keine echten Schatten, Schattenflecken).
- Nebenfiguren nutzen baueFigur mit `einfach: true` (Augen im Kopf, 6 Draw Calls pro Figur).
- Schilder-Atlas jetzt 2048 × 1024. window.__test.etage(id, x, z) versetzt die Figur.
- Dreiecke werden knapp: neue große Deko sparsam, NPC-Anzahl je Etage nicht über ca. 18.

## Was fehlt
- Missionen und Kundenfragen (M4), Schicht (M5), Figur 2.0 und Editor (M6, M7).
- Leistung auf dem echten iPad ungeprüft.

## Bekannte Fehler
- Kund:innen können kurz an Möbeln hängen, bevor sie ein neues Ziel wählen. Hängende Schilder verdecken die
  Figur kurz, wenn man darunter durchläuft.
