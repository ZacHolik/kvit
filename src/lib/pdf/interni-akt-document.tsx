import { Document, Page, Text } from '@react-pdf/renderer';

import { alatiLetterStyles as styles } from './alati-izjave-styles';

export type InterniAktPdfFields = {
  nazivObrta: string;
  oib: string;
  adresa: string;
  djelatnost: string;
  pravilaPoslovanja: string;
  datum: string;
};

export function InterniAktDocument(fields: InterniAktPdfFields) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>INTERNI AKT — PAUŠALNI OBRT</Text>
        <Text style={styles.meta}>
          Obrt: {fields.nazivObrta} · OIB: {fields.oib} · {fields.datum}
        </Text>
        <Text style={styles.label}>1. Opći podaci</Text>
        <Text style={styles.paragraph}>Sjedište: {fields.adresa}</Text>
        <Text style={styles.paragraph}>Opis djelatnosti: {fields.djelatnost}</Text>
        <Text style={styles.label}>2. Poslovna pravila i organizacija</Text>
        <Text style={styles.paragraph}>{fields.pravilaPoslovanja}</Text>
        <Text style={styles.footer}>
          Predložak je informativan. Prilagodi tekst svojoj situaciji i po potrebi
          provjeri s odvjetnikom ili računovođom prije donošenja.
        </Text>
      </Page>
    </Document>
  );
}
