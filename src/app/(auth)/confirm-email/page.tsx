import Link from 'next/link';

export default function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const userEmail = searchParams.email || 'tvoj email';

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 py-10'>
      <section className='w-full max-w-lg rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-xl shadow-black/25 sm:p-8'>
        <p className='font-body text-sm text-[#94a3a0]'>Potvrda registracije</p>
        <h1 className='font-heading mt-2 text-3xl text-[#e2e8e7]'>Gotovo!</h1>

        <p className='font-body mt-6 text-base leading-relaxed text-[#d5dfdd]'>
          Poslali smo email na <span className='font-semibold'>{userEmail}</span>.
          Klikni link u emailu kako bi potvrdio svoj račun.
        </p>

        <p className='font-body mt-4 text-sm text-[#94a3a0]'>
          Ne vidiš email? Provjeri spam folder.
        </p>

        <div className='mt-8'>
          <Link
            href='/login'
            className='font-body inline-flex rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6]'
          >
            Na prijavu
          </Link>
        </div>
      </section>
    </main>
  );
}
