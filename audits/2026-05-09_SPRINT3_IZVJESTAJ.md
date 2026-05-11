# SPRINT 3 IZVJEŠTAJ

| Zadatak | Status | Napomena |
| --- | --- | --- |
| Email period fix | ✅ | `formatDatumHr` u period labelu (webhook). |
| Webhook profil dohvat | ✅ | `profiles.naziv_obrta` za plaćanje i welcome. |
| Automatski R1 račun | ✅ | `billing-racun-pdf.ts`; R1 ako `KVIK_BILLING_OIB`, inače R2. |
| PDF u email privitku | ✅ | `renderRacunPdfBuffer` + Resend attachments (try/catch). |
| Billing history UI | ✅ | Postavke: tablica `billing_events`, link na `/api/racuni/[id]/pdf`. |
| Plan sync fix | ✅ | `checkout=success` + `!stripe_subscription_id` → banner + polling. |
| Welcome email | ✅ | Nakon upserta u `checkout.session.completed`. |

## Otvoreni problemi

- Ponovljeni `invoice.payment_succeeded` prije nego što je `invoice_id` upisan može poslati dupli email (rijetko); nakon upisa idempotencija drži račun.
- Nevažeći `stripe-signature` i dalje vraća 400 (očekivano za Stripe retry); ostatak handlera vraća 200.

## Commit

`feat: Stripe Sprint 3 — R1 invoice, PDF attachment, billing history, welcome email`
