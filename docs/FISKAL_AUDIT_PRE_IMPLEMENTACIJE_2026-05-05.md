# KVIK — TEHNIČKI AUDIT

## Status: Fiskalizacija NIJE implementirana

## Datum: 5. svibnja 2026.

## Svrha: Pregled postojećeg koda prije implementacije F1.0

Ovaj dokument sažima strukturu repozitorija, Supabase shemu (iz migracija + inferencija iz koda), tok kreiranja računa, PDF generaciju, autentikaciju, `src/lib`, okruženje, ovisnosti i UI obrasce relevantne za ugradnju **fiskalizacije 1.0** bez duplikacije logike.

**Ključni zaključak:** u kodu **nema** modula za CIS/SOAP, XML potpis, ZKI/JIR, niti perzistencije fiskalnih odgovora. Postoji isključivo izdavanje **PDF računa** (`@react-pdf/renderer`), spremanje u Supabase i poveznica na KPR. Edukativni/marketing sadržaj o fiskalizaciji postoji u `src/app/vodici/**` i na landing stranici — to **nije** produkcijska implementacija.

---

## 1. Struktura projekta

### 1.1. Napomena o putanjama

- Aplikacija koristi **Next.js App Router** pod **`src/app/**`**, ne korijenski `/app`.
- **Ne postoji** zajednički `src/components/`; UI je uglavnom **kolociran** uz rute (`src/app/(app)/...`, `src/app/alati/_components/...`).
- Tipovi: **`src/types/`** — samo deklaracije za vanjske module (`pdf417-generator`, Turnstile).

### 1.2. Kompletno stablo (bez `node_modules/`, `.git/`, `.next/` sadržaja)

Izvršeno: `find … -prune` na `node_modules`, `.git`, `.next`; ispisane su relativne putanje od korijena repozitorija (321 stavka).

```text
.cursor
.cursor/rules
.cursor/rules/git-finalization-workflow.mdc
.cursor/rules/prompt-clarity-route-context.mdc
.env.example
.env.local
.eslintrc.json
.git
.gitignore
.next
README.md
audits
audits/2026-04-27_14-07_kvit-audit.md
audits/README.md
audits/compare.sh
docs
docs/FISKAL_AUDIT_PRE_IMPLEMENTACIJE_2026-05-05.md
docs/REBRANDING_REPORT.md
next-env.d.ts
next.config.mjs
node_modules
package-lock.json
package.json
postcss.config.mjs
public
public/fonts
public/fonts/Roboto-Bold.ttf
public/fonts/Roboto-Regular.ttf
public/manifest.json
public/sw.js
public/workbox-4754cb34.js
scripts
scripts/landing-source.html
scripts/prefix-landing-css.mjs
src
src/app
src/app/(app)
src/app/(app)/dashboard
src/app/(app)/dashboard-shell.tsx
src/app/(app)/dashboard/dashboard-referral-section.tsx
src/app/(app)/dashboard/page.tsx
src/app/(app)/kpr
src/app/(app)/kpr/page.tsx
src/app/(app)/kupci
src/app/(app)/kupci/page.tsx
src/app/(app)/layout.tsx
src/app/(app)/po-sd
src/app/(app)/po-sd/page.tsx
src/app/(app)/po-sd/po-sd-pdf-actions.tsx
src/app/(app)/po-sd/po-sd-referral-activation.tsx
src/app/(app)/ponude
src/app/(app)/ponude/[id]
src/app/(app)/ponude/[id]/uredi
src/app/(app)/ponude/[id]/uredi/page.tsx
src/app/(app)/ponude/convert-button.tsx
src/app/(app)/ponude/nova
src/app/(app)/ponude/nova/page.tsx
src/app/(app)/ponude/offer-list.tsx
src/app/(app)/ponude/page.tsx
src/app/(app)/postavke
src/app/(app)/postavke/page.tsx
src/app/(app)/racuni
src/app/(app)/racuni/email-button.tsx
src/app/(app)/racuni/invoice-list.tsx
src/app/(app)/racuni/novi
src/app/(app)/racuni/novi/page.tsx
src/app/(app)/racuni/page.tsx
src/app/(app)/racuni/paid-button.tsx
src/app/(app)/racuni/storno-button.tsx
src/app/(app)/stavke
src/app/(app)/stavke/page.tsx
src/app/(auth)
src/app/(auth)/confirm-email
src/app/(auth)/confirm-email/page.tsx
src/app/(auth)/login
src/app/(auth)/login/page.tsx
src/app/(auth)/onboarding
src/app/(auth)/onboarding/page.tsx
src/app/(auth)/register
src/app/(auth)/register/page.tsx
src/app/alati
src/app/alati/_components
src/app/alati/_components/alati-breadcrumb.tsx
src/app/alati/_components/cta-register.tsx
src/app/alati/_components/json-ld.ts
src/app/alati/_components/tool-ref-tracker.tsx
src/app/alati/_components/value-gate-export-modal.tsx
src/app/alati/checklista
src/app/alati/checklista/obligations-checklist.tsx
src/app/alati/checklista/page.tsx
src/app/alati/interni-akt
src/app/alati/interni-akt/interni-akt-tool.tsx
src/app/alati/interni-akt/page.tsx
src/app/alati/izjava-poslovni-prostor
src/app/alati/izjava-poslovni-prostor/izjava-poslovni-prostor-tool.tsx
src/app/alati/izjava-poslovni-prostor/page.tsx
src/app/alati/izjava-pozajmnica
src/app/alati/izjava-pozajmnica/izjava-pozajmnica-tool.tsx
src/app/alati/izjava-pozajmnica/page.tsx
src/app/alati/kalkulator-poreza
src/app/alati/kalkulator-poreza/page.tsx
src/app/alati/kalkulator-poreza/pausal-tax-calculator.tsx
src/app/alati/layout.tsx
src/app/alati/page.tsx
src/app/alati/pdv-prag
src/app/alati/pdv-prag/page.tsx
src/app/alati/pdv-prag/pdv-prag-calculator.tsx
src/app/alati/placanje-doprinosa
src/app/alati/placanje-doprinosa/page.tsx
src/app/alati/placanje-doprinosa/placanje-doprinosa-tool.tsx
src/app/alati/rok-podsjetnici
src/app/alati/rok-podsjetnici/page.tsx
src/app/alati/rok-podsjetnici/rok-podsjetnici-client.tsx
src/app/api
src/app/api/alati
src/app/api/alati/kpr-year
src/app/api/alati/kpr-year/route.ts
src/app/api/auth
src/app/api/auth/register
src/app/api/auth/register/route.ts
src/app/api/chat
src/app/api/chat/route.ts
src/app/api/kpr
src/app/api/kpr/pdf
src/app/api/kpr/pdf/route.ts
src/app/api/kpr/xlsx
src/app/api/kpr/xlsx/route.ts
src/app/api/po-sd
src/app/api/po-sd/pdf
src/app/api/po-sd/pdf/route.ts
src/app/api/ponude
src/app/api/ponude/[id]
src/app/api/ponude/[id]/convert
src/app/api/ponude/[id]/convert/route.ts
src/app/api/ponude/[id]/pdf
src/app/api/ponude/[id]/pdf/route.ts
src/app/api/ponude/[id]/route.ts
src/app/api/ponude/route.ts
src/app/api/public
src/app/api/public/register-count
src/app/api/public/register-count/route.ts
src/app/api/racuni
src/app/api/racuni/[id]
src/app/api/racuni/[id]/email
src/app/api/racuni/[id]/email/route.ts
src/app/api/racuni/[id]/pdf
src/app/api/racuni/[id]/pdf/route.ts
src/app/api/racuni/[id]/status
src/app/api/racuni/[id]/status/route.ts
src/app/api/racuni/route.ts
src/app/api/referral
src/app/api/referral/dashboard-summary
src/app/api/referral/dashboard-summary/route.ts
src/app/api/referral/ensure-code
src/app/api/referral/ensure-code/route.ts
src/app/api/referral/record-activation
src/app/api/referral/record-activation/route.ts
src/app/api/referral/tool-ref-visit
src/app/api/referral/tool-ref-visit/route.ts
src/app/api/share
src/app/api/share/[id]
src/app/api/share/[id]/visit
src/app/api/share/[id]/visit/route.ts
src/app/api/share/answers
src/app/api/share/answers/route.ts
src/app/asistent
src/app/asistent/hardcoded-qa-data.ts
src/app/asistent/layout.tsx
src/app/asistent/page.tsx
src/app/asistent/share-ai-response.tsx
src/app/auth
src/app/auth/callback
src/app/auth/callback/route.ts
src/app/early-adopter-hero-note.tsx
src/app/favicon.ico
src/app/fonts
src/app/fonts/GeistMonoVF.woff
src/app/fonts/GeistVF.woff
src/app/globals.css
src/app/kvik-landing-css.ts
src/app/layout.tsx
src/app/opengraph-image.tsx
src/app/page.tsx
src/app/privacy
src/app/privacy/page.tsx
src/app/r
src/app/r/[code]
src/app/r/[code]/page.tsx
src/app/robots.ts
src/app/share
src/app/share/[uuid]
src/app/share/[uuid]/page.tsx
src/app/share/[uuid]/share-answer-body.tsx
src/app/share/[uuid]/share-visit-tracker.tsx
src/app/sitemap.ts
src/app/uvjeti
src/app/uvjeti/page.tsx
src/app/vodici
src/app/vodici/_components
src/app/vodici/_components/guide-shell.tsx
src/app/vodici/_components/vodici-nav.tsx
src/app/vodici/alati-za-pausalne-obrtnike
src/app/vodici/alati-za-pausalne-obrtnike/page.tsx
src/app/vodici/doprinosi
src/app/vodici/doprinosi-uz-posao
src/app/vodici/doprinosi-uz-posao/page.tsx
src/app/vodici/doprinosi/page.tsx
src/app/vodici/fina-certifikat-fiskalizacija
src/app/vodici/fina-certifikat-fiskalizacija/page.tsx
src/app/vodici/fiskalizacija-20
src/app/vodici/fiskalizacija-20/page.tsx
src/app/vodici/izdavanje-racuna
src/app/vodici/izdavanje-racuna-vodic
src/app/vodici/izdavanje-racuna-vodic/page.tsx
src/app/vodici/izdavanje-racuna/page.tsx
src/app/vodici/knjiga-trazbi
src/app/vodici/knjiga-trazbi/page.tsx
src/app/vodici/kpr-knjiga-prometa
src/app/vodici/kpr-knjiga-prometa/page.tsx
src/app/vodici/kpr-online-generator
src/app/vodici/kpr-online-generator/page.tsx
src/app/vodici/layout.tsx
src/app/vodici/otvaranje-obrta
src/app/vodici/otvaranje-obrta/page.tsx
src/app/vodici/page.tsx
src/app/vodici/pausalni-obrt-vodic
src/app/vodici/pausalni-obrt-vodic/page.tsx
src/app/vodici/pausalni-obrt-vs-doo
src/app/vodici/pausalni-obrt-vs-doo/page.tsx
src/app/vodici/pausalni-obrt-za-fotografe
src/app/vodici/pausalni-obrt-za-fotografe/page.tsx
src/app/vodici/pausalni-obrt-za-it-freelancere
src/app/vodici/pausalni-obrt-za-it-freelancere/page.tsx
src/app/vodici/pausalni-obrt-za-konzultante
src/app/vodici/pausalni-obrt-za-konzultante/page.tsx
src/app/vodici/pausalni-obrt-za-kozmeticare
src/app/vodici/pausalni-obrt-za-kozmeticare/page.tsx
src/app/vodici/pausalni-obrt-za-ugostitelje
src/app/vodici/pausalni-obrt-za-ugostitelje/page.tsx
src/app/vodici/pdv-id
src/app/vodici/pdv-id/page.tsx
src/app/vodici/po-sd-obrazac
src/app/vodici/po-sd-obrazac/page.tsx
src/app/vodici/porez-na-dohodak
src/app/vodici/porez-na-dohodak/page.tsx
src/app/vodici/prikriveni-radni-odnos
src/app/vodici/prikriveni-radni-odnos/page.tsx
src/app/vodici/rokovi-placanja
src/app/vodici/rokovi-placanja/page.tsx
src/app/vodici/rpo-obrazac
src/app/vodici/rpo-obrazac/page.tsx
src/app/vodici/sezonski-obrt
src/app/vodici/sezonski-obrt/page.tsx
src/app/vodici/sjediste-obrta-vs-prebivaliste
src/app/vodici/sjediste-obrta-vs-prebivaliste/page.tsx
src/app/vodici/turisticka-clanarina
src/app/vodici/turisticka-clanarina/page.tsx
src/app/vodici/zatvaranje-obrta
src/app/vodici/zatvaranje-obrta/page.tsx
src/hooks
src/hooks/use-alati-session.ts
src/lib
src/lib/alati
src/lib/alati/download-react-pdf-client.ts
src/lib/alati/hub3-eur.ts
src/lib/alati/pausal-brackets.ts
src/lib/alati/zakonski-rokovi.ts
src/lib/client-ip.ts
src/lib/format-hr.ts
src/lib/invoice-normalize.ts
src/lib/kpr-export.ts
src/lib/opcine.ts
src/lib/pausal-tax.ts
src/lib/pdf
src/lib/pdf/alati-izjave-styles.ts
src/lib/pdf/doprinos-uplata-preview-document.tsx
src/lib/pdf/interni-akt-document.tsx
src/lib/pdf/invoice-document.tsx
src/lib/pdf/izjava-poslovni-prostor-document.tsx
src/lib/pdf/izjava-pozajmnica-document.tsx
src/lib/pdf/kalkulator-rezultat-document.tsx
src/lib/pdf/kpr-document.tsx
src/lib/pdf/pdf417-matrix.ts
src/lib/pdf/po-sd-document.tsx
src/lib/pdf/register-roboto.ts
src/lib/pdf/render-pdf-buffer.ts
src/lib/po-sd-data.ts
src/lib/referral
src/lib/referral/hash-ip.ts
src/lib/referral/random-code.ts
src/lib/registration-rate-limit.ts
src/lib/supabase
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/service-role.ts
src/lib/vodici-config.ts
src/middleware.ts
src/types
src/types/pdf417-generator.d.ts
src/types/turnstile.d.ts
supabase
supabase/migrations
supabase/migrations/20260411120000_profiles_iban.sql
supabase/migrations/20260419140000_profiles_alati_plan.sql
supabase/migrations/20260421120000_registration_attempts.sql
supabase/migrations/20260426210000_invoice_items_catalogs_customers.sql
supabase/migrations/20260426213000_ponude.sql
supabase/migrations/20260426220500_racuni_email_tracking.sql
supabase/migrations/20260426225500_racuni_payment_barcode.sql
supabase/migrations/20260426231000_invoice_type_recurring_storno.sql
supabase/migrations/20260427110000_profile_settings_columns.sql
supabase/migrations/20260427112000_profile_owner_residence.sql
supabase/migrations/20260427130000_payment_phase_one.sql
supabase/migrations/20260503140000_layer1_shared_answers.sql
supabase/migrations/20260503140100_layer3_referral_codes.sql
supabase/migrations/20260503140200_layer2_referral_visits.sql
tailwind.config.ts
tsconfig.json
tsconfig.tsbuildinfo
vercel.json
```

