# Resultados de pruebas

| Prueba | Resultado |
|---|---|
| Remotion demo-premium + light leaks + subrayado (premium-v2) | Render OK (exit 0). Fotograma 12 s revisado: subrayado dibujado bajo "pedidos a tiempo", destello visible, subtítulo ok |
| Promo Callumbra HyperFrames y Remotion | Render OK, 24 s, horizontal y vertical |
| HyperFrames + sfx + voz Piper | Audio presente en MP4 (picos -2,2 y -1,5 dB). No escuchado |
| stable-ts en `build.mjs` | Integrado con respaldo whisper.cpp; `node --check` ok |
| Kokoro | Genera WAV con `EspeakConfig` en ruta ASCII; calidad sin juzgar (no se puede escuchar) |
| Real-ESRGAN x4plus | OK: imagen 370 KB → 4,9 MB tras bajar modelos del release 20220424 |
| rembg (u2netp) | OK vía API Python (`rembg.cli` no escribe salida, usar `scripts/quitar_fondo.py`) |
| stable-diffusion.cpp + SD 1.5 Q8 | OK: bodega 512×512 en 394 s, nítida y usable como fondo; lento, solo para casos puntuales |

No verificado: calidad auditiva, comparación Kokoro vs Piper.

## Sesión 2026-10-23 (mejoras)
| Prueba | Resultado |
|---|---|
| LUTs slay-01..05 sobre fotograma de cifra | Los 5 aplican (hoja comparativa revisada): amber cálido, fade apagado, neon, film, portrait |
| `grade.mjs` (LUT film + grano 5 + viñeta, crf 23) | 10,5 MB → 4,5 MB, video 1920×1080 con audio intacto (grano 8/crf 18 pesaba 132 MB: descartado) |
| `auto.mjs` specs/prueba-auto.json (3 escenas, 9,7 s) | Pipeline completo OK en 375 s: stock Pixabay/Unsplash, voz, subtítulos, render, grade y hoja de contacto. Hoja revisada: fotos, cifra animada y cierre correctos |
| Pixabay API | Fotos (500 resultados) y video 1080p descargados OK |
| Comparación de voces | Generadas en `remotion/out/voces/` (piper-claude, kokoro-dora, kokoro-santa): falta que Rodolfo las escuche |
| remotion-scenes (MIT) | Escenas con datos fijos de demostración y comentarios en japonés: sirven de inspiración, no se copian tal cual |
