/**
 * Obrada billing_racun_queue — račun, PDF, email (izvan Stripe webhooka).
 */

import type { SupabaseClient } from '@supabase/supabase-js';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';
import { stripe } from '@/lib/stripe/client';
import {
  billingResendFrom,
  createBillingRacunForStripe,
  renderRacunPdfBuffer,
} from '@/lib/stripe/billing-racun-pdf';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

type Admin = NonNullable<ReturnType<typeof createServiceRoleClient>>;

type EmailAttachment = { filename: string; content: Buffer };

async function sendBillingEmail(
  to: string,
  subject: string,
  html: string,
  attachments?: EmailAttachment[],
) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to?.trim()) {
    return;
  }
  const payload: Record<string, unknown> = {
    from: billingResendFrom(),
    to: [to.trim()],
    subject,
    html,
  };
  if (attachments?.length) {
    payload.attachments = attachments.map((a) => ({
      filename: a.filename,
      content: a.content.toString('base64'),
    }));
  }
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).catch((err) => console.error('Resend billing email error', err));
}

function formatPeriod(start: number, end: number) {
  return `${formatDatumHr(new Date(start * 1000))} – ${formatDatumHr(new Date(end * 1000))}`;
}

async function getBillingPeriodLabel(
  stripeInvoiceId: string,
  subscriptionId: string | null,
): Promise<string> {
  try {
    const invoice = await stripe.invoices.retrieve(stripeInvoiceId);
    let start = invoice.period_start;
    let end = invoice.period_end;
    if ((!start || !end) && subscriptionId) {
      const s = await stripe.subscriptions.retrieve(subscriptionId);
      const it = s.items.data[0];
      if (it?.current_period_start) start = it.current_period_start;
      if (it?.current_period_end) end = it.current_period_end;
    }
    if (start && end) return formatPeriod(start, end);
  } catch {
    /* ignore */
  }
  return '';
}

export type BillingQueueRow = {
  id: string;
  user_id: string;
  stripe_invoice_id: string;
  amount_eur: number;
  interval: 'month' | 'year' | null;
  datum_iso: string;
  customer_email: string | null;
  stripe_subscription_id: string | null;
};

export async function processBillingRacunJob(
  admin: Admin,
  job: BillingQueueRow,
): Promise<{ ok: boolean; message: string }> {
  const userId = job.user_id;
  const amountEur = Number(job.amount_eur);
  const lineInterval = job.interval;

  const { data: bev } = await admin
    .from('billing_events')
    .select('invoice_id')
    .eq('stripe_invoice_id', job.stripe_invoice_id)
    .maybeSingle();

  if ((bev as { invoice_id?: string | null } | null)?.invoice_id) {
    await admin
      .from('billing_racun_queue')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', job.id);
    return { ok: true, message: 'Račun već izdan.' };
  }

  let racunId: string | null = null;
  if (amountEur > 0) {
    try {
      racunId = await createBillingRacunForStripe(admin, {
        userId,
        stripeInvoiceId: job.stripe_invoice_id,
        amountEur,
        interval: lineInterval,
        datum: job.datum_iso,
      });
    } catch (e) {
      console.error('billing racun create', e);
    }
  }

  let attachments: EmailAttachment[] | undefined;
  if (racunId && amountEur > 0) {
    try {
      const buf = await renderRacunPdfBuffer(admin, racunId, userId);
      if (buf) {
        attachments = [
          { filename: `racun-${job.stripe_invoice_id}.pdf`, content: buf },
        ];
      }
    } catch (e) {
      console.error('pdf buffer subscription payment', e);
    }
  }

  const emailTo = job.customer_email?.trim() ?? '';
  const periodLabel = await getBillingPeriodLabel(
    job.stripe_invoice_id,
    job.stripe_subscription_id,
  );

  if (emailTo) {
    try {
      const { data: profile } = await admin
        .from('profiles')
        .select('naziv_obrta')
        .eq('id', userId)
        .maybeSingle();
      const name = (profile as { naziv_obrta?: string } | null)?.naziv_obrta ?? '';
      const amtStr = formatIznosEurHr(amountEur);

      await sendBillingEmail(
        emailTo,
        `Kvik — Potvrda plaćanja ${amtStr}`,
        `
        <p>Pozdrav${name ? ` ${name}` : ''},</p>
        <p>Uspješno smo naplatili <strong>${amtStr}</strong>${periodLabel ? ` za period ${periodLabel}` : ''}.</p>
        <p>${attachments?.length ? 'Račun u privitku (PDF).' : 'Račun bit će dostupan u Postavkama.'}</p>
        <p><a href="https://kvik.online/postavke">Upravljajte pretplatom →</a></p>
        <hr/>
        <p style="font-size:12px;color:#999;">Kvik · <a href="https://kvik.online">kvik.online</a></p>
      `,
        attachments,
      );
    } catch (e) {
      console.error('payment confirmation email', e);
    }
  }

  if (racunId) {
    try {
      await admin
        .from('billing_events')
        .update({ invoice_id: racunId })
        .eq('stripe_invoice_id', job.stripe_invoice_id);
    } catch (e) {
      console.error('billing_events invoice_id update', e);
    }
  }

  const ok = Boolean(racunId) || amountEur <= 0;
  await admin
    .from('billing_racun_queue')
    .update({
      status: ok ? 'completed' : 'failed',
      completed_at: new Date().toISOString(),
      error_message: ok ? null : 'Kreiranje računa nije uspjelo.',
    })
    .eq('id', job.id);

  return ok
    ? { ok: true, message: 'Obrada završena.' }
    : { ok: false, message: 'Kreiranje računa nije uspjelo.' };
}

export async function enqueueBillingRacunJob(
  admin: SupabaseClient,
  row: Omit<BillingQueueRow, 'id'> & { id?: string },
): Promise<void> {
  const { data: existing } = await admin
    .from('billing_racun_queue')
    .select('id, status')
    .eq('stripe_invoice_id', row.stripe_invoice_id)
    .maybeSingle();

  if (existing?.status === 'completed') {
    return;
  }

  await admin.from('billing_racun_queue').upsert(
    {
      user_id: row.user_id,
      stripe_invoice_id: row.stripe_invoice_id,
      amount_eur: row.amount_eur,
      interval: row.interval,
      datum_iso: row.datum_iso,
      customer_email: row.customer_email,
      stripe_subscription_id: row.stripe_subscription_id,
      status: 'pending',
      error_message: null,
      completed_at: null,
    },
    { onConflict: 'stripe_invoice_id' },
  );
}
