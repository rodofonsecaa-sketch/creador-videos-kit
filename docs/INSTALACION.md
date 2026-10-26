# Instalación en otro PC (Windows)

Forma rápida: abrir Claude Code en la carpeta del paquete y pegar `prompt/PROMPT.md`; hace todo lo de abajo.

Requisitos: Node 22+, Python 3.10+, FFmpeg en PATH, Claude Code.

1. Copiar `remotion/` a `C:\Dev\Videos-Remotion` y ejecutar `npm install`.
2. `powershell -File instalar.ps1` (copia `prompt/skills/*` a `~/.claude/skills`).
3. Voz: `pip install piper-tts` y bajar `es_MX-claude-high.onnx(.json)` a `remotion/voices/` (carpeta excluida del respaldo por tamaño). Kokoro: `pip install kokoro-onnx` + `kokoro-v1.0.onnx` y `voices-v1.0.bin` en `voices/kokoro/`.
4. Subtítulos: `pip install stable-ts`.
5. Datos de espeak en ruta ASCII (p. ej. `C:\Dev\espeak-ng-data`) si el usuario de Windows tiene tildes.
6. HyperFrames: `npx hyperframes --help` (con `HYPERFRAMES_NO_TELEMETRY=1`).
7. Opcionales: Real-ESRGAN ncnn vulkan (con carpeta `models/`), `pip install rembg onnxruntime`.
8. Llave Unsplash (gratis) en `remotion/.env.local` como `UNSPLASH_ACCESS_KEY=...`. Nunca en el chat ni en el respaldo.
9. Pegar `plantilla/CLAUDE-creador-videos.md` en el `CLAUDE.md` del usuario.
