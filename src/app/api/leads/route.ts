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
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const leadSchema = z.object({
  email: z.string().email(),
  consent: z.literal(true),
  website: z.string().optional(),
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
        consent: true,
        consent_ip: ip,
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
              Hvala na povjerenju! Spremili smo tvoju email adresu — možeš nastaviti s PO-SD alatom
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
      }),
    }).catch((err) => {
      console.error('Resend error (leads)', err);
    });
  }

  return NextResponse.json({ ok: true });
}
