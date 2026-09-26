// Kereso- es AI-barat fejlec: cim, leiras, canonical, og, JSON-LD.
// Ugyanez fut a build-ideju elorenderelesben (headTags) es a bongeszoben is (applyHead),
// igy a botok es a nezok ugyanazt latjak.
import { SERIES, TOPICS, episodeLabel, type Video } from "../data/videos";

export const SITE = "https://videotar.konyhaszakerto.hu";
export const SITE_NAME = "Konyhaszakértő Videótár";
export const DEFAULT_IMAGE = `${SITE}/og.png`;
export const YT_CHANNEL = "https://www.youtube.com/@konyhaszakerto";
const ORG_ID = "https://konyhaszakerto.hu/#organization";
const WEBSITE_ID = `${SITE}/#website`;

export interface Crumb {
  name: string;
  path: string;
}

export interface Meta {
  title: string; // utotag nelkul, azt a fullTitle teszi hozza
  description?: string;
  path: string; // "/" vagy "/video/..."
  image?: string;
  type?: "website" | "video.other";
  noindex?: boolean;
  crumbs?: Crumb[]; // a kezdolap utani morzsak
  ld?: object[]; // tovabbi JSON-LD csomopontok
}

export const abs = (path: string) => SITE + path;
export const fullTitle = (t: string) => `${t} | ${SITE_NAME}`;
export const videoPath = (v: Video) => `/video/${v.slug}`;

/** Helyorzo cimu videok: amig nincs igazi cimuk, ne keruljenek a keresobe duplikatumkent. */
export const isUntitled = (v: Video) => v.title.startsWith("(cím nélküli");

/** A maxres kep a regi SD es a rovid videoknal gyakran hianyzik, ott a hq biztos. */
export const videoImage = (v: Video) =>
  `https://i.ytimg.com/vi/${v.id}/${v.type === "short" || v.vintage ? "hqdefault" : "maxresdefault"}.jpg`;

export function isoDuration(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${r || (!h && !m) ? `${r}S` : ""}`;
}

/** Leiras a videorol. Ha nincs sajat leiras, a sorozatbol es a temakbol rakjuk ossze. */
export function videoSummary(v: Video) {
  if (v.description) return v.description;
  // A cimet nem ismeteljuk, az a talalati listaban ugyis ott van.
  const parts = [v.type === "short" ? "Rövid videó a Konyhaszakértőtől." : "Videó a Konyhaszakértőtől."];
  if (v.series && SERIES[v.series]) {
    const ep = episodeLabel(v);
    parts.push(`Sorozat: ${SERIES[v.series]}${ep ? `, ${ep}` : ""}.`);
  }
  const topics = v.topics.map((x) => TOPICS[x]).filter(Boolean);
  if (topics.length) parts.push(`${topics.length > 1 ? "Témák" : "Téma"}: ${topics.join(", ")}.`);
  parts.push("Konyhatervezés és kivitelezés Budaörsön, 1994 óta.");
  return parts.join(" ");
}

export function videoLd(v: Video): object {
  const hq = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  const img = videoImage(v);
  return {
    "@type": "VideoObject",
    "@id": `${abs(videoPath(v))}#video`,
    name: v.title,
    description: videoSummary(v),
    thumbnailUrl: img === hq ? [hq] : [img, hq],
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    ...(v.duration > 0 ? { duration: isoDuration(v.duration) } : {}),
    inLanguage: "hu",
    url: abs(videoPath(v)),
    publisher: { "@id": ORG_ID },
  };
}

export function itemListLd(name: string, items: Video[]): object {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(videoPath(v)),
      name: v.title,
    })),
  };
}

export const organizationLd: object = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Konyhaszakértő",
  url: "https://konyhaszakerto.hu",
  sameAs: [YT_CHANNEL],
  foundingDate: "1994",
  telephone: "+36706220270",
  email: "erdeklodes@konyhaszakerto.hu",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Károly király út 86.",
    postalCode: "2040",
    addressLocality: "Budaörs",
    addressCountry: "HU",
  },
};

