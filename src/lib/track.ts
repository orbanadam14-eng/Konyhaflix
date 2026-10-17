// Meres es azonositas.
// Az oldal teljesen nyitott. Aki e-mailbol jon, azt felismerjuk a linkben levo
// azonositobol (?c=... vagy ?cid=...). Aki nem, az nevtelen marad.

const CID_KEY = "kf_cid";
const UTM_KEY = "kf_utm";

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    __kfLive?: boolean;
  }
}

/**
 * A belso esemenyek Meta-megfeleloi.
 * A "standard" a Meta sajat esemenyneve (track), a "custom" sajat nev (trackCustom).
 * A Video75 a legfontosabb: ebbol epul a retargeting kozonseg.
 */
const META_EVENTS: Record<string, { name: string; standard: boolean }> = {
  page_view: { name: "PageView", standard: true },
  video_start: { name: "ViewContent", standard: true },
  video_25: { name: "Video25", standard: false },
  video_50: { name: "Video50", standard: false },
  video_75: { name: "Video75", standard: false },
  video_complete: { name: "VideoComplete", standard: false },
  video_complete_unique: { name: "VideoUnique", standard: false },
  cta_click: { name: "Schedule", standard: true },
  email_signup: { name: "Lead", standard: true },
};

/** A Meta pixel csak a szamara ertelmes mezoket kapja meg. */
function metaPayload(event: string, data: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  if (data.video_title) out.content_name = data.video_title;
  if (data.video_id) out.content_ids = [data.video_id];
  if (event.startsWith("video")) out.content_type = "video";
  if (data.place) out.content_name = out.content_name || `kf-${data.place}`;
  if (typeof data.total_watched === "number") out.value = data.total_watched;
  return out;
}

function sendToMeta(event: string, data: Record<string, unknown>) {
  const map = META_EVENTS[event];
  if (!map || typeof window.fbq !== "function") return;
  try {
    window.fbq(map.standard ? "track" : "trackCustom", map.name, metaPayload(event, data));
  } catch {
    // A meres soha ne allitsa meg a nezest.
  }
}

/**
 * GA4: minden belso esemeny megy, a sajat nevevel (snake_case).
 * Csak egyszeru (string/szam/bool) ertek megy ki. A contact_id szandekosan
 * nem: belso GHL azonosito, GA4-ben nincs helye.
 */
function ga4Params(event: string, data: Record<string, unknown>) {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === "contact_id" || k === "path") continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") out[k] = v;
  }
  if (event === "page_view") {
    out.page_path = typeof data.path === "string" ? data.path : window.location.pathname + window.location.search;
    out.page_location = window.location.href;
    out.page_title = document.title;
  } else if (typeof data.path === "string") {
    out.path = data.path;
  }
  return out;
}

function sendToGA(event: string, data: Record<string, unknown>) {
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, ga4Params(event, data));
  } catch {
    // A meres soha ne allitsa meg a nezest.
  }
}

export function initTracking() {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  const cid = p.get("c") || p.get("cid") || p.get("contact_id");
  if (cid) localStorage.setItem(CID_KEY, cid);
  if (window.location.search.length > 1) localStorage.setItem(UTM_KEY, window.location.search);
}

export const contactId = () => (typeof window === "undefined" ? null : localStorage.getItem(CID_KEY));
export const savedUtm = () => (typeof window === "undefined" ? "" : localStorage.getItem(UTM_KEY) || "");

/** A kimeno linkekre visszatesszuk az eredeti UTM-eket es az azonositot. */
export function outbound(url: string) {
  const q = savedUtm();
  if (!q) return url;
  return url + (url.includes("?") ? "&" : "?") + q.substring(1);
}

export function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, contact_id: contactId(), ...data });
  sendToMeta(event, data);
  sendToGA(event, data);
}

// Hany videot nezett meg ebben az ulesben, es osszesen.
const SEEN = "kf_seen";
export function markWatched(id: string) {
  const s = new Set<string>(JSON.parse(localStorage.getItem(SEEN) || "[]"));
  const isNew = !s.has(id);
  s.add(id);
  localStorage.setItem(SEEN, JSON.stringify([...s]));
  if (isNew) track("video_complete_unique", { video_id: id, total_watched: s.size });
  return s.size;
}
export const watchedIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(SEEN) || "[]");
  } catch {
    return [];
  }
};
