'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#0b0f0e]'>
      <p className='text-sm text-[#94a3a0]'>Prijava u tijeku...</p>
    </div>
  );
}
