import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-[#0b0f0e] text-[#e2e8e7]'>
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.35]'
        aria-hidden
      >
        <div className='absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#0d9488]/25 blur-3xl' />
        <div className='absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#115e59]/30 blur-3xl' />
      </div>

      <div className='relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8'>
        <p className='font-body text-sm font-medium uppercase tracking-[0.2em] text-[#0d9488]'>
          Kvit
        </p>
        <h1 className='font-heading mt-6 text-4xl leading-tight text-[#e2e8e7] sm:text-5xl sm:leading-tight'>
          Paušalni obrt bez glavobolje.
        </h1>
        <p className='font-body mt-6 max-w-xl text-lg leading-relaxed text-[#94a3a0]'>
          KPR, fiskalizacija i PO-SD – automatski.
        </p>

        <div className='mt-10 flex flex-col gap-4 sm:flex-row sm:items-center'>
          <a
            href='https://tally.so/r/44or65'
            target='_blank'
            rel='noopener noreferrer'
            className='font-body inline-flex items-center justify-center rounded-xl bg-[#0d9488] px-6 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-[#0d9488]/20 transition hover:bg-[#14b8a6]'
          >
            Prijavi se na listu →
          </a>
          <Link
            href='/login'
            className='font-body inline-flex items-center justify-center rounded-xl border border-[#2a3734] bg-[#111716] px-6 py-3.5 text-center text-base font-semibold text-[#e2e8e7] transition hover:border-[#0d9488]/50 hover:bg-[#1a2422]'
          >
            Imam račun
          </Link>
        </div>

        <p className='font-body mt-14 text-sm text-[#64706e]'>
          Jedna aplikacija za kvitancije, knjigu prometa i obračun – na{' '}
          <span className='text-[#94a3a0]'>kvit.online</span>.
        </p>
      </div>
    </main>
  );
}
