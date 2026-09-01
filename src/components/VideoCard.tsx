import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Play } from "lucide-react";
import { episodeLabel, type Video } from "../data/videos";
import { thumb, fmt } from "../lib/yt";
import { percent } from "../lib/progress";

interface Props {
  video: Video;
  rowIds?: string[];
  source: string;
  vertical?: boolean;
  archive?: boolean;
}

export default function VideoCard({ video, rowIds, source, vertical, archive }: Props) {
  const loc = useLocation();
  const [hover, setHover] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const p = percent(video.id);

  // Kesleltetett elonezet, hogy a soron atgorgetve ne induljon el tiz lejatszo.
  const enter = () => {
    timer.current = setTimeout(() => setHover(true), 700);
  };
  const leave = () => {
    if (timer.current) clearTimeout(timer.current);
    setHover(false);
  };

  return (
    <Link
      to={`/video/${video.slug}`}
      state={{ backgroundLocation: loc, rowIds, source }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className={`group/card relative block shrink-0 snap-start ${vertical ? "kf-card-v" : "kf-card"}`}
    >
      <div
        className={`relative overflow-hidden rounded bg-black transition duration-300 group-hover/card:scale-[1.05] group-hover/card:z-20 ${
          vertical ? "aspect-[9/16]" : "aspect-video"
        } ${archive && !hover ? "sepia-[.25]" : ""}`}
      >
        <img src={thumb(video.id)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />

        {hover && (
          <iframe
            title=""
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&iv_load_policy=3&disablekb=1`}
            className="pointer-events-none absolute left-0 top-[-50%] h-[200%] w-full"
            allow="autoplay; encrypted-media"
          />
        )}

        <span className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition group-hover/card:opacity-100">
          <Play className="h-10 w-10 fill-white text-white drop-shadow" />
        </span>

        {video.duration > 0 && (
          <span className="absolute bottom-2 right-2 z-10 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {fmt(video.duration)}
          </span>
        )}
        {episodeLabel(video) && (
          <span className="absolute left-2 top-2 z-10 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
            {episodeLabel(video)}
          </span>
        )}
        {archive && (
          <span className="absolute right-2 top-2 z-10 rounded border border-amber-500/40 bg-black/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300/90">
            {video.age >= 12 ? `${Math.floor(video.age / 12)} éve` : "Archív"}
          </span>
        )}

        {p > 0 && (
          <span className="absolute bottom-0 left-0 z-20 h-[3px] w-full bg-white/25">
            <span className="block h-full bg-primary" style={{ width: `${p}%` }} />
          </span>
        )}
      </div>

      <p className={`mt-2 line-clamp-2 text-[13px] leading-snug transition group-hover/card:text-white ${archive ? "text-amber-50/70" : "text-white/85"}`}>
        {video.title}
      </p>
    </Link>
  );
}
