'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

const MAIN_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/racuni', label: 'Računi', icon: '📄' },
  { href: '/ponude', label: 'Ponude', icon: '🧾' },
  { href: '/kupci', label: 'Kupci', icon: '👥' },
  { href: '/stavke', label: 'Stavke', icon: '📦' },
  { href: '/kpr', label: 'KPR', icon: '📋' },
  { href: '/po-sd', label: 'PO-SD', icon: '📑' },
  { href: '/asistent', label: 'AI Asistent', icon: '🤖' },
  { href: '/vodici', label: 'Vodiči', icon: '📚' },
  { href: '/alati', label: 'Alati', icon: '🛠️' },
] as const;

const SETTINGS_NAV = { href: '/postavke', label: 'Postavke', icon: '⚙️' } as const;

function navLinkActive(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
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

function NavDivider() {
  return <div className='my-2 h-px shrink-0 bg-[#1f2a28]' role='separator' />;
}

function MainNavLinks({
  pathname,
  onNavigate,
  variant,
}: {
  pathname: string;
  onNavigate?: () => void;
  variant: 'drawer' | 'sidebar';
}) {
  const isDrawer = variant === 'drawer';
  const baseRow =
    'font-body flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition';
  const inactive = isDrawer
    ? 'border-l-4 border-transparent text-[#b9c7c4] hover:border-[#0d9488]/40 hover:bg-[#111916] hover:text-[#e2e8e7]'
    : 'border-l-4 border-transparent text-[#b9c7c4] hover:bg-[#1f2a28] hover:text-[#e2e8e7]';
  const active =
    'border-l-4 border-[#0d9488] bg-[#0d9488]/20 pl-2 font-medium text-[#0d9488]';

  return (
    <>
      {MAIN_NAV.map(({ href, label, icon }) => {
        const activeRoute = navLinkActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`${baseRow} ${activeRoute ? active : inactive}`}
          >
            <span className='w-6 shrink-0 text-center text-base' aria-hidden>
              {icon}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </>
  );
}

function SettingsNavLink({
  pathname,
  onNavigate,
  variant,
}: {
  pathname: string;
  onNavigate?: () => void;
  variant: 'drawer' | 'sidebar';
}) {
  const isDrawer = variant === 'drawer';
  const baseRow =
    'font-body flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition';
  const inactive = isDrawer
    ? 'border-l-4 border-transparent text-[#b9c7c4] hover:border-[#0d9488]/40 hover:bg-[#111916] hover:text-[#e2e8e7]'
    : 'border-l-4 border-transparent text-[#b9c7c4] hover:bg-[#1f2a28] hover:text-[#e2e8e7]';
  const active =
    'border-l-4 border-[#0d9488] bg-[#0d9488]/20 pl-2 font-medium text-[#0d9488]';
  const activeRoute = navLinkActive(pathname, SETTINGS_NAV.href);

  return (
    <Link
      href={SETTINGS_NAV.href}
      onClick={onNavigate}
      className={`${baseRow} ${activeRoute ? active : inactive}`}
    >
      <span className='w-6 shrink-0 text-center text-base' aria-hidden>
        {SETTINGS_NAV.icon}
      </span>
      <span>{SETTINGS_NAV.label}</span>
    </Link>
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

  const signOutRowClass =
    'font-body flex w-full items-center gap-3 rounded-lg border border-[#2a3734] px-3 py-2.5 text-left text-sm text-[#b9c7c4] transition hover:border-[#0d9488]/50 hover:bg-[#1f2a28] hover:text-[#e2e8e7]';

  return (
    <div className='min-h-screen bg-[#0b0f0e] text-[#e2e8e7]'>
      {/* Mobile top bar — logo left, hamburger right */}
      <header className='sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#1f2a28] bg-[#111916] px-4 md:hidden'>
        <Link
          href='/dashboard'
          className='font-heading text-lg text-[#e2e8e7]'
          onClick={closeMenu}
        >
          Kvik<span className='text-[#0d9488]'>.</span>
        </Link>
        <button
          type='button'
          onClick={() => setMenuOpen((o) => !o)}
          className='flex h-10 w-10 items-center justify-center rounded-lg text-[#e2e8e7] outline-none transition hover:bg-[#1f2a28]'
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Zatvori izbornik' : 'Otvori izbornik'}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </header>

      {/* Mobile backdrop */}
      {menuOpen ? (
        <button
          type='button'
          className='fixed inset-0 z-40 bg-black/60 md:hidden'
          aria-label='Zatvori izbornik'
          onClick={closeMenu}
        />
      ) : null}

      {/* Mobile drawer — full height from left */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-[min(20rem,100vw)] max-w-sm flex-col border-r border-[#0d9488]/25 bg-[#0b0f0e] shadow-2xl shadow-black/40 transition-transform duration-200 ease-out md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className='flex items-center justify-between border-b border-[#1f2a28] px-4 py-4'>
          <span className='font-heading text-lg text-[#e2e8e7]'>
            Kvik<span className='text-[#0d9488]'>.</span>
          </span>
          <button
            type='button'
            onClick={closeMenu}
            className='flex h-9 w-9 items-center justify-center rounded-lg text-[#94a3a0] transition hover:bg-[#111916] hover:text-[#e2e8e7]'
            aria-label='Zatvori izbornik'
          >
            <HamburgerIcon open />
          </button>
        </div>

        <nav
          className='flex flex-1 flex-col gap-1 overflow-y-auto p-4'
          aria-label='Glavna navigacija'
        >
          <MainNavLinks
            pathname={pathname}
            onNavigate={closeMenu}
            variant='drawer'
          />
          <NavDivider />
          <SettingsNavLink
            pathname={pathname}
            onNavigate={closeMenu}
            variant='drawer'
          />
          <button
            type='button'
            onClick={() => {
              closeMenu();
              void handleSignOut();
            }}
            className={signOutRowClass}
          >
            <span className='w-6 shrink-0 text-center text-base' aria-hidden>
              🚪
            </span>
            <span>Odjava</span>
          </button>
        </nav>
      </aside>

      <div className='flex min-h-[calc(100vh-3.5rem)] md:min-h-screen'>
        {/* Desktop sidebar */}
        <aside className='hidden w-64 shrink-0 flex-col border-r border-[#1f2a28] bg-[#111916] md:flex'>
          <div className='border-b border-[#1f2a28] p-6'>
            <Link href='/dashboard' className='font-heading text-xl text-[#e2e8e7]'>
              Kvik<span className='text-[#0d9488]'>.</span>
            </Link>
          </div>

          <nav
            className='flex flex-1 flex-col gap-1 overflow-y-auto p-4'
            aria-label='Glavna navigacija'
          >
            <MainNavLinks pathname={pathname} variant='sidebar' />
          </nav>

          <div className='border-t border-[#1f2a28] p-4'>
            <SettingsNavLink pathname={pathname} variant='sidebar' />
            <NavDivider />
            <button
              type='button'
              onClick={() => {
                void handleSignOut();
              }}
              className={`${signOutRowClass} w-full`}
            >
              <span className='w-6 shrink-0 text-center text-base' aria-hidden>
                🚪
              </span>
              <span>Odjava</span>
            </button>
          </div>
        </aside>

        <main className='min-w-0 flex-1'>{children}</main>
      </div>
    </div>
  );
}
