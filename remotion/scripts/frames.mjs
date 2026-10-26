// Uso: node scripts/frames.mjs <spec.json> <horizontal|vertical> <frame,frame,...>  -> out/frames/*.png
import {spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const [specPath = 'specs/demo.json', f = 'horizontal', list = '10,60,130'] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
mkdirSync('out/frames', {recursive: true});
const id = f === 'horizontal' ? 'Horizontal' : 'Vertical';
const propsFile = `out/.props-${f}.json`;
writeFileSync(propsFile, JSON.stringify({spec: {...spec, formato: f}}));
for (const n of list.split(',')) {
  spawnSync('npx', ['remotion', 'still', 'src/index.ts', id, `out/frames/${f}-${n}.png`, `--frame=${n}`, `--props=${propsFile}`], {stdio: 'inherit', shell: true});
}
