import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { videos, byTopic, bySeries, TOPICS, SERIES, type Video } from "../data/videos";
import VideoCard from "../components/VideoCard";
import Seo from "../components/Seo";
import { track } from "../lib/track";

function Grid({ items, source }: { items: Video[]; source: string }) {
  const ids = items.map((v) => v.id);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((v) => (
        <div key={v.id} className="w-full [&>a]:w-full">
          <VideoCard video={v} rowIds={ids} source={source} vertical={v.type === "short"} />
        </div>
      ))}
    </div>
  );
}

function Shell({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <div className="px-4 pb-16 pt-24 md:px-12 md:pt-28">
      <h1 className="mb-1 text-2xl font-bold text-white md:text-4xl">{title}</h1>
      {lead && <p className="mb-8 max-w-2xl text-white/60">{lead}</p>}
      {children}
    </div>
  );
}

export function TopicPage() {
  const { slug = "" } = useParams();
  const items = useMemo(() => byTopic(slug), [slug]);
  const name = TOPICS[slug] ?? "Téma";
  return (
    <>
      <Seo title={name} description={`${items.length} videó ehhez: ${name}. Konyhaszakértő videótár.`} />
      <Shell title={name} lead={`${items.length} videó.`}>
        {items.length ? <Grid items={items} source={`tema:${slug}`} /> : <Empty />}
      </Shell>
    </>
  );
}

export function SeriesPage() {
  const { slug = "" } = useParams();
  const items = useMemo(() => bySeries(slug), [slug]);
  const name = SERIES[slug] ?? "Sorozat";
  return (
    <>
      <Seo title={name} description={`${items.length} rész. Konyhaszakértő videótár.`} />
      <Shell title={name} lead={`${items.length} rész. Nézd sorban, minden rész épít az előzőre.`}>
        {items.length ? <Grid items={items} source={`sorozat:${slug}`} /> : <Empty />}
      </Shell>
    </>
  );
}

export function SearchPage() {
  const [sp] = useSearchParams();
  const q = (sp.get("q") ?? "").trim().toLowerCase();
  const items = useMemo(() => {
    if (!q) return [];
    const r = videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.topics.some((t) => (TOPICS[t] ?? t).toLowerCase().includes(q))
    );
    track("kereses", { query: q, results: r.length });
    return r;
  }, [q]);

  return (
    <>
      <Seo title={q ? `Keresés: ${q}` : "Keresés"} />
      <Shell title={q ? `"${q}"` : "Keresés"} lead={q ? `${items.length} találat.` : "Írd be, mi érdekel."}>
        {items.length ? <Grid items={items} source="kereses" /> : q ? <Empty /> : null}
      </Shell>
    </>
  );
}

function Empty() {
  return (
    <div className="rounded border border-white/10 bg-[#181818] p-8 text-center text-white/70">
      <p className="mb-3">Erre most nincs videónk.</p>
      <p className="text-sm">
        Írd meg, miről csináljunk:{" "}
        <a className="text-primary hover:underline" href="mailto:erdeklodes@konyhaszakerto.hu">
          erdeklodes@konyhaszakerto.hu
        </a>
      </p>
      <Link to="/" className="mt-5 inline-block rounded bg-primary px-5 py-2 text-sm font-bold text-white">
        Vissza a kezdőlapra
      </Link>
    </div>
  );
}
