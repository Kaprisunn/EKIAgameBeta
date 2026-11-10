# Spielprojekt – Arbeitsregeln

## Ziel
Ein 3D-Browser-Spiel im Spielzeug-Diorama-Look, das auf dem iPad in Safari flüssig läuft, gut aussieht und mit möglichst wenig Tokens entsteht. Ich arbeite nur vom iPad, habe keine Konsole und teste über den Spiel-Link. Schreibe ich „Weiter“, baust du den nächsten offenen Meilenstein aus spiel/PLAN.md.

## Sparsam arbeiten (mein Nutzungslimit ist knapp)
- Lies zu Beginn nur spiel/STAND.md und spiel/PLAN.md. Aus spiel/SPIEL.md liest du nur den Abschnitt, den der Meilenstein braucht. spiel/STIL.md liest du nur bei Grafik- oder Animationsarbeit.
- Öffne nur Dateien, die du ändern musst, und finde Stellen mit grep. node_modules/, package-lock.json und tools/shot.png liest du nie.
- Ändere Dateien gezielt mit Edit, statt sie neu zu schreiben. Halte jede Datei unter etwa 200 Zeilen mit einer klaren Aufgabe.
- Eine Sitzung = ein Meilenstein. Keine Subagenten, keine Workflows und keine Websuche, außer ich bitte darum oder eine Bibliothek macht nachweislich Probleme.
- Antworte kurz, höchstens 10 Zeilen, ohne Code im Chat.
- Höchstens 2 Reparaturrunden pro Fehler. Klappt es dann nicht, halte den Stand in STAND.md fest und frag mich.
- Fehlt node_modules, führe zuerst npm install --silent aus.

## Technik (fest)
- Kein Build-Schritt: index.html lädt src/main.js als ES-Modul. Three.js kommt per Import-Map von https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js, Addons über "three/addons/" aus https://cdn.jsdelivr.net/npm/three@0.186.1/examples/jsm/. Ändere die Version nicht: Der Spiel-Link darf nur Skript-Versionen laden, die mindestens zwei Wochen alt sind.
- src/ enthält kleine Module, z. B. main, zustand, eingabe, kamera, welt, figuren, animation, ui, audio, missionen.
- Keine Bild- oder Modelldateien: Figuren, Welt und Effekte entstehen aus Code nach spiel/STIL.md. Ausnahme: Bilder, die ich selbst ins Repository hochlade.
- Spielschleife mit renderer.setAnimationLoop und einem Zeitschritt von höchstens 0,05 s. Zustände Menü, Spiel, Pause, Ende. Bei verborgenem Tab pausieren.
- Steuerung zuerst für Touch (virtueller Joystick links, große Knöpfe rechts), zusätzlich Tastatur. touch-action: none, Safe-Area-Ränder beachten. Im Hochformat erscheint ein Hinweis oder ein angepasstes Layout.
- iPad-Safari: Größe aus window.innerWidth/innerHeight bzw. 100dvh statt 100vh (Adressleiste), Textauswahl und Lupe aus (-webkit-user-select: none, -webkit-touch-callout: none), Doppeltipp-Zoom per Viewport-Meta verhindern.
- Ton nur synthetisch mit WebAudio. Starte den AudioContext erst beim ersten Tippen, weil das iPad Ton vorher blockiert.
- Speichern mit localStorage in try/catch. Das Spiel läuft auch ohne Speicher.
- Laufzeitfehler werden abgefangen und als Meldung im Spiel angezeigt statt als leerer Bildschirm.
- Das Spiel stellt window.__info bereit: Draw Calls und Dreiecke aus renderer.info.render.
- Halte die Darstellungsgrenzen aus spiel/SPIEL.md ein (z. B. Gott nur als Licht oder Stimme). Ist ein Wunsch zu aufwendig, schlag zuerst eine Vereinfachung vor, die fast genauso gut wirkt.

## Prüfen
- npm run check startet tools/check.mjs. Das Skript lädt Playwright mit createRequire(import.meta.url)("playwright"), denn Playwright ist global installiert und ein ESM-Import findet es nicht. Es startet einen kleinen Node-HTTP-Server für das Projekt und Chromium mit den Argumenten --use-angle=swiftshader und --enable-unsafe-swiftshader. Anfragen an https://cdn.jsdelivr.net/npm/three@0.186.1/ leitet es mit page.route auf node_modules/three um. Dann lässt es das Spiel 3 Sekunden laufen, drückt dabei 1 Sekunde lang Bewegungstasten und sammelt Seiten- und Konsolenfehler. Zum Schluss speichert es einen Screenshot in tools/shot.png (1024 × 680, Faktor 1) und gibt eine einzige Zeile aus: OK oder FEHLER mit den Fehlern, dazu Draw Calls und Dreiecke.
- Schau dir den Screenshot nur an, wenn sich das Aussehen in dieser Sitzung geändert hat.
- Der Test läuft ohne Grafikkarte und misst keine Bildrate. Die Leistung prüfe ich auf dem iPad.

## Abschluss-Routine (jede Sitzung)
1. npm run check meldet OK und bleibt im Leistungsbudget aus STIL.md.
2. Aktualisiere spiel/STAND.md mit höchstens 40 Zeilen: was funktioniert, was fehlt, bekannte Fehler, Spiel-Link, nächster Meilenstein.
3. Commit, push, Pull Request, Merge in main (squash).
4. Spiel-Link: Veröffentliche index.html mit den Dateien aus src/ als Artifact unter derselben URL (sie steht in STAND.md; beim ersten Mal neu anlegen und dort eintragen). Gib nur Dateien mit, die sich in dieser Sitzung geändert haben.
5. Deine letzte Antwort: was neu ist, Steuerung in 2 Sätzen, der Spiel-Link und der Satz: „Bleibt der Link leer, sag es mir. Für den nächsten Meilenstein starte eine neue Sitzung und schreib: Weiter.“
- Melde ich, dass der Spiel-Link leer bleibt: Bündle den eigenen Code mit npx esbuild src/main.js --bundle --format=esm --external:three "--external:three/addons/*" zu einer Datei, binde ihn direkt in index.html ein und veröffentliche neu. Hilft das nicht, schlag GitHub Pages als Spiel-Link vor.
