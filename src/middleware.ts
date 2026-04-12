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

  const pathname = request.nextUrl.pathname;

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
