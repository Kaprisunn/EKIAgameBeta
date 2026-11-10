// Interaktionspunkte der aktiven Etage (Treppe, Aufzug, Schranke; später Umkleide, Missionen, Kund:innen).
// Automatische Punkte lösen beim Betreten einmal aus, alle anderen über den Aktionsknopf.
const AUTO = { treppe: true, schranke: true };

export function erstelleInteraktion(handler) {
  const drin = new Set();
  let nah = null;
  return {
    get nah() { return nah; },
    // Liefert den nächsten Knopf-Punkt in Reichweite (oder null)
    update(punkte, pos) {
      nah = null;
      let best = Infinity;
      for (const p of punkte) {
        const d = Math.hypot(pos.x - p.x, pos.z - p.z), innen = d < p.r;
        if (AUTO[p.art]) {
          if (innen && !drin.has(p)) { drin.add(p); handler[p.art]?.(p); }
          else if (!innen) drin.delete(p);
        } else if (innen && d < best) { best = d; nah = p; }
      }
      return nah;
    },
    ausloesen() { if (nah) handler[nah.art]?.(nah); },
  };
}
