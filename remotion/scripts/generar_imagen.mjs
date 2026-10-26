// Genera una imagen LOCAL y gratis con stable-diffusion.cpp (SD 1.5 Q8, 512x512, ~6,5 min en i7-1355U). Subir con scripts/upscale.mjs.
// Uso: node scripts/generar_imagen.mjs "prompt en inglés" salida.png [semilla=42]
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const [p, o, seed = '42'] = process.argv.slice(2);
if (!p || !o) { console.error('uso: node scripts/generar_imagen.mjs "prompt" out.png [semilla]'); process.exit(1); }
const dir = 'C:/Dev/tools/sdcpp';
const r = spawnSync(`${dir}/sd-cli.exe`, ['-m', `${dir}/models/sd15-q8.gguf`, '-p', p, '-n', 'blurry, text, watermark, deformed', '--steps', '20', '-W', '512', '-H', '512', '-s', seed, '-o', resolve(o)], {stdio: 'inherit'});
process.exit(r.status ?? 1);
