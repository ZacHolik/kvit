# Kvit to Kvik Rebranding Audit Report

Generated: 2026-05-01

## 1. Summary

The codebase has been rebranded from **Kvit** to **Kvik** across user-facing app surfaces, SEO metadata, guide/tool content, email sender defaults, PWA metadata, package metadata, sitemap/robots source, and domain references.

Confirmed replacements:

| Old value | New value | Status |
|---|---|---|
| `Kvit` | `Kvik` | Replaced in user-facing content and metadata |
| `kvit` | `kvik` | Replaced where it represented brand/package/domain naming |
| `KVIT` | `KVIK` | Replaced in generated constants and embedded content labels |
| `kvit.online` | `kvik.online` | Replaced in app URLs, SEO, sitemap/robots source, email defaults, and env examples |

Final scan result: no remaining old-brand references require code/content changes. Remaining `kvit` references are intentional technical keeps listed below.

## 2. Files Changed During Rebranding

The following files were modified across the rebranding commits after `260ce4d feat: add legal pages`.

| File | Old values | New values |
|---|---|---|
| `.env.example` | `kvit.online` | `kvik.online` |
| `audits/2026-04-27_14-07_kvit-audit.md` | `Kvit` | `Kvik` |
| `audits/README.md` | `Kvit` | `Kvik` |
| `package-lock.json` | `kvit-app` | `kvik-app` |
| `package.json` | `kvit-app` | `kvik-app` |
| `public/manifest.json` | `Kvit` | `Kvik` |
| `scripts/landing-source.html` | `Kvit`, fake social proof placeholders | `Kvik`, launch-phase message |
| `scripts/prefix-landing-css.mjs` | `KVIT`, `kvit-landing-css` | `KVIK`, `kvik-landing-css` |
| `src/app/(app)/asistent/page.tsx` | `Kvit` | `Kvik` |
| `src/app/(app)/dashboard-shell.tsx` | `Kvit` | `Kvik` |
| `src/app/(app)/dashboard/page.tsx` | `Kvit` | `Kvik` |
| `src/app/(app)/racuni/page.tsx` | `Kvit` | `Kvik` |
| `src/app/(auth)/register/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/checklista/obligations-checklist.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/checklista/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/interni-akt/interni-akt-tool.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/interni-akt/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/izjava-poslovni-prostor/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/izjava-pozajmnica/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/kalkulator-poreza/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/layout.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/page.tsx` | `Kvit`, `kvit.online`, fake CTA/social proof | `Kvik`, `kvik.online`, launch CTA |
| `src/app/alati/pdv-prag/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/placanje-doprinosa/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/placanje-doprinosa/placanje-doprinosa-tool.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/rok-podsjetnici/page.tsx` | `Kvit` | `Kvik` |
| `src/app/alati/rok-podsjetnici/rok-podsjetnici-client.tsx` | `Kvit` | `Kvik` |
| `src/app/api/chat/route.ts` | `KVIT`, `Kvit`, `kvit.online` | `KVIK`, `Kvik`, `kvik.online` |
| `src/app/api/racuni/[id]/email/route.ts` | `Kvit`, `kvit.online`, `Kvit <noreply@kvik.online>` | `Kvik`, `kvik.online`, `Kvik <noreply@kvik.online>` |
| `src/app/kvit-landing-css.ts` | `KVIT`, old filename | Removed/renamed |
| `src/app/kvik-landing-css.ts` | New file | `KVIK`, generated Kvik landing CSS |
| `src/app/layout.tsx` | `Kvit`, old Google verification token | `Kvik`, new Google verification token |
| `src/app/page.tsx` | `KVIT`, `Kvit`, `kvit-landing-css`, fake testimonials/rating | `KVIK`, `Kvik`, `kvik-landing-css`, launch note |
| `src/app/privacy/page.tsx` | `Kvit`, `kvit.online` | `Kvik`, `kvik.online` |
| `src/app/sitemap.ts` | `kvit.online` | `kvik.online` |
| `src/app/uvjeti/page.tsx` | `Kvit`, `kvit.online` | `Kvik`, `kvik.online` |
| `src/app/vodici/_components/guide-shell.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/_components/vodici-nav.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/alati-za-pausalne-obrtnike/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/doprinosi-uz-posao/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/doprinosi/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/fina-certifikat-fiskalizacija/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/fiskalizacija-20/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/izdavanje-racuna-vodic/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/izdavanje-racuna/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/knjiga-trazbi/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/kpr-knjiga-prometa/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/kpr-online-generator/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/layout.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/otvaranje-obrta/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/pausalni-obrt-vodic/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/pausalni-obrt-vs-doo/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/pausalni-obrt-za-fotografe/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/pausalni-obrt-za-it-freelancere/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/pausalni-obrt-za-konzultante/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/pausalni-obrt-za-kozmeticare/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/pausalni-obrt-za-ugostitelje/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/pdv-id/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/po-sd-obrazac/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/porez-na-dohodak/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/prikriveni-radni-odnos/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/rokovi-placanja/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/rpo-obrazac/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/sezonski-obrt/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/sjediste-obrta-vs-prebivaliste/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/turisticka-clanarina/page.tsx` | `Kvit` | `Kvik` |
| `src/app/vodici/zatvaranje-obrta/page.tsx` | `Kvit` | `Kvik` |
| `src/lib/pausal-tax.ts` | `Kvit` | `Kvik` |
| `src/lib/vodici-config.ts` | `Kvit`, `kvit.online` | `Kvik`, `kvik.online` |

