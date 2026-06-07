import { NextResponse } from 'next/server';

import { fiscalizeRacun } from '@/lib/fiscalization/fiscalize';
import { resolvePpNuForFiscal } from '@/lib/fiscalization/resolve-pp-nu';
import type { FiscalizationResult } from '@/lib/fiscalization/types';
import { normalizeDocumentItems } from '@/lib/invoice-normalize';
import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import { createClient } from '@/lib/supabase/server';

type InvoicePayload = {
  brojRacuna: string;
  datum: string;
  datumPlacanja?: string;
  nacinPlacanja: 'ziro' | 'gotovina' | 'kartica';
  status: 'izdano' | 'placeno' | 'stornirano';
  tipRacuna?: 'R1' | 'R2' | 'bez_oznake';
  napomena?: string;
  dodajBarkodPlacanja?: boolean;
  recurring?: boolean;
  recurringInterval?: 'mjesecno' | 'kvartalno' | 'godisnje';
  popustRacun?: number;
  rokPlacanja?: string;
  datumDospijeca?: string;
  dostava?: {
    enabled?: boolean;
    opis?: string;
    iznos?: number;
  };
  kupac: {
    naziv: string;
    oib?: string;
    adresa?: string;
    email?: string;
  };
  items?: Array<{
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
    popust?: number;
  }>;
  /** Backward compatibility for any older clients still sending one row. */
  stavka?: {
    opis: string;
    kolicina: number;
    jedinicnaCijena: number;
    popust?: number;
  };
};

