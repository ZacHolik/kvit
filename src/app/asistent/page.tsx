'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

import { createClient } from '@/lib/supabase/client';

import { HARDCODED_QA } from './hardcoded-qa-data';
import { ShareAiResponse } from './share-ai-response';

const GUEST_FREE_QUESTIONS_LS = 'kvik-asistent-guest-questions-used';

const ASSISTANT_MD_COMPONENTS: Components = {
  p: ({ children }) => (
    <p className='mb-2 last:mb-0 leading-relaxed'>{children}</p>
  ),
  strong: ({ children }) => (
    <strong className='font-semibold text-[#e2e8e7]'>{children}</strong>
  ),
  em: ({ children }) => <em className='italic text-[#d5dfdd]'>{children}</em>,
  ul: ({ children }) => (
    <ul className='my-2 list-disc space-y-1 pl-5 marker:text-[#64756f]'>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className='my-2 list-decimal space-y-1 pl-5 marker:text-[#64756f]'>{children}</ol>
  ),
  li: ({ children }) => <li className='leading-relaxed'>{children}</li>,
  h1: ({ children }) => (
    <h3 className='mb-2 mt-3 font-heading text-base font-bold text-[#e2e8e7] first:mt-0'>
      {children}
    </h3>
  ),
  h2: ({ children }) => (
    <h3 className='mb-2 mt-3 font-heading text-base font-bold text-[#e2e8e7] first:mt-0'>
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className='mb-1 mt-2 font-heading text-sm font-semibold text-[#e2e8e7] first:mt-0'>
      {children}
    </h4>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-[#5eead4] underline decoration-[#5eead4]/50 underline-offset-2 hover:text-[#99f6e4]'
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /\blanguage-/.test(className ?? '');
    if (isBlock) {
      return (
        <code
          className='block font-mono text-xs leading-relaxed text-[#d5dfdd]'
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className='rounded bg-[#253330] px-1.5 py-0.5 font-mono text-[0.85em] text-[#a7f3d0]'
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className='my-2 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-[#253330] bg-[#050807] p-3'>
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className='my-2 border-l-2 border-[#0d9488]/60 pl-3 text-[#b9c7c4]'>
      {children}
    </blockquote>
  ),
  hr: () => <hr className='my-3 border-[#253330]' />,
};

function AssistantMessageContent({ content }: { content: string }) {
  return (
    <div className='assistant-markdown text-[#d5dfdd]'>
      <ReactMarkdown components={ASSISTANT_MD_COMPONENTS}>{content}</ReactMarkdown>
    </div>
  );
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function lastUserQuestionBefore(messages: ChatMessage[], assistantIndex: number) {
  for (let i = assistantIndex - 1; i >= 0; i -= 1) {
    if (messages[i].role === 'user') {
      return messages[i].content;
    }
  }
  return null;
}

function readGuestQuestionCount(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  const raw = window.localStorage.getItem(GUEST_FREE_QUESTIONS_LS);
  const n = Number.parseInt(raw ?? '0', 10);
  if (!Number.isFinite(n) || n < 0) {
    return 0;
  }
  return Math.min(n, 99);
}

export default function AsistentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Bok! Ja sam Kvik asistent. Pitaj me sve o rokovima, porezu, KPR-u i PO-SD obvezama za paušalni obrt.',
    },
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestQuestionsUsed, setGuestQuestionsUsed] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const refresh = () => {
      void supabase.auth.getUser().then(({ data: { user } }) => {
        if (cancelled) {
          return;
        }
        setIsLoggedIn(!!user);
        if (!user) {
          setGuestQuestionsUsed(readGuestQuestionCount());
        }
        setAuthReady(true);
      });
    };

    refresh();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const guestQuotaExhausted = authReady && !isLoggedIn && guestQuestionsUsed >= 3;

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !isLoading && !guestQuotaExhausted,
    [input, isLoading, guestQuotaExhausted],
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

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const isGuest = !user;

    if (isGuest) {
      const used = readGuestQuestionCount();
      if (used >= 3) {
        setError(
          'Iskoristio si besplatna pitanja. Registriraj se za neograničen pristup.',
        );
        return;
      }
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

      if (isGuest && assistantText.trim()) {
        const next = readGuestQuestionCount() + 1;
        window.localStorage.setItem(GUEST_FREE_QUESTIONS_LS, String(next));
        setGuestQuestionsUsed(next);
      }

      if (assistantText.trim() && !isGuest) {
        void fetch('/api/referral/record-activation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activationType: 'ai_question' }),
        }).catch(() => {});
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

  /** Brzi odgovori bez /api/chat — share i dalje ide na /api/share/answers (user_id null za goste). */
  const appendHardcodedExchange = (question: string, answer: string) => {
    if (isLoading) {
      return;
    }
    setError('');
    setMessages((previous) => [
      ...previous,
      { role: 'user', content: question },
      { role: 'assistant', content: answer },
    ]);
    requestAnimationFrame(() => scrollToBottom());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <main className='min-h-screen bg-[#0b0f0e] px-4 py-8 text-[#e2e8e7] sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-5'>
        <header className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-5 sm:p-6'>
          {!isLoggedIn ? (
            <Link
              href='/'
              className='font-heading inline-flex items-center rounded-lg border border-[#2a3734] bg-[#0b0f0e] px-3 py-1.5 text-xs tracking-[0.18em] text-[#d5dfdd] transition hover:border-[#0d9488]'
            >
              KVIK
            </Link>
          ) : null}
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <p className='font-body text-sm text-[#94a3a0]'>AI podrška za paušalce</p>
              <h1 className='font-heading mt-2 text-2xl sm:text-3xl'>Kvik Asistent</h1>
              <p className='font-body mt-3 text-sm text-[#b9c7c4]'>
                Odgovori su optimizirani za hrvatske paušalne obrtnike i aktualna
                pravila iz Kvik baze znanja.
              </p>
            </div>
            {!isLoggedIn ? (
              <Link
                href='/login'
                className='font-body shrink-0 rounded-lg border border-[#2a3734] px-3 py-2 text-sm text-[#d5dfdd] transition hover:border-[#0d9488]'
              >
                Prijavi se
              </Link>
            ) : null}
          </div>
          {authReady && !isLoggedIn ? (
            <p className='font-body mt-3 text-xs text-[#94a3a0]'>
              Besplatno do 3 pitanja po pregledniku (sessija).{' '}
              {guestQuestionsUsed >= 3 ? null : (
                <span>
                  Iskorišteno: {guestQuestionsUsed} / 3
                </span>
              )}
            </p>
          ) : null}
        </header>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-3 sm:p-4'>
          <div
            ref={scrollContainerRef}
            className='max-h-[58vh] space-y-3 overflow-y-auto pr-1'
          >
            {messages.map((message, index) => {
              const userQ =
                message.role === 'assistant'
                  ? lastUserQuestionBefore(messages, index)
                  : null;
              const showShare =
                message.role === 'assistant' &&
                index > 0 &&
                Boolean(message.content.trim()) &&
                userQ != null;

              return (
                <article
                  key={`${message.role}-${index}`}
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'ml-auto bg-[#0d9488] text-white'
                      : 'bg-[#0b0f0e] text-[#d5dfdd] border border-[#253330]'
                  }`}
                >
                  {showShare ? (
                    <ShareAiResponse
                      question={userQ}
                      answer={message.content}
                      variant='highlight'
                    />
                  ) : null}
                  {message.role === 'user' ? (
                    <span className='whitespace-pre-wrap'>{message.content}</span>
                  ) : message.content ? (
                    <div className={showShare ? 'mt-3' : undefined}>
                      <AssistantMessageContent content={message.content} />
                    </div>
                  ) : isLoading ? (
                    'Pišem odgovor...'
                  ) : null}
                  {showShare ? (
                    <ShareAiResponse question={userQ} answer={message.content} />
                  ) : null}
                  {showShare && !isLoggedIn ? (
                    <div className='mt-4 rounded-2xl border border-[#2a3734] bg-gradient-to-br from-[#101515] to-[#0b0f0e] p-4'>
                      <p className='font-body text-sm leading-relaxed text-[#c8d3d1]'>
                        Ovakve odgovore i sređene knjigovodstvene papire za paušalce
                        možeš imati svaki dan.
                        <br />
                        Iskoristi promociju! Uhvati cijenu za KVIK 5,99€/mj —
                        zauvijek.
                      </p>
                      <a
                        href='https://kvik.online/register'
                        className='font-body mt-4 inline-flex items-center justify-center rounded-xl bg-[#14b8a6] px-4 py-2.5 text-sm font-semibold text-[#042f2e] shadow-[0_8px_20px_rgba(20,184,166,0.28)] transition hover:-translate-y-0.5 hover:bg-[#2dd4bf]'
                      >
                        Zaključaj cijenu →
                      </a>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className='rounded-2xl border border-[#1f2a28] bg-[#111716] p-4'>
          {/* Brzi odgovori (bez tokena) — iznad vlastitog pitanja / CTA kad je kvota iscrpljena. */}
          <div className='border-b border-[#253330] pb-5'>
            <p className='font-body text-xs font-medium uppercase tracking-wide text-[#64756f]'>
              Brza pitanja (bez AI troška)
            </p>
            <div className='mt-4 space-y-6'>
              {HARDCODED_QA.categories.map((category) => (
                <div key={category.title}>
                  <h3 className='font-heading text-sm font-semibold text-[#e2e8e7]'>
                    {category.title}
                  </h3>
                  <div className='mt-2 grid gap-2 sm:grid-cols-2'>
                    {category.questions.map((item) => (
                      <button
                        key={item.id}
                        type='button'
                        disabled={isLoading}
                        onClick={() =>
                          appendHardcodedExchange(item.question, item.answer)
                        }
                        className='font-body rounded-xl border border-[#2a3734] bg-[#0b0f0e] p-3 text-left text-xs leading-snug text-[#d5dfdd] transition hover:border-[#0d9488] disabled:cursor-not-allowed disabled:opacity-60'
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-5'>
            {guestQuotaExhausted ? (
              <div className='rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center'>
                <p className='font-body text-sm text-amber-100'>
                  Iskoristio si besplatna pitanja. Registriraj se za neograničen
                  pristup.
                </p>
                <Link
                  href='/register'
                  className='font-body mt-3 inline-flex rounded-xl bg-[#0d9488] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14b8a6]'
                >
                  Registriraj se →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-3'>
                <textarea
                  rows={4}
                  value={input}
                  disabled={isLoading || guestQuotaExhausted}
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
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
