import { videos, byId, bySeries, byTopic, type Video } from "../data/videos";
import { isFinished } from "./progress";

/**
 * Mi jon a kovetkezo video.
 * 1. Ha sorbol indult, a sor kovetkezo eleme.
 * 2. Ha sorozat resze, a kovetkezo epizod.
 * 3. Azonos temaju, amit meg nem latott.
 * 4. A legnezettebb, amit meg nem latott.
 * Zsakutca soha nincs.
 */
export function buildQueue(current: Video, rowIds?: string[]): Video[] {
  const out: Video[] = [];
  const push = (v?: Video) => {
    if (v && v.id !== current.id && !out.some((o) => o.id === v.id)) out.push(v);
  };

  if (rowIds?.length) {
    const i = rowIds.indexOf(current.id);
    rowIds.slice(i + 1).forEach((id) => push(byId(id)));
  }

  if (current.series) {
    const eps = bySeries(current.series);
    const i = eps.findIndex((e) => e.id === current.id);
    eps.slice(i + 1).forEach(push);
  }

  const sameType = (v: Video) => v.type === current.type;
  current.topics.forEach((t) =>
    byTopic(t)
      .filter((v) => sameType(v) && !isFinished(v.id))
      .forEach(push)
  );

  [...videos]
    .filter((v) => sameType(v) && !isFinished(v.id))
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .forEach(push);

  // Vegso halo: barmi, csak ne alljon meg.
  [...videos].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).forEach(push);

  return out;
}

/** A lejatszo alatti "Ha ez tetszett" sor. */
export function related(current: Video, n = 8): Video[] {
  const out: Video[] = [];
  const push = (v: Video) => {
    if (v.id !== current.id && !out.some((o) => o.id === v.id)) out.push(v);
  };
  current.topics.forEach((t) => byTopic(t).filter((v) => v.type === current.type).forEach(push));
  if (current.series) bySeries(current.series).forEach(push);
  [...videos]
    .filter((v) => v.type === current.type)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .forEach(push);
  return out.slice(0, n);
}
