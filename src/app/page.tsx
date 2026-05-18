'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

// --- Pricing checkout handler (used in the #cijene section) ---
async function startCheckout(trial: boolean) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: 'pausalist', trial }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (data.url) {
    window.location.href = data.url;
  } else {
    // Fallback: Tally waitlist until Stripe is fully wired
    window.location.href = 'https://tally.so/r/44or65';
  }
}

import { HARDCODED_QA } from './asistent/hardcoded-qa-data';
import { ShareAiResponse } from './asistent/share-ai-response';
import { KVIK_LANDING_CSS } from './kvik-landing-css';

const TALLY = 'https://tally.so/r/44or65';
const LANDING_RESPONSIVE_CSS = `
#kvik-landing .hero{overflow-x:hidden}
#kvik-landing .hero-left{min-width:0}
@media(min-width:641px){
  #kvik-landing .nav-login-text{
    display:inline-flex;
    align-items:center;
    color:#94a3a0;
    font-size:0.9rem;
    font-weight:500;
    text-decoration:none;
    white-space:nowrap;
    transition:color 0.2s;
  }
  #kvik-landing .nav-login-text:hover{
    color:#e2e8e7;
  }
}
@media(max-width:640px){
  #kvik-landing nav{
    flex-direction:column;
    align-items:center;
    gap:0.5rem;
    padding:0.75rem 1.25rem;
  }
  #kvik-landing .logo{
    font-size:1.6rem;
    width:100%;
    text-align:center;
  }
  #kvik-landing .nav-actions{
    display:flex;
    flex-direction:row;
    width:100%;
    max-width:100%;
    gap:0.75rem;
    align-items:stretch;
  }
  #kvik-landing .nav-login-text,
  #kvik-landing .nav-cta{
    flex:1;
    min-width:0;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:0.82rem;
    font-weight:500;
    line-height:1.2;
    padding:0.55rem 0.75rem;
    border-radius:8px;
    text-align:center;
    box-sizing:border-box;
    text-decoration:none;
    transition:color 0.2s,border-color 0.2s,background 0.2s;
  }
  #kvik-landing .nav-login-text{
    border:1px solid #2a3734;
    background:transparent;
    color:#94a3a0;
  }
  #kvik-landing .nav-login-text:hover{
    color:#e2e8e7;
    border-color:#94a3a0;
  }
  #kvik-landing .nav-cta{
    border:none;
  }
  #kvik-landing .hero{
    padding:8.75rem 1.25rem 3rem;
  }
  #kvik-landing .hero h1{
    font-size:clamp(1.85rem,8.5vw,2.75rem);
    word-break:break-word;
    overflow-wrap:anywhere;
  }
}
`;

const AI_ANSWERS: Record<string, string> = {
  'Kada moram platiti doprinose?':
    'Doprinose plaćaš do <strong>15. u mjesecu</strong> za prethodni mjesec. Za 2026. iznos je <strong>290,98€ ukupno</strong> ako je obrt tvoja jedina djelatnost. Kvik ti šalje podsjetnik 3 dana prije roka. 📅',
  'Jesam li obveznik fiskalizacije?':
    'Od <strong>1.1.2026.</strong> svi paušalisti koji izdaju račune fizičkim osobama moraju fiskalizirati — čak i transakcijske. Ako izdaješ samo B2B račune firmama, fiskalizacija dolazi <strong>od 1.1.2027.</strong> Kvik to rješava automatski. ⚡',
  'Kako ispuniti PO-SD obrazac?':
    'PO-SD predaješ <strong>do 15. siječnja</strong> za prethodnu godinu. U Kviku klikneš "Generiraj PO-SD" — obrazac se automatski popuni svim tvojim primitcima iz KPR-a. Provjeriš, klikneš pošalji. <strong>Gotovo.</strong> 🎯',
  'Koliko mogu zaraditi bez PDV-a?':
    'Prag za PDV je <strong>60.000€ godišnjih primitaka</strong>. Ako ga prijeđeš, od prvog sljedećeg dana ulaziš u PDV. Kvik ti pokazuje progress bar koliko si blizu — nikad više iznenađenja. 📊',
};

const AI_GENERIC =
  'Unutar Kvik aplikacije AI asistent zna sve o paušalnom obrtu. Registriraj se besplatno i dobij odgovor u sekundi. 🚀';

const AI_GENERIC_CUSTOM =
  'Odlično pitanje! Unutar Kvik aplikacije AI asistent odgovori na sve detalje. Registriraj se besplatno i isprobaj. 🚀';

