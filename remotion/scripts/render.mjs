// Uso: node scripts/render.mjs <spec.json> <horizontal|vertical|ambos> [nombre-salida]
import {spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {basename} from 'node:path';

const [specPath = 'specs/demo.json', fmt = 'ambos', base] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const name = base ?? basename(specPath, '.json');
mkdirSync('out', {recursive: true});
for (const f of fmt === 'ambos' ? ['horizontal', 'vertical'] : [fmt]) {
  const id = f === 'horizontal' ? 'Horizontal' : 'Vertical';
  const propsFile = `out/.props-${f}.json`;
  writeFileSync(propsFile, JSON.stringify({spec: {...spec, formato: f}}));
  const r = spawnSync('npx', ['remotion', 'render', 'src/index.ts', id, `out/${name}-${f}.mp4`, `--props=${propsFile}`, '--codec=h264', '--crf=18'], {stdio: 'inherit', shell: true});
  if (r.status !== 0) process.exit(r.status ?? 1);
}
