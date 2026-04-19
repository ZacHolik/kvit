import { Document, Page, Text, View } from '@react-pdf/renderer';

import { alatiLetterStyles as styles } from './alati-izjave-styles';

export type IzjavaPozajmnicaFields = {
  nazivObrta: string;
  oib: string;
  adresaObrta: string;
  vlasnikImovine: string;
  predmetPozajmice: string;
  datum: string;
};

export function IzjavaPozajmnicaDocument(fields: IzjavaPozajmnicaFields) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>IZJAVA O POZAJMICI VLASNIKA</Text>
        <Text style={styles.meta}>
          {fields.nazivObrta}, OIB {fields.oib}, {fields.datum}
        </Text>
        <Text style={styles.paragraph}>
          Ja, {fields.vlasnikImovine}, kao vlasnik predmeta {fields.predmetPozajmice}, ovime
          potvrđujem da isti predmet pozajmljujem obrtu {fields.nazivObrta} sa sjedištem na{' '}
          {fields.adresaObrta} radi obavljanja registrirane djelatnosti, bez naknade /
          uz dogovorenu naknadu (dopuni po stvarnom dogovoru).
        </Text>
        <Text style={styles.paragraph}>
          Obrt se obvezuje koristiti predmet pozajmice u skladu s propisima i vratiti ga na
          zahtjev vlasnika, osim ako je drugačije ugovoreno.
        </Text>
        <View style={{ marginTop: 40 }}>
          <Text>______________________________</Text>
          <Text style={{ fontSize: 9, marginTop: 4 }}>Potpis vlasnika imovine</Text>
        </View>
        <View style={{ marginTop: 28 }}>
          <Text>______________________________</Text>
          <Text style={{ fontSize: 9, marginTop: 4 }}>Potpis obrtnika</Text>
        </View>
        <Text style={styles.footer}>
          Predložak za internu dokumentaciju. Prilagodi formulacije i posavjetuj se s
          stručnjakom ako je predmet visoke vrijednosti ili dugoročan.
        </Text>
      </Page>
    </Document>
  );
}
