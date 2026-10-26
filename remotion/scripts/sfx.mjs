// Efecto de sonido libre SIN llave: Openverse -> Wikimedia Audio (CC0/PD/CC BY; Freesound bloquea la descarga directa con 403).
// Uso: node scripts/sfx.mjs "whoosh" salida.mp3 [maxSeg=6]  -> public/sfx/salida.mp3 (+ CREDITS.md)
import {appendFileSync, mkdirSync, writeFileSync} from 'node:fs';
const [query, out, max = '6'] = process.argv.slice(2);
if (!query || !out) throw new Error('uso: node scripts/sfx.mjs "consulta" salida.mp3 [maxSeg]');
const UA = {'User-Agent': 'Videos-Remotion/1.0 (uso personal)'};
const u = new URL('https://api.openverse.org/v1/audio/');
Object.entries({q: query, license: 'cc0,pdm,by', source: 'wikimedia_audio', page_size: '20'}).forEach(([k, v]) => u.searchParams.set(k, v));
const p = ((await (await fetch(u, {headers: UA})).json()).results ?? []).find((x) => x.duration >= 200 && x.duration <= +max * 1000 && /^https/.test(x.url ?? ''));
if (!p) throw new Error('sin resultados; prueba otra consulta (en inglés rinde más)');
mkdirSync('public/sfx', {recursive: true});
writeFileSync(`public/sfx/${out}`, Buffer.from(await (await fetch(p.url, {headers: UA})).arrayBuffer()));
appendFileSync('public/sfx/CREDITS.md', `- ${out}: ${p.license.toUpperCase()} — ${p.creator ?? 's/a'} (${p.source}) — ${p.foreign_landing_url}\n`);
console.log(`${out}: ${p.license.toUpperCase()} — ${p.creator ?? 's/a'} (${p.source}) — ${p.duration} ms`);