### 1.3. Fokus: `src/app` (stranice + API)

| Područje | Putanja |
|----------|---------|
| Zaštićeni app UI | `src/app/(app)/**` — npr. `/racuni`, `/postavke`, `/kpr`, `/ponude` |
| Auth stranice | `src/app/(auth)/**` |
| Javni sadržaj | `src/app/page.tsx`, `src/app/alati/**`, `src/app/vodici/**` |
| API rute | `src/app/api/**/route.ts` |

**Računi (UI):** `src/app/(app)/racuni/page.tsx`, `src/app/(app)/racuni/novi/page.tsx`, `invoice-list.tsx`, `email-button.tsx`, `paid-button.tsx`, `storno-button.tsx`.

**Računi (API):** `src/app/api/racuni/route.ts`, `src/app/api/racuni/[id]/pdf/route.ts`, `src/app/api/racuni/[id]/email/route.ts`, `src/app/api/racuni/[id]/status/route.ts`.

---

## 2. Supabase shema

### 2.1. Izvor istine u repozitoriju

- **`supabase/migrations/*.sql`** — dijelovi sheme eksplicitno kreirani ili `ALTER`ani.
- **`profiles`**, **`racuni`**, **`kpr_unosi`**: u migracijama **nema** početnog `CREATE TABLE` za te tablice; shema se **rekonstruira** iz postojećih migracija + `insert`/`select`/`upsert` u TypeScriptu.

### 2.2. Tablice iz migracija (sažeto)

| Tablica | Opis |
|---------|------|
| `kupci` | `id`, `user_id` → `auth.users`, `naziv`, `oib`, `adresa`, `email`, `created_at` + RLS |
| `artikli` | `id`, `user_id`, `naziv`, `jedinicna_cijena`, `created_at` + RLS |
| `invoice_items` | `id`, `racun_id` → `racuni`, stavke, `popust` (dodano fazom), `ukupno`, … + RLS |
| `ponude`, `ponuda_items` | Ponude + stavke + RLS + kolone popusta/dostave (faza 1) |
| `registration_attempts` | Rate limit registracije |
| `shared_answers`, `referrals`, `user_referral_codes`, `referral_activations`, `referral_visits` | Referral / AI dijeljenje |

