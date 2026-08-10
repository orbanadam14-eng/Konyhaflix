// Hol tart a nezo az egyes videokban. Bongeszoben tarolva, regisztracio nelkul.
const KEY = "kf_progress";

export interface Prog {
  t: number; // masodperc
  d: number; // teljes hossz
  ts: number; // mikor
}

type Store = Record<string, Prog>;

const read = (): Store => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

export const getProgress = (id: string): Prog | undefined => read()[id];

export function setProgress(id: string, t: number, d: number) {
  if (!d || t < 3) return;
  const s = read();
  s[id] = { t: Math.floor(t), d: Math.floor(d), ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(s));
}

export const percent = (id: string) => {
  const p = getProgress(id);
  return p && p.d ? Math.min(100, (p.t / p.d) * 100) : 0;
};

/** 10 es 90 szazalek kozott ajanljuk fel a folytatast. */
export const resumeAt = (id: string) => {
  const p = getProgress(id);
  if (!p || !p.d) return 0;
  const r = p.t / p.d;
  return r > 0.1 && r < 0.9 ? p.t : 0;
};

export const isFinished = (id: string) => percent(id) >= 90;

/** Folytasd, ahol abbahagytad. */
export const continueList = (): string[] =>
  Object.entries(read())
    .filter(([, p]) => p.d && p.t / p.d > 0.05 && p.t / p.d < 0.9)
    .sort((a, b) => b[1].ts - a[1].ts)
    .map(([id]) => id);
