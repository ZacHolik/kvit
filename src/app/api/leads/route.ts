/**
 * POST /api/leads
 * Body: { email: string, consent: true, website?: string }
 *
 * Email capture za PO-SD alat — upsert u leads, Resend potvrda s unsubscribe linkom.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getClientIpFromRequest } from '@/lib/client-ip';
import { checkRateLimit } from '@/lib/leads-rate-limit';
import {
  createUnsubscribeToken,
  unsubscribeUrl,
} from '@/lib/leads-unsubscribe';
import { PoSdDocument } from '@/lib/pdf/po-sd-document';
import { renderPdfToBuffer } from '@/lib/pdf/render-pdf-buffer';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

function numField(payload: Record<string, unknown>, key: string): number {
  const v = payload[key];
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function poSdDocFromPayload(payload: Record<string, unknown>) {
  const godina = numField(payload, 'godina');
  if (!godina) return null;

  const gotovina = numField(payload, 'gotovina');
  const bezgotovinsko = numField(payload, 'bezgotovinsko');
  const ukupno = numField(payload, 'ukupno') || gotovina + bezgotovinsko;
  const razredLabel =
    typeof payload.razred === 'string' && payload.razred.trim()
      ? payload.razred
      : '—';
  const porezKvartalno = numField(payload, 'porezKvartalno');
  const porezGodisnje =
    numField(payload, 'porezGodisnje') || porezKvartalno * 4;

  return PoSdDocument({
    godina,
    nazivObrta: '—',
    oib: '—',
    adresa: null,
    gotovina,
    bezgotovinsko,
    ukupnoPrimici: ukupno,
    razredLabel,
    porezKvartalno,
    porezGodisnje,
  });
}

const leadSchema = z.object({
  email: z.string().email(),
  consent: z.literal(true),
  website: z.string().optional(),
  source_tool: z.string().min(1),
  persona_hint: z.string().optional(),
  result_payload: z.record(z.string(), z.unknown()).optional(),
  consent_text: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  referrer: z.string().optional(),
  landing_page: z.string().optional(),
  cta_variant: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Previše zahtjeva.' }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Nevažeći podaci.' }, { status: 400 });
  }

  const { email, website } = parsed.data;

  // Honeypot — tihi uspjeh
  if (website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: 'Greška pri pohrani.' }, { status: 500 });
  }

  const { data: lead, error } = await admin
    .from('leads')
    .upsert(
      {
        email: normalizedEmail,
        source_tool: parsed.data.source_tool,
        persona_hint: parsed.data.persona_hint ?? null,
        result_payload: parsed.data.result_payload ?? null,
        consent: true,
        consent_text: parsed.data.consent_text ?? null,
        consent_at: new Date().toISOString(),
        consent_ip: ip,
        utm_source: parsed.data.utm_source ?? null,
        utm_medium: parsed.data.utm_medium ?? null,
        utm_campaign: parsed.data.utm_campaign ?? null,
        utm_content: parsed.data.utm_content ?? null,
        referrer: parsed.data.referrer ?? null,
        landing_page: parsed.data.landing_page ?? null,
        cta_variant: parsed.data.cta_variant ?? null,
        unsubscribed_at: null,
      },
      { onConflict: 'email' },
    )
    .select('id')
    .single();

  if (error || !lead?.id) {
    console.error('leads upsert error', error);
    return NextResponse.json({ error: 'Greška pri pohrani.' }, { status: 500 });
  }

  const token = createUnsubscribeToken(lead.id);
  if (!token) {
    console.error('leads: LEADS_UNSUBSCRIBE_SECRET nije postavljen');
    return NextResponse.json({ error: 'Greška pri pohrani.' }, { status: 500 });
  }

  const unsubLink = unsubscribeUrl(lead.id, token);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kvik.online';
  const from =
    process.env.RESEND_FROM_EMAIL ?? 'Kvik <noreply@kvik.online>';

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    let attachments: { filename: string; content: string }[] | undefined;
    if (parsed.data.result_payload) {
      try {
        const doc = poSdDocFromPayload(parsed.data.result_payload);
        if (doc) {
          const pdfBuffer = await renderPdfToBuffer(doc);
          attachments = [
            {
              filename: 'kvik-po-sd-rezultat.pdf',
              content: pdfBuffer.toString('base64'),
            },
          ];
        }
      } catch (err) {
        console.error('leads PO-SD PDF error', err);
      }
    }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        reply_to: 'podrska@kvik.hr',
        to: [normalizedEmail],
        subject: 'Tvoj PO-SD rezultat je ovdje',
        headers: {
          'List-Unsubscribe': `<${unsubLink}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0b0f0e;color:#e2e8e7;padding:32px 24px;border-radius:16px">
            <p style="margin:0 0 8px;font-size:12px;color:#94a3a0;letter-spacing:0.08em;text-transform:uppercase">Kvik</p>
            <h1 style="margin:0 0 16px;font-size:22px;color:#0d9488">Tvoj PO-SD rezultat je ovdje</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#b9c7c4">
              Hvala na povjerenju! U prilogu je PDF s tvojim PO-SD rezultatom — možeš nastaviti s alatom
              ili isprobati AI asistenta za paušalce.
            </p>
            <p style="margin:0 0 24px">
              <a href="${appUrl}/asistent" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px">
                Otvori AI asistenta →
              </a>
            </p>
            <hr style="border:none;border-top:1px solid #1f2a28;margin:24px 0" />
            <p style="margin:0;font-size:12px;color:#94a3a0;line-height:1.5">
              Kvik · Jednostavno paušalno knjigovodstvo<br />
              <a href="${appUrl}" style="color:#0d9488">${appUrl.replace(/^https?:\/\//, '')}</a>
              · <a href="${unsubLink}" style="color:#94a3a0">Odjavi se od emailova</a>
            </p>
          </div>
        `,
        ...(attachments ? { attachments } : {}),
      }),
    }).catch((err) => {
      console.error('Resend error (leads)', err);
    });
  }

  return NextResponse.json({ ok: true });
}