Rebranding commits included in this audit:

- `702757b` — rename brand to Kvik
- `24b9cf5` — update domain to kvik.online
- `5c8c7ec` — update SEO metadata branding
- `dec0203` — update email sender branding
- `c934f12` — update guide and tool content branding
- `66a9225` — finish Kvik brand cleanup
- `ad886e5` — update Google site verification
- `a2e315e` — align landing CSS import filename
- `1db167a` — remove fake landing social proof

## 3. Remaining References

Full scan was run across the repository excluding `/node_modules/**`, `/.git/**`, and `/.next/**`.

No remaining `kvit.online` references were found in tracked source/content files.

Remaining old `kvit` references:

| File | Line | Classification | Reason |
|---|---:|---|---|
| `.cursor/rules/git-finalization-workflow.mdc` | 12 | `INTENTIONAL_KEEP` | Workspace path `~/kvit-app` and GitHub remote `github.com/ZacHolik/kvit` are intentionally retained. |
| `.cursor/rules/git-finalization-workflow.mdc` | 16 | `INTENTIONAL_KEEP` | Workspace path `~/kvit-app` is not user-facing product branding. |
| `src/app/(auth)/register/page.tsx` | 97 | `INTENTIONAL_KEEP` | Stable honeypot API field `kvit_hp_confirm`; changing it could break the registration contract. |
| `src/app/api/auth/register/route.ts` | 15 | `INTENTIONAL_KEEP` | Stable honeypot API field `kvit_hp_confirm`. |
| `src/app/api/auth/register/route.ts` | 50 | `INTENTIONAL_KEEP` | Stable honeypot API field `kvit_hp_confirm`. |
| `src/hooks/use-alati-session.ts` | 42 | `INTENTIONAL_KEEP` | Database column `kvit_plan`; intentionally not renamed to avoid schema migration risk. |
| `src/hooks/use-alati-session.ts` | 55 | `INTENTIONAL_KEEP` | Type field for database column `kvit_plan`. |
| `src/hooks/use-alati-session.ts` | 61 | `INTENTIONAL_KEEP` | Runtime check against database column `kvit_plan`. |
| `supabase/migrations/20260419140000_profiles_alati_plan.sql` | 3 | `INTENTIONAL_KEEP` | Historical migration for database column `kvit_plan`. |
| `supabase/migrations/20260419140000_profiles_alati_plan.sql` | 5 | `INTENTIONAL_KEEP` | Historical migration comment for database column `kvit_plan`. |

No `NEEDS_CHANGE` items remain.

## 4. Infrastructure Status

| Item | Status | Evidence / notes |
|---|---|---|
| `kvik.online` | Live | `HEAD https://kvik.online` returned `200` with final URL `https://kvik.online`. |
| `kvit.online` 301 redirect | Not configured at time of audit | Direct `HEAD https://kvit.online` returned `200` with no `Location` header. Direct `HEAD http://kvit.online` returned `308` to `https://kvit.online/`, not to `https://kvik.online/`. Configure old-domain redirect separately. |
| Vercel project name | Unknown from repository | No `.vercel/project.json` or checked-in Vercel project metadata was present. `vercel.json` exists, but does not expose a project name. |
| GitHub repo name | Still `kvit` | `origin` remote is `git@github.com:ZacHolik/kvit.git`. This was intentionally kept in prior cleanup passes. |
| `package.json` project name | Updated | `"name": "kvik-app"`. |
| `NEXT_PUBLIC_APP_URL` | Updated | `.env.example` uses `NEXT_PUBLIC_APP_URL="https://kvik.online"`. Local `.env.local` also contains `NEXT_PUBLIC_APP_URL`; value was updated in prior work but secret values are not documented here. |
| `NEXT_PUBLIC_APP_NAME` | Not present | No `NEXT_PUBLIC_APP_NAME` key found in `.env.example` or `.env.local`. |
| Supabase URLs | Intentionally unchanged | Supabase project URLs are infrastructure values, not brand domains. |
| Resend sender | Code fallback updated | Fallback sender is `Kvik <noreply@kvik.online>`. Resend dashboard DNS/domain setup must be checked manually. |
| Sitemap/robots canonical origin | Updated | `CANONICAL_SITE_ORIGIN` is `https://kvik.online`, used by sitemap and robots generators. |

## 5. Social Media Manual Changes

These are external account/handle changes and cannot be completed from the codebase:

| Platform | Current handle | Target handle | Status |
|---|---|---|---|
| Facebook | `kvitpausal` | `kvikpausal` | Manual change required |
| Instagram | `@kvitpausal` | `@kvikpausal` | Manual change required |
| TikTok | `@kvitpausal` | `@kvikpausal` | Manual change required |

## 6. Conclusion

Code/content rebranding is complete for user-facing product references:

- App UI, landing page, legal pages, guide pages, tool pages, SEO metadata, JSON-LD, sitemap/robots source, PWA manifest, email sender fallback, package metadata, and generated landing CSS have been updated to Kvik / kvik.online.
- No remaining `NEEDS_CHANGE` old-brand references were found in the final scan.

The rebrand is not 100% complete operationally until the following external/infrastructure tasks are finished:

1. Configure `kvit.online` to 301 redirect to `https://kvik.online`.
2. Confirm or rename the Vercel project in the Vercel dashboard.
3. Decide whether to rename the GitHub repository from `ZacHolik/kvit` to a Kvik-based name.
4. Update social handles from `kvitpausal` to `kvikpausal`.
5. Confirm Resend domain/DNS configuration for `kvik.online`.

