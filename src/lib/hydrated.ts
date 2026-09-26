import { useSyncExternalStore } from "react";
import { outbound } from "./track";

const noop = () => () => {};

/**
 * Igaz, ha mar a bongeszoben futunk es a hidratalas lezajlott.
 * Elorenderelt oldalon az elso kliens render meg hamis, igy ugyanazt a HTML-t adja,
 * mint a szerver. Utana azonnal ujrarenderel igazzal. Sima kliens rendernel mindig igaz.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false
  );

/** Kimeno link a mentett UTM-ekkel. Hidratalas elott a nyers cim, hogy ne legyen elteres. */
export function useOutbound(url: string) {
  return useHydrated() ? outbound(url) : url;
}
