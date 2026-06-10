/**
 * GET/POST /api/leads/unsubscribe?id=<uuid>&token=<hmac>
 *
 * RFC 8058 one-click unsubscribe — verificira HMAC, postavlja unsubscribed_at.
 */

import { NextResponse } from 'next/server';

import { verifyUnsubscribeToken } from '@/lib/leads-unsubscribe';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

function confirmationHtml(success: boolean): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kvik.online';
  return `<!DOCTYPE html>
<html lang="hr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${success ? 'Odjavljeni ste' : 'Greška'} · Kvik</title>
  </head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0f0e;color:#e2e8e7;font-family:sans-serif;padding:24px;text-align:center">
    <div style="max-width:420px">
      <p style="margin:0 0 8px;font-size:12px;color:#94a3a0;letter-spacing:0.08em;text-transform:uppercase">Kvik</p>
      <h1 style="margin:0 0 12px;font-size:24px;color:${success ? '#0d9488' : '#f87171'}">
        ${success ? 'Uspješno ste se odjavili' : 'Link nije valjan'}
      </h1>
      <p style="margin:0 0 24px;font-size:14px;color:#94a3a0;line-height:1.6">
        ${
          success
            ? 'Više nećete primati emailove s PO-SD rezultatima. Ako se predomislite, možete se ponovno prijaviti na alatu.'
            : 'Link za odjavu je istekao ili nije valjan. Kontaktirajte podrška@kvik.hr ako trebate pomoć.'
        }
      </p>
      <a href="${appUrl}" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;padding:10px 24px;border-radius:12px;font-weight:600;font-size:14px">
        Natrag na Kvik
      </a>
    </div>
  </body>
</html>`;
}

async function handleUnsubscribe(
  leadId: string | null,
  token: string | null,
): Promise<NextResponse> {
  if (!leadId || !token || !verifyUnsubscribeToken(leadId, token)) {
    return new NextResponse(confirmationHtml(false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return new NextResponse(confirmationHtml(false), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const { error } = await admin
    .from('leads')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('id', leadId);

  if (error) {
    console.error('leads unsubscribe error', error);
    return new NextResponse(confirmationHtml(false), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new NextResponse(confirmationHtml(true), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function paramsFromUrl(url: string): { id: string | null; token: string | null } {
  const { searchParams } = new URL(url);
  return {
    id: searchParams.get('id'),
    token: searchParams.get('token'),
  };
}

export async function GET(request: Request) {
  const { id, token } = paramsFromUrl(request.url);
  return handleUnsubscribe(id, token);
}

export async function POST(request: Request) {
  const { id, token } = paramsFromUrl(request.url);
  return handleUnsubscribe(id, token);
}
