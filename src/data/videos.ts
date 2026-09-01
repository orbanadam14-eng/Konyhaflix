// Automatikusan generalva a videoleltarbol es a shorts-gyujtesbol.
// Tomor formatum, hogy a bundle kicsi maradjon. A slug a cimbol szamolodik,
// ugyanazzal a szaballyal, amivel az e-mailekbe kerult, tehat a linkek stabilak.
// A leirasok egyelore uresek, a KonyhaFlix_videoadatok.xlsx tartalmazza oket.
export type VideoType = "short" | "long";

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  type: VideoType;
  topics: string[];
  views?: number;
  age: number;        // honapban, a feltoltes ota
  vintage: boolean;   // 5 evnel regebbi, az archivumba valo
  series?: string;
  episode?: number;
  badge?: string;
}

export const TOPICS: Record<string, string> = {
  "gepek": "Mielőtt gépet veszel",
  "tarolas": "Hova mi kerüljön",
  "meretek": "Magasságok, távolságok, centik",
  "kis-konyha": "Kis konyha, nagy kérdések",
  "hibak": "Mit rontanak el a legtöbben",
  "kivitelezes": "Kivel dolgozz együtt",
  "atalakitas": "Előtte, utána",
  "kesz-konyha": "Csak nézelődöm",
  "vilagitas": "Fény és konnektor",
  "mosogato": "A mosogató körül",
};

export const SERIES: Record<string, string> = {
  "konyharol-konyhara": "Konyháról konyhára, a podcast",
  "sarkozi": "Sárközi Ákos konyhája",
  "ugyfelsztori": "Ügyfélsztorik",
  "miert-fontos": "Miért fontos a konyha",
  "gepek-sorozat": "Gépek, amiket nem szabad elrontani",
  "hibak-sorozat": "Amit a legtöbben elrontanak",
  "tarolas-sorozat": "Hova mi kerüljön, egy percben",
  "meretek-sorozat": "Centik, amiken múlik",
  "kivitelezes-sorozat": "Kivel dolgozz együtt, egy percben",
};

export function slugify(title: string, id: string): string {
  const a = title.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
  const b = a.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return (b.slice(0, 60) || "video") + "-" + id.slice(0, 4).toLowerCase();
}

// Csak a regi videok kora, honapban. Ami nincs benne, az friss.
// Ebbol all elo az Archivum sor, es ebbol jon a "9 eve" jelzo a kartyakon.
export const AGES: Record<string, number> = {"u9jzxSjrzhY":108,"ZuUnGWAMXaA":120,"4qzOxwycNUU":48,"1ewVooiq7pE":108,"n1VK5MxVr9Q":84,"YAv-hVdUxl0":132,"IgB3j22ARVM":84,"sbf-a_ofeLA":156,"I7WoqyEQhc4":96,"AmCdyIJ3x70":156,"r5q-D6irbHE":156,"RQCaZJXSLtY":96,"sLe1ehGeB7Y":132,"XfvNHrWaFN4":120,"f1-XretpcQ0":108,"xznMVSdYRuo":108,"efsX5n7Lp_g":108,"xgvbISYeikI":120,"_b4pWetFXA4":108,"OiShgFSbli4":156,"GsvKHZq6TMs":96,"iEiKzEX7NJI":96,"YK25I94Xz_o":96,"VUlZunA_Wyk":120,"_Td84tY0gGk":96,"lk9SYY2yTuI":84,"CjOoVGh1PiE":108,"LBRXxMADkCU":108,"khYcuIoPaK0":108,"Ul3feaqDXHw":36,"ilS4laXk9XA":48,"gSM08ztAu-Y":36,"2MINrGaCWgE":108,"g1xuhZx12Zg":84,"Q510M-d_l6s":24,"8QiGrQ-tVj0":60,"I6G5ZEgSAHA":156,"XoIgFQECgT8":120,"NGC94qTlIVs":24,"rcZC77OPuuY":120,"qOn1KRC0iqw":132,"0YLjRQe1qRM":84,"NCUhJiPnFGk":156,"BTgXqoN4VlY":84,"saUlkRiSjWY":96,"JM1SZdEJmFk":48,"E3XqUESFpLk":120,"q4YK8h50fkI":156,"ltMQKPUk-5k":132,"wHsA2LaatGs":84,"PuptaOng5Aw":132,"DOjRssAjC5w":84,"UmBIj7g1l2E":156,"D_7vWChMYt4":108,"0mEraQKanrg":24,"1T3_bnYDrzU":24,"MPykXTi0J_o":120,"f1wtHQyRfpw":60,"_yAhaUUTuSk":24,"TmvEb27ddYc":24,"6el40c4yF2c":84,"iKbeZNQY1to":24,"xlYYqrU8nuY":84,"ydGA8x9VQLM":24,"fjz-zGNAGoc":24,"ByqLwR4iw_c":156,"myFbLPBPUJw":24,"g0XxDfN3ggQ":132,"pZnSZ1ag5us":36,"_HhElIXVlSA":24,"WeB_-_NPYis":36,"4B2SI_s0noU":36,"qD920uIQ8c4":156,"mzWb6B4Ftjo":36,"evKfGOxdXLs":24,"Z9kHtFESB9I":36,"CTVtZKTFLFc":24,"0AWTYtcMLQc":156,"FEjdDmtz7nU":156,"kuP1SVdnDkw":132,"EGjdYl1Ffnc":132,"X-fGku3-rHQ":24,"oDuQf7qCme4":24,"3RWeZYeUpOs":156,"s0kh9hOr6ac":108,"CpQkfqdiTs0":24,"9ApwczXKEvs":156,"PQOnGIEnwBo":36,"dbIox8Ymytw":156,"xhqgUruSqgo":132,"dfpPOeaqUOI":156,"3WOEDQ3JFSk":36,"6yuUrsaK6X0":36,"OREL3UDb5sA":108,"sYqSb6RI0ec":36,"61ZJzjlM1Fw":24,"I7BPW0Lt9KY":24,"qfv9kp5YrK4":36,"8eBAfJhMMck":24,"6lopFt_J1To":24,"qB2Wvu4R0bs":24,"qLtaZy_D1_E":24,"Fl0bj5VAcf8":24,"0fdgW6Rb1pw":132,"kX6_yj4qZ1s":24,"d0N9qROWF2U":24,"AzDS6w6W3JU":24,"ASVzhHb_lV4":24,"N6BWaqa8DVU":132,"kFnw9TBZ2lg":132,"pVwJOJcOqOs":132};

