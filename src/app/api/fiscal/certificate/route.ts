/**
 * POST /api/fiscal/certificate — enkriptira i sprema certifikat
 * GET /api/fiscal/certificate — dohvaća aktivni certifikat (bez encrypted_p12)
 * DELETE /api/fiscal/certificate — soft delete (is_active = false)
 */

import { NextResponse } from 'next/server';

import { validateCertificate } from '@/lib/fiscalization/certificate';
import { encryptCertificate, encryptPassword } from '@/lib/fiscalization/encryption';
import { createClient } from '@/lib/supabase/server';

type ActiveCertRow = {
  fina_oib: string;
  valid_from: string;
  valid_until: string;
  poslovni_prostor: string;
  blagajna: string;
};

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('fiscal_certificates')
    .select('fina_oib, valid_from, valid_until, poslovni_prostor, blagajna')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ exists: false });
  }

  const row = data as ActiveCertRow;
  return NextResponse.json({
    exists: true,
    fina_oib: row.fina_oib,
    valid_from: row.valid_from,
    valid_until: row.valid_until,
    poslovni_prostor: row.poslovni_prostor,
    blagajna: row.blagajna,
  });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('p12File');
    const password = formData.get('password');
    const poslovniRaw = formData.get('poslovniProstor');
    const blagajnaRaw = formData.get('blagajna');
    const poslovniProstor =
      typeof poslovniRaw === 'string' ? poslovniRaw.trim() : '';
    const blagajna = typeof blagajnaRaw === 'string' ? blagajnaRaw.trim() : '';

    if (!(file instanceof File) || typeof password !== 'string' || !password) {
      return NextResponse.json(
        { success: false, error: 'Sva polja su obavezna.' },
        { status: 400 },
      );
    }

    if (!poslovniProstor || !blagajna) {
      return NextResponse.json(
        { success: false, error: 'Sva polja su obavezna.' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const certInfo = validateCertificate(buffer, password);
    if (!certInfo.valid) {
      return NextResponse.json(
        { success: false, error: certInfo.error ?? 'Certifikat nije valjan.' },
        { status: 400 },
      );
    }

    if (!certInfo.oib) {
      return NextResponse.json(
        { success: false, error: 'OIB nije pronađen u certifikatu.' },
        { status: 400 },
      );
    }

    if (!certInfo.validFrom || !certInfo.validUntil) {
      return NextResponse.json(
        { success: false, error: 'Certifikat nema valjan period.' },
        { status: 400 },
      );
    }

    const { encrypted, iv, salt } = encryptCertificate(buffer);
    const encryptedPassword = encryptPassword(password);

    await supabase
      .from('fiscal_certificates')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true);

    const { error } = await supabase.from('fiscal_certificates').insert({
      user_id: user.id,
      encrypted_p12: encrypted,
      iv,
      salt,
      encrypted_password: encryptedPassword,
      fina_oib: certInfo.oib,
      valid_from: certInfo.validFrom.toISOString(),
      valid_until: certInfo.validUntil.toISOString(),
      poslovni_prostor: poslovniProstor,
      blagajna,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      oib: certInfo.oib,
      validUntil: certInfo.validUntil,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Greška pri spremanju certifikata.' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('fiscal_certificates')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