**Migracije na `racuni`:** email tracking (`email_poslano_at`, `email_poslano_na`), `dodaj_barkod_placanja`, `tip_racuna` + check R1/R2/bez_oznake, `barkod_enabled`, `recurring`, `recurring_interval` + check, `popust_racun`, `rok_placanja`, `datum_dospijeca`, `dostava_iznos`, `dostava_opis`.

**Migracije na `profiles`:** `iban`, `kvit_plan`, `opcina`, adresa (`ulica`, `postanski_broj`, `grad`, `sifra_opcine`, `ispostava_porezne`), vlasnik/prebivalište, `price_locked`, `locked_price`, `pro_expires_at`.

### 2.3. `profiles` — kolone korištene u kodu (inferencija FK)

- **FK (uobičajeni Supabase obrazac):** `profiles.id` = `auth.users.id` (potvrđuje `upsert({ id: user.id })`).
- **Kolone (unija kroz app):** `naziv_obrta`, `oib`, `iban`, `adresa`, `ulica`, `postanski_broj`, `grad`, `opcina`, `sifra_opcine`, `ispostava_porezne`, polja vlasnika/prebivališta, `adresa_ista`, `je_jedina_djelatnost`, `godisnji_primici_prosle_godine`, `kvit_plan`, `pro_expires_at`, `price_locked`, `locked_price`.

### 2.4. `racuni` — kolone iz migracija + insert/select u kodu

- Identitet: `id`, `user_id`, `kupac_id`
- Dokument: `broj_racuna`, `datum`, `datum_placanja`, `nacin_placanja`, `ukupni_iznos`, `status`, `napomena`
- Tip / ponavljanje: `tip_racuna`, `recurring`, `recurring_interval`
- Barkod: `dodaj_barkod_placanja`, `barkod_enabled`
- Email: `email_poslano_at`, `email_poslano_na`
- Plaćanje / dostava: `popust_racun`, `rok_placanja`, `datum_dospijeca`, `dostava_iznos`, `dostava_opis`

### 2.5. `kpr_unosi` (nema CREATE u repou; inferencija iz inserta)

Korištene kolone u kodu: `user_id`, `racun_id`, `datum`, `broj_temeljnice`, `opis`, `iznos_gotovina`, `iznos_bezgotovinsko`, `ukupno`.

---

## 3. Računi — postojeći kod

### 3.1. Lista računa

**Datoteka:** `src/app/(app)/racuni/page.tsx`  
Server component: `createClient()` → `auth.getUser()` → redirect ako nema usera → paralelno `racuni` (s `kupci`) + `profiles.naziv_obrta` → `InvoiceList`.

### 3.2. Novi račun

**Datoteka:** `src/app/(app)/racuni/novi/page.tsx` (~1190+ linija)  
`'use client'`: forma (stavke, popusti, dostava, R1/R2, recurring, autocomplete), lokalni pregled u modalu, `POST /api/racuni` s JSON payloadom.

### 3.3. API kreiranja

**Datoteka:** `src/app/api/racuni/route.ts`  
`POST`: validacija, normalizacija stavki (`normalizeDocumentItems`), upsert `kupci`, upsert katalog `artikli`, `insert` u `racuni` + `invoice_items`; ako je `status === 'placeno'`, `insert` u `kpr_unosi`.

### 3.4. Status / plaćeno / storno

**Datoteka:** `src/app/api/racuni/[id]/status/route.ts`  
`PATCH`: ažurira `racuni`; pri prijelazu na `placeno` dodaje KPR red ako ne postoji; pri `stornirano` dodaje negativni KPR unos.

### 3.5. Pomoćne UI datoteke

- `src/app/(app)/racuni/invoice-list.tsx` — tablica, filteri, link na PDF, gumbi
- `src/app/(app)/racuni/email-button.tsx` — modal, `POST .../email`
- `src/app/(app)/racuni/paid-button.tsx` — `PATCH .../status` plaćeno
- `src/app/(app)/racuni/storno-button.tsx` — potvrda, `PATCH .../status` storno

### 3.6. Konverzija ponude u račun

**Datoteka:** `src/app/api/ponude/[id]/convert/route.ts` — kreira `racuni` + `invoice_items` iz ponude.

---

## 4. PDF generacija

| Stavka | Detalj |
|--------|--------|
| **Biblioteka** | `@react-pdf/renderer` |
| **Barkod** | `pdf417-generator` + `src/lib/pdf/pdf417-matrix.ts` |
| **Predložak računa** | `src/lib/pdf/invoice-document.tsx` (`InvoiceDocument`) |
| **Font** | Roboto iz `public/fonts/` — `src/lib/pdf/register-roboto.ts` |
| **Stream (pregled)** | `GET src/app/api/racuni/[id]/pdf/route.ts` — `renderToStream` |
| **Buffer (email)** | `src/lib/pdf/render-pdf-buffer.ts` + `POST .../email/route.ts` |
| **HUB-3 niz** | `src/lib/alati/hub3-eur.ts` (`buildHub30EurCode`) |

**Sadržaj PDF-a (logički):** izdavatelj, kupac, meta (broj, datum, R1/R2), stavke, popusti/dostava/ukupno, opcionalni PDF417 za žiro + IBAN, PDV napomena (nije u PDV-u).

**Za F1.0:** na PDF-u **nema** ZKI, JIR, vremena obrade, OIB operatera itd.

---

## 5. Authentication

- **Supabase Auth** + **`@supabase/ssr`**
- **`src/lib/supabase/server.ts`** — `createServerClient` + cookie adapter (`cookies()`)
- **`src/lib/supabase/client.ts`** — `createBrowserClient`
- **`src/middleware.ts`** — javne rute vs login; za app korijene provjera `profiles.naziv_obrta` → onboarding
- **`src/app/auth/callback/route.ts`** — `exchangeCodeForSession`

**User u API rutama:** `const supabase = createClient();` pa `const { data: { user } } = await supabase.auth.getUser();` te filter `.eq('user_id', user.id)`.

**Service role (oprezno):** `src/lib/supabase/service-role.ts` — samo server.

---

## 6. `src/lib` — inventar i uloga

| Datoteka | Uloga |
|----------|--------|
| `invoice-normalize.ts` | Normalizacija stavki za račun/ponudu |
| `kpr-export.ts` | Tekst KPR automata, godina za export |
| `format-hr.ts` | Datumi, iznosi, labeli statusa |
| `alati/hub3-eur.ts` | HRVHUB30 tekst za PDF417 |
| `pdf/pdf417-matrix.ts` | Matrica za crtanje u PDF-u |
| `pdf/invoice-document.tsx` | Glavni PDF računa |
| `pdf/render-pdf-buffer.ts` | Buffer za email |
| `pdf/register-roboto.ts` | Registracija fonta |
| `pdf/kpr-document.tsx`, `pdf/po-sd-document.tsx`, … | Ostali PDF-ovi |
| `opcine.ts` | Velika lista općina (PO-SD / postavke) |
| `po-sd-data.ts`, `pausal-tax.ts` | PO-SD / paušal logika |
| `supabase/*` | Klijenti |
| `vodici-config.ts` | SEO / vodiči meta |
| `registration-rate-limit.ts`, `client-ip.ts` | Registracija |
| `referral/*` | Referral hash / kod |

**Fiskalizacija:** nema dediciranog modula.

---

## 7. Environment varijable

**Iz `.env.example`:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.

**Dodatno u kodu:** `RESEND_FROM_EMAIL` (opcionalno, email računa), `NODE_ENV`.

Vrijednosti iz `.env.local` **nisu** dokumentirane ovdje.

---

## 8. `package.json` — dependencies

- `@react-pdf/renderer`, `@supabase/ssr`, `@supabase/supabase-js`, `next`, `react`, `pdf417-generator`, `react-markdown`, `xlsx`, …

**Nije instalirano:** `node-forge`, `xml-crypto` (niti druge tipične XML-potpis biblioteke u dependencies).

---

## 9. Postavke (`src/app/(app)/postavke/page.tsx`)

- `'use client'`, jedna velika forma
- Sekcije: podaci obrta, adresa sjedišta (općina autocomplete), prebivalište vlasnika, djelatnost, ispostava PU
- `profiles` load + `upsert` na `id`
- Toast: lokalni `useState`, ne globalni provider

**Nova sekcija:** proširiti `ProfileForm`, `select`, `upsert` payload i novi `<section>` u JSX-u.

