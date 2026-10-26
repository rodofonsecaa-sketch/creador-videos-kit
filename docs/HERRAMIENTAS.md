# Herramientas instaladas (2026-10-23)

| Herramienta | Ruta | Uso | Licencia |
|---|---|---|---|
| Remotion 4.0.529 + paquetes (transitions, light-leaks, rough-notation, sfx, layout-utils, rounded-text-box) | `C:\Dev\Videos-Remotion` | Plantillas y render | Source-available: pago si empresa >3 personas |
| HyperFrames | `npx hyperframes` | Promos HTML+GSAP | Apache-2.0 |
| Piper TTS es_MX-claude-high | `voices/` | Voz | MIT / voz con su licencia |
| Kokoro-onnx (ef_dora) | `scripts/tts_kokoro.py` | Voz alternativa | Apache-2.0 |
| stable-ts (Whisper base) | `scripts/whisper_st.py` | Subtítulos | MIT |
| Motor sfx procedural | `sfx/` | Efectos y mezcla -14 LUFS | propio |
| Real-ESRGAN ncnn vulkan | `C:\Dev\tools\realesrgan\...\` (con `models/`) | `node scripts/upscale.mjs in out` x4 | BSD-3 |
| rembg + u2netp | pip, `~/.rembg` | `python scripts/quitar_fondo.py in out` | MIT (evitar BRIA RMBG-2.0: pago comercial) |
| stable-diffusion.cpp (Vulkan) + SD 1.5 Q8 (1,7 GB) | `C:Dev	oolssdcpp` (modelo en `models/sd15-q8.gguf`, fuera del respaldo) | `node scripts/generar_imagen.mjs "prompt" out.png`: 512×512 en ~6,5 min (i7-1355U); luego `upscale.mjs` | MIT; SD 1.5 CreativeML OpenRAIL-M (uso comercial permitido) |
| Repos de referencia (no confiables) | `C:\Dev\ref\` | remotion-scenes, remotion-templates, remotion-video-templates, onda, luts, Lumi, free-for-creators | ver cada repo |
| LUTs slay-01..05 | `assets/luts/` | `node scripts/grade.mjs in out [lut] [grano] [vineta]` | CC BY 4.0 (acreditar slaycamera/luts) |
| Pixabay API | variable de usuario `PIXABAY_API_KEY` | fotos 1280 px y video hasta 4K en `stock.mjs` / `stock-video.mjs` | Pixabay License (uso comercial) |
| Todo en uno | `scripts/auto.mjs` | spec → stock → render → grade → hoja de contacto | — |

## Créditos obligatorios
- Música: Kevin MacLeod (incompetech.com), CC BY 4.0. Ver `remotion/public/music/CREDITS.md`.
- LUTs de `slaycamera/luts`: CC BY 4.0 (acreditar si se usan).
- Imágenes: Unsplash (clave local), Openverse y Wikimedia (revisar licencia por imagen).

Pixabay: ACTIVO (2026-10-23). Llave en variable de usuario PIXABAY_API_KEY (no en archivos). Fotos hasta 1280 px, videos hasta 4K; `stock.mjs` y `stock-video.mjs` la usan sola.
