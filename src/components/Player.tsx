/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import { X, Play, RotateCcw } from "lucide-react";
import type { Video } from "../data/videos";
import { loadYT, PLAYER_VARS, thumb, fmt } from "../lib/yt";
import { setProgress, resumeAt } from "../lib/progress";
import { track, markWatched } from "../lib/track";
import { reportWatch } from "../lib/ghl";
import { LOGO_KONYHAFLIX } from "../lib/brand";

const COUNTDOWN = 8;

interface Props {
  video: Video;
  queue: Video[];
  source: string;              // honnan indult: sor azonosito, kereses, kozvetlen link
  vertical?: boolean;
  onChange: (v: Video) => void; // ha atvaltunk masik videora
  onClose?: () => void;
}

export default function Player({ video, queue, source, vertical, onChange, onClose }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<any>(null);
  const saveTimer = useRef<number | null>(null);
  const [ended, setEnded] = useState(false);
  const [count, setCount] = useState(COUNTDOWN);
  const [cancelled, setCancelled] = useState(false);
  const [resume, setResume] = useState(0);
  // A KonyhaFlix bevezeto csak az elso inditasnal fut le, hogy ne lassitsa a tovabblepest.
  const [intro, setIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    if (sessionStorage.getItem("kf_intro")) return false;
    sessionStorage.setItem("kf_intro", "1");
    return true;
  });
  const marks = useRef<Set<number>>(new Set());

  const next = queue[0];
  const alts = queue.slice(1, 4);

  const goTo = useCallback(
    (v: Video, how: string) => {
      setEnded(false);
      setCancelled(false);
      setCount(COUNTDOWN);
      marks.current = new Set();
      track("video_next", { from_video: video.id, to_video: v.id, how });
      if (player.current?.loadVideoById) player.current.loadVideoById(v.id);
      onChange(v);
    },
    [video.id, onChange]
  );

  // Lejatszo letrehozasa egyszer, utana csak videot cserelunk.
  useEffect(() => {
    let dead = false;
    loadYT().then((YT) => {
      if (dead || !host.current || player.current) return;
      player.current = new YT.Player(host.current, {
        videoId: video.id,
        playerVars: PLAYER_VARS,
        events: {
          onReady: (e: any) => {
            const r = resumeAt(video.id);
            if (r) {
              setResume(r);
              e.target.seekTo(r, true);
            }
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            const YTP = (window as any).YT.PlayerState;
            if (e.data === YTP.ENDED) {
              markWatched(currentId.current);
              track("video_complete", { video_id: currentId.current });
              reportWatch(currentId.current, currentTitle.current);
              setEnded(true);
            }
          },
        },
      });
    });
    return () => {
      dead = true;
      try {
        player.current?.destroy?.();
      } catch { /* ures */ }
      player.current = null;
    };
    // szandekosan ures: a lejatszo egyszer jon letre
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Az aktualis video azonositoja az esemenykezelokhoz.
  const currentId = useRef(video.id);
  const currentTitle = useRef(video.title);
  useEffect(() => {
    currentId.current = video.id;
    currentTitle.current = video.title;
    marks.current = new Set();
    track("video_start", { video_id: video.id, video_title: video.title, source });
  }, [video.id, video.title, source]);

  // Haladas mentese es negyedelesi esemenyek.
  useEffect(() => {
    saveTimer.current = window.setInterval(() => {
      const p = player.current;
      if (!p?.getCurrentTime) return;
      const t = p.getCurrentTime();
      const d = p.getDuration();
      if (!d) return;
      setProgress(currentId.current, t, d);
      const pct = (t / d) * 100;
      [25, 50, 75].forEach((m) => {
        if (pct >= m && !marks.current.has(m)) {
          marks.current.add(m);
          track(`video_${m}`, { video_id: currentId.current });
        }
      });
    }, 5000);
    return () => {
      if (saveTimer.current) clearInterval(saveTimer.current);
    };
  }, []);

  // Visszaszamlalas a vegen.
  useEffect(() => {
    if (!ended || cancelled || !next) return;
    if (count <= 0) {
      goTo(next, "autoplay");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [ended, cancelled, count, next, goTo]);

  return (
    <div className="relative w-full bg-black">
      <div className={vertical ? "relative aspect-[9/16] w-full" : "relative aspect-video w-full"}>
        <div ref={host} className="absolute inset-0 h-full w-full" />

        {intro && (
          <div
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-black kf-intro"
            onAnimationEnd={() => setIntro(false)}
          >
            <img src={LOGO_KONYHAFLIX} alt="KonyhaFlix" className="kf-intro-word w-2/3 max-w-md object-contain" />
          </div>
        )}

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Bezárás"
            className="absolute right-3 top-3 z-30 rounded-full bg-black/70 p-2 text-white transition hover:bg-black"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {resume > 0 && !ended && (
          <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 rounded bg-black/85 px-4 py-2 text-sm text-white shadow-lg">
            <span className="mr-3">Onnan folytatod, ahol abbahagytad ({fmt(resume)}).</span>
            <button
              className="font-semibold text-primary underline"
              onClick={() => {
                player.current?.seekTo(0, true);
                setResume(0);
                track("resume_rejected", { video_id: video.id });
              }}
            >
              Inkább elölről
            </button>
          </div>
        )}

        {ended && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-black/92 px-4 py-6 text-white">
            {next ? (
              <>
                <p className="text-sm uppercase tracking-widest text-white/60">
                  {cancelled ? "Válassz, mi jöjjön" : `${count} másodperc múlva jön`}
                </p>
                <button
                  onClick={() => goTo(next, "click")}
                  className="group flex w-full max-w-md items-center gap-4 rounded-md bg-white/10 p-3 text-left transition hover:bg-white/20"
                >
                  <div className="relative w-32 shrink-0 overflow-hidden rounded sm:w-40">
                    <img src={thumb(next.id)} alt="" className="aspect-video w-full object-cover" />
                    {!cancelled && (
                      <span
                        className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000 ease-linear"
                        style={{ width: `${((COUNTDOWN - count) / COUNTDOWN) * 100}%` }}
                      />
                    )}
                    <Play className="absolute inset-0 m-auto h-8 w-8 fill-white opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <span className="text-sm font-semibold leading-snug sm:text-base">{next.title}</span>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!cancelled && (
                    <button
                      onClick={() => {
                        setCancelled(true);
                        track("autoplay_cancelled", { video_id: video.id });
                      }}
                      className="rounded border border-white/40 px-4 py-2 text-sm transition hover:border-white"
                    >
                      Mégsem
                    </button>
                  )}
                  <button
                    onClick={() => {
                      player.current?.seekTo(0, true);
                      player.current?.playVideo();
                      setEnded(false);
                      setCount(COUNTDOWN);
                      setCancelled(false);
                    }}
                    className="flex items-center gap-2 rounded border border-white/40 px-4 py-2 text-sm transition hover:border-white"
                  >
                    <RotateCcw className="h-4 w-4" /> Újra
                  </button>
                </div>

                {alts.length > 0 && (
                  <div className="w-full max-w-2xl">
                    <p className="mb-2 text-center text-xs uppercase tracking-widest text-white/50">Vagy inkább ezt</p>
                    <div className="grid grid-cols-3 gap-2">
                      {alts.map((a) => (
                        <button key={a.id} onClick={() => goTo(a, "endcard")} className="text-left">
                          <img src={thumb(a.id)} alt="" className="aspect-video w-full rounded object-cover transition hover:opacity-80" />
                          <span className="mt-1 line-clamp-2 block text-[11px] leading-tight text-white/80">{a.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white/70">Ezt már mind láttad. Nézz körül a kezdőlapon.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
