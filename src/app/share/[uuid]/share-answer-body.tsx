'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

const MD: Components = {
  p: ({ children }) => (
    <p className='mb-4 last:mb-0 leading-relaxed text-stone-700'>{children}</p>
  ),
  strong: ({ children }) => (
    <strong className='font-semibold text-stone-900'>{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className='my-3 list-disc space-y-1 pl-6 text-stone-700'>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className='my-3 list-decimal space-y-1 pl-6 text-stone-700'>{children}</ol>
  ),
  li: ({ children }) => <li className='leading-relaxed'>{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-[#0d9488] underline decoration-[#0d9488]/40 underline-offset-2'
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /\blanguage-/.test(className ?? '');
    if (isBlock) {
      return (
        <code
          className='block font-mono text-sm leading-relaxed text-stone-800'
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className='rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[0.9em] text-stone-800'
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className='my-4 overflow-x-auto rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm'>
      {children}
    </pre>
  ),
};

/** Sloj 1: AI odgovor kao blog tijelo (ne chat balon). */
export function ShareAnswerBody({ answer }: { answer: string }) {
  return (
    <div className='share-markdown mt-8 border-t border-stone-100 pt-8'>
      <ReactMarkdown components={MD}>{answer}</ReactMarkdown>
    </div>
  );
}
