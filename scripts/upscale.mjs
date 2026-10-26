// Sube la resolución de una imagen x4 con Real-ESRGAN (gratis, GPU Vulkan). Uso: node scripts/upscale.mjs entrada.png salida.png [modelo=realesrgan-x4plus]
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const [i, o, m = 'realesrgan-x4plus'] = process.argv.slice(2);
if (!i || !o) { console.error('uso: node scripts/upscale.mjs in.png out.png [modelo]'); process.exit(1); }
const dir = 'C:/Dev/tools/realesrgan/realesrgan-ncnn-vulkan-v0.2.0-windows';
const r = spawnSync(`${dir}/realesrgan-ncnn-vulkan.exe`, ['-i', resolve(i), '-o', resolve(o), '-n', m], {cwd: dir, stdio: 'inherit'});
process.exit(r.status ?? 1);
