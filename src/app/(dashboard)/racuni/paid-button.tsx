'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function MarkAsPaidButton({ racunId }: { racunId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsPaid = async () => {
    setIsLoading(true);
    await fetch(`/api/racuni/${racunId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'placeno',
      }),
    });
    setIsLoading(false);
    router.refresh();
  };

  return (
    <button
      type='button'
      onClick={handleMarkAsPaid}
      disabled={isLoading}
      className='font-body rounded-lg bg-[#0d9488] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
    >
      {isLoading ? 'Spremam...' : 'Označi plaćeno'}
    </button>
  );
}
