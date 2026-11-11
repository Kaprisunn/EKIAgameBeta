// Diorama-Kamera: schräg von oben, enge Brennweite (FOV 35), folgt dem Spieler weich
// und schaut ein Stück in Laufrichtung voraus. Im Hochformat etwas weiter weg.
import * as THREE from 'three';

export function erstelleKamera() {
  const kamera = new THREE.PerspectiveCamera(35, 1, 0.5, 400);
  const versatz = new THREE.Vector3(0, 10.5, 12.5);
  const blick = new THREE.Vector3(), ziel = new THREE.Vector3(), voraus = new THREE.Vector3();
  let zoom = 1, seite = 0, seiteZiel = 0;

  return {
    kamera,
    groesse(b, h) {
      kamera.aspect = b / h;
      zoom = b < h ? 1.3 : 1;
      kamera.updateProjectionMatrix();
    },
    // pos: Spielerposition, tempo: Geschwindigkeitsvektor; sofort = ohne Glätten springen
    // Seitlicher Versatz, z. B. damit die Figur neben dem Menü sichtbar bleibt
    seitlich(x) { seiteZiel = x; },
    folge(pos, tempo, dt, sofort = false) {
      seite = sofort ? seiteZiel : seite + (seiteZiel - seite) * (1 - Math.exp(-4 * dt));
      voraus.set(tempo.x * 0.3 + seite, 0, tempo.z * 0.25);
      ziel.copy(pos).add(voraus);
      ziel.y = 1.2;
      blick.lerp(ziel, sofort ? 1 : 1 - Math.exp(-4 * dt));
      kamera.position.copy(blick).addScaledVector(versatz, zoom);
      kamera.lookAt(blick);
    },
  };
}
