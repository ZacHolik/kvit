'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handled = useRef(false);
  const rawNext = searchParams.get('next');
  const nextPath =
    rawNext?.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : '/dashboard';

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const next = searchParams.get('next');
      const qs = new URLSearchParams({ code });
      if (next) {
        qs.set('next', next);
      }
      router.replace(`/auth/callback?${qs.toString()}`);
      return;
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const goDashboard = () => {
      if (handled.current) {
        return;
      }
      handled.current = true;
      router.replace(nextPath);
    };

    const goLogin = () => {
      if (handled.current) {
        return;
      }
      handled.current = true;
      router.replace('/login?error=auth_confirm_failed');
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        goDashboard();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session &&
        (event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'INITIAL_SESSION')
      ) {
        goDashboard();
      }
    });

    const timeout = window.setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        goDashboard();
      } else {
        goLogin();
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [router, searchParams, nextPath]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#0b0f0e]'>
      <p className='text-sm text-[#94a3a0]'>Prijava u tijeku...</p>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-[#0b0f0e]'>
          <p className='text-sm text-[#94a3a0]'>Prijava u tijeku...</p>
        </div>
      }
    >
      <AuthConfirmContent />
    </Suspense>
  );
}
