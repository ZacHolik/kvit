'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ConvertOfferButton({ ponudaId }: { ponudaId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function convert() {
    setIsLoading(true);
    const response = await fetch(`/api/ponude/${ponudaId}/convert`, {
      method: 'PATCH',
    });
    setIsLoading(false);

    if (response.ok) {
      router.push('/racuni');
      router.refresh();
      return;
    }

    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    alert(payload.error || 'Pretvaranje ponude nije uspjelo.');
  }

  return (
    <button
      type='button'
      onClick={() => void convert()}
      disabled={isLoading}
      className='rounded-lg border border-[#0d9488] px-3 py-2 text-xs font-semibold text-[#5eead4] transition hover:bg-[#0d9488]/10 disabled:cursor-not-allowed disabled:opacity-60'
    >
      {isLoading ? 'Pretvaram...' : 'Pretvori u račun'}
    </button>
  );
}