// Rovidvideo mini-sorozatok: [sorozat, epizodszam]. Nulla vagas, csak besorolas.
export const MINI: Record<string, [string, number]> = {"HPGhybwnSLY":["miert-fontos",1],"FsYXCrhsMvI":["miert-fontos",2],"HwIFsb066VU":["miert-fontos",3],"svyLFYJYWwg":["miert-fontos",4],"DjNrgmjJWJ0":["miert-fontos",5],"SfKPHbOXx-0":["miert-fontos",6],"Hy-EVGeKIrc":["miert-fontos",7],"7A_7_-WQCb8":["gepek-sorozat",1],"32qquNAJ8t4":["gepek-sorozat",2],"BE5qg7pp0Tc":["gepek-sorozat",3],"Z1cLS0OhPhw":["gepek-sorozat",4],"yONRqrnNHWk":["gepek-sorozat",5],"hSomtvXWTt4":["gepek-sorozat",6],"67n16JkqOBE":["gepek-sorozat",7],"CkKb21GOzfk":["gepek-sorozat",8],"D8hFGehsODs":["gepek-sorozat",9],"RgCpO_xebQA":["gepek-sorozat",10],"MNJveyGdwhI":["hibak-sorozat",1],"h5AtAlUW544":["hibak-sorozat",2],"B3FHpIhA1eY":["hibak-sorozat",3],"dWIxLbxoa98":["hibak-sorozat",4],"Xlw15IOWNlk":["hibak-sorozat",5],"xstHdPZJlEk":["tarolas-sorozat",1],"BPyiiPMvxXU":["tarolas-sorozat",2],"rU5hUD5DBWs":["tarolas-sorozat",3],"nFEKmWF4Os0":["tarolas-sorozat",4],"QeAO030gM2w":["tarolas-sorozat",5],"UwD2PNiWIHw":["tarolas-sorozat",6],"-VEZuIUlBGw":["meretek-sorozat",1],"A4nHmF6BFto":["meretek-sorozat",2],"L9XSX4sUnIg":["meretek-sorozat",3],"aylbZnNZOKQ":["kivitelezes-sorozat",1],"Z5eMJhN7ApQ":["kivitelezes-sorozat",2],"QqrdPH9BzCc":["kivitelezes-sorozat",3],"VqGD6rfgrdg":["kivitelezes-sorozat",4],"i8DuLMdl3eo":["kivitelezes-sorozat",5],"As3hiGtMB78":["kivitelezes-sorozat",6]};

type Raw = [string, string, number, number, string, number, string, number];

