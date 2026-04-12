import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Samo relativne putanje na isti origin (bez open-redirect). */
function safeNextPath(raw: string | null): string {
  const fallback = '/confirm-email?verified=1';
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return fallback;
  }
  return raw;
}

/**
 * Supabase Auth (email potvrda / PKCE) — zamjena `code` za sesiju i redirect.
 * U Supabase Dashboard dodaj Redirect URL: {NEXT_PUBLIC_APP_URL}/auth/callback
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextPath = safeNextPath(requestUrl.searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=missing_code', requestUrl.origin),
    );
  }

  const redirectUrl = new URL(nextPath, requestUrl.origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('Potvrda e-pošte nije uspjela')}`,
        requestUrl.origin,
      ),
    );
  }

  return response;
}
