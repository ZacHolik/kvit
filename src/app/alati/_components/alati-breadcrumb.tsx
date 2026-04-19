import Link from 'next/link';

type Crumb = { label: string; href?: string };

export function AlatiBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label='Putanja' className='mb-8 text-sm text-[#94a3a0]'>
      <ol className='flex flex-wrap items-center gap-2'>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className='flex items-center gap-2'>
            {i > 0 ? <span aria-hidden='true'>/</span> : null}
            {item.href ? (
              <Link href={item.href} className='transition hover:text-[#0d9488]'>
                {item.label}
              </Link>
            ) : (
              <span className='text-[#d5dfdd]'>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
