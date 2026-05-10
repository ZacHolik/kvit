# Kvik — status izvještaj (2026-05-09)

Izvještaj temelji se na **stvarnom kodu** u repozitoriju u trenutku generiranja (`main`, lokalni pregled datoteka i `git log`).

---

## 1. Nove datoteke i folderi (od referentnog audita 2026-05-05)

**Referenca:** `audits/2026-05-05_12-00_kvik-audit.md` (datum u nazivu).

### `git log --since=2026-05-05 --diff-filter=A` (dodane datoteke u git povijesti)

| Putanja | Sažetak |
|---------|---------|
| `audits/2026-05-05_12-00_kvik-audit.md` | Audit dokument |
| `docs/FISKAL_AUDIT_PRE_IMPLEMENTACIJE_2026-05-05.md` | Dokumentacija pred implementaciju |
| `src/app/(app)/postavke/fiskalizacija/page.tsx` | Wizard FINA certifikata + embed `PpNuSection` |
| `src/app/(app)/postavke/fiskalizacija/pp-nu-section.tsx` | Klijentska sekcija CRUD poslovni prostori / naplatni uređaji |
| `src/app/alati/_components/post-value-cta.tsx` | CTA nakon alata (npr. pricing copy) |
| `src/app/alati/_components/powered-by-kvik-badge.tsx` | Badge „Izrađeno u Kvik“ |
| `src/app/alati/_components/share-result.tsx` | Dijeljenje rezultata alata |
| `src/app/alati/po-sd/page.tsx` | Javna stranica PO-SD alata (`/alati/po-sd`) |
| `src/app/alati/po-sd/po-sd-tool.tsx` | Klijentski PO-SD generator (unosi, rezultat) |
| `src/app/api/fiscal/certificate/route.ts` | POST spremanje certifikata (FormData) |
| `src/app/api/fiscal/certificate/validate/route.ts` | POST validacija .p12 |
| `src/app/api/fiscal/echo/route.ts` | CIS Echo provjera |
| `src/app/api/fiscal/naplatni-uredaji/[id]/route.ts` | PATCH/DELETE naplatnog uređaja |
| `src/app/api/fiscal/naplatni-uredaji/route.ts` | GET lista / POST kreiranje NU |
| `src/app/api/fiscal/poslovni-prostori/[id]/route.ts` | PATCH/DELETE poslovnog prostora |
| `src/app/api/fiscal/poslovni-prostori/route.ts` | GET lista + invoice_counters / POST PP |
| `src/app/api/fiscal/retry/cron/route.ts` | GET cron obrada `fiscal_retry_queue` |
| `src/app/api/fiscal/retry/route.ts` | GET korisnikov queue / POST ručni retry |
| `src/app/provjera/fiskal-kviz.tsx` | Komponenta kviza (provjera) |
| `src/app/provjera/page.tsx` | Stranica `/provjera` |
| `src/lib/fiscalization/*.ts` | Cijeli modul (vidi §2) |
| `src/lib/pdf/build-invoice-payment-hub3.ts` | PDF / plaćanje HUB-3 |
| `src/lib/pdf/hub3-payment-qr.ts` | QR za plaćanje u PDF-u |
| `supabase/migrations/20260505120000_fiscal_certificates.sql` | Tablice `fiscal_certificates`, `fiscal_logs` |
| `supabase/migrations/20260505130000_fiscal_certificate_password.sql` | Kolona `encrypted_password` |
| `supabase/migrations/20260505140000_racuni_fiskal_polja.sql` | Fiskalne kolone na `racuni` |
| `supabase/migrations/20260509120000_fiscal_logs_duration.sql` | `duration_ms` na `fiscal_logs` |
| `supabase/migrations/20260509140000_fiscal_retry_queue.sql` | Tablica `fiscal_retry_queue` |
| `supabase/migrations/20260509150000_invoice_counters.sql` | `invoice_counters` + `bump_invoice_counter` |
| `supabase/migrations/20260509160000_poslovni_prostori.sql` | `poslovni_prostori`, `naplatni_uredaji` + seed |
| `supabase/migrations/20260509180000_racuni_storno_cis.sql` | Storno kolone na `racuni` |

