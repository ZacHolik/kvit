import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/** Izvorno: /home/zeljko/kvit-knowledge-base-mini.md (ugrađeno u build). */
const SYSTEM_PROMPT = `Ti si Kvit AI asistent za hrvatske paušalne obrtnike.

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
## https://fiskalopedija.hr/baza-znanja/pausalni-obrt

﻿
Paušalni obrt – vodič za početnike (obveze, rokovi i prednosti)






 ﻿



# Paušalni obrt – vodič za početnike (obveze, rokovi i prednosti)

Ažurirano: 17.02.2026.

👍 413 [💬 Komentara (58)🔥](https://fiskalopedija.hr/baza-znanja/pausalni-obrt#zajednica)

## Paušalni obrt je najjednostavniji i najjeftiniji način za ulazak u poduzetništvo. Obrt čije je vođenje pojednostavljeno.

## Što je paušalni obrt?Kopirano

Paušalni obrt je klasičan obrt čije je vođenje pojednostavljeno. U paušalnom obrtu imate vrlo malo obveza. Mjesečno morate plaćati fiksni iznos doprinosa, te tromjesečno porez na dohodak.

Od preostalih obveza tu je vođenje KPR (Knjige prometa računa) i na kraju godine treba predati PO-SD obrazac.
I to je to! Za vođenje paušalnog obrta vam ne treba računovodstvo.

Možemo zaključiti da je paušalni obrt običan obrt čije je vođenje maksimalno pojednostavljeno. Isto tako davanja u paušalnom obrtu su najmanja moguća pa je paušalni obrt najjeftiniji oblik poslovanja.

Naravno, uz ove prednosti ima i svoja ograničenja koja ćemo spomenuti u nastavku.


[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

## Kako se paušalni obrt vodi?Kopirano

Vođenje paušalnog obrta je vrlo jednostavno. U paušalnom obrtu dužni ste za svaki primitak [izdati račun](https://fiskalopedija.hr/baza-znanja/izrada-racuna). Navedene primitke odnosno račune potrebno je na kraju dana upisati u knjigu prometa (KPR). Na kraju godine je potrebno zbrojiti sve primitke u godini te ih prijaviti na poreznu putem [PO-SD obrasca](https://fiskalopedija.hr/baza-znanja/po-sd-obrazac). Do 15. u mjesecu je potrebno platiti doprinose, a svaka tri mjeseca odnosno kvartalno je potrebno uplatiti paušalni porez na dohodak prema pripadajućem poreznom razredu.

Uz izdavanje računa morate biti sposobni i zaprimati [eRačun](https://fiskalopedija.hr/elektronicki-racun). To znači da ako dođe do situacije da vam netko treba izdati račun na obrt da ga vi možete zaprimiti kao [eRačun](https://fiskalopedija.hr/elektronicki-racun). Ovo je najjednostavnije kroz [Mikroeračun](https://fiskalopedija.hr/mikroeracun-aplikacija) aplikaciju ili već kroz postojeći program za izdavanje računa.
Ovisno o djelatnosti moguće je da ste još i obveznik plaćanja [turističke članarine](https://fiskalopedija.hr/baza-znanja/turisticka-clanarina-tz1-obrazac) i ako ste obrtnik više od dvije godine dužni ste za sada još uvijek plaćati obavezno članstvo u obrtničkoj komori.

To je sve što ste dužni odraditi kako biste samostalno vodili paušalni obrt.

Trebate pomoć oko vođenja paušalnog obrta? Želite da vam definiramo jasne korake i provjerimo radite li sve ispravno?

[📞 Javite se →](https://fiskalopedija.hr/usluge)

## Tko može otvoriti paušalni obrt?Kopirano

Pojednostavljeno, paušalni obrt mogu otvoriti svi osim [slobodnih zanimanja](https://fiskalopedija.hr/baza-znanja/pausalni-obrt#:~:text=Koje%20djelatnosti%20se%20NE%20mogu%20obavljati%20kroz%20pau%C5%A1alni%20obrt?).
Paušalni obrt je i dalje obrt 

---

## https://fiskalopedija.hr/baza-znanja/po-sd-obrazac

﻿
Izrada PO-SD obrasca 2025.






 ﻿



# Izrada PO-SD obrasca 2025.

Ažurirano: 08.01.2026.

👍 407 [💬 Komentara (83)🔥](https://fiskalopedija.hr/baza-znanja/po-sd-obrazac#zajednica)

## Ovdje ćete saznati kao ispuniti PO-SD obrazac u paušalnom obrtu

## Što je PO-SD obrazac?Kopirano

Ovaj obrazac se koristi samo u paušalnom obrtu. PO-SD obrazac je izvještaj o ukupnim primicima i plaćenom porezu u prethodnoj godini.
To bi značilo da putem PO-SD obrasca jednom godišnje prijavljujete koliko ste u prethodnoj godini imali primitaka i koliko ste poreza uplatili.
Predaje se do 15.1. za prethodnu godinu.


[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

oglas

[**Neka ti program sam izrađuje PO-SD obrazac**\\\\
\\\\
Program za **izdavanje računa i eRačuna**, eArhivu, evidenciju plaćanja i izvještavanje – sve u jednom.\\\\
\\\\
\\\\
Saznaj više →\\\\
\\\\
\\\\
![Marketino aplikacija](https://fiskalopedija.hr/img/oglasi/marketino/marketino-banner.png)](https://marketino.hr/?utm_source=fiskalopedija.hr&utm_medium=referral&utm_campaign=fiskalopedija&utm_content=po-sd-obrazac)

Želite se i vi ovdje oglašavati?
[Pošaljite upit](mailto:info@fiskalopedija.hr?subject=Zakup%20oglasa)

## Gdje mogu naći PO-SD obrazac za 2025. godinu?Kopirano

Primjer PO-SD obrasca kojeg možete prilagoditi svojim potrebama možete naći na linku niže. Upišite svoje primitke, iznos poreza koji ste uplatili i sve ostalo će obrazac za vas izračunati.

[Izrada PO-SD obrasca](https://fiskalopedija.hr/po-sd-obrazac)

Aktualan PO-SD obrazac u PDF formatu možete naći na stranicama porezne uprave na sljedećem
[linku](https://porezna-uprava.gov.hr/UserDocsImages/Dokumenti%20obrasci/PO-SD%20za%202025.pdf)

[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

## Kako ispuniti PO-SD obrazac?Kopirano

Najlakši način je da odete na naš [primjer obrasca](https://fiskalopedija.hr/po-sd-obrazac) upišete svoje primitke od prethodne godine, upišete iznos poreza kojeg ste uplatili, obrazac će ostale iznose sam izračunati. Nakon što obrazac preostale iznose izračuna možete ih prepisati u ePoreznu i predati PO-SD obrazac.

Drugi način je da preuzmete PO-SD obrazac sa sljedećeg
[linka](https://www.porezna-uprava.hr/HR_obrasci/Documents/POREZ%20NA%20DOHODAK/PO-SD%20za%202024.pdf) te ga ručno ispunite.

Niže je naveden primjer popunjavanja za one koji su poslovali samostalno cijelu godinu. Na slici su označene točke iz uputa ispod slike:

![Kako ispuniti PO-SD obrazac](https://fiskalopedija.hr//img/po-sd-obrazac/PO-SD-uputa.png)

Točka 1. U polje "Primici naplaćeni u gotovini" upisujete koliko ste u prethodnoj godini naplatili putem gotovine ili kartica

Točka 2. U polje "Primici naplaćeni bezgotovinskim putem" upisujete koliko ste u prethodnoj godini primili uplata izravno na žiro račun obrta

Točka 3. U polje "Ukupno naplaćeni primici" zbrojite polja pod točkom 1 i 2

Točka 4. U polje "GODIŠNJI PAUŠALNI DOHODAK OD POJEDINAČNE DJELATNOSTI" upisujete jednu od niže navedenih vr

---

## https://fiskalopedija.hr/baza-znanja/online-obrasci-za-pausalni-obrt

﻿
Obrasci za ispis





 ﻿



# Obrasci za ispis

Ažurirano: 25.11.2024.

👍 293 [💬 Komentara (0)](https://fiskalopedija.hr/baza-znanja/online-obrasci-za-pausalni-obrt#zajednica)

## Možete kreirati obrasce koji su nužni za vođenje paušalnog obrta na jednom mjestu. Bez potrebe za kompliciranim Wordom ili Excelom. Odaberite željeni obrazac, upišite vlastite podatke te ga isprintajte ili spremite u PDF

## Obrazac internog aktaKopirano

Ovdje se nalazi primjer internog akta. Otvorite ga, unesite vaše podatke te odaberite opciju "Ispiši". Nakon što ste ga ispisali spremite ga u vašu arhivu. Na ovaj način možete kreirati vaš interni akt bez prtljanja po Wordu ili Excelu.

[Kreiraj interni akt](https://fiskalopedija.hr/interni-akt-template)

[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

oglasni prostor

## Obrazac za prijavu poslovnog prostora na poreznuKopirano

Ako ste odlučili prijaviti poslovni prostor na poreznu putem obrasca ovdje ga možete ispuniti. Na linku niže uđite na obrazac za prijavu poslovnog prostora na poreznu. Izmijenite podatke ma njemu kako bi odgovarao vašim potrebama. Odeberite opciju "Ispiši" te ga odnesite na poreznu

[Ispuni obrazac za prijavu poslovnog prostor na poreznu](https://fiskalopedija.hr/obrazac-za-prijavu-poslovnog-prostora-na-poreznu)

## Ispunite PO-SD obrazac onlineKopirano

Odaberite naš [primjer PO-SD obrasca](https://fiskalopedija.hr/po-sd-obrazac). U zadana polja upišite vaše prošlogodišnje primitke. U polje "UKUPNO UPLAĆENI PAUŠALNI POREZ NA DOHODAK" upišite iznos uplaćenog poreza u prošloj godini. Sve ostalo će obrazac za vas izračunati. Takav obrazac možete prepisati u  [ePoreznu](https://fiskalopedija.hr/baza-znanja/po-sd-obrazac#:~:text=Kako%20predati%20PO-SD%20obrazac%20putem%20ePorezne?) ili ga ispisati i odnijeti u poreznu upravu.



[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

## Ispunite TZ1 obrazac onlineKopirano

Odaberite naš
[online TZ1 obrazac](https://fiskalopedija.hr/tz1-obrazac) te ispunite polja "1. osnovica", "2. stopa" i "10. Uplaćeni predujam", ako se djelatnost odvijala na potpomognutim područjima možda ćete morati upisati i vrijednosti u polja (4,5,6,7). Ostalo će Fiskalopedija za vas izračunati. Nakon toga pravilno ispunjeni obrazac možete prepisati u ePoreznu te ge elektroničkim putem predati.


[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

## Kako spremiti obrazac u PDF na moje računalo?Kopirano

Svaki obrazac možete spremiti na vaše računalo u PDF tako da oberete opciju "Ispiši" te nakon toga u destination / odredište odaberete "Save as PDF" / "Spremi kao PDF"
![Spremanje obrasca u PDF](https://fiskalopedija.hr//img/online-obrasci-za-pausalni-obrt/spremanje-obrasca-pdf.png)

[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

Smatrate ovaj sadržaj korisnim?

293 od 295 čitatelja ga smatra korisnim

Vaše pitanje ili komentar (obavezno polje)

Ako imate konkreto pitanje za Fi

---

## https://fiskalopedija.hr/po-sd-obrazac

﻿
PO-SD Obrazac

﻿



oglas

[**Marketino jednostavno ima sve što vam treba**\\\\
\\\\
Program za **izdavanje računa i eRačuna**, eArhivu, evidenciju plaćanja i izvještavanje – sve u jednom.\\\\
\\\\
\\\\
Saznaj više →\\\\
\\\\
\\\\
![Marketino aplikacija](https://fiskalopedija.hr/img/oglasi/marketino/marketino-banner.png)](https://marketino.hr/?utm_source=fiskalopedija.hr&utm_medium=referral&utm_campaign=fiskalopedija&utm_content=main)

Želite se i vi ovdje oglašavati?
[Pošaljite upit](mailto:info@fiskalopedija.hr?subject=Zakup%20oglasa)

# Izradi PO-SD obrazac online (2025.)

Ovdje možete ispuniti PO-SD obrazac za 2025. godinu. Dovoljno je upisati iznos primitaka i iznos uplaćenog poreza.
Ostalo će obrazac sam izračunati za vas. Nakon što ste obrazac ispunili dobivene podatke možete prepisati u ePoreznu. Ako želite ručno predati obrazac
možete ga ispisati i predati u poreznu.


[Uputa](https://fiskalopedija.hr/baza-znanja/po-sd-obrazac) za ispunjavanje PO-SD obrasca.


* * *

|     |
| --- |
| OBRAZAC PO-SD |

|     |
| --- |
| IZVJEŠĆE O PAUŠALNOM DOHOTKU OD SAMOSTALNIH DJELATNOSTI I UPLAĆENOM PAUŠALNOM POREZU NA DOHODAK<br> OD  DO  GODINE |

|     |
| --- |
| \\- iznosi u eurima i centima - |

|     |     |     |
| --- | --- | --- |
| I. PODACI O POREZNOM OBVEZNIKU |
| OIB | IME I PREZIME | ADRESA PREBIVALIŠTA/UOBIČAJENOG BORAVIŠTA |
|  |  |  |
| II. PODACI O DJELATNOSTI |
| 1\\. NAZIV I VRSTA DJELATNOSTI |  |
| 2\\. ADRESA OBAVLJANJA DJELATNOSTI |  |

|     |     |
| --- | --- |
| 3\\. GRAD VUKOVAR I POTPOMOGNUTA PODRUČJA JEDINICA LOKALNE SAMOUPRAVE I. SKUPINE I OTOCI I. SKUPINE |  |
| 4\\. RAZDOBLJE OBAVLJANJA DJELATNOSTI |  |

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| OD DO | OD DO | OD DO | OD DO | OD DO |
| III. PODACI O OSTVARENIM PRIMICIMA OD POJEDINAČNE DJELATNOSTI |

|     |     |     |
| --- | --- | --- |
| PRIMICI NAPLAĆENI U GOTOVINI | PRIMICI NAPLAĆENI BEZGOTOVINSKIM PUTEM | UKUPNO NAPLAĆENI PRIMICI |
| 1 | 2 | 3 (1+2) |
|  |  |  |

|     |     |
| --- | --- |
| IV. GODIŠNJI PAUŠALNI DOHODAK OD POJEDINAČNE DJELATNOSTI 1<br> / BROJ MJESECI OBAVLJANJA DJELATNOSTI 2 | |     |     |
| --- | --- |
|  |  | |
| V. GODIŠNJI PAUŠALNI DOHODAK OD ZAJEDNIČKE DJELATNOSTI / BROJ MJESECI OBAVLJANJA DJELATNOSTI | |     |     |
| --- | --- |
|  |  | |
| VI. UKUPNI GODIŠNJI PAUŠALNI DOHODAK | |     |     |
| --- | --- |
|  |  | |

|     |     |
| --- | --- |
| VII. OBRAČUN PAUŠALNOG POREZA NA DOHODAK |
| |     |     |
| --- | --- |
| 1. | IZNOS OBVEZE PAUŠALNOG POREZA NA DOHODAK | |  |
| |     |     |
| --- | --- |
| 2. | UMANJENJE PAUŠALNOG POREZA NA DOHODAK ZA PODRUČJE GRADA VUKOVARA I POTPOMOGNUTIH<br> PODRUČJA JEDINICA LOKALNE SAMOUPRAVE I. SKUPINE I OTOCI I. SKUPINE 3 | |  |
| |     |     |
| --- | --- |
| 3. | UKUPNA OBVEZA PAUŠALNOG POREZA NA DOHODAK NAKON UMANJENJA | |  |
| |     |     |
| --- | --- |
| 4. | UKUPNO UPLAĆENI PAUŠALNI POREZ NA DOHODAK | |  |
| |     |     |
| --- | --- |
| 5. | RAZLIKA ZA UPLATU/POVRAT | |  |
| |     |   

---

## https://fiskalopedija.hr/baza-znanja/placanja-doprinosa-pausalni-obrt

﻿
Doprinosi za paušalni obrt 2026: iznosi, rokovi i kako platiti






 ﻿



# Doprinosi za paušalni obrt 2026: iznosi, rokovi i kako platiti

Ažurirano: 13.01.2026.

👍 380 [💬 Komentara (31)🔥](https://fiskalopedija.hr/baza-znanja/placanja-doprinosa-pausalni-obrt#zajednica)

## Ovdje ćete saznati kako i koliko uplatiti doprinosa u paušalnom obrtu. Koliko se plaća mirovinsko i koliko zdravstveno. Na koje račune treba uplatiti iznose za doprinose. Platite odmah putem [asistenta za plaćanje](https://fiskalopedija.hr/asistent-za-placanje-poreza-doprinosa)

## Kada se plaćaju doprinosi u paušalnom obrtu?Kopirano

Doprinosi u paušalnom obrtu (mirovinsko i zdravstveno osiguranje) plaća se do 15. u mjesecu za prethodni mjesec. Doprinosi se dijele na doprinosi za mirovinsko osiguranje 1. stup, mirovinsko osiguranje 2. stup i doprinosi za zdravstveno osiguranje.

Ne znate kada, kako i koliko platiti doprinose. Bojite se da u početku nešto ne zeznete? Trebate kratku uputu i pomoć oko plaćanja doprinosa?

[📞 Javite se →](https://fiskalopedija.hr/usluge)

[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

oglasni prostor

## Koliko doprinosa moram platiti svaki mjesec?Kopirano

Do 15. u mjesecu morate uplatiti 290,98€ doprinosa ukupno. Od čega se 119,58€ odnosi na 1. stup mirovinskog osiguranja, 39,86€ na 2. stup mirovinskog osiguranja i 131,54 na zdravstveno osiguranje.

**Tablični prikaz gore navedenog**

| Rok uplate | Mirovinsko 1. stup | Mirovinsko 2. stup | Zdravstveno | Ukupno |
| --- | --- | --- | --- | --- |
| Do 15. u mjesecu | 119,58 € | 39,86 € | 131,54 € | 290,98 € |

## Ne želite ručno unositi podatke? Isprobajte naš Kalkulator i asistent za plaćanje doprinosaKopirano

Zaboravljate platiti doprinose? Niste sigurni na koji IBAN, što upisati pod model i poziv na broj? Pitate se koji iznos uplatiti ovaj mjesec? Fiskalopedija vam nudi [kalkulator i asistenta za plaćanje](https://fiskalopedija.hr/asistent-za-placanje-poreza-doprinosa) koji će vam izračunati iznose, generirati točne podatke za uplatu, i pripremiti 2D barkod spreman za plaćanje te opcionalno svaki mjesec poslati na mail podsjetnik sa podacima za uplatu.


[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

## Koliko doprinosa moram platiti ako sam zaposlen kod drugog poslodavca?Kopirano

Ako ste zaposleni kod drugog poslodavca doprinosi se plaćaju jednom godišnje i to u roku od 15 dana od primitka rješenja porezne uprave. Na rješenju će pisati koliko ste dužni platiti.

U slučaju da ste poslovali od početka godine iznosi koje je potrebno uplatiti su navedeni niže:

**1.** Ako ste u prošloj godini imali primitke između 0,00 i 11.300,00€ - godišnje plaćate 127,13€ mirovinsko 1. stup, 42,38€ mirovinsko 2. stup i 127,13€ zdravstveno

**2.** Ako ste u prošloj godini imali primitke između 11.300,01 i 15.300,00€ - godišnje plaćate 172,13€ mirovinsko 1. stup, 57,38€ mirovinsko 2. stup i 172,13€ zdravstveno

**3.** Ako ste u prošloj godini imali pri

---

## https://fiskalopedija.hr/baza-znanja/porez-na-dohodak-pausalni-obrt

﻿
Porez na dohodak u paušalnom obrtu u 2026. godini





 ﻿



# Porez na dohodak u paušalnom obrtu u 2026. godini

Ažurirano: 06.03.2026.

👍 303 [💬 Komentara (0)](https://fiskalopedija.hr/baza-znanja/porez-na-dohodak-pausalni-obrt#zajednica)

## Saznajte kako, koliko i kada treba platiti porez na dohodak u paušalnom obrtu. Platite odmah putem [Kalkulator i asistenta za plaćanje poreza](https://fiskalopedija.hr/asistent-za-placanje-poreza-doprinosa)

## Kada se plaća porez na dohodak u paušalnom obrtu?Kopirano

Porez na dohodak u paušalnom obrtu se dužni platiti na kraju svakog tromjesečja. Prvi iznos plaćate do **31.03.** sljedeći do **30.06.** pa do **30.09.** i za kraj do **31.12.**
Iznos koji uplaćujete je iznos za 3 mjeseca. Mjesečni iznos poreza pomnožite sa 3.

[Tablični prikaz mjesečnog iznosa poreza dohodak u paušalnom obrtu](https://fiskalopedija.hr/pausalni-obrt-razredi)

[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

oglasni prostor

## Jednostavno plaćanja poreza na dohodak u paušalnom obrtu pomoću kalkulatora i asistenta za plaćanje poreza?Kopirano

Zaboravljate platiti porez? Niste sigurni na koji IBAN, što upisati pod model i poziv na broj? Pitate se koji iznos uplatiti ovaj mjesec? Fiskalopedija vam nudi [Kalkulator i asistent za plaćanje poreza i doprinosa](https://fiskalopedija.hr/asistent-za-placanje-poreza-doprinosa) koji će vam izračunati iznose, generirati točne podatke za uplatu, i pripremiti 2D barkod spreman za plaćanje te opcionalno tromjesečno na mail poslati podsjetnik sa podacima za uplatu.


## Koliki iznos moram uplatiti svaka 3 mjeseca?Kopirano

Iznos koji morate uplatiti ovisi o tome u koji porezni razred ulazite odnosno koliko ste primitaka imali u prošloj godini:

1\\. Ako ste u prošloj godini imali primitke između 0,00 i 11.300,00€ - plaćate 50,85€

2\\. Ako ste u prošloj godini imali primitke između 11.300,01 i 15.300,00€ - plaćate 68,85€

3\\. Ako ste u prošloj godini imali primitke između 15.300,01 i 19.900,00€ - plaćate 89,50€

4\\. Ako ste u prošloj godini imali primitke između 19.900,01 i 30.600,00€ - plaćate 137,70€

5\\. Ako ste u prošloj godini imali primitke između 30.600,01 i 40.000,00€ - plaćate 180,00€

6\\. Ako ste u prošloj godini imali primitke između 40.000,01 i 50.000,00€ - plaćate 225,00€

7\\. Ako ste u prošloj godini imali primitke između 50.000,01 i 60.000,00€ - plaćate 270,00€

Ako vam je ovo prva godina poslovanja u tom slučaju se gleda iznos primitaka koji ste prijavili u [RPO obrascu](https://fiskalopedija.hr/baza-znanja/predaja-rpo-obrasca-online).
U roku od 8 dana od otvaranja (rješenja) obrta potrebno je na poreznu predati RPO obrazac odnosno upisati se u registar poreznih obveznika.

Tablični prikaz iznosa za plaćanje poreza u paušalnom obrtu

| # | Ukupni primici (EUR) | Tromjesečni paušalni porez (EUR) | Godišnji paušalni porez (EUR) |
| --- | --- | --- | --- |
| 1 | 0,00 - 11.300,00 | 50,85 | 203,40 |
| 2 | 11.300,01 - 15.300,00 | 68,58 | 274,32 |
| 3 | 15.

---

## https://fiskalopedija.hr/baza-znanja/fiskalizacija-20-pausalni-obrt

﻿
Fiskalizacija 2.0 u paušalnom obrtu: što se mijenja i kako se pripremiti






 ﻿



# Fiskalizacija 2.0 u paušalnom obrtu: što se mijenja i kako se pripremiti

Ažurirano: 15.09.2025.

👍 216 [💬 Komentara (62)🔥](https://fiskalopedija.hr/baza-znanja/fiskalizacija-20-pausalni-obrt#zajednica)

## Čitanjem ovog članka saznat ćeš točno koje promjene donosi fiskalizacija 2.0 za paušalne obrte, kada stupaju na snagu i kako se bez panike pripremiti na njih.

## Koji dijelovi Fiskalizacije 2.0 se odnose na paušalni obrt?Kopirano

Paušalne obrte zahvaćaju dvije ključne promjene koje stupaju na snagu 1.1.2026.:

**Fiskalizaciju transakcijskih računa**

**i zaprimanje eRačuna od drugih poslovnih subjekata.**

• Sa 1.1.2026. paušalni obrti nisu obveznici izdavanje eRačuna. Obveza izdavanja eRačuna dolazi sa 1.1.2027.

• Sa 1.1.2026. paušalni obrt je obavezan zaprimati eRačune

• Sa 1.1.2026. paušalni obrt je obavezan fiskalizirati "Transakcijske račune" izdane u krajnjoj potrošnji

[Opširno o fiskalizaciji 2.0](https://fiskalopedija.hr/baza-znanja/fiskalizacija-20)

[Alat koji pomaže provjeriti obaveze koje nastupaju sa Fiskalizacijom 2.0](https://fiskalopedija.hr/fiskalizacija20-provjera-obaveza)

[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

## Što znači da će se morati fiskalizirati transakcijski računi?Kopirano

Transakcijski računi u krajnjoj potrošnji (izdani na fizičku osobu) će se morati fiskalizirati. Transkacijski računi izdani na firmu (B2B) će se do 1.1.2027. moći izdavati kao i do sada u Excelu ili putem [predloška](https://fiskalopedija.hr/racun-predlozak).
Do sada ste transakcijske račune za građane mogli izrađivati u Excelu jer se nisu morali fiskalizirati. Sada će vam trebati program koji omogućuje fiskalizaciju računa. Ako ste do sada primali gotovinske ili kartične uplate već imate program koji izdaje fiskalne račune. Ubuduće će taj program i kod načina plaćanja "Transakcijski račun" izdavati fiskalne račune. To je jedina promjena. Ako već koristite neki program za izdavanje računa on će tu opciju sigurno imati spremnu na vrijeme.

Ako ste do sada izdavali samo transakcijske računa i to putem Worda, Excela ili putem nekog predloška sa 1.1.2026. trebat će vam program za izradu računa.


## Kako ću zaprimati eRačune u paušalnom obrtu?Kopirano

Dobra stvar je da se u paušalnom obrtu ne mora voditi evidencija ulaznih računa pa ako vam to nije nužno za vaše specifično poslovanje možda se neće trebati time baviti. Ako ćete ipak trebati ili željeti evidentirati ulazne račune za to je država pripremila besplatnu [MikroeRačun](https://fiskalopedija.hr/baza-znanja/mikroeracun-aplikacija) aplikaciju koja će vam to omogućiti. Ako želite pojednostaviti proces poslovanja i unutar vašeg postojeće aplikacije za izdavanje računa primati ulazne eRačune to ćete dogovoriti sa firmom koja održava vašu aplikaciju.


[Imate pitanje? (060 601 601)](tel:060601601 "Nazovi korisničku podršku")

oglas

[**Marketino jednostavno ima sve što

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
