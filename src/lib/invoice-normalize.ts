export type DocumentItemInput = {
  opis: string;
  kolicina: number;
  jedinicnaCijena: number;
  popust?: number;
};

export type NormalizedDocumentItem = DocumentItemInput & {
  popust: number;
  ukupno: number;
};

export function normalizeDocumentItems(
  items: DocumentItemInput[] | undefined,
): NormalizedDocumentItem[] {
  return (items ?? [])
    .map((item) => {
      const kolicina = Number(item.kolicina);
      const jedinicnaCijena = Number(item.jedinicnaCijena);
      const popust = Math.min(Math.max(Number(item.popust ?? 0) || 0, 0), 100);
      return {
        opis: item.opis?.trim() ?? '',
        kolicina,
        jedinicnaCijena,
        popust,
        ukupno: kolicina * jedinicnaCijena * (1 - popust / 100),
      };
    })
    .filter(
      (item) =>
        item.opis.length > 0 &&
        Number.isFinite(item.kolicina) &&
        item.kolicina > 0 &&
        Number.isFinite(item.jedinicnaCijena) &&
        item.jedinicnaCijena >= 0,
    );
}
