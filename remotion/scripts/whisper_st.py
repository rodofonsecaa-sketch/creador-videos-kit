"""Subtítulos palabra por palabra con stable-ts (Whisper local, gratis). Uso: python scripts/whisper_st.py entrada.wav salida.json
Misma salida que whisper.mjs: lista de {text, startMs, endMs, timestampMs, confidence} con espacio inicial por palabra."""
import json, sys
import stable_whisper

model = stable_whisper.load_model("base")
res = model.transcribe(sys.argv[1], language="es", word_timestamps=True, vad=False)
caps = []
for seg in res.segments:
    for w in seg.words:
        s, e = int(w.start * 1000), int(w.end * 1000)
        caps.append({"text": " " + w.word.strip(), "startMs": s, "endMs": e, "timestampMs": (s + e) // 2, "confidence": round(float(w.probability), 3)})
json.dump(caps, open(sys.argv[2], "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(caps), "palabras ->", sys.argv[2])
