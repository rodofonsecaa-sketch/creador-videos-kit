"""Voz en off chilena (Edge TTS es-CL-LorenzoNeural, gratis, online). Uso: python scripts/tts_chile.py "texto" salida.wav"""
import subprocess, sys, tempfile, os
text, out = sys.argv[1], sys.argv[2]
mp3 = tempfile.mktemp(suffix=".mp3")
subprocess.run([sys.executable, "-I", "-m", "edge_tts", "--voice", "es-CL-LorenzoNeural", "--rate=-4%", "--pitch=-3Hz", "--text", text, "--write-media", mp3], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-ar", "24000", "-ac", "1", out], check=True)
os.remove(mp3)
