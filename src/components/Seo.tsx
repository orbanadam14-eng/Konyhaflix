import { createContext, useContext, useEffect, useRef } from "react";
import { applyHead, type Meta } from "../lib/seo";

/** Elorendereleskor ide gyujtjuk az oldal fejlecet. A bongeszoben nincs ilyen, ott null. */
export const HeadContext = createContext<{ meta?: Meta } | null>(null);

// A modalis lejatszo alatt a hatteroldal is mountolva marad. Mindig a legfelso Seo ervenyes,
// es ha az eltunik (bezarjuk a modalt), az alatta levo visszaallitja a sajat fejlecet.
type Entry = { meta?: Meta };
const stack: Entry[] = [];
const applyTop = () => {
  const top = [...stack].reverse().find((e) => e.meta);
  if (top?.meta) applyHead(top.meta);
};

/** Oldalankenti cim, leiras, canonical, megosztasi kep es JSON-LD. */
export default function Seo(props: Meta) {
  const ctx = useContext(HeadContext);
  if (ctx) ctx.meta = props;

  const entry = useRef<Entry>({});
  useEffect(() => {
    const e = entry.current;
    stack.push(e);
    return () => {
      stack.splice(stack.indexOf(e), 1);
      applyTop();
    };
  }, []);

  const key = JSON.stringify(props);
  useEffect(() => {
    entry.current.meta = JSON.parse(key) as Meta;
    applyTop();
  }, [key]);

  return null;
}
