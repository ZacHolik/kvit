type PriceLockBannerProps = {
  amount: number | null;
};

/** P2-6: early adopter price lock potvrda (samo kad je feature flag ON). */
export function PriceLockBanner({ amount }: PriceLockBannerProps) {
  return (
    <section className='rounded-2xl border border-[#0d9488]/35 bg-[#0d9488]/10 p-4 font-body text-sm text-[#b9c7c4]'>
      ✅ Cijena zaključana — {amount ?? 5.6}€/mj zauvijek (early adopter
      referral).
    </section>
  );
}
