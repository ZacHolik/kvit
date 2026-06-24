import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

function hash(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ error: 'CAPI not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.event_name || !body?.event_id) {
    return NextResponse.json({ error: 'Missing event_name or event_id' }, { status: 400 });
  }

  const ip = getIp(req);
  const ua = req.headers.get('user-agent') || '';

  const userData: Record<string, string> = {
    client_ip_address: ip,
    client_user_agent: ua,
  };

  if (body.email) userData['em'] = hash(body.email);
  if (body.fbp) userData['fbp'] = body.fbp;
  if (body.fbc) userData['fbc'] = body.fbc;

  const event = {
    event_name: body.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: body.event_id,
    event_source_url: body.url || '',
    action_source: 'website',
    user_data: userData,
    ...(body.custom_data ? { custom_data: body.custom_data } : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
    }
  );

  const result = await res.json();
  return NextResponse.json(result, { status: res.ok ? 200 : 500 });
}
