import { Document, Page, Rect, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';

import { PDF_FONT_FAMILY, registerRobotoPdfFont } from './register-roboto';

registerRobotoPdfFont();

const FF = PDF_FONT_FAMILY;

/**
 * HR-style display: "1/1/2026" (redni/broj u godini/godina) → "1-2026".
 * Other values are returned unchanged.
 */
export function formatBrojRacunaZaPdf(broj: string): string {
  const trimmed = broj.trim();
  const m = /^(\d+)\/\d+\/(\d{4})$/.exec(trimmed);
  if (m) {
    return `${m[1]}-${m[2]}`;
  }
  return trimmed;
}

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 36,
    fontFamily: FF,
    color: '#111',
    flexDirection: 'column',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  issuerBlock: {
    maxWidth: '52%',
  },
  issuerName: {
    fontFamily: FF,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  issuerLine: {
    fontFamily: FF,
    fontSize: 9,
    color: '#333',
    marginBottom: 2,
  },
  invoiceMeta: {
    alignItems: 'flex-end',
    maxWidth: '45%',
  },
  docTitle: {
    fontFamily: FF,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  metaLine: {
    fontFamily: FF,
    fontSize: 9,
    marginBottom: 2,
    textAlign: 'right',
  },
  invoiceTypeBadge: {
    fontFamily: FF,
    alignSelf: 'flex-end',
    borderWidth: 0.5,
    borderColor: '#000',
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 6,
    fontSize: 9,
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FF,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  buyerLine: {
    fontFamily: FF,
    fontSize: 9,
    marginBottom: 3,
  },
  metaGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontFamily: FF,
    width: '50%',
    fontSize: 9,
    marginBottom: 4,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginTop: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  colOpis: {
    fontFamily: FF,
    width: '40%',
    paddingRight: 8,
    fontSize: 9,
  },
  colKol: {
    fontFamily: FF,
    width: '12%',
    fontSize: 9,
    textAlign: 'right',
  },
  colJed: {
    fontFamily: FF,
    width: '24%',
    fontSize: 9,
    textAlign: 'right',
  },
  colUkupno: {
    fontFamily: FF,
    width: '24%',
    fontSize: 9,
    textAlign: 'right',
  },
  th: {
    fontFamily: FF,
    fontSize: 9,
    fontWeight: 'bold',
  },
  totalWrap: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: FF,
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 16,
  },
  totalValue: {
    fontFamily: FF,
    fontSize: 11,
    fontWeight: 'bold',
    minWidth: 72,
    textAlign: 'right',
  },
  barcodeWrap: {
    marginTop: 14,
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#bbb',
  },
  barcodeTitle: {
    fontFamily: FF,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  barcodeMeta: {
    fontFamily: FF,
    marginTop: 4,
    fontSize: 8,
    color: '#333',
  },
  napomena: {
    fontFamily: FF,
    marginTop: 12,
    fontSize: 9,
    color: '#333',
    lineHeight: 1.35,
  },
  footer: {
    fontFamily: FF,
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#bbb',
    fontSize: 8,
    color: '#444',
    lineHeight: 1.4,
  },
});

export type InvoiceProfilPdf = {
  nazivObrta: string;
  oib: string;
  adresa: string | null;
  ulica?: string | null;
  postanskiBroj?: string | null;
  grad?: string | null;
  /** Bez razmaka; prikaz samo ako nije prazno. */
  iban: string | null;
};

export type InvoicePdfData = {
  documentTitle?: string;
  brojRacuna: string;
  datum: string;
  datumPlacanja: string | null;
  status: string;
  nacinPlacanja: string | null;
  tipRacuna?: string | null;
  ukupniIznos: number;
  napomena: string | null;
  kupacNaziv: string;
  kupacOib: string | null;
  kupacAdresa: string | null;
  kupacEmail: string | null;
  profil: InvoiceProfilPdf;
  footerText?: string;
  paymentBarcode?: {
    matrix: number[][];
    numCols: number;
    numRows: number;
    iban: string;
    amountEur: number;
    reference: string;
  } | null;
  stavke: Array<{
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
    ukupno: number;
  }>;
};

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    izdano: 'Izdano',
    placeno: 'Plaćeno',
    stornirano: 'Stornirano',
  };
  return map[status] ?? status;
}

function nacinPlacanjaLabel(nacin: string | null): string {
  if (!nacin) {
    return '—';
  }
  const map: Record<string, string> = {
    ziro: 'Žiro',
    gotovina: 'Gotovina',
    kartica: 'Kartica',
  };
  return map[nacin] ?? nacin;
}

function dash(v: string | null | undefined): string {
  const t = v?.trim();
  return t ? t : '—';
}

function issuerAddressLines(profil: InvoiceProfilPdf): string[] {
  const street = profil.ulica?.trim();
  const cityLine = [profil.postanskiBroj?.trim(), profil.grad?.trim()]
    .filter(Boolean)
    .join(' ');

  if (street || cityLine) {
    return [street, cityLine].filter((line): line is string => Boolean(line));
  }

  return profil.adresa?.trim() ? [profil.adresa.trim()] : [];
}

