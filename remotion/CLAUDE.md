# Videos-Remotion (instrucciones para Claude)
Generar videos MP4 en español con Remotion + Node + FFmpeg, sin APIs de pago.
Skills globales instaladas: remotion-motion-graphics, remotion-best-practices, motion-design, review-loop, sound-design, web-sims (leer motion-design y review-loop antes de pulir).

## Flujo
1. Rodolfo describe el video en español → escribir `specs/<nombre>.json` (formato en `src/types.ts`: escenas con titulo, subtitulo, subtitulo_pie, imagen opcional en `public/img`, segundos, transicion fade|slide|wipe).
2. Música: `npm run music [segundos]` genera `public/music.wav` original (libre de derechos). Alternativas libres: Pixabay / Free Music Archive (citar licencia).
3. Revisar: `node scripts/frames.mjs specs/x.json horizontal 10,60,130` → mirar 1–2 PNG en `out/frames`, corregir.
4. Render: `node scripts/render.mjs specs/x.json ambos` → `out/x-horizontal.mp4` y `out/x-vertical.mp4`.
Imágenes: propias o libres (Unsplash/Pexels/Wikimedia); sin generadores de pago. No abrir node_modules.

Trabajo: copia local en C:\Dev\Videos-Remotion (node_modules ahí; en Drive es demasiado lento). Tras cada video, copiar src/specs/scripts a Drive (robocopy sin node_modules) y los MP4 a Proyectos\Videos-Remotion\out.

Sonido: `node scripts/timeline.mjs specs/x.json && npm run sfx` genera public/sfx.wav (cama + whoosh/impacto/chime por escena, -14 LUFS, motor sfx de claude-motion con numpy) y se usa poniendo "musica": "sfx.wav" en el spec. Ver skill sound-design.

## Flujo profesional (todo en uno)
`node scripts/build.mjs specs/x.json [horizontal|vertical|ambos]` -> voz en off (Piper, voz es_MX-claude), subtítulos palabra a palabra (Whisper local, texto exacto del guion), banda sonora y render MP4.
En el spec: `narracion` por escena (la duración se calcula sola), `kpis`, `grafico` (barras), `marca` {nombre, logo en public/img}, `imagen`.
Imágenes libres: `node scripts/stock.mjs "consulta" nombre.jpg` (Wikimedia Commons, licencia en public/img/CREDITS.md; citar si es CC BY-SA).
Requisitos locales: Python (piper-tts, numpy), whisper.cpp en C:\Dev\whisper.cpp, datos espeak en C:\Dev\espeak-ng-data (ruta ASCII), voz en voices/ (no va a Drive).
Efectos: motion blur, formas con ruido, grano, Poppins. Lottie instalado (@remotion/lottie) sin animaciones aún.

## Plantillas y música real (demo-premium)
- `plantilla`: `dividida` (imagen + `puntos`), `cifra` (`cifra{valor,sufijo,porcentaje,etiqueta}`), `pasos` (`pasos[{titulo,detalle,icono}]`; iconos: camion caja cajas bodega grafico reloj check alerta dinero usuarios mundo engranaje escudo tendencia barco avion meta rayo), `cierre` (`cta`). Sin plantilla: título cinético + gráfico/kpis.
- `pista`: música real (`music/corporate.mp3`, `music/inspired.mp3`, `music/impact-moderato.mp3`), queda bajo la voz y apaga la cama sintética. Crédito obligatorio CC BY 4.0 (Kevin MacLeod): ver public/music/CREDITS.md.
- Fotos libres sin llave: `node scripts/stock.mjs "consulta" salida.jpg`. Ejemplo: `specs/demo-premium.json`.

## HyperFrames (respaldo, instalado 2026-10-22)
- Motor alterno HTML→MP4 (HeyGen, Apache-2.0). Remotion sigue siendo el principal; usar HyperFrames solo para GSAP/Lottie/Three.js o portar algo existente.
- Skills globales: hf-hyperframes, hf-hyperframes-cli, hf-hyperframes-registry (~450 bloques), hf-remotion-to-hyperframes. Telemetría apagada (HYPERFRAMES_NO_TELEMETRY=1).
- Uso: `npx hyperframes init nombre --non-interactive` → `npm install` → `npm run render` (prueba OK: 10 s en 1m06s, en C:\Dev\hf-test). Proyectos HyperFrames van en C:\Dev, no en Drive.
- Código fuente revisado en C:\Dev\hf-src (no ejecutar desde ahí).

## Creador de videos unificado (2026-10-23)
Skill global `creador-videos` (~/.claude/skills/creador-videos): elige Remotion o HyperFrames según el pedido, reutiliza stock/música/sfx/voz y renderiza. Ver tabla de decisión allí.

