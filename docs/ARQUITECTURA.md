# Arquitectura

## Decisión de motor
| Pedido | Motor |
|---|---|
| Datos, KPIs, pasos, voz + subtítulos, lotes | Remotion |
| Promo de web/producto, UI real, cámara | HyperFrames |
| Web con voz y subtítulos | Híbrido: `hyperframes capture` → Remotion o HyperFrames + voz Piper |
| Empresa con fines de lucro (Cintac) | HyperFrames (licencia) |

## Flujo Remotion (`scripts/build.mjs specs/x.json`)
1. Spec JSON (escenas, plantilla, textos) →
2. Voz (Piper `es_MX-claude-high`; alternativa Kokoro `ef_dora`) →
3. Subtítulos palabra a palabra (stable-ts; respaldo whisper.cpp) →
4. Sonido procedural `sfx` desde `timeline.json` (-14 LUFS) + música real bajo la voz →
5. Render `out/x-horizontal.mp4` / `-vertical.mp4` (30 fps, 1920×1080 / 1080×1920).
Extras: light leaks entre escenas y subrayado rough-notation en cifras.

## Flujo HyperFrames
`init` o `capture <url>` → `index.html` (HTML+GSAP, `window.__timelines`) → `check --json` → `snapshot --at` → `render` → `renders/*.mp4`. Voz y sfx entran como `<audio id>` en `assets/`.

## Recursos comunes
Fotos: `scripts/stock.mjs` (Unsplash→Openverse→Wikimedia). Video b-roll: `scripts/stock-video.mjs` (NASA/Wikimedia). Mejora de imagen: `scripts/upscale.mjs` (Real-ESRGAN x4), `scripts/quitar_fondo.py` (rembg).

## Verificación
Render real + `ffprobe` (duración, resolución, audio) + 1–2 fotogramas. Nunca afirmar calidad de audio sin poder escucharlo.
