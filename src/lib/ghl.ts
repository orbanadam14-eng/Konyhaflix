// Visszajelzes a GHL-nek: ki hany videot nezett meg.
// Csak azoknal fut, akik e-mailbol jottek, tehat van azonositojuk.
// A webhook cimet a GHL-ben egy Inbound Webhook triggerrel kapod meg,
// es a .env fajlba kell tenni: VITE_GHL_WEBHOOK=https://...

import { contactId, watchedIds } from "./track";

const URL_ = import.meta.env.VITE_GHL_WEBHOOK as string | undefined;
const SENT = "kf_ghl_sent";

/** Minden 3. uj megnezett videonal szolunk a GHL-nek. */
export async function reportWatch(videoId: string, videoTitle: string) {
  const cid = contactId();
  if (!cid || !URL_) return;

  const count = watchedIds().length;
  const last = Number(localStorage.getItem(SENT) || 0);
  if (count < 3 || count - last < 3) return;

  localStorage.setItem(SENT, String(count));
  try {
    await fetch(URL_, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact_id: cid,
        videos_watched: count,
        last_video_id: videoId,
        last_video_title: videoTitle,
        last_watch_at: new Date().toISOString(),
        source: "konyhaflix",
      }),
    });
  } catch {
    // A meres soha ne allitsa meg a nezest.
  }
}
