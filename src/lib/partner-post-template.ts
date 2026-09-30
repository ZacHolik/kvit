import { PARTNER_OFFER, PRICING, eur } from '@/config/pricing';

export function buildPartnerPostTemplate(): string {
  return [
    '#oglas',
    '[Jedna ili dvije rečenice o tome što tvoju publiku muči oko paušalnog obrta.]',
    '',
    'Kvik je aplikacija za paušalne obrtnike: [što izdvajaš, npr. računi s fiskalizacijom, knjiga prometa koja se vodi sama ili PO-SD obrazac].',
    '',
    `S mojim kodom [TVOJ KÔD] prva godina Kvika stoji ${eur(PARTNER_OFFER.firstYear)} umjesto ${eur(PRICING.annual.amount)}. Kôd vrijedi za godišnju pretplatu do ${PARTNER_OFFER.endsLabel} i upisuje se na stranici za plaćanje.`,
    '',
    '[tvoj link]',
  ].join('\n');
}
