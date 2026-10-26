// Descarga un clip libre SIN llave (NASA, Wikimedia Commons) y lo deja en MP4 H.264 sin audio, 1080p, 30 fps, recortado.
// Uso: node scripts/stock-video.mjs "consulta" salida.mp4 [segundos=12] [pixabay|coverr|nasa|wikimedia]  -> public/video/salida.mp4 (+ CREDITS.md)
import {execFileSync} from 'node:child_process';
import {appendFileSync, mkdirSync, unlinkSync, writeFileSync} from 'node:fs';

const [query, out, secs = '12', only] = process.argv.slice(2);
if (!query || !out) throw new Error('uso: node scripts/stock-video.mjs "consulta" salida.mp4 [segundos] [pixabay|coverr|nasa|wikimedia]');
const UA = {'User-Agent': 'Videos-Remotion/1.0 (uso personal)'};
const json = async (u) => (await fetch(u, {headers: UA})).json();

// Pixabay (llave gratis en variable PIXABAY_API_KEY): clips hasta 4K, licencia Pixabay (uso comercial).
async function pixabay() {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return;
  const u = new URL('https://pixabay.com/api/videos/');
  Object.entries({key, q: query, per_page: '10', safesearch: 'true'}).forEach(([k, v]) => u.searchParams.set(k, v));
  const h = ((await json(u)).hits ?? [])[0];
  const v = h && (h.videos.large?.url ? h.videos.large : h.videos.medium);
  return v?.url && {url: v.url, credito: `Pixabay License — ${h.user} — ${h.pageURL}`};
}

// Coverr (llave gratis en variable COVERR_API_KEY, 50 llamadas/hora): clips 1080p+, licencia comercial; exige crédito a Coverr.
async function coverr() {
  const key = process.env.COVERR_API_KEY;
  if (!key) return;
  const H = {Authorization: `Bearer ${key}`};
  const u = new URL('https://api.coverr.co/videos');
  Object.entries({query, page_size: '10'}).forEach(([k, v]) => u.searchParams.set(k, v));
  const h = ((await (await fetch(u, {headers: H})).json()).hits ?? []).find((x) => !x.is_vertical && !x.is_ai_generated);
  if (!h) return;
  const d = await (await fetch(`https://api.coverr.co/videos/${h.id}`, {headers: H})).json();
  return d.urls?.mp4 && {url: d.urls.mp4, credito: `Coverr (licencia comercial, crédito requerido) — ${h.title} — https://coverr.co/videos/${h.slug}`};
}

async function nasa() {
  const items = (await json(`https://images-api.nasa.gov/search?media_type=video&q=${encodeURIComponent(query)}`)).collection?.items ?? [];
  for (const it of items.slice(0, 8)) {
    const files = await json(it.href);
    const mp4 = files.find((f) => /~medium\.mp4$/i.test(f)) ?? files.find((f) => /~orig\.mp4$/i.test(f)) ?? files.find((f) => /\.mp4$/i.test(f));
    if (mp4) return {url: mp4.replace('http://', 'https://'), credito: `NASA (dominio público) — ${it.data?.[0]?.title ?? ''} — https://images.nasa.gov/details/${it.data?.[0]?.nasa_id}`};
  }
}

async function wikimedia() {
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: '15', gsrsearch: `${query} filetype:video`, prop: 'videoinfo', viprop: 'derivatives|url|size|extmetadata'}).forEach(([k, v]) => api.searchParams.set(k, v));
  const pages = Object.values((await json(api)).query?.pages ?? {});
  const OK = /^(cc0|public domain|pd|cc[- ]by(-sa)?[- ]\d)/i;
  for (const p of pages) {
    const v = p.videoinfo?.[0];
    if (!v || !OK.test(v.extmetadata?.LicenseShortName?.value ?? '')) continue;
    const d = (v.derivatives ?? []).filter((x) => /mp4|webm/.test(x.type)).sort((a, b) => b.width - a.width)[0];
    const url = d?.src ?? v.url;
    return {url, credito: `${v.extmetadata.LicenseShortName.value} — ${(v.extmetadata.Artist?.value ?? '').replace(/<[^>]+>/g, '')} — ${v.descriptionurl}`};
  }
}

const sources = {pixabay, coverr, nasa, wikimedia};
let pick;
for (const [n, f] of Object.entries(sources)) {
  if (only && only !== n) continue;
  pick = await f().catch(() => null);
  if (pick) break;
}
if (!pick) throw new Error('sin resultados con licencia libre; prueba otra consulta (en inglés rinde más)');

mkdirSync('public/video', {recursive: true});
const tmp = `public/video/.tmp-${Date.now()}`;
writeFileSync(tmp, Buffer.from(await (await fetch(pick.url, {headers: UA})).arrayBuffer()));
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', tmp, '-t', secs, '-an', '-vf', 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', `public/video/${out}`]);
unlinkSync(tmp);
appendFileSync('public/video/CREDITS.md', `- ${out}: ${pick.credito}\n`);
console.log(`${out}: ${pick.credito}`);
