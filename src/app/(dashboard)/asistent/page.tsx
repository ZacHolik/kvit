'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const STARTER_PROMPTS = [
  'Koji su moji sljedeći porezni rokovi?',
  'Koliko iznosi kvartalni porez za 27.500 € primitaka?',
  'Što trebam predati za PO-SD?',
];

export default function AsistentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Bok! Ja sam Kvit asistent. Pitaj me sve o rokovima, porezu, KPR-u i PO-SD obvezama za paušalni obrt.',
    },
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    });
  };

  const sendMessage = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) {
      return;
    }

    setError('');
    setIsLoading(true);

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: cleanText },
      { role: 'assistant', content: '' },
    ];
    setMessages(nextMessages);
    setInput('');
    scrollToBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.slice(0, -1),
        }),
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? 'Greška pri pozivu AI servisa.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        assistantText += decoder.decode(value, { stream: true });

        setMessages((previous) => {
          const updated = [...previous];
          const lastIndex = updated.length - 1;
          if (lastIndex >= 0 && updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = {
              role: 'assistant',
              content: assistantText,
            };
          }
          return updated;
        });
        scrollToBottom();
      }
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : 'Dogodila se neočekivana greška.',
      );
      setMessages((previous) => [
        ...previous.slice(0, -1),
        {
          role: 'assistant',
          content:
            'Trenutno ne mogu dohvatiti odgovor. Pokušaj ponovno za nekoliko sekundi.',
        },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-5'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          <p className='font-body text-sm text-[#94a3a0]'>AI podrška za paušalce</p>
          <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Kvit Asistent</h1>
          <p className='font-body mt-3 text-sm text-[#b9c7c4]'>
            Odgovori su optimizirani za hrvatske paušalne obrtnike i aktualna
            pravila iz Kvit baze znanja.
          </p>
        </header>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-3 sm:p-4'>
          <div
            ref={scrollContainerRef}
            className='max-h-[58vh] space-y-3 overflow-y-auto pr-1'
          >
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'ml-auto bg-[#0d9488] text-white'
                    : 'bg-[#0b0f0e] text-[#d5dfdd] border border-[#253330]'
                }`}
              >
                {message.content || (isLoading ? 'Pišem odgovor...' : '')}
              </article>
            ))}
          </div>
        </section>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-4'>
          <div className='mb-3 flex flex-wrap gap-2'>
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type='button'
                disabled={isLoading}
                onClick={() => sendMessage(prompt)}
                className='font-body rounded-lg border border-[#2a3734] px-3 py-2 text-xs text-[#d5dfdd] transition hover:border-[#0d9488] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className='space-y-3'>
            <textarea
              rows={4}
              value={input}
              disabled={isLoading}
              onChange={(event) => setInput(event.target.value)}
              className='font-body w-full rounded-xl border border-[#2a3734] bg-[#0b0f0e] px-4 py-3 text-sm text-[#e2e8e7] outline-none transition focus:border-[#0d9488] disabled:opacity-70'
              placeholder='Postavi pitanje (npr. “Koje su moje obveze ovaj mjesec?”)'
            />
            {error ? (
              <p className='font-body rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200'>
                {error}
              </p>
            ) : null}
            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={!canSubmit}
                className='font-body rounded-xl bg-[#0d9488] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isLoading ? 'Generiram odgovor...' : 'Pošalji'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