---

## 10. UI obrasci (wizard, upload, modal, loading, toast)

| Potreba | Stanje |
|---------|--------|
| Wizard / stepper | Da — **ad hoc** u `onboarding/page.tsx` (koraci + progress); nema shared `<Stepper>` |
| Upload / drag-drop | **Nema** generičke komponente u `src` |
| Modal | Da — **inline** (`fixed inset-0`, često forma); primjer s `role="dialog"`: `value-gate-export-modal.tsx` |
| Loading | Tekst na gumbima + `disabled` |
| Toast | Parcijalno — `postavke` vlastiti state; nema `sonner` / `react-hot-toast` |

---

## Prilog A — kompletan izvorni kod (računi, API, PDF pomoćni moduli, env, package)

> **Nije uključeno u prilog** (predugačko za jedan MD): `src/app/(app)/racuni/novi/page.tsx`, `src/lib/pdf/invoice-document.tsx`, `src/lib/opcine.ts`. Puni kod je u repozitoriju na navedenim putanjama.

### `src/app/(app)/racuni/page.tsx`

```tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { InvoiceList, type InvoiceRow } from './invoice-list';

export default async function RacuniPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: racuni }, { data: profil }] = await Promise.all([
    supabase
      .from('racuni')
      .select(
        'id, broj_racuna, datum, nacin_placanja, status, ukupni_iznos, email_poslano_at, email_poslano_na, kupci(naziv, email)',
      )
      .eq('user_id', user.id)
      .order('datum', { ascending: false }),
    supabase
      .from('profiles')
      .select('naziv_obrta')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  const invoiceRows = ((racuni ?? []) as unknown as Array<
    Omit<InvoiceRow, 'kupci'> & {
      kupci: InvoiceRow['kupci'] | InvoiceRow['kupci'][];
    }
  >).map((racun) => ({
    ...racun,
    kupci: Array.isArray(racun.kupci) ? (racun.kupci[0] ?? null) : racun.kupci,
  }));

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
        <header className='flex flex-col gap-4 rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
          <div>
            <p className='font-body text-sm text-[#94a3a0]'>
              Evidencija računa
            </p>
            <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Računi</h1>
          </div>
          <Link
            href='/racuni/novi'
            className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Novi račun
          </Link>
        </header>

        <InvoiceList
          invoices={invoiceRows}
          nazivObrta={profil?.naziv_obrta ?? 'Kvik'}
        />
      </div>
    </main>
  );
}
```

### `src/app/api/racuni/route.ts`

```ts
import { NextResponse } from 'next/server';

import { normalizeDocumentItems } from '@/lib/invoice-normalize';
import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import { createClient } from '@/lib/supabase/server';

type InvoicePayload = {
  brojRacuna: string;
  datum: string;
  datumPlacanja?: string;
  nacinPlacanja: 'ziro' | 'gotovina' | 'kartica';
  status: 'izdano' | 'placeno' | 'stornirano';
  tipRacuna?: 'R1' | 'R2' | 'bez_oznake';
  napomena?: string;
  dodajBarkodPlacanja?: boolean;
  recurring?: boolean;
  recurringInterval?: 'mjesecno' | 'kvartalno' | 'godisnje';
  popustRacun?: number;
  rokPlacanja?: string;
  datumDospijeca?: string;
  dostava?: {
    enabled?: boolean;
    opis?: string;
    iznos?: number;
  };
  kupac: {
    naziv: string;
    oib?: string;
    adresa?: string;
    email?: string;
  };
  items?: Array<{
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
    popust?: number;
  }>;
  /** Backward compatibility for any older clients still sending one row. */
  stavka?: {
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
    popust?: number;
  };
};

async function upsertCatalogItem(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  item: ReturnType<typeof normalizeDocumentItems>[number],
) {
  const { data: existing } = await supabase
    .from('artikli')
    .select('id')
    .eq('user_id', userId)
    .ilike('naziv', item.opis)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('artikli')
      .update({ jedinicna_cijena: item.jedinicnaCijena })
      .eq('id', existing.id)
      .eq('user_id', userId);
    return;
  }

  await supabase.from('artikli').insert({
    user_id: userId,
    naziv: item.opis,
    jedinicna_cijena: item.jedinicnaCijena,
  });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const body = (await request.json()) as InvoicePayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = normalizeDocumentItems(
    Array.isArray(body.items) ? body.items : body.stavka ? [body.stavka] : [],
  );
  if (items.length === 0) {
    return NextResponse.json(
      { error: 'Dodaj barem jednu ispravnu stavku računa.' },
      { status: 400 },
    );
  }

  const kupacNaziv = body.kupac.naziv.trim();
  if (!kupacNaziv) {
    return NextResponse.json({ error: 'Naziv kupca je obavezan.' }, { status: 400 });
  }
  const tipRacuna = body.tipRacuna ?? 'R1';
  if (!['R1', 'R2', 'bez_oznake'].includes(tipRacuna)) {
    return NextResponse.json({ error: 'Tip računa nije ispravan.' }, { status: 400 });
  }
  if (tipRacuna === 'R1' && !body.kupac.oib?.trim()) {
    return NextResponse.json(
      { error: 'R1 račun zahtijeva OIB kupca.' },
      { status: 400 },
    );
  }
  const recurring = body.recurring === true;
  const recurringInterval: InvoicePayload['recurringInterval'] | null = recurring
    ? (body.recurringInterval ?? 'mjesecno')
    : null;
  if (
    recurring &&
    (!recurringInterval ||
      !['mjesecno', 'kvartalno', 'godisnje'].includes(recurringInterval))
  ) {
    return NextResponse.json(
      { error: 'Interval ponavljanja nije ispravan.' },
      { status: 400 },
    );
  }

  const popustRacun = Math.min(Math.max(Number(body.popustRacun ?? 0) || 0, 0), 100);
  const meduzbroj = items.reduce((sum, item) => sum + item.ukupno, 0);
  const popustRacunIznos = meduzbroj * (popustRacun / 100);
  const dostavaIznos =
    body.dostava?.enabled === true
      ? Math.max(Number(body.dostava.iznos ?? 0) || 0, 0)
      : 0;
  const dostavaOpis =
    body.dostava?.enabled === true
      ? body.dostava.opis?.trim() || 'Troškovi dostave'
      : null;
  const ukupno = Math.max(meduzbroj - popustRacunIznos + dostavaIznos, 0);

  const { data: existingKupac } = await supabase
    .from('kupci')
    .select('id')
    .eq('user_id', user.id)
    .ilike('naziv', kupacNaziv)
    .maybeSingle();

  const kupacPayload = {
    user_id: user.id,
    naziv: kupacNaziv,
    oib: body.kupac.oib?.trim() || null,
    adresa: body.kupac.adresa?.trim() || null,
    email: body.kupac.email?.trim() || null,
  };

  const kupacMutation = existingKupac
    ? supabase
        .from('kupci')
        .update(kupacPayload)
        .eq('id', existingKupac.id)
        .eq('user_id', user.id)
        .select('id')
        .single()
    : supabase.from('kupci').insert(kupacPayload).select('id').single();

  const { data: kupac, error: kupacError } = await kupacMutation;

  if (kupacError || !kupac) {
    return NextResponse.json(
      { error: kupacError?.message || 'Kupac nije spremljen.' },
      { status: 400 },
    );
  }

  await Promise.all(items.map((item) => upsertCatalogItem(supabase, user.id, item)));

  const { data: racun, error: racunError } = await supabase
    .from('racuni')
    .insert({
      user_id: user.id,
      kupac_id: kupac.id,
      broj_racuna: body.brojRacuna,
      datum: body.datum,
      datum_placanja: body.datumPlacanja || null,
      nacin_placanja: body.nacinPlacanja,
      ukupni_iznos: ukupno,
      status: body.status,
      tip_racuna: tipRacuna,
      popust_racun: popustRacun,
      rok_placanja: body.rokPlacanja || '15 dana',
      datum_dospijeca: body.datumDospijeca || null,
      dostava_iznos: dostavaIznos,
      dostava_opis: dostavaOpis,
      napomena: body.napomena || null,
      recurring,
      recurring_interval: recurringInterval,
      barkod_enabled:
        body.nacinPlacanja === 'ziro' ? body.dodajBarkodPlacanja !== false : false,
      dodaj_barkod_placanja:
        body.nacinPlacanja === 'ziro' ? body.dodajBarkodPlacanja !== false : false,
    })
    .select('id, broj_racuna')
    .single();

  if (racunError) {
    return NextResponse.json({ error: racunError.message }, { status: 400 });
  }

  const { error: stavkaError } = await supabase.from('invoice_items').insert(
    items.map((item) => ({
      racun_id: racun.id,
      opis: item.opis,
      kolicina: item.kolicina,
      jedinicna_cijena: item.jedinicnaCijena,
      popust: item.popust,
      ukupno: item.ukupno,
    })),
  );

  if (stavkaError) {
    return NextResponse.json({ error: stavkaError.message }, { status: 400 });
  }

  // TODO: Support multiple KPR entries per invoice for split payments in future.
  if (body.status === 'placeno') {
    const paymentDate = body.datumPlacanja || body.datum;
    const isCash = body.nacinPlacanja === 'gotovina';

    await supabase.from('kpr_unosi').insert({
      user_id: user.id,
      racun_id: racun.id,
      datum: paymentDate,
      broj_temeljnice: body.brojRacuna,
      opis: opisAutomatskogKprUnosaZaRacun(body.brojRacuna),
      iznos_gotovina: isCash ? ukupno : 0,
      iznos_bezgotovinsko: isCash ? 0 : ukupno,
      ukupno,
    });
  }

  return NextResponse.json({
    id: racun.id,
    brojRacuna: racun.broj_racuna,
  });
}
```

