/**
 * POST /api/fiscal/certificate/validate
 * Prima: multipart/form-data s poljima p12File (File) i password (string)
 * Vraća: { valid, oib, validFrom, validUntil } ili { valid: false, error }
 * NE sprema u bazu — samo validira.
 */

import { NextResponse } from 'next/server';

import { validateCertificate } from '@/lib/fiscalization/certificate';
import { createClient } from '@/lib/supabase/server';

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

    if (!(file instanceof File) || typeof password !== 'string' || !password) {
      return NextResponse.json(
        { valid: false, error: 'Nedostaje datoteka ili lozinka.' },
        { status: 400 },
      );
    }

    if (!file.name.toLowerCase().endsWith('.p12')) {
      return NextResponse.json(
        { valid: false, error: 'Datoteka mora imati .p12 ekstenziju.' },
        { status: 400 },
      );
    }

    if (file.size > 1024 * 1024) {
      return NextResponse.json(
        { valid: false, error: 'Datoteka ne smije biti veća od 1MB.' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = validateCertificate(buffer, password);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { valid: false, error: 'Greška pri obradi datoteke.' },
      { status: 500 },
    );
  }
}
