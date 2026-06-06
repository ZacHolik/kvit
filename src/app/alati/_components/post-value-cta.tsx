import Link from 'next/link';

import { priceLockEnabled } from '@/lib/price-lock-feature';

export function PostValueCta() {
  if (!priceLockEnabled) {
    return null;
  }

  return (
    <div className='mt-4 rounded-xl border border-[#2a3734] bg-[#101515] p-4'>
      <p className='font-body text-sm text-[#c6d1cf]'>
        Ovakve odgovore i komplet knjigovodstveni servis za paušalce možeš imati za
        5,60€/mj — zauvijek.
        <br />
        Iskoristi promotivni period!!
      </p>
      <Link
        href='/cijene'
        className='font-body mt-3 inline-flex rounded-xl bg-[#14b8a6] px-4 py-2.5 text-sm font-semibold text-[#06211f] transition hover:bg-[#2dd4bf]'
      >
        Zaključaj cijenu →
      </Link>
    </div>
  );
}
