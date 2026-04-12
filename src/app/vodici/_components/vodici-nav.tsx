import Link from 'next/link';

export function VodiciNav() {
  return (
    <header className='sticky top-0 z-50 border-b border-[#1f2a28] bg-[#0b0f0e]/95 backdrop-blur-sm'>
      <nav className='mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='font-heading text-xl font-bold tracking-tight text-[#e2e8e7]'
        >
          Kvit<span className='text-[#0d9488]'>.</span>
        </Link>
        <ul className='flex flex-wrap items-center gap-4 text-sm text-[#b9c7c4]'>
          <li>
            <Link
              href='/vodici'
              className='transition hover:text-[#0d9488]'
            >
              Vodiči
            </Link>
          </li>
          <li>
            <a
              href='/#prednosti'
              className='transition hover:text-[#0d9488]'
            >
              Prednosti
            </a>
          </li>
          <li>
            <a href='/#cijene' className='transition hover:text-[#0d9488]'>
              Cijene
            </a>
          </li>
        </ul>
        <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
          <Link
            href='/login'
            className='rounded-lg border border-[#0d9488]/60 px-3 py-2 text-sm font-medium text-[#d5dfdd] transition hover:border-[#0d9488] hover:bg-[#0d9488]/10'
          >
            Imam račun
          </Link>
          <Link
            href='/register'
            className='rounded-lg bg-[#0d9488] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Isprobaj besplatno
          </Link>
        </div>
      </nav>
    </header>
  );
}