const LANDING_QA = HARDCODED_QA.categories.flatMap((category) =>
  category.questions.map((item) => ({
    question: item.question,
    answer: item.answer,
  })),
);

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Moram li imati tehničko znanje?',
    a: 'Ne. Sve je klik po klik. Ako znaš koristiti WhatsApp, znaš koristiti Kvik. Onboarding te vodi korak po korak kroz sve što trebaš postaviti.',
  },
  {
    q: 'Je li aplikacija usklađena s Fiskalizacijom 2.0?',
    a: 'Da, u potpunosti. Podržava Fiskalizaciju 1.0 (B2C) i 2.0 (B2B/B2G). Informacijski posrednik je već uključen u tvoju pretplatu — ne plaćaš ništa extra, ne potpisuješ zasebne ugovore.',
  },
  {
    q: 'Što je s informacijskim posrednikom?',
    a: 'Uključen je u cijenu. Nema API keyeva, nema čekanja na odobrenje ugovora. Registriraš se, mi to sredimo za tebe u pozadini.',
  },
  {
    q: 'Mogu li prebaciti podatke iz Excela?',
    a: 'Da. Uvoz klijenata i računa radi jednim klikom iz Excel ili CSV datoteke. Ili jednostavno počneš ispočetka — podešavanje traje 5 minuta.',
  },
  {
    q: 'Što ako imam pitanje koje AI ne zna odgovoriti?',
    a: 'Imaš email i chat podršku s pravim ljudima. Odgovaramo unutar nekoliko sati, ne 48 sati. Za PRO plan — prioritetna podrška unutar sat vremena.',
  },
];

type AiMessage =
  | { id: string; kind: 'ai'; html: string; share?: { question: string; answer: string } }
  | { id: string; kind: 'user'; text: string }
  | { id: string; kind: 'typing' };

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Animated phone mockup screen ───────────────────────────────────────────

const ALERTS = [
  {
    title: 'Rok za PO-SD predaju: još 12 dana',
    sub: 'Tvoj razred: 3 (19.901 – 30.600 €)',
    btn: 'Pregledaj PO-SD',
  },
  {
    title: 'Doprinosi za Q2: uplata do 30.6.',
    sub: 'Iznos: 290,98 € · HUB-3A barkod spreman',
    btn: 'Preuzmi uplatnicu',
  },
  {
    title: 'Približavaš se PDV pragu',
    sub: 'Promet 2026: 52.340 € / 60.000 € (87%)',
    btn: 'Pogledaj projekciju',
  },
];

const KPR_MSGS = [
  {
    title: 'Automatski KPR ažuriran',
    sub: 'Račun #7 za Studio Kreativ d.o.o. — 750,00 € dodan u KPR',
  },
  {
    title: 'Storno obrađen',
    sub: 'Račun #4 storniran — KPR automatski korigiran',
  },
  {
    title: 'KPR zaključen za Q1 2026.',
    sub: 'PDF izvještaj spremljen · Ukupno: 21.892,60 €',
  },
];

const AI_QA = [
  {
    q: 'Plaćam li turističku članarinu?',
    a: 'Kao IT freelancer u Zagrebu — da, 150 €/god.',
    a2: 'Rok: 31.1.2027. · Kvik te podsjeća.',
  },
  {
    q: 'Kad moram predati PO-SD?',
    a: 'Do 15.1.2027. za godinu 2026.',
    a2: 'Kvik te podsjeća 30 dana ranije.',
  },
  {
    q: 'Trebam li interni akt?',
    a: 'Da, ako koristiš blagajnu za gotovinu.',
    a2: 'Generiraj ga u Kviku — 2 klika.',
  },
];

// Scroll-window heights (px) — each message slot must fit within these bounds.
// button area is always reserved (minHeight) so layout never shifts mid-type.
const AH = 84; // alert: title + sub + button
const KH = 52; // KPR: title + sub (sub can wrap to 2 lines)
const QH = 82; // AI: q-bubble + a-bubble (header is static, outside scroll)

const SLIDE_MS = 380; // duration of translateY scroll animation
const TYPE_MS = 14; // ms per character (telex speed)
const HOLD_MS = 2000; // pause after all text typed before scrolling

