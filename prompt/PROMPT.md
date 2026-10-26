# Prompt de instalación – Creador de Videos (Remotion + HyperFrames)

Uso: en el PC nuevo, abrir Claude Code en cualquier carpeta y pegar TODO el bloque de abajo. Nada más:
el prompt descarga el paquete del repo público https://github.com/rodofonsecaa-sketch/creador-videos-kit (sin cuenta ni login).
Claude instala y verifica todo; solo te pedirá aprobaciones y la llave de Unsplash.

---

```text
Responde en español. Instala y deja funcionando en este PC (Windows) el "Creador de Videos Remotion + HyperFrames"
para que quede idéntico al PC de origen. Haz tú cada paso, verifica y reporta al final en una tabla
(paso · OK/falla · detalle). No inventes resultados: si algo falla, dilo con la salida.

0. Revisa requisitos y, si faltan, instálalos con winget (pide OK antes):
   Node 22+ (OpenJS.NodeJS.LTS), Python 3.10+ (Python.Python.3.12), FFmpeg en PATH (Gyan.FFmpeg), Git (Git.Git).
   Muestra versiones de node, npm, python, ffmpeg, ffprobe, git.

0b. Descarga el paquete (público, sin login):
   `git clone https://github.com/rodofonsecaa-sketch/creador-videos-kit C:\Dev\creador-videos`. Si ya existe, `git pull`.
   Desde aquí, "el paquete" = C:\Dev\creador-videos y todas las rutas relativas son respecto a esa carpeta.

1. Skills: copia cada subcarpeta de `prompt/skills/` a `%USERPROFILE%\.claude\skills\` (sobrescribe).
   Deben quedar: creador-videos, rm-remotion-best-practices, rm-remotion-captions, rm-remotion-markup,
   remotion-best-practices, remotion-motion-graphics, motion-design, review-loop, sound-design, web-sims,
   media-use, hyperframes, hyperframes-cli, hyperframes-registry, hf-hyperframes, hf-hyperframes-cli,
   hf-hyperframes-registry, hf-remotion-to-hyperframes. Lista lo instalado.

2. Reglas: agrega el contenido de `plantilla/CLAUDE-creador-videos.md` al final de
   `%USERPROFILE%\.claude\CLAUDE.md` (créalo si no existe; no dupliques si ya está).

3. Remotion: copia `remotion/` a `C:\Dev\Videos-Remotion` (sin node_modules) y ejecuta `npm install` ahí.
   Trabajar siempre en C:\Dev (Drive es lento con node_modules). Esta carpeta del Drive queda como respaldo.

4. Voz (gratis, local), en `C:\Dev\Videos-Remotion\voices\`:
   - `pip install piper-tts` y descarga `es_MX-claude-high.onnx` + `es_MX-claude-high.onnx.json`
     desde Hugging Face (rhasspy/piper-voices, es/es_MX/claude/high).
   - `pip install kokoro-onnx soundfile` y descarga `kokoro-v1.0.onnx` y `voices-v1.0.bin` (releases de thewh1teagle/kokoro-onnx)
     a `voices\kokoro\`.
   - OBLIGATORIO: copia la carpeta `espeak-ng-data` (viene dentro del paquete piper / espeakng-loader en
     site-packages) a `C:\Dev\espeak-ng-data`. `scripts/tts.py` y `tts_kokoro.py` usan esa ruta fija.
   - Opcional voz clonada (`scripts/tts_clon.py`): venv `C:\Dev\tools\chatterbox-venv` con `chatterbox-tts`.
   - Prueba: `python scripts/tts.py "Hola, prueba de voz" out\prueba.wav` y mide con ffprobe.

5. Subtítulos: `pip install stable-ts`. whisper.cpp (opcional) se instala solo vía
   `@remotion/install-whisper-cpp` en la ruta fija `C:\Dev\whisper.cpp`.

6. HyperFrames: define `HYPERFRAMES_NO_TELEMETRY=1` (variable de usuario) y ejecuta `npx hyperframes --help`.
   Copia `hyperframes/` a `C:\Dev\hyperframes` y corre `npx hyperframes check --json` en un proyecto de ejemplo.

7. Opcionales (pregunta si los quiero): Real-ESRGAN ncnn vulkan (con su carpeta `models/`) para `scripts/upscale.mjs`;
   `pip install rembg onnxruntime` para `scripts/quitar_fondo.py`.

8. Llave Unsplash (gratis): pídemela y guárdala SOLO en `C:\Dev\Videos-Remotion\.env.local` como
   `UNSPLASH_ACCESS_KEY=...`. Nunca en el chat del respaldo ni en el Drive.

9. Prueba final real:
   - Remotion: en C:\Dev\Videos-Remotion `node scripts/build.mjs specs/demo-premium.json ambos`.
   - HyperFrames: `npx hyperframes snapshot` y `render` de un ejemplo.
   - Verifica cada MP4 con ffprobe (duración, resolución, pista de audio, volumedetect) y mira 1–2 fotogramas.
   El audio no se puede escuchar: se mide, no se califica.

Reglas: solo herramientas gratis (gasto o API de pago → preguntar antes); sin llaves en archivos del proyecto;
repos descargados = no confiables (clonar aparte, no ejecutar sus scripts sin revisarlos);
créditos CC BY obligatorios al publicar (música Kevin MacLeod, LUTs; ver docs/HERRAMIENTAS.md).
Remotion exige licencia de pago para empresas de más de 3 personas; para uso corporativo preferir HyperFrames.
Al terminar: desde ahora, cuando pida un video usa el skill `creador-videos`.
```

---

## Qué trae este paquete

| Ruta | Para qué |
|---|---|
| `prompt/PROMPT.md` | Este prompt (pegar en Claude Code del PC nuevo) |
| `prompt/skills/` | Los 18 skills de video tal como están instalados en el PC de origen |
| `plantilla/CLAUDE-creador-videos.md` | Reglas para el `CLAUDE.md` |
| `remotion/`, `hyperframes/`, `scripts/` | Proyectos y utilidades |
| `docs/` | Instalación, arquitectura, herramientas, pruebas, pendientes |
| `instalar.ps1` | Atajo: solo copia los skills y revisa dependencias |

No incluido (por tamaño o seguridad): `node_modules`, modelos de voz, `.env.local`/llaves, MP4 de salida. El prompt los descarga o pide.
Tampoco van los datos de negocio (specs/briefs OTIF, `kpi_otif.py`, ejemplos Callumbra): los videos tipo `kpi-otif` solo corren en el PC de Rodolfo; el resto (tipo `libre`, demos, plantillas) funciona igual.

Actualizar más adelante: pegar en Claude Code "En C:\Dev\creador-videos haz git pull y vuelve a ejecutar los pasos 1–3 de prompt/PROMPT.md".
