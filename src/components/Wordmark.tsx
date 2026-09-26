// Szoveges logo, amig nincs uj grafikus Videotar logo.
// Ha megjon a kep, eleg ezt a komponenst egy <img>-re cserelni, a hivo helyek maradhatnak.

interface Props {
  size?: "sm" | "lg";
  className?: string;
}

export default function Wordmark({ size = "sm", className = "" }: Props) {
  const lg = size === "lg";
  return (
    <span className={`inline-flex flex-col leading-none ${lg ? "items-center" : "items-start"} ${className}`}>
      <span
        className={`font-display font-semibold text-powder ${
          lg ? "text-5xl tracking-[0.06em] md:text-7xl" : "text-xl tracking-[0.06em] md:text-2xl"
        }`}
      >
        Videótár
      </span>
      <span
        className={`font-sans font-semibold uppercase text-accent ${
          lg ? "mt-3 text-xs tracking-[0.4em] md:text-sm" : "mt-1 text-[9px] tracking-[0.32em] md:text-[10px]"
        }`}
      >
        Konyhaszakértő
      </span>
    </span>
  );
}
