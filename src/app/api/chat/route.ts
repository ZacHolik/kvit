import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/** Sažeta interna knowledge base (Kvik vodiči/alati); bez vanjskih konkurentnih portala. */
const SYSTEM_PROMPT = `Ti si Kvik AI asistent za hrvatske paušalne obrtnike.

JEZIK I TON:
- Odgovaraj ISKLJUČIVO na hrvatskom standardnom jeziku
- NIKAD ne koristi srpske izraze: "desiti" → "dogoditi",
  "DDV" → "PDV", "firma" → "tvrtka/obrt", "ukoliko" → "ako",
  "takođe" → "također", "iznos" ostaje iznos
- NIKAD ne koristi ćirilično pismo
- Budi konkretan, praktičan i prijateljski
- Nikad ne izmišljaj informacije - ako nešto ne znaš, reci to
- Ne davaj pravne ni porezne savjete - usmjeri na stručnjaka

TOČNE INFORMACIJE O PAUŠALNOM OBRTU:
- Godišnji limit primitaka je 60.000€
- Ako paušalist PRIJEĐE 60.000€ u kalendarskoj godini,
  MORA prijeći na drugi porezni režim (obrt s knjigama ili
  d.o.o.) - NE resetira se sljedeće godine
- Porezni razredi određuju VISINU paušalnog poreza,
  ali 60.000€ je APSOLUTNA GRANICA za paušalni status
- PDV prag je također 60.000€ - pri prelasku postaje
  PDV obveznik

=== KNOWLEDGE BASE ===

# IZVOR: FISKALOPEDIJA.HR

## https://fiskalopedija.hr/baza-znanja/izrada-racuna

﻿
Izrada računa u paušalnom obrtu
 ﻿
# Izrada računa u paušalnom obrtu
Ažurirano: 22.04.2026.
👍 291 [💬 Komentara (13)](https://fiskalopedija.hr/baza-znanja/izrada-racuna#zajednica)
## Nakon ovog članaka znat ćete što vam treba i kako kreirati račun u paušalnom obrtu
Prije kreiranja prvog računa trebate pripremiti dokument koji se zove **Interni akt**. Internim aktom se definira slijednost brojeva vaših računa, oznaka poslovnog prostora i naplatnog uređaja te blagajnički maksimum. Znam da vam nije jasno zašto morate definirati oznaku poslovnog prostora i oznaku naplatnog uređaja kada nemate poslovni prostor niti fizičku blagajnu. Nije ni važno. Oznaka poslovnog prostora i naplatnog uređaja su administrativne oznake koju zapravo tvore broj računa.
Ako ne znate što staviti pod oznaku poslovnog prostora predlažem **POSL1**, a pod oznaku naplatnog uređaja **1**. To bi značilo da će vaši brojevi račun izgledati na sljedeći način 1-POSL1-1, 2-POSL1-1, 3-POSL1-1 i tako dalje. Na taj način ćete to definirati u internom aktu i te numeracije se držati kod kreiranja računa. Tako ste si osigurali da je sve zakonski ispravno.
Zadnja stvar koja se definira internim aktom je iznos **blagajničkog maksimuma**. To je zapravo količina gotovog novca (novčanica) kojeg smijete držati kod sebe u blagajni ako ju imate. Kada dosegnete definirani iznos gotovine morali biste ga maknut iz blagajne.
U nastavku dostavljamo link na primjer [internog akta.](https://www.porezna-uprava.hr/pozivni_centar/Stranice/interni-akt-jedan-poslovni-prostor.aspx)
Trebate podršku prilikom izrade internog akta? Želite da ga mi izradimo za vas?
[📞 Javite se →](https://fiskalopedija.hr/usluge)
[**Isprobaj program za izradu računa**\\
\\
Program za **izdavanje računa i eRačuna**, eArhivu, evidenciju plaćanja i izvještavanje – sve u jednom.\\
\\
\\
\\
\\
Želite se i vi ovdje oglašavati?
Nema problema! Na fiskalopedija.hr imamo generator internog akta. Jednostavno idite na naš generator te zamijenite postojeće podatke

---

## https://fiskalopedija.hr/baza-znanja/pausalni-obrt

﻿
Paušalni obrt – vodič za početnike (obveze, rokovi i prednosti)
 ﻿
# Paušalni obrt – vodič za početnike (obveze, rokovi i prednosti)
Ažurirano: 17.02.2026.
👍 414 [💬 Komentara (66)🔥](https://fiskalopedija.hr/baza-znanja/pausalni-obrt#zajednica)
## Paušalni obrt je najjednostavniji i najjeftiniji način za ulazak u poduzetništvo. Obrt čije je vođenje pojednostavljeno.
Paušalni obrt je klasičan obrt čije je vođenje pojednostavljeno. U paušalnom obrtu imate vrlo malo obveza. Mjesečno morate plaćati fiksni iznos doprinosa, te tromjesečno porez na dohodak.
Od preostalih obveza tu je vođenje KPR (Knjige prometa računa) i na kraju godine treba predati PO-SD obrazac.
I to je to! Za vođenje paušalnog obrta vam ne treba računovodstvo.
Možemo zaključiti da je paušalni obrt običan obrt čije je vođenje maksimalno pojednostavljeno. Isto tako davanja u paušalnom obrtu su najmanja moguća pa je paušalni obrt najjeftiniji oblik poslovanja.
Naravno, uz ove prednosti ima i svoja ograničenja koja ćemo spomenuti u nastavku.
Vođenje paušalnog obrta je vrlo jednostavno. U paušalnom obrtu dužni ste za svaki primitak [izdati račun](https://fiskalopedija.hr/baza-znanja/izrada-racuna). Navedene primitke odnosno račune potrebno je na kraju dana upisati u knjigu prometa (KPR). Na kraju godine je potrebno zbrojiti sve primitke u godini te ih prijaviti na poreznu putem [PO-SD obrasca](https://fiskalopedija.hr/baza-znanja/po-sd-obrazac). Do 15. u mjesecu je potrebno platiti doprinose, a svaka tri mjeseca odnosno kvartalno je potrebno uplatiti paušalni porez na dohodak prema pripadajućem poreznom razredu.
Uz izdavanje računa morate biti sposobni i zaprimati [eRačun](https://fiskalopedija.hr/elektronicki-racun). To znači da ako dođe do situacije da vam netko treba izdati račun na obrt da ga vi možete zaprimiti kao [eRačun](https://fiskalopedija.hr/elektronicki-racun). Ovo je najjednostavnije kroz [Mikroeračun](https://fiskalopedija.hr/mikroeracun-aplikacija) aplikaciju ili već kroz postojeći program

---

## https://fiskalopedija.hr/baza-znanja/po-sd-obrazac

﻿
Izrada PO-SD obrasca 2025.
 ﻿
# Izrada PO-SD obrasca 2025.
Ažurirano: 08.01.2026.
👍 407 [💬 Komentara (83)🔥](https://fiskalopedija.hr/baza-znanja/po-sd-obrazac#zajednica)
## Ovdje ćete saznati kao ispuniti PO-SD obrazac u paušalnom obrtu
Ovaj obrazac se koristi samo u paušalnom obrtu. PO-SD obrazac je izvještaj o ukupnim primicima i plaćenom porezu u prethodnoj godini.
To bi značilo da putem PO-SD obrasca jednom godišnje prijavljujete koliko ste u prethodnoj godini imali primitaka i koliko ste poreza uplatili.
Predaje se do 15.1. za prethodnu godinu.
[**Neka ti program sam izrađuje PO-SD obrazac**\\
\\
Program za **izdavanje računa i eRačuna**, eArhivu, evidenciju plaćanja i izvještavanje – sve u jednom.\\
\\
\\
\\
\\
Želite se i vi ovdje oglašavati?
Primjer PO-SD obrasca kojeg možete prilagoditi svojim potrebama možete naći na linku niže. Upišite svoje primitke, iznos poreza koji ste uplatili i sve ostalo će obrazac za vas izračunati.
[Izrada PO-SD obrasca](https://fiskalopedija.hr/po-sd-obrazac)
Aktualan PO-SD obrazac u PDF formatu možete naći na stranicama porezne uprave na sljedećem
[linku](https://porezna-uprava.gov.hr/UserDocsImages/Dokumenti%20obrasci/PO-SD%20za%202025.pdf)
Najlakši način je da odete na naš [primjer obrasca](https://fiskalopedija.hr/po-sd-obrazac) upišete svoje primitke od prethodne godine, upišete iznos poreza kojeg ste uplatili, obrazac će ostale iznose sam izračunati. Nakon što obrazac preostale iznose izračuna možete ih prepisati u ePoreznu i predati PO-SD obrazac.
Drugi način je da preuzmete PO-SD obrazac sa sljedećeg
[linka](https://www.porezna-uprava.hr/HR_obrasci/Documents/POREZ%20NA%20DOHODAK/PO-SD%20za%202024.pdf) te ga ručno ispunite.
Niže je naveden primjer popunjavanja za one koji su poslovali samostalno cijelu godinu. Na slici su označene točke iz uputa ispod slike:
Točka 1. U polje "Primici naplaćeni u gotovini" upisujete koliko ste u prethodnoj godini naplatili putem gotovine ili kartica
Točka 2. U polje "Primici naplaćeni be

---

## https://fiskalopedija.hr/baza-znanja/turisticka-clanarina-tz1-obrazac

﻿
Turistička članarina: TZ1 obrazac i plaćanje
 ﻿
# Turistička članarina: TZ1 obrazac i plaćanje
Ažurirano: 02.04.2026.
👍 273 [💬 Komentara (14)](https://fiskalopedija.hr/baza-znanja/turisticka-clanarina-tz1-obrazac#zajednica)
## Vodič, korak po korak tko i kako treba ispuniti TZ1 obrazac te platiti turističku članarinu
Članarinu turističkoj zajednici trebate plaćati ako imate registriranu djelatnost koja se bavi uslugama u turizmu, ugostiteljskim uslugama ili imate registriranu djelatnost koja ima koristi od turizma.
Često su nam se javljali korisnici koji se ne bave turizmom ili ugostiteljstvom ali su ipak dužni platiti članarinu turističkoj zajednici jer imaju registriranu djelatnost koja podliježe plaćanju kao što je izdavaštvo ili izrada filmova.
**VAŽNO:** u paušalnom obrtu osnovica za turističku članarinu je ukupan primitak ako postoji barem jedan račun/primitak koji podliježe plaćanju turističke članarine
Djelatnosti koje su dužne plaćati članarinu turističkoj zajednici podijeljene su u 5 skupina:
**Prva skupina plaća 0,14212% na ukupne godišnje prihode**, a u nju spadaju:
49.31 Gradski i prigradski kopneni prijevoz putnika
49.32 Taksi-služba
49.39 Ostali kopneni prijevoz putnika, d. n.
50.1 Pomorski i obalni prijevoz putnika
51.10 Zračni prijevoz putnika
52.23 Uslužne djelatnosti u vezi sa zračnim prijevozom
55 Smještaj
56 Djelatnosti pripreme i usluživanja hrane i pića
65.12 Ostalo osiguranje
66.12 Djelatnosti posredovanja u poslovanju vrijednosnim papirima i robnim ugovorima (djelatnosti mjenjačnica)
68 Poslovanje nekretninama
73.11 Agencije za promidžbu
77.21 Iznajmljivanje i davanje u zakup (leasing) opreme za rekreaciju i sport
79 Putničke agencije, organizatori putovanja (turoperatori) i ostale rezervacijske usluge te djelatnosti povezane s njima
82.3 Organizacija sastanaka i poslovnih sajmova
92 Djelatnosti kockanja i klađenja
93.12 Djelatnosti sportskih klubova
93.21 Djelatnosti zabavnih i tematskih parkova
93.29 Ostale zabavne i rekreacijske djelatn

---

## https://fiskalopedija.hr/baza-znanja/placanja-doprinosa-pausalni-obrt

﻿
Doprinosi za paušalni obrt 2026: iznosi, rokovi i kako platiti
 ﻿
# Doprinosi za paušalni obrt 2026: iznosi, rokovi i kako platiti
Ažurirano: 13.01.2026.
👍 380 [💬 Komentara (31)🔥](https://fiskalopedija.hr/baza-znanja/placanja-doprinosa-pausalni-obrt#zajednica)
## Ovdje ćete saznati kako i koliko uplatiti doprinosa u paušalnom obrtu. Koliko se plaća mirovinsko i koliko zdravstveno. Na koje račune treba uplatiti iznose za doprinose. Platite odmah putem [asistenta za plaćanje](https://fiskalopedija.hr/asistent-za-placanje-poreza-doprinosa)
Doprinosi u paušalnom obrtu (mirovinsko i zdravstveno osiguranje) plaća se do 15. u mjesecu za prethodni mjesec. Doprinosi se dijele na doprinosi za mirovinsko osiguranje 1. stup, mirovinsko osiguranje 2. stup i doprinosi za zdravstveno osiguranje.
Ne znate kada, kako i koliko platiti doprinose. Bojite se da u početku nešto ne zeznete? Trebate kratku uputu i pomoć oko plaćanja doprinosa?
Do 15. u mjesecu morate uplatiti 290,98€ doprinosa ukupno. Od čega se 119,58€ odnosi na 1. stup mirovinskog osiguranja, 39,86€ na 2. stup mirovinskog osiguranja i 131,54 na zdravstveno osiguranje.
**Tablični prikaz gore navedenog**
| Rok uplate | Mirovinsko 1. stup | Mirovinsko 2. stup | Zdravstveno | Ukupno |
| --- | --- | --- | --- | --- |
| Do 15. u mjesecu | 119,58 € | 39,86 € | 131,54 € | 290,98 € |
Zaboravljate platiti doprinose? Niste sigurni na koji IBAN, što upisati pod model i poziv na broj? Pitate se koji iznos uplatiti ovaj mjesec? Fiskalopedija vam nudi [kalkulator i asistenta za plaćanje](https://fiskalopedija.hr/asistent-za-placanje-poreza-doprinosa) koji će vam izračunati iznose, generirati točne podatke za uplatu, i pripremiti 2D barkod spreman za plaćanje te opcionalno svaki mjesec poslati na mail podsjetnik sa podacima za uplatu.
Ako ste zaposleni kod drugog poslodavca doprinosi se plaćaju jednom godišnje i to u roku od 15 dana od primitka rješenja porezne uprave. Na rješenju će pisati koliko ste dužni platiti.
U slučaju da ste p

---

## https://fiskalopedija.hr/baza-znanja/predaja-rpo-obrasca-online

﻿
RPO obrazac: kako ga ispuniti i predati putem ePorezne u 2026.
 ﻿
# RPO obrazac: kako ga ispuniti i predati putem ePorezne u 2026.
Ažurirano: 05.02.2026.
👍 563 [💬 Komentara (34)🔥](https://fiskalopedija.hr/baza-znanja/predaja-rpo-obrasca-online#zajednica)
## Kako ispuniti i predati RPO (Registar poreznih obveznika) obrazac online putem ePorezne?
Nakon što ste otvorili obrt u roku od 8 dana potrebno se upisati u registar poreznih obveznika putem RPO obrasca.
U nastavku ćemo pokazati na primjeru kako ispuniti RPO obrazac i kako se RPO obrazac predaje na poreznu online, putem ePorezne.
RPO obrazac je najlakše ispuniti putem ePorezne. Na ePoreznoj postoji apliakacijski obrazac koji vas vodi korak po korak i nudi opcije za upis. Nužni podaci koje će vas tražiti su:
| Korak | Opis |
| --- | --- |
| Korak 1 | Upis rezidentnosti i državljanstva |
| Korak 2 | Upis djelatnosti i predviđenog dohodka |
| Korak 3 | Potvrda da ste upisali istinite podatke |
Rpo obrazac se predaje u papirantom obliku u Poreznoj ili bolje putem [ePorezne](https://e-porezna.porezna-uprava.hr/).
U roku od 8 dana od otvaranja (rješenja) obrta potrebno je na poreznu predati RPO obrazac odnosno upisati se u registar poreznih obveznika.
Nakon što ste se prijavili na [ePoreznu](https://e-porezna.porezna-uprava.hr/Prijava.aspx?ReturnUrl=%2f) odaberete "Zahtjevi" pa "Prijava u registar poreznih obveznika (RPO)" prema dolje navedenoj uputi.
Nakon što se otvorio RPO obrazac na "Stranici 1" potrebno je upisati **Rezidentnost - država** i **Rezidentnost - datum**. Ovi podaci su vam vjerojatno unaprijed ispunjeni. Govore gdje i od kada ste porezni obveznik. U polju datum je vjerojatno upisan datum otvaranja vašeg obrta.
Nakon što ste kliknuli na gumb "Sljedeća" otvara vam se nova stranica gdje unosite razlog upisa u registar poreznih obveznika. U našem slučaju je to pod brojem **I - Obrt**
Na sljedećoj stranici (3 Dodatni podaci) potrebno je upisati **glavnu djelatnost** i **pretežitu djelatnost** koje ste defi

---

## https://fiskalopedija.hr/baza-znanja/otvaranje-pausalnog-obrta

﻿
Otvaranje paušalnog obrta 2026 – korak po korak vodič iz osobnog iskustva
 ﻿
# Otvaranje paušalnog obrta 2026 – korak po korak vodič iz osobnog iskustva
Ažurirano: 20.04.2026.
👍 249 [💬 Komentara (23)](https://fiskalopedija.hr/baza-znanja/otvaranje-pausalnog-obrta#zajednica)
## Korak po korak vodič za otvaranje paušalnog obrta iz stvarnog iskustva uz slike, primjere i sve potrebne korake.
Ovdje možete naći detaljnu uputu, korak po korak za otvaranje paušalnog obrta na primjeru otvaranja paušalnog obrta "Fiskalopedija, obrt za informatiku".
Ovu su stvarni koraci koje sam ja odradio kod otvaranja Fiskalopedija obrta - stvarni primjer iz prakse
1\. Odlazak na platformu [eObrt](https://e-obrt.gov.hr/)
2\. Otvaranje poslovnog računa u banci
3\. Prijava u sustav mirovinskog i zdravstvenog osiguranja (samo u slučaju da niste uz obrt zaposleni)
4\. Predaja [RPO](https://fiskalopedija.hr/baza-znanja/predaja-rpo-obrasca-online) obrasca (Upis u registar poreznih obveznika)
Ova 4 koraka za otvaranje paušalnog obrta su detaljno i konkretno raspisana niže u
[vodiču za otvaranje paušalnog obrta](https://fiskalopedija.hr/baza-znanja/otvaranje-pausalnog-obrta#korak-1-otvaranje-pausalnog-obrta-putem-platforme-eobrtt=Korak%201)
[Tko MOŽE otvoriti paušalni obrt](https://fiskalopedija.hr/baza-znanja/pausalni-obrt#:~:text=Tko%20mo%C5%BEe%20otvoriti%20pau%C5%A1alni%20obrt?)
[Tko NE može otvoriti paušalni obrt](https://fiskalopedija.hr/baza-znanja/pausalni-obrt#:~:text=Koje%20djelatnosti%20se%20NE%20mogu%20obavljati%20kroz%20pau%C5%A1alni%20obrt?)
1\. Nakon što ste završili proces upisa u [eObrt](https://e-obrt.gov.hr/) rješenje o otvaranju obrta bi vam u ePretinac trebalo stići za 8 dana.
2\. Otvaranje poslovnog računa u banci danas može biti online pa je to gotovo unutar istog dana
3\. Ako se prijavljujete na mirovinsko i zdravstveno upis najčešće odrađuju isti dan kada predate tiskanice
4\. RPO obrazac možete predati online ali njegova obrada može potrajati od nekoliko dana pa do nekol

---

## https://fiskalopedija.hr/baza-znanja/porez-na-dohodak-pausalni-obrt

﻿
Porez na dohodak u paušalnom obrtu u 2026. godini
 ﻿
# Porez na dohodak u paušalnom obrtu u 2026. godini
Ažurirano: 06.03.2026.
👍 303 [💬 Komentara (0)](https://fiskalopedija.hr/baza-znanja/porez-na-dohodak-pausalni-obrt#zajednica)
## Saznajte kako, koliko i kada treba platiti porez na dohodak u paušalnom obrtu. Platite odmah putem [Kalkulator i asistenta za plaćanje poreza](https://fiskalopedija.hr/asistent-za-placanje-poreza-doprinosa)
Porez na dohodak u paušalnom obrtu se dužni platiti na kraju svakog tromjesečja. Prvi iznos plaćate do **31.03.** sljedeći do **30.06.** pa do **30.09.** i za kraj do **31.12.**
Iznos koji uplaćujete je iznos za 3 mjeseca. Mjesečni iznos poreza pomnožite sa 3.
[Tablični prikaz mjesečnog iznosa poreza dohodak u paušalnom obrtu](https://fiskalopedija.hr/pausalni-obrt-razredi)
Zaboravljate platiti porez? Niste sigurni na koji IBAN, što upisati pod model i poziv na broj? Pitate se koji iznos uplatiti ovaj mjesec? Fiskalopedija vam nudi [Kalkulator i asistent za plaćanje poreza i doprinosa](https://fiskalopedija.hr/asistent-za-placanje-poreza-doprinosa) koji će vam izračunati iznose, generirati točne podatke za uplatu, i pripremiti 2D barkod spreman za plaćanje te opcionalno tromjesečno na mail poslati podsjetnik sa podacima za uplatu.
Iznos koji morate uplatiti ovisi o tome u koji porezni razred ulazite odnosno koliko ste primitaka imali u prošloj godini:
1\. Ako ste u prošloj godini imali primitke između 0,00 i 11.300,00€ - plaćate 50,85€
2\. Ako ste u prošloj godini imali primitke između 11.300,01 i 15.300,00€ - plaćate 68,85€
3\. Ako ste u prošloj godini imali primitke između 15.300,01 i 19.900,00€ - plaćate 89,50€
4\. Ako ste u prošloj godini imali primitke između 19.900,01 i 30.600,00€ - plaćate 137,70€
5\. Ako ste u prošloj godini imali primitke između 30.600,01 i 40.000,00€ - plaćate 180,00€
6\. Ako ste u prošloj godini imali primitke između 40.000,01 i 50.000,00€ - plaćate 225,00€
7\. Ako ste u prošloj godini imali primitke izm

---

## https://fiskalopedija.hr/baza-znanja/fiskalizacija-20-pausalni-obrt

﻿
Fiskalizacija 2.0 u paušalnom obrtu: što se mijenja i kako se pripremiti
 ﻿
# Fiskalizacija 2.0 u paušalnom obrtu: što se mijenja i kako se pripremiti
Ažurirano: 15.09.2025.
👍 216 [💬 Komentara (62)🔥](https://fiskalopedija.hr/baza-znanja/fiskalizacija-20-pausalni-obrt#zajednica)
## Čitanjem ovog članka saznat ćeš točno koje promjene donosi fiskalizacija 2.0 za paušalne obrte, kada stupaju na snagu i kako se bez panike pripremiti na njih.
Paušalne obrte zahvaćaju dvije ključne promjene koje stupaju na snagu 1.1.2026.:
**Fiskalizaciju transakcijskih računa**
**i zaprimanje eRačuna od drugih poslovnih subjekata.**
• Sa 1.1.2026. paušalni obrti nisu obveznici izdavanje eRačuna. Obveza izdavanja eRačuna dolazi sa 1.1.2027.
• Sa 1.1.2026. paušalni obrt je obavezan zaprimati eRačune
• Sa 1.1.2026. paušalni obrt je obavezan fiskalizirati "Transakcijske račune" izdane u krajnjoj potrošnji
[Opširno o fiskalizaciji 2.0](https://fiskalopedija.hr/baza-znanja/fiskalizacija-20)
[Alat koji pomaže provjeriti obaveze koje nastupaju sa Fiskalizacijom 2.0](https://fiskalopedija.hr/fiskalizacija20-provjera-obaveza)
Transakcijski računi u krajnjoj potrošnji (izdani na fizičku osobu) će se morati fiskalizirati. Transkacijski računi izdani na firmu (B2B) će se do 1.1.2027. moći izdavati kao i do sada u Excelu ili putem [predloška](https://fiskalopedija.hr/racun-predlozak).
Do sada ste transakcijske račune za građane mogli izrađivati u Excelu jer se nisu morali fiskalizirati. Sada će vam trebati program koji omogućuje fiskalizaciju računa. Ako ste do sada primali gotovinske ili kartične uplate već imate program koji izdaje fiskalne račune. Ubuduće će taj program i kod načina plaćanja "Transakcijski račun" izdavati fiskalne račune. To je jedina promjena. Ako već koristite neki program za izdavanje računa on će tu opciju sigurno imati spremnu na vrijeme.
Ako ste do sada izdavali samo transakcijske računa i to putem Worda, Excela ili putem nekog predloška sa 1.1.2026. trebat će vam program za

---


# IZVOR: KVIK.ONLINE/VODICI

## https://kvik.online/vodici/pausalni-obrt-vodic

**Paušalni obrt 2026.** i dalje je jedan od najjednostavnijih načina legalnog poslovanja u Hrvatskoj za mnoge obrtnike i slobodna zanimanja koja ne spadaju u izuzete kategorije. U ovom vodiču sažeto prolazimo što paušalni obrt zapravo znači, koje su prednosti, tko ga može otvoriti i koje obveze ne smiju ispasti iz vida — uključujući vezu s [KPR knjigom prometa](https://kvik.online/vodici/kpr-knjiga-prometa), [PO-SD obrascem](https://kvik.online/vodici/po-sd-obrazac) i [doprinosima](https://kvik.online/vodici/doprinosi).
## Što je paušalni obrt?
Paušalni obrt nije poseban pravni oblik nego način oporezivanja i vođenja evidencija za klasičan obrt. Umjesto detaljnog knjigovodstva i obračuna dohotka po stvarnim prihodima i rashodima, država pretpostavlja "paušalni" dohodak i propisuje fiksne ili razredne iznose poreza na dohodak te jasna pravila za doprinose. Zato mnogi početnici biraju ovaj model: manje administracije, predvidljiviji mjesečni i kvartalni troškovi.
Bitno je znati da i dalj

---

## https://kvik.online/vodici/rpo-obrazac

Ključna fraza **RPO obrazac paušalni obrt** zapravo označava prvi pravi kontakt obrtnika s poreznim režimom nakon samog otvaranja obrta. RPO nije „još jedan papir”, nego formalni upis u Registar poreznih obveznika. U dostupnim podacima iz baze znanja jasno stoji da taj korak treba odraditi u roku od 8 dana od otvaranja obrta. Zbog tog roka RPO treba planirati paralelno s koracima iz vodiča za [otvaranje obrta](https://kvik.online/vodici/otvaranje-obrta), a ne tek kad dobiješ prve klijente.
## Što je RPO obrazac (Registar poreznih obveznika)
RPO je obrazac kojim prijavljuješ osnovne porezne podatke obrta: tko si, gdje si porezni obveznik, kojom djelatnošću se baviš i koji način oporezivanja biraš. Za paušalni obrt to je mjesto na kojem mora biti odabrano da se oporezuješ kao paušal. Ako taj korak propustiš ili ga popuniš pogrešno, kasnije možeš završiti u režimu koji nisi planirao.
U praktičnom smislu, RPO stvara temelj za iduće obveze: kvartalni paušalni porez, godišnji [PO-SD](https:/

---

## https://kvik.online/vodici/otvaranje-obrta

Ako te zanima **kako otvoriti paušalni obrt** u Hrvatskoj danas, najčešći put vodi kroz digitalne servise i jasno definirane korake. Ovaj vodič povezuje registraciju s onim što slijedi odmah nakon toga: [izdavanje računa](https://kvik.online/vodici/izdavanje-racuna), [KPR](https://kvik.online/vodici/kpr-knjiga-prometa), [doprinosi](https://kvik.online/vodici/doprinosi), [fiskalizacija 2.0](https://kvik.online/vodici/fiskalizacija-20), [PO-SD](https://kvik.online/vodici/po-sd-obrazac) i širi okvir [paušalni obrt 2026.](https://kvik.online/vodici/pausalni-obrt-vodic) Na kraju ćeš znati što napraviti u prvom tjednu da izbjegneš kašnjenje s obvezama. Ako si u beauty ili foto segmentu, vidi i [paušalni obrt za kozmetičare](https://kvik.online/vodici/pausalni-obrt-za-kozmeticare) te [paušalni obrt za fotografe](https://kvik.online/vodici/pausalni-obrt-za-fotografe).
## Uvjeti i priprema
Prije nego što kreneš u postupak, provjeri može li tvoja djelatnost uopće u paušalni model i postoje li po

---

## https://kvik.online/vodici/rokovi-placanja

Tražiš **rokovi plaćanja paušalni obrt 2026** na jednom mjestu. Donji sažetak služi kao radni list; brojke i raspored usklađeni su s našim vodičima i alatima za 2026.: [paušalni obrt 2026.](https://kvik.online/vodici/pausalni-obrt-vodic), [kalkulator paušalnog poreza](https://kvik.online/alati/kalkulator-poreza) i [plaćanje doprinosa](https://kvik.online/vodici/doprinosi).
## Cheat sheet — datumi u jednoj tablici
| Obveza | Rok / ritam | Napomena |
| --- | --- | --- |
| Doprinosi (samostalni obrt) | Do 15. u mjesecu | Za prethodni mjesec; fiksni iznosi poput 290,98 € |
| Paušalni porez | 31.3., 30.6., 30.9., 31.12. | Kvartalni iznosi ovise o razredu primitaka |
| PO-SD | Do 15. siječnja | Za prethodnu godinu |
| TZ1 (turistička članarina) | Do 15. siječnja | Ako si obveznik prema djelatnosti / pravilima TZ |
| HOK članstvo | Godišnje / prema komori | Obavezno ako si obrtnik više od 2 godine (prema praksi komore) |
## Doprinosi (samostalni)
Fiksni mjesečni doprinosi za tipičan paušalni

---

## https://kvik.online/vodici/zatvaranje-obrta

**Zatvaranje paušalnog obrta** nije samo “ugasiti web stranicu”. Paušalni model i dalje ostavlja trag u Poreznoj, HZMO-u i obrtnom registru dok formalno ne završiš lanac prijava. Brojčane obveze (doprinosi, kvartalni porez) do zadnjeg dana poslovanja prati isti okvir kao u vodiču [paušalni obrt 2026.](https://kvik.online/vodici/pausalni-obrt-vodic): mjesečni doprinosi do 15. u mjesecu i kvartalni porez do kraja 3./6./9./12. mjeseca. Ovaj članak povezuje te obveze s logistikom zatvaranja.
## Razlozi za zatvaranje
Najčešći razlozi su prijelaz na d.o.o., zaposlenje kao primarni izvor prihoda, selidba u inozemstvo ili jednostavno završetak projekta. Paušalni obrt je privlačan jer je administrativno lagan, ali kad godina donese promjenu modela, zatvaranje treba planirati kao mini-projekt: prvo miran KPR i zadnji računi, pa tek institucije. Ako još nisi siguran trebaš li uopće gasiti obrt, usporedi s [d.o.o.](https://kvik.online/vodici/pausalni-obrt-vs-doo) i razgovorom sa savjetnikom.
## Re

---

## https://kvik.online/vodici/sezonski-obrt

Pojam **sezonski paušalni obrt mirovanje** spaja dvije stvari: neravnomjerni primitci (ljeto puno, zima ništa) i formalni status obrta koji ne smiješ “pustiti niz vodu” jer državni sustavi i dalje očekuju prijave. Osnovni Osnovni ritam paušala: račun → KPR isti dan, doprinosi do 15. u mjesecu, kvartalni porez, godišnji PO-SD do 15. siječnja — vidi [paušalni obrt 2026.](https://kvik.online/vodici/pausalni-obrt-vodic). Sezonalnost mijenja samo to koliko često diraš KPR, ne i postojanje obveza dok si aktivan obrtnik.
## Što je mirovanje i tko ga koristi
Mirovanje obrta koriste obrtnici koji privremeno neće obavljati djelatnost: sezonski ugostitelji, ski instruktori, festival fotografi ili obrti vezani uz ljetni turizam. Cilj je formalno odvojiti “ne radim” od “radim ali ne prijavljujem promet”. Bez prijave mirovanja i dalje izgledaš kao aktivan obrt u registru, što nije ista poruka prema Poreznoj i HZMO-u.
## Kako prijaviti mirovanje
Praktičan put je digitalan: e-Obrtnica i službena dokum

---

## https://kvik.online/vodici/knjiga-trazbi

**Knjiga tražbina paušalni obrt** često zvuči kao još jedna knjiga pored KPR-a. U praksi je to točnije evidencija _tko ti još duguje novac_, dok je KPR (vidi [vodič o KPR-u](https://kvik.online/vodici/kpr-knjiga-prometa)) popis _naplaćenih_ primitaka koji ulaze u porezni i statistički krug paušaliste. Razumijevanje te razlike štedi od grešaka na PO-SD-u, jer se tamo prijavljuju primitci koji su stvarno prošli kroz račun obrta, ne “onoliko koliko sam mislio da će platiti”.
## Što je knjiga tražbina
Knjiga tražbina je poslovna evidencija potraživanja. Svaki red tipično sadrži: broj računa, partnera, datum dospijeća, iznos, uplaćeni dio i preostalo. Za jednoosobni obrt dovoljna je i jednostavna tablica — bitna je disciplina, ne zlatni okvir. Mnogi koriste istu tablicu i kao CRM: tko kasni, tko često plaća u dijelovima, tko treba podsjetnik prije zatvaranja godine.
## Razlika prema KPR-u
U KPR se upisuju primitci — uplate na žiro, gotovina, kartice — vezano uz izdane račune. Ako račun još

---

## https://kvik.online/vodici/doprinosi-uz-posao

Ključna riječ **doprinosi paušalni obrt uz posao** danas znači: ne kopiraj mjesečni model kolege koji radi samo kroz obrt. Naši vodiči [doprinosi za paušalni obrt](https://kvik.online/vodici/doprinosi) i [paušalni obrt 2026.](https://kvik.online/vodici/pausalni-obrt-vodic) razdvajaju dva svijeta: samostalni paušalist koji do 15. u mjesecu plaća fiksne mjesečne doprinose, i obrtnik koji je već pokriven mirovinskim i zdravstvenim dijelom kroz plaću. U drugom scenariju država želi izbjeći dvostruko "puno" osiguranje, ali i rupu — zato postoji godišnji presjek.
## Samostalan obrt vs uz zaposlenje
Kad si isključivo na obrtu, standard koji se u praksi najčešće spominje je **290,98 €** mjesečno do 15. u mjesecu za prethodni mjesec, od čega **119,58 €** ide na prvi stup mirovinskog, **39,86 €** na drugi stup i **131,54 €** na zdravstveno — to su brojke koje se u praksi najčešće navode za 2026. Kad uz to imaš i radni odnos, dio tih obveza već "ulazi" kroz obračun plaće. Paušalni obrt i dalje im

---

## https://kvik.online/vodici/pausalni-obrt-vs-doo

Odluka između modela često počinje s Google upitom **paušalni obrt vs d.o.o.** — i odmah nailaziš na proturječne savjete. Istina je da objašnjenja ovise o industriji, brzini rasta i tome želiš li osobno odgovarati za sve obveze obrta. U Hrvatskoj 2026. paušalni obrt i dalje nudi najbrži start, dok d.o.o. donosi strukturu za tim, investicije i veće ugovore. Ovaj vodič ne zamjenjuje računovođu, ali daje zajednički jezik kad razgovaraš s stručnjakom, posebno ako dolaziš iz [IT freelancinga](https://kvik.online/vodici/pausalni-obrt-za-it-freelancere) ili drugih uslužnih djelatnosti.
## Ključne razlike (odgovornost, troškovi, porez)
Paušalni obrt veže se uz osobu obrtnika: ti odgovaraš cjelokupnom imovinom za obveze obrta. d.o.o. kao pravna osoba tipično nosi odgovornost do visine uloženog kapitala (uz iznimke zlouporabe). Porezno, paušalni obrt koristi paušalni porez na dohodak i razrede, dok d.o.o. plaća porez na dobit i drugačije raspoređuje isplate vlasnicima (plaće, dividende).
Troškov

---

## https://kvik.online/vodici/izdavanje-racuna

**Izdavanje računa paušalni obrt** nije "lijep PDF" nego pravni dokument koji mora zadovoljiti propise i kasnije se pojaviti u [KPR-u](https://kvik.online/vodici/kpr-knjiga-prometa) i na [PO-SD obrascu](https://kvik.online/vodici/po-sd-obrazac). U vodiču prolazimo elemente koje moraš znati napamet, vezu s [fiskalizacijom 2.0](https://kvik.online/vodici/fiskalizacija-20) i razliku između običnog računa i eRačuna. Za širi kontekst vidi i [paušalni obrt 2026.](https://kvik.online/vodici/pausalni-obrt-vodic)
## Obvezni elementi računa
Račun mora jasno identificirati izdavatelja: poslovno ime obrta, OIB, adresa obavljanja ili sjedište ako je primjenjivo. Zatim slijede podaci o kupcu koliko ih zakon zahtijeva u tvojoj vrsti prometa, broj računa koji se ne smije ponavljati u istoj godini, datum, način plaćanja i stavke s cijenom i ukupno. Ako primaš plaćanje na žiro, IBAN na računu olakšava klijentu i smanjuje pitanja "kamo platiti".
Mnogi paušalisti zaborave rečenicu o PDV-u — to nije sitnic

---

## https://kvik.online/vodici/prikriveni-radni-odnos

Pojam **prikriveni radni odnos paušalac** danas čuješ na svakom meetupu jer država želi osigurati doprinose i prava radnika kad poslodavac "prebaci" ljude na obrt ili ugovor o djelu bez stvarne promjene u radu. Ako si na paušalnom obrtu, formalno si poduzetnik, ali ako u praksi radiš kao član tuđeg tima, Porezna može ocijeniti da je obrt samo omot. Ovaj tekst povezuje rizik s vodičem o [paušalnom obrtu za IT freelancere](https://kvik.online/vodici/pausalni-obrt-za-it-freelancere) i [odabirom d.o.o.](https://kvik.online/vodici/pausalni-obrt-vs-doo) kad je suradnja zapravo trajna.
## Što je prikriveni radni odnos po zakonu
Zakonodavstvo štiti osobe koje rade za tuđi račun: ako ispunjavaju elemente rada, trebaju radnopravnu zaštitu i doprinose iz plaće. Kad poslodavac umjesto toga potpisuje ugovor s obrtom, država gleda je li riječ o pravoj usluzi ili o zamaski. Paušalni obrt ovdje nije magična zaštita — ako je sadržaj zapošljavanja, rizik postoji i za tebe i za firmu.
Bitno je razlikovat

---

## https://kvik.online/vodici/alati-za-pausalne-obrtnike

Postoje deseci besplatnih alata za paušalne obrtnike. Kalkulator ovdje, uplatnica tamo, checklista negdje drugdje. Otvoriš pet tabova, prekopiraš broj iz jednog u drugi, i na kraju opet nisi siguran je li sve točno. Kvik radi drugačije — umjesto zbirke izoliranih alata, nudi jedan sustav koji zna tko si i koliko zarađuješ.
Brojke i rokove koje spominjemo (limit od **60.000 €** primitaka za PDV prag, kvartalne iznose poreza, doprinose **290,98 €** mjesečno) usklađeni su s našim vodičima i alatima za 2026.: [paušalni obrt 2026.](https://kvik.online/vodici/pausalni-obrt-vodic), [doprinosi](https://kvik.online/vodici/doprinosi) i [kalkulator paušalnog poreza](https://kvik.online/alati/kalkulator-poreza).
## Što drugi nude — izolirani alati
Ostali izolirani alati na webu nude korisne stvari, ali svaki za sebe. Ti si veza između njih — ručno, svaki put:
- **Generator uplatnice** — uneseš OIB, dobiješ barkod. Ne zna koliko zarađuješ ni koji je tvoj razred doprinosa.
- **Kalkulator poreza** —

---

## https://kvik.online/vodici/kpr-knjiga-prometa

Pojam **KPR knjiga prometa paušalisti** zvuči birokratski, ali u praksi je to tvoj dnevnik zarade: što si naplatio, kada i kojim putem. Bez KPR-a ne možeš točno ispunjavati [PO-SD](https://kvik.online/vodici/po-sd-obrazac) niti dokazati primitke u slučaju kontrole. Zato ga trebaš shvatiti kao alat, ne kao kaznu. Ako koristiš [Kvik](https://kvik.online/register), dio unosa može biti automatski vezan uz [izdavanje računa](https://kvik.online/vodici/izdavanje-racuna).
## Što je KPR?
Knjiga prometa računa služi poreznim tijelima i tebi: iz nje se vidi koliko si ostvario primitaka kroz godinu i kako su raspoređeni između gotovinskog i bezgotovinskog kanala. To su iste brojke koje kasnije traži PO-SD. Drugim riječima, KPR je izvor istine za godišnji izvještaj — ako je KPR netočan, cijela godišnja slika je pomačena.
## Što se upisuje
Tipično upisuješ datum prometa ili naplate, broj računa, naziv kupca ako ga knjiga traži, opis, iznose po kolonama za gotovinu i bezgotovinsko te ukupno. Svaka s

---

## https://kvik.online/vodici/pausalni-obrt-za-it-freelancere

**Paušalni obrt za IT freelancere** i dalje je jedan od najčešćih odabira kad želiš legalno naplatiti programiranje, DevOps, dizajn sučelja ili savjetovanje bez punog knjigovodstva. Model je privlačan jer donosi predvidljive obveze prema državi, dok ti ostaje fleksibilnost rada od kuće ili iz inozemstva. Ipak, IT sektor često je u fokusu Porezne zbog ugovora o djelu i rizika prikrivenog radnog odnosa — zato ovaj vodič povezuje praksu s vodičima o [prikrivenom radnom odnosu](https://kvik.online/vodici/prikriveni-radni-odnos), [usporedbi s d.o.o.](https://kvik.online/vodici/pausalni-obrt-vs-doo) i [fiskalizaciji 2.0](https://kvik.online/vodici/fiskalizacija-20).
## Zašto IT freelanceri biraju paušalni obrt
Paušalni obrt skraćuje administraciju: ne vodiš poslovne knjige po stvarnim prihodima i rashodima u klasičnom smislu, nego plaćaš paušalni porez u razredima i mjesečne doprinose. Za freelancera koji naplaćuje sate ili projekte to znači manje papira i brži start nego kod d.o.o. Dodatno,

---

## https://kvik.online/vodici/pausalni-obrt-za-konzultante

**Paušalni obrt za konzultante** danas znači rad s inozemnim klijentima, platformama i stalnom promjenom alata. Porezni okvir i dalje je isti kao za svaki paušalni obrt: mjesečni doprinosi do 15. u mjesecu (npr. 290,98 € u samostalnom modelu), kvartalni paušalni porez prema razredu primitaka, KPR, PO-SD do 15. siječnja i limit **60.000 €** primitaka ( [paušalni obrt — kompletan vodič](https://kvik.online/vodici/pausalni-obrt-vodic)). Specifičnost konzultanata je poslovni model, ne forma obrta.
## Tko spada u ovaj vodič
Vodič je pisan za IT konzultante, UX/UI dizajnere, brand dizajnere i slične profile koji prodaju vrijeme i ekspertizu. Samostalna arhitektonska djelatnost u smislu slobodnih zanimanja spada u poseban režim koji prema službenom vodiču Porezne **ne može** biti paušal — ako si arhitekt u tom smislu, provjeri klasifikaciju prije registracije. Za dizajn koji nije u izuzetku slobodnih zanimanja, paušal ostaje relevantan model uz disciplinu oko primitaka.
## Prikriveni radni od

---

## https://kvik.online/vodici/pausalni-obrt-za-kozmeticare

**Paušalni obrt za kozmetičare** popularan je izbor jer omogućuje jednostavnije vođenje poslovanja uz predvidljive mjesečne obveze prema državi. Bilo da radiš manikuru, tretmane lica, masaže ili kombinirane beauty usluge, klijenti često plaćaju gotovinom — što znači da moraš znati pravila [fiskalizacije](https://kvik.online/vodici/fiskalizacija-20), [izdavanja računa](https://kvik.online/vodici/izdavanje-racuna) i [doprinosa](https://kvik.online/vodici/doprinosi). Ovaj vodič povezuje tipične situacije salona s obrtnim okvirom u Hrvatskoj 2026.
## Može li kozmetičar biti paušalist
Većina kozmetičkih usluga spada u obrtničke djelatnosti koje mogu ići u paušalni režim ako su ispunjeni uvjeti stručnosti i registracije. Ako imaš diplome ili potvrde o osposobljenosti, one idu uz prijavu u obrtni registar. Bitno je da glavni prihod dolazi iz usluga koje su dozvoljene u paušalu — izuzete kategorije treba izbjegavati još prije otvaranja.
Ako si zaposlena u salonu i razmišljaš o vlastitom obrtu,

---

## https://kvik.online/vodici/pausalni-obrt-za-ugostitelje

**Paušalni obrt za ugostitelje** zvuči jednostavno dok ne vidiš red ispred šanka u srpnju. I pored gužve, porezni okvir ostaje isti: doprinosi do 15. u mjesecu (290,98 € u samostalnom modelu), kvartalni paušalni porez, KPR, PO-SD do 15. siječnja i limit **60.000 €** godišnjih primitaka ( [paušalni obrt — vodič](https://kvik.online/vodici/pausalni-obrt-vodic)). Specifično za ugostitelje su fiskalizacija prema građanima i turistička članarina.
## Može li ugostitelj biti paušalist
Paušalni obrt može biti privlačan za manje lokacije, catering iznajmlivanjem, food truck model ili sezonski bar. Ipak, čim zaposljavaš ljude, otvaraš više smjena ili ulaziš u veće najmove, često se pojavljuje d.o.o. kao fleksibilniji okvir. Obrt i dalje može ostati dobra opcija za solo kuhara, baristu ili mali desert bar koji drži troškove pod kontrolom.
## Fiskalizacija i gotovina
Prema građanima trebaš izdavati fiskalizirane račune. Zato POS sustav ili mobilna aplikacija nisu “dodatak luksuzu” nego dio radnog

---

## https://kvik.online/vodici/pausalni-obrt-za-fotografe

**Paušalni obrt za fotografe** daje jednostavan okvir za naplatu snimanja vjenčanja, portreta, komercijalnih kampanja i video-produkcije bez punog knjigovodstva. Ipak, kreativna industrija često miješa autorske ugovore, agencijske narudžbe i gotovinu na licu mjesta — što sve mora završiti u KPR-u i na računima. Ovaj vodič povezuje tvoj rad s [fiskalizacijom](https://kvik.online/vodici/fiskalizacija-20), [pravilima računa](https://kvik.online/vodici/izdavanje-racuna) i [doprinosima](https://kvik.online/vodici/doprinosi), uz usporedbu s digitalnim freelancingom u vodiču za [IT freelancere](https://kvik.online/vodici/pausalni-obrt-za-it-freelancere).
## Fotograf kao paušalist – prednosti
Paušalni model štedi vrijeme: umjesto knjiženja svake memorijske kartice kao troška, fokusiraš se na klijente i kalendar. Predvidljivi doprinosi i kvartalni porez pomažu planirati sezonu kad su vjenčanja gusto, a siječanj miran. To je posebno važno kad su prihodi ciklični.
Ograničenje je manjak fleksibiln

---

## https://kvik.online/vodici/po-sd-obrazac

Ako tražiš odgovor na pitanje **PO-SD obrazac kako ispuniti**, ovaj vodič prolazi cijeli životni ciklus obrasca: što predstavlja, koji je rok, kako povezuješ podatke s [KPR knjigom prometa](https://kvik.online/vodici/kpr-knjiga-prometa) i kako izbjegavati tipične greške. Paušalni obrt 2026. i dalje zahtijeva disciplinu u evidenciji — bez nje PO-SD postaje noćna mora umjesto rutine.
## Što je PO-SD?
PO-SD je godišnji izvještaj o paušalnom dohotku i uplaćenom paušalnom porezu na dohodak. Drugim riječima, državi jednom godišnje pokazuješ koliko si naplatio primitaka i koliko si poreza stvarno platio kroz kvartale. Obrazac povezuje realne primitke iz poslovanja s razredima i obračunom koji si već primjenjivao tijekom godine.
Bez točnog KPR-a teško ispunjavaš PO-SD: brojke moraju biti konzistentne s računima i bankovnim izvodima. Zato mnogi paušalisti prvo srede digitalni KPR u Kviku, pa tek onda prelaze na PO-SD generiran iz istih podataka.
## Rok predaje
Standardni rok za prethodnu godinu

---

## https://kvik.online/vodici/doprinosi

Razumijevanje pojma **doprinosi paušalni obrt iznos** ključno je da mjesečni rashod ne bude iznenađenje. U ovom vodiču sabiremo vrste doprinosa, tipične iznose za 2026., rokove i vezu s ostalim obvezama poput [PO-SD obrasca](https://kvik.online/vodici/po-sd-obrazac) i [KPR-a](https://kvik.online/vodici/kpr-knjiga-prometa). Iako su brojke stabilne unutar godine, službeni izvori ipak imaju posljednju riječ.
## Vrste doprinosa
Paušalisti najčešće plaćaju doprinose za mirovinsko osiguranje na prvi i drugi stup te doprinose za obvezno zdravstveno osiguranje. Svaka stavka ima svoju osnovicu i stopu koja proizlazi iz propisa. Kada uz obrt imaš i zaposlenje, presjek pravila je složeniji — država želi izbjeći dvostruko ili premalo osiguranje.
## Iznosi za 2026.
U materijalima koji kruže zajednicom paušalista često se za jednu djelatnost navodi ukupno **290,98 €** mjesečno, od čega je **119,58 €** na prvi stup, **39,86 €** na drugi stup mirovinskog te **131,54 €** zdravstveno. To su iznosi koje

---

## https://kvik.online/vodici/porez-na-dohodak

Ako pretražuješ **porez na dohodak paušalni obrt 2026**, najvažnije je razumjeti da ne postoji jedan univerzalni iznos za sve. Paušalni porez se plaća kvartalno, prema razredu primitaka, i zato je direktno povezan s tim koliko si ostvario u prethodnoj godini. U bazi je to jasno opisano: četiri roka tijekom godine, tromjesečna uplata i sedam razreda iznosa.
Kad sustav postaviš dobro, porez postaje rutina. Kad ga vodiš stihijski, svako tromjesečje izgleda kao mini porezna kriza. Zato ovaj vodič spaja brojke, rokove i postupak uplate, a povezuje te i s vodičima za [PO-SD](https://kvik.online/vodici/po-sd-obrazac) i [rokove plaćanja](https://kvik.online/vodici/rokovi-placanja).
## Što je paušalni porez na dohodak
Paušalni porez na dohodak je pojednostavljen način oporezivanja za obrtnike u paušalnom režimu. Umjesto detaljnog obračuna dohotka kroz poslovne knjige kao kod drugih modela, ovdje plaćaš propisani iznos prema razredu primitaka. Time je sustav jednostavniji, ali i dalje traži disc

---

## https://kvik.online/vodici/turisticka-clanarina

Fraza **turistička članarina paušalni obrt** često zvuči kao nešto što se tiče isključivo apartmana i restorana. U praksi je slika šira. U dostupnim podacima iz baze znanja jasno piše da obveza postoji za djelatnosti u turizmu i ugostiteljstvu, ali i za djelatnosti koje od turizma imaju posrednu korist. Zato dio obrtnika tek nakon prvih mjeseci poslovanja shvati da uz [doprinose](https://kvik.online/vodici/doprinosi), kvartalni porez i godišnji [PO-SD](https://kvik.online/vodici/po-sd-obrazac) mora rješavati i turističku članarinu.
## Što je turistička članarina
Turistička članarina je obveza određenih poslovnih subjekata prema sustavu turističkih zajednica. Nije zamišljena kao univerzalni namet za sve obrte, nego kao doprinos djelatnosti koje izravno ili neizravno ostvaruju koristi od turizma. Kod paušalnog obrta je važno razumjeti jednu specifičnost koju izvor posebno naglašava: ako imaš barem jedan račun odnosno primitak koji podliježe članarini, osnovica se računa na ukupan primita

---

## https://kvik.online/vodici/kpr-online-generator

Pojam **KPR online paušalni obrt** danas znači: umjesto ručnog prepisivanja u PDF ili papir, koristiš aplikaciju koja iz izdanih računa gradi knjigu prometa. KPR je popis primitaka — uplate na žiro, gotovina, kartice — za svaki izdani račun; više u [vodiču o KPR-u](https://kvik.online/vodici/kpr-knjiga-prometa) i u [paušalnom obrtu 2026.](https://kvik.online/vodici/pausalni-obrt-vodic). To je isti podatak koji na kraju godine ide u PO-SD do **15\. siječnja**— vidi [PO-SD obrazac](https://kvik.online/vodici/po-sd-obrazac).
## Što ide u KPR
Svaki naplaćeni račun treba imati red u KPR-u: datum, broj računa, iznos, način plaćanja (gotovina ili bezgotovina). Ako koristiš više valuta, prati konverziju prema pravilima koja si dogovorio s računovođom. Bitno je da KPR odražava stvarno stanje novca, ne “ugovoreni iznos”.
## Gotovina vs bezgotovinsko
PO-SD razdvaja primitke na gotovinske i bezgotovinske staze. Zato KPR mora biti konzistentan: kartica često ide u gotovinsku grupu u smislu kartično

---

## https://kvik.online/vodici/pdv-id

Ključna fraza **PDV ID broj paušalni obrt** zbunjuje jer zvuči kao “ulazak u PDV”. U praksi: PDV ID je OIB s prefiksom HR koji dodjeljuje Porezna na zahtjev, a **ne znači** da postaješ PDV obveznik koji mora PDV stavljati na vlastite račune. Detalje i postupak provjeri na [stranicama Porezne uprave](https://www.porezna-uprava.hr/) i u uputama za obrazac P-PDV na ePoreznoj. To je kritična razlika za freelancere koji rade za njemačku ili irsku tvrtku, ali i dalje žele ostati u paušalnom obrtu dok su ispod limita od 60.000 € primitaka — vidi i [paušalni obrt 2026.](https://kvik.online/vodici/pausalni-obrt-vodic).
## Što je PDV ID (i što nije)
PDV ID je identifikator u unutarnjem tržištu EU-a. Omogućuje da tvoji partneri ispravno evidentiraju transakcije u svojim PDV povratima i da ti zaprimiš eRačune bez administrativnog čvora. Identifikator trebaš ako prodaješ ili kupuješ kod EU tvrtki — bez obzira jesi li paušal, obrt s knjigama, j.d.o.o. ili d.o.o.
## Usluge iz EU bez praga
Za usluge u

---

## https://kvik.online/vodici/fiskalizacija-20

**Fiskalizacija 2.0 paušalisti** donosi jasnu podjelu: što se događa s transakcijskim računima za građane, što s B2B eRačunima i što s zaprimanjem računa od drugih. Ovaj vodič povezuje te teme s praksom [izdavanja računa](https://kvik.online/vodici/izdavanje-racuna) i širim kontekstom [paušalnog obrta 2026.](https://kvik.online/vodici/pausalni-obrt-vodic)
## Što je Fiskalizacija 2.0?
Fiskalizacija 2.0 proširuje digitalni nadzor nad prometom: država želi blagovremeno vidjeti transakcije i smanjiti sivi trg. Za obrtnike to znači obvezu korištenja rješenja koja su tehnički povezana s Poreznom upravom tamo gdje zakon nalaže. Paušalisti nisu izuzeti kad izdaju određene vrste računa ili kad moraju zaprimati eRačune od partnera.
Ključno je ne miješati pojam "fiskalizacija" s "eRačunom": prvi se odnosi na potvrdu prometa u realnom vremenu, drugi na strukturirani elektronički dokument u poslovnom prometu. Oba sustava zahtijevaju pouzdanu infrastrukturu — zato većina obrta danas oslanja na softv

---

## https://kvik.online/vodici/izdavanje-racuna-vodic

Upit **izdavanje računa paušalni obrt vodič** obično znači isto: želiš izdavati račune bez pravnih rupa, bez improvizacije i bez kasnijeg vraćanja na početak. Račun nije samo dokument za naplatu, nego i temelj za evidenciju primitaka, KPR i godišnje porezne obveze. Zato cijeli proces treba postaviti ispravno od prvog dana, počevši od internog akta.
Ovaj vodič koristi podatke iz baze znanja i pokriva kompletan tok: interni akt, numeracija, obvezni elementi, fiskalizacija, eRačun i čuvanje dokumentacije. Za širi kontekst obveza provjeri i [KPR knjigu prometa](https://kvik.online/vodici/kpr-knjiga-prometa) te [fiskalizaciju 2.0](https://kvik.online/vodici/fiskalizacija-20).
## Interni akt – što je i zašto je obvezan
Interni akt je prvi korak prije izdavanja prvog računa. U izvoru je jasno navedeno da internim aktom definiraš slijednost brojeva računa, oznaku poslovnog prostora, oznaku naplatnog uređaja i blagajnički maksimum. To je dokument koji postavlja pravila igre prije nego što počne

---

=== KRAJ KNOWLEDGE BASE ===`;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Nedostaje ANTHROPIC_API_KEY u okruženju.' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as { messages?: ChatMessage[] };
    const rawMessages = body.messages ?? [];

    const filteredMessages = rawMessages
      .filter(
        (message) =>
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0,
      )
      .slice(-20)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    if (filteredMessages.length === 0) {
      return NextResponse.json(
        { error: 'Poruka je prazna. Pošalji pitanje.' },
        { status: 400 },
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      system: SYSTEM_PROMPT,
      max_tokens: 1200,
      stream: true,
      messages: filteredMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Greška pri obradi AI odgovora.',
      },
      { status: 500 },
    );
  }
}
