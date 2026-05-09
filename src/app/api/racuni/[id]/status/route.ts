import { NextResponse } from 'next/server';

import { fiscalizeRacun } from '@/lib/fiscalization/fiscalize';
import { opisAutomatskogKprUnosaZaRacun } from '@/lib/kpr-export';
import { createClient } from '@/lib/supabase/server';

type StatusPayload = {
  status: 'izdano' | 'placeno' | 'stornirano';
  datumPlacanja?: string;
};

type RacunRow = {
  id: string;
  broj_racuna: string;
  ukupni_iznos: number | string;
  nacin_placanja: string;
  datum: string;
  datum_placanja: string | null;
  status: string;
  tip_dokumenta?: string | null;
  jir: string | null;
  kupac_id: string;
  tip_racuna: string | null;
  popust_racun: number | string | null;
  rok_placanja: string | null;
  datum_dospijeca: string | null;
  dostava_iznos: number | string | null;
  dostava_opis: string | null;
  napomena: string | null;
  recurring: boolean | null;
  recurring_interval: string | null;
  barkod_enabled: boolean | null;
  dodaj_barkod_placanja: boolean | null;
};

type ItemRow = {
  opis: string;
  kolicina: number | string;
  jedinicna_cijena: number | string;
  popust: number | string | null;
  ukupno: number | string;
};

