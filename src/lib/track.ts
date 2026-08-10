// Meres es azonositas.
// Az oldal teljesen nyitott. Aki e-mailbol jon, azt felismerjuk a linkben levo
// azonositobol (?c=... vagy ?cid=...). Aki nem, az nevtelen marad.

const CID_KEY = "kf_cid";
const UTM_KEY = "kf_utm";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
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
