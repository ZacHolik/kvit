import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { formatIznosEurHr } from '@/lib/format-hr';

import { PDF_FONT_FAMILY, registerRobotoPdfFont } from './register-roboto';

registerRobotoPdfFont();

const FF = PDF_FONT_FAMILY;

/** Bez rastavljanja riječi (izbjegava krive prijelome tipa „Obrtnička“ → „Obrtni ka“). */
function noHyphenation(word: string): string[] {
  return [word];
}

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    padding: 28,
    fontFamily: FF,
    color: '#111',
  },
  formTitle: {
    fontFamily: FF,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  formSubtitle: {
    fontFamily: FF,
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 14,
    color: '#333',
  },
  section: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  sectionHeader: {
    fontFamily: FF,
    backgroundColor: '#e8e8e8',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 9,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    minHeight: 22,
  },
  rowLast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 0,
    minHeight: 22,
  },
  labelCell: {
    fontFamily: FF,
    width: '62%',
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
  },
  valueCell: {
    fontFamily: FF,
    width: '38%',
    padding: 5,
    textAlign: 'right',
  },
  note: {
    fontFamily: FF,
    fontSize: 7,
    marginTop: 12,
    color: '#444',
    lineHeight: 1.4,
  },
  sectionBOnboardingNote: {
    fontFamily: FF,
    fontSize: 7,
    paddingHorizontal: 5,
    paddingBottom: 5,
    color: '#555',
  },
});

export type PoSdPdfPayload = {
  godina: number;
  nazivObrta: string;
  oib: string;
  adresa: string | null;
  gotovina: number;
  bezgotovinsko: number;
  ukupnoPrimici: number;
  razredLabel: string;
  porezKvartalno: number;
  porezGodisnje: number;
  primiciIzvorOnboardinga?: boolean;
};

export function PoSdDocument({
  godina,
  nazivObrta,
  oib,
  adresa,
  gotovina,
  bezgotovinsko,
  ukupnoPrimici,
  razredLabel,
  porezKvartalno,
  porezGodisnje,
  primiciIzvorOnboardinga = false,
}: PoSdPdfPayload) {
  const godinaPoreza = godina + 1;
  const sectionCTitle = `C — Procjena poreza za ${godinaPoreza}. na osnovu primitaka ${godina}.`;

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.formTitle}>
          PO-SD — Pregled primitaka i paušalnog poreza (informativno)
        </Text>
        <Text style={styles.formSubtitle}>
          Podaci iz KPR-a za kalendarsku godinu {godina}. Službenu prijavu
          podnosi se u ePoreznoj.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>A — Podaci o obvezniku</Text>
          <View style={styles.row}>
            <Text style={styles.labelCell}>Naziv obrta / poslovnog imena</Text>
            <Text style={styles.valueCell}>{nazivObrta || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelCell}>OIB</Text>
            <Text style={styles.valueCell}>{oib || '—'}</Text>
          </View>
          <View style={styles.rowLast}>
            <Text style={styles.labelCell}>Sjedište / adresa</Text>
            <Text
              style={styles.valueCell}
              hyphenationCallback={noHyphenation}
            >
              {adresa?.trim() ? adresa.trim() : '—'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            B — Primitci iz knjige prometa (KPR) za {godina}.
          </Text>
          <View style={styles.row}>
            <Text style={styles.labelCell}>Gotovinski primitci (zbroj KPR)</Text>
            <Text style={styles.valueCell}>
              {formatIznosEurHr(gotovina)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelCell}>
              Bezgotovinski primitci (zbroj KPR)
            </Text>
            <Text style={styles.valueCell}>
              {formatIznosEurHr(bezgotovinsko)}
            </Text>
          </View>
          <View style={styles.rowLast}>
            <Text style={styles.labelCell}>UKUPNO godišnjih primitaka</Text>
            <Text style={[styles.valueCell, { fontWeight: 'bold' }]}>
              {formatIznosEurHr(ukupnoPrimici)}
            </Text>
          </View>
          {primiciIzvorOnboardinga ? (
            <Text style={styles.sectionBOnboardingNote}>
              Podatak iz onboardinga (ručni unos)
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{sectionCTitle}</Text>
          <View style={styles.row}>
            <Text style={styles.labelCell}>Razred (godišnji primitci)</Text>
            <Text style={styles.valueCell}>{razredLabel}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelCell}>Porez po kvartalu (procjena)</Text>
            <Text style={styles.valueCell}>
              {formatIznosEurHr(porezKvartalno)}
            </Text>
          </View>
          <View style={styles.rowLast}>
            <Text style={styles.labelCell}>
              Porez godišnje (4 × kvartal, procjena)
            </Text>
            <Text style={styles.valueCell}>
              {formatIznosEurHr(porezGodisnje)}
            </Text>
          </View>
        </View>

        <Text style={styles.note}>
          Ova isprava je informativna i ne zamjenjuje službeni obrazac PO-SD u
          sustavu ePorezna. Prirez na dohodak ovisi o opcini prebivališta — nije
          uključen. Za sezonski rad, mirovanje obrta ili posebne olakšice koristi
          službene kalkulatore u ePoreznoj.
        </Text>
      </Page>
    </Document>
  );
}
