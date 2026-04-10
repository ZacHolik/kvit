import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { formatDatumHr, formatIznosEurHr } from '@/lib/format-hr';

import { PDF_FONT_FAMILY, registerRobotoPdfFont } from './register-roboto';

registerRobotoPdfFont();

const FF = PDF_FONT_FAMILY;

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    paddingTop: 36,
    paddingHorizontal: 32,
    paddingBottom: 36,
    fontFamily: FF,
    color: '#111',
  },
  issuerName: {
    fontFamily: FF,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  issuerLine: {
    fontFamily: FF,
    fontSize: 8,
    color: '#333',
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 10,
    marginBottom: 10,
  },
  docTitle: {
    fontFamily: FF,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 4,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 3,
  },
  colDate: { width: '14%', fontFamily: FF, fontSize: 8, paddingRight: 4 },
  colDoc: { width: '18%', fontFamily: FF, fontSize: 8, paddingRight: 4 },
  colDesc: { width: '32%', fontFamily: FF, fontSize: 8, paddingRight: 4 },
  colNum: {
    width: '12%',
    fontFamily: FF,
    fontSize: 8,
    textAlign: 'right',
  },
  th: {
    fontFamily: FF,
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export type KprProfilPdf = {
  nazivObrta: string;
  oib: string;
  adresa: string | null;
};

type KprItem = {
  datum: string;
  brojTemeljnice: string;
  opis: string;
  gotovina: number;
  bezgotovinsko: number;
  ukupno: number;
};

function dash(v: string | null | undefined): string {
  const t = v?.trim();
  return t ? t : '—';
}

export function KprDocument({
  profil,
  godina,
  items,
}: {
  profil: KprProfilPdf;
  godina: number;
  items: KprItem[];
}) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Zaglavlje — profil iz Supabase */}
        <Text style={styles.issuerName}>{dash(profil.nazivObrta)}</Text>
        <Text style={styles.issuerLine}>OIB: {dash(profil.oib)}</Text>
        <Text style={styles.issuerLine}>{dash(profil.adresa)}</Text>

        <View style={styles.divider} />

        <Text style={styles.docTitle}>Knjiga prometa - {godina}.</Text>

        <View style={styles.headerRow}>
          <Text style={[styles.colDate, styles.th]}>Datum</Text>
          <Text style={[styles.colDoc, styles.th]}>Temeljnica</Text>
          <Text style={[styles.colDesc, styles.th]}>Opis</Text>
          <Text style={[styles.colNum, styles.th]}>Gotovina</Text>
          <Text style={[styles.colNum, styles.th]}>Bezgotovinsko</Text>
          <Text style={[styles.colNum, styles.th]}>Ukupno</Text>
        </View>

        {items.map((item, index) => (
          <View style={styles.row} key={`${item.brojTemeljnice}-${index}`}>
            <Text style={styles.colDate}>{formatDatumHr(item.datum)}</Text>
            <Text style={styles.colDoc}>{item.brojTemeljnice}</Text>
            <Text style={styles.colDesc}>{item.opis}</Text>
            <Text style={styles.colNum}>{formatIznosEurHr(item.gotovina)}</Text>
            <Text style={styles.colNum}>
              {formatIznosEurHr(item.bezgotovinsko)}
            </Text>
            <Text style={styles.colNum}>{formatIznosEurHr(item.ukupno)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