export const websiteLd: object = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE}/`,
  name: SITE_NAME,
  inLanguage: "hu",
  publisher: { "@id": ORG_ID },
};

function breadcrumbLd(crumbs: Crumb[]): object {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** Minden oldalon: morzsa, plusz amit az oldal meg hozzatesz. A kiado mindig hivatkozhato. */
export function jsonLd(m: Meta): object {
  const crumbs = [{ name: "Videótár", path: "/" }, ...(m.crumbs ?? [])];
  const extra = m.ld ?? [];
  const hasOrg = extra.some((n) => (n as { "@type"?: string })["@type"] === "Organization");
  return {
    "@context": "https://schema.org",
    "@graph": [breadcrumbLd(crumbs), ...extra, ...(hasOrg ? [] : [organizationLd])],
  };
}

interface Tag {
  sel: string; // a kliens ez alapjan keresi meg
  tag: "meta" | "link";
  attrs: Record<string, string>;
}

function tags(m: Meta): Tag[] {
  const title = fullTitle(m.title);
  const url = abs(m.path);
  const image = m.image ?? DEFAULT_IMAGE;
  const list: [string, string, string][] = [
    ["name", "description", m.description ?? ""],
    ["property", "og:site_name", SITE_NAME],
    ["property", "og:locale", "hu_HU"],
    ["property", "og:type", m.type ?? "website"],
    ["property", "og:url", url],
    ["property", "og:title", title],
    ["property", "og:description", m.description ?? ""],
    ["property", "og:image", image],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", m.description ?? ""],
    ["name", "twitter:image", image],
  ];
  const out: Tag[] = list
    .filter(([, , v]) => v)
    .map(([k, n, v]) => ({ sel: `meta[${k}="${n}"]`, tag: "meta", attrs: { [k]: n, content: v } }));
  out.push({ sel: 'link[rel="canonical"]', tag: "link", attrs: { rel: "canonical", href: url } });
  if (m.noindex) out.push({ sel: 'meta[name="robots"]', tag: "meta", attrs: { name: "robots", content: "noindex, follow" } });
  return out;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A <script> blokkbol ne lehessen kitorni. */
const ldString = (m: Meta) => JSON.stringify(jsonLd(m)).replace(/</g, "\\u003c");

/** Build-idoben: a teljes kezelt fejlec HTML-kent. */
export function headTags(m: Meta) {
  const lines = [`<title>${esc(fullTitle(m.title))}</title>`];
  for (const t of tags(m)) {
    const a = Object.entries(t.attrs)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(" ");
    lines.push(`<${t.tag} ${a} />`);
  }
  lines.push(`<script type="application/ld+json" id="kf-ld">${ldString(m)}</script>`);
  return lines.join("\n    ");
}

/** Bongeszoben: oldalvaltaskor ugyanezeket a tageket frissitjuk. */
export function applyHead(m: Meta) {
  document.title = fullTitle(m.title);
  const want = tags(m);
  for (const t of want) {
    let el = document.head.querySelector(t.sel);
    if (!el) {
      el = document.createElement(t.tag);
      document.head.appendChild(el);
    }
    for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
  }
  if (!m.noindex) document.head.querySelector('meta[name="robots"]')?.remove();
  // Ahol nincs leiras, ne maradjon ott az elozo oldale.
  if (!m.description)
    ["name=\"description\"", "property=\"og:description\"", "name=\"twitter:description\""].forEach((s) =>
      document.head.querySelector(`meta[${s}]`)?.remove()
    );

  let ld = document.getElementById("kf-ld") as HTMLScriptElement | null;
  if (!ld) {
    ld = document.createElement("script");
    ld.id = "kf-ld";
    ld.type = "application/ld+json";
    document.head.appendChild(ld);
  }
  ld.textContent = JSON.stringify(jsonLd(m));
}
