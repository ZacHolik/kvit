/**
 * POST /api/waitlist/pro
 * Body: { email: string }
 *
 * Sprema email u Supabase tablicu pro_waitlist i šalje potvrdu (Resend).
 * Ne zahtijeva autentikaciju — pristup je javan (forma na pricing kartici).
 */

import { NextResponse } from 'next/server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

type Body = { email?: string };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const email = body.email?.trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Nevažeća email adresa.' }, { status: 400 });
  }

  // Spremi u bazu (upsert — duplikat ne smije baciti error)
  const admin = createServiceRoleClient();
  if (admin) {
    const { error } = await admin
      .from('pro_waitlist')
      .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true });

    if (error && error.code !== '23505') {
      console.error('pro_waitlist insert error', error);
      return NextResponse.json({ error: 'Greška pri pohrani.' }, { status: 500 });
    }
  }

  // Pošalji potvrdu emailom (Resend)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kvik <noreply@kvik.online>',
        to: [email],
        subject: 'Prijavili ste se na Kvik PRO listu čekanja',
        html: `
          <p>Hvala!</p>
          <p>Obavijestit ćemo vas čim Kvik PRO bude dostupan.</p>
          <p>U međuvremenu isprobajte <strong>Paušalist plan</strong> — 
             7 dana besplatno, bez kartice.</p>
          <p><a href="https://kvik.online/#cijene">Pogledaj planove →</a></p>
          <hr />
          <p style="font-size:12px;color:#999;">
            Kvik · Jednostavno paušalno knjigovodstvo<br />
            <a href="https://kvik.online">kvik.online</a>
          </p>
        `,
      }),
    }).catch((err) => {
      // Ne bacamo error prema korisniku ako email fail — zapis je već u bazi
      console.error('Resend error (pro waitlist)', err);
    });
  }

  return NextResponse.json({ ok: true });
}
