// Build-ideju elorenderelés belepopontja. Csak a scripts/prerender.mjs hasznalja,
// a bongeszobe nem kerul be.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { HeadContext } from "./components/Seo";
import { headTags, type Meta } from "./lib/seo";
import { videos, SERIES, TOPICS, bySeries, byTopic } from "./data/videos";

export { SITE, SITE_NAME, videoPath } from "./lib/seo";
export { videos, SERIES, TOPICS, bySeries, byTopic };
export { rows } from "./data/rows";

/** Minden utvonal, amibol statikus HTML lesz. A /kereses szandekosan nincs benne. */
export function routes(): string[] {
  return [
    "/",
    "/shorts",
    "/kerdoiv",
    ...Object.keys(SERIES).filter((s) => bySeries(s).length).map((s) => `/sorozat/${s}`),
    ...Object.keys(TOPICS).filter((t) => byTopic(t).length).map((t) => `/tema/${t}`),
    ...videos.map((v) => `/video/${v.slug}`),
  ];
}

export function render(url: string) {
  const ctx: { meta?: Meta } = {};
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={ctx}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>
  );
  return { html, head: ctx.meta ? headTags(ctx.meta) : "", meta: ctx.meta };
}
