import { videos, bySeries, byTopic, archive, byId, type Video } from "./videos";

export interface RowDef {
  id: string;
  title: string;
  description: string;
  intro?: string;
  href?: string;
  isShorts?: boolean;
  isArchive?: boolean;
  get: () => Video[];
}

/** A friss sorokba 2 evnel ujabb anyag kerul. 5 evnel regebbi csak az Archivumba. */
const fresh = (v: Video) => !v.vintage && v.age <= 24;
const byViews = (a: Video, b: Video) => (b.views ?? 0) - (a.views ?? 0);
const ids = (list: string[]) => list.map(byId).filter(Boolean) as Video[];

export const rows: RowDef[] = [
  {
    id: "kezdd-itt",
    title: "Ezekkel kezdd",
    description: "Ha most jársz itt először, ezeket nézd meg.",
    get: () => videos.filter((v) => fresh(v) && v.type === "long").sort(byViews).slice(0, 10),
  },
  {
    id: "podcast",
    title: "Konyháról konyhára, a podcast",
    description: "Fél óra mélyvíz Attilával. Nézd sorban, minden rész épít az előzőre.",
    href: "/sorozat/konyharol-konyhara",
    get: () => bySeries("konyharol-konyhara"),
  },
  {
    id: "miert-fontos",
    title: "Miért fontos a konyha",
    description: "Hét rövid rész arról, miért nem mindegy, hol tölti a család a napjait.",
    href: "/sorozat/miert-fontos",
    isShorts: true,
    get: () => bySeries("miert-fontos"),
  },
  {
    id: "gepek-sorozat",
    title: "Gépek, amiket nem szabad elrontani",
    description: "Tíz rész, egyenként egy perc. Főzőlap, sütő, páraelszívó, sorrendben.",
    href: "/sorozat/gepek-sorozat",
    isShorts: true,
    get: () => bySeries("gepek-sorozat"),
  },
  {
    id: "hiressegek",
    title: "Hírességek választása",
    description: "Michelin-csillagos séf és olimpiai bajnok is ránk bízta a konyháját.",
    get: () =>
      ids(["mzWb6B4Ftjo", "q2QoWm1Wc1o", "NGC94qTlIVs", "DGvja8kUNUU", "eFU1gTOzh8g", "ydGA8x9VQLM", "evKfGOxdXLs", "X-fGku3-rHQ"]),
  },
  {
    id: "atalakitas",
    title: "Előtte, utána",
    description: "Így lesz egy fáradt konyhából a lakás szíve.",
    href: "/tema/atalakitas",
    get: () => byTopic("atalakitas").filter((v) => v.type === "long" && !v.vintage),
  },
  {
    id: "hibak-sorozat",
    title: "Amit a legtöbben elrontanak",
    description: "Öt rész arról, amivel utólag már nem lehet mit kezdeni.",
    href: "/sorozat/hibak-sorozat",
    isShorts: true,
    get: () => bySeries("hibak-sorozat"),
  },
  {
    id: "tarolas-sorozat",
    title: "Hova mi kerüljön",
    description: "Kamra, fiók, rejtett tároló. Hat rész, egyenként fél perc.",
    href: "/sorozat/tarolas-sorozat",
    isShorts: true,
    get: () => bySeries("tarolas-sorozat"),
  },
  {
    id: "kivitelezes-sorozat",
    title: "Kivel dolgozz együtt",
    description: "Mesterek, tervek, csapdák. Hat rész.",
    href: "/sorozat/kivitelezes-sorozat",
    isShorts: true,
    get: () => bySeries("kivitelezes-sorozat"),
  },
  {
    id: "meretek-sorozat",
    title: "Centik, amiken múlik",
    description: "A pultmagasság nem részletkérdés, hanem a hátad.",
    href: "/sorozat/meretek-sorozat",
    isShorts: true,
    get: () => bySeries("meretek-sorozat"),
  },
  {
    id: "gepek",
    title: "Mielőtt gépet veszel",
    description: "A hosszabb anyagok is, ha komolyan válogatsz.",
    href: "/tema/gepek",
    get: () => byTopic("gepek").filter((v) => !v.vintage && v.type === "long"),
  },
  {
    id: "kis-konyha",
    title: "Kis konyha, nagy kérdések",
    description: "Minden centiért megküzdünk.",
    href: "/tema/kis-konyha",
    get: () => byTopic("kis-konyha").filter((v) => !v.vintage),
  },
  {
    id: "nezelodom",
    title: "Csak nézelődöm",
    description: "Kész konyhák, szép felvételek. Nem kell hozzá gondolkodni.",
    href: "/tema/kesz-konyha",
    get: () => byTopic("kesz-konyha").filter((v) => v.type === "long" && !v.vintage).slice(0, 24),
  },
  {
    id: "archivum",
    title: "Archívum, 1994 óta csináljuk",
    description: "",
    intro:
      "Ezek a videók 5 és 15 év között készültek, és pont ez bennük a lényeg: ezek a konyhák ma is működnek, ma is szépek. Ha a konyhád következő 20 évét tervezed, olyan csapat kell, aki már bizonyította, hogy túléli a divatokat.",
    isArchive: true,
    get: () => archive().filter((v) => v.type === "long").slice(0, 20),
  },
];

const withItems = (list: RowDef[]) => list.map((r) => ({ def: r, items: r.get() })).filter((r) => r.items.length >= 3);

/** A lap eleje a hosszabb videoke. Nyugodtabb ritmus, fekvo kartyak. */
export const mainRows = () => withItems(rows.filter((r) => !r.isShorts && !r.isArchive));

/** A rovid videok egy kulon savba kerulnek, lejjebb. */
export const shortsRows = () => withItems(rows.filter((r) => r.isShorts));

export const archiveRow = () => withItems(rows.filter((r) => !!r.isArchive))[0];

export const visibleRows = () => withItems(rows);
