// Entrada única: brief -> datos -> spec con marca -> auto.mjs (stock+voz+render+etalonaje) -> QA -> paquete de entrega.
// Uso: node scripts/crear.mjs briefs/x.json
// Brief: {"nombre":"otif-2025","tipo":"kpi-otif","anio":2025,"marca":"cintac","formato":"horizontal"}  |  tipo "libre" con "escenas":[...]
import {execFileSync, spawnSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
const briefPath = process.argv[2];
if (!briefPath) { console.error('uso: node scripts/crear.mjs briefs/x.json'); process.exit(1); }
const brief = JSON.parse(readFileSync(briefPath, 'utf8'));
const name = brief.nombre;
const brand = JSON.parse(readFileSync(`brand/${brief.marca ?? 'cintac'}.json`, 'utf8'));
const fmt = brief.formato ?? brand.formato ?? 'horizontal';
const run = (c, a) => execFileSync(c, a, {stdio: 'inherit'});
const specPath = `specs/${name}.json`;
let cuadre;

if (brief.tipo === 'kpi-otif') {
  run('python', ['-I', 'scripts/kpi_otif.py', String(brief.anio ?? 0), specPath]);
  cuadre = specPath.replace('.json', '.cuadre.json');
} else if (brief.tipo === 'libre' && brief.escenas) {
  writeFileSync(specPath, JSON.stringify({escenas: brief.escenas}));
} else throw new Error(`tipo no soportado: ${brief.tipo} (kpi-otif | libre)`);

const spec = JSON.parse(readFileSync(specPath, 'utf8'));
Object.assign(spec, {colores: brand.colores, marca: brand.marca, pista: brand.pista, voz: brand.voz === 'piper' ? 'piper' : undefined, formato: fmt});
writeFileSync(specPath, JSON.stringify(spec, null, 1));

run('node', ['scripts/auto.mjs', specPath, fmt, `--lut=${brand.lut ?? '04-film'}`]);

const video = `out/${name}-${fmt}-grade.mp4`;
const qa = spawnSync('node', ['scripts/qa.mjs', video, `specs/.auto/${name}.json`, ...(cuadre ? [cuadre] : [])], {stdio: 'inherit'});

const dir = `entregas/${name}`;
mkdirSync(dir, {recursive: true});
copyFileSync(video, `${dir}/${name}.mp4`);
copyFileSync(video.replace('.mp4', '.qa.json'), `${dir}/qa.json`);
copyFileSync(`specs/.auto/${name}.json`, `${dir}/spec.json`);
if (cuadre) copyFileSync(cuadre, `${dir}/cuadre.json`);
const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video], {encoding: 'utf8'}));
run('ffmpeg', ['-y', '-v', 'error', '-ss', (dur * 0.3).toFixed(1), '-i', video, '-frames:v', '1', `${dir}/miniatura.png`]);
const cred = ['img', 'video'].flatMap((d) => (existsSync(`public/${d}/CREDITS.md`) ? readFileSync(`public/${d}/CREDITS.md`, 'utf8').split('\n') : []))
  .filter((l) => spec.escenas.some((e) => (e.imagen && l.includes(`auto-${name}-`)) || (e.video && l.includes(e.video))));
writeFileSync(`${dir}/creditos.md`, `# Créditos — ${name}\n\n${cred.join('\n')}\n\n- Música/efectos: generados con el motor propio del proyecto (sin licencia externa) salvo indicación.\n- Etalonaje: slaycamera/luts, CC BY 4.0.\n`);
console.log(`\nENTREGA: ${dir}/ (${qa.status === 0 ? 'QA PASS' : 'QA FAIL, revisar qa.json'})`);
process.exit(qa.status === 0 ? 0 : 3);
