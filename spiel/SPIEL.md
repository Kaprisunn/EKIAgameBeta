# PROJEKT-INFORMATION & KONZEPT-WISSENSBASIS: "EKIA KAISERSLAUTERN" (TEIL 1)

## 1. PROJEKT-ZIEL & GRUNDVISION
- **Projekttitel:** EKIA Kaiserslautern
- **Kern-Idee:** Ein eigenständiges, im Webbrowser (Desktop & Mobilgeräte) lauffähiges 2.5D-Top-Down-Spiel im skandinavischen Einrichtungshaus-Stil, das charmante Mitarbeiter-Simulation im Innenbereich mit rasanter Arcade-Action auf dem Parkplatz verbindet.
- **Lokaler Bezug (Kaiserslautern):** Das Spiel greift reale Merkmale des Standorts Kaiserslautern auf – darunter den Blick auf den angrenzenden Pfälzerwald, den durch grüne Berberitzen-Hecken gegliederten Parkplatz, den 200-Quadratmeter-Outdoor-Spielplatz, moderne Selbstbedienungs-Kassen sowie pfälzischen Humor in den Kundendialogen.
- **Farb- & Design-Identität:** Skandinavisches Farbschema aus Kobaltblau (#0058AB), Signalgelb (#FBD914), reinem Weiß (#FFFFFF) und warmem Birkenholz (#E5C99B).

## 2. TECHNISCHE RAHMENINFORMATIONEN (FÜR RESSOURCEN- & TOKEN-SCHONENDEN AUFBAU)
- **Plattform & Steuerung:** HTML5 Canvas (2D/2.5D) mit reinem Vanilla JavaScript und kompaktem CSS (ohne schwere externe Bibliotheken). Flüssige 60 FPS, voll responsiv für Desktop (WASD / Pfeiltasten + Maus) und mobile Endgeräte (virtueller Touch-Joystick + Action-Buttons, `touch-action: none`).
- **Architektur-Prinzip:** Strikte Trennung zwischen reinen Spieldaten (Konfigurationsobjekte für Abteilungen, Dialoge, Upgrades) und der ausführbaren Spiellogik (State-Management, Renderer, Physik, Web Audio API).
- **Wiederverwendbarkeit der Systeme:** Statt sieben völlig isolierter Einzelprogramme für die sieben Abteilungen teilen sich alle Stationen drei schlanke, datengetriebene Kern-Mechaniken (Spur-Sortierung, Timing-Balken, 3-Optionen-Auswahlrad). Das hält die Codebasis kompakt, wartbar und fehlerfrei.

## 3. MODUL B: DIE INNENWELT ("EKIA KAISERSLAUTERN")
### 3.1 Raumstruktur & Navigation
- **Der Gelbe Richtungspfeil:** Auf dem hellgrauen Hallenboden führt der markante gelbe Richtungspfeil durch alle Bereiche. Bewegt sich die Spielfigur in Pfeilrichtung auf dieser Markierung, erhält sie einen passiven Geschwindigkeits-Bonus (+15 % Lauftempo).
- **Räumliche 2.5D-Tiefe (Y-Sorting):** Regale, Wohnkojen, Kassen und Personen werden nach ihrer vertikalen Fußpunkt-Position sortiert, sodass die Spielfigur räumlich hinter hohen Palettenregalen verschwinden und vor Möbeln entlanglaufen kann.
- **Abkürzungs-Türen:** Wie im realen Einrichtungshaus verbinden markierte Wanddurchgänge entfernte Abteilungen (z. B. direkter Durchgang vom Verkauf zur Fundgrube), um Laufwege taktisch abzukürzen.

### 3.2 Die 7 Abteilungen (Rotierende Missions-Säulen im GTA-Stil)
In der Halle markieren sieben leuchtende, rotierende Lichtzylinder die Abteilungen. Jede Säule repräsentiert ein konkretes Aufgabenfeld mit eigener thematischer Ausprägung:
1. **Abteilung 1 – Logistik (Lager & Paletten):**
   - *Mechanik:* Spur-Sortierung (Lane-Sorting).
   - *Inhalt:* Flache Möbelkartons (Regale, Kleiderschränke, Kommoden) gleiten auf drei Bahnen heran und müssen per Richtungswechsel passgenau auf die farblich markierten Gabelstapler-Paletten verteilt werden.
2. **Abteilung 2 – Verkauf (Wohnkojen & Beratung):**
   - *Mechanik:* 3-Optionen-Auswahlrad auf Zeit.
   - *Inhalt:* Kunden in den Birkenholz-Musterzimmern beschreiben ihr Wohnproblem (oft mit Pfälzer Lokalkolorit); aus drei skizzierten Montage-Karten wird das passende Einrichtungsstück ausgewählt.
3. **Abteilung 3 – Kasse (Checkout & Paket-Prüfung):**
   - *Mechanik:* Präzisions-Timing-Balken.
   - *Inhalt:* Artikel laufen über das Kassenband bzw. durch die Express-Zone. Der rote Scanner-Laser muss exakt im grünen Zielbereich ausgelöst werden, um Barcodes (auch versteckte Artikel unter großen Teppichen) fehlerfrei zu erfassen.
4. **Abteilung 4 – Kundenservice (Deeskalation & Ersatzteile):**
   - *Mechanik:* Zweistufiges Entscheidungs- & Zuordnungs-System.
   - *Inhalt:* Zunächst wird ein gestresster Kunde am Reklamationsschalter durch die richtige Gesprächsoption beruhigt; anschließend wird das fehlende Kleinteil (Holzdübel, Exzenterschraube, Scharnier) aus der Ersatzteilwand zugeordnet.
5. **Abteilung 5 – Fundgrube (Nachhaltigkeit & Upcycling):**
   - *Mechanik:* Mehrstufiger Reparatur-Takt.
   - *Inhalt:* Wackelige Ausstellungsstücke und Rückläufer werden durch dreimaliges Treffen des goldenen Timing-Fensters mit dem Inbusschlüssel stabilisiert und erhalten das gelbe Zweite-Chance-Preisschild.
6. **Abteilung 6 – Restaurant (Köttbullar & Frische-Taktung):**
   - *Mechanik:* Takt-Bestückung (Spur- & Timing-Kombination).
   - *Inhalt:* Vorbeigleitende grüne Tabletts der hungrigen Gäste werden im richtigen Rhythmus mit der bestellten Kombination aus Köttbullar, veganen Plantbullar, Rahmsoße, Preiselbeeren und Pommes bestückt.
7. **Abteilung 7 – Büro (Schicht-Koordination):**
   - *Mechanik:* Strategische Zuweisung am Haus-Grundriss.
   - *Inhalt:* Auf einer Übersichtskarte blinken akute Engpässe im Haus auf (z. B. Warteschlange an Kasse 4 oder Nachschubbedarf im Restaurant). Verfügbare Kollegen-Icons werden per Klick zugeteilt und per Kaufhaus-Gong bestätigt.

### 3.3 Dynamische Kunden-Ereignisse (Schnell-Entscheidungs-Rad)
- Während der Bewegung durch die Halle erscheinen zufällig Kunden mit einem pulsierenden gelben Ausrufezeichen über dem Kopf, die auf den Spieler zulaufen.
- Bei Kontakt öffnet sich ein schnelles Entscheidungs-Rad mit drei Reaktionswegen:
  - *Option 1 (Fach-Beratung):* Präzise Wegbeschreibung – belohnt vorrangig mit Holz-Bleistiften.
  - *Option 2 (Pfälzer Charme):* Humorvolle lokale Antwort – belohnt vorrangig mit Inbusschlüsseln.
  - *Option 3 (Schnelle Ausrede):* Höfliches Weiterverweisen – gibt keine Punkte, spart aber unter Zeitdruck wertvolle Sekunden.

## 4. PUNKTESYSTEM & PAUSENRAUM-ENTWICKLUNG
- **Zwei Spielwährungen:**
  - *Inbusschlüssel:* Verdient durch handwerkliche, logistische und schnelle Action-Aufgaben.
  - *Holz-Bleistifte:* Verdient durch Beratung, Büro-Koordination und spontane Kundenhilfe.
- **Sichtbare Pausenraum-Dekorationen mit aktivem Spiel-Vorteil (Skills):**
  1. *Schwedische Espresso-Station:* Erhöht die Grund-Laufgeschwindigkeit des Mitarbeiters dauerhaft.
  2. *Goldener Profi-Akkuschrauber:* Verbreitert den grünen Trefferbereich bei allen Timing-Aufgaben (Kasse & Fundgrube).
  3. *Pfälzer Dubbeglas-Vitrine:* Steigert die Ausbeute an Inbusschlüsseln und Bleistiften bei allen dynamischen Kunden-Ereignissen.
  4. *Chrom-Leichtlaufrollen:* Verbessert die Kurvenlage und Drift-Kontrolle des Einkaufswagens auf dem Parkplatz.
  5. *Doppel-Blaster-Aufsatz:* Erweitert den Multi-Blaster auf dem Parkplatz um einen parallelen Doppelschuss.

## 5. MODUL C: DER PARKPLATZ & DER "EKIA-MULTI-BLASTER" (ACTION-MODUS)
- **Übergang & Kulisse:** Durchquert der Spieler die automatischen Glasschiebetüren am Ausgang, wechselt die Szene nahtlos auf den weitläufigen Parkplatz vor der grünen Silhouette des Pfälzerwalds. Als natürliche Hindernisse und Drift-Kurven dienen die typischen grünen Berberitzen-Heckeninseln, Einkaufswagen-Häuschen und der abgegrenzte Outdoor-Spielplatz.
- **Einkaufswagen-Drift-Physik:** Draußen bewegt sich der Spieler mit einem Einkaufswagen fort, der über eine eigene Trägheits- und Drift-Steuerung verfügt (sichtbare Reifenspuren auf dem Asphalt und dynamisches Ausschwenken in Kurven).
- **Der "EKIA-Multi-Blaster":**
  - Ungeduldige Kunden-Wellen (erkennbar an roter Kleidung und Grummel-Symbolen) strömen über den Parkplatz Richtung Eingang.
  - Der Multi-Blaster feuert zwei harmlose, witzige Projektil-Arten ab: blaue **Barcode-Laser-Ringe** (schnell, hohe Reichweite) und warme **Köttbullar-Snacks** (Flächenwirkung).
  - Jeder getroffene ungeduldige Kunde verwandelt sich augenblicklich mit einem Herz-Partikeleffekt in einen glücklichen Stammkunden mit blauer Tragetasche, kehrt entspannt um und hinterlässt Inbusschlüssel-Punkte.

---

## 6. ANALYSE & ERGÄNZUNGEN (von Claude, November 2026)
Zeichen: 🔶 = Annahme von Claude, bitte bestätigen oder ändern. ⚠️ = zu aufwendig, Vereinfachung steht in PLAN.md.

### 6.1 Kurz-Analyse
- **Stark:** klarer Ortsbezug, drei wiederverwendbare Kern-Mechaniken, zwei Währungen mit sichtbaren Upgrades, schöner Kontrast ruhige Halle ↔ Action-Parkplatz.
- **Fehlt noch:** ein Spielablauf (Start, Ziel, Ende), Figuren-Beschreibungen, Erklärungen, *warum* eine Antwort richtig war, ein Schwierigkeitsverlauf.
- **Technik-Abgleich:** Abschnitt 2 wünscht Canvas 2D ohne Bibliotheken, CLAUDE.md legt Three.js (3D) fest. Lösung: Die schräge Diorama-Kamera sieht aus wie 2.5D. Das Y-Sorting erledigt der Tiefenpuffer der Grafikkarte von selbst (sie weiß, was vorne steht). Statt Maus: Touch und Tastatur; alle Knöpfe gehen auch per Mausklick.

### 6.2 Spielablauf 🔶
- Eine Runde = eine **Schicht** von etwa 6 Minuten. Zu Beginn zeigt der Schichtplan 3 Aufgaben (z. B. „Kasse 2×, Logistik 1×“).
- Am Ende ein **Schichtbericht**: 1–3 Sterne, verdiente Währungen, ein Lerntipp.
- Zwischen den Schichten: Pausenraum mit Upgrades.
- Parkplatz-Einsatz als Höhepunkt („Ansturm vor Ladenschluss“) oder freiwillig durch die Glastür.
- Gespeichert werden Währungen, Upgrades und Abzeichen.

### 6.3 Mehr Lernen für Mitarbeiter:innen 🔶
1. **Erklärendes Feedback:** Nach jeder Entscheidung eine kurze Zeile „Warum?“. Fehler kosten Zeit, nie bereits verdiente Punkte.
2. **Die beste Antwort hängt von der Lage ab:** Im Kunden-Rad ist nicht immer dieselbe Option richtig. Eiliger Kunde → kurz und klar. Fachfrage aus einer anderen Abteilung → Weiterleiten ist richtig. Option 3 heißt darum „An Kolleg:in übergeben“ statt „Ausrede“ und gibt Punkte, wenn sie passt.
3. **Lernkarten als Daten:** Fragen, Antworten und Tipps stehen in eigenen Daten-Dateien unter src/daten/, getrennt vom Code. Die ersten Texte sind Beispiele und sollten von echten Kolleg:innen geprüft werden, bevor das Spiel weitergegeben wird.
4. **Mentor beim ersten Besuch:** An jeder Säule erklärt eine Kollegen-Figur die Aufgabe in 2 Sätzen, dann folgt eine Proberunde ohne Zeitdruck.
5. **Abteilungs-Abzeichen** Bronze/Silber/Gold belohnen, alle Abteilungen kennenzulernen statt nur die Lieblingsstation.
6. **Sicherheitsmomente:** In der Logistik kreuzt ab und zu ein Gabelstapler. Wer an der gelben Linie wartet, bekommt den Bonus „Sicher gearbeitet“.
7. **Wissens-Quiz im Pausenraum** (freiwillig): 3 kurze Fragen aus den Lernkarten für Extra-Bleistifte.

### 6.4 Mehr Spaß 🔶
- Combo-Serie: 3 richtige Aktionen hintereinander → Bonus und Konfetti.
- Kurze Pfälzer Sprüche als Sprechblasen („Ei gude!“, „Alla hopp!“).
- 10 versteckte goldene Inbusschlüssel in der Halle zum Sammeln.
- Winken: Die Spielfigur kann winken, Kolleg:innen winken zurück.
- Jede Schicht eine Sonderlage, z. B. „Regentag: volles Restaurant“.

### 6.5 Figuren-Pass 🔶
Maße nach STIL.md: Kopf = 1 Einheit, Figur etwa 2,75 Köpfe hoch.

| Figur | Bauform | Farben |
|---|---|---|
| Hauptfigur „Du“ (Mitarbeiter:in) | Kapsel-Körper mit Beinen, kurze Ärmel, Kurzhaar-Kappe mit Stirnsträhnen, Namensschild, Umriss | Shirt #FBD914, Hose #0058AB, Haut #F2C29B, Haare #6B4A2F, Schuhe #3B2A20, Schild #0058AB, Umriss #3B2A20 |
| Kolleg:in / Mentor | wie Hauptfigur, Frisur Zopf oder Dutt, ohne Umriss | Shirt #FBD914, Hose #0058AB, Haare #C9772E oder #2E2522 |
| Kunde (normal) | Kapsel-Körper, Beine, Jacke in Zufallsfarbe, ohne Umriss | Jacke #7FB3D5 / #9BC48B / #E8A87C / #B9A6D9, Hose #4A5568 |
| Kunde mit Anliegen | wie normal + pulsierendes gelbes „!“ über dem Kopf | „!“ #FBD914 |
| Ungeduldiger Kunde (Parkplatz) | wie normal + graues Grummel-Wölkchen | Kleidung #D9483B, Wolke #6B6B6B |
| Glücklicher Stammkunde | wie normal + blaue Tragetasche + Herzchen | Tasche #0058AB, Herz #F06A8C |

### 6.6 Stil-Pass / Palette 🔶
- Marke: Kobaltblau #0058AB, Signalgelb #FBD914, Weiß #FFFFFF, Birkenholz #E5C99B.
- Halle: Boden #D5D8DC, Wände #F5F3EE mit blauem Band, Regal-Stützen #0058AB, Regal-Träger #E8833A, Kartons #C9A06A, Pflanzen #4C8C4A.
- Außen: Wiese #8DBF6A / #6FA25A, Pfälzerwald #2F6B3A / #3F7F45, Stämme #6B4A2F, Asphalt #6E7378, Hecken #3E7D3A.
- Himmel #8EC9F0 → Horizont und Nebel #F3E7CF. Licht: Himmel #CFE8FF, Boden #E5C99B, Sonne #FFF1D6.
- Oberfläche: weiße Tafeln, Knöpfe Gelb mit blauer Schrift, abgerundete Schrift (ui-rounded).

### 6.7 Darstellungsgrenzen
- Niemand wird verletzt: Blaster-Treffer machen Kund:innen glücklich; keine Gewalt, kein Umfallen.
- „EKIA“ bleibt eine erfundene Marke: keine echten Logos, Slogans oder geschützten Produktnamen. 🔶 Vorschlag: „Plantbullar“ → „Gemüsebällchen“, falls das Spiel weitergegeben wird.
- Höchstens 12 Kund:innen gleichzeitig in der Halle, 20 auf dem Parkplatz (iPad-Leistung).
- Minispiele erscheinen als Tafeln über der 3D-Halle, nicht als eigene 3D-Szenen.
- Sprechblasen höchstens 12 Wörter, Lernkarten höchstens 2 Sätze.
- Pfälzer Humor ist freundlich und macht sich nie über Kund:innen lustig.

### 6.8 Hallen-Grundriss 🔶
Diorama-Halle 44 × 32 Einheiten, die Kamera schaut von Süden schräg hinein. Die Südseite ist offen (Schnitt-Ansicht wie bei einem Puppenhaus), dort liegen Kassen und der Ausgang zum Parkplatz.
- Westen: Logistik mit Palettenregalen (Gänge laufen zur Kamera hin, damit nichts verdeckt wird).
- Mitte hinten: Wohnkojen (Verkauf). Osten: Restaurant. Nordosten: Fundgrube.
- Süden: Kassen, Kundenservice, Ausgang. Büro und Pausenraum hinter einer Tür in der Westwand.
- Der gelbe Pfeilweg führt als Rundweg durch alle Bereiche.

---

## 7. TEIL 2: AUSBAU (Anforderungen vom November 2026, ersetzt 6.8)
Ein Lern- und Trainingsspiel für Mitarbeiter:innen. Das Haus heißt **EKIA Kaiserslautern**.

### 7.1 Spielwelt (Mini-Open-World)
- Zwei Etagen. **Erdgeschoss:** Markthalle, SB-Halle, Hotdog-Stand, Kassen, Fundgrube. **Obergeschoss:** Showroom, Restaurant, Umkleide, Großraumbüro.
- Verbindung: Treppe und Aufzug direkt nebeneinander.
- Ein abgetrennter Bereich nur für Logistiker im Hintergrund.
- Auf Schildern steht deutlich „Kaiserslautern“.

### 7.2 Charakter-Editor & Umkleide
- Die Umkleide im Obergeschoss ist interaktiv.
- Freie Wahl bei Spielstart und in der Umkleide: Geschlecht (männlich/weiblich), Herkunft, Alter (jung, mittelalt).
- Haarfarben: Grau, Blond, Braun, Schwarz, Rot, Blau. Frisuren: gebunden, Zopf, kurz, Glatze, Halbglatze.
- Verkauf: T-Shirt blau mit dunkelblauen Streifen ODER gelb mit dunkelgelben Streifen, schlichte schwarze Hose.
- Logistik: gleiche T-Shirts, dunkelblaue Cargohose. Schuhe für alle: schwarz-rot mit roter Sohle.
- Die 3D-Figur wird optisch aufgewertet.

### 7.3 Gameplay & Lernen
- Kund:innen laufen frei herum, sprechen den Spieler an und stellen fachliche Fragen.
- Feste, leuchtende Zielpunkte starten Lern-Missionen, getrennt für Verkauf und Logistik.

### 7.4 Entscheidungen (freigegeben mit Phase 1)
- Etagen werden umgeschaltet statt gestapelt: nur die aktive Etage ist sichtbar, Treppe/Aufzug blenden kurz über. Physik und Kamera bleiben unverändert.
- Ein Interaktions-System (src/interaktion.js) für Treppe, Aufzug, Schranke, später Umkleide, Missionen und Kund:innen.
- Grundriss als Daten in src/karte.js. Schilder als selbst gezeichneter Text-Atlas (src/schilder.js).
- 🔶 Herkunft im Editor als 6 Hauttöne + 2 Augenformen, ohne Klischee-Merkmale.
- 🔶 Rolle ist in der Umkleide jederzeit wechselbar. Parkplatz, Multi-Blaster, Währungen und Pausenraum aus Teil 1 sind zurückgestellt.

### 7.5 Wünsche nach M2 (November 2026)
- Mehr Möbel und Deko; SB-Halle und Kassenbereich weitläufiger (Halle jetzt 64 × 44).
- Nach den Kassen rechts ein Kundenservice für Click & Collect mit offenem Tor, durch das die Logistik Ware aus dem Lager herausgibt.
- NPCs: Kund:innen und Kolleg:innen sowie Haupt- und Nebenmissionen, damit die Welt nicht leer wirkt.
- 🔶 Reihenfolge: erst Missionen, dann Figur 2.0 und Charakter-Editor.
- 🔶 Hauptmissionen = Lernmissionen der eigenen Rolle an leuchtenden Zielpunkten (feste Reihenfolge).
  Nebenmissionen = kurze Aufgaben zwischendurch: Kundenfragen, Kolleg:innen um Hilfe bitten, Fundstücke sammeln.

---

## 8. TEIL 3: AMPEL-MISSIONEN, KLEIDERORDNUNG, PARKPLATZ (mit Gemini erarbeitet, November 2026)

### 8.1 Drei Ebenen
Obergeschoss (Showroom, Restaurant, Großraumbüro), Erdgeschoss (Markthalle, Fundgrube, Kasse, Kundenservice, Logistik/SB-Halle)
und Parkplatz. Es wird nur die aktive Ebene gezeichnet. Vom Erdgeschoss führt unten eine breite Glasschiebetür (500 ms Sperre
gegen Flackern) auf den Parkplatz vor der blauen Fassade „EKIA KAISERSLAUTERN“ mit Pfälzerwald-Hügeln.
Parkplatz: herrenlose Einkaufswagen als Kette einsammeln, beim Kofferraum-Tetris helfen, EKIA-Multi-Blaster
(Barcode-Laser, Hotdog-/Köttbullar-Kanone) macht grummelige Kunden-Wellen glücklich.
🔶 Offen: Blaster sofort aktiv oder per Station am Einkaufswagen-Häuschen (Vorschlag: Station).

### 8.2 Kleiderordnung & Spinde
- Verkauf oben/unten, Kasse, Kundenservice, Fundgrube: gelbes Shirt (#FBD914). Logistik/SB-Halle und Restaurant: blaues Shirt (#0058AB),
  Restaurant mit Schürze. Großraumbüro: gemischt, neutrale Zone.
- Umziehen im Startmenü und an grauen Schnellwechsel-Spinden auf jeder Etage (EG nahe SB-Halle/Logistik, OG in der Umkleide), Taste U oder Knopf.
  Kurzer Farb-Wirbel (Sternchen-Kreis) zeigt den Wechsel.

### 8.3 Ampel-Missionssystem (10 Lernfälle, Inhalte in src/lerninhalte.js)
- 🔴 Rot (!): Notfall, gilt für alle Shirts. Rutschgefahr, schiefer Karton im Hochregal, wegrollende Einkaufswagen.
- 🟡 Gelb (Handschlag): Kollegenhilfe, braucht das passende Shirt. Schwerer Karton (zu zweit heben), Kassen-Stau koordinieren (Büro),
  Transportproblem (Umklapp-Trick, Lieferservice, Miettransporter).
- 🟢 Grün (Häkchen): Aufgabe, braucht das passende Shirt. Preisschild (Maße, Gang/Fach), Mehrpaket „1 von 2“, Paletten-Sicherheit,
  Frische-Taktung im Restaurant.
- Prüfreihenfolge: erst „Notfall?“, dann die Shirt-Farbe. Falsche Farbe: freundlicher Hinweis zum Spind.
- Multiple Choice A/B/C. Richtig: Punkte und Erklärung „warum“. Falsch: kein Game Over, sondern Denk-Tipp; danach halbe Punkte.

### 8.4 Oberfläche
HUD oben links (Shirt-Farbe, Etage, Punkte, erledigte Missionen), Haus-Funk oben mittig bei offenen Notfällen.

### 8.5 Charakter-Auswahl (12 Profile)
Herkunft (dunkelhäutig, asiatisch, europäisch) × Geschlecht (männlich, weiblich) × Alter (jung 20–30, erfahren 60+ mit
schneeweißem Haar, Männer mit weißem Vollbart). Alle gleich schnell und stark.

### 8.6 Abweichungen und Annahmen
- Gemini schlägt 2D-Canvas-Grafik vor; das Spiel bleibt 3D mit Three.js (CLAUDE.md). Shirt-Wechsel baut die 3D-Figur neu.
- Charakter-Porträt im HUD vorerst als Shirt-Symbol in Shirt-Farbe. 🔶
- Die Mission „Wagen rollen weg“ liegt bis zum Parkplatz am Ausgang im Erdgeschoss. 🔶
- Symbole sind über Wände hinweg sichtbar, damit man sie findet. Es sind alle 10 Missionen gleichzeitig aktiv. 🔶
- Die Logistik-Schranke öffnet sich mit dem blauen Shirt (früher: Rolle Logistik).
