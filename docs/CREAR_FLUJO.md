# Flujo `crear` (herramienta de videos profesionales)

`node scripts/crear.mjs briefs/<nombre>.json` hace todo en orden:

1. **Brief** (`briefs/*.json`): `{nombre, tipo, anio?, marca, formato}`. Tipos: `kpi-otif` (datos del Reporte BI) y `libre` (con `escenas`).
2. **Datos**: `scripts/kpi_otif.py` lee `Reporte BI/data/oc/oc_nivel.parquet` (DuckDB, misma lógica que "% OTIF (Cumple ambos)") y deja `specs/<nombre>.json` + `.cuadre.json` (cifras fuente).
3. **Marca** (`brand/cintac.json`): colores, nombre, pista, LUT, voz (Lorenzo es-CL por defecto).
4. **Recursos y render**: `scripts/auto.mjs` (stock Unsplash/Openverse/Pixabay, voz, subtítulos, sonido, render, etalonaje con loudnorm -14 LUFS).
5. **QA** (`scripts/qa.mjs`): resolución, duración, audio -14±2 LUFS, pico < -0,5 dBFS, sin negro, créditos presentes, cifras y gráfico = fuente.
6. **Entrega** (`entregas/<nombre>/`): mp4, miniatura.png, qa.json, spec.json, cuadre.json, creditos.md.

Pendiente: más tipos (comparación, proceso/pasos, anuncio), SRT, subir kit de marca con logo, versión vertical por defecto opcional, QA de legibilidad por visión.