const RAW: Raw[] = [
["kJR15E5Dijw","Célirány X Konyhaszakértő: Konyhatrendek",0,0,"kesz-konyha|kivitelezes",0,"",0],
["bh19AOCHckE","10+1 gondolat, hogy mire figyeljünk a konyha tervezésénél",0,0,"hibak|meretek|gepek",0,"",0],
["u9jzxSjrzhY","A rossz adottságú helyiség megdöbbentő átváltozása",367,0,"hibak|atalakitas",500000,"",0],
["ZuUnGWAMXaA","Konyha, nappali és előszoba egy légtérben",425,0,"kesz-konyha",192000,"",0],
["4qzOxwycNUU","2022 legújabb konyhái",144,0,"kesz-konyha",155000,"",0],
["1ewVooiq7pE","Álomkonyha, ahol jó lenni és öröm főzni",579,0,"kesz-konyha",131000,"",0],
["7A_7_-WQCb8","„A villanyszerelő megmondta, hogy az a főzőlap nem jó”",79,1,"gepek|kivitelezes",123886,"",0],
["n1VK5MxVr9Q","Modern konyhabútor ötletek a szürke árnyalataival",547,0,"kesz-konyha",110000,"",0],
["YAv-hVdUxl0","Egy konyha felújításának folyamata",502,0,"kivitelezes|atalakitas",103000,"",0],
["MNJveyGdwhI","Tipikus baklövés: amikor az olcsóbb a drágább",89,1,"hibak",92265,"",0],
["IgB3j22ARVM","Egyedi konyhatervezés - modern konyha a nappalival egyben",421,0,"kesz-konyha",90000,"",0],
["Fj6-W0H3dxs","Konyháról konyhára S01E01 - A konyhatervezés",1884,0,"kesz-konyha",84000,"konyharol-konyhara",1],
["sbf-a_ofeLA","Modern minimál konyha",292,0,"kesz-konyha",80000,"",0],
["I7WoqyEQhc4","Teljes konyhafelújítás klasszikus stílusban",526,0,"kivitelezes|atalakitas|kesz-konyha",78000,"",0],
["AmCdyIJ3x70","Modern konyha ötletek bővebben",331,0,"kesz-konyha",69000,"",0],
["r5q-D6irbHE","Praktikus modern konyha meglepő ötletekkel",139,0,"kesz-konyha",69000,"",0],
["RQCaZJXSLtY","Rejtőzködő konyha egyben a nappalival - minimál ötletesen",336,0,"kesz-konyha",69000,"",0],
["sLe1ehGeB7Y","Fehér modern konyha",299,0,"kesz-konyha",68000,"",0],
["XfvNHrWaFN4","Egy modern konyha születése: ahogy megrendelőnk látja",274,0,"kivitelezes|kesz-konyha",66000,"",0],
["rkdGfj2rpmE","Ilyen egy örök konyha, bemutatóteremből az otthonodba",27,1,"kesz-konyha",65146,"",0],
["f1-XretpcQ0","Ötletes konyhasziget és trükkös hűtőbeépítés",409,0,"gepek|kivitelezes",65000,"",0],
["32qquNAJ8t4","Sütő a hűtő mellé? Megcáfoljuk a legendát",29,1,"gepek|hibak",64144,"",0],
["xznMVSdYRuo","Praktikus konyha egy légtérben a nappalival",440,0,"kesz-konyha",64000,"",0],
["yONRqrnNHWk","Indulhat a hétvégi főzés a gőz- és mikrófunkciós sütőkkel",15,1,"gepek",62293,"",0],
["s0NKorcKvcA","Tökéletes trükk a ritka főzőknek",21,1,"kesz-konyha",62171,"",0],
["efsX5n7Lp_g","Konyhai lakberendezés személyre szabva",209,0,"atalakitas",61000,"",0],
["xgvbISYeikI","Egy praktikus álomkonyha megvalósulása",297,0,"kesz-konyha",60000,"",0],
["_b4pWetFXA4","Magasfényű konyhák - így lesz több a munkafelület",468,0,"vilagitas",57000,"",0],
["W4ocGE6B7wI","Modern és elegáns konyha (Csergezán-kilátó)",183,0,"gepek|tarolas|meretek|kivitelezes|kesz-konyha",56000,"",0],
["BE5qg7pp0Tc","„Ha ezt tudtam volna...” Gépvásárlás előtt fordulj a géptanácsadóhoz",30,1,"gepek",54932,"",0],
["OiShgFSbli4","Nagyon ötletes és praktikus rusztikus konyha",804,0,"kesz-konyha",54000,"",0],
["Z1cLS0OhPhw","„Egy gépet könnyebb cserélni, mint egy egész konyhát”",60,1,"gepek",53508,"",0],
["xstHdPZJlEk","Kamra helyett kamra",12,1,"tarolas",52731,"",0],
["HPGhybwnSLY","„Ökrök vagyunk és körbezárjuk.” Kommentekre válaszolunk",57,1,"kesz-konyha",50126,"",0],
["GsvKHZq6TMs","Korszakváltás a konyhában - személyre szabva",539,0,"kesz-konyha",50000,"",0],
["iEiKzEX7NJI","Letisztult formák, nagyszerű ötletek",308,0,"kesz-konyha",50000,"",0],
["YK25I94Xz_o","Okos dolgok, tökéletes végeredmény - konyha étkezővel",398,0,"kesz-konyha",50000,"",0],
["BPyiiPMvxXU","Így tárolod a háztartási eszközeidet",12,1,"tarolas",48433,"",0],
["VUlZunA_Wyk","Egy tágas konyha, ahol élmény a főzés",241,0,"kesz-konyha",47000,"",0],
["_Td84tY0gGk","Egy modern és természetes álomkonyha",300,0,"kesz-konyha",42000,"",0],
["kE6O6om95Yg","Átalakítottunk egy családi konyhát",146,0,"gepek|atalakitas|mosogato",42000,"",0],
["lk9SYY2yTuI","Modern konyhabútor ötletek - személyre szabott terek",360,0,"kesz-konyha",41000,"",0],
["U8BLdrvQIHA","Kicsit átalakítottuk. Szerinted milyen lett?",21,1,"kis-konyha|atalakitas",40016,"",0],
["wKV7znvXNZ4","Falba süllyesztve, hogy letisztultabb legyen",13,1,"kesz-konyha",39024,"",0],
["CjOoVGh1PiE","Rusztikus konyhabútor - ötletes konyhák határok nélkül",382,0,"kesz-konyha",38000,"",0],
["LBRXxMADkCU","Magasfényű modern konyha: testre szabott elegancia",331,0,"kesz-konyha|vilagitas",37000,"",0],
["khYcuIoPaK0","Tetőtéri modern konyha - tervezés, gyártás egyedi ötletekkel",454,0,"kis-konyha|kesz-konyha",37000,"",0],
["Ul3feaqDXHw","A Konyhaszakértő konyhája",789,0,"kesz-konyha",36000,"",0],
["FsYXCrhsMvI","„Itt nem főznek.” Ezt az én konyhámra mondták",30,1,"kesz-konyha",35811,"",0],
["Vy79N6HrnV4","Stílusos helyre ízléses konyha",12,1,"kesz-konyha",35163,"",0],
["ilS4laXk9XA","Budaörsi praktikus modern konyha",287,0,"kesz-konyha",35000,"",0],
["gSM08ztAu-Y","Lenyűgöző, praktikus konyha a Pilisben",316,0,"kesz-konyha",35000,"",0],
["2MINrGaCWgE","Modern konyha teljes átépítéssel",380,0,"kesz-konyha",35000,"",0],
["h5AtAlUW544","Háttal az ablaknak? Na azt már nem!",17,1,"kesz-konyha",34521,"",0],
["g1xuhZx12Zg","Elegáns modern konyha - luxus, ötletes megoldásokkal",311,0,"kesz-konyha",34000,"",0],
["HwIFsb066VU","Mi jövőt építünk és nem bútorokat adunk el",30,1,"kesz-konyha",33212,"",0],
["CW5BTfYc7RI","Konyháról konyhára S01E05 - A lakberendezés és a konyha",1422,0,"atalakitas",32000,"konyharol-konyhara",5],
["aylbZnNZOKQ","Cicaharc? Min múlik, hogy ne rágják össze a port a szakemberek?",39,1,"kesz-konyha",31620,"",0],
["JMnhc8FwOtM","Nagypolgári konyha Budapestről",135,0,"gepek|meretek|kivitelezes|mosogato",31000,"",0],
["-VEZuIUlBGw","Egy konyhasziget három magassággal",27,1,"meretek",30576,"",0],
["Q510M-d_l6s","Elegáns és praktikus konyha",192,0,"gepek|tarolas|meretek|kivitelezes|kesz-konyha|vilagitas",30000,"",0],
["8QiGrQ-tVj0","Praktikus konyha kis helyen",347,0,"kesz-konyha",30000,"",0],
["I6G5ZEgSAHA","Jó ötletek: zöld konyhabútor",114,0,"kesz-konyha",29000,"",0],
["wa-SKQRQMr0","Konyháról konyhára S01E03 - Konyha, mint élettér",1517,0,"kesz-konyha",28000,"konyharol-konyhara",3],
["XoIgFQECgT8","Modern minimál konyhabútor - ötletes konyhatervezés",270,0,"kesz-konyha",28000,"",0],
["NGC94qTlIVs","Sárközi Ákos konyhája - I. rész",354,0,"kesz-konyha",27000,"sarkozi",1],
["rcZC77OPuuY","Minőségi konyhabútorok remek ötletekkel",261,0,"kesz-konyha",26000,"",0],
["svyLFYJYWwg","Rohanó életet élünk. De hol az élettér?",38,1,"kesz-konyha",25435,"",0],
["DGvja8kUNUU","Sárközi Ákos konyhája - II. rész",342,0,"kesz-konyha",25000,"sarkozi",2],
["qOn1KRC0iqw","Barna rusztikus fa konyha",326,0,"kesz-konyha",24000,"",0],
["9Xx08sUffFo","Bemutatótermi konyha az otthonodba",222,0,"kivitelezes|atalakitas",24000,"",0],
["0YLjRQe1qRM","Egyedi modern konyha szigettel - különleges ötletekkel",278,0,"kesz-konyha",24000,"",0],
["NCUhJiPnFGk","Jó ötletek: mosogatógép a falba",30,0,"gepek|mosogato",24000,"",0],
["BTgXqoN4VlY","Magasfényű modern konyhabútor - életre szóló minőség",390,0,"kesz-konyha|vilagitas",24000,"",0],
["saUlkRiSjWY","Minimál konyha egyben a nappalival",261,0,"kesz-konyha",24000,"",0],
["DjNrgmjJWJ0","„Az emberek a tűz körül, az étkezéskor gyűlnek össze.”",40,1,"kesz-konyha",23436,"",0],
["JM1SZdEJmFk","Budai luxus penthouse konyha",650,0,"kesz-konyha",23000,"",0],
["E3XqUESFpLk","Egy lehangoló konyha csodálatos átváltozása",173,0,"atalakitas",23000,"",0],
["q4YK8h50fkI","Modern konyhai ötletek Szakértőtől, garanciával",101,0,"kesz-konyha",21000,"",0],
["ltMQKPUk-5k","Modern tetőtéri konyha",270,0,"kis-konyha",21000,"",0],
["wHsA2LaatGs","Így lett praktikus egy rossz adottságú, szűk konyha",491,0,"kis-konyha|hibak",21000,"",0],
["PuptaOng5Aw","Angol rusztikus konyha",300,0,"kesz-konyha",20000,"",0],
["DOjRssAjC5w","Fényes fehér modern konyha szigettel - az örök kedvenc",206,0,"kesz-konyha|vilagitas",20000,"",0],
["UmBIj7g1l2E","Jó ötletek: kihúzható asztal",29,0,"kesz-konyha",20000,"",0],
["D_7vWChMYt4","Nem csak modern konyhák - lakberendezés",457,0,"atalakitas",20000,"",0],
["sJRxy_B3OeA","Konyháról konyhára S01E02 - Funkciók és megoldások a konyhában",1449,0,"gepek|tarolas|meretek|vilagitas",17000,"konyharol-konyhara",2],
["0mEraQKanrg","Stílusos és egyedi konyha",236,0,"gepek|tarolas",17000,"",0],
["1T3_bnYDrzU","Fantasztikus zöld konyha dizájn elemekkel",251,0,"gepek|meretek|kesz-konyha|vilagitas",16000,"",0],
["MPykXTi0J_o","Kamrák és kamraszekrények - ötletes konyhatervezés",163,0,"tarolas",16000,"",0],
["f1wtHQyRfpw","Modern konyha pultba épített elszívóval",433,0,"kesz-konyha",16000,"",0],
["_yAhaUUTuSk","Ritka konyha extrákkal",292,0,"gepek|tarolas",15000,"",0],
["TmvEb27ddYc","(cím nélküli short)",23,0,"kesz-konyha",14000,"",0],
["aejOBkJNXYo","Elegáns és fiatalos konyha",223,0,"kesz-konyha",13000,"",0],
["6el40c4yF2c","Klasszikus konyhabútor - tervezés és teljes kivitelezés",339,0,"kivitelezes|kesz-konyha",13000,"",0],
["iKbeZNQY1to","Letisztult és rendezett konyha Egerből",574,0,"gepek|kivitelezes|atalakitas|vilagitas|mosogato",13000,"",0],
["xlYYqrU8nuY","Modern konyha klasszikus hangulatban",221,0,"kesz-konyha",13000,"",0],
["ydGA8x9VQLM","Sárközi Ákos a bemutatótermünkben",367,0,"kesz-konyha",13000,"sarkozi",4],
["dx91R5wcCdM","Harmonikus elegancia az aranyló konyhában",268,0,"gepek|tarolas|kesz-konyha|vilagitas|mosogato",12000,"",0],
["q2QoWm1Wc1o","Sárközi Ákos konyhája egy percben!",66,0,"kesz-konyha",12000,"sarkozi",3],
["2o8HJG3yMrw","Ideiglenes konyha 1-2 évre? Wooow",36,1,"kesz-konyha",11391,"",0],
["fjz-zGNAGoc","(cím nélküli short)",22,0,"kesz-konyha",11000,"",0],
["ByqLwR4iw_c","Jó ötletek: hogyan rejtsük el",42,0,"kesz-konyha",11000,"",0],
["uMEZTmXXOv8","Stílusosan berendezett lakás szíve: a konyha",228,0,"gepek|tarolas|kivitelezes|atalakitas|mosogato",11000,"",0],
["fZXZPEFGTgo","Különleges és esztétikus családi konyha",327,0,"kesz-konyha",10000,"",0],
["myFbLPBPUJw","Otthonos családi konyha",284,0,"gepek|tarolas|kivitelezes",9900,"",0],
["OWH6pavwMKg","Konyhatrend 2026-ban? A szakértők mennyire követik a trendeket?",79,1,"kesz-konyha",9800,"",0],
["g0XxDfN3ggQ","Épített konyha egyedi konyhatervezéssel",84,0,"kesz-konyha",9500,"",0],
["pZnSZ1ag5us","Kis konyha tele ötletes megoldásokkal",90,0,"kis-konyha",9400,"",0],
["YmewFJQXwoA","Impozáns és letisztult családi konyha",348,0,"gepek|meretek|mosogato",9300,"",0],
["_HhElIXVlSA","Ízléses és lenyűgöző konyha",296,0,"gepek",9300,"",0],
["WeB_-_NPYis","Karakteres, kék és világos-tölgy konyha",403,0,"kesz-konyha",9200,"",0],
["eIEyfvCQ-64","Sárközi Ákos és Évi receptje: palacsinta torta",309,0,"kesz-konyha",9200,"sarkozi",9],
["4B2SI_s0noU","Tetőtéri modern konyha - ötletes kialakításokkal",618,0,"kis-konyha|kesz-konyha",8700,"",0],
["qD920uIQ8c4","Jó ötletek: rusztikus és praktikus konyhabútorok",196,0,"kesz-konyha",8600,"",0],
["mzWb6B4Ftjo","Cseh László is a Konyhaszakértőt választotta",327,0,"kesz-konyha",8300,"",0],
["q2_RpeJav2M","Konyháról konyhára S01E04 - Géptanácsadás",1308,0,"gepek",7900,"konyharol-konyhara",4],
["evKfGOxdXLs","Szilveszteri főzés Sárközi Ákossal",1087,0,"kesz-konyha",7300,"sarkozi",6],
["Z9kHtFESB9I","Modern konyha mindennapi használatra",327,0,"kesz-konyha",7000,"",0],
["eFU1gTOzh8g","Géptanácsadás Sárközi Ákossal",499,0,"gepek",6800,"sarkozi",5],
["OhB6onrV70A","Lenyűgöző és harmonikus konyha",237,0,"kesz-konyha",6300,"",0],
["rU5hUD5DBWs","Titkos tároló az igazi háziasszonyoknak",12,1,"tarolas",5936,"",0],
["CTVtZKTFLFc","Berendeztünk egy teljes lakást Budapesten",423,0,"tarolas|atalakitas",5400,"",0],
["0AWTYtcMLQc","Modern konyha ötletek a Konyhaszakértőtől röviden",107,0,"kesz-konyha",5400,"",0],
["FEjdDmtz7nU","Rusztikus konyha egy kiállításon 2003-ban",224,0,"kesz-konyha",5200,"",0],
["kuP1SVdnDkw","Ismerd meg a minőségi konyhabútorok világát",96,0,"kesz-konyha",5100,"",0],
["EGjdYl1Ffnc","Modern konyhabútorok praktikus ötletekkel",108,0,"kesz-konyha",5000,"",0],
["X-fGku3-rHQ","Karácsonyi főzés Sárközi Ákossal",1172,0,"kesz-konyha",4400,"sarkozi",7],
["oDuQf7qCme4","Konyhaötletek: a mosogató",47,0,"mosogato",4300,"",0],
["3RWeZYeUpOs","Imádom a konyhádat!",133,0,"kesz-konyha",3700,"ugyfelsztori",2],
["s0kh9hOr6ac","Tippek modern konyhákhoz - Electrolux kompakt készülékek",71,0,"gepek|kivitelezes",3700,"",0],
["CpQkfqdiTs0","Felújítottunk egy patinás budapesti lakást",372,0,"gepek|tarolas|kis-konyha|kivitelezes|atalakitas",3500,"",0],
["9ApwczXKEvs","Ajánlom a Konyhaszakértőt!",167,0,"kesz-konyha",3200,"ugyfelsztori",1],
["PQOnGIEnwBo","Letisztult, kézreálló konyha a Duna partján",395,0,"kesz-konyha",3200,"",0],
["dbIox8Ymytw","Szívből ajánlom a Konyhaszakértőt!",163,0,"kesz-konyha",3100,"ugyfelsztori",3],
["lEXTAKMyK0E","Sárközi Ákos receptje: sült lazac tésztával",278,0,"kesz-konyha",3000,"sarkozi",8],
["xhqgUruSqgo","Ich liebe sehr deine Küche! Landhaus Küchen",282,0,"kesz-konyha",2800,"",0],
["dfpPOeaqUOI","Landhaus Küchen mit praktischen Lösungen",268,0,"kesz-konyha",2600,"",0],
["3WOEDQ3JFSk","Konyhaötletek: tűzhelybe épített páraelszívó",30,0,"gepek",2500,"",0],
["6yuUrsaK6X0","Budai klasszikus konyha",189,0,"kesz-konyha",2200,"",0],
["OREL3UDb5sA","Tippek modern konyhákhoz - Beépíthető AEG mosogatógépek",61,0,"gepek|kivitelezes|mosogato",2000,"",0],
["sYqSb6RI0ec","Hiányzik a konyhából a sok konnektor?",26,0,"vilagitas",1900,"",0],
["61ZJzjlM1Fw","Exkluzív irodai konyha",328,0,"kesz-konyha",1700,"",0],
["I7BPW0Lt9KY","Konyhaötletek: világítás",31,0,"vilagitas",1700,"",0],
["qfv9kp5YrK4","Konyhaötletek: lábbal nyitható kuka",31,0,"kesz-konyha",1600,"",0],
["nFEKmWF4Os0","Formabontó: nyitott kisgéptároló esztétikus gépeknek",26,1,"gepek|tarolas",1352,"",0],
["8eBAfJhMMck","(cím nélküli short)",26,0,"kesz-konyha",1300,"",0],
["gtEkbd34BZI","Hatalmas mosogató óriási főzésekhez",20,1,"mosogato",1223,"",0],
["A4nHmF6BFto","Nem győzzük hangsúlyozni, mennyire fontosak a pultmagasságok",30,1,"meretek",1091,"",0],
["6lopFt_J1To","Apró részletek: mosogató munkaállomás",30,0,"mosogato",1000,"",0],
["SfKPHbOXx-0","Van, akinek fontos a konyha és van, akinek nem. Neked?",49,1,"kesz-konyha",959,"",0],
["B3FHpIhA1eY","A közösségi térben nem vagyunk háttal a társaságnak, ugye?",30,1,"kesz-konyha",958,"",0],
["Axxl1asBE8I","Féltve őrzött titkát osztja meg a Konyhaszakértő!",60,1,"kesz-konyha",938,"",0],
["qB2Wvu4R0bs","Apró részletek: konnektorok",22,0,"vilagitas",920,"",0],
["dWIxLbxoa98","Könnyű a rosszhoz hozzászokni, de a jóhoz még könnyebb",90,1,"hibak",900,"",0],
["O9u5Eyv2jZ8","Van megoldás arra, ha valami nem esztétikus. Mutatjuk!",10,1,"kesz-konyha",887,"",0],
["qLtaZy_D1_E","Apró részletek: háztartási gépek",17,0,"gepek",856,"",0],
["RgCpO_xebQA","Pokoli géptornyok",17,1,"gepek",850,"",0],
["PN46lIQUvOU","Régóta szeretnél egy „konyhaszakértős„ konyhát? Nem vagy egyedül!",20,1,"kesz-konyha",841,"",0],
["mzwdRMAVDhA","Itt egy újabb 3D konyhaterv-gyűjtemény!",25,1,"kesz-konyha",840,"",0],
["QeAO030gM2w","„Kamra a sütő mellett nem szerencsés.” Eloszlatjuk a kételyeket",43,1,"gepek|tarolas",838,"",0],
["67n16JkqOBE","Mi van akkor, ha az ügyfélnek nincs elég pénze az új gépekre? Megoldjuk",34,1,"gepek",810,"",0],
["Fl0bj5VAcf8","Nálunk a tervezésre elégedettségi garancia van",66,0,"kesz-konyha",791,"",0],
["0fdgW6Rb1pw","Modern Küchen Ideen",291,0,"kesz-konyha",762,"",0],
["UwD2PNiWIHw","Micsoda? Kamra a szekrényben?",22,1,"tarolas",749,"",0],
["kX6_yj4qZ1s","(cím nélküli short)",12,0,"kesz-konyha",681,"",0],
["d0N9qROWF2U","(cím nélküli short)",47,0,"kesz-konyha",671,"",0],
["PRjJrPwpGpI","Konyhabemutató egy percben: nagypolgári konyha Budapestről",37,1,"kesz-konyha",664,"",0],
["hSomtvXWTt4","Ezért ne vedd meg előre a konyhai gépeket!",93,1,"gepek",663,"",0],
["AzDS6w6W3JU","(cím nélküli short)",22,0,"kesz-konyha",641,"",0],
["ASVzhHb_lV4","(cím nélküli short)",30,0,"kesz-konyha",639,"",0],
["L9XSX4sUnIg","Pultmagasságok és könyvek hálójában",41,1,"meretek",624,"",0],
["MicRROIzPEk","Izgalmas emberek, izgalmas konyhatervezések",71,1,"kesz-konyha",594,"",0],
["VqGD6rfgrdg","Milyen látványtervek készülnek a konyhákhoz?",24,1,"kivitelezes",578,"",0],
["FuUlP8MT_Y4","51% praktikum, 49% esztétika, de hogyan lesz szép és funkcionális a konyha?",90,1,"kesz-konyha",564,"",0],
["Z5eMJhN7ApQ","„Egy konyhafelújítás általában ott kezdődik el, hogy elromlik egy gép”",67,1,"gepek|kivitelezes|atalakitas",547,"",0],
["ggM8VUICNNk","Géptanácsadás a világ legjobb géptanácsadójával",68,1,"gepek",534,"",0],
["5ZIVpnKdwW4","Nem hiszed el: ez nem egy bemutatótermi konyha",25,1,"kesz-konyha",519,"",0],
["i8DuLMdl3eo","Kirakatkonyha? Az a konyha nem a kommentelőnek készült",30,1,"kivitelezes",493,"",0],
["Hy-EVGeKIrc","„Nem szeretek főzni.„ De vajon mi az oka?",56,1,"kesz-konyha",463,"",0],
["4KRpzpW4vZg","Két oldalhoz két kuka dukál, és a Konyhaszakértőt is megdupláztuk",16,1,"kesz-konyha",462,"",0],
["wrZUF0P6ufU","A géptanácsadás értéke, pláne egy ilyen szerény szakemberrel",105,1,"gepek",446,"",0],
["VoRrXAh0B_E","Tűz és víz. Érdekes, mégis praktikus elrendezés!",26,1,"kesz-konyha",432,"",0],
["N6BWaqa8DVU","Empfehle herzlich die Küchenexpert",164,0,"kesz-konyha",429,"",0],
["o-k2YgPDVfQ","Okoskonyhák, mint a sci-fikben. Hol tart a technológia?",77,1,"kesz-konyha",414,"",0],
["kFnw9TBZ2lg","Modern minimal Küchen",332,0,"kesz-konyha",411,"",0],
["As3hiGtMB78","Mosogatás mesterfokon! Jól átgondolt vizesblokk a konyhában",30,1,"kivitelezes",408,"",0],
["CiX3UabfP0s","Na de ki tervezze a konyhát: a lakberendező vagy a konyhaszakértő?",36,1,"atalakitas",398,"",0],
["4pB_FfUsiGk","Nagypolgári belvilág + magas tulajdonosok = grandiózus hatás",18,1,"kesz-konyha",373,"",0],
["8p4nXBP_EIA","ELŐTTE és UTÁNA. „Olyan szakértőt kerestünk, aki...”",18,1,"atalakitas",366,"",0],
["BAuSQquePyo","Modern és extra megoldások: lebegő hűtő, elszívós lámpa, síkba épített főzőlap",22,1,"gepek|vilagitas",362,"",0],
["pVwJOJcOqOs","Ich kann den Küchenprofi nur empfehlen!",167,0,"kesz-konyha",354,"",0],
["CkKb21GOzfk","Miért és hogyan történik a géptanácsadás?",89,1,"gepek",317,"",0],
["D8hFGehsODs","Itt a megoldás arra, hogyan vásároljunk konyhai gépeket",85,1,"gepek",311,"",0],
["61k0-y6Aqh4","Hol kapcsolódik össze a lakberendezés és a konyhatervezés?",73,1,"atalakitas",294,"",0],
["zDGLL6JTUNA","Éppen divatos konyha? És mi lesz pár év múlva?",31,1,"kesz-konyha",293,"",0],
["MigUKxyDNxw","Az időzítés a legfontosabb",44,1,"kesz-konyha",290,"",0],
["e4xneP0rPcs","Hogyan választana lakberendezőt a Konyhaszakértő?",45,1,"atalakitas",284,"",0],
["Xlw15IOWNlk","Rossz adottságok? Nem baj, megoldjuk!",22,1,"hibak",256,"",0],
["QqrdPH9BzCc","A villanyszerelő megmondta. Szakemberek ellentmondásban?",79,1,"kivitelezes",179,"",0],
["r8CnDLMLqYc","Esztétika vs praktikum",107,1,"kesz-konyha",98,"",0]
];

