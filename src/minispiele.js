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

// Timing-Balken: Der rote Laser wandert hin und her; im grünen Feld auslösen. m.treffer = nötige Treffer (Standard 1),
// nach jedem Treffer springt das Feld und der Laser wird etwas schneller. m.knopf = Beschriftung des Knopfs.
export function timing(box, m, pruefe) {
  const balken = document.createElement('div'), ziel = document.createElement('div'), laser = document.createElement('div'), stand = document.createElement('div');
  balken.className = 'balken';
  ziel.className = 'ziel';
  laser.className = 'laser';
  stand.className = 'regalhinweis';
  balken.append(ziel, laser);
  const noetig = m.treffer ?? 1, breite = 0.17;
  let x = 0, richtung = 1, aktiv = true, letzte = performance.now(), treffer = 0, start = 0, tempo = 0.75;
  const neuesFeld = () => {
    start = 0.08 + Math.random() * 0.72;
    ziel.style.left = `${start * 100}%`;
    ziel.style.width = `${breite * 100}%`;
    stand.textContent = noetig > 1 ? `Treffer ${treffer} von ${noetig}` : '';
  };
  neuesFeld();
  function schritt(jetzt) {
    if (!aktiv || !balken.isConnected) return;
    const dt = Math.min(0.05, (jetzt - letzte) / 1000);
    letzte = jetzt;
    x += richtung * dt * tempo;
    if (x > 1) { x = 1; richtung = -1; } else if (x < 0) { x = 0; richtung = 1; }
    laser.style.left = `${x * 100}%`;
    requestAnimationFrame(schritt);
  }
  requestAnimationFrame(schritt);
  const ausloesen = () => {
    if (!aktiv) return;
    if (x < start || x > start + breite) { pruefe(false); return; }
    if (++treffer < noetig) { tempo += 0.15; neuesFeld(); return; }
    aktiv = false;
    laser.classList.add('treffer');
    stand.textContent = noetig > 1 ? `Treffer ${treffer} von ${noetig}` : '';
    pruefe(true);
  };
  const scan = knopf(m.knopf ?? '📡 Scannen!', 'knopf');
  tippen(scan, ausloesen);
  box.taste = ausloesen;
  box.append(balken, stand, scan);
}

// Restaurant-Takt: Ein Tablett gleitet durch die Ausgabe. Die bestellten drei Speisen antippen, bevor es durch ist.
// Drei Tabletts nacheinander, jedes etwas schneller. Falsche Speise oder durchgerutscht = Denk-Tipp, neues Tablett.
export function tablett(box, m, pruefe) {
  const bestellung = document.createElement('div'), bahn = document.createElement('div'), teller = document.createElement('div'), auswahl = document.createElement('div');
  bestellung.className = 'bestellung';
  bahn.className = 'balken';
  teller.className = 'tablett';
  auswahl.className = 'speisen';
  bahn.append(teller);
  let runde = 0, gelegt = [], soll = [], weg = 0, aktiv = true, letzte = performance.now();
  const neu = () => {
    soll = [...m.speisen].sort(() => Math.random() - 0.5).slice(0, 3);
    gelegt = [];
    weg = 0;
    zeige();
  };
  const zeige = () => {
    bestellung.textContent = `Tablett ${runde + 1} von 3 · Bestellung: ${soll.map(([e, n]) => `${e} ${n}`).join(', ')}`;
    teller.textContent = gelegt.map(([e]) => e).join(' ') || '·';
  };
  m.speisen.forEach((sp) => {
    const b = knopf(`${sp[0]} ${sp[1]}`, 'antwort');
    tippen(b, () => {
      if (!aktiv || gelegt.includes(sp)) return;
      if (!soll.includes(sp)) { pruefe(false); return; }
      gelegt.push(sp);
      zeige();
      if (gelegt.length < 3) return;
      if (++runde === 3) { aktiv = false; pruefe(true); } else neu();
    });
    auswahl.append(b);
  });
  function schritt(jetzt) {
    if (!aktiv || !bahn.isConnected) return;
    weg += Math.min(0.05, (jetzt - letzte) / 1000) / (10 - runde * 1.5);
    letzte = jetzt;
    teller.style.left = `${Math.min(weg, 1) * 82}%`;
    if (weg >= 1) { pruefe(false); neu(); }
    requestAnimationFrame(schritt);
  }
  requestAnimationFrame(schritt);
  neu();
  box.append(bestellung, bahn, auswahl);
}

// Sortieren: zwei Kartons antippen, um sie zu tauschen, bis oben die leichten und unten die schweren stehen
export function sortieren(box, m, pruefe) {
  const reihe = m.kisten.map(([name, kg]) => ({ name, kg }));
  let gewaehlt = -1, fertig = false;
  const stapel = document.createElement('div'), oben = document.createElement('div'), unten = document.createElement('div');
  stapel.className = 'stapel';
  oben.className = unten.className = 'regalhinweis';
  oben.textContent = m.oben ?? '⬆ oberes Fach';
  unten.textContent = m.unten ?? '⬇ unteres Fach (Boden)';
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
