import { Document, Page, Text, View } from '@react-pdf/renderer';

import { alatiLetterStyles as styles } from './alati-izjave-styles';

export type IzjavaPoslovniProstorFields = {
  nazivObrta: string;
  oib: string;
  adresaObrta: string;
  vlasnikProstora: string;
  adresaProstora: string;
  namjena: string;
  datum: string;
};

export function IzjavaPoslovniProstorDocument(fields: IzjavaPoslovniProstorFields) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>IZJAVA O SUGLASNOSTI — TUĐI POSLOVNI PROSTOR</Text>
        <Text style={styles.meta}>
          {fields.nazivObrta}, OIB {fields.oib}, {fields.datum}
        </Text>
        <Text style={styles.paragraph}>
          Ja, {fields.vlasnikProstora}, kao vlasnik / davaoc u najam poslovnog prostora na
          adresi {fields.adresaProstora}, suglasan/sam suglasna sam da obrt{' '}
          {fields.nazivObrta} sa sjedištem na {fields.adresaObrta} koristi navedeni
          poslovni prostor u svrhu: {fields.namjena}.
        </Text>
        <Text style={styles.paragraph}>
          Suglasnost dajem u skladu s propisima o obrtu i porezu na dohodak te potvrđujem da
          su navedeni podaci točni u trenutku potpisivanja ove izjave.
        </Text>
        <View style={{ marginTop: 40 }}>
          <Text>______________________________</Text>
          <Text style={{ fontSize: 9, marginTop: 4 }}>Potpis vlasnika / davatelja prostora</Text>
        </View>
        <View style={{ marginTop: 28 }}>
          <Text>______________________________</Text>
          <Text style={{ fontSize: 9, marginTop: 4 }}>Potpis obrtnika</Text>
        </View>
        <Text style={styles.footer}>
          Obrasci su informativni. Za službene postupke koristi tekst koji odgovara tvom
          slučaju i uputama tijela uprave.
        </Text>
      </Page>
    </Document>
  );
}