### `src/app/api/racuni/[id]/pdf/route.ts`

```ts
import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

import { buildHub30EurCode } from '@/lib/alati/hub3-eur';
import {
  formatBrojRacunaZaPdf,
  InvoiceDocument,
} from '@/lib/pdf/invoice-document';
import { generatePdf417Matrix } from '@/lib/pdf/pdf417-matrix';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [{ data: racun, error }, { data: profil }] = await Promise.all([
    supabase
      .from('racuni')
      .select(
        'id, broj_racuna, datum, datum_placanja, nacin_placanja, status, tip_racuna, popust_racun, rok_placanja, datum_dospijeca, dostava_iznos, dostava_opis, ukupni_iznos, napomena, barkod_enabled, kupci(naziv, oib, adresa, email)',
      )
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa, ulica, postanski_broj, grad, iban')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  if (error || !racun) {
    return NextResponse.json({ error: 'Racun nije pronaden.' }, { status: 404 });
  }

  const { data: stavke } = await supabase
    .from('invoice_items')
    .select('opis, kolicina, jedinicna_cijena, popust, ukupno')
    .eq('racun_id', racun.id);

  const kupac = racun.kupci as {
    naziv?: string | null;
    oib?: string | null;
    adresa?: string | null;
    email?: string | null;
  } | null;

  const brojZaDatoteku = formatBrojRacunaZaPdf(racun.broj_racuna).replaceAll(
    '/',
    '-',
  );
  const iban = profil?.iban?.replace(/\s/g, '').trim() ?? '';
  const shouldRenderBarcode =
    racun.barkod_enabled === true &&
    racun.nacin_placanja === 'ziro' &&
    iban.length > 0;
  const reference = `HR00 ${formatBrojRacunaZaPdf(racun.broj_racuna)}`;
  const barcodeMatrix = shouldRenderBarcode
    ? generatePdf417Matrix(
        buildHub30EurCode({
          iznosEur: Number(racun.ukupni_iznos),
          platiteljIme: kupac?.naziv ?? '',
          platiteljAdresa1: kupac?.adresa ?? '',
          platiteljAdresa2: '',
          primateljIme: profil?.naziv_obrta ?? '',
          primateljAdresa1: profil?.adresa ?? '',
          primateljAdresa2: '',
          iban,
          model: 'HR00',
          pozivNaBroj: formatBrojRacunaZaPdf(racun.broj_racuna),
          sifraNamjene: 'OTHR',
          opis: `Račun ${formatBrojRacunaZaPdf(racun.broj_racuna)}`,
        }),
      )
    : null;
  const stavkeZaPdf = (stavke ?? []).map((stavka) => ({
    opis: stavka.opis,
    kolicina: Number(stavka.kolicina),
    jedinicnaCijena: Number(stavka.jedinicna_cijena),
    popust: Number(stavka.popust ?? 0),
    ukupno: Number(stavka.ukupno),
  }));
  const meduzbroj = stavkeZaPdf.reduce((sum, stavka) => sum + stavka.ukupno, 0);
  const popustRacun = Number(racun.popust_racun ?? 0);
  const popustRacunIznos = meduzbroj * (popustRacun / 100);

  const invoicePdf = InvoiceDocument({
    brojRacuna: racun.broj_racuna,
    datum: racun.datum,
    datumPlacanja: racun.datum_placanja,
    status: racun.status,
    nacinPlacanja: racun.nacin_placanja,
    tipRacuna: racun.tip_racuna,
    rokPlacanja: racun.rok_placanja,
    datumDospijeca: racun.datum_dospijeca,
    ukupniIznos: Number(racun.ukupni_iznos),
    meduzbroj,
    popustRacun,
    popustRacunIznos,
    dostavaOpis: racun.dostava_opis,
    dostavaIznos: Number(racun.dostava_iznos ?? 0),
    napomena: racun.napomena,
    kupacNaziv: kupac?.naziv ?? '',
    kupacOib: kupac?.oib ?? null,
    kupacAdresa: kupac?.adresa ?? null,
    kupacEmail: kupac?.email ?? null,
    profil: {
      nazivObrta: profil?.naziv_obrta ?? '',
      oib: profil?.oib ?? '',
      adresa: profil?.adresa ?? null,
      ulica: profil?.ulica ?? null,
      postanskiBroj: profil?.postanski_broj ?? null,
      grad: profil?.grad ?? null,
      iban: profil?.iban ?? null,
    },
    paymentBarcode: barcodeMatrix
      ? {
          matrix: barcodeMatrix.rows,
          numCols: barcodeMatrix.numCols,
          numRows: barcodeMatrix.numRows,
          iban,
          amountEur: Number(racun.ukupni_iznos),
          reference,
        }
      : null,
    stavke: stavkeZaPdf,
  });

  const stream = await renderToStream(invoicePdf);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="racun-${brojZaDatoteku}.pdf"`,
    },
  });
}
```

### `src/app/api/racuni/[id]/email/route.ts`

```ts
import { NextResponse } from 'next/server';

import { buildHub30EurCode } from '@/lib/alati/hub3-eur';
import {
  formatBrojRacunaZaPdf,
  InvoiceDocument,
} from '@/lib/pdf/invoice-document';
import { generatePdf417Matrix } from '@/lib/pdf/pdf417-matrix';
import { renderPdfToBuffer } from '@/lib/pdf/render-pdf-buffer';
import { createClient } from '@/lib/supabase/server';

