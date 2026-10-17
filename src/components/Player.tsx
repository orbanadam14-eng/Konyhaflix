/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import { X, Play, RotateCcw, Volume2 } from "lucide-react";
import type { Video } from "../data/videos";
import { loadYT, PLAYER_VARS, thumb, fmt, registerPlayer, unregisterPlayer, teardownPlayer, claimAudio, safe, sound } from "../lib/yt";
import { setProgress, resumeAt } from "../lib/progress";
import { track, markWatched } from "../lib/track";
import { reportWatch } from "../lib/ghl";
import Wordmark from "./Wordmark";

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
  // A Videotar bevezeto csak az elso inditasnal fut le, hogy ne lassitsa a tovabblepest.
  // Effektben dontjuk el, mert az elorenderelt HTML-ben meg nincs sessionStorage.
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("kf_intro")) return;
    sessionStorage.setItem("kf_intro", "1");
    setIntro(true);
  }, []);
  const marks = useRef<Set<number>>(new Set());
  // Hang nelkul indult (a bongeszo letiltotta a hangos automatikus inditast): gomb kell.
  const [needSound, setNeedSound] = useState(false);
  const startTok = useRef(0);
  const blockTimer = useRef<number | null>(null);
  const ready = useRef(false);
  const fallback = useRef<(() => void) | null>(null);
  // Az aktualis video azonositoja az esemenykezelokhoz, es az, amit a lejatszo most tolt.
  const currentId = useRef(video.id);
  const currentTitle = useRef(video.title);
  const loadedId = useRef(video.id);
  const currentSource = useRef(source);
  currentSource.current = source;

  const next = queue[0];
  const alts = queue.slice(1, 4);

  /**
   * Inditas: hangosan probaljuk. Ha a bongeszo nem engedi (a lejatszo nem indul el
   * ~1,2 mp alatt, vagy onAutoplayBlocked), nemitva elinditjuk es kirakjuk a
   * "Hang bekapcsolasa" gombot. Ha mar volt hang az uleseben, a kovetkezo video is hangos.
   */
  const begin = useCallback((p: any) => {
    const tok = ++startTok.current;
    if (blockTimer.current) clearTimeout(blockTimer.current);
    const PS = (window as any).YT?.PlayerState;
    if (sound.on) {
      safe(p, "unMute");
      safe(p, "setVolume", 100);
    }
    safe(p, "playVideo");
    const muteFallback = () => {
      if (tok !== startTok.current) return;
      safe(p, "mute");
      safe(p, "playVideo");
      setNeedSound(true);
    };
    // Toleransabb ellenorzes: -1 / 5 / 3 "meg indul" ~3 mp-ig. Csak akkor nemitunk,
    // ha onAutoplayBlocked jott, vagy 3 mp utan is -1 / 5 az allapot. A hosszu
    // BUFFERING halozati gond, nem bongeszo-tiltas: azt nem nemitjuk.
    const t0 = Date.now();
    const check = () => {
      if (tok !== startTok.current || !PS) return;
      const st = safe(p, "getPlayerState");
      if (st === PS.PLAYING || st === PS.PAUSED || st === PS.ENDED) return;
      const waited = Date.now() - t0;
      if (waited >= 3000 && st !== PS.BUFFERING) {
        muteFallback();
        return;
      }
      if (waited < 60000) blockTimer.current = window.setTimeout(check, 400);
    };
    blockTimer.current = window.setTimeout(check, 400);
    fallback.current = muteFallback;
  }, []);

  /** Hang bekapcsolasa: az erintes felhasznaloi gesztus, ezert az unMute atmegy iOS-en is. */
  const enableSound = () => {
    const p = player.current;
    safe(p, "unMute");
    safe(p, "setVolume", 100);
    sound.on = true;
    setNeedSound(false);
    track("unmute_click", { video_id: currentId.current });
  };

  /** Videocsere a meglevo lejatszoban (egy lejatszo, nincs tobb parhuzamos hang). */
  const loadVideo = useCallback((id: string) => {
    if (loadedId.current === id) return;
    loadedId.current = id;
    // Onready elott a metodus nem letezik: az onReady szinkronizal a loadedId-hez,
    // es az inditas / hang-vizsgalat is csak onReady utan fut.
    if (!ready.current) return;
    // A nemitott allapot atmegy a kovetkezo videora is: a gomb marad, amig nincs hang.
    setNeedSound(!sound.on && !!safe(player.current, "isMuted"));
    safe(player.current, "loadVideoById", id);
    begin(player.current);
  }, [begin]);

  const goTo = useCallback(
    (v: Video, how: string) => {
      setEnded(false);
      setCancelled(false);
      setCount(COUNTDOWN);
      setResume(0);
      marks.current = new Set();
      track("video_next", { from_video: video.id, to_video: v.id, how });
      loadVideo(v.id);
      onChange(v);
    },
    [video.id, onChange, loadVideo]
  );

  // Lejatszo letrehozasa egyszer, utana csak videot cserelunk.
  useEffect(() => {
    let dead = false;
    // Jelzo: a hero mar a lejatszo API betoltese elott megalljon, ne csak utana.
    const token = {};
    registerPlayer(token, true);
    loadYT().then((YT) => {
      if (dead || !host.current || player.current) return;
      loadedId.current = currentId.current;
      const createdId = loadedId.current;
      const inst = new YT.Player(host.current, {
        videoId: currentId.current,
        playerVars: PLAYER_VARS,
        events: {
          onReady: (e: any) => {
            if (dead) return;
            ready.current = true;
            // Ha onReady elott mas videora valtottunk, most vegre azt toltjuk be.
            if (loadedId.current !== createdId) {
              setResume(0);
              safe(e.target, "loadVideoById", loadedId.current);
              begin(e.target);
              return;
            }
            const r = resumeAt(loadedId.current);
            if (r) {
              setResume(r);
              e.target.seekTo(r, true);
            }
            begin(e.target);
          },
          onAutoplayBlocked: () => {
            if (!dead) fallback.current?.();
          },
          onStateChange: (e: any) => {
            if (dead) return;
            const YTP = (window as any).YT.PlayerState;
            if (e.data === YTP.PLAYING) {
              claimAudio(inst);
              const muted = !!safe(inst, "isMuted");
              if (!muted) sound.on = true;
              setNeedSound(muted);
            }
            if (e.data === YTP.ENDED) {
              markWatched(currentId.current);
              track("video_complete", { video_id: currentId.current });
              reportWatch(currentId.current, currentTitle.current);
              setEnded(true);
            }
          },
        },
      });
      player.current = inst;
      registerPlayer(inst, false);
    });
    return () => {
      dead = true;
      unregisterPlayer(token);
      startTok.current++;
      if (blockTimer.current) clearTimeout(blockTimer.current);
      teardownPlayer(player.current);
      player.current = null;
      ready.current = false;
    };
    // szandekosan ures: a lejatszo egyszer jon letre (a begin stabil)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    currentId.current = video.id;
    currentTitle.current = video.title;
    marks.current = new Set();
    // Kulso valtas (pl. ajanlott kartya, vissza gomb): a lejatszo is kovesse az oldalt.
    if (loadedId.current !== video.id) {
      setEnded(false);
      setCancelled(false);
      setCount(COUNTDOWN);
      setResume(0);
      loadVideo(video.id);
    }
    // A source a navigacioval egyutt valtozik, de egy rendernyivel a video elott: ezert
    // ref-bol olvassuk, es csak video-valtasra tuzelunk (egyszer videonkent).
    track("video_start", { video_id: video.id, video_title: video.title, source: currentSource.current });
  }, [video.id, video.title, loadVideo]);

  // Haladas mentese es negyedelesi esemenyek.
  useEffect(() => {
    saveTimer.current = window.setInterval(() => {
      const p = player.current;
      if (!p?.getCurrentTime) return;
      if (p.isMuted && !p.isMuted()) setNeedSound(false);
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
      <div className={vertical ? "relative mx-auto aspect-[9/16] h-[min(85vh,177vw)] max-w-full" : "relative aspect-video w-full"}>
        <div ref={host} className="absolute inset-0 h-full w-full" />

        {intro && (
          <div
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-black kf-intro"
            onAnimationEnd={() => setIntro(false)}
          >
            <Wordmark size="lg" className="kf-intro-word" />
          </div>
        )}

        {needSound && !ended && (
          <button
            onClick={enableSound}
            aria-label="Hang bekapcsolása"
            className="absolute left-3 top-3 z-30 flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-3 text-base font-bold text-primary-foreground shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Volume2 className="h-5 w-5" aria-hidden="true" /> Hang bekapcsolása
          </button>
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
              className="font-semibold text-accent underline"
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
