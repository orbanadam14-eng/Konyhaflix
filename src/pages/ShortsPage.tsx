import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Volume2, VolumeX } from "lucide-react";
import { shorts, TOPICS } from "../data/videos";
import { thumb } from "../lib/yt";
import { track, markWatched } from "../lib/track";
import { reportWatch } from "../lib/ghl";
import Seo from "../components/Seo";

const KEY = "kf_shorts_pos";

/** Fuggoleges, magatol tovabblepo rovidvideo-folyam. A sorrend a mienk, nem a YouTube-e. */
export default function ShortsPage() {
  const list = useMemo(() => {
    const all = [...shorts()].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    // Az elejere a bizonyitottan legerosebbek, utana vegyesen.
    const head = all.slice(0, 8);
    const tail = all.slice(8);
    for (let i = tail.length - 1; i > 0; i--) {
      const j = (i * 7919) % (i + 1); // determinisztikus keveres
      [tail[i], tail[j]] = [tail[j], tail[i]];
    }
    return [...head, ...tail];
  }, []);

  const box = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(() => Number(localStorage.getItem(KEY) || 0));
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    localStorage.setItem(KEY, String(idx));
    const v = list[idx];
    if (v) {
      track("shorts_swipe", { position: idx, video_id: v.id });
      markWatched(v.id);
      reportWatch(v.id, v.title);
    }
  }, [idx, list]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const h = () => setIdx(Math.round(el.scrollTop / el.clientHeight));
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, []);

  const go = (d: 1 | -1) => {
    const el = box.current;
    if (!el) return;
    el.scrollTo({ top: (idx + d) * el.clientHeight, behavior: "smooth" });
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") go(1);
      if (e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  return (
    <>
      <Seo title="Gyors válaszok egy percben" description={`${list.length} rövid videó a konyháról. Egy kérdés, egy válasz.`} />
      <div
        ref={box}
        className="hide-scrollbar h-[100dvh] snap-y snap-mandatory overflow-y-scroll bg-black"
      >
        {list.map((v, i) => {
          const near = Math.abs(i - idx) <= 1; // csak a szomszedokat toltjuk be
          return (
            <section key={v.id} className="relative flex h-[100dvh] snap-start items-center justify-center">
              <div className="relative h-full w-full max-w-[min(56vh,100vw)]">
                {near ? (
                  <iframe
                    title={v.title}
                    src={`https://www.youtube.com/embed/${v.id}?autoplay=${i === idx ? 1 : 0}&mute=${muted ? 1 : 0}&controls=0&rel=0&playsinline=1&loop=1&playlist=${v.id}&iv_load_policy=3`}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; encrypted-media"
                  />
                ) : (
                  <img src={thumb(v.id)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pb-8">
                  <p className="pointer-events-auto mb-2 text-sm font-semibold text-white md:text-base">{v.title}</p>
                  <div className="pointer-events-auto flex flex-wrap gap-2">
                    {v.topics.slice(0, 2).map((t) => (
                      <Link
                        key={t}
                        to={`/tema/${t}`}
                        className="rounded-full border border-white/30 px-2.5 py-0.5 text-[11px] text-white/80"
                      >
                        {TOPICS[t] ?? t}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMuted((m) => !m)}
                className="absolute right-4 top-20 z-20 rounded-full bg-black/60 p-2.5 text-white"
                aria-label={muted ? "Hang be" : "Hang ki"}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </section>
          );
        })}

        <section className="flex h-[100dvh] snap-start flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="text-lg text-white">Ezeket már mind láttad.</p>
          <p className="text-white/60">Nézd meg a hosszabbakat is, ott van a lényeg.</p>
          <Link to="/" className="rounded bg-primary px-6 py-3 font-bold text-white">
            Vissza a kezdőlapra
          </Link>
        </section>
      </div>

      <div className="fixed bottom-6 right-4 z-30 hidden flex-col gap-2 md:flex">
        <button onClick={() => go(-1)} className="rounded-full bg-white/15 p-3 text-white hover:bg-white/25" aria-label="Előző">
          <ChevronUp className="h-5 w-5" />
        </button>
        <button onClick={() => go(1)} className="rounded-full bg-white/15 p-3 text-white hover:bg-white/25" aria-label="Következő">
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
