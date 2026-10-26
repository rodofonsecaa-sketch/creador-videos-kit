// Un solo comando: spec -> fotos de stock (campo "buscar") -> voz+subtítulos+sonido+render -> etalonaje (LUT+grano) -> hoja de contacto.
// Uso: node scripts/auto.mjs specs/x.json [horizontal|vertical|ambos=ambos] [--lut=04-film|none] [--sin-grade]
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename} from 'node:path';

const args = process.argv.slice(2);
const specPath = args[0];
if (!specPath) { console.error('uso: node scripts/auto.mjs specs/x.json [formato] [--lut=..] [--sin-grade]'); process.exit(1); }
const fmt = args.find((a, i) => i > 0 && !a.startsWith('--')) ?? 'ambos';
const lut = args.find((a) => a.startsWith('--lut='))?.split('=')[1] ?? '04-film';
const name = basename(specPath, '.json');
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const run = (c, a) => execFileSync(c, a, {stdio: 'inherit', shell: process.platform === 'win32' && c === 'npx'});

for (const [i, e] of spec.escenas.entries()) {
  if (!e.buscar || e.imagen) continue;
  const f = `auto-${name}-${i}.jpg`;
  if (!existsSync(`public/img/${f}`)) { try { run('node', ['scripts/stock.mjs', e.buscar, f]); } catch { console.warn(`sin foto para escena ${i + 1}: "${e.buscar}"`); continue; } }
  e.imagen = f;
}
mkdirSync('specs/.auto', {recursive: true});
const auto = `specs/.auto/${name}.json`;
writeFileSync(auto, JSON.stringify(spec, null, 1));
run('node', ['scripts/build.mjs', auto, fmt]);

const formats = fmt === 'ambos' ? ['horizontal', 'vertical'] : [fmt];
for (const f of formats) {
  const src = `out/${name}-${f}.mp4`;
  if (!args.includes('--sin-grade') && lut !== 'none') run('node', ['scripts/grade.mjs', src, `out/${name}-${f}-grade.mp4`, lut]);
  const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], {encoding: 'utf8'}));
  const w = f === 'horizontal' ? 480 : 270;
  run('ffmpeg', ['-y', '-v', 'error', '-i', src, '-vf', `fps=8/${dur.toFixed(2)},scale=${w}:-1,tile=4x2`, '-frames:v', '1', `out/${name}-${f}-contacto.png`]);
  console.log(`listo: ${src} | contacto: out/${name}-${f}-contacto.png`);
}
