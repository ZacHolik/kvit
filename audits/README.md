# Kvik Audits

This folder stores all timestamped inventory/audit snapshots for the Kvik app.

## Folder Structure
- `/audits/` = svi vremenski auditi (`YYYY-MM-DD_HH-MM_kvik-audit.md`).
- `/audits/2026-05-05_PRE_FISKAL_AUDIT.md` = snapshot prije fiskalizacije.
- `/docs/` = tehnicka dokumentacija (npr. rebranding, arhitekturni dokumenti).

## Run A New Audit
Paste this prompt into Cursor:

```text
Create a new Kvik audit.

1. Save it to audits/YYYY-MM-DD_HH-MM_kvik-audit.md using the current date and time.
2. Inspect the current repo state before writing:
   - src/middleware.ts for public/protected routes
   - src/app/**/page.tsx for pages
   - src/app/**/route.ts for API endpoints and HTTP methods
   - supabase/migrations/*.sql for tables and schema changes
   - package.json and src/lib for integrations
3. Include these sections:
   ## DATUM I VRIJEME
   ## JAVNE STRANICE (bez logina)
   ## APP STRANICE (zahtijeva login)
   ## API RUTE
   ## SUPABASE TABLICE
   ## INTEGRACIJE
   ## FEATURES IMPLEMENTIRANE
   ## FEATURES DJELOMIČNO IMPLEMENTIRANE
   ## FEATURES KOJE NEDOSTAJU
   ## KONKURENTSKA USPOREDBA
   ## PREPORUKE
4. Keep the competitor comparison conservative. Mark unknown items with "?" unless verified.
5. Run the build, then commit and push.
```

## Compare Two Audits
Use:

```bash
./audits/compare.sh audits/audit1.md audits/audit2.md
```

The script runs a unified diff so added and removed routes, features, tables, and recommendations are visible.

## Competitor Analysis Workflow
Use each audit as a dated snapshot of Kvik versus the market.

- Keep claims conservative and source-aware.
- Mark unverifiable competitor features with `?`.
- Re-check competitor public pages before publishing any comparison in marketing materials.
- Compare monthly audits to see if Kvik is closing gaps against fiscalization, eRačuni, mobile app, subscriptions, and accountant workflows.
