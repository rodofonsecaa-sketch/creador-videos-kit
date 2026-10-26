// Descarga una foto libre SIN llave API: Openverse (CC0/PD/CC BY), Pixabay (con llave) y, si no hay, Wikimedia Commons.
// Uso: node scripts/stock.mjs "consulta" salida.jpg   -> public/img/salida.jpg (+ public/img/CREDITS.md)
import {appendFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const [query, out] = process.argv.slice(2);
if (!query || !out) throw new Error('uso: node scripts/stock.mjs "consulta" salida.jpg');
const UA = {'User-Agent': 'Videos-Remotion/1.0 (uso personal)'};

const env = (k) => {
  if (process.env[k]) return process.env[k];
  try {
    return readFileSync('.env.local', 'utf8').match(new RegExp(`^${k}=(.+)$`, 'm'))?.[1].trim();
  } catch {}
};

// Unsplash (llave gratis en .env.local): fotos de alta calidad; exige avisar la descarga y dar crédito.
async function unsplash() {
  const key = env('UNSPLASH_KEY');
  if (!key) return;
  const H = {Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1'};
  const u = new URL('https://api.unsplash.com/search/photos');
  Object.entries({query, orientation: 'landscape', per_page: '10', content_filter: 'high'}).forEach(([k, v]) => u.searchParams.set(k, v));
  const p = ((await (await fetch(u, {headers: H})).json()).results ?? []).find((x) => x.width >= 2000);
  if (!p) return;
  fetch(p.links.download_location, {headers: H}).catch(() => {});
  return {url: `${p.urls.raw}&w=2400&q=80&fm=jpg`, credito: `Unsplash — ${p.user.name} (${p.user.links.html}) — ${p.links.html}`};
}

async function openverse() {
  const u = new URL('https://api.openverse.org/v1/images/');
  Object.entries({q: query, license: 'cc0,pdm,by', size: 'large', page_size: '20', aspect_ratio: 'wide'}).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = (await (await fetch(u, {headers: UA})).json()).results ?? [];
  const p = r.find((x) => x.width >= 1600 && /jpe?g|png/i.test(x.url));
  return p && {url: p.url, credito: `${p.license.toUpperCase()} ${p.license_version ?? ''} — ${p.creator ?? 's/a'} — ${p.foreign_landing_url}`};
}

// Pixabay (llave gratis en variable PIXABAY_API_KEY): licencia Pixabay, uso comercial; la API entrega hasta 1280 px (subir con scripts/upscale.mjs si hace falta).
async function pixabay() {
  const key = env('PIXABAY_API_KEY');
  if (!key) return;
  const u = new URL('https://pixabay.com/api/');
  Object.entries({key, q: query, image_type: 'photo', orientation: 'horizontal', min_width: '1600', per_page: '10', safesearch: 'true'}).forEach(([k, v]) => u.searchParams.set(k, v));
  const p = ((await (await fetch(u, {headers: UA})).json()).hits ?? [])[0];
  return p && {url: p.largeImageURL, credito: `Pixabay License — ${p.user} — ${p.pageURL}`};
}

async function wikimedia() {
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: '20', gsrsearch: `${query} filetype:bitmap`, prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1920'}).forEach(([k, v]) => api.searchParams.set(k, v));
  const pages = Object.values((await (await fetch(api, {headers: UA})).json()).query?.pages ?? {});
  const OK = /^(cc0|public domain|pd|cc[- ]by(-sa)?[- ]\d)/i;
  const i = pages.map((p) => p.imageinfo?.[0]).find((x) => x && x.width >= 1600 && OK.test(x.extmetadata?.LicenseShortName?.value ?? ''));
  return i && {url: i.thumburl ?? i.url, credito: `${i.extmetadata.LicenseShortName.value} — ${(i.extmetadata.Artist?.value ?? '').replace(/<[^>]+>/g, '')} — ${i.descriptionurl}`};
}

const pick = (await unsplash().catch(() => null)) ?? (await openverse().catch(() => null)) ?? (await pixabay().catch(() => null)) ?? (await wikimedia().catch(() => null));
if (!pick) throw new Error('sin resultados con licencia libre; prueba otra consulta');
const img = await fetch(pick.url, {headers: UA});
mkdirSync('public/img', {recursive: true});
writeFileSync(`public/img/${out}`, Buffer.from(await img.arrayBuffer()));
appendFileSync('public/img/CREDITS.md', `- ${out}: ${pick.credito}\n`);
console.log(`${out}: ${pick.credito}`);
