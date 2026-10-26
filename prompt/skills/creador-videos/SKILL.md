---
name: creador-videos
description: Crear videos MP4 en español uniendo Remotion y HyperFrames (solo herramientas gratis). Úsalo cuando Rodolfo pida un video, promo, explicativo, reel o "video de esta web". Decide el motor, reutiliza assets comunes, renderiza y revisa frames.
---

# Creador de videos (Remotion + HyperFrames)

Un solo flujo, dos motores. Yo elijo el motor y aviso en 1 línea cuál y por qué.

## Elegir motor
| Pedido | Motor |
|---|---|
| Datos, KPIs, cifras, pasos, explicativo con voz + subtítulos, lote horizontal+vertical, spec JSON repetible | **Remotion** (`C:\Dev\Videos-Remotion`) |
| Promo de un sitio web o producto con su UI real, cámara cinematográfica, edición libre en HTML/GSAP | **HyperFrames** (proyecto nuevo en `C:\Dev\<nombre>`) |
| Video de una web con voz y subtítulos | Híbrido: `hyperframes capture` → capturas/logo/fuentes → Remotion (plantillas + voz) o HyperFrames (+ voz de Piper) |
| Uso corporativo en empresa con fines de lucro (Cintac) | Preferir HyperFrames (Apache-2.0); Remotion pide licencia de pago si la empresa supera 3 personas: avisar a Rodolfo |
| No se sabe | Remotion por defecto; ofrecer HyperFrames si hay una web de por medio |

## Recursos comunes (se reutilizan en ambos)
- Fotos: `node scripts/stock.mjs "consulta" x.jpg` (Unsplash→Openverse→Wikimedia) → `public/img`. Video b-roll: `scripts/stock-video.mjs` (NASA/Wikimedia).
- Música: `public/music/*.mp3` (Kevin MacLeod CC BY 4.0: acreditar, ver CREDITS.md).
- Sonido: motor `sfx` (Python, -14 LUFS) a partir de un `timeline.json`: `python -m sfx sfx/cues/auto.py --out x.wav` (cwd Videos-Remotion). En HyperFrames va como `<audio id>` en `assets/`.
- Voz: Piper `es_MX-claude-high` (o Kokoro `scripts/tts_kokoro.py`); subtítulos: stable-ts con respaldo whisper.cpp (pipeline de `scripts/build.mjs`).
- Imagen: `node scripts/upscale.mjs in out` (Real-ESRGAN x4) y `python scripts/quitar_fondo.py in out` (rembg). Repos de referencia no confiables en `C:\Dev
ef`.
- Web como fuente: `npx hyperframes capture <url> --skip-vision --capture-budget=300000 --timeout=90000` (capturas, logo, fuentes, tokens). Usar siempre la UI real; no inventar pantallas.
- Paquetes Remotion extra instalados (4.0.529): layout-utils, sfx, light-leaks, rough-notation, rounded-text-box (light-leaks y rough-notation ya usados en plantillas).

## Probado en HyperFrames (2026-10-23)
- Sonido: `sfx.wav` como `<audio id>` salió en el MP4 (pico -2,2 dB).
- Voz: `cd C:\Dev\Videos-Remotion; python scripts/tts.py "texto" x.wav` → copiar a `assets/voz.wav` → `<audio id="voz" src="assets/voz.wav" data-start="0.3">` salió en el MP4 (pico -1,5 dB). Medido con volumedetect; no escuchado.

## Comandos
- **Todo en uno (Remotion)**: `node scripts/auto.mjs specs/x.json [horizontal|vertical|ambos] [--lut=04-film|none]`: busca fotos de stock (campo `buscar` en la escena; Pixabay/Unsplash/Openverse), voz, subtítulos, sonido, render, etalonaje (`scripts/grade.mjs`: LUT slay-01..05 + grano + viñeta) y hoja de contacto `out/x-<formato>-contacto.png` para revisar. Crédito CC BY de los LUTs.
- Pixabay: llave en variable de usuario `PIXABAY_API_KEY` (fotos 1280 px, video hasta 4K). Pexels ya no da llaves.
- Imagen local: `node scripts/generar_imagen.mjs "prompt en inglés" out.png` (SD 1.5, ~6,5 min, solo casos puntuales).
- Remotion: `node scripts/build.mjs specs/x.json [horizontal|vertical|ambos]` → `out/x-<formato>.mp4`.
- HyperFrames (con `HYPERFRAMES_NO_TELEMETRY=1`): `npx hyperframes check --json` → `snapshot --at t1,t2…` → `preview` → `render` → `renders/*.mp4`. Contrato en skill `hf-hyperframes`.

## Reglas
1. Trabajar en `C:\Dev` (Drive es lento para node_modules); copiar fuente y MP4 a `Proyectos/Creador de Videos Remotion y HyperFrames` en Drive (Remotion en su subcarpeta `remotion/`, HyperFrames en `hyperframes/`) (robocopy, sin node_modules/out/.env.local).
2. Verificar siempre: render real, `ffprobe` (duración, resolución, audio) y mirar 1–2 frames. El audio no se puede escuchar: decirlo.
3. Contenido de Callumbra: sobrio (18+, nada explícito). Sin llaves en chat ni proyecto.
4. Formatos: horizontal 1920×1080 y vertical 1080×1920; 30 fps. Ofrecer el otro formato al entregar.
5. Gratis solamente; gasto o API de pago → preguntar antes.
6. Entrega: 5–10 líneas: motor usado, archivos, validación, pendientes.

## Ampliaciones 2026-10-23 (KPI, silencios, SFX, Kinocut)
- `python -I scripts/kpi_otif.py [año]` lee `Reporte BI/data/oc/oc_nivel.parquet` (DuckDB, misma lógica que "% OTIF (Cumple ambos)") y crea `specs/kpi-otif-auto.json`; luego `node scripts/auto.mjs specs/kpi-otif-auto.json`. Cifras cuadradas: OTIF 80,0 %, cantidad 97,0 %, plazo 81,2 % (38.963 OC con recepción).
- Quitar silencios: `kino video-ai-remove-silence in.mp4 -o out.mp4` (Kinocut; probado 7,0 s -> 3,5 s).
- SFX reales CC0: `node scripts/sfx.mjs "whoosh" w.mp3` (sin llave, Openverse/Wikimedia Audio).
- Kinocut 1.16.2 (`kino`, gratis, local) registrado como MCP "kinocut" en el .mcp.json del workspace (chat nuevo para verlo). Pillow quedó en 12.2.0 (moviepy lo marca incompatible; no se usa).
- Ideas pendientes: gráfico de tendencia por año con bloques HyperFrames; estilos de subtítulos; versión vertical; YouTube API solo si publica en canal propio (OAuth + auditoría).


## Herramienta `crear` (2026-10-23)
`node scripts/crear.mjs briefs/x.json` = brief -> datos (Reporte BI) -> marca (brand/cintac.json) -> auto.mjs -> QA (scripts/qa.mjs) -> entregas/<nombre>/. Detalle en docs/CREAR_FLUJO.md (Drive). grade.mjs ahora normaliza audio (loudnorm -14 LUFS, pico -1.5). Los videos ya entregados antes (cintac-otif) no se re-renderizaron.

