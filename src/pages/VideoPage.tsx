import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { bySlug, TOPICS, SERIES, bySeries, type Video } from "../data/videos";
import { buildQueue, related } from "../lib/queue";
import { outbound, track } from "../lib/track";
import { thumbHi } from "../lib/yt";
import Player from "../components/Player";
import Row from "../components/Row";
import Seo from "../components/Seo";

interface Nav { rowIds?: string[]; source?: string; backgroundLocation?: unknown }

export default function VideoPage({ modal }: { modal?: boolean }) {
  const { slug } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const st = (loc.state ?? {}) as Nav;

  const [video, setVideo] = useState<Video | undefined>(() => bySlug(slug ?? ""));

  useEffect(() => {
    const v = bySlug(slug ?? "");
    if (v) setVideo(v);
  }, [slug]);

  const queue = useMemo(() => (video ? buildQueue(video, st.rowIds) : []), [video, st.rowIds]);
  const rel = useMemo(() => (video ? related(video) : []), [video]);
  const eps = useMemo(() => (video?.series ? bySeries(video.series) : []), [video]);

  if (!video) {
    return (
      <div className="px-4 pt-32 text-center text-white/70 md:px-12">
        <p className="mb-4">Ez a videó nincs meg.</p>
        <Link to="/" className="text-primary underline">
          Vissza a kezdőlapra
        </Link>
      </div>
    );
  }

  const close = () => (modal ? nav(-1) : nav("/"));

  /** Videovaltaskor csak az URL-t csereljuk, a lejatszo megy tovabb. */
  const onChange = (v: Video) => {
    setVideo(v);
    window.history.replaceState(window.history.state, "", `/video/${v.slug}`);
  };

  const body = (
    <>
      <Seo
        title={video.title}
        description={video.description || `${video.title}. Konyhaszakértő, 1994 óta.`}
        image={thumbHi(video.id)}
        video={{ id: video.id, duration: video.duration, slug: video.slug }}
      />

      <Player
        video={video}
        queue={queue}
        source={st.source ?? "kozvetlen-link"}
        vertical={video.type === "short"}
        onChange={onChange}
        onClose={close}
      />

      <div className="px-4 py-6 md:px-8">
        <h1 className="mb-2 text-xl font-bold text-white md:text-3xl">{video.title}</h1>

        {video.series && (
          <p className="mb-3 text-sm text-white/60">
            {video.episode ? `${video.episode}. rész, ` : ""}
            <Link to={`/sorozat/${video.series}`} className="text-primary hover:underline">
              {SERIES[video.series]}
            </Link>
            {eps.length > 1 && ` (${eps.length} rész)`}
          </p>
        )}

        {video.description && <p className="mb-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">{video.description}</p>}

        <div className="mb-6 flex flex-wrap gap-2">
          {video.topics.map((t) => (
            <Link
              key={t}
              to={`/tema/${t}`}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition hover:border-white/60 hover:text-white"
            >
              {TOPICS[t] ?? t}
            </Link>
          ))}
        </div>

        <div className="mb-8 rounded border border-white/10 bg-[#181818] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <p className="mb-3 text-sm text-white/75 sm:mb-0">
            Ha a saját konyhádról szeretnél beszélni, gyere el hozzánk Budaörsre. Fél óra, kötelezettség nélkül.
          </p>
          <a
            href={outbound("https://konyhatura.konyhaszakerto.hu")}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("cta_click", { place: "player", video_id: video.id })}
            className="inline-block whitespace-nowrap rounded bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/85"
          >
            Konyhatúra időpont
          </a>
        </div>
      </div>

      <div className="pb-8">
        <Row id="ha-tetszett" title="Ha ez tetszett" items={rel} />
      </div>
    </>
  );

  if (!modal) return <div className="mx-auto max-w-5xl pt-16">{body}</div>;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 backdrop-blur-sm" onClick={close}>
      <div
        className="mx-auto my-6 w-[96vw] max-w-5xl overflow-hidden rounded-lg bg-[#141414] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {body}
      </div>
    </div>
  );
}
