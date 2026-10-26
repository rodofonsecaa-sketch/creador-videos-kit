# Pendientes

- [ ] **Rodolfo**: escuchar `remotion/out/voces/*.wav` y elegir voz por defecto (Piper claude vs Kokoro dora/santa).
- [ ] Probar `auto.mjs` con un caso real de Cintac (KPI de abastecimiento o promo de dashboard).
- [ ] Bloques de HyperFrames (`npx hyperframes catalog --json`): instalar solo cuando una promo lo pida.
- [ ] Más música libre (incompetech u otra con licencia clara); Pixabay Music no tiene API.
- [ ] Estilos de subtítulo extra (karaoke, vertical) si se necesitan.
- [ ] Portar a mano 1–2 escenas de `C:\Dev\ref\remotion-scenes` con datos propios si hace falta una plantilla nueva (barras, ranking).
- [ ] `mcp-video` solo si aparece una tarea de edición FFmpeg que HyperFrames no cubra.

## Ampliaciones 2026-10-23 (KPI, silencios, SFX, Kinocut)
- `python -I scripts/kpi_otif.py [año]` lee `Reporte BI/data/oc/oc_nivel.parquet` (DuckDB, misma lógica que "% OTIF (Cumple ambos)") y crea `specs/kpi-otif-auto.json`; luego `node scripts/auto.mjs specs/kpi-otif-auto.json`. Cifras cuadradas: OTIF 80,0 %, cantidad 97,0 %, plazo 81,2 % (38.963 OC con recepción).
- Quitar silencios: `kino video-ai-remove-silence in.mp4 -o out.mp4` (Kinocut; probado 7,0 s -> 3,5 s).
- SFX reales CC0: `node scripts/sfx_freesound.mjs "whoosh" w.mp3` (requiere FREESOUND_API_KEY gratis; pendiente que Rodolfo la saque).
- Kinocut 1.16.2 (`kino`, gratis, local) registrado como MCP "kinocut" en el .mcp.json del workspace (chat nuevo para verlo). Pillow quedó en 12.2.0 (moviepy lo marca incompatible; no se usa).
- Ideas pendientes: gráfico de tendencia por año con bloques HyperFrames; estilos de subtítulos; versión vertical; YouTube API solo si publica en canal propio (OAuth + auditoría).

- Voz clonada (2026-10-23): Chatterbox Multilingual en venv `C:\Dev\tools\chatterbox-venv` (setuptools<81 necesario para perth). `scripts/tts_clon.py "texto" out.wav voices/ref/voz.wav`. Probado: frase de 4,9 s tardó 4 min 51 s en CPU (modelo ~11 min de descarga la 1ª vez); sirve para frases clave, no para videos largos. Solo clonar voces con consentimiento. Referencia de prueba = Lorenzo (voices/ref/prueba-lorenzo.wav).
- Coverr integrado (2026-10-23): COVERR_API_KEY (variable de usuario; llave en estado "Manifestación"/borrador, 50 llamadas/h) como 2ª fuente en stock-video.mjs (pixabay, coverr, nasa, wikimedia). Exige crédito a Coverr (queda en public/video/CREDITS.md). Búsquedas largas dan 0 resultados: usar 1–2 palabras en inglés. Rodolfo mostró la llave en captura: puede regenerarla.
- SFX sin llave (2026-10-23): `node scripts/sfx.mjs "door" salida.mp3 [maxSeg]` busca en Openverse -> Wikimedia Audio (CC0/PD/CC BY; crédito en public/sfx/CREDITS.md). Reemplaza a sfx_freesound.mjs: Freesound ya no hace falta (su CDN da 403 sin llave y Rodolfo no pudo registrarse). Jamendo (música CC BY, descarga directa 200) disponible vía Openverse audio con source=jamendo si se necesita música.
