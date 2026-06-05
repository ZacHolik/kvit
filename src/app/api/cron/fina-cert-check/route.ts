import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const ALERT_DAYS = [60, 30, 14, 7];
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: certs, error } = await supabase
    .from('fiscal_certificates')
    .select('fina_oib, valid_until, user_id')
    .eq('is_active', true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();
  const alerts = [];

  for (const cert of certs ?? []) {
    const expiry = new Date(cert.valid_until);
    const daysLeft = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (ALERT_DAYS.includes(daysLeft)) {
      await resend.emails.send({
        from: 'noreply@kvik.online',
        to: 'get.kvik@gmail.com',
        subject: `UPOZORENJE: FINA certifikat istekne za ${daysLeft} dana (OIB: ${cert.fina_oib})`,
        html: `
          <h2>FINA certifikat upozorenje</h2>
          <p>Certifikat za OIB <strong>${cert.fina_oib}</strong> istekne za <strong>${daysLeft} dana</strong>.</p>
          <p>Datum isteka: <strong>${expiry.toLocaleDateString('hr-HR')}</strong></p>
          <p>Potrebna akcija: Obnoviti certifikat na <a href="https://rdc.fina.hr">rdc.fina.hr</a></p>
          <hr>
          <p><small>Automatska obavijest — kvik.online</small></p>
        `,
      });
      alerts.push({ oib: cert.fina_oib, daysLeft });
    }
  }

  return NextResponse.json({
    checked: certs?.length ?? 0,
    alerts,
    timestamp: now.toISOString(),
  });
}
