import { outbound, track } from "../lib/track";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#111] px-4 py-12 text-sm text-white/55 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 rounded border border-white/10 bg-[#181818] p-8 text-center">
          <h2 className="mx-auto mb-4 max-w-xl text-xl font-bold text-white md:text-2xl">
            Ami a videón jól néz ki, azt élőben meg is tapinthatod.
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-white/60">
            Fél óra a budaörsi bemutatóteremben. Megnézed a fiókokat, kipróbálod a magasságokat, kérdezel.
          </p>
          <a
            href={outbound("https://konyhatura.konyhaszakerto.hu")}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("cta_click", { place: "footer" })}
            className="inline-block rounded bg-primary px-7 py-3 font-bold text-white transition hover:bg-primary/85"
          >
            Időpontot foglalok
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="mb-1 font-semibold text-white/80">Konyhaszakértő</p>
            <p>2040 Budaörs, Károly király út 86.</p>
            <p>1994 óta készítünk konyhákat.</p>
          </div>
          <div>
            <a href="tel:+36706220270" className="block hover:text-white">
              06 70 622 0270
            </a>
            <a href="mailto:erdeklodes@konyhaszakerto.hu" className="block hover:text-white">
              erdeklodes@konyhaszakerto.hu
            </a>
          </div>
          <div>
            <a href="https://konyhaszakerto.hu" className="block hover:text-white">
              konyhaszakerto.hu
            </a>
            <a href="https://konyhaszakerto.hu/adatvedelem" className="block hover:text-white">
              Adatvédelem
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-white/35">KonyhaFlix, a Konyhaszakértő videótára.</p>
      </div>
    </footer>
  );
}
