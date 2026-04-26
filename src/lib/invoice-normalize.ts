export type DocumentItemInput = {
  opis: string;
  kolicina: number;
  jedinicnaCijena: number;
};

export type NormalizedDocumentItem = DocumentItemInput & {
  ukupno: number;
};

export function normalizeDocumentItems(
  items: DocumentItemInput[] | undefined,
): NormalizedDocumentItem[] {
  return (items ?? [])
    .map((item) => {
      const kolicina = Number(item.kolicina);
      const jedinicnaCijena = Number(item.jedinicnaCijena);
      return {
        opis: item.opis?.trim() ?? '',
        kolicina,
        jedinicnaCijena,
        ukupno: kolicina * jedinicnaCijena,
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
