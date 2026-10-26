// Música original sintetizada (libre de derechos): pad ambiental + pulso suave, 110 BPM, La menor.
// Uso: node scripts/gen-music.mjs [segundos=20]
import {writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const DUR = Number(process.argv[2] ?? 20);
const N = SR * DUR;
const L = new Float32Array(N);
const R = new Float32Array(N);
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(root, {recursive: true});
const beat = 60 / 110;
const bar = beat * 4;
const chords = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]];

const add = (t0, d, fn, pan = 0) => {
  const s0 = Math.floor(t0 * SR);
  const n = Math.floor(d * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const v = fn(i / SR, i / n);
    L[s0 + i] += v * (1 - Math.max(0, pan));
    R[s0 + i] += v * (1 + Math.min(0, pan));
  }
};

for (let b = 0; b * bar < DUR; b++) {
  const ch = chords[b % chords.length];
  ch.forEach((f, k) =>
    add(b * bar, bar + 0.6, (t, p) => {
      const env = Math.min(1, t * 2) * Math.min(1, (1 - p) * 6);
      return (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2.003 * t)) * 0.07 * env;
    }, (k - 1) * 0.5),
  );
  add(b * bar, bar, (t, p) => Math.sin(2 * Math.PI * (ch[0] / 2) * t) * 0.16 * Math.min(1, t * 8) * (1 - p * 0.4));
}
for (let i = 0; i * beat < DUR; i++) {
  add(i * beat, 0.22, (t, p) => Math.sin(2 * Math.PI * (120 - 70 * Math.min(1, t * 12)) * t) * Math.exp(-p * 6) * 0.35);
  const f = [440, 523.25, 659.25, 523.25][i % 4];
  add(i * beat + beat / 2, 0.3, (t, p) => Math.sin(2 * Math.PI * f * t) * Math.exp(-p * 5) * 0.05, i % 2 ? 0.6 : -0.6);
}

let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = 0.8 / peak;
const pcm = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  pcm.writeInt16LE(Math.round(L[i] * g * 32767), i * 4);
  pcm.writeInt16LE(Math.round(R[i] * g * 32767), i * 4 + 2);
}
const h = Buffer.alloc(44);
h.write('RIFF', 0);
h.writeUInt32LE(36 + pcm.length, 4);
h.write('WAVEfmt ', 8);
h.writeUInt32LE(16, 16);
h.writeUInt16LE(1, 20);
h.writeUInt16LE(2, 22);
h.writeUInt32LE(SR, 24);
h.writeUInt32LE(SR * 4, 28);
h.writeUInt16LE(4, 32);
h.writeUInt16LE(16, 34);
h.write('data', 36);
h.writeUInt32LE(pcm.length, 40);
writeFileSync(join(root, 'music.wav'), Buffer.concat([h, pcm]));
console.log('music.wav listo');