**Napomena:** U `git log` povijesti mogu se pojaviti i `supabase/.temp/*` — u `.gitignore` je sada `supabase/.temp/` (ne treba ih pratiti).

### Migracije s imenom ≥ `20260505` (kompletan skup u repou)

Pored gore navedenih, u mapi **nema** drugih migracija između `20260505` i `20260509` osim onih u tablici u §7 (sve su navedene).

---

## 2. Fiskalizacija — točan status

### `src/lib/fiscalization/` (10 datoteka)

| Datoteka | Sažetak |
|----------|---------|
| `fiscalize.ts` | Orkestracija: certifikat → `resolvePpNuForFiscal` → ZKI → CIS → `fiscal_logs` |
| `resolve-pp-nu.ts` | PP/NU iz tablica ili fallback s `fiscal_certificates`; greška ako nema |
| `sync-cert-pp-nu.ts` | Nakon uploada certifikata — upsert PP/NU u tablice |
| `certificate.ts` | Parsiranje .p12 (node-forge), OIB, valjanost |
| `cis.ts` | SOAP CIS, XML-DSig (xml-crypto, xmlbuilder2, forge) |
| `encryption.ts` | AES-256-GCM za .p12 (`FISCAL_ENCRYPTION_KEY`) |
| `zki.ts` | Generiranje ZKI (RSA-SHA1 + MD5) |
| `fiscal-qr.ts` | QR URL za poreznu (`porezna.gov.hr/rn/...`) |
| `fiscal-retry.ts` | Obrada jobova iz `fiscal_retry_queue`, backoff, poziv fiskalizacije |
| `types.ts` | TS tipovi za CIS / račun |

### `src/app/api/fiscal/` (API rute)

| Ruta | Datoteka | Sažetak |
|------|----------|---------|
| `GET/POST` | `certificate/route.ts` | Spremanje enkriptiranog certifikata (+ sync PP/NU) |
| `POST` | `certificate/validate/route.ts` | Validacija .p12 |
| `GET` | `echo/route.ts` | CIS Echo |
| `GET/POST` | `poslovni-prostori/route.ts` | Lista PP + counters / kreiranje PP |
| `PATCH/DELETE` | `poslovni-prostori/[id]/route.ts` | Uređivanje / soft delete PP |
| `GET/POST` | `naplatni-uredaji/route.ts` | Lista NU (filter `poslovni_prostor_id`) / kreiranje |
| `PATCH/DELETE` | `naplatni-uredaji/[id]/route.ts` | Uređivanje / soft delete NU |
| `GET` | `retry/route.ts` | Korisnikov pending retry queue |
| `POST` | `retry/route.ts` | Ručni retry po `jobId` / `racunId` |
| `GET` | `retry/cron/route.ts` | Cron: batch obrada queuea (`CRON_SECRET`) |

### Postavke fiskalizacije

- **`src/app/(app)/postavke/fiskalizacija/page.tsx`** — postoji (wizard + `PpNuSection`).
- **`src/app/(app)/postavke/fiskalizacija/pp-nu-section.tsx`** — postoji.

### Migracije: `fiscal_certificates` i `fiscal_logs`

- **Da.** Definirane u `supabase/migrations/20260505120000_fiscal_certificates.sql` s RLS politikama po `user_id`.

### `racuni` — fiskalne i storno kolone

Iz **`20260505140000_racuni_fiskal_polja.sql`:**

- `zki` VARCHAR(32)  
- `jir` VARCHAR(36)  
- `fiskalizirano_at` TIMESTAMPTZ  
- `fiskalizacija_error` TEXT  

Iz **`20260509180000_racuni_storno_cis.sql`:**

- `storniran_od` UUID (FK na `racuni`)  
- `tip_dokumenta` TEXT DEFAULT `'racun'` s CHECK `('racun','storno')`  

### Retry cron

- **`vercel.json`:** `crons[0].path` = `/api/fiscal/retry/cron`, `schedule` = `0 6 * * *` (dnevno 06:00 UTC).
- **Handler:** `src/app/api/fiscal/retry/cron/route.ts` — GET, auth `Authorization: Bearer <CRON_SECRET>` ili `?secret=`.
- **`.env.example`:** dokumentira isti endpoint i `CRON_SECRET`.

