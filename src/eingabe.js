// Eingabe: virtueller Joystick (linke Bildschirmhälfte, erscheint unter dem Finger) und Tastatur.
// richtung() liefert {x, z} mit Länge 0 bis 1 (Bildschirm oben = Welt -z).
const RADIUS = 62, TOTZONE = 0.12;

export function erstelleEingabe({ aktion, pause, start }) {
  const zone = document.getElementById('joyzone');
  const basis = zone.querySelector('.joy-basis'), knopf = zone.querySelector('.joy-knopf');
  const tasten = new Set();
  const joy = { id: null, x0: 0, y0: 0, x: 0, z: 0 };

  function ruhestellung() {
    basis.style.left = `calc(${RADIUS + 40}px + env(safe-area-inset-left, 0px))`;
    basis.style.top = `calc(100% - ${RADIUS + 40}px - env(safe-area-inset-bottom, 0px))`;
    knopf.style.transform = '';
    basis.classList.remove('aktiv');
  }
  ruhestellung();

  zone.addEventListener('pointerdown', (e) => {
    if (joy.id !== null) return;
    e.preventDefault();
    joy.id = e.pointerId; joy.x0 = e.clientX; joy.y0 = e.clientY; joy.x = joy.z = 0;
    zone.setPointerCapture?.(e.pointerId);
    basis.style.left = `${e.clientX}px`;
    basis.style.top = `${e.clientY}px`;
    basis.classList.add('aktiv');
  });
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== joy.id) return;
    let dx = e.clientX - joy.x0, dy = e.clientY - joy.y0;
    const l = Math.hypot(dx, dy);
    if (l > RADIUS) { dx *= RADIUS / l; dy *= RADIUS / l; }
    knopf.style.transform = `translate(${dx}px, ${dy}px)`;
    const s = Math.min(l, RADIUS) / RADIUS;
    const k = s < TOTZONE ? 0 : (s - TOTZONE) / (1 - TOTZONE) / (s || 1);
    joy.x = (dx / RADIUS) * k; joy.z = (dy / RADIUS) * k;
  });
  const loslassen = (e) => {
    if (e.pointerId !== joy.id) return;
    joy.id = null; joy.x = joy.z = 0;
    ruhestellung();
  };
  zone.addEventListener('pointerup', loslassen);
  zone.addEventListener('pointercancel', loslassen);

  const BEWEGUNG = { KeyW: 1, KeyA: 1, KeyS: 1, KeyD: 1, ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1 };
  window.addEventListener('keydown', (e) => {
    if (BEWEGUNG[e.code]) { tasten.add(e.code); e.preventDefault(); return; }
    if (e.repeat) return;
    if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'KeyU') { e.preventDefault(); aktion(); }
    else if (e.code === 'Escape' || e.code === 'KeyP') pause();
    else if (e.code === 'Enter') start();
  });
  window.addEventListener('keyup', (e) => tasten.delete(e.code));
  window.addEventListener('blur', () => tasten.clear());

  const aus = { x: 0, z: 0 };
  return {
    richtung() {
      if (joy.id !== null) { aus.x = joy.x; aus.z = joy.z; return aus; }
      const t = (a, b) => (tasten.has(a) || tasten.has(b) ? 1 : 0);
      aus.x = t('KeyD', 'ArrowRight') - t('KeyA', 'ArrowLeft');
      aus.z = t('KeyS', 'ArrowDown') - t('KeyW', 'ArrowUp');
      const l = Math.hypot(aus.x, aus.z);
      if (l > 1) { aus.x /= l; aus.z /= l; }
      return aus;
    },
    zuruecksetzen() { tasten.clear(); joy.id = null; joy.x = joy.z = 0; ruhestellung(); },
  };
}
