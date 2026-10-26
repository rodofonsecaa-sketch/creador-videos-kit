// Pipeline completo: spec (español) -> voz Piper -> subtítulos Whisper -> banda sonora -> render MP4.
// Uso: node scripts/build.mjs specs/x.json [horizontal|vertical|ambos=ambos] [--sin-render]
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename} from 'node:path';

const args = process.argv.slice(2);
const specPath = args[0] ?? 'specs/demo-pro.json';
const fmt = args.find((a, i) => i > 0 && !a.startsWith('--')) ?? 'ambos';
const noRender = args.includes('--sin-render');
const name = basename(specPath, '.json');
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
mkdirSync('public/voz', {recursive: true});
mkdirSync('specs/.build', {recursive: true});

const run = (cmd, a) => execFileSync(cmd, a, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit']});
const VOZ_INICIO = 0.4;
const COLA = 0.6;

// whisper devuelve sub-palabras; una palabra nueva empieza cuando el token trae espacio inicial
const mergeWords = (caps) => {
  const words = [];
  for (const c of caps) {
    if (c.text.startsWith('[_') || !c.text.trim()) continue;
    if (!words.length || c.text.startsWith(' ')) words.push({text: c.text.trim(), startMs: c.startMs, endMs: c.endMs});
    else {
      const w = words[words.length - 1];
      w.text += c.text;
      w.endMs = c.endMs;
    }
  }
  return words;
};

// texto exacto del guion con los tiempos de whisper (si el conteo difiere, reparte por longitud)
const alignWords = (text, heard) => {
  const known = text.split(/\s+/).filter(Boolean);
  if (known.length === heard.length) return known.map((t, k) => ({text: t, startMs: heard[k].startMs, endMs: heard[k].endMs}));
  const t0 = heard[0].startMs;
  const t1 = heard[heard.length - 1].endMs;
  const total = known.reduce((a, w) => a + w.length + 1, 0);
  let acc = 0;
  return known.map((t) => {
    const startMs = t0 + ((t1 - t0) * acc) / total;
    acc += t.length + 1;
    return {text: t, startMs, endMs: t0 + ((t1 - t0) * acc) / total};
  });
};

for (const [i, e] of spec.escenas.entries()) {
  if (!e.narracion) {
    e.segundos ??= 3;
    continue;
  }
  const chile = spec.voz !== 'piper';
  const h = createHash('sha1').update(e.narracion + (chile ? '|chile' : '')).digest('hex').slice(0, 8);
  const wav = `public/voz/${name}-${i}-${h}.wav`;
  const json = `public/voz/${name}-${i}-${h}.json`;
  if (!existsSync(wav)) {
    try { run('python', [chile ? 'scripts/tts_chile.py' : 'scripts/tts.py', e.narracion, wav]); } catch { run('python', ['scripts/tts.py', e.narracion, wav]); }
  }
  const dur = parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]));
  if (!existsSync(json)) { try { run('python', ['scripts/whisper_st.py', wav, json]); } catch { run('node', ['scripts/whisper.mjs', wav, json]); } };
  e.voz = wav.replace('public/', '');
  e.vozInicio = VOZ_INICIO;
  e.palabras = alignWords(e.narracion, mergeWords(JSON.parse(readFileSync(json, 'utf8'))));
  e.segundos = Math.max(e.segundos ?? 0, +(VOZ_INICIO + dur + COLA).toFixed(2));
  console.log(`escena ${i + 1}: voz ${dur.toFixed(1)} s, ${e.palabras.length} palabras`);
}

// banda sonora (cama + efectos) con tiempos reales; la voz baja el volumen de la música
const resolved = `specs/.build/${name}.json`;
writeFileSync(resolved, JSON.stringify(spec, null, 1));
run('node', ['scripts/timeline.mjs', resolved]);
run('python', ['-m', 'sfx', 'sfx/cues/auto.py', '--out', `public/sfx-${name}.wav`]);
spec.musica = `sfx-${name}.wav`;
spec.volumenMusica = spec.pista ? 0.9 : spec.escenas.some((e) => e.voz) ? 0.3 : 0.6;
spec.volumenPista = spec.escenas.some((e) => e.voz) ? 0.16 : 0.4;
writeFileSync(resolved, JSON.stringify(spec, null, 1));
console.log('spec resuelto ->', resolved);

if (!noRender) execFileSync('node', ['scripts/render.mjs', resolved, fmt, name], {stdio: 'inherit'});
