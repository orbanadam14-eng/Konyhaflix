// YouTube IFrame Player API betoltese es egy vekony burok kore.
// Ezen mulik minden: csak igy tudjuk erzekelni, mikor er veget a video,
// es csak igy tudjuk MI eldonteni, mi jon utana.

/* eslint-disable @typescript-eslint/no-explicit-any */
let loading: Promise<any> | null = null;

export function loadYT(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const w = window as any;
  if (w.YT && w.YT.Player) return Promise.resolve(w.YT);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(w.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return loading;
}

// ---- Lejatszo-nyilvantartas ----
// Egyszerre egy lejatszo adhat hangot. A fo lejatszok (videooldal / modal) es a
// hero hatter a kozos listaban vannak; aki hangot kap, a tobbit megallitja.
// A hero kulon figyeli, van-e fo lejatszo: amig van, nem jatszik.
const reg = new Set<any>();
const mains = new Set<any>();
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

/** Biztonsagos hivas: a lejatszo metodusai csak onReady utan leteznek. */
export function safe(p: any, fn: string, ...args: any[]) {
  try {
    if (p && typeof p[fn] === "function") return p[fn](...args);
  } catch {
    /* ures */
  }
  return undefined;
}

export function registerPlayer(p: any, main: boolean) {
  reg.add(p);
  if (main) {
    mains.add(p);
    notify();
  }
}

export function unregisterPlayer(p: any) {
  reg.delete(p);
  if (mains.delete(p)) notify();
}

/** Aki elindul, megkapja a hangot: a tobbi regisztralt lejatszo megall. */
export function claimAudio(p: any) {
  reg.forEach((o) => {
    if (o !== p) safe(o, "pauseVideo");
  });
}

export const hasMainPlayer = () => mains.size > 0;

/** A hero ide iratkozik fel: akkor hivodik, ha fo lejatszo jott vagy ment. */
export function onMainChange(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

/** Lejatszo leallitasa es lebontasa, onReady elotti allapotban is hibatlanul. */
export function teardownPlayer(p: any) {
  if (!p) return;
  safe(p, "pauseVideo");
  safe(p, "stopVideo");
  safe(p, "destroy");
  unregisterPlayer(p);
}

/** Volt-e mar hang ebben az ulesben (felhasznaloi erintes vagy sikeres hangos inditas). */
export const sound = { on: false };

export const PLAYER_VARS = {
  autoplay: 1,
  // 2018 ota a rel=0 nem tunteti el a kapcsolodo videokat, hanem
  // a sajat csatornara korlatozza oket. Nekunk pont ez kell.
  rel: 0,
  playsinline: 1,
  enablejsapi: 1,
  iv_load_policy: 3,
  // modestbranding: 2023 augusztusa ota nincs hatasa, ezert nincs itt.
};

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const thumbHi = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

export const fmt = (s?: number) => {
  if (!s) return "";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m >= 60 ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
};
