import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    padding: 24,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#555',
  },
  total: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

type InvoicePdfData = {
  brojRacuna: string;
  datum: string;
  status: string;
  nacinPlacanja: string | null;
  ukupniIznos: number;
  napomena: string | null;
  kupacNaziv: string;
  stavke: Array<{
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
    ukupno: number;
  }>;
};

export function InvoiceDocument({
  brojRacuna,
  datum,
  status,
  nacinPlacanja,
  ukupniIznos,
  napomena,
  kupacNaziv,
  stavke,
}: InvoicePdfData) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>Racun #{brojRacuna}</Text>

        <View style={styles.section}>
          <Text>Kupac: {kupacNaziv || '-'}</Text>
          <Text>Datum: {datum}</Text>
          <Text>Status: {status}</Text>
          <Text>Nacin placanja: {nacinPlacanja ?? '-'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ marginBottom: 6 }}>Stavke</Text>
          {stavke.map((stavka, index) => (
            <View style={styles.row} key={`${stavka.opis}-${index}`}>
              <Text style={styles.label}>{stavka.opis}</Text>
              <Text>
                {stavka.kolicina} x {stavka.jedinicnaCijena.toFixed(2)} EUR ={' '}
                {stavka.ukupno.toFixed(2)} EUR
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>Ukupno: {ukupniIznos.toFixed(2)} EUR</Text>
        {napomena ? <Text style={{ marginTop: 8 }}>Napomena: {napomena}</Text> : null}
      </Page>
    </Document>
  );
}
