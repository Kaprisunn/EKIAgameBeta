// Minispiele für die Missions-Tafel. Jedes Spiel baut sich in `box` auf und meldet über pruefe(true | false),
// ob es geklappt hat. Die Tafel (ui.tafel) zeigt danach Lob mit Erklärung oder einen Denk-Tipp.
// box.taste: Funktion für Leertaste / U während des Spiels.
const knopf = (text, klasse) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = klasse;
  b.textContent = text;
  return b;
};
const tippen = (b, f) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); f(); });

// Auswahl: drei Antworten; falsche werden ausgegraut, die richtige grün markiert
export function auswahl(box, m, pruefe) {
  m.antworten.forEach((a, i) => {
    const b = knopf(`${'ABC'[i]}  ${a}`, 'antwort');
    tippen(b, () => {
      if (b.disabled) return;
      const ok = i === m.richtig;
      if (ok) b.classList.add('richtig'); else b.disabled = true;
      pruefe(ok);
    });
    box.append(b);
  });
}

// Timing-Balken: Der rote Laser wandert hin und her; im grünen Feld scannen
export function timing(box, m, pruefe) {
  const balken = document.createElement('div'), ziel = document.createElement('div'), laser = document.createElement('div');
  balken.className = 'balken';
  ziel.className = 'ziel';
  laser.className = 'laser';
  const start = 0.12 + Math.random() * 0.6, breite = 0.17;
  ziel.style.left = `${start * 100}%`;
  ziel.style.width = `${breite * 100}%`;
  balken.append(ziel, laser);
  let x = 0, richtung = 1, aktiv = true, letzte = performance.now();
  function schritt(jetzt) {
    if (!aktiv || !balken.isConnected) return;
    const dt = Math.min(0.05, (jetzt - letzte) / 1000);
    letzte = jetzt;
    x += richtung * dt * 0.75;
    if (x > 1) { x = 1; richtung = -1; } else if (x < 0) { x = 0; richtung = 1; }
    laser.style.left = `${x * 100}%`;
    requestAnimationFrame(schritt);
  }
  requestAnimationFrame(schritt);
  const scannen = () => {
    if (!aktiv) return;
    const ok = x >= start && x <= start + breite;
    if (ok) { aktiv = false; laser.classList.add('treffer'); }
    pruefe(ok);
  };
  const scan = knopf('📡 Scannen!', 'knopf');
  tippen(scan, scannen);
  box.taste = scannen;
  box.append(balken, scan);
}

// Sortieren: zwei Kartons antippen, um sie zu tauschen, bis oben die leichten und unten die schweren stehen
export function sortieren(box, m, pruefe) {
  const reihe = m.kisten.map(([name, kg]) => ({ name, kg }));
  let gewaehlt = -1, fertig = false;
  const stapel = document.createElement('div'), oben = document.createElement('div'), unten = document.createElement('div');
  stapel.className = 'stapel';
  oben.className = unten.className = 'regalhinweis';
  oben.textContent = '⬆ oberes Fach';
  unten.textContent = '⬇ unteres Fach (Boden)';
  const geordnet = () => reihe.every((k, i) => i === 0 || reihe[i - 1].kg <= k.kg);
  function zeichne() {
    stapel.replaceChildren(...reihe.map((k, i) => {
      const b = knopf(`📦 ${k.name} · ${k.kg} kg`, 'kiste' + (i === gewaehlt ? ' gewaehlt' : ''));
      b.style.width = `${45 + k.kg * 2}%`;
      b.disabled = fertig;
      tippen(b, () => waehle(i));
      return b;
    }));
  }
  function waehle(i) {
    if (fertig) return;
    if (gewaehlt < 0 || gewaehlt === i) gewaehlt = gewaehlt === i ? -1 : i;
    else {
      [reihe[i], reihe[gewaehlt]] = [reihe[gewaehlt], reihe[i]];
      gewaehlt = -1;
      if (geordnet()) { fertig = true; zeichne(); pruefe(true); return; }
    }
    zeichne();
  }
  const pruef = knopf('Prüfen', 'knopf knopf-hell');
  tippen(pruef, () => { if (!fertig) pruefe(geordnet()); });
  zeichne();
  box.append(oben, stapel, unten, pruef);
}

// Warnweste: Weste anlegen oder zurück
export function weste(box, m, pruefe) {
  const an = knopf('🦺 Weste anlegen', 'knopf'), zurueck = knopf('Lieber nicht', 'knopf knopf-hell');
  tippen(an, () => pruefe(true));
  tippen(zurueck, () => m.abbrechen?.());
  box.taste = () => pruefe(true);
  box.append(an, zurueck);
}
