/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { loadYT } from "../lib/yt";

/**
 * A hero hattervideoja. A YouTube loop parametere mindig az elejere ugrik vissza,
 * ezert az API-val tartjuk a kivant szakaszban.
 */
export default function HeroVideo({ id, start, seconds = 50 }: { id: string; start: number; seconds?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<any>(null);

  useEffect(() => {
    let dead = false;
    let timer: number | undefined;

    loadYT().then((YT) => {
      if (dead || !host.current || player.current || !YT) return;
      player.current = new YT.Player(host.current, {
        videoId: id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3,
          start,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.seekTo(start, true);
            e.target.playVideo();
          },
        },
      });

      timer = window.setInterval(() => {
        const p = player.current;
        if (!p || !p.getCurrentTime) return;
        const t = p.getCurrentTime();
        if (t < start - 1 || t > start + seconds) p.seekTo(start, true);
      }, 1000);
    });

    return () => {
      dead = true;
      if (timer) clearInterval(timer);
      try {
        if (player.current && player.current.destroy) player.current.destroy();
      } catch {
        /* ures */
      }
      player.current = null;
    };
  }, [id, start, seconds]);

  return (
    <div className="kf-fade-in pointer-events-none absolute left-1/2 top-1/2 h-[160vh] w-[160vw] -translate-x-1/2 -translate-y-1/2">
      <div ref={host} className="h-full w-full" />
    </div>
  );
}
