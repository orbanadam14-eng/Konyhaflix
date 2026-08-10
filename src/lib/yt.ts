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
