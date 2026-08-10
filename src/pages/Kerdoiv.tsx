import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { contactId, track } from "../lib/track";
import Seo from "../components/Seo";

// A kerdoiv a mienk, nem GHL Survey. A valaszok a GHL inbound webhookjara mennek,
// a prioritast (A/B/C) mar itt kiszamoljuk, a GHL-nek csak cimkeznie kell.
const HOOK = import.meta.env.VITE_GHL_KERDOIV_WEBHOOK as string | undefined;

interface Q {
  key: string;
  label: string;
  options?: string[];
  free?: boolean;
  optional?: boolean;
}

const QS: Q[] = [
  { key: "mikorra", label: "Mikorra tervezed, hogy elkészüljön a konyhád?", options: ["Már nagyon sürgős", "1-6 hónap", "6 hónapnál később, csak tájékozódom"] },
  { key: "helyzet", label: "Építkezel vagy felújítasz éppen?", options: ["Építkezem", "Felújítok", "Csak inspirációt gyűjtök"] },
  { key: "keret", label: "Mekkora keretben gondolkodsz?", options: ["4 millió alatt", "4-7 millió", "7-12 millió", "12 millió fölött", "Még nem tudom"] },
  { key: "hol", label: "Hol lesz a konyha? (település vagy irányítószám)", free: true },
  { key: "donto", label: "Ki dönt majd a konyháról?", options: ["Én", "Közösen a párommal", "A család"] },
  { key: "stilus", label: "Milyen stílus áll hozzád közel?", options: ["Modern", "Klasszikus", "Rusztikus", "Még keresem"] },
  { key: "fejtores", label: "Mi a legnagyobb fejtörésed a konyhával kapcsolatban?", free: true, optional: true },
  { key: "hivas", label: "Mikor hívhatunk?", options: ["Munkaidőben bármikor", "Inkább délután", "17 óra után", "Inkább írjatok"] },
];

function priority(a: Record<string, string>): "A" | "B" | "C" {
  if (a.mikorra === "6 hónapnál később, csak tájékozódom") return "C";
  if ((a.mikorra === "Már nagyon sürgős" || a.mikorra === "1-6 hónap") && a.keret && a.keret !== "4 millió alatt") return "A";
  return "B";
}

/** A koszono kepernyo szemelyre szabott videoja a valaszokbol. */
function suggested(a: Record<string, string>): { href: string; label: string } {
  const f = (a.fejtores || "").toLowerCase();
  if (/gép|gep|sütő|suto|főzőlap|fozolap|hűtő|huto|páraelszív/.test(f))
    return { href: "/sorozat/gepek-sorozat", label: "Gépek, amiket nem szabad elrontani" };
  if (/kicsi|kis |hely|szűk|szuk/.test(f))
    return { href: "/tema/kis-konyha", label: "Kis konyha, nagy kérdések" };
  if (a.stilus === "Még keresem")
    return { href: "/tema/kesz-konyha", label: "Csak nézelődöm: kész konyhák" };
  return { href: "/sorozat/miert-fontos", label: "Miért fontos a konyha" };
}

export default function Kerdoiv() {
  const [a, setA] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const missing = useMemo(() => QS.filter((q) => !q.optional && !(a[q.key] || "").trim()), [a]);
  const sug = useMemo(() => suggested(a), [a]);

  const submit = async () => {
    if (missing.length) {
      setErr("Még " + missing.length + " kérdés van hátra.");
      return;
    }
    setBusy(true);
    setErr("");
    const payload = {
      contact_id: contactId(),
      priority: priority(a),
      ...a,
      source: "konyhaflix-kerdoiv",
      submitted_at: new Date().toISOString(),
    };
    track("kerdoiv_bekuldve", { priority: payload.priority });
    try {
      if (HOOK) {
        await fetch(HOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setSent(true);
    } catch {
      // A bekuldes megjelenites szempontjabol akkor is sikeres, a nezot nem buntetjuk a technikaert.
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-20 pt-28 text-center">
        <Seo title="Köszönjük" />
        <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl">Köszönjük, így már a te konyhádra készülünk.</h1>
        <p className="mb-8 text-white/60">Addig is ezt neked válogattuk:</p>
        <Link
          to={sug.href}
          className="inline-block rounded bg-primary px-7 py-3 text-lg font-bold text-white transition hover:bg-primary/85"
        >
          {sug.label}
        </Link>
        <p className="mt-6 text-sm text-white/40">
          <Link to="/" className="underline hover:text-white">Vagy nézz körül a videótárban</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-20 pt-28">
      <Seo title="Konyhatúra kérdőív" description="Nyolc kérdés, két perc, és a hívásnál már a te konyhádról beszélünk." />
      <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Nyolc kérdés, két perc</h1>
      <p className="mb-8 text-white/60">
        Nem feltétele a túrának. De ha válaszolsz, a hívásnál már a te konyhádról beszélünk, nem általánosságokról.
      </p>

      <div className="flex flex-col gap-7">
        {QS.map((q, i) => (
          <div key={q.key}>
            <p className="mb-2 font-semibold text-white">
              {i + 1}. {q.label}
              {q.optional && <span className="ml-2 text-xs font-normal text-white/40">nem kötelező</span>}
            </p>
            {q.options ? (
              <div className="flex flex-wrap gap-2">
                {q.options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setA((p) => ({ ...p, [q.key]: o }))}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      a[q.key] === o
                        ? "border-primary bg-primary font-bold text-white"
                        : "border-white/25 text-white/75 hover:border-white/60 hover:text-white"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                rows={q.key === "fejtores" ? 3 : 1}
                value={a[q.key] || ""}
                onChange={(e) => setA((p) => ({ ...p, [q.key]: e.target.value }))}
                className="w-full rounded border border-white/25 bg-black/40 px-3 py-2 text-white outline-none placeholder:text-white/30 focus:border-white/60"
                placeholder={q.key === "hol" ? "pl. Budaörs vagy 2040" : "Írd le pár szóban…"}
              />
            )}
          </div>
        ))}
      </div>

      {err && <p className="mt-6 text-sm font-semibold text-primary">{err}</p>}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-8 w-full rounded bg-primary px-7 py-4 text-lg font-bold text-white transition hover:bg-primary/85 disabled:opacity-50"
      >
        {busy ? "Küldés…" : "Elküldöm"}
      </button>
      <p className="mt-3 text-center text-xs text-white/40">A válaszaid csak hozzánk kerülnek, sehova máshova.</p>
    </div>
  );
}
