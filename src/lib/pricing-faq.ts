import { PRICING, eur, isPromoActive } from '@/config/pricing';

export function getCijeneFaqItems(now: Date = new Date()) {
  const promoActive = isPromoActive(now);
  const items = [
    {
      q: 'Moram li imati tehničko znanje?',
      a: 'Ne. Sve je klik po klik. Ako znaš koristiti WhatsApp, znaš koristiti Kvik.',
    },
    {
      q: 'Je li aplikacija usklađena s Fiskalizacijom 2.0?',
      a: 'Da, u potpunosti. Fiskalizacija 1.0 (B2C) je uključena u svaki plan. Fiskalizacija 2.0 dolazi Q4 2026.',
    },
    {
      q: 'Mogu li otkazati pretplatu?',
      a: 'Da, bilo kada. Otkazivanjem zaustavljaš sljedeću uplatu, a Kvik koristiš do kraja mjeseca ili godine koju si platio.',
    },
    {
      q: 'Zašto je godišnje jeftinije?',
      a: `Jedna uplata godišnje znači jedan račun i jednu proviziju za karticu umjesto dvanaest, a nama lakše planiranje. Tu uštedu dijelimo s tobom. Usput: paušalistu troškovi ne smanjuju porez, pa ti ostaje svih ${eur(PRICING.annual.savings)} uštede.`,
    },
  ];

  if (promoActive) {
    items.push({
      q: 'Što je PROMO26?',
      a: `Cijena za prve korisnike: tko nam se pridruži u 2026., prvu godinu plaća upola, ${eur(PRICING.promo.annualAmount)} umjesto ${eur(PRICING.annual.amount)}. Na stranici za plaćanje klikni „Dodaj promotivni kôd" i upiši ga. Vrijedi do 31. prosinca 2026.`,
    });
  }

  items.push({
    q: 'Što je s informacijskim posrednikom?',
    a: 'Uključen je u cijenu. Nema API keyeva, nema čekanja na odobrenje ugovora.',
  });

  return items;
}
