"""Voz clonada en español con Chatterbox Multilingual (local, gratis, MIT). Requiere venv C:/Dev/tools/chatterbox-venv.
Uso: C:/Dev/tools/chatterbox-venv/Scripts/python.exe scripts/tts_clon.py "texto" salida.wav voices/ref/mi-voz.wav"""
import sys, torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
text, out, ref = sys.argv[1:4]
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
wav = m.generate(text, language_id="es", audio_prompt_path=ref)
torchaudio.save(out, wav, m.sr)
