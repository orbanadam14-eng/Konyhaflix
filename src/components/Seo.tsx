import { useEffect } from "react";

interface Props {
  title: string;
  description?: string;
  image?: string;
  video?: { id: string; duration: number; slug: string };
}

const set = (sel: string, attr: string, val: string) => {
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    const [k, v] = sel.replace(/[[\]"']/g, "").split("meta")[1].split("=");
    el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, val);
};

/** Oldalankenti cim, leiras, megosztasi kep es VideoObject strukturalt adat. */
export default function Seo({ title, description, image, video }: Props) {
  useEffect(() => {
    const full = `${title} | KonyhaFlix`;
    document.title = full;
    if (description) {
      set('meta[name="description"]', "content", description);
      set('meta[property="og:description"]', "content", description);
    }
    set('meta[property="og:title"]', "content", full);
    set('meta[property="og:type"]', "content", video ? "video.other" : "website");
    set('meta[property="og:url"]', "content", window.location.href);
    if (image) {
      set('meta[property="og:image"]', "content", image);
      set('meta[name="twitter:image"]', "content", image);
    }

    let ld = document.getElementById("kf-ld") as HTMLScriptElement | null;
    if (video) {
      if (!ld) {
        ld = document.createElement("script");
        ld.id = "kf-ld";
        ld.type = "application/ld+json";
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title,
        description,
        thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
        duration: `PT${Math.floor(video.duration / 60)}M${video.duration % 60}S`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        uploadDate: "2024-01-01",
        publisher: { "@type": "Organization", name: "Konyhaszakértő" },
      });
    } else if (ld) {
      ld.remove();
    }
  }, [title, description, image, video]);

  return null;
}