function PhoneMockupScreen() {
  const [cur, setCur] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [chars, setChars] = useState(0);

  const nxt = (cur + 1) % 3;

  // Build ordered text segments for the CURRENT message — typewriter types
  // through all of them sequentially.
  const a = ALERTS[cur];
  const k = KPR_MSGS[cur];
  const q = AI_QA[cur];
  // seg[0]=alertTitle, [1]=alertSub, [2]=kprTitle, [3]=kprSub,
  // [4]=aiQ, [5]=aiA, [6]=aiA2
  const segs = [a.title, a.sub, k.title, k.sub, q.q, q.a, q.a2];
  const offs: number[] = [0];
  segs.forEach((s) => offs.push(offs[offs.length - 1] + s.length));
  const totalChars = offs[segs.length];

  // How many chars of segment i are visible
  const show = (i: number) =>
    segs[i].slice(0, Math.max(0, Math.min(chars - offs[i], segs[i].length)));

  // Is cursor currently inside segment i?
  const isCur = (i: number) => chars > offs[i] && chars < offs[i + 1];

  // Alert button appears only after its sub is fully typed
  const btnVis = chars >= offs[2];

  // Phase 1 — typing
  useEffect(() => {
    if (sliding) return;
    if (chars < totalChars) {
      const t = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
      return () => clearTimeout(t);
    }
    // All text revealed — hold, then trigger scroll
    const t = setTimeout(() => setSliding(true), HOLD_MS);
    return () => clearTimeout(t);
  }, [chars, sliding, totalChars]);

  // Phase 2 — scroll completes, advance to next message
  useEffect(() => {
    if (!sliding) return;
    const t = setTimeout(() => {
      setCur((c) => (c + 1) % 3);
      setChars(0);
      setSliding(false);
    }, SLIDE_MS + 60);
    return () => clearTimeout(t);
  }, [sliding]);

  // Scroll stack: translateY(-Hpx) slides current out, next in.
  // Transition only while sliding; instant reset when cur changes.
  const stackStyle = (h: number): React.CSSProperties => ({
    transform: sliding ? `translateY(-${h}px)` : 'translateY(0)',
    transition: sliding ? `transform ${SLIDE_MS}ms cubic-bezier(0.4,0,0.2,1)` : 'none',
  });

  // Blinking block cursor shown at the active typing position
  const Cursor = () => (
    <span style={{ color: '#0d9488', fontWeight: 400, fontSize: '11px' }}>▍</span>
  );

  const btnStyle: React.CSSProperties = {
    display: 'inline-block',
    background: '#0d9488',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '7px',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        background: '#111716',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── HEADER BAR — static ─────────────────────────────── */}
      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #1f2a28' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8e7' }}>Kvik</span>
          <span style={{ fontSize: '11px', color: '#0d9488' }}>9:41</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#0d9488',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '10px', color: '#94a3a0' }}>
            KPR sinkroniziran · 3 računa ovaj mjesec
          </span>
        </div>
      </div>

      {/* ── NOTIFICATION CARDS ──────────────────────────────── */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        {/* ALERT card */}
        <div
          style={{
            background: 'rgba(13,148,136,0.08)',
            border: '1px solid rgba(13,148,136,0.25)',
            borderRadius: '12px',
            padding: '10px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
            <span style={{ fontSize: '14px', lineHeight: 1, color: '#fbbf24', flexShrink: 0, marginTop: '1px' }}>
              ⚠
            </span>
            {/* scroll window — clips overflow, AH = visible slot height */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', height: `${AH}px` }}>
              <div style={stackStyle(AH)}>
                {/* slot 0 — current message (being typed) */}
                <div style={{ height: `${AH}px` }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8e7', margin: '0 0 3px' }}>
                    {show(0)}
                    {isCur(0) && <Cursor />}
                  </p>
                  <p style={{ fontSize: '10px', color: '#94a3a0', margin: '0 0 8px', minHeight: '14px' }}>
                    {show(1)}
                    {isCur(1) && <Cursor />}
                  </p>
                  {/* button area always reserves space so layout is stable */}
                  <div style={{ minHeight: '22px' }}>
                    {btnVis && <span style={btnStyle}>{a.btn}</span>}
                  </div>
                </div>
                {/* slot 1 — next message (pre-rendered below, scrolls in) */}
                <div style={{ height: `${AH}px` }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8e7', margin: '0 0 3px' }}>
                    {ALERTS[nxt].title}
                  </p>
                  <p style={{ fontSize: '10px', color: '#94a3a0', margin: '0 0 8px' }}>
                    {ALERTS[nxt].sub}
                  </p>
                  <div style={{ minHeight: '22px' }}>
                    <span style={btnStyle}>{ALERTS[nxt].btn}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPR card */}
        <div
          style={{
            background: 'rgba(13,148,136,0.06)',
            border: '1px solid rgba(13,148,136,0.12)',
            borderRadius: '12px',
            padding: '10px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
            <span style={{ fontSize: '12px', lineHeight: 1, color: '#0d9488', flexShrink: 0, marginTop: '1px' }}>
              ★
            </span>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', height: `${KH}px` }}>
              <div style={stackStyle(KH)}>
                {/* current */}
                <div style={{ height: `${KH}px` }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8e7', margin: '0 0 3px' }}>
                    {show(2)}
                    {isCur(2) && <Cursor />}
                  </p>
                  <p style={{ fontSize: '10px', color: '#94a3a0', margin: 0 }}>
                    {show(3)}
                    {isCur(3) && <Cursor />}
                  </p>
                </div>
                {/* next */}
                <div style={{ height: `${KH}px` }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8e7', margin: '0 0 3px' }}>
                    {KPR_MSGS[nxt].title}
                  </p>
                  <p style={{ fontSize: '10px', color: '#94a3a0', margin: 0 }}>
                    {KPR_MSGS[nxt].sub}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI card */}
        <div
          style={{
            background: '#0b0f0e',
            border: '1px solid #1f2a28',
            borderRadius: '12px',
            padding: '10px 12px',
          }}
        >
          {/* static header — never scrolls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '9px', color: '#fff', fontWeight: 700 }}>AI</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#0d9488' }}>Kvik AI asistent</span>
          </div>

          {/* scroll window for Q+A bubbles */}
          <div style={{ overflow: 'hidden', height: `${QH}px` }}>
            <div style={stackStyle(QH)}>
              {/* current */}
              <div style={{ height: `${QH}px` }}>
                <div
                  style={{
                    background: '#111716',
                    border: '1px solid #1f2a28',
                    borderRadius: '9px',
                    padding: '6px 9px',
                    marginBottom: '6px',
                    minHeight: '26px',
                  }}
                >
                  <p style={{ fontSize: '10px', color: '#94a3a0', margin: 0 }}>
                    {show(4)}
                    {isCur(4) && <Cursor />}
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(13,148,136,0.08)',
                    border: '1px solid rgba(13,148,136,0.15)',
                    borderRadius: '9px',
                    padding: '6px 9px',
                    minHeight: '44px',
                  }}
                >
                  <p style={{ fontSize: '10px', color: '#e2e8e7', margin: '0 0 3px' }}>
                    {show(5)}
                    {isCur(5) && <Cursor />}
                  </p>
                  <p style={{ fontSize: '10px', color: '#94a3a0', margin: 0 }}>
                    {show(6)}
                    {isCur(6) && <Cursor />}
                  </p>
                </div>
              </div>
              {/* next */}
              <div style={{ height: `${QH}px` }}>
                <div
                  style={{
                    background: '#111716',
                    border: '1px solid #1f2a28',
                    borderRadius: '9px',
                    padding: '6px 9px',
                    marginBottom: '6px',
                  }}
                >
                  <p style={{ fontSize: '10px', color: '#94a3a0', margin: 0 }}>{AI_QA[nxt].q}</p>
                </div>
                <div
                  style={{
                    background: 'rgba(13,148,136,0.08)',
                    border: '1px solid rgba(13,148,136,0.15)',
                    borderRadius: '9px',
                    padding: '6px 9px',
                  }}
                >
                  <p style={{ fontSize: '10px', color: '#e2e8e7', margin: '0 0 3px' }}>{AI_QA[nxt].a}</p>
                  <p style={{ fontSize: '10px', color: '#94a3a0', margin: 0 }}>{AI_QA[nxt].a2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM NAV — static ─────────────────────────────── */}
      <div
        style={{
          padding: '10px 12px',
          borderTop: '1px solid #1f2a28',
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        {(
          [
            { icon: '📄', label: 'Računi', active: false },
            { icon: '📒', label: 'KPR', active: false },
            { icon: '💬', label: 'AI', active: true },
            { icon: '⚙️', label: 'Postavke', active: false },
          ] as { icon: string; label: string; active: boolean }[]
        ).map(({ icon, label, active }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px' }}>{icon}</div>
            <p style={{ fontSize: '8px', color: active ? '#0d9488' : '#94a3a0', margin: '3px 0 0' }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [proWaitlistEmail, setProWaitlistEmail] = useState('');
  const [proWaitlistSent, setProWaitlistSent] = useState(false);
  const [proWaitlistLoading, setProWaitlistLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      kind: 'ai',
      html: 'Bok! Pitaj me bilo što o vođenju paušalnog obrta — KPR, fiskalizacija, rokovi, porezi. Tu sam 24/7. 👋',
    },
  ]);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const aiMsgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = aiMsgsRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [aiMessages]);

  const askAI = useCallback((q: string) => {
    const typingId = uid();
    const matched = LANDING_QA.find((item) => item.question === q);
    setAiMessages((prev) => [
      ...prev,
      { id: uid(), kind: 'user', text: q },
      { id: typingId, kind: 'typing' },
    ]);
    window.setTimeout(() => {
      const html = matched?.answer ?? AI_ANSWERS[q] ?? AI_GENERIC_CUSTOM;
      setAiMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        matched
          ? { id: uid(), kind: 'ai', html, share: { question: q, answer: matched.answer } }
          : { id: uid(), kind: 'ai', html },
      ]);
    }, 1100);
  }, []);

  const sendAI = useCallback(() => {
    const input = aiInputRef.current;
    if (!input) {
      return;
    }
    const q = input.value.trim();
    if (!q) {
      return;
    }
    input.value = '';
    const typingId = uid();
    setAiMessages((prev) => [
      ...prev,
      { id: uid(), kind: 'user', text: q },
      { id: typingId, kind: 'typing' },
    ]);
    window.setTimeout(() => {
      setAiMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        { id: uid(), kind: 'ai', html: AI_GENERIC },
      ]);
    }, 1000);
  }, []);

  const toggleFaq = useCallback((index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  }, []);

  return (
    <>
      <style
        id='kvik-landing-base-style'
        dangerouslySetInnerHTML={{ __html: KVIK_LANDING_CSS }}
      />
      {/* Desktop: outline Imam račun; mobile: two-row centered nav + equal-width CTAs */}
      <style
        id='kvik-landing-responsive-style'
        dangerouslySetInnerHTML={{ __html: LANDING_RESPONSIVE_CSS }}
      />
      <div id='kvik-landing'>
        <nav>
          <div className='logo'>
            Kvik<span>.</span>
          </div>
          <ul className='nav-links'>
            <li>
              <Link href='/vodici'>Vodiči</Link>
            </li>
            <li>
              <Link href='/alati'>Alati</Link>
            </li>
            <li>
              <Link href='/fiskalizacija'>Fiskalizacija</Link>
            </li>
            <li>
              <Link href='/cijene'>Cijene</Link>
            </li>
            <li>
              <Link href='/asistent'>AI Asistent</Link>
            </li>
          </ul>
          <div className='nav-actions'>
            <Link href='/login' className='nav-login-text'>
              Imam račun
            </Link>
            <Link href='/register' className='nav-cta'>
              Registriraj se besplatno →
            </Link>
          </div>
        </nav>

        <div className='hero'>
          {/* Lijeva strana: badge, H1, sub, kartice, trust bar */}
          <div className='hero-left'>
            <div className='hero-badge'>
              <span className='badge-flag'>🇭🇷</span>
              Napravljeno samo za hrvatske paušaliste
              <span className='badge-dot' />
            </div>
            <h1>
              Kvik vodi računa o zakonu.<br />Ti vodi obrt.
            </h1>
            <p className='hero-sub'>
              Automatski KPR, PO-SD i fiskalizacija — bez nagađanja, bez kazni, bez Excel tablica u ponoć.
            </p>

            {/* 3 interaktivne kartice */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                marginTop: '2rem',
              }}
            >
              <Link
                href='/alati/kalkulator-poreza'
                style={{
                  display: 'block',
                  background: '#111716',
                  border: '1px solid #1f2a28',
                  borderRadius: '14px',
                  padding: '1rem',
                  textDecoration: 'none',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#14b8a6';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1f2a28';
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧮</div>
                <h3 style={{ color: '#e2e8e7', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Izračunaj porez 2026
                </h3>
                <p style={{ color: '#94a3a0', fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>
                  Koliko ćeš platiti poreza ove godine?
                </p>
              </Link>

              {/* istaknuta kartica — PO-SD */}
              <Link
                href='/alati/po-sd'
                style={{
                  display: 'block',
                  background: 'rgba(13,148,136,0.10)',
                  border: '1px solid #0d9488',
                  borderRadius: '14px',
                  padding: '1rem',
                  textDecoration: 'none',
                  boxShadow: '0 0 20px rgba(13,148,136,0.15)',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#14b8a6';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0d9488';
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄</div>
                <h3 style={{ color: '#e2e8e7', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Generiraj PO-SD
                </h3>
                <p style={{ color: '#94a3a0', fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>
                  Procijeni razred i pripremi PO-SD obrazac.
                </p>
              </Link>

              <Link
                href='/asistent'
                style={{
                  display: 'block',
                  background: '#111716',
                  border: '1px solid #1f2a28',
                  borderRadius: '14px',
                  padding: '1rem',
                  textDecoration: 'none',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#14b8a6';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1f2a28';
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤖</div>
                <h3 style={{ color: '#e2e8e7', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Pitaj AI asistenta
                </h3>
                <p style={{ color: '#94a3a0', fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>
                  Odgovori na porezna pitanja odmah.
                </p>
              </Link>
            </div>

            {/* trust bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: '1.5rem',
                fontSize: '0.82rem',
                color: '#94a3a0',
              }}
            >
              <span>✓ Besplatno bez registracije</span>
              <span>✓ Fiskalizacija uključena</span>
              <span>✓ 0€ aktivacija</span>
            </div>
          </div>

          {/* Desna strana: "Vodič u akciji" phone mockup */}
          <div className='hero-right'>
            <div className='phone-wrap'>
              {/* phone frame */}
              <div
                style={{
                  width: '260px',
                  background: '#0b0f0e',
                  borderRadius: '32px',
                  padding: '12px',
                  border: '2px solid #1f2a28',
                  boxShadow:
                    '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset',
                }}
              >
                {/* dynamic island notch */}
                <div
                  style={{
                    width: '80px',
                    height: '6px',
                    background: '#1f2a28',
                    borderRadius: '9999px',
                    margin: '0 auto 10px',
                  }}
                />
                {/* screen — animated "Vodič u akciji" */}
                <PhoneMockupScreen />
              </div>
            </div>
          </div>
        </div>

        <div className='stats-bar'>
          <div className='stat'>
            <div className='stat-num'>
              162<span>k+</span>
            </div>
            <div className='stat-label'>paušalnih obrtnika u HR</div>
          </div>
          <div className='stat'>
            <div className='stat-num'>
              0<span>€</span>
            </div>
            <div className='stat-label'>kazne ako koristiš Kvik</div>
          </div>
          <div className='stat'>
            <div className='stat-num'>
              30<span>s</span>
            </div>
            <div className='stat-label'>za izdati račun</div>
          </div>
        </div>

        <section className='section' id='prednosti'>
          <div className='section-tag'>Zašto Kvik</div>
          <div className='section-title'>
            Sve što trebaš.
            <br />
            Ništa što ne trebaš.
          </div>
          <p className='section-sub'>
            Napravljeno samo za paušaliste. Ne za odvjetnike, građevinare i
            OPG-ove – samo za tebe.
          </p>
          <div className='features-grid'>
            <div className='feature-card'>
              <div className='feature-icon'>🤖</div>
              <h3>AI asistent 24/7</h3>
              <p>
                Pitaj što god o porezima, fiskalizaciji, KPR-u. Odgovor na
                hrvatskom, odmah, bez čekanja.
              </p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>📋</div>
              <h3>Automatski KPR i PO-SD</h3>
              <p>
                Svaki račun automatski ide u KPR. Na kraju godine jedan klik –
                PO-SD je gotov.
              </p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>⚡</div>
              <h3>Fiskalizacija u sekundi</h3>
              <p>
                Informacijski posrednik uključen u cijenu. Bez API keyeva, bez
                ugovora s Pondijem.
              </p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>🔔</div>
              <h3>Podsjetnici na rokove</h3>
              <p>
                Doprinosi 15. u mj. Porez kvartalno. PO-SD do 15.1. Mi pamtimo
                umjesto tebe.
              </p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>📱</div>
              <h3>Mobitel + web</h3>
              <p>
                Izda račun s terena za 30 sekundi. Android i iOS, plus web
                verzija. Sve sinkronizirano.
              </p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>📊</div>
              <h3>Prati limit 60.000€</h3>
              <p>
                Vizualni prikaz koliko si blizu PDV praga. Nikad više
                iznenađenja od Porezne uprave.
              </p>
            </div>
          </div>
        </section>

        <section className='section' id='kako-radi'>
          <div className='section-tag'>Kako radi</div>
          <div className='section-title'>Tri koraka. To je sve.</div>
          <p className='section-sub'>
            Od registracije do prvog fiskaliziranog računa za manje od 5
            minuta.
          </p>
          <div className='steps-grid'>
            <div className='step'>
              <div className='step-num'>01</div>
              <div className='step-icon'>👤</div>
              <h3>Registriraj se za 2 minute</h3>
              <p>
                Uneseš ime obrta i OIB. Kvik se spoji s Poreznom i postavi sve
                automatski. Bez papirnatih obrazaca.
              </p>
            </div>
            <div className='step'>
              <div className='step-num'>02</div>
              <div className='step-icon'>📄</div>
              <h3>Izdaj prvi račun</h3>
              <p>
                Uneseš klijenta, iznos, opis. Klikneš &quot;Pošalji&quot;. KPR
                se sam popuni. Fiskalizacija u sekundi.
              </p>
            </div>
            <div className='step'>
              <div className='step-num'>03</div>
              <div className='step-icon'>✅</div>
              <h3>Generiraj PO-SD jednim klikom</h3>
              <p>
                Na kraju godine klikneš &quot;Generiraj PO-SD&quot;. Obrazac je
                ispunjen, spreman za predaju. Gotovo.
              </p>
            </div>
          </div>
        </section>

        <section className='section section--tight-top'>
          <div className='section-tag'>AI asistent</div>
          <div className='section-title'>Pitaj. Odmah dobiješ odgovor.</div>
          <p className='section-sub'>
            Nije chatbot koji te šalje na Google. AI koji zna sve o hrvatskom
            poreznom sustavu.
          </p>
          <div className='ai-demo-wrap'>
            <div className='ai-demo'>
              <div className='ai-demo-top'>
                <div className='ai-avatar'>AI</div>
                <div className='ai-info'>
                  <div className='ai-name'>Kvik AI asistent</div>
                  <div className='ai-status'>Online</div>
                </div>
              </div>
              <div className='ai-msgs' ref={aiMsgsRef}>
                {aiMessages.map((m) => {
                  if (m.kind === 'user') {
                    return (
                      <div key={m.id} className='msg msg-user'>
                        <div className='bubble'>{m.text}</div>
                      </div>
                    );
                  }
                  if (m.kind === 'typing') {
                    return (
                      <div key={m.id} className='msg msg-ai'>
                        <div className='typing'>
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} className='msg msg-ai'>
                      {m.share ? (
                        <ShareAiResponse
                          question={m.share.question}
                          answer={m.share.answer}
                          variant='highlight'
                        />
                      ) : null}
                      <div
                        className='bubble'
                        dangerouslySetInnerHTML={{ __html: m.html }}
                      />
                      {m.share ? (
                        <>
                          <ShareAiResponse
                            question={m.share.question}
                            answer={m.share.answer}
                          />
                          <div className='mt-4 rounded-2xl border border-[#2a3734] bg-gradient-to-br from-[#101515] to-[#0b0f0e] p-4'>
                            <p className='text-sm leading-relaxed text-[#c8d3d1]'>
                              Ovakve odgovore i sređene knjigovodstvene papire za
                              paušalce možeš imati svaki dan.
                              <br />
                              Iskoristi promociju! Uhvati cijenu za KVIK 5,60€/mj —
                              zauvijek.
                            </p>
                            <a
                              href='https://kvik.online/register'
                              className='mt-4 inline-flex items-center justify-center rounded-xl bg-[#14b8a6] px-4 py-2.5 text-sm font-semibold text-[#042f2e] shadow-[0_8px_20px_rgba(20,184,166,0.28)] transition hover:-translate-y-0.5 hover:bg-[#2dd4bf]'
                            >
                              Registracija →
                            </a>
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div className='quick-btns'>
                {LANDING_QA.map((item) => (
                  <button
                    key={item.question}
                    type='button'
                    className='qb'
                    onClick={() => askAI(item.question)}
                  >
                    {item.question}
                  </button>
                ))}
              </div>
              <div className='ai-input-row'>
                <input
                  ref={aiInputRef}
                  className='ai-input'
                  type='text'
                  placeholder='Postavi pitanje...'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendAI();
                    }
                  }}
                />
                <button type='button' className='ai-send' onClick={sendAI}>
                  →
                </button>
              </div>
              <div className='ai-footnote'>
                Demo prikaz za landing. Puni asistent s istim pitanjima je na{' '}
                <Link href='/asistent'>/asistent</Link>.
              </div>
            </div>
          </div>
        </section>

        <section className='section' id='cijene'>
          <div className='section-tag'>Cijene</div>
          <div className='section-title'>
            Fiksna cijena.
            <br />
            Bez iznenađenja.
          </div>
          <p className='section-sub'>
            Ne naplaćujemo po prometu. Plaćaš isti iznos, zaradiš li 1.000€ ili
            59.000€ godišnje.
          </p>
          <div className='pricing-toggle'>
            <span>Mjesečno</span>
            <button
              type='button'
              className={`toggle-track ${yearly ? '' : 'off'}`}
              onClick={() => setYearly((y) => !y)}
              aria-label='Prebaci između mjesečne i godišnje pretplate'
            >
              <span className='toggle-thumb' />
            </button>
            <span>Godišnje</span>
            <span className='save-tag' style={{ opacity: yearly ? 1 : 0 }}>
              Uštedi 20%
            </span>
          </div>
          <div className='pricing-grid'>
            {/* --- Besplatni plan --- */}
            <div className='price-card'>
              <div className='price-tier'>Za početak</div>
              <div className='price-name'>Besplatno</div>
              <div className='price-amount'>
                <sup />
                0€<sub>/mj</sub>
              </div>
              <div className='price-desc'>Za one koji tek počinju</div>
              <ul className='price-features'>
                <li>Do 3 računa mjesečno</li>
                <li>Osnovni KPR</li>
                <li>PO-SD generator</li>
                <li>Kalkulator poreza</li>
                <li>Vodiči i edukacija</li>
                <li>AI asistent (3 upita/dan)</li>
              </ul>
              <a
                href={TALLY}
                target='_blank'
                rel='noopener noreferrer'
                className='price-btn price-btn-outline'
              >
                Počni besplatno
              </a>
            </div>

            {/* --- Paušalist plan (featured) --- */}
            <div className='price-card featured'>
              <div className='popular-tag'>Najpopularnije</div>
              <div className='price-tier'>Najpopularnije</div>
              <div className='price-name'>Paušalist</div>
              <div className='price-amount'>
                <sup />
                {yearly ? '5.60€' : '7€'}
                <sub>/mj</sub>
              </div>
              {yearly ? (
                <div className='price-desc'>
                  Early adopter cijena — zaključana zauvijek
                </div>
              ) : null}
              <div className='price-desc'>Za aktivne obrtnike</div>
              <ul className='price-features'>
                <li>Neograničeni računi</li>
                <li>Automatski KPR i PO-SD</li>
                <li>Fiskalizacija 1.0 (2.0 dolazi Q4 2026.)</li>
                <li>AI asistent neograničeno</li>
                <li>Podsjetnici na rokove</li>
                <li>eRačuni — zaprimanje besplatno</li>
              </ul>
              <button
                type='button'
                className='price-btn price-btn-primary'
                onClick={() => void startCheckout(true)}
              >
                Isprobaj 7 dana besplatno →
              </button>
            </div>

            {/* --- Paušalist PRO (coming soon) --- */}
            <div className='price-card'>
              <div className='price-tier'>Za ozbiljne</div>
              <div className='price-name'>Paušalist PRO</div>
              <div className='price-amount'>
                <sup />
                {yearly ? '9.60€' : '12€'}
                <sub>/mj</sub>
              </div>
              <div className='price-desc'>Za ozbiljne obrtnike</div>
              <ul className='price-features'>
                <li>Sve iz Paušalist plana</li>
                <li>Portal za računovođu (read-only pristup)</li>
                <li>Slanje i zaprimanje eRačuna (F2.0)</li>
                <li>Export za računovođu (ZIP)</li>
                <li>Prioritetna podrška</li>
                <li>API pristup (za integracije)</li>
              </ul>
              <button
                type='button'
                disabled
                className='price-btn price-btn-outline'
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                Uskoro dostupno
              </button>
              {/* PRO waitlist */}
              <div style={{ marginTop: '1rem' }}>
                {proWaitlistSent ? (
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--teal3)',
                      textAlign: 'center',
                    }}
                  >
                    ✓ Prijavili ste se! Javit ćemo se.
                  </p>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text3)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Obavijesti me kad bude dostupno
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type='email'
                        value={proWaitlistEmail}
                        onChange={(e) => setProWaitlistEmail(e.target.value)}
                        placeholder='email@example.com'
                        style={{
                          flex: 1,
                          background: 'var(--bg3)',
                          border: '1px solid var(--border2)',
                          borderRadius: '8px',
                          padding: '0.45rem 0.75rem',
                          fontSize: '0.82rem',
                          color: 'var(--text)',
                          outline: 'none',
                          minWidth: 0,
                        }}
                      />
                      <button
                        type='button'
                        disabled={proWaitlistLoading || !proWaitlistEmail}
                        style={{
                          background: 'var(--teal)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.82rem',
                          cursor:
                            proWaitlistLoading || !proWaitlistEmail
                              ? 'not-allowed'
                              : 'pointer',
                          opacity:
                            proWaitlistLoading || !proWaitlistEmail ? 0.6 : 1,
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => {
                          if (!proWaitlistEmail) return;
                          setProWaitlistLoading(true);
                          void fetch('/api/waitlist/pro', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: proWaitlistEmail }),
                          }).then(() => {
                            setProWaitlistSent(true);
                            setProWaitlistLoading(false);
                          });
                        }}
                      >
                        {proWaitlistLoading ? '...' : 'Prijavi se'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className='section' id='faq'>
          <div className='section-tag'>FAQ</div>
          <div className='section-title'>Pitanja i odgovori</div>
          <div className='faq-wrap'>
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={item.q}
                className={`faq-item${openFaq === index ? ' open' : ''}`}
              >
                <div
                  className='faq-q'
                  onClick={() => toggleFaq(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFaq(index);
                    }
                  }}
                  role='button'
                  tabIndex={0}
                >
                  {item.q} <span className='faq-arrow'>+</span>
                </div>
                <div className='faq-a'>{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        <div className='cta-section'>
          <div className='cta-inner'>
            <h2>Bez Kvika podsvjesno se vidiš ovdje.</h2>
            <div className='mx-auto my-8 flex w-full max-w-2xl flex-col items-center overflow-hidden rounded-xl border border-[#1f2a28]'>
              <img
                src='/images/lineup.png'
                alt='Policijski lineup — sjene osumnjičenika'
                className='mx-auto h-auto w-full max-w-2xl rounded-xl opacity-60'
              />
            </div>
            <p>Probaj Kvik i oslobodi se stresa zauvijek.</p>
            <Link
              href='/register'
              className='btn-primary'
              style={{
                display: 'inline-flex',
                fontSize: '1.05rem',
                padding: '1rem 2.5rem',
              }}
            >
              Isprobaj besplatno
            </Link>
          </div>
        </div>

        <footer>
          <div className='footer-left'>
            <div className='logo'>
              Kvik<span style={{ color: 'var(--teal)' }}>.</span>
            </div>
          </div>
          <ul className='footer-links'>
            <li>
              <Link href='/privacy'>
                Privatnost
              </Link>
            </li>
            <li>
              <Link href='/uvjeti'>
                Uvjeti korištenja
              </Link>
            </li>
            <li>
              <a href={TALLY} target='_blank' rel='noopener noreferrer'>
                Kontakt
              </a>
            </li>
          </ul>
          <div className='footer-copy'>© 2026 Kvik. Sva prava pridržana.</div>
        </footer>
      </div>
    </>
  );
}
