import { Document, Link, Page, StyleSheet, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Courier' },
  title: { fontSize: 14, marginBottom: 12, fontFamily: 'Helvetica-Bold' },
  powered: { marginTop: 18, fontSize: 8, color: '#999' },
});

/** Sloj 2: tekstualni PDF pregled HUB-3 niza (bez mijenjanja generiranja barkoda). */
export function DoprinosUplataPreviewDocument({ hubCode }: { hubCode: string }) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>Kvik — uplatnica doprinosa (demo HUB-3)</Text>
        <Text>{hubCode}</Text>
        <Link src='https://kvik.online/probaj' style={styles.powered}>
          Izrađeno u Kvik — kvik.online/probaj
        </Link>
      </Page>
    </Document>
  );
}
