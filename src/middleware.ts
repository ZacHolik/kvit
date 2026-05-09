import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { getClientIpFromRequest } from '@/lib/client-ip';
import {
  REGISTRATION_ATTEMPTS_PER_HOUR,
  countRegistrationAttemptsInWindow,
} from '@/lib/registration-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const AUTH_PUBLIC_PREFIXES = [
  '/login',
  '/register',
  '/onboarding',
  '/confirm-email',
  '/auth/callback',
] as const;

/**
 * Javne rute (matcher funkcije) — sinkronizirano s isPublicPath().
 * Uključuje /provjera, vodice, alate, asistenta, statičke datoteke, /api, itd.
 * Napomena: /po-sd nije javan — neprijavljeni se šalju na /alati/po-sd (v. isječak ispod).
 */
const PUBLIC_PATH_RULES: ReadonlyArray<(pathname: string) => boolean> = [
  (p) => p === '/',
  (p) => p === '/vodici' || p.startsWith('/vodici/'),
  (p) => p === '/alati' || p.startsWith('/alati/'),
  (p) => p === '/asistent' || p.startsWith('/asistent/'),
  (p) => p === '/privacy' || p === '/uvjeti',
  (p) => p === '/provjera' || p.startsWith('/provjera/'),
  (p) => p === '/share' || p.startsWith('/share/'),
  (p) => p === '/r' || p.startsWith('/r/'),
  (p) => p === '/manifest.json',
  (p) => p === '/sitemap.xml',
  (p) => p === '/robots.txt',
  (p) => p === '/sw.js' || /^\/workbox-[\w.-]+\.js$/.test(p),
  (p) => p.startsWith('/api/'),
];

/**
 * Session required for all routes except: `/` (landing), `/vodici`, `/alati`,
 * `/asistent` (gosti + besplatna pitanja), auth flows below, `/api/*`, PWA manifest.
 * Ostatak app UI-ja: `/dashboard`, `/racuni`, … `/postavke` (zahtijevaju prijavu).
 */
/** Rute aplikacije koje zahtijevaju dovršen onboarding (naziv obrta u profilu). */
function requiresCompletedProfile(pathname: string) {
  const roots = [
    '/dashboard',
    '/racuni',
    '/ponude',
    '/kupci',
    '/stavke',
    '/kpr',
    '/postavke',
  ] as const;
  return roots.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isPublicPath(pathname: string) {
  if (PUBLIC_PATH_RULES.some((rule) => rule(pathname))) {
    return true;
  }
  return AUTH_PUBLIC_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  /** /provjera: bez Supabase getUser (brži cold start na edgeu). */
  if (pathname === '/provjera' || pathname.startsWith('/provjera/')) {
    return NextResponse.next();
  }

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

  /** Max 3 POST /api/auth/register per IP per hour (Supabase table; see migration). */
  if (pathname === '/api/auth/register' && request.method === 'POST') {
    const admin = createServiceRoleClient();
    if (admin) {
      const ip = getClientIpFromRequest(request);
      const count = await countRegistrationAttemptsInWindow(admin, ip);
      if (count !== null && count >= REGISTRATION_ATTEMPTS_PER_HOUR) {
        return NextResponse.json(
          {
            error:
              'Previše pokušaja registracije s ove mreže. Pokušaj ponovno za sat vremena.',
          },
          { status: 429 },
        );
      }
    }
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

  /**
   * /po-sd u aplikaciji = KPR pregled (samo prijavljeni). Gosti idu na javni generator.
   * (Bez ovoga next.config redirect je blokirao app rutu i svi su vidjeli samo stari javni alat.)
   */
  if (
    !user &&
    (pathname === '/po-sd' || pathname.startsWith('/po-sd/'))
  ) {
    const dest = request.nextUrl.clone();
    dest.pathname = '/alati/po-sd';
    return NextResponse.redirect(dest);
  }

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
