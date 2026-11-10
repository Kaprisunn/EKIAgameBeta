// Schnelltest: startet das Spiel in Chromium (ohne Grafikkarte), läuft 3 s, drückt 1 s Bewegungstasten,
// sammelt Fehler, speichert tools/shot.png und gibt EINE Zeile aus: OK oder FEHLER, dazu Draw Calls und Dreiecke.
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.186.1/';
const TYPEN = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

const server = http.createServer((req, res) => {
  const pfad = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const datei = path.join(wurzel, pfad === '/' ? 'index.html' : pfad);
  if (!datei.startsWith(wurzel) || !fs.existsSync(datei) || fs.statSync(datei).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPEN[path.extname(datei)] || 'application/octet-stream' });
  fs.createReadStream(datei).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));

const fehler = [];
let browser, info = null;
try {
  browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const seite = await browser.newPage({ viewport: { width: 1024, height: 680 }, deviceScaleFactor: 1 });
  seite.on('pageerror', (e) => fehler.push(e.message));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
  await seite.route(CDN + '**', async (route) => {
    const rel = new URL(route.request().url()).pathname.replace('/npm/three@0.186.1/', '');
    const datei = path.join(wurzel, 'node_modules/three', rel);
    if (fs.existsSync(datei)) await route.fulfill({ path: datei, contentType: 'text/javascript' });
    else await route.fulfill({ status: 404, body: 'fehlt: ' + rel });
  });
  await seite.goto(`http://127.0.0.1:${server.address().port}/`);
  await seite.waitForFunction(() => window.__bereit || !document.getElementById('fehler').hidden, null, { timeout: 20000 });
  await seite.keyboard.press('Enter');
  await warte(1000);
  await seite.keyboard.down('KeyW'); await seite.keyboard.down('KeyD');
  await warte(1000);
  await seite.keyboard.up('KeyW'); await seite.keyboard.up('KeyD');
  await warte(1000);
  const anzeige = await seite.evaluate(() => { const f = document.getElementById('fehler'); return f.hidden ? '' : f.innerText; });
  if (anzeige) fehler.push('Fehleranzeige: ' + anzeige.replace(/\s+/g, ' ').slice(0, 300));
  info = await seite.evaluate(() => window.__info || null);
  if (!info) fehler.push('window.__info fehlt');
  await seite.screenshot({ path: path.join(wurzel, 'tools/shot.png') });
} catch (e) {
  fehler.push(e.message.split('\n')[0]);
} finally {
  await browser?.close();
  server.close();
}

const werte = info ? ` | Draw Calls ${info.drawCalls}, Dreiecke ${info.dreiecke}` : '';
const budget = info && (info.drawCalls > 150 || info.dreiecke > 100000) ? ' | ÜBER BUDGET (150 / 100.000)' : '';
console.log(fehler.length ? `FEHLER: ${[...new Set(fehler)].join(' · ')}${werte}${budget}` : `OK${werte}${budget}`);
process.exitCode = fehler.length || budget ? 1 : 0;
