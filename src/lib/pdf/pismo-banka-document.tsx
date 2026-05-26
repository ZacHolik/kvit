import { Document, Link, Page, Text, View } from '@react-pdf/renderer';
import { StyleSheet } from '@react-pdf/renderer';

import type { PismoBankaFields } from '@/lib/alati/pismo-banka';
import { generatePismoBankaText } from '@/lib/alati/pismo-banka';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: '2cm',
    color: '#111',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: '2cm',
    left: '2cm',
    right: '2cm',
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  link: {
    color: '#0d9488',
    textDecoration: 'none',
  },
  body: {
    marginBottom: 40,
  },
  line: {
    marginBottom: 6,
  },
});

function textToParagraphs(text: string) {
  return text.split('\n').filter((line, i, arr) => {
    if (line === '' && i === arr.length - 1) {
      return false;
    }
    return true;
  });
}

export function PismoBankaDocument(fields: PismoBankaFields) {
  const fullText = generatePismoBankaText(fields);
  const lines = textToParagraphs(
    fullText.replace(/\nGenerirano na kvik\.online\/alati\/pismo-banka$/, ''),
  );

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.body}>
          {lines.map((line, index) => (
            <Text key={`${index}-${line.slice(0, 12)}`} style={styles.line}>
              {line || ' '}
            </Text>
          ))}
        </View>
        <View style={styles.footer} fixed>
          <Text>
            Generirano na{' '}
            <Link src='https://kvik.online/alati/pismo-banka' style={styles.link}>
              kvik.online/alati/pismo-banka
            </Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
}
