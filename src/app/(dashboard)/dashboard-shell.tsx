'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/racuni', label: 'Računi' },
  { href: '/kpr', label: 'KPR' },
  { href: '/po-sd', label: 'PO-SD' },
  { href: '/asistent', label: 'AI Asistent' },
] as const;

function navLinkActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox='0 0 24 24'
      fill='none'
      className='text-[#e2e8e7]'
      aria-hidden
    >
      {open ? (
        <path
          d='M6 6l12 12M18 6L6 18'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
        />
      ) : (
        <path
          d='M4 7h16M4 12h16M4 17h16'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
        />
      )}
    </svg>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className='min-h-screen bg-[#0b0f0e] text-[#e2e8e7]'>
      <header className='flex h-14 items-center justify-between border-b border-[#1f2a28] bg-[#111916] px-4 md:hidden'>
        <button
          type='button'
          onClick={() => setMenuOpen((o) => !o)}
          className='flex h-10 w-10 items-center justify-center rounded-lg text-[#e2e8e7] outline-none transition hover:bg-[#1f2a28]'
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Zatvori izbornik' : 'Otvori izbornik'}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
        <Link
          href='/'
          className='font-heading text-lg text-[#e2e8e7]'
          onClick={closeMenu}
        >
          Kvit
        </Link>
        <span className='w-10' aria-hidden />
      </header>

      {menuOpen ? (
        <button
          type='button'
          className='fixed inset-0 z-40 bg-black/55 md:hidden'
          aria-label='Zatvori izbornik'
          onClick={closeMenu}
        />
      ) : null}

      <div className='flex min-h-[calc(100vh-3.5rem)] md:min-h-screen'>
        <aside
          className={`fixed bottom-0 left-0 top-14 z-50 flex w-64 shrink-0 flex-col border-r border-[#1f2a28] bg-[#111916] transition-transform duration-200 ease-out md:static md:top-0 md:translate-x-0 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className='hidden border-b border-[#1f2a28] p-6 md:block'>
            <Link href='/' className='font-heading text-xl text-[#e2e8e7]'>
              Kvit
            </Link>
          </div>

          <nav
            className='flex flex-1 flex-col gap-1 overflow-y-auto p-4'
            aria-label='Glavna navigacija'
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = navLinkActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`font-body rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? 'border-l-4 border-[#0d9488] bg-[#0d9488]/20 pl-2 font-medium text-[#0d9488]'
                      : 'border-l-4 border-transparent text-[#b9c7c4] hover:bg-[#1f2a28] hover:text-[#e2e8e7]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className='border-t border-[#1f2a28] p-4'>
            <button
              type='button'
              onClick={() => {
                closeMenu();
                void handleSignOut();
              }}
              className='font-body w-full rounded-lg border border-[#2a3734] px-3 py-2.5 text-left text-sm text-[#b9c7c4] transition hover:border-[#0d9488]/50 hover:bg-[#1f2a28] hover:text-[#e2e8e7]'
            >
              Odjava
            </button>
          </div>
        </aside>

        <main className='min-w-0 flex-1'>{children}</main>
      </div>
    </div>
  );
}
