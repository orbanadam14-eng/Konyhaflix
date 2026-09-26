// Build-ideju elorenderelés. A vite build utan fut:
// 1. minden utvonalhoz statikus HTML a dist-be (video/<slug>.html stb.), benne a teljes tartalommal es fejleccel,
// 2. spa.html: ures vaz a nem elorenderelt utvonalaknak (pl. /kereses), a vercel.json erre esik vissza,
// 3. sitemap.xml es llms.txt ugyanabbol az adatbol.
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
// Masik mappa is megadhato (pl. hidratalasi teszthez fejlesztoi builddel): node scripts/prerender.mjs <mappa>
const dist = path.resolve(root, process.argv[2] ?? "dist");
const entry = path.join(root, "dist-ssr", "entry-server.js");

const ssr = await import(pathToFileURL(entry).href);
const { render, routes, videos, SERIES, TOPICS, bySeries, byTopic, rows, SITE, SITE_NAME, videoPath } = ssr;

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
const ROOT_DIV = '<div id="root"></div>';
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error("prerender: az index.html-bol hianyzik a seo:start/seo:end blokk vagy az ures #root.");
}

// A fallback az eredeti vaz marad, mielott az index.html-t felulirnank a kezdolappal.
await fs.writeFile(path.join(dist, "spa.html"), template);

const indexable = [];
let count = 0;
for (const url of routes()) {
  const { html, head, meta } = render(url);
  if (!head || !html) throw new Error(`prerender: ures oldal vagy hianyzo Seo: ${url}`);
  if (/konyhaflix/i.test(head)) throw new Error(`prerender: KonyhaFlix maradt a fejlecben: ${url}`);

  const page = template.replace(SEO_BLOCK, head).replace(ROOT_DIV, `<div id="root">${html}</div>`);
  const file = url === "/" ? "index.html" : `${url.slice(1)}.html`;
  await fs.mkdir(path.dirname(path.join(dist, file)), { recursive: true });
  await fs.writeFile(path.join(dist, file), page);
  if (!meta.noindex) indexable.push(url);
  count++;
}

// sitemap.xml: csak az indexelheto oldalak. Datum nincs, mert nincs megbizhato modositasi idonk.
const xmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  indexable.map((u) => `  <url><loc>${xmlEsc(SITE + u)}</loc></url>`).join("\n") +
  "\n</urlset>\n";
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);

// llms.txt (llmstxt.org): rovid leiras es a fo belepesi pontok.
const md = (s) => s.replace(/([[\]])/g, "\\$1");
const blurb = (href) => rows.find((r) => r.href === href)?.description;
const seriesLines = Object.keys(SERIES)
  .filter((s) => bySeries(s).length)
  .map((s) => {
    const href = `/sorozat/${s}`;
    const d = blurb(href);
    return `- [${md(SERIES[s])}](${SITE}${href}): ${bySeries(s).length} rész.${d ? ` ${d}` : ""}`;
  });
const topicLines = Object.keys(TOPICS)
  .filter((t) => byTopic(t).length)
  .map((t) => `- [${md(TOPICS[t])}](${SITE}/tema/${t}): ${byTopic(t).length} videó.`);
const popular = [...videos]
  .filter((v) => v.type === "long")
  .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  .slice(0, 10)
  .map((v) => `- [${md(v.title)}](${SITE}${videoPath(v)})`);

const llms = `# ${SITE_NAME}

> A Konyhaszakértő budaörsi konyhatervező és kivitelező cég, 1994 óta. A Videótár ${videos.length} ingyenes, magyar nyelvű videója arról szól, hogyan lesz jó egy konyha: tervezés, gépek, méretek, tárolás, világítás, átalakítások előtte és utána, és a hibák, amiket a legtöbben elkövetnek.

Minden videó saját oldalon van, cím, sorozat és téma szerint. A videók a Konyhaszakértő YouTube-csatornájáról jönnek. Bemutatóterem: 2040 Budaörs, Károly király út 86. Telefon: 06 70 622 0270.

## Sorozatok

${seriesLines.join("\n")}

## Témák

${topicLines.join("\n")}

## Népszerű videók

${popular.join("\n")}

## Továbbiak

- [Rövid videók](${SITE}/shorts): ${videos.filter((v) => v.type === "short").length} rövid, egyperces válasz.
- [Konyhatúra időpont](https://konyhatura.konyhaszakerto.hu): fél óra a budaörsi bemutatóteremben.
- [Konyhaszakértő weboldal](https://konyhaszakerto.hu)
- [YouTube-csatorna](https://www.youtube.com/@konyhaszakerto)
- [Oldaltérkép](${SITE}/sitemap.xml)
`;
if (llms.includes("\u2014")) throw new Error("prerender: hosszu gondolatjel az llms.txt-ben");
await fs.writeFile(path.join(dist, "llms.txt"), llms);

console.log(`prerender: ${count} oldal, ${indexable.length} a sitemapben, spa.html, llms.txt kesz.`);
