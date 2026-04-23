import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/** Sažeta interna knowledge base (Kvit vodiči/alati); bez vanjskih konkurentnih portala. */
const SYSTEM_PROMPT = `Ti si Kvit AI asistent za hrvatske paušalne obrtnike.

JEZIK I TON:
- Odgovaraj ISKLJUČIVO na hrvatskom standardnom jeziku
- NIKAD ne koristi srpske izraze: "desiti" → "dogoditi",
  "DDV" → "PDV", "firma" → "tvrtka/obrt", "ukoliko" → "ako",
  "takođe" → "također", "iznos" ostaje iznos
- NIKAD ne koristi ćirilično pismo
- Budi konkretan, praktičan i prijateljski
- Nikad ne izmišljaj informacije - ako nešto ne znaš, reci to
- Ne davaj pravne ni porezne savjete - usmjeri na stručnjaka

TOČNE INFORMACIJE O PAUŠALNOM OBRTU:
- Godišnji limit primitaka je 60.000€
- Ako paušalist PRIJEĐE 60.000€ u kalendarskoj godini,
  MORA prijeći na drugi porezni režim (obrt s knjigama ili
  d.o.o.) - NE resetira se sljedeće godine
- Porezni razredi određuju VISINU paušalnog poreza,
  ali 60.000€ je APSOLUTNA GRANICA za paušalni status
- PDV prag je također 60.000€ - pri prelasku postaje
  PDV obveznik

=== KNOWLEDGE BASE ===

Sažetak (bez vanjskih konkurentnih ili edukativnih portala — u odgovorima koristi isključivo Kvit):

- Paušalni obrt (obveze, limit 60.000 € primitaka, PDV prag): /vodici/pausalni-obrt-vodic
- KPR: /vodici/kpr-knjiga-prometa · KPR u aplikaciji: /kpr
- PO-SD: /vodici/po-sd-obrazac
- Doprinosi (iznosi, rokovi): /vodici/doprinosi · uz zaposlenje: /vodici/doprinosi-uz-posao
- Rokovi (cheat sheet): /vodici/rokovi-placanja
- Fiskalizacija 2.0: /vodici/fiskalizacija-20 · Izdavanje računa: /vodici/izdavanje-racuna
- PDV ID: /vodici/pdv-id
- Alati: /alati/kalkulator-poreza · /alati/placanje-doprinosa · /alati/rok-podsjetnici · /alati/checklista

PAUŠALNI POREZ - 7 RAZREDA 2026. (TOČNI PODACI):
Razred 1: prihod 0 – 11.300 €, godišnji porez 203,40 €,
          kvartal 50,85 €, mjesečno 16,95 €
Razred 2: prihod 11.300 – 15.300 €, godišnji 274,32 €,
          kvartal 68,58 €, mjesečno 22,86 €
Razred 3: prihod 15.300 – 19.900 €, godišnji 358,20 €,
          kvartal 89,55 €, mjesečno 29,85 €
Razred 4: prihod 19.900 – 30.600 €, godišnji 550,80 €,
          kvartal 137,70 €, mjesečno 45,90 €
Razred 5: prihod 30.600 – 40.000 €, godišnji 720,00 €,
          kvartal 180,00 €, mjesečno 60,00 €
Razred 6: prihod 40.000 – 50.000 €, godišnji 900,00 €,
          kvartal 225,00 €, mjesečno 75,00 €
Razred 7: prihod 50.000 – 60.000 €, godišnji 1.080,00 €,
          kvartal 270,00 €, mjesečno 90,00 €

Maksimalni godišnji paušalni porez: 1.080,00 €

DOPRINOSI ZA PAUŠALNI OBRT 2026. (TOČNI PODACI):

SAMOSTALNA DJELATNOST (jedina djelatnost):
- Plaćaju se MJESEČNO do 15. u mjesecu za prethodni mjesec
- Mirovinsko 1. stup: 119,58 €
- Mirovinsko 2. stup: 39,86 €
- Zdravstveno: 131,54 €
- UKUPNO: 290,98 € / mjesečno

UZ ZAPOSLENJE (obrt kao dodatna djelatnost):
- Plaćaju se GODIŠNJE u roku 15 dana od primitka rješenja PU
- NISU nula - plaćaju se u umanjenom iznosu!
- Iznosi po razredima primitaka:

Razred 1 (0-11.300€):     MIO1: 127,13€  MIO2: 42,38€  ZO: 127,13€
Razred 2 (11.300-15.300€): MIO1: 172,13€  MIO2: 57,38€  ZO: 172,13€
Razred 3 (15.300-19.900€): MIO1: 223,88€  MIO2: 74,63€  ZO: 223,88€
Razred 4 (19.900-30.600€): MIO1: 344,25€  MIO2: 114,75€ ZO: 344,25€
Razred 5 (30.600-40.000€): MIO1: 450,00€  MIO2: 150,00€ ZO: 450,00€
Razred 6 (40.000-50.000€): MIO1: 562,00€  MIO2: 187,00€ ZO: 562,50€
Razred 7 (50.000-60.000€): MIO1: 675,00€  MIO2: 225,00€ ZO: 675,00€

UMIROVLJENICI: NE plaćaju doprinose.

PRAVILO: Nikad ne reci da uz zaposlenje nema doprinosa.
Doprinosi uz zaposlenje postoje, samo su godišnji i manji.

PRAVILO O RAZREDIMA: Za pitanja o poreznim razredima uvijek navedi svih 7 razreda s točnim iznosima. Nikad ne izmišljaj razrede ni iznose. Izvor istine su gornji podaci.

Dopušteni vanjski izvori ako korisnik traži službeni tekst: Porezna uprava (porezna-uprava.hr), Narodne novine (nn.hr), državni portal (gov.hr), e-Obrtnica.

Zabrana: ne spominji i ne linkaj fiskalopedija.hr, marketino.hr, solo.com.hr, plaviured.hr, fiskai.hr, webracun.hr niti druge treće edukativne/SaaS stranice o paušalu.

=== KRAJ KNOWLEDGE BASE ===`;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Nedostaje ANTHROPIC_API_KEY u okruženju.' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as { messages?: ChatMessage[] };
    const rawMessages = body.messages ?? [];

    const filteredMessages = rawMessages
      .filter(
        (message) =>
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0,
      )
      .slice(-20)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    if (filteredMessages.length === 0) {
      return NextResponse.json(
        { error: 'Poruka je prazna. Pošalji pitanje.' },
        { status: 400 },
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      system: SYSTEM_PROMPT,
      max_tokens: 1200,
      stream: true,
      messages: filteredMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Greška pri obradi AI odgovora.',
      },
      { status: 500 },
    );
  }
}