export function InvoiceDocument({
  documentTitle = 'Račun',
  brojRacuna,
  datum,
  datumPlacanja,
  status,
  nacinPlacanja,
  tipRacuna,
  ukupniIznos,
  napomena,
  kupacNaziv,
  kupacOib,
  kupacAdresa,
  kupacEmail,
  profil,
  footerText = 'Sukladno članku 90. Zakona o porezu na dodanu vrijednost,\nizdavatelj računa nije u sustavu PDV-a te PDV nije obračunat.',
  paymentBarcode,
  stavke,
}: InvoicePdfData) {
  const brojZaPrikaz = formatBrojRacunaZaPdf(brojRacuna);
  const ibanZaPrikaz = profil.iban?.replace(/\s/g, '').trim();
  const issuerLines = issuerAddressLines(profil);

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.topRow}>
          {/* Izdavatelj — podaci iz Supabase profiles */}
          <View style={styles.issuerBlock}>
            <Text style={styles.issuerName}>{dash(profil.nazivObrta)}</Text>
            {issuerLines.map((line) => (
              <Text style={styles.issuerLine} key={line}>
                {line}
              </Text>
            ))}
            <Text style={styles.issuerLine}>OIB: {dash(profil.oib)}</Text>
            {ibanZaPrikaz ? (
              <Text style={styles.issuerLine}>IBAN: {ibanZaPrikaz}</Text>
            ) : null}
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.docTitle}>{documentTitle}</Text>
            {tipRacuna && tipRacuna !== 'bez_oznake' ? (
              <Text style={styles.invoiceTypeBadge}>{tipRacuna}</Text>
            ) : null}
            <Text style={styles.metaLine}>Broj: {brojZaPrikaz}</Text>
            <Text style={styles.metaLine}>Datum: {formatDatumHr(datum)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Kupac */}
        <Text style={styles.sectionTitle}>Kupac</Text>
        <Text style={styles.buyerLine}>{dash(kupacNaziv)}</Text>
        <Text style={styles.buyerLine}>OIB: {dash(kupacOib)}</Text>
        <Text style={styles.buyerLine}>{dash(kupacAdresa)}</Text>
        <Text style={styles.buyerLine}>E-mail: {dash(kupacEmail)}</Text>

        <View style={styles.metaGrid}>
          <Text style={styles.metaItem}>Status: {statusLabel(status)}</Text>
          <Text style={styles.metaItem}>
            Način plaćanja: {nacinPlacanjaLabel(nacinPlacanja)}
          </Text>
          {datumPlacanja ? (
            <Text style={styles.metaItem}>
              Datum plaćanja: {formatDatumHr(datumPlacanja)}
            </Text>
          ) : null}
        </View>

        {/* Stavke — tablica */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colOpis, styles.th]}>Opis</Text>
          <Text style={[styles.colKol, styles.th]}>Količina</Text>
          <Text style={[styles.colJed, styles.th]}>Jed. cijena</Text>
          <Text style={[styles.colUkupno, styles.th]}>Ukupno</Text>
        </View>
        {stavke.map((stavka, index) => (
          <View style={styles.tableRow} key={`${stavka.opis}-${index}`}>
            <Text style={styles.colOpis}>{stavka.opis}</Text>
            <Text style={styles.colKol}>{stavka.kolicina}</Text>
            <Text style={styles.colJed}>
              {formatIznosEurHr(stavka.jedinicnaCijena)}
            </Text>
            <Text style={styles.colUkupno}>
              {formatIznosEurHr(stavka.ukupno)}
            </Text>
          </View>
        ))}

        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>UKUPNO</Text>
          <Text style={styles.totalValue}>
            {formatIznosEurHr(ukupniIznos)}
          </Text>
        </View>

        {paymentBarcode ? (
          <View style={styles.barcodeWrap}>
            <Text style={styles.barcodeTitle}>Barkod za plaćanje</Text>
            <Svg
              width={260}
              height={78}
              viewBox={`0 0 ${paymentBarcode.numCols} ${paymentBarcode.numRows}`}
            >
              {paymentBarcode.matrix.flatMap((row, rowIndex) => {
                const rects: React.ReactElement[] = [];
                let start: number | null = null;
                row.forEach((cell, colIndex) => {
                  if (cell === 1 && start === null) {
                    start = colIndex;
                  }
                  const atEnd = colIndex === row.length - 1;
                  if ((cell !== 1 || atEnd) && start !== null) {
                    const end = cell === 1 && atEnd ? colIndex + 1 : colIndex;
                    rects.push(
                      <Rect
                        key={`${rowIndex}-${start}`}
                        x={start}
                        y={rowIndex}
                        width={end - start}
                        height={1}
                        fill='#000'
                      />,
                    );
                    start = null;
                  }
                });
                return rects;
              })}
            </Svg>
            <Text style={styles.barcodeMeta}>IBAN: {paymentBarcode.iban}</Text>
            <Text style={styles.barcodeMeta}>
              Iznos: {formatIznosEurHr(paymentBarcode.amountEur)}
            </Text>
            <Text style={styles.barcodeMeta}>
              Poziv na broj: {paymentBarcode.reference}
            </Text>
          </View>
        ) : null}

        {napomena ? (
          <Text style={styles.napomena}>Napomena: {napomena}</Text>
        ) : null}

        <Text style={styles.footer}>{footerText}</Text>
      </Page>
    </Document>
  );
}
