// Etalonaje final con FFmpeg: LUT + grano + viñeta. Uso: node scripts/grade.mjs in.mp4 out.mp4 [lut=04-film|01-amber|02-fade|03-neon|05-portrait|none] [grano=8] [vineta=1]
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
const [i, o, lut = '04-film', grano = '5', vineta = '1'] = process.argv.slice(2);
if (!i || !o) { console.error('uso: node scripts/grade.mjs in.mp4 out.mp4 [lut] [grano] [vineta]'); process.exit(1); }
const f = [];
if (lut !== 'none') {
  const p = `assets/luts/slay-${lut}.cube`;
  if (!existsSync(p)) throw new Error(`no existe ${p}`);
  f.push(`lut3d=${p}`);
}
if (vineta !== '0') f.push('vignette=PI/6');
if (grano !== '0') f.push(`noise=alls=${grano}:allf=t`);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', i, '-vf', f.join(',') || 'null', '-c:v', 'libx264', '-crf', '23', '-pix_fmt', 'yuv420p', '-map', '0:v', '-map', '0:a?', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', o], {stdio: 'inherit'});
console.log('ok', o);
