import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

const SYSTEM_PROMPT = `Ti si Kvit AI asistent za hrvatske paušalne obrtnike.
Odgovaraš ISKLJUČIVO na hrvatskom.
Ton: prijateljski, direktan, konkretan.

KLJUČNE ČINJENICE:
- Doprinosi: 290,98€/mj do 15. u mj (jedina djelatnost)
- Porez: kvartalno 31.3/30.6/30.9/31.12 po razredima
- Razredi 2026: 0-11300€→50,85€/kv, 11300-15300→68,58€, 15300-19900→89,55€, 19900-30600→137,70€, 30600-40000→180€, 40000-50000→225€, 50000-60000→270€
- KPR: upisuješ svaki dan, Kvit to radi automatski
- PO-SD: predaješ do 15.1. za prethodnu godinu
- Limit paušala: 60.000€, prelaskom ulaziš u PDV
- Fiskalizacija B2C: obvezna od 1.1.2026.
- eRačuni B2B: obvezni od 1.1.2027.
- Slobodna zanimanja NE MOGU biti paušalisti`;

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
      model: 'claude-3-5-sonnet-20241022',
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
