export type HardcodedQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type HardcodedCategory = {
  title: string;
  questions: HardcodedQuestion[];
};

/** Brzi odgovori bez Anthropic tokena; share ide kroz isti /api/share/answers kao AI. */
export const HARDCODED_QA: { categories: HardcodedCategory[] } = {
  categories: [
    {
      title: 'Prava koja možda ne znaš da imaš',
      questions: [
        {
          id: 'rodiljni',
          question:
            'Imam paušalni obrt i trudna sam. Moram li zatvoriti obrt?',
          answer:
            'Ne moraš. Imaš pravo na rodiljni dopust i rodiljnu naknadu. Obrt ide u mirovanje — prestaju obveze doprinosa i poreza.\n\n**Naknada:** 100% osnovice za plaćanje doprinosa ako imaš 6 mjeseci neprekidnog staža. Bez dovoljnog staža: 701,89€/mj.\n\n**Opcija:** Možeš koristiti i rad s polovicom radnog vremena — tada obrt NE mora u mirovanje, a plaćaš 50% doprinosa.\n\nZahtjev se podnosi HZZO-u. Obavezni dio rodiljnog dopusta traje od 28 dana prije poroda do 70 dana nakon poroda.\n\nDetalje provjeri na [kvik.online/vodici](https://kvik.online/vodici)',
        },
        {
          id: 'ocinski',
          question: 'Imam li pravo na očinski dopust kao paušalist?',
          answer:
            'Da. Od 1. ožujka 2025. očinski dopust traje **20 radnih dana** (30 za blizance).\n\n**Naknada:** 100% osnovice, bez gornje granice.\n\nMoraš ga iskoristiti u kontinuitetu, do 6. mjeseca djetetova života. Poslodavac ga NE MOŽE odbiti — to je zakonsko pravo.\n\n**Za samozaposlene:** tjedan se računa kao 6 radnih dana, neovisno o stvarnom radnom vremenu. 20 radnih dana = otprilike 23-24 kalendarska dana.\n\n**Bonus:** Uz očinski dopust, imaš i pravo na 7 radnih dana plaćenog dopusta iz Zakona o radu povodom rođenja djeteta. To plaća poslodavac, ne HZZO.\n\nPisanu obavijest poslodavcu daješ najmanje 15 dana ranije.',
        },
        {
          id: 'druga-djelatnost',
          question:
            'Radim u firmi i imam obrt uz posao. Koliki su mi doprinosi?',
          answer:
            'Ako je obrt **druga djelatnost** (uz zaposlenje), plaćaš manje doprinosa jer ti firma već plaća MIO i HZZO.\n\n**Za 2026. godinu:**\n- Osnovica: 797,20€\n- MIO I stup (15%): 119,58€\n- MIO II stup (5%): 39,86€\n- HZZO: **ne plaćaš** — osiguran si preko poslodavca\n\n**Ukupno: 159,44€/mj** umjesto 290,98€ koliko plaća obrtnik kojemu je obrt jedina djelatnost.\n\nTočan izračun za tvoju situaciju → [kvik.online/alati/kalkulator-poreza](https://kvik.online/alati/kalkulator-poreza)',
        },
        {
          id: 'bolovanje',
          question: 'Što je s bolovanjem kad imam paušalni obrt?',
          answer:
            'Kao paušalist imaš pravo na naknadu za bolovanje. Prvih **42 dana** plaćaš iz vlastitih sredstava obrta. Od 43. dana naknadu isplaćuje HZZO.\n\n**Iznos od HZZO-a:** ovisi o osnovi osiguranja, najčešće oko 70% osnovice, s limitom od 995,45€/mj.\n\n**Važno:** Za vrijeme bolovanja obrt NE mora u mirovanje — ali ne smiješ raditi. Doprinose i dalje plaćaš.\n\nAko bolovanje traje duže od 42 dana, prijavi se HZZO-u s izvješćem liječnika.',
        },
      ],
    },
    {
      title: 'Česte brige i zamke',
      questions: [
        {
          id: 'jedan-kupac',
          question:
            'Imam samo jednog kupca. Je li to prikriveni radni odnos?',
          answer:
            'Može biti. Porezna provjerava: radiš li po njihovom rasporedu, koristiš li njihov prostor i opremu, određuješ li sam način rada.\n\n**Crvene zastavice:**\n- Samo jedan kupac koji čini 100% prihoda\n- Kupac ti diktira radno vrijeme\n- Koristiš njihov ured/opremu\n- Nemaš drugih klijenata duže vrijeme\n\n**Posljedica:** Prekvalifikacija u radni odnos + retroaktivno plaćanje svih doprinosa kao da si bio zaposlenik.\n\n**Kako se zaštititi:** Imaj barem 2-3 kupca, koristi vlastitu opremu, sam određuj radno vrijeme, potpišite ugovor o djelu/usluzi koji jasno definira odnos.',
        },
        {
          id: 'limit-60k',
          question: 'Što ako prekoračim 60.000€ prometa?',
          answer:
            'Gubiš paušalni status. **MORAŠ** prijeći na obrt s poslovnim knjigama ili d.o.o.\n\n**Važno:** Ne možeš se vratiti na paušal sljedeće godine samo zato što je nova kalendarska godina — ako si sustavom prihoda izašao iz paušalnog režima, formalni sljedeći koraci ovise o tvojoj situaciji i obavijestima Porezne. Paušalni limit od 60.000 € i PDV prag su u praksi isti prag — pri prelasku postaješ PDV obveznik prema pravilima koja te se tiču.\n\nZa KPR, PO-SD i prijelazne korake vidi [kvik.online/vodici](https://kvik.online/vodici).',
        },
        {
          id: 'pdv-vs-pausal',
          question: 'Je li PDV prag isti kao limit od 60.000 € za paušal?',
          answer:
            'U praksi za tipičan paušalni obrt **da** — oba praga su na **60.000 €** godišnjih primitaka (u smislu koji zakon propisuje za tvoj slučaj).\n\n**Bitno:** prelazak znači i promjenu načina vođenja evidencija i obveza prema Poreznoj — ne radi se o “samo malo preko pa opet ispod”. Ako si blizu praga, prati KPR i primitke tijekom godine.\n\nViše o PDV ID-u i EU uslugama u vodičima: [kvik.online/vodici/pdv-id](https://kvik.online/vodici/pdv-id)',
        },
        {
          id: 'mirovanje',
          question: 'Mogu li “pauzirati” obrt ako trenutno nemam primitaka?',
          answer:
            'Ako formalno ne obavljaš djelatnost, postoji **mirovanje obrta** kao put da ne izgledaš kao aktivan obrt bez prijava — ali postupak i posljedice za doprinose i porez ovise o tome jesi li zaposlen/a drugdje i što točno prijavljuješ.\n\n**Ne miješaj** “nemam klijenata ovaj mjesec” s mirovanjem — dok si aktivan u registru, obveze te mogu i dalje pratiti.\n\nKorak-po-korak vodič: [kvik.online/vodici/sezonski-obrt](https://kvik.online/vodici/sezonski-obrt) (mirovanje i sezonalnost).',
        },
      ],
    },
    {
      title: 'Rokovi, KPR i sljedeći koraci',
      questions: [
        {
          id: 'rokovi-doprinos-porez',
          question: 'Koji su tipični rokovi za doprinose i paušalni porez?',
          answer:
            '**Doprinosi** (samostalan obrt): do **15. u mjesecu** za prethodni mjesec.\n\n**Porez na dohodak (paušal):** kvartalno — krajnji datumi su **31.3.**, **30.6.**, **30.9.** i **31.12.** (za prethodno tromjesečje).\n\n**PO-SD:** do **15. siječnja** za prethodnu godinu.\n\nSažetak datuma: [kvik.online/vodici/rokovi-placanja](https://kvik.online/vodici/rokovi-placanja)',
        },
        {
          id: 'sto-je-kpr',
          question: 'Što je KPR i moram li ga voditi u paušalu?',
          answer:
            '**KPR** (knjiga prometa računa) je evidencija **naplaćenih** primitaka po računima. U paušalu je obvezna — iz nje kasnije “čitaš” brojke za **PO-SD**.\n\nSvaki naplaćeni račun treba imati red u KPR-u isti dan ili kad naplatiš, ovisno o pravilu koje primjenjuješ — bitna je dosljednost s bankom i računima.\n\nVodič: [kvik.online/vodici/kpr-knjiga-prometa](https://kvik.online/vodici/kpr-knjiga-prometa)',
        },
        {
          id: 'po-sd-sto',
          question: 'Što je PO-SD i što tamo predajem?',
          answer:
            '**PO-SD** je godišnji iskaz primitaka i plaćenog paušalnog poreza za prošlu godinu. Predaje se Poreznoj (ePorezna) uz rok **do 15. siječnja**.\n\nAko KPR nije u redu, PO-SD postaje težak — prvo sredi KPR, pa obrazac.\n\nVodič: [kvik.online/vodici/po-sd-obrazac](https://kvik.online/vodici/po-sd-obrazac)',
        },
        {
          id: 'alati-kviz',
          question: 'Gdje su alati za izračun doprinosa i paušalnog poreza?',
          answer:
            'Na Kviku imaš kalkulatore i generatore usklađene s vodičima za 2026.\n\n- [Kalkulator paušalnog poreza](https://kvik.online/alati/kalkulator-poreza)\n- [Plaćanje doprinosa / barkod](https://kvik.online/alati/doprinosi)\n- Širi kontekst: [kvik.online/alati](https://kvik.online/alati)',
        },
      ],
    },
  ],
};
