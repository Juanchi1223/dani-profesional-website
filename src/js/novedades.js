// Cliente de solo lectura para el CMS (Sanity). Sin build step: se carga como
// <script type="module">.
export const SANITY_PROJECT_ID = "7785uef4";
export const SANITY_DATASET = "production";
const API_VERSION = "2024-01-01";

const QUERY_LIST = `*[_type=="novedad" && publicado==true] | order(fecha desc) [0...$n] {
  titulo,
  "slug": slug.current,
  tipo,
  fecha,
  resumen,
  fuente,
  url,
  "portada": portada.asset->url
}`;

const QUERY_DETAIL = `*[_type=="novedad" && publicado==true && slug.current==$slug][0] {
  titulo,
  "slug": slug.current,
  tipo,
  fecha,
  resumen,
  fuente,
  url,
  "portada": portada.asset->url,
  cuerpo,
  "adjuntos": adjuntos[]{titulo, "url": file.asset->url}
}`;

function endpoint(query, params) {
  const base = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${SANITY_DATASET}`;
  const usp = new URLSearchParams({ query });
  for (const [k, v] of Object.entries(params || {})) {
    usp.set(`$${k}`, JSON.stringify(v));
  }
  return `${base}?${usp.toString()}`;
}

async function runQuery(query, params) {
  const res = await fetch(endpoint(query, params));
  if (!res.ok) throw new Error(`Sanity respondió ${res.status}`);
  const json = await res.json();
  return json.result;
}

/** Trae hasta `limit` novedades publicadas, más recientes primero. */
export function fetchNovedades(limit) {
  return runQuery(QUERY_LIST, { n: limit });
}

/** Trae una novedad publicada por slug, con cuerpo completo y adjuntos. */
export function fetchNovedad(slug) {
  return runQuery(QUERY_DETAIL, { slug });
}

/** Escapa texto para insertarlo de forma segura dentro de HTML. */
export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

export function formatFecha(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function imgUrl(url, width) {
  if (!url) return "";
  return `${url}?w=${width}&auto=format`;
}

/** Devuelve el HTML de una card de novedad, reutilizando las clases del diseño existente. */
export function renderCard(n) {
  const href = n.tipo === "link" ? n.url : `novedad.html?slug=${encodeURIComponent(n.slug)}`;
  const target = n.tipo === "link" ? ' target="_blank" rel="noopener"' : "";
  const badge = n.tipo === "link" ? (n.fuente || "Fuente externa") : "Nota";
  const cover = n.portada
    ? `<img src="${esc(imgUrl(n.portada, 480))}" alt="" loading="lazy" class="w-full h-40 object-cover border-b border-surface-border">`
    : "";
  return `
    <a href="${esc(href)}"${target} class="flex flex-col border border-surface-border bg-background hover:bg-background-subtle focus-visible:bg-background-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors">
      ${cover}
      <div class="flex flex-col gap-2 p-4">
        <span class="font-label-caps text-label-caps text-on-surface-variant">${esc(badge)} · ${esc(formatFecha(n.fecha))}</span>
        <h3 class="font-headline-md text-headline-md text-primary">${esc(n.titulo)}</h3>
        ${n.resumen ? `<p class="font-body-md text-body-md text-on-surface-variant text-sm">${esc(n.resumen)}</p>` : ""}
        <span class="font-button text-button text-primary uppercase mt-2 inline-flex items-center gap-1">
          ${n.tipo === "link" ? "Ver fuente" : "Leer nota"}
          <span class="material-symbols-outlined text-sm" aria-hidden="true">${n.tipo === "link" ? "open_in_new" : "arrow_forward"}</span>
        </span>
      </div>
    </a>`;
}

export function renderSkeletonCard() {
  return `
    <div class="flex flex-col border border-surface-border bg-background animate-pulse">
      <div class="w-full h-40 bg-surface-container-low"></div>
      <div class="flex flex-col gap-2 p-4">
        <div class="h-3 w-24 bg-surface-container-low"></div>
        <div class="h-5 w-3/4 bg-surface-container-low"></div>
        <div class="h-3 w-full bg-surface-container-low"></div>
      </div>
    </div>`;
}

export function renderError(message) {
  return `<p class="font-body-md text-body-md text-on-surface-variant text-sm col-span-full">${esc(message)}</p>`;
}
