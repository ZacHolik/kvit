/**
 * Glavni fiskalizacijski servis.
 * Orchestrira: dohvat certifikata → ZKI → CIS → zapis u fiscal_logs.
 *
 * ATOMARNO: ako bilo koji korak padne, vraća success: false.
 * Pozivatelj (API ruta) ne smije označiti račun fiskaliziranim
 * ako je success: false.
 */

import { createClient } from '@/lib/supabase/server';

import { decryptPassword } from './encryption';
import { sendRacunToCIS } from './cis';
import type { FiscalizationResult, NacinPlacanja } from './types';
import { formatDatVrijemeZaCIS, formatIznosZaCIS, generateZki } from './zki';

export type FiscalizeRacunInput = {
  racunId: string;
  userId: string;
  oib: string; // OIB izdavatelja
  brojRacuna: string; // npr. "1/PP1/BL1"
  ukupniIznos: number;
  nacinPlacanja: 'gotovina' | 'ziro' | 'kartica';
  datum?: Date;
  /** PKCS#12 lozinka (ista kao pri uploadu certifikata). */
  p12Password?: string;
};

/**
 * Mapira Kvik nacin plaćanja u CIS kod.
 */
function mapNacinPlacanja(nacin: string): NacinPlacanja {
  switch (nacin) {
    case 'gotovina':
      return 'G';
    case 'kartica':
      return 'K';
    case 'ziro':
      return 'T';
    default:
      return 'O';
  }
}

/**
 * Parsira broj računa u tri komponente.
 * Podržava format: "1/PP1/BL1" ili koristi poslovni prostor iz certifikata.
 */
function parsesBrojRacunaKomponente(
  brojRacuna: string,
  poslovniProstor: string,
  blagajna: string,
): { brOznRac: string; brOznPosPr: string; brOznUr: string } {
  const parts = brojRacuna.split('/');
  if (parts.length >= 3) {
    return {
      brOznRac: parts[0]?.trim() ?? '1',
      brOznPosPr: parts[1]?.trim() ?? poslovniProstor,
      brOznUr: parts[2]?.trim() ?? blagajna,
    };
  }
  return {
    brOznRac: parts[0]?.trim() ?? '1',
    brOznPosPr: poslovniProstor,
    brOznUr: blagajna,
  };
}

type FiscalCertRow = {
  encrypted_p12: string;
  iv: string;
  salt: string;
  encrypted_password: string | null;
  fina_oib: string;
  poslovni_prostor: string;
  blagajna: string;
};

/**
 * Fiskalizira račun.
 * 1. Dohvati certifikat iz baze
 * 2. Generiraj ZKI
 * 3. Pošalji na CIS
 * 4. Zabilježi u fiscal_logs
 * 5. Vrati rezultat
 */
export async function fiscalizeRacun(
  input: FiscalizeRacunInput,
): Promise<FiscalizationResult> {
  const supabase = createClient();
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'test';

  const { data: cert, error: certError } = await supabase
    .from('fiscal_certificates')
    .select(
      'encrypted_p12, iv, salt, encrypted_password, fina_oib, poslovni_prostor, blagajna',
    )
    .eq('user_id', input.userId)
    .eq('is_active', true)
    .maybeSingle();

  if (certError || !cert) {
    return {
      success: false,
      error: 'FINA certifikat nije pronađen. Postavi certifikat u Postavkama.',
      code: 'NO_CERTIFICATE',
    };
  }

  const certRow = cert as FiscalCertRow;

  const p12Password = certRow.encrypted_password
    ? decryptPassword(certRow.encrypted_password)
    : '';

  if (certRow.fina_oib.trim() !== input.oib.trim()) {
    return {
      success: false,
      error: 'OIB na računu ne odgovara OIB-u na FINA certifikatu.',
      code: 'OIB_MISMATCH',
    };
  }

  const datVrijeme = formatDatVrijemeZaCIS(input.datum ?? new Date());
  const iznosUkupno = formatIznosZaCIS(input.ukupniIznos);
  const { brOznRac, brOznPosPr, brOznUr } = parsesBrojRacunaKomponente(
    input.brojRacuna,
    certRow.poslovni_prostor,
    certRow.blagajna,
  );

  const certData = {
    encryptedP12: certRow.encrypted_p12,
    iv: certRow.iv,
    salt: certRow.salt,
    p12Password: input.p12Password ?? p12Password,
  };

  let zki: string;
  try {
    zki = generateZki(
      {
        oib: input.oib,
        datVrijeme,
        brOznRac,
        brOznPosPr,
        brOznUr,
        iznosUkupno,
      },
      certData,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'ZKI greška.';
    await logFiscalResult(supabase, input, null, null, false, message);
    return { success: false, error: message, code: 'ZKI_ERROR' };
  }

  const cisResult = await sendRacunToCIS(
    {
      oib: input.oib,
      uspostavljenoOsiguranje: true,
      datVrijeme,
      brOznRac,
      brOznPosPr,
      brOznUr,
      iznosUkupno,
      nacinPlac: mapNacinPlacanja(input.nacinPlacanja),
      oibOper: input.oib,
      zki,
    },
    certData,
    mode,
  );

  await logFiscalResult(
    supabase,
    input,
    zki,
    cisResult.jir ?? null,
    cisResult.success,
    cisResult.error ?? null,
    cisResult.rawResponse,
  );

  if (!cisResult.success) {
    return {
      success: false,
      error: cisResult.error ?? 'CIS greška.',
      code: 'CIS_ERROR',
    };
  }

  return { success: true, zki, jir: cisResult.jir };
}

async function logFiscalResult(
  supabase: ReturnType<typeof createClient>,
  input: FiscalizeRacunInput,
  zki: string | null,
  jir: string | null,
  success: boolean,
  errorMessage: string | null,
  rawResponse?: string,
) {
  await supabase.from('fiscal_logs').insert({
    user_id: input.userId,
    racun_id: input.racunId,
    zki,
    jir,
    cis_response: rawResponse ?? null,
    success,
    error_message: errorMessage,
  });
}