async function sendFiscalConfirmEmail(opts: {
  to: string;
  brojRacuna: string;
  jir: string;
  zki: string;
  iznos: number;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !opts.to?.trim()) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:
        process.env.RESEND_FROM_EMAIL ??
        'Kvik <noreply@kvik.online>',
      to: [opts.to.trim()],
      subject: `✓ Račun ${opts.brojRacuna} fiskaliziran`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
          <h2 style="color:#0d9488">Račun fiskaliziran</h2>
          <p>Račun <strong>${opts.brojRacuna}</strong> uspješno je fiskaliziran
          i poslan na Poreznu upravu.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr>
              <td style="padding:8px 0;color:#666;width:40%">JIR</td>
              <td style="padding:8px 0;font-family:monospace;font-size:13px">
                ${opts.jir}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666">ZKI</td>
              <td style="padding:8px 0;font-family:monospace;font-size:13px">
                ${opts.zki}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666">Iznos</td>
              <td style="padding:8px 0;font-weight:bold">
                ${opts.iznos.toFixed(2).replace('.', ',')} EUR
              </td>
            </tr>
          </table>
          <p style="color:#666;font-size:13px">
            JIR i ZKI su tiskani i na PDF-u računa.<br>
            Ako imaš pitanja, piši na
            <a href="mailto:podrska@kvik.hr">podrska@kvik.hr</a>.
          </p>
        </div>
      `,
    }),
  }).catch((err) => console.error('Fiscal confirm email error', err));
}

async function upsertCatalogItem(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  item: ReturnType<typeof normalizeDocumentItems>[number],
) {
  const { data: existing } = await supabase
    .from('artikli')
    .select('id')
    .eq('user_id', userId)
    .ilike('naziv', item.opis)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('artikli')
      .update({ jedinicna_cijena: item.jedinicnaCijena })
      .eq('id', existing.id)
      .eq('user_id', userId);
    return;
  }

  await supabase.from('artikli').insert({
    user_id: userId,
    naziv: item.opis,
    jedinicna_cijena: item.jedinicnaCijena,
  });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const body = (await request.json()) as InvoicePayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = normalizeDocumentItems(
    Array.isArray(body.items) ? body.items : body.stavka ? [body.stavka] : [],
  );
  if (items.length === 0) {
    return NextResponse.json(
      { error: 'Dodaj barem jednu ispravnu stavku računa.' },
      { status: 400 },
    );
  }

  const kupacNaziv = body.kupac.naziv.trim();
  if (!kupacNaziv) {
    return NextResponse.json({ error: 'Naziv kupca je obavezan.' }, { status: 400 });
  }
  const tipRacuna = body.tipRacuna ?? 'R1';
  if (!['R1', 'R2', 'bez_oznake'].includes(tipRacuna)) {
    return NextResponse.json({ error: 'Tip računa nije ispravan.' }, { status: 400 });
  }
  if (tipRacuna === 'R1' && !body.kupac.oib?.trim()) {
    return NextResponse.json(
      { error: 'R1 račun zahtijeva OIB kupca.' },
      { status: 400 },
    );
  }
  const recurring = body.recurring === true;
  const recurringInterval: InvoicePayload['recurringInterval'] | null = recurring
    ? (body.recurringInterval ?? 'mjesecno')
    : null;
  if (
    recurring &&
    (!recurringInterval ||
      !['mjesecno', 'kvartalno', 'godisnje'].includes(recurringInterval))
  ) {
    return NextResponse.json(
      { error: 'Interval ponavljanja nije ispravan.' },
      { status: 400 },
    );
  }

  const popustRacun = Math.min(Math.max(Number(body.popustRacun ?? 0) || 0, 0), 100);
  const meduzbroj = items.reduce((sum, item) => sum + item.ukupno, 0);
  const popustRacunIznos = meduzbroj * (popustRacun / 100);
  const dostavaIznos =
    body.dostava?.enabled === true
      ? Math.max(Number(body.dostava.iznos ?? 0) || 0, 0)
      : 0;
  const dostavaOpis =
    body.dostava?.enabled === true
      ? body.dostava.opis?.trim() || 'Troškovi dostave'
      : null;
  const ukupno = Math.max(meduzbroj - popustRacunIznos + dostavaIznos, 0);

  const brojRacunaRaw = body.brojRacuna?.trim() ?? '';
  if (!brojRacunaRaw) {
    return NextResponse.json({ error: 'Broj računa je obavezan.' }, { status: 400 });
  }

  const { data: existingKupac } = await supabase
    .from('kupci')
    .select('id')
    .eq('user_id', user.id)
    .ilike('naziv', kupacNaziv)
    .maybeSingle();

  const kupacPayload = {
    user_id: user.id,
    naziv: kupacNaziv,
    oib: body.kupac.oib?.trim() || null,
    adresa: body.kupac.adresa?.trim() || null,
    email: body.kupac.email?.trim() || null,
  };

  const kupacMutation = existingKupac
    ? supabase
        .from('kupci')
        .update(kupacPayload)
        .eq('id', existingKupac.id)
        .eq('user_id', user.id)
        .select('id')
        .single()
    : supabase.from('kupci').insert(kupacPayload).select('id').single();

  const { data: kupac, error: kupacError } = await kupacMutation;

  if (kupacError || !kupac) {
    return NextResponse.json(
      { error: kupacError?.message || 'Kupac nije spremljen.' },
      { status: 400 },
    );
  }

  await Promise.all(items.map((item) => upsertCatalogItem(supabase, user.id, item)));

  const [{ data: profil }, { data: fiscalCert }] = await Promise.all([
    supabase.from('profiles').select('oib').eq('id', user.id).maybeSingle(),
    supabase
      .from('fiscal_certificates')
      .select('id, poslovni_prostor, blagajna')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle(),
  ]);

  let brojRacunaZaUnos = brojRacunaRaw;
  if (fiscalCert && profil?.oib?.trim()) {
    const resolved = await resolvePpNuForFiscal(supabase, user.id, {
      poslovni_prostor: String(fiscalCert.poslovni_prostor ?? ''),
      blagajna: String(fiscalCert.blagajna ?? ''),
    });
    if ('error' in resolved) {
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }
    const pp = resolved.poslovniProstor;
    const nu = resolved.blagajna;
    const datumD = new Date(`${body.datum.slice(0, 10)}T12:00:00`);
    const godina = Number.isFinite(datumD.getTime())
      ? datumD.getFullYear()
      : new Date().getFullYear();
    const { data: nextNum, error: rpcErr } = await supabase.rpc('bump_invoice_counter', {
      p_user_id: user.id,
      p_poslovni_prostor: pp,
      p_blagajna: nu,
      p_godina: godina,
    });
    if (!rpcErr && nextNum != null) {
      brojRacunaZaUnos = `${nextNum}/${pp}/${nu}`;
    }
  }

  const { data: racun, error: racunError } = await supabase
    .from('racuni')
    .insert({
      user_id: user.id,
      kupac_id: kupac.id,
      broj_racuna: brojRacunaZaUnos,
      datum: body.datum,
      datum_placanja: body.datumPlacanja || null,
      nacin_placanja: body.nacinPlacanja,
      ukupni_iznos: ukupno,
      status: body.status,
      tip_racuna: tipRacuna,
      popust_racun: popustRacun,
      rok_placanja: body.rokPlacanja || '15 dana',
      datum_dospijeca: body.datumDospijeca || null,
      dostava_iznos: dostavaIznos,
      dostava_opis: dostavaOpis,
      napomena: body.napomena || null,
      recurring,
      recurring_interval: recurringInterval,
      barkod_enabled:
        body.nacinPlacanja === 'ziro' ? body.dodajBarkodPlacanja !== false : false,
      dodaj_barkod_placanja:
        body.nacinPlacanja === 'ziro' ? body.dodajBarkodPlacanja !== false : false,
    })
    .select('id, broj_racuna')
    .single();

  if (racunError) {
    return NextResponse.json({ error: racunError.message }, { status: 400 });
  }

  const { error: stavkaError } = await supabase.from('invoice_items').insert(
    items.map((item) => ({
      racun_id: racun.id,
      opis: item.opis,
      kolicina: item.kolicina,
      jedinicna_cijena: item.jedinicnaCijena,
      popust: item.popust,
      ukupno: item.ukupno,
    })),
  );

  if (stavkaError) {
    return NextResponse.json({ error: stavkaError.message }, { status: 400 });
  }

  let fiscalResult: FiscalizationResult | undefined;

  if (fiscalCert && profil?.oib?.trim()) {
    fiscalResult = await fiscalizeRacun({
      racunId: racun.id,
      userId: user.id,
      oib: profil.oib.trim(),
      brojRacuna: racun.broj_racuna,
      ukupniIznos: ukupno,
      nacinPlacanja: body.nacinPlacanja,
    });

    if (fiscalResult.success) {
      await supabase
        .from('racuni')
        .update({
          zki: fiscalResult.zki,
          jir: fiscalResult.jir,
          fiskalizirano_at: new Date().toISOString(),
        })
        .eq('id', racun.id)
        .eq('user_id', user.id);

      void sendFiscalConfirmEmail({
        to: user.email ?? '',
        brojRacuna: racun.broj_racuna,
        jir: fiscalResult.jir ?? '',
        zki: fiscalResult.zki ?? '',
        iznos: ukupno,
      });
    } else {
      await supabase
        .from('racuni')
        .update({
          fiskalizacija_error: fiscalResult.error ?? 'Nepoznata greška',
        })
        .eq('id', racun.id)
        .eq('user_id', user.id);
    }
  }

  // TODO: Support multiple KPR entries per invoice for split payments in future.
  if (body.status === 'placeno') {
    const paymentDate = body.datumPlacanja || body.datum;
    const isCash = body.nacinPlacanja === 'gotovina';

    await supabase.from('kpr_unosi').insert({
      user_id: user.id,
      racun_id: racun.id,
      datum: paymentDate,
      broj_temeljnice: racun.broj_racuna,
      opis: opisAutomatskogKprUnosaZaRacun(racun.broj_racuna),
      iznos_gotovina: isCash ? ukupno : 0,
      iznos_bezgotovinsko: isCash ? 0 : ukupno,
      ukupno,
    });
  }

  return NextResponse.json({
    id: racun.id,
    brojRacuna: racun.broj_racuna,
    fiskalizirano: fiscalResult?.success ?? false,
    jir: fiscalResult?.jir ?? null,
    fiskalError:
      fiscalResult?.success === false ? (fiscalResult.error ?? null) : null,
  });
}
