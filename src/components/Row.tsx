import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Video } from "../data/videos";
import VideoCard from "./VideoCard";

interface Props {
  id: string;
  title: string;
  description?: string;
  intro?: string;
  href?: string;
  items: Video[];
  vertical?: boolean;
  archive?: boolean;
}

export default function Row({ id, title, description, intro, href, items, vertical, archive }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const ids = items.map((v) => v.id);

  const scroll = (dir: -1 | 1) =>
    box.current && box.current.scrollBy({ left: dir * box.current.clientWidth * 0.8, behavior: "smooth" });

  if (!items.length) return null;

  return (
    <section
      id={id}
      className={
        archive
          ? "relative border-y border-amber-900/40 bg-[linear-gradient(180deg,#161310_0%,#1d1813_50%,#161310_100%)] py-10"
          : "relative"
      }
    >
      {archive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
          }}
        />
      )}

      <div className={`relative mb-2 px-4 md:px-12 ${archive ? "mb-5" : ""}`}>
        {archive && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-500/80">1994 óta</p>
        )}
        <h2 className={`font-bold md:text-2xl ${archive ? "text-2xl text-amber-100 md:text-3xl" : "text-lg text-white"}`}>
          {href ? (
            <Link to={href} className="transition hover:text-primary">
              {title}
              <span className="ml-2 text-sm font-normal text-white/50">Mind</span>
            </Link>
          ) : (
            title
          )}
        </h2>
        {description && <p className="mt-0.5 text-[13px] leading-snug text-white/55 md:text-sm">{description}</p>}
        {intro && (
          <p className="mt-3 max-w-3xl border-l-4 border-amber-600/70 pl-4 text-sm leading-relaxed text-amber-50/75 md:text-base">
            {intro}
          </p>
        )}
      </div>

      <div className="group/row relative">
        <button
          aria-label="Balra"
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 z-30 hidden h-full w-12 items-center justify-center bg-black/40 text-white opacity-0 transition group-hover/row:opacity-100 hover:bg-black/70 md:flex"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div ref={box} className="hide-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 pb-2 md:px-12">
          {items.map((v) => (
            <VideoCard key={v.id} video={v} rowIds={ids} source={id} vertical={vertical} archive={archive} />
          ))}
        </div>

        <button
          aria-label="Jobbra"
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 z-30 hidden h-full w-12 items-center justify-center bg-black/40 text-white opacity-0 transition group-hover/row:opacity-100 hover:bg-black/70 md:flex"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
