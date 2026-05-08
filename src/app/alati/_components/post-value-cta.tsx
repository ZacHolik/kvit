import Link from 'next/link';

const TALLY = 'https://tally.so/r/44or65';
const USE_TALLY = true;

export function PostValueCta() {
  const href = USE_TALLY ? TALLY : '/registracija';

  return (
    <div className='mt-4 rounded-xl border border-[#2a3734] bg-[#101515] p-4'>
      <p className='font-body text-sm text-[#c6d1cf]'>
        Ovakve odgovore i komplet knjigovodstveni servis za paušalce možeš imati za
        5,60€/mj — zauvijek.
        <br />
        Iskoristi promotivni period!!
      </p>
      <Link
        href={href}
        target={USE_TALLY ? '_blank' : undefined}
        rel={USE_TALLY ? 'noopener noreferrer' : undefined}
        className='font-body mt-3 inline-flex rounded-xl bg-[#14b8a6] px-4 py-2.5 text-sm font-semibold text-[#06211f] transition hover:bg-[#2dd4bf]'
      >
        Zaključaj cijenu →
      </Link>
    </div>
  );
}