type EmailPayload = {
  to?: string;
  subject?: string;
  message?: string;
};

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const body = (await request.json().catch(() => ({}))) as EmailPayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: 'Nedostaje RESEND_API_KEY u okruženju.' },
      { status: 500 },
    );
  }

  const [{ data: racun, error }, { data: profil }] = await Promise.all([
    supabase
      .from('racuni')
      .select(
        'id, broj_racuna, datum, datum_placanja, nacin_placanja, status, tip_racuna, popust_racun, rok_placanja, datum_dospijeca, dostava_iznos, dostava_opis, ukupni_iznos, napomena, barkod_enabled, kupci(naziv, oib, adresa, email)',
      )
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('profiles')
      .select('naziv_obrta, oib, adresa, ulica, postanski_broj, grad, iban')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  if (error || !racun) {
    return NextResponse.json({ error: 'Račun nije pronađen.' }, { status: 404 });
  }

  const { data: stavke } = await supabase
    .from('invoice_items')
    .select('opis, kolicina, jedinicna_cijena, popust, ukupno')
    .eq('racun_id', racun.id);

  const kupac = racun.kupci as {
    naziv?: string | null;
    oib?: string | null;
    adresa?: string | null;
    email?: string | null;
  } | null;

  const to = body.to?.trim() || kupac?.email?.trim();
  if (!to) {
    return NextResponse.json({ error: 'Email primatelja je obavezan.' }, { status: 400 });
  }

  const iban = profil?.iban?.replace(/\s/g, '').trim() ?? '';
  const shouldRenderBarcode =
    racun.barkod_enabled === true &&
    racun.nacin_placanja === 'ziro' &&
    iban.length > 0;
  const reference = `HR00 ${formatBrojRacunaZaPdf(racun.broj_racuna)}`;
  const barcodeMatrix = shouldRenderBarcode
    ? generatePdf417Matrix(
        buildHub30EurCode({
          iznosEur: Number(racun.ukupni_iznos),
          platiteljIme: kupac?.naziv ?? '',
          platiteljAdresa1: kupac?.adresa ?? '',
          platiteljAdresa2: '',
          primateljIme: profil?.naziv_obrta ?? '',
          primateljAdresa1: profil?.adresa ?? '',
          primateljAdresa2: '',
          iban,
          model: 'HR00',
          pozivNaBroj: formatBrojRacunaZaPdf(racun.broj_racuna),
          sifraNamjene: 'OTHR',
          opis: `Račun ${formatBrojRacunaZaPdf(racun.broj_racuna)}`,
        }),
      )
    : null;
  const stavkeZaPdf = (stavke ?? []).map((stavka) => ({
    opis: stavka.opis,
    kolicina: Number(stavka.kolicina),
    jedinicnaCijena: Number(stavka.jedinicna_cijena),
    popust: Number(stavka.popust ?? 0),
    ukupno: Number(stavka.ukupno),
  }));
  const meduzbroj = stavkeZaPdf.reduce((sum, stavka) => sum + stavka.ukupno, 0);
  const popustRacun = Number(racun.popust_racun ?? 0);
  const popustRacunIznos = meduzbroj * (popustRacun / 100);

  const pdf = await renderPdfToBuffer(
    InvoiceDocument({
      brojRacuna: racun.broj_racuna,
      datum: racun.datum,
      datumPlacanja: racun.datum_placanja,
      status: racun.status,
      nacinPlacanja: racun.nacin_placanja,
      tipRacuna: racun.tip_racuna,
      rokPlacanja: racun.rok_placanja,
      datumDospijeca: racun.datum_dospijeca,
      ukupniIznos: Number(racun.ukupni_iznos),
      meduzbroj,
      popustRacun,
      popustRacunIznos,
      dostavaOpis: racun.dostava_opis,
      dostavaIznos: Number(racun.dostava_iznos ?? 0),
      napomena: racun.napomena,
      kupacNaziv: kupac?.naziv ?? '',
      kupacOib: kupac?.oib ?? null,
      kupacAdresa: kupac?.adresa ?? null,
      kupacEmail: kupac?.email ?? null,
      profil: {
        nazivObrta: profil?.naziv_obrta ?? '',
        oib: profil?.oib ?? '',
        adresa: profil?.adresa ?? null,
        ulica: profil?.ulica ?? null,
        postanskiBroj: profil?.postanski_broj ?? null,
        grad: profil?.grad ?? null,
        iban: profil?.iban ?? null,
      },
      paymentBarcode: barcodeMatrix
        ? {
            matrix: barcodeMatrix.rows,
            numCols: barcodeMatrix.numCols,
            numRows: barcodeMatrix.numRows,
            iban,
            amountEur: Number(racun.ukupni_iznos),
            reference,
          }
        : null,
      stavke: stavkeZaPdf,
    }),
  );

  const filename = `racun-${formatBrojRacunaZaPdf(racun.broj_racuna).replaceAll('/', '-')}.pdf`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Kvik <noreply@kvik.online>',
      to,
      subject:
        body.subject?.trim() ||
        `Račun broj ${racun.broj_racuna} - ${profil?.naziv_obrta ?? 'Kvik'}`,
      text: body.message?.trim() || 'U prilogu se nalazi vaš račun.',
      attachments: [
        {
          filename,
          content: pdf.toString('base64'),
        },
      ],
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    return NextResponse.json(
      { error: payload.message || 'Slanje emaila nije uspjelo.' },
      { status: 502 },
    );
  }

  await supabase
    .from('racuni')
    .update({
      email_poslano_at: new Date().toISOString(),
      email_poslano_na: to,
    })
    .eq('id', racun.id)
    .eq('user_id', user.id);

  return NextResponse.json({ ok: true });
}
```

### `src/app/api/racuni/[id]/status/route.ts`

```ts
import { NextResponse } from 'next/server';

import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import { createClient } from '@/lib/supabase/server';

type StatusPayload = {
  status: 'izdano' | 'placeno' | 'stornirano';
  datumPlacanja?: string;
};

function opisStornoKprUnosaZaRacun(brojRacuna: string) {
  return `Storno računa ${brojRacuna}`;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const body = (await request.json()) as StatusPayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: invoice, error: invoiceError } = await supabase
    .from('racuni')
    .select('id, broj_racuna, ukupni_iznos, nacin_placanja, datum, status')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: 'Racun nije pronaden.' }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from('racuni')
    .update({
      status: body.status,
      datum_placanja: body.status === 'placeno' ? body.datumPlacanja || invoice.datum : null,
    })
    .eq('id', invoice.id)
    .eq('user_id', user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  if (body.status === 'placeno' && invoice.status !== 'placeno') {
    const { data: existing } = await supabase
      .from('kpr_unosi')
      .select('id')
      .eq('user_id', user.id)
      .eq('racun_id', invoice.id)
      .maybeSingle();

    // TODO: If partial payments are introduced, replace this de-dup check with installment logic.
    if (!existing) {
      const isCash = invoice.nacin_placanja === 'gotovina';
      await supabase.from('kpr_unosi').insert({
        user_id: user.id,
        racun_id: invoice.id,
        datum: body.datumPlacanja || invoice.datum,
        broj_temeljnice: invoice.broj_racuna,
        opis: opisAutomatskogKprUnosaZaRacun(invoice.broj_racuna),
        iznos_gotovina: isCash ? Number(invoice.ukupni_iznos) : 0,
        iznos_bezgotovinsko: isCash ? 0 : Number(invoice.ukupni_iznos),
        ukupno: Number(invoice.ukupni_iznos),
      });
    }
  }

  if (body.status === 'stornirano' && invoice.status !== 'stornirano') {
    const isCash = invoice.nacin_placanja === 'gotovina';
    const amount = Number(invoice.ukupni_iznos) * -1;
    await supabase.from('kpr_unosi').insert({
      user_id: user.id,
      racun_id: invoice.id,
      datum: new Date().toISOString().slice(0, 10),
      broj_temeljnice: `STORNO ${invoice.broj_racuna}`,
      opis: opisStornoKprUnosaZaRacun(invoice.broj_racuna),
      iznos_gotovina: isCash ? amount : 0,
      iznos_bezgotovinsko: isCash ? 0 : amount,
      ukupno: amount,
    });
  }

  return NextResponse.json({ success: true });
}
```

### `src/app/(app)/racuni/invoice-list.tsx`

```tsx
'use client';

import { useMemo, useState } from 'react';

import {
  formatDatumHr,
  formatIznosEurHr,
  formatRacunStatusHr,
} from '@/lib/format-hr';

import { EmailInvoiceButton } from './email-button';
import { MarkAsPaidButton } from './paid-button';
import { StornoInvoiceButton } from './storno-button';

export type InvoiceRow = {
  id: string;
  broj_racuna: string;
  datum: string;
  nacin_placanja: 'ziro' | 'gotovina' | 'kartica' | null;
  status: 'izdano' | 'placeno' | 'stornirano';
  ukupni_iznos: number;
  email_poslano_at: string | null;
  email_poslano_na: string | null;
  kupci: {
    naziv: string;
    email: string | null;
  } | null;
};

type InvoiceListProps = {
  invoices: InvoiceRow[];
  nazivObrta: string;
};

const PAYMENT_LABELS: Record<string, string> = {
  ziro: 'Žiro',
  gotovina: 'Gotovina',
  kartica: 'Kartica',
};

