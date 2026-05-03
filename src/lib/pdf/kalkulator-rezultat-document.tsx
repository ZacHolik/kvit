import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import type { PausalBracket } from '@/lib/alati/pausal-brackets';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  h1: { fontSize: 16, marginBottom: 12, fontFamily: 'Helvetica-Bold' },
  row: { marginBottom: 6 },
  label: { color: '#444' },
});

type Props = {
  income: number;
  bracket: PausalBracket;
};

/** Sloj 2: jednostavan PDF sažetak kalkulatora (bez mijenjanja računske logike). */
export function KalkulatorRezultatDocument({ income, bracket }: Props) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.h1}>Kvik — kalkulator paušalnog poreza (pregled)</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Godišnji prihod (procjena)</Text>
          <Text>
            {income.toLocaleString('hr-HR')} €
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Porezni razred</Text>
          <Text>{bracket.razred}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Porez mjesečno</Text>
          <Text>
            {bracket.monthly.toLocaleString('hr-HR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Porez kvartalno</Text>
          <Text>
            {bracket.quarterly.toLocaleString('hr-HR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </Text>
        </View>
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 9, color: '#666' }}>
            Informativni izvještaj iz Kvik alata. Nije porezno rješenje.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