function opisStornoKprUnosaZaRacun(brojRacuna: string) {
  return `Storno računa ${brojRacuna}`;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const body = (await request.json()) as StatusPayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: invoice, error: invoiceError } = await supabase
    .from('racuni')
    .select(
      [
        'id',
        'broj_racuna',
        'ukupni_iznos',
        'nacin_placanja',
        'datum',
        'datum_placanja',
        'status',
        'tip_dokumenta',
        'jir',
        'kupac_id',
        'tip_racuna',
        'popust_racun',
        'rok_placanja',
        'datum_dospijeca',
        'dostava_iznos',
        'dostava_opis',
        'napomena',
        'recurring',
        'recurring_interval',
        'barkod_enabled',
        'dodaj_barkod_placanja',
      ].join(', '),
    )
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: 'Racun nije pronaden.' }, { status: 404 });
  }

  const inv = invoice as unknown as RacunRow;
  const tipDok = inv.tip_dokumenta ?? 'racun';

  if (body.status === 'stornirano') {
    if (inv.status === 'stornirano') {
      return NextResponse.json({ error: 'Račun je već storniran.' }, { status: 400 });
    }
    if (tipDok === 'storno') {
      return NextResponse.json(
        { error: 'Storno dokument se ne može ponovo stornirati.' },
        { status: 400 },
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from('invoice_items')
      .select('opis, kolicina, jedinicna_cijena, popust, ukupno')
      .eq('racun_id', inv.id);

    if (itemsError || !items?.length) {
      return NextResponse.json(
        { error: 'Račun nema stavki za storno.' },
        { status: 400 },
      );
    }

    const itemRows = items as ItemRow[];
    const ukupnoOrig = Number(inv.ukupni_iznos);
    const ukupnoStorno = -Math.abs(ukupnoOrig);
    const dostavaOrig = Number(inv.dostava_iznos ?? 0);
    const dostavaStorno = dostavaOrig !== 0 ? -Math.abs(dostavaOrig) : 0;
    const datumStorno = new Date().toISOString().slice(0, 10);
    const napomenaStorno = `Storno računa br. ${inv.broj_racuna}`;

    const [{ data: profil }, { data: fiscalCert }] = await Promise.all([
      supabase.from('profiles').select('oib').eq('id', user.id).maybeSingle(),
      supabase
        .from('fiscal_certificates')
        .select('id, poslovni_prostor, blagajna')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle(),
    ]);

    let brojRacunaStorno: string;
    if (fiscalCert) {
      const pp = String(fiscalCert.poslovni_prostor ?? '').trim();
      const nu = String(fiscalCert.blagajna ?? '').trim();
      const datumD = new Date(`${datumStorno}T12:00:00`);
      const godina = Number.isFinite(datumD.getTime())
        ? datumD.getFullYear()
        : new Date().getFullYear();
      const { data: nextNum, error: rpcErr } = await supabase.rpc('bump_invoice_counter', {
        p_user_id: user.id,
        p_poslovni_prostor: pp,
        p_blagajna: nu,
        p_godina: godina,
      });
      if (rpcErr || nextNum == null) {
        return NextResponse.json(
          { error: rpcErr?.message ?? 'Brojač računa nije dostupan.' },
          { status: 400 },
        );
      }
      brojRacunaStorno = `${nextNum}/${pp}/${nu}`;
    } else {
      brojRacunaStorno = `ST-${inv.id.slice(0, 8)}`;
    }

    const { data: stornoRacun, error: insertRacunErr } = await supabase
      .from('racuni')
      .insert({
        user_id: user.id,
        kupac_id: inv.kupac_id,
        broj_racuna: brojRacunaStorno,
        datum: datumStorno,
        datum_placanja: null,
        nacin_placanja: inv.nacin_placanja,
        ukupni_iznos: ukupnoStorno,
        status: 'izdano',
        tip_racuna: inv.tip_racuna ?? 'R1',
        popust_racun: Number(inv.popust_racun ?? 0),
        rok_placanja: inv.rok_placanja,
        datum_dospijeca: inv.datum_dospijeca,
        dostava_iznos: dostavaStorno,
        dostava_opis: inv.dostava_opis,
        napomena: napomenaStorno,
        recurring: false,
        recurring_interval: null,
        barkod_enabled: false,
        dodaj_barkod_placanja: false,
        tip_dokumenta: 'storno',
        storniran_od: inv.id,
      })
      .select('id')
      .single();

    if (insertRacunErr || !stornoRacun) {
      return NextResponse.json(
        { error: insertRacunErr?.message ?? 'Storno račun nije kreiran.' },
        { status: 400 },
      );
    }

    const stornoId = stornoRacun.id as string;

    const negItems = itemRows.map((row) => ({
      racun_id: stornoId,
      opis: row.opis,
      kolicina: -Math.abs(Number(row.kolicina)),
      jedinicna_cijena: Number(row.jedinicna_cijena),
      popust: Number(row.popust ?? 0),
      ukupno: -Math.abs(Number(row.ukupno)),
    }));

    const { error: insertItemsErr } = await supabase.from('invoice_items').insert(negItems);

    if (insertItemsErr) {
      await supabase.from('racuni').delete().eq('id', stornoId).eq('user_id', user.id);
      return NextResponse.json({ error: insertItemsErr.message }, { status: 400 });
    }

    const jirOrig = inv.jir?.trim() ?? '';
    const shouldFiscalize = Boolean(fiscalCert && profil?.oib?.trim() && jirOrig);

    if (shouldFiscalize) {
      const fiscalResult = await fiscalizeRacun({
        racunId: stornoId,
        userId: user.id,
        oib: profil!.oib!.trim(),
        brojRacuna: brojRacunaStorno,
        ukupniIznos: ukupnoStorno,
        nacinPlacanja: inv.nacin_placanja as 'gotovina' | 'ziro' | 'kartica',
        datum: new Date(`${datumStorno}T12:00:00`),
      });

      if (!fiscalResult.success) {
        await supabase.from('racuni').delete().eq('id', stornoId).eq('user_id', user.id);
        return NextResponse.json(
          { error: fiscalResult.error ?? 'CIS fiskalizacija storna nije uspjela.' },
          { status: 400 },
        );
      }

      await supabase
        .from('racuni')
        .update({
          zki: fiscalResult.zki,
          jir: fiscalResult.jir,
          fiskalizirano_at: new Date().toISOString(),
          fiskalizacija_error: null,
        })
        .eq('id', stornoId)
        .eq('user_id', user.id);
    }

    const { error: updateOrigErr } = await supabase
      .from('racuni')
      .update({
        status: 'stornirano',
        datum_placanja: null,
      })
      .eq('id', inv.id)
      .eq('user_id', user.id);

    if (updateOrigErr) {
      return NextResponse.json({ error: updateOrigErr.message }, { status: 400 });
    }

    const isCash = inv.nacin_placanja === 'gotovina';
    const amount = ukupnoOrig * -1;
    await supabase.from('kpr_unosi').insert({
      user_id: user.id,
      racun_id: inv.id,
      datum: datumStorno,
      broj_temeljnice: `STORNO ${inv.broj_racuna}`,
      opis: opisStornoKprUnosaZaRacun(inv.broj_racuna),
      iznos_gotovina: isCash ? amount : 0,
      iznos_bezgotovinsko: isCash ? 0 : amount,
      ukupno: amount,
    });

    return NextResponse.json({ success: true, stornoRacunId: stornoId });
  }

  const { error: updateError } = await supabase
    .from('racuni')
    .update({
      status: body.status,
      datum_placanja: body.status === 'placeno' ? body.datumPlacanja || inv.datum : null,
    })
    .eq('id', inv.id)
    .eq('user_id', user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  if (body.status === 'placeno' && inv.status !== 'placeno') {
    const { data: existing } = await supabase
      .from('kpr_unosi')
      .select('id')
      .eq('user_id', user.id)
      .eq('racun_id', inv.id)
      .maybeSingle();

    if (!existing) {
      const isCash = inv.nacin_placanja === 'gotovina';
      await supabase.from('kpr_unosi').insert({
        user_id: user.id,
        racun_id: inv.id,
        datum: body.datumPlacanja || inv.datum,
        broj_temeljnice: inv.broj_racuna,
        opis: opisAutomatskogKprUnosaZaRacun(inv.broj_racuna),
        iznos_gotovina: isCash ? Number(inv.ukupni_iznos) : 0,
        iznos_bezgotovinsko: isCash ? 0 : Number(inv.ukupni_iznos),
        ukupno: Number(inv.ukupni_iznos),
      });
    }
  }

  return NextResponse.json({ success: true });
}
