import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Samo relativne putanje na isti origin (bez open-redirect). */
function safeNextPath(raw: string | null): string {
  const fallback = '/dashboard';
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return fallback;
  }
  return raw;
}

/**
 * Supabase Auth (email potvrda / PKCE) — zamjena `code` za sesiju i redirect.
 * Bez `code` → /auth/confirm (hash / magic link token u browseru).
 * U Supabase Dashboard dodaj Redirect URL: {NEXT_PUBLIC_APP_URL}/auth/callback
 * i {NEXT_PUBLIC_APP_URL}/auth/confirm
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextPath = safeNextPath(requestUrl.searchParams.get('next'));

  if (!code) {
    // Hash (#access_token) nikad ne stigne na server — client handoff bez gubitka hash-a.
    const html = `<!DOCTYPE html>
<html lang="hr">
<head><meta charset="utf-8"/><title>Preusmjeravanje…</title></head>
<body>
<script>
(function () {
  var search = window.location.search || '';
  var hash = window.location.hash || '';
  var next = new URLSearchParams(search).get('next');
  var dest;
  if (hash && next && next.charAt(0) === '/' && next.indexOf('//') !== 0) {
    dest = next + hash;
  } else {
    dest = '/auth/confirm' + search + hash;
  }
  window.location.replace(dest);
})();
</script>
<p style="font-family:sans-serif;color:#94a3a0;text-align:center;margin-top:2rem">
  Prijava u tijeku…
</p>
</body>
</html>`;
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
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