### Poslovni prostori (CRUD)

- **Da:** API pod `poslovni-prostori` i `naplatni-uredaji`; UI u `pp-nu-section.tsx`; tablice u `20260509160000_poslovni_prostori.sql`.

### Routing napomena (iz `next.config.mjs` + `middleware.ts`)

- Nema redirecta `/po-sd` → `/alati/po-sd` u `next.config.mjs`.
- Neprijavljeni na `/po-sd` u middlewareu idu na `/alati/po-sd`; prijavljeni koriste app rutu `(app)/po-sd` (KPR pregled).

---

## 3. Pricing i early adopter

### Cijene u kodu (landing `src/app/page.tsx`, Paušalist kartica)

- **Mjesečno (toggle isključen):** `7€` / mj (`{yearly ? '5.60€' : '7€'}`).
- **Godišnje (toggle uključen):** `5.60€` / mj + opis „Early adopter cijena — zaključana zauvijek“.
- **PRO:** `12€` / mj ili `9.60€` / mj uz godišnji toggle.

### `src/app/early-adopter-hero-note.tsx`

- Tekst: **„Zaključaj najpovoljniju cijenu od 5,60€ zauvijek!“**
- Link na Tally: `https://tally.so/r/44or65`
- Konstante: `CAP = 100`, `BASELINE_OFFSET = 60`, `MIN_VISIBLE_PROGRESS = 63`
- Dohvat: `GET /api/public/register-count` → `displayedCount = max(count + 60, 63)`, `filled = min(displayedCount, 100)`, `pct = (filled/100)*100`
- Vizual: 20 „segmenata“ (`filledBlocks`), boja trake ovisno o `pct` (zelena / žuta / crvena), linearni progress bar širine `pct%`.

### `src/app/(app)/dashboard/dashboard-referral-section.tsx`

- Naslov: **„Zaključaj 5,60€/mj — zauvijek“**
- Tekst: dovedi **3** prijatelja koji koriste Kvik.
- API: `/api/referral/dashboard-summary`, `/api/referral/ensure-code`
- **Progress (referral):** `filled = min(activatedFriendCount, 3)` — tri kruga ●/○ i „X / 3“.
- Kad je `priceLocked`: poruka **„Cijena zaključana — {lockedPrice ?? 5.6}€/mj zauvijek“** (`lockedPrice` s API-ja / profila).

### Ostali izvori cijene (grep)

- `src/app/alati/_components/post-value-cta.tsx` — „5,60€/mj — zauvijek.“
- `src/app/uvjeti/page.tsx` — „5,60 €/mj …“
- `src/app/vodici/fiskalizacija-20/page.tsx` — spominje **7 € / mj** za Kvik (vodič).

---

## 4. Resend / email

### `.env.example` (Resend)

- **`RESEND_API_KEY=`** (prazan placeholder).
- Komentari: SMTP za Supabase Auth preko Resenda (`smtp.resend.com`, port 465/587, user `resend`, password = API ključ, sender npr. `noreply@kvik.online`).
- **Ne postoji** varijabla `RESEND_FROM_EMAIL` u `.env.example`.

### `RESEND_FROM_EMAIL` u kodu

- **`src/app/api/racuni/[id]/email/route.ts`:**  
  `from: process.env.RESEND_FROM_EMAIL || 'Kvik <noreply@kvik.online>'`  
  (dakle fallback ako env nije postavljen).

---

