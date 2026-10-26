// Genera timeline.json (tiempos en segundos) desde un spec: node scripts/timeline.mjs specs/x.json
import {readFileSync, writeFileSync} from 'node:fs';
const spec = JSON.parse(readFileSync(process.argv[2] ?? 'specs/demo.json', 'utf8'));
const T = 0.5; // transición = 15 frames @30fps
let t = 0;
const scenes = spec.escenas.map((e, i) => {
  const start = i === 0 ? 0 : t;
  t = start + e.segundos - T;
  return {start, dur: e.segundos, transicion: i === 0 ? null : (e.transicion ?? 'fade')};
});
const duration = +(t + T).toFixed(3);
writeFileSync('timeline.json', JSON.stringify({duration, scenes, cama: !spec.pista}, null, 2));
console.log('timeline.json', duration + 's', scenes.length + ' escenas');
