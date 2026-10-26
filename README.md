# Creador de Videos: Remotion + HyperFrames

Claude Code crea videos MP4 en español de forma casi automática, uniendo **Remotion** (datos, voz, subtítulos, lotes) y **HyperFrames** (promos de webs/productos en HTML+GSAP). Todo con herramientas **gratuitas**; sin APIs de pago.

## Qué contiene

| Carpeta | Contenido |
|---|---|
| `remotion/` | Proyecto Remotion 4.0.529: plantillas (dividida, cifra, pasos, cierre), pipeline `scripts/build.mjs` (voz Piper/Kokoro + subtítulos stable-ts/whisper.cpp), motor de sonido `sfx/`, música real, specs JSON |
| `hyperframes/` | Proyectos HyperFrames de ejemplo (`hf-test-voz`) |
| `prompt/` | **`PROMPT.md`**: prompt único para pegar en Claude Code de otro PC y dejarlo idéntico. `skills/`: los 18 skills de video (creador-videos, rm-remotion-*, remotion-*, hyperframes*, hf-*, motion-design, review-loop, sound-design, web-sims, media-use). Empaquetado en `creador-videos-skill.zip` |
| `scripts/` | Utilidades comunes (`upscale.mjs`, `quitar_fondo.py`, copia a Drive) |
| `plantilla/` | `CLAUDE-creador-videos.md`: bloque de reglas para el `CLAUDE.md` de otra persona |
| `docs/INSTALACION.md` | Paso a paso para replicarlo en otro PC |
| `docs/ARQUITECTURA.md` | Cómo se decide el motor y cómo fluye un video |
| `docs/HERRAMIENTAS.md` | Todo lo instalado, rutas, usos, licencias y créditos obligatorios |
| `docs/RESULTADOS_PRUEBAS.md` | Qué se probó y qué no se pudo verificar |
| `docs/PENDIENTES.md` | Lista viva de pendientes y mejoras |
| `respaldos/` | Copias de seguridad de skills y configuración |
| `instalar.ps1` | Instala el skill en `~/.claude/skills` y revisa dependencias |

## Elegir motor

- **Remotion**: cifras/KPIs, pasos, explicativo con voz y subtítulos, horizontal+vertical, spec JSON repetible.
- **HyperFrames**: promo de web o producto con su UI real, cámara cinematográfica; preferido para Cintac (Apache-2.0).
- **Licencia**: Remotion exige licencia de pago para empresas de más de 3 personas.

## Inicio rápido

1. Otro PC: abrir Claude Code en esta carpeta y pegar `prompt/PROMPT.md` (o solo skills: `powershell -File instalar.ps1`)
2. Remotion: `node scripts/build.mjs specs/demo-premium.json ambos` (desde la copia de trabajo en `C:\Dev\Videos-Remotion`)
3. HyperFrames: `npx hyperframes check --json` → `snapshot` → `render`

## Advertencias

- Trabajar en `C:\Dev` (Drive es lento con `node_modules`); aquí vive el respaldo de fuente y MP4.
- El audio no se puede escuchar: se mide (ffprobe/volumedetect), no se califica.
- Crédito CC BY obligatorio para la música (Kevin MacLeod) y LUTs (ver `docs/HERRAMIENTAS.md`).
- Las llaves (Unsplash) van en `.env.local` local, nunca en este respaldo.