## Imagen y herramientas (2026-10-23)
- `node scripts/upscale.mjs in out` (Real-ESRGAN x4, C:\Dev	oolsealesrgan) y `python scripts/quitar_fondo.py in out` (rembg u2netp).
- stable-diffusion.cpp en C:\Dev	ools\sdcpp (sin modelo aun). Repos de referencia en C:\Devef (no confiables).
- Respaldo oficial: Drive Proyectos/Creador de Videos Remotion y HyperFrames/remotion (documentos en la carpeta madre).

## Todo en uno y etalonaje (2026-10-23)
- `node scripts/auto.mjs specs/x.json [formato] [--lut=04-film|none]`: campo `buscar` en la escena = foto de stock automática; luego voz, subtítulos, sonido, render, `grade.mjs` (LUT+grano+viñeta, CC BY slaycamera/luts) y `out/x-<formato>-contacto.png`.
- Pixabay con PIXABAY_API_KEY (variable de usuario). Pexels ya no da llaves. Voces de comparación en out/voces/.

## Voz por defecto (2026-10-23)
Videos nuevos usan voz chilena Edge TTS `es-CL-LorenzoNeural` (rate -4%, pitch -3Hz) vía `scripts/tts_chile.py` (online, gratis; si falla cae a Piper). Para la voz Piper: `"voz": "piper"` en el spec. El video `cintac-otif` ya renderizado conserva su voz Piper.

## Ampliaciones 2026-10-23 (KPI, silencios, SFX, Kinocut)
- `python -I scripts/kpi_otif.py [año]` lee `Reporte BI/data/oc/oc_nivel.parquet` (DuckDB, misma lógica que "% OTIF (Cumple ambos)") y crea `specs/kpi-otif-auto.json`; luego `node scripts/auto.mjs specs/kpi-otif-auto.json`. Cifras cuadradas: OTIF 80,0 %, cantidad 97,0 %, plazo 81,2 % (38.963 OC con recepción).
- Quitar silencios: `kino video-ai-remove-silence in.mp4 -o out.mp4` (Kinocut; probado 7,0 s -> 3,5 s).
- SFX reales CC0: `node scripts/sfx_freesound.mjs "whoosh" w.mp3` (requiere FREESOUND_API_KEY gratis; pendiente que Rodolfo la saque).
- Kinocut 1.16.2 (`kino`, gratis, local) registrado como MCP "kinocut" en el .mcp.json del workspace (chat nuevo para verlo). Pillow quedó en 12.2.0 (moviepy lo marca incompatible; no se usa).
- Ideas pendientes: gráfico de tendencia por año con bloques HyperFrames; estilos de subtítulos; versión vertical; YouTube API solo si publica en canal propio (OAuth + auditoría).

- Voz clonada (2026-10-23): Chatterbox Multilingual en venv `C:\Dev\tools\chatterbox-venv` (setuptools<81 necesario para perth). `scripts/tts_clon.py "texto" out.wav voices/ref/voz.wav`. Probado: frase de 4,9 s tardó 4 min 51 s en CPU (modelo ~11 min de descarga la 1ª vez); sirve para frases clave, no para videos largos. Solo clonar voces con consentimiento. Referencia de prueba = Lorenzo (voices/ref/prueba-lorenzo.wav).
- Coverr integrado (2026-10-23): COVERR_API_KEY (variable de usuario; llave en estado "Manifestación"/borrador, 50 llamadas/h) como 2ª fuente en stock-video.mjs (pixabay, coverr, nasa, wikimedia). Exige crédito a Coverr (queda en public/video/CREDITS.md). Búsquedas largas dan 0 resultados: usar 1–2 palabras en inglés. Rodolfo mostró la llave en captura: puede regenerarla.
- SFX sin llave (2026-10-23): `node scripts/sfx.mjs "door" salida.mp3 [maxSeg]` busca en Openverse -> Wikimedia Audio (CC0/PD/CC BY; crédito en public/sfx/CREDITS.md). Reemplaza a sfx_freesound.mjs: Freesound ya no hace falta (su CDN da 403 sin llave y Rodolfo no pudo registrarse). Jamendo (música CC BY, descarga directa 200) disponible vía Openverse audio con source=jamendo si se necesita música.

## Herramienta `crear` (2026-10-23)
`node scripts/crear.mjs briefs/x.json` = brief -> datos (Reporte BI) -> marca (brand/cintac.json) -> auto.mjs -> QA (scripts/qa.mjs) -> entregas/<nombre>/. Detalle en docs/CREAR_FLUJO.md (Drive). grade.mjs ahora normaliza audio (loudnorm -14 LUFS, pico -1.5). Los videos ya entregados antes (cintac-otif) no se re-renderizaron.

