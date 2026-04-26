'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type EmailInvoiceButtonProps = {
  racunId: string;
  defaultEmail: string;
  defaultSubject: string;
};

export function EmailInvoiceButton({
  racunId,
  defaultEmail,
  defaultSubject,
}: EmailInvoiceButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState(defaultEmail);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState('U prilogu se nalazi vaš račun.');
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback('');
    setIsSending(true);

    const response = await fetch(`/api/racuni/${racunId}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, message }),
    });

    setIsSending(false);
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setFeedback(payload.error || 'Slanje nije uspjelo.');
      return;
    }

    setFeedback('Email je poslan.');
    router.refresh();
    window.setTimeout(() => setOpen(false), 900);
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='font-body rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488]'
      >
        Pošalji email
      </button>

      {open ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
          <form
            onSubmit={handleSubmit}
            className='w-full max-w-lg rounded-2xl border border-[#1f2a28] bg-[#111716] p-6 shadow-2xl'
          >
            <h2 className='font-heading text-xl text-[#e2e8e7]'>Pošalji račun</h2>
            <label className='mt-5 block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Primatelj
              </span>
              <input
                required
                type='email'
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='mt-4 block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Naslov
              </span>
              <input
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>
            <label className='mt-4 block'>
              <span className='font-body mb-2 block text-sm text-[#b9c7c4]'>
                Poruka
              </span>
              <textarea
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 outline-none transition focus:border-[#0d9488]'
              />
            </label>

            {feedback ? (
              <p className='font-body mt-4 rounded-lg border border-[#2a3734] p-3 text-sm text-[#d5dfdd]'>
                {feedback}
              </p>
            ) : null}

            <div className='mt-6 flex flex-wrap gap-3'>
              <button
                type='submit'
                disabled={isSending}
                className='font-body rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isSending ? 'Šaljem...' : 'Pošalji'}
              </button>
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='font-body rounded-xl border border-[#2a3734] px-5 py-3 text-[#d5dfdd] transition hover:border-[#0d9488]'
              >
                Zatvori
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
