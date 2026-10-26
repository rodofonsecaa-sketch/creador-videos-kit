"""Voz en off en español con Piper (local, gratis). Uso: python scripts/tts.py "texto" salida.wav"""
import sys, wave
from pathlib import Path
from piper import PiperVoice

ROOT = Path(__file__).resolve().parent.parent
ESPEAK = Path("C:/Dev/espeak-ng-data")  # ruta ASCII: espeak falla con tildes en la ruta
voice = PiperVoice.load(str(ROOT / "voices" / "es_MX-claude-high.onnx"), espeak_data_dir=ESPEAK)
text, out = sys.argv[1], sys.argv[2]
with wave.open(out, "wb") as wf:
    voice.synthesize_wav(text, wf)
