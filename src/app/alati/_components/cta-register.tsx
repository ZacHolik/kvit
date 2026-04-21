import Link from 'next/link';

type CtaRegisterProps = {
  title: string;
  body: string;
  buttonLabel: string;
  href?: string;
};

export function CtaRegister({
  title,
  body,
  buttonLabel,
  href = '/register',
}: CtaRegisterProps) {
  return (
    <div className='mt-10 rounded-2xl border border-[#0d9488]/40 bg-[#111716] p-6 sm:p-8'>
      <p className='font-heading text-lg font-semibold text-[#e2e8e7]'>{title}</p>
      <p className='mt-2 text-sm leading-relaxed text-[#94a3a0]'>{body}</p>
      <Link
        href={href}
        className='btn-cta-primary mt-5 px-5 py-2.5 text-sm'
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
