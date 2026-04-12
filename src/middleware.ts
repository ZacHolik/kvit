import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const AUTH_PUBLIC_PREFIXES = [
  '/login',
  '/register',
  '/onboarding',
  '/confirm-email',
  '/auth/callback',
] as const;

/**
 * Session required for all routes except: `/` (landing), auth flows below,
 * `/api/*` (handlers enforce auth), and PWA manifest. App UI lives under
 * `/dashboard`, `/racuni`, `/kpr`, `/po-sd`, `/asistent`.
 */
/** Rute aplikacije koje zahtijevaju dovršen onboarding (naziv obrta u profilu). */
function requiresCompletedProfile(pathname: string) {
  const roots = [
    '/dashboard',
    '/racuni',
    '/kpr',
    '/po-sd',
    '/asistent',
  ] as const;
  return roots.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isPublicPath(pathname: string) {
  if (pathname === '/') {
    return true;
  }
  if (pathname === '/manifest.json') {
    return true;
  }
  if (pathname === '/sw.js' || /^\/workbox-[\w.-]+\.js$/.test(pathname)) {
    return true;
  }
  if (pathname.startsWith('/api/')) {
    return true;
  }
  return AUTH_PUBLIC_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  /**
   * Supabase email potvrda često redirecta na Site URL root (?code=…&state=…)
   * umjesto na /auth/callback — proslijedi u naš handler + default next.
   */
  if (url.searchParams.has('code') && pathname === '/') {
    const dest = request.nextUrl.clone();
    dest.pathname = '/auth/callback';
    if (!dest.searchParams.get('next')) {
      dest.searchParams.set('next', '/confirm-email?verified=1');
    }
    return NextResponse.redirect(dest);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  if (user && requiresCompletedProfile(pathname)) {
    const { data: profil } = await supabase
      .from('profiles')
      .select('naziv_obrta')
      .eq('id', user.id)
      .maybeSingle();

    if (!profil?.naziv_obrta?.trim()) {
      const onboardingUrl = request.nextUrl.clone();
      onboardingUrl.pathname = '/onboarding';
      onboardingUrl.search = '';
      return NextResponse.redirect(onboardingUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