## 5. `vercel.json` (kompletan sadržaj repozitorija)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["fra1"],  "crons": [
    {
      "path": "/api/fiscal/retry/cron",
      "schedule": "0 6 * * *"
    }
  ],
  "functions": {
    "src/app/api/racuni/route.ts": {
      "maxDuration": 30
    },
    "src/app/api/fiscal/certificate/route.ts": {
      "maxDuration": 30
    },
    "src/app/api/fiscal/certificate/validate/route.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

**Napomena:** U retku 4 datoteke su literalno `],  "crons"` na istom retku (bez novog reda između `]` i `"crons"`); JSON je ipak valjan.

---

## 6. `package.json` — `dependencies`

```json
{
  "@anthropic-ai/sdk": "^0.86.1",
  "@react-pdf/renderer": "^4.4.0",
  "@supabase/ssr": "^0.10.2",
  "@supabase/supabase-js": "^2.103.0",
  "@types/node-forge": "^1.3.14",
  "@types/qrcode": "^1.5.6",
  "@vercel/analytics": "^2.0.1",
  "next": "14.2.35",
  "next-pwa": "^5.6.0",
  "node-forge": "^1.4.0",
  "pdf417-generator": "^1.0.5",
  "qrcode": "^1.5.4",
  "react": "^18",
  "react-dom": "^18",
  "react-markdown": "^10.1.0",
  "xlsx": "^0.18.5",
  "xml-crypto": "^6.1.2",
  "xmlbuilder2": "^4.0.3"
}
```

**Fiskalizacija / XML:** `node-forge`, `xml-crypto`, `xmlbuilder2` (+ `@types/node-forge` u devDependencies).

---

## 7. Supabase migracije od `20260505` nadalje

| Migracija | Što radi |
|-----------|----------|
| `20260505120000_fiscal_certificates.sql` | Kreira `fiscal_certificates` (enkriptirani p12, OIB, PP, blagajna, valjanost) i `fiscal_logs` (ZKI, JIR, CIS request/response, success); RLS |
| `20260505130000_fiscal_certificate_password.sql` | `fiscal_certificates.encrypted_password` |
| `20260505140000_racuni_fiskal_polja.sql` | Na `racuni`: `zki`, `jir`, `fiskalizirano_at`, `fiskalizacija_error` |
| `20260509120000_fiscal_logs_duration.sql` | Na `fiscal_logs`: `duration_ms` (integer) |
| `20260509140000_fiscal_retry_queue.sql` | Tablica `fiscal_retry_queue` (pending retry, backoff polja, istek 48h); RLS |
| `20260509150000_invoice_counters.sql` | Tablica `invoice_counters` + RPC `bump_invoice_counter`; RLS |
| `20260509160000_poslovni_prostori.sql` | `poslovni_prostori`, `naplatni_uredaji`, indeksi, RLS, INSERT seed iz aktivnog certifikata |
| `20260509180000_racuni_storno_cis.sql` | `racuni.storniran_od`, `tip_dokumenta` s CHECK; indeks |

---

## 8. PO-SD alat — `src/app/alati/po-sd/po-sd-tool.tsx`

- **Gotovina / bezgotovinsko:** `useState('')`; **`placeholder='0'`**; klasa `placeholder:text-[#64748b]`.
- **`trySetMoney`:** sanitizacija znakova, regex jednog decimalnog separatora, zatim **`stripMoneyLeadingZeros`** (npr. `052` → `52`; decimalni dio zadržava jednu vodeću nulu kod `0,x`).
- **`onFocus`:** ako je vrijednost `'0'`, postavi `''` (gotovina, bezgotovinsko, godina).
- **`onBlur`:** novčana polja **ne** vraćaju `'0'` — prazno ostaje prazno; izračun: `parseEurInput('')` → `0`.
- **Godina:** `useState(String(defaultGodina))`; `onBlur` prazno → vraća `defaultGodina`.
- **Rezultat:** prikaz mjesečnog (kvartal/3), kvartalnog i godišnjeg poreza iz `getPausalRazred2026`.

---

## 9. TODO / FIXME / HACK

**`TODO` (grep `src/**/*.ts(x)`):**

| Datoteka | Sadržaj |
|----------|---------|
| `src/app/api/racuni/route.ts:299` | `// TODO: Support multiple KPR entries per invoice for split payments in future.` |
| `src/app/(app)/dashboard/page.tsx:80` | `// TODO: If KPR entries are missing (older data), consider fallback aggregation from paid invoices.` |
| `src/app/(auth)/onboarding/page.tsx:135` | `// TODO: Next step can include onboarding completeness tracking table if needed.` |
| `src/app/(app)/kpr/page.tsx:61` | `// TODO: Move this sync to a dedicated background job when volume grows.` |

**`FIXME` / `HACK`:** nema pogodaka u `src/`.

---

*Kraj izvještaja.*
