# Stil-Rezept: Spielzeug-Diorama

Statt teurer Grafik wirkt das Spiel wie ein liebevoll bemaltes Spielzeug-Diorama: wenige klare Formen, warme Farben, weiche Schatten, lebendige Bewegung. Alles entsteht aus Code, ohne Dateien. Farben und Bauformen kommen aus dem Figuren- und Stil-Pass in SPIEL.md.

## Figuren-Baukasten (src/figuren.js)
- Eine Funktion baut jede Figur aus einem Steckbrief-Objekt: Farben als Hex-Werte, Größe, Teile.
- Proportionen: Kopf = 1 Einheit, ganze Figur 2,5 bis 3 Köpfe hoch. Der große Kopf wirkt sympathisch und bleibt auf dem iPad gut lesbar.
- Formen: Kopf als Kugel, Körper als Kegelstumpf (Gewand) oder Kapsel, Arme als Kapseln mit Kugel-Händen, Beine nur ohne langes Gewand. Haare und Bart aus Kugelkappen und Kegeln, die deutlich vor dem Gesicht sitzen, sonst verschwinden sie im Kopf. Requisiten aus Zylindern und Quadern.
- Augen machen die Figur lebendig: weiße, abgeflachte Kugel, dunkle Pupille, kleiner weißer Glanzpunkt.
- Material: MeshToonMaterial mit einem Verlauf aus 3 Stufen (DataTexture mit NearestFilter). Jede Farbe nur einmal als Material anlegen und wiederverwenden.
- Umriss: zweite Hülle 5 bis 6 % größer, Rückseite (BackSide), dunkles Braun statt Schwarz. Nur Hauptfiguren bekommen einen Umriss.
- Kopf, Arme und Beine sind eigene Gruppen, damit Animation ohne Skelett funktioniert.

## Animation ohne Animationsdateien (src/animation.js)
- Laufen: Arme und Beine pendeln mit sin(t · Tempo), der Körper wippt mit dem Betrag davon und neigt sich leicht in Laufrichtung.
- Stehen: Atmen (Körperhöhe ±2 %), der Kopf schaut langsam umher oder zum nächsten Ziel, Blinzeln alle 2 bis 5 Sekunden für 0,12 s.
- Springen und Landen: kurz übertriebenes Stauchen und Strecken.
- Übergänge immer weich mit Easing oder lerp.
- Kleine Effekte mit großer Wirkung: Staubwölkchen beim Laufen, Kamerawackeln bei Treffern, Gegenstände ploppen mit leichtem Überschwingen auf.

## Welt (src/welt.js)
- Boden: unterteilte Ebene mit sanftem Höhenrauschen, Vertex-Farben und flatShading (facettierter Look), ohne Texturen.
- Requisiten wie Steine, Bäume, Kisten und Häuser aus einfachen Formen als InstancedMesh: hunderte Objekte für einen einzigen Draw Call.
- Himmel als Farbverlauf. Nebel in derselben Farbe gibt Tiefe und verdeckt das Weltende.
- Licht: HemisphereLight mit Himmel- und Bodenfarbe aus der Palette, dazu eine Sonne mit weichem Schatten (Schattenkarte 1024, Ausschnitt folgt dem Spieler) und ACESFilmic-Tonemapping.
- Wasser: grob unterteilte Ebene, deren Punkte sanft wogen, halbtransparent.
- Partikel: ein wiederverwendeter Points-Pool mit höchstens 300 Teilchen für Staub, Sand, Funken und Glitzern.
- Kamera: Diorama-Blick schräg von oben mit enger Brennweite (FOV 30 bis 40), folgt weich. Die Hauptfigur füllt mindestens 20 % der Bildhöhe.

## Oberfläche (src/ui.js)
- HTML/CSS-Schicht über dem Spiel: scharf auf dem Retina-Display und billig. Knöpfe mindestens 64 px, Text mindestens 18 px, abgerundete Formen in Palettenfarben.
- Sprechblasen und Missionsziele kurz halten; die Story zeigen Szenen und Figuren.
- Vignette als CSS-Verlauf statt Nachbearbeitung.

## Leistungsbudget fürs iPad
- Höchstens 150 Draw Calls und 100.000 Dreiecke pro Bild.
- Pixelverhältnis höchstens 2. Sinkt die Bildrate, stufenweise auf 1,5 und 1,25 herunter.
- Kein Post-Processing, keine großen Texturen, nur ein Licht mit Schatten.
- Unbewegte Nebenfiguren und Requisiten mit BufferGeometryUtils.mergeGeometries zusammenführen.
- Beim Levelwechsel Geometrien und Materialien mit dispose() freigeben.

## Messlatte
Ein Test im November 2026 mit genau diesem Rezept brauchte 71 Zeilen Code für zwei Figuren mit Umriss, Augen, Blinzeln, Atmen und Laufbewegung, facettierten Boden, 40 Steine als InstancedMesh und weiche Schatten: 73 Draw Calls, 14.496 Dreiecke, fehlerfrei in Chromium. Gelernt: Bärte müssen weiter vor dem Gesicht sitzen, und die Kamera muss näher an die Figuren.
