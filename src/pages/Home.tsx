import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Play, Info, Zap } from "lucide-react";
import { mainRows, shortsRows, archiveRow } from "../data/rows";
import { videos, byId, type Video } from "../data/videos";
import { continueList } from "../lib/progress";
import { thumbHi } from "../lib/yt";
import { outbound, track } from "../lib/track";
import HeroVideo from "../components/HeroVideo";
import { LOGO_SZAKERTO } from "../lib/brand";
import Row from "../components/Row";
import Seo from "../components/Seo";

// Friss, latvanyos videó. Regi anyag SOHA ne kerüljön a heróba.
const HERO_ID = "NGC94qTlIVs"; // Sárközi Ákos konyhája, I. rész
const HERO_START = 45;
const TURA = "https://konyhatura.konyhaszakerto.hu";

export default function Home() {
  const loc = useLocation();
  const [cont, setCont] = useState<Video[]>([]);
  const [bg, setBg] = useState(false);

  const hero = byId(HERO_ID) || videos.find((v) => v.type === "long" && !v.vintage) || videos[0];

  useEffect(() => {
    const list = continueList()
      .map((id) => byId(id))
      .filter(Boolean) as Video[];
    setCont(list.slice(0, 12));
    const t = setTimeout(() => setBg(window.innerWidth >= 768), 900);
    return () => clearTimeout(t);
  }, []);

  const main = mainRows();
  const shortBand = shortsRows();
  const archive = archiveRow();

  return (
    <>
      <Seo
        title="Minden konyhás videónk egy helyen"
        description="Konyhák, gépek, méretek, hibák. Több mint 190 videó a Konyhaszakértőtől, 1994 óta. Indíts el egyet, a következőt már betesszük."
        image={thumbHi(hero.id)}
      />

      <section className="relative flex h-[80vh] min-h-[540px] items-center overflow-hidden px-4 md:px-12">
        <div className="absolute inset-0 z-0 bg-black">
          <img src={thumbHi(hero.id)} alt="" className="h-full w-full object-cover opacity-70" />
          {bg && <HeroVideo id={HERO_ID} start={HERO_START} />}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="kf-rise relative z-10 mt-16 max-w-2xl">
          <h1 className="mb-5">
            <img
              src={LOGO_SZAKERTO}
              alt="Konyhaszakértő, minden konyhás videónk egy helyen"
              className="h-28 w-auto object-contain drop-shadow-lg md:h-44"
            />
          </h1>
          <p className="mb-6 max-w-lg text-base text-white/85 drop-shadow md:text-xl">
            Indíts el egyet, a következőt már betesszük. Konyhák, gépek, méretek és a hibák, amiket a legtöbben elkövetnek.
          </p>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Link
              to={`/video/${hero.slug}`}
              state={{ backgroundLocation: loc, source: "hero" }}
              className="flex items-center gap-2 rounded bg-white px-7 py-3 text-lg font-bold text-black transition hover:bg-white/85"
            >
              <Play className="h-5 w-5 fill-black" /> Kezdd itt
            </Link>
            <a
              href="#sorok"
              className="flex items-center gap-2 rounded bg-white/20 px-7 py-3 text-lg font-bold text-white backdrop-blur transition hover:bg-white/30"
            >
              <Info className="h-5 w-5" /> Nézz körül
            </a>
          </div>
          <p className="text-sm text-white/60">
            1994 óta készítünk konyhákat Budaörsön. {videos.length} videó, ingyen, regisztráció nélkül.
          </p>
        </div>
      </section>

      <div id="sorok" className="relative z-10 -mt-16 flex flex-col gap-8 pb-8 md:gap-10">
        {cont.length >= 1 && (
          <Row
            id="folytasd"
            title="Folytasd, ahol abbahagytad"
            description="Ezeket elkezdted, de nem néztél végig."
            items={cont}
          />
        )}

        {main.map(({ def, items }, i) => (
          <Fragment key={def.id}>
            <Row
              id={def.id}
              title={def.title}
              description={def.description}
              href={def.href}
              items={items}
            />

            {/* Kozbulso ajanlat, korulbelul a lap kozepen */}
            {i === 3 && (
              <section className="mx-4 overflow-hidden rounded border border-white/10 bg-[#181818] px-6 py-12 text-center shadow-2xl md:mx-12">
                <h2 className="mx-auto mb-6 max-w-2xl text-2xl font-bold text-white md:text-3xl">
                  Ami a videón jól néz ki, azt élőben meg is tapinthatod.
                </h2>
                <a
                  href={outbound(TURA)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("cta_click", { place: "mid" })}
                  className="inline-block rounded bg-primary px-8 py-4 text-lg font-bold text-white transition hover:bg-primary/85"
                >
                  Ingyenes konyhatúra időpontot kérek
                </a>
              </section>
            )}
          </Fragment>
        ))}

        {/* Rovid videok, egy kulon savban. Nem szorjuk szet oket a lap tetejen. */}
        {shortBand.length > 0 && (
          <section className="border-y border-white/10 bg-[#0f0f0f] py-10">
            <div className="mb-6 px-4 md:px-12">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Egy perc alatt</p>
              <h2 className="text-2xl font-bold text-white md:text-3xl">Rövid válaszok, sorozatokba szedve</h2>
              <p className="mt-1 max-w-2xl text-[13px] leading-snug text-white/55 md:text-sm">
                Egy kérdés, egy válasz, fél perc. Hat sorozat, mindegyik végignézhető egy kávé alatt.
              </p>
              <Link
                to="/shorts"
                onClick={() => track("cta_click", { place: "shorts-band" })}
                className="mt-4 inline-flex items-center gap-2 rounded bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                <Zap className="h-4 w-4" /> Mind a 67 rövid videó, folyamatban
              </Link>
            </div>

            <div className="flex flex-col gap-8">
              {shortBand.map(({ def, items }) => (
                <Row
                  key={def.id}
                  id={def.id}
                  title={def.title}
                  description={def.description}
                  href={def.href}
                  items={items}
                  vertical
                />
              ))}
            </div>
          </section>
        )}

        {archive && (
          <Row
            id={archive.def.id}
            title={archive.def.title}
            description={archive.def.description}
            intro={archive.def.intro}
            items={archive.items}
            archive
          />
        )}
      </div>

      <section className="px-4 pb-4 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          <div className="flex flex-col items-start rounded border border-white/10 bg-[#181818] p-8 transition hover:border-white/30">
            <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">Nincs időd hosszú videóra?</h3>
            <p className="mb-6 flex-grow text-sm text-white/60 md:text-base">
              Egy perc alatt egy kérdés, egy válasz. Görgetsz, és jön a következő.
            </p>
            <Link
              to="/shorts"
              className="flex items-center gap-2 rounded bg-white px-7 py-3 font-bold text-black transition hover:bg-white/85"
            >
              <Zap className="h-5 w-5" /> Rövid videók
            </Link>
          </div>
          <div className="flex flex-col items-start rounded bg-primary p-8">
            <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">Gyere el a konyhatúrára</h3>
            <p className="mb-6 flex-grow text-sm text-white/90 md:text-base">
              Fél óra a budaörsi bemutatóteremben: rejtett tárolók, ergonómia, anyagok élőben.
            </p>
            <a
              href={outbound(TURA)}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("cta_click", { place: "home-end" })}
              className="rounded bg-black px-7 py-3 font-bold text-white transition hover:bg-black/80"
            >
              Időpontot foglalok
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
