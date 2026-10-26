"""Voz en off en español con Kokoro (local, gratis). Uso: python scripts/tts_kokoro.py "texto" salida.wav [voz=ef_dora]"""
import sys
from pathlib import Path
import soundfile as sf
from kokoro_onnx import Kokoro, EspeakConfig

D = Path(__file__).resolve().parent.parent / "voices" / "kokoro"
k = Kokoro(str(D / "kokoro-v1.0.onnx"), str(D / "voices-v1.0.bin"), espeak_config=EspeakConfig(data_path="C:/Dev/espeak-ng-data"))  # ruta ASCII
voz = sys.argv[3] if len(sys.argv) > 3 else "ef_dora"
samples, sr = k.create(sys.argv[1], voice=voz, speed=1.0, lang="es")
sf.write(sys.argv[2], samples, sr)
