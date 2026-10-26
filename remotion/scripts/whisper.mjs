// Transcribe un wav con Whisper local y escribe captions palabra por palabra (formato @remotion/captions).
// Uso: node scripts/whisper.mjs entrada.wav salida.json
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {writeFileSync, mkdirSync} from 'node:fs';
import {installWhisperCpp, downloadWhisperModel, transcribe, toCaptions} from '@remotion/install-whisper-cpp';

const [input, output] = process.argv.slice(2);
const WHISPER_DIR = 'C:/Dev/whisper.cpp'; // ruta ASCII
const MODEL = 'base';
await installWhisperCpp({to: WHISPER_DIR, version: '1.5.5'});
await downloadWhisperModel({model: MODEL, folder: WHISPER_DIR});
const wav16 = input.replace(/\.wav$/, '.16k.wav');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', input, '-ar', '16000', '-ac', '1', wav16]);
const out = await transcribe({model: MODEL, whisperPath: WHISPER_DIR, whisperCppVersion: '1.5.5', inputPath: path.resolve(wav16), tokenLevelTimestamps: true, language: 'es'});
const {captions} = toCaptions({whisperCppOutput: out});
writeFileSync(output, JSON.stringify(captions, null, 1));
console.log(captions.length + ' palabras ->', output);
