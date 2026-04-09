import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 24,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingVertical: 4,
  },
  colDate: { width: '16%' },
  colDoc: { width: '22%' },
  colDesc: { width: '30%' },
  colNum: { width: '16%', textAlign: 'right' },
});

type KprItem = {
  datum: string;
  brojTemeljnice: string;
  opis: string;
  gotovina: number;
  bezgotovinsko: number;
  ukupno: number;
};

export function KprDocument({
  title,
  items,
}: {
  title: string;
  items: KprItem[];
}) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.headerRow}>
          <Text style={styles.colDate}>Datum</Text>
          <Text style={styles.colDoc}>Temeljnica</Text>
          <Text style={styles.colDesc}>Opis</Text>
          <Text style={styles.colNum}>Got.</Text>
          <Text style={styles.colNum}>Bezgot.</Text>
          <Text style={styles.colNum}>Ukupno</Text>
        </View>

        {items.map((item, index) => (
          <View style={styles.row} key={`${item.brojTemeljnice}-${index}`}>
            <Text style={styles.colDate}>{item.datum}</Text>
            <Text style={styles.colDoc}>{item.brojTemeljnice}</Text>
            <Text style={styles.colDesc}>{item.opis}</Text>
            <Text style={styles.colNum}>{item.gotovina.toFixed(2)}</Text>
            <Text style={styles.colNum}>{item.bezgotovinsko.toFixed(2)}</Text>
            <Text style={styles.colNum}>{item.ukupno.toFixed(2)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