export const videos: Video[] = RAW.map(([id, title, duration, t, topics, views, series, episode]) => ({
  id, title, duration, views,
  age: AGES[id] ?? 0,
  vintage: (AGES[id] ?? 0) >= 60,
  slug: slugify(title, id),
  description: "",
  type: t === 1 ? "short" : "long",
  topics: topics.split("|"),
  ...(MINI[id]
    ? { series: MINI[id][0], episode: MINI[id][1] }
    : series
    ? { series, episode: episode || undefined }
    : {}),
}));

/** Csak a valóban sorszámozott sorozatoknál mutatunk "N. rész" jelvényt. A Sárközi- és ügyfélsztori-sor csak rendezett gyűjtemény. */
export const NUMBERED_SERIES = new Set<string>(["konyharol-konyhara", ...new Set(Object.values(MINI).map(m => m[0]))]);
export const episodeLabel = (v: Video) => (v.series && v.episode && NUMBERED_SERIES.has(v.series) ? `${v.episode}. rész` : "");

export const bySlug = (s: string) => videos.find(v => v.slug === s);
export const byId = (i: string) => videos.find(v => v.id === i);
export const byTopic = (t: string) => videos.filter(v => v.topics.includes(t));
export const bySeries = (s: string) =>
  videos.filter(v => v.series === s).sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0));
export const shorts = () => videos.filter(v => v.type === "short");
export const current = () => videos.filter(v => !v.vintage);
export const archive = () => videos.filter(v => v.vintage).sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
