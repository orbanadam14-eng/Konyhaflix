import { Link, useLocation } from "react-router-dom";
import { Play } from "lucide-react";
import { byId, TURA_VIDEO_ID } from "../data/videos";
import { thumb, fmt } from "../lib/yt";
import { videoPath } from "../lib/seo";
import { track } from "../lib/track";

interface Props {
  place: string;
  /** "dark": sotet dobozban, "light": a primer szinu turakartyan. */
  tone?: "dark" | "light";
  className?: string;
}

/** A tura elotti tudnivalok videoja, kiemelve a tura CTA-k mellett. */
export default function TuraVideo({ place, tone = "dark", className = "" }: Props) {
  const loc = useLocation();
  const bg = (loc.state as { backgroundLocation?: unknown } | null)?.backgroundLocation;
  const v = byId(TURA_VIDEO_ID);
  if (!v) return null;

  const light = tone === "light";
  return (
    <Link
      to={videoPath(v)}
      state={{ backgroundLocation: bg ?? loc, source: `tura-${place}` }}
      onClick={() => track("tura_video_click", { place, video_id: v.id })}
      className={`group flex items-center gap-3 rounded p-2 pr-4 text-left transition ${
        light ? "bg-ink/10 hover:bg-ink/20" : "bg-white/5 hover:bg-white/10"
      } ${className}`}
    >
      <span className="relative block aspect-video w-24 shrink-0 overflow-hidden rounded bg-black">
        <img src={thumb(v.id)} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
          <Play className="h-5 w-5 fill-white text-white" />
        </span>
      </span>
      <span className="min-w-0">
        <span className={`block text-[11px] font-bold uppercase tracking-wider ${light ? "text-ink/70" : "text-accent"}`}>
          Mielőtt jössz, {fmt(v.duration)}
        </span>
        <span className={`block text-sm font-bold leading-snug ${light ? "text-ink" : "text-white"}`}>{v.title}</span>
      </span>
    </Link>
  );
}
