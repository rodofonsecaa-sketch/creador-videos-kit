// Control de calidad automático. Uso: node scripts/qa.mjs video.mp4 specs/.auto/x.json [specs/x.cuadre.json]  -> imprime PASS/FAIL y escribe <video>.qa.json
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
const [video, specPath, cuadrePath] = process.argv.slice(2);
if (!video || !specPath) throw new Error('uso: node scripts/qa.mjs video.mp4 spec.json [cuadre.json]');
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const checks = [];
const add = (nombre, ok, detalle) => checks.push({nombre, ok, detalle});
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'json', video], {encoding: 'utf8'}));
const v = probe.streams.find((s) => s.codec_type === 'video'), hasAudio = probe.streams.some((s) => s.codec_type === 'audio');
const dur = parseFloat(probe.format.duration);
add('resolución', (v.width === 1920 && v.height === 1080) || (v.width === 1080 && v.height === 1920), `${v.width}x${v.height}`);
add('duración 5–180 s', dur >= 5 && dur <= 180, `${dur.toFixed(1)} s`);
add('tiene audio', hasAudio, hasAudio ? 'sí' : 'sin pista de audio');
if (hasAudio) {
  const r = spawnSync('ffmpeg', ['-nostats', '-i', video, '-af', 'ebur128=peak=true', '-f', 'null', '-'], {encoding: 'utf8'}).stderr;
  const sum = r.slice(r.lastIndexOf('Summary:'));
  const lufs = parseFloat(sum.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]), peak = parseFloat(sum.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]);
  add('volumen -14 ±2 LUFS', Math.abs(lufs + 14) <= 2, `${lufs} LUFS`);
  add('sin saturación (pico < -0,5 dBFS)', peak < -0.5, `${peak} dBFS`);
}
const bd = spawnSync('ffmpeg', ['-i', video, '-vf', 'blackdetect=d=1:pix_th=0.05', '-an', '-f', 'null', '-'], {encoding: 'utf8'}).stderr;
add('sin pantallas negras >1 s', !/black_start/.test(bd), /black_start/.test(bd) ? 'hay tramo negro' : 'ok');
const faltan = [];
for (const e of spec.escenas) for (const f of [e.imagen && `img/${e.imagen}`, e.video && `video/${e.video}`].filter(Boolean)) {
  const base = f.split('/')[1];
  const cred = `public/${f.split('/')[0]}/CREDITS.md`;
  if (/^auto-|^stock|^prueba/.test(base) && !(existsSync(cred) && readFileSync(cred, 'utf8').includes(base))) faltan.push(base);
}
add('créditos de recursos', faltan.length === 0, faltan.length ? `sin crédito: ${faltan.join(', ')}` : 'ok');
if (cuadrePath && existsSync(cuadrePath)) {
  const c = JSON.parse(readFileSync(cuadrePath, 'utf8'));
  const fuente = [c.otif, c.cantidad, c.plazo];
  const cif = spec.escenas.filter((e) => e.cifra).map((e) => e.cifra.porcentaje ?? e.cifra.valor);
  const mal = cif.filter((x) => !fuente.includes(x));
  add('cifras = fuente', mal.length === 0, mal.length ? `no cuadran: ${mal}` : `${cif.join(', ')} ✓ (n=${c.n})`);
  for (const e of spec.escenas.filter((e) => e.grafico)) {
    const malT = e.grafico.datos.filter((d) => c.tendencia?.[d.etiqueta] !== d.valor);
    add('gráfico = fuente', malT.length === 0, malT.length ? `no cuadran: ${malT.map((d) => d.etiqueta)}` : 'ok');
  }
}
const ok = checks.every((x) => x.ok);
writeFileSync(video.replace(/\.mp4$/, '.qa.json'), JSON.stringify({video, ok, checks}, null, 1));
for (const x of checks) console.log(`${x.ok ? '✔' : '✘'} ${x.nombre}: ${x.detalle}`);
console.log(ok ? 'QA: PASS' : 'QA: FAIL');
process.exit(ok ? 0 : 3);
