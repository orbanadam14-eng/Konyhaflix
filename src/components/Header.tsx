import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { outbound, track } from "../lib/track";
import { LOGO_KONYHAFLIX } from "../lib/brand";

const TURA = "https://konyhatura.konyhaszakerto.hu";

const links = [
  { to: "/", label: "Kezdőlap", end: true },
  { to: "/shorts", label: "Shorts" },
  { to: "/sorozat/konyharol-konyhara", label: "Podcast" },
  { to: "/tema/atalakitas", label: "Átalakítások" },
  { to: "/tema/gepek", label: "Gépek" },
];

export default function Header() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const h = () => setSolid(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 flex w-full items-center justify-between gap-4 px-4 py-3 transition-colors duration-300 md:px-12 ${
        solid ? "bg-background" : "bg-gradient-to-b from-black/85 to-transparent"
      }`}
    >
      <div className="flex min-w-0 items-center gap-6">
        <Link to="/" className="shrink-0" aria-label="KonyhaFlix, kezdőlap">
          <img src={LOGO_KONYHAFLIX} alt="KonyhaFlix" className="h-7 w-auto object-contain md:h-9" />
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-white/85 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? "text-white" : "transition hover:text-white")}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) nav(`/kereses?q=${encodeURIComponent(q.trim())}`);
          }}
          className="flex items-center"
        >
          {open && (
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Mit keresel?"
              className="w-32 rounded border border-white/25 bg-black/60 px-3 py-1.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/60 md:w-56"
            />
          )}
          <button type="button" aria-label="Keresés" onClick={() => setOpen((o) => !o)} className="p-2 text-white">
            <Search className="h-5 w-5" />
          </button>
        </form>

        <a
          href={outbound(TURA)}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("cta_click", { place: "header" })}
          className="whitespace-nowrap rounded bg-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-primary/85 md:px-4 md:py-2 md:text-sm"
        >
          Konyhatúra időpont
        </a>
      </div>
    </header>
  );
}
