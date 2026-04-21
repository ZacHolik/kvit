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

Točne brojke (paušalni porez po razredima 2026., doprinosi) usklađene su s Kvit kalkulatorom i vodičima.

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