export function InvoiceList({ invoices, nazivObrta }: InvoiceListProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('svi');
  const [payment, setPayment] = useState('svi');

  const filteredInvoices = useMemo(() => {
    const q = search.trim().toLocaleLowerCase();
    return invoices.filter((racun) => {
      const buyerName = racun.kupci?.naziv?.toLocaleLowerCase() ?? '';
      const matchesSearch = q.length === 0 || buyerName.includes(q);
      const matchesStatus = status === 'svi' || racun.status === status;
      const matchesPayment =
        payment === 'svi' || racun.nacin_placanja === payment;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [invoices, payment, search, status]);

  return (
    <>
      <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
        <div className='grid gap-4 lg:grid-cols-[1fr_12rem_12rem]'>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Pretraži po kupcu...
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
              placeholder='npr. Studio Kreativ'
            />
          </label>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
            >
              <option value='svi'>Svi</option>
              <option value='izdano'>Izdano</option>
              <option value='placeno'>Plaćeno</option>
              <option value='stornirano'>Stornirano</option>
            </select>
          </label>
          <label className='block'>
            <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
              Način plaćanja
            </span>
            <select
              value={payment}
              onChange={(event) => setPayment(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-[#e2e8e7] outline-none transition focus:border-[#0d9488]'
            >
              <option value='svi'>Svi</option>
              <option value='ziro'>Žiro</option>
              <option value='gotovina'>Gotovina</option>
              <option value='kartica'>Kartica</option>
            </select>
          </label>
        </div>
      </section>

      <section className='overflow-x-auto rounded-2xl border border-[#1f2a28] bg-[#111716]'>
        <table className='min-w-full divide-y divide-[#24312f]'>
          <thead>
            <tr className='text-left text-sm text-[#94a3a0]'>
              <th className='px-4 py-3 font-medium'>Broj</th>
              <th className='px-4 py-3 font-medium'>Kupac</th>
              <th className='px-4 py-3 font-medium'>Datum</th>
              <th className='px-4 py-3 font-medium'>Iznos</th>
              <th className='px-4 py-3 font-medium'>Status</th>
              <th className='px-4 py-3 font-medium'>Način</th>
              <th className='px-4 py-3 font-medium'>Email</th>
              <th className='px-4 py-3 font-medium'>Akcije</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#24312f]'>
            {filteredInvoices.map((racun) => {
              const sentAt = racun.email_poslano_at
                ? formatDatumHr(racun.email_poslano_at)
                : null;
              const emailTitle =
                racun.email_poslano_at && racun.email_poslano_na
                  ? `Poslano na ${racun.email_poslano_na} ${sentAt}`
                  : undefined;

              const isStornirano = racun.status === 'stornirano';
              const rowClass = isStornirano
                ? 'text-sm text-red-200 line-through decoration-red-400/80'
                : 'text-sm';

              return (
                <tr key={racun.id} className={rowClass}>
                  <td className='px-4 py-4'>{racun.broj_racuna}</td>
                  <td className='px-4 py-4'>{racun.kupci?.naziv ?? '-'}</td>
                  <td className='px-4 py-4'>{formatDatumHr(racun.datum)}</td>
                  <td className='px-4 py-4'>
                    {formatIznosEurHr(Number(racun.ukupni_iznos))}
                  </td>
                  <td className='px-4 py-4 text-[#b9c7c4]'>
                    {formatRacunStatusHr(racun.status)}
                  </td>
                  <td className='px-4 py-4 text-[#b9c7c4]'>
                    {racun.nacin_placanja
                      ? PAYMENT_LABELS[racun.nacin_placanja]
                      : '-'}
                  </td>
                  <td className='px-4 py-4'>
                    {racun.email_poslano_at ? (
                      <span
                        title={emailTitle}
                        className='inline-flex rounded-full border border-[#0d9488]/40 bg-[#0d9488]/10 px-2.5 py-1 text-xs font-semibold text-[#5eead4]'
                      >
                        Poslano
                      </span>
                    ) : (
                      <span className='text-[#64756f]'>-</span>
                    )}
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <a
                        href={`/api/racuni/${racun.id}/pdf`}
                        target='_blank'
                        rel='noreferrer'
                        className='font-body rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
                      >
                        PDF
                      </a>
                      {racun.status === 'izdano' ? (
                        <MarkAsPaidButton racunId={racun.id} />
                      ) : null}
                      {racun.status === 'izdano' ? (
                        <StornoInvoiceButton
                          racunId={racun.id}
                          brojRacuna={racun.broj_racuna}
                        />
                      ) : null}
                      <EmailInvoiceButton
                        racunId={racun.id}
                        defaultEmail={racun.kupci?.email ?? ''}
                        defaultSubject={`Račun broj ${racun.broj_racuna} - ${nazivObrta}`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={8} className='px-4 py-8 text-center text-sm text-[#94a3a0]'>
                  Nema računa za odabrane filtere.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
```

### `src/app/(app)/racuni/email-button.tsx`

```tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type EmailInvoiceButtonProps = {
  racunId: string;
  defaultEmail: string;
  defaultSubject: string;
};

export function EmailInvoiceButton({
  racunId,
  defaultEmail,
  defaultSubject,
}: EmailInvoiceButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState(defaultEmail);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState('U prilogu se nalazi vaš račun.');
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback('');
    setIsSending(true);

    const response = await fetch(`/api/racuni/${racunId}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, message }),
    });

    setIsSending(false);
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setFeedback(payload.error || 'Slanje nije uspjelo.');
      return;
    }

    setFeedback('Email je poslan.');
    router.refresh();
    window.setTimeout(() => setOpen(false), 900);
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='font-body rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
      >
        Pošalji email
      </button>

      {open ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
          <form
            onSubmit={handleSubmit}
            className='w-full max-w-lg rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-2xl'
          >
            <h2 className='font-heading text-xl text-[#e2e8e7]'>Pošalji račun</h2>
            <label className='mt-5 block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Primatelj
              </span>
              <input
                required
                type='email'
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='mt-4 block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Naslov
              </span>
              <input
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='mt-4 block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Poruka
              </span>
              <textarea
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>

            {feedback ? (
              <p className='font-body mt-4 rounded-lg border border-[#2a3734] p-3 text-sm text-[#d5dfdd]'>
                {feedback}
              </p>
            ) : null}

            <div className='mt-6 flex flex-wrap gap-3'>
              <button
                type='submit'
                disabled={isSending}
                className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isSending ? 'Šaljem...' : 'Pošalji'}
              </button>
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='font-body rounded-xl border border-[#2a3734] px-5 py-3 text-[#d5dfdd] transition hover:border-[#0d9488]'
              >
                Zatvori
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
```

### `src/app/(app)/racuni/paid-button.tsx`

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function MarkAsPaidButton({ racunId }: { racunId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsPaid = async () => {
    setIsLoading(true);
    await fetch(`/api/racuni/${racunId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'placeno',
      }),
    });
    setIsLoading(false);
    router.refresh();
  };

  return (
    <button
      type='button'
      onClick={handleMarkAsPaid}
      disabled={isLoading}
      className='font-body rounded-lg bg-[#0d9488] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
    >
      {isLoading ? 'Spremam...' : 'Označi plaćeno'}
    </button>
  );
}
```

### `src/app/(app)/racuni/storno-button.tsx`

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function StornoInvoiceButton({
  racunId,
  brojRacuna,
}: {
  racunId: string;
  brojRacuna: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function confirmStorno() {
    setIsLoading(true);
    setError('');

    const response = await fetch(`/api/racuni/${racunId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'stornirano',
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error || 'Storniranje računa nije uspjelo.');
      return;
    }

    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='font-body rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10'
      >
        Storniraj
      </button>

      {isOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
          <div className='w-full max-w-md rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 shadow-2xl'>
            <h2 className='font-heading text-xl text-[#e2e8e7]'>Storniranje računa</h2>
            <p className='font-body mt-3 text-sm text-[#b9c7c4]'>
              Jesi li siguran da želiš stornirati račun {brojRacuna}?
            </p>
            <p className='font-body mt-2 text-xs text-[#94a3a0]'>
              U KPR će se dodati storno unos s negativnim iznosom.
            </p>

            {error ? (
              <p className='font-body mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
                {error}
              </p>
            ) : null}

            <div className='mt-5 flex flex-wrap justify-end gap-3'>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className='font-body rounded-xl border border-[#2a3734] px-4 py-2 text-sm text-[#d5dfdd] transition hover:border-[#0d9488] disabled:opacity-60'
              >
                Odustani
              </button>
              <button
                type='button'
                onClick={() => void confirmStorno()}
                disabled={isLoading}
                className='font-body rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isLoading ? 'Storniram...' : 'Potvrdi storno'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
```

### `src/lib/invoice-normalize.ts`

```ts
export type DocumentItemInput = {
  opis: string;
  kolicina: number;
  jedinicnaCijena: number;
  popust?: number;
};

export type NormalizedDocumentItem = DocumentItemInput & {
  popust: number;
  ukupno: number;
};

export function normalizeDocumentItems(
  items: DocumentItemInput[] | undefined,
): NormalizedDocumentItem[] {
  return (items ?? [])
    .map((item) => {
      const kolicina = Number(item.kolicina);
      const jedinicnaCijena = Number(item.jedinicnaCijena);
      const popust = Math.min(Math.max(Number(item.popust ?? 0) || 0, 0), 100);
      return {
        opis: item.opis?.trim() ?? '',
        kolicina,
        jedinicnaCijena,
        popust,
        ukupno: kolicina * jedinicnaCijena * (1 - popust / 100),
      };
    })
    .filter(
      (item) =>
        item.opis.length > 0 &&
        Number.isFinite(item.kolicina) &&
        item.kolicina > 0 &&
        Number.isFinite(item.jedinicnaCijena) &&
        item.jedinicnaCijena >= 0,
    );
}
```

### `src/lib/kpr-export.ts`

```ts
/** Stari zapis u bazi (bez dijakritike na „račun”). */
const LEGACY_KPR_AUTOMAT_OPIS_PREFIX = 'Automatski unos za racun';

/**
 * Opis KPR retka kad se račun automatski unosi (npr. nakon plaćanja).
 * Koristi se pri insertu u `kpr_unosi`.
 */
export function opisAutomatskogKprUnosaZaRacun(brojRacuna: string): string {
  return `Automatski unos za račun ${brojRacuna}`;
}

/**
 * PDF/XLSX: ispravlja stari tekst iz baze bez „č“ u riječi račun.
 */
export function normalizeKprOpisZaEksport(
  opis: string | null | undefined,
): string {
  const s = opis ?? '';
  return s.replaceAll(
    LEGACY_KPR_AUTOMAT_OPIS_PREFIX,
    'Automatski unos za račun',
  );
}

/** Godina iz ?year= za KPR izvoz; inače tekuća kalendarska godina. */
export function getKprExportYear(searchParams: URLSearchParams): number {
  const raw = searchParams.get('year');
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  const current = new Date().getFullYear();
  if (Number.isNaN(parsed) || parsed < 2000 || parsed > 2100) {
    return current;
  }
  return parsed;
}

export function kprDatumRangeZaGodinu(godina: number): {
  od: string;
  kraj: string;
} {
  return { od: `${godina}-01-01`, kraj: `${godina}-12-31` };
}
```

### `src/lib/alati/hub3-eur.ts`

```ts
/**
 * Sastavlja tekst za HRVHUB30 PDF417 (EUR) — struktura prema uobičajenom HUB-3 obliku.
 * Iznos u centima, 15 znamenki. Primatelj i IBAN moraju odgovarati stvarnoj uplatnici;
 * ovdje su generički podaci za demonstraciju u alatu (korisnik provjerava kod HZZO/HZMO).
 */

export type Hub3EurInput = {
  /** Iznos u EUR (npr. 290.98) */
  iznosEur: number;
  platiteljIme: string;
  platiteljAdresa1: string;
  platiteljAdresa2: string;
  primateljIme: string;
  primateljAdresa1: string;
  primateljAdresa2: string;
  iban: string;
  /** npr. HR01 */
  model: string;
  /** Poziv na broj */
  pozivNaBroj: string;
  sifraNamjene: string;
  opis: string;
};

function padAmountCents(eur: number): string {
  const cents = Math.round(eur * 100);
  const s = String(Math.max(0, cents));
  return s.padStart(15, '0').slice(-15);
}

function line(s: string, max = 30): string {
  const t = s.trim().slice(0, max);
  return t;
}

export function buildHub30EurCode(input: Hub3EurInput): string {
  const rows = [
    'HRVHUB30',
    'EUR',
    padAmountCents(input.iznosEur),
    line(input.platiteljIme, 30),
    line(input.platiteljAdresa1, 27),
    line(input.platiteljAdresa2, 27),
    line(input.primateljIme, 25),
    line(input.primateljAdresa1, 25),
    line(input.primateljAdresa2, 27),
    line(input.iban.replace(/\s/g, ''), 34),
    line(input.model, 4),
    line(input.pozivNaBroj.replace(/\s/g, ''), 22),
    line(input.sifraNamjene, 4),
    line(input.opis, 35),
  ];
  return rows.join('\n');
}

/** Ilustrativni IBAN / primatelj — korisnik zamijeni podacima s uplatnice. */
export const DOPRINOSI_PRIMATELJ_DEMO = {
  naziv: 'HZZO (ilustrativno — provjeri IBAN)',
  adresa1: 'Mjesto uplate',
  adresa2: 'Hrvatska',
  /** Format HR + brojevi; provjeri na službenim uplatnicama. */
  iban: 'HR1210010051863000160',
};
```

### `src/lib/pdf/pdf417-matrix.ts`

```ts
import PDF417 from 'pdf417-generator';

type Pdf417Generator = typeof PDF417 & {
  barcode_array?: {
    num_cols: number;
    num_rows: number;
    bcode: Array<Array<number | string>>;
  };
};

export type Pdf417Matrix = {
  numCols: number;
  numRows: number;
  rows: number[][];
};

/** Generate PDF417 matrix without node-canvas; renderer draws it as vector rects. */
export function generatePdf417Matrix(code: string): Pdf417Matrix | null {
  const generator = PDF417 as Pdf417Generator;
  const fakeCanvas = {
    width: 0,
    height: 0,
    getContext() {
      return {
        scale() {},
        fillRect() {},
        fillStyle: '#000',
      };
    },
  };

  generator.draw(
    code,
    fakeCanvas as unknown as HTMLCanvasElement,
    2,
    -1,
    1,
    '#000',
  );

  const barcode = generator.barcode_array;
  if (!barcode?.bcode?.length) {
    return null;
  }

  return {
    numCols: barcode.num_cols,
    numRows: barcode.num_rows,
    rows: barcode.bcode.map((row) => row.map((cell) => Number(cell))),
  };
}
```

### `src/lib/pdf/render-pdf-buffer.ts`

```ts
import { renderToStream } from '@react-pdf/renderer';

export async function renderPdfToBuffer(document: React.ReactElement) {
  const stream = await renderToStream(document);
  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    stream.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  return Buffer.concat(chunks);
}
```

### `src/lib/pdf/register-roboto.ts`

```ts
import path from 'path';

import { Font } from '@react-pdf/renderer';

let didRegister = false;

export const PDF_FONT_FAMILY = 'Roboto';

/** Registriraj Roboto (TTF) jednom po Node procesu — izbjegava dupli Font.register. */
export function registerRobotoPdfFont(): void {
  if (didRegister) {
    return;
  }
  didRegister = true;
  const dir = path.join(process.cwd(), 'public', 'fonts');
  Font.register({
    family: PDF_FONT_FAMILY,
    fonts: [
      {
        src: path.join(dir, 'Roboto-Regular.ttf'),
        fontWeight: 'normal',
      },
      {
        src: path.join(dir, 'Roboto-Bold.ttf'),
        fontWeight: 'bold',
      },
    ],
  });
}
```

### `src/lib/supabase/server.ts`

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll can fail in server components; middleware refreshes cookies.
          }
        },
      },
    },
  );
}
```

### `src/lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

### `src/lib/supabase/service-role.ts`

```ts
import { createClient } from '@supabase/supabase-js';

/** Server / Edge only — never import from client components. */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
```

### `.env.example`

```env
# App (URL u pregledniku; npr. https://app.kvik.online za deploy)
# getSiteUrl() za SEO/OG/JSON-LD mapira app.kvik.online → https://kvik.online
NEXT_PUBLIC_APP_URL="https://kvik.online"

# Supabase (projekt → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (AI asistent)
ANTHROPIC_API_KEY=

# Resend — API ključ za vlastite službene emailove (npr. transakcijski).
# Za Supabase Auth (potvrda registracije): u Supabase Dashboard → Authentication
# → Emails → SMTP Settings uključi Custom SMTP i unesi Resend podatke:
#   Host: smtp.resend.com
#   Port: 465 (SSL) ili 587 (TLS)
#   User: resend
#   Password: <RESEND_API_KEY>
#   Sender: noreply@kvik.online (domena mora biti verificirana u Resendu)
# Redirect URLs: dodaj https://kvik.online/auth/callback (i http://localhost:3000/auth/callback za dev)
RESEND_API_KEY=

# Cloudflare Turnstile (opcionalno — registracija): https://dash.cloudflare.com/?to=/:account/turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

### `package.json`

```json
{
  "name": "kvik-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.86.1",
    "@react-pdf/renderer": "^4.4.0",
    "@supabase/ssr": "^0.10.2",
    "@supabase/supabase-js": "^2.103.0",
    "@vercel/analytics": "^2.0.1",
    "next": "14.2.35",
    "next-pwa": "^5.6.0",
    "pdf417-generator": "^1.0.5",
    "react": "^18",
    "react-dom": "^18",
    "react-markdown": "^10.1.0",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.35",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## Točke uboda za F1.0 (preporuka bez duplikacije)

1. **`POST /api/racuni`** — jedinstveni poslovni događaj: ovdje ili odmah nakon uspješnog inserta povezati CIS (ovisno želiš li račun u DB tek nakon JIR-a).
2. **PDF** — proširiti `InvoiceDocument` + izdvojiti zajednički builder propsa jer `pdf` i `email` rute danas dupliciraju isti skup polja.
3. **Perzistencija** — nove kolone na `racuni` ili tablica `racuni_fiskalizacija` (1:1) + migracija u `supabase/migrations/`.
4. **Certifikat / XML** — novi env + server-only modul; vjerojatno nove npm ovisnosti ili pažljivo korištenje `crypto`.

---

*Generirao: Cursor audit, 5. svibnja 2026.*

*Sljedeći korak: Implementacija F1.0 — certifikat management*
