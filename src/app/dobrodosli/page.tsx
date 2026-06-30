export default function DobrodosliPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[#0b0f0e] px-4 text-center'>
      <div className='max-w-md'>
        <h1 className='font-heading mb-3 text-2xl font-bold text-[#e2e8e7]'>
          Plaćanje uspješno! 🎉
        </h1>
        <p className='mb-2 text-[#94a3a0]'>
          Poslali smo ti email s linkom za postavljanje lozinke.
        </p>
        <p className='text-sm text-[#64756f]'>
          Provjeri inbox (i spam folder) — link je aktivan 1 sat.
        </p>
      </div>
    </main>
  );
}
