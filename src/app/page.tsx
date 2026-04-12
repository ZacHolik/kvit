'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { KVIT_LANDING_CSS } from './kvit-landing-css';

const TALLY = 'https://tally.so/r/44or65';

const AI_ANSWERS: Record<string, string> = {
  'Kada moram platiti doprinose?':
    'Doprinose plaćaš do <strong>15. u mjesecu</strong> za prethodni mjesec. Za 2026. iznos je <strong>290,98€ ukupno</strong> ako je obrt tvoja jedina djelatnost. Kvit ti šalje podsjetnik 3 dana prije roka. 📅',
  'Jesam li obveznik fiskalizacije?':
    'Od <strong>1.1.2026.</strong> svi paušalisti koji izdaju račune fizičkim osobama moraju fiskalizirati — čak i transakcijske. Ako izdaješ samo B2B račune firmama, fiskalizacija dolazi <strong>od 1.1.2027.</strong> Kvit to rješava automatski. ⚡',
  'Kako ispuniti PO-SD obrazac?':
    'PO-SD predaješ <strong>do 15. siječnja</strong> za prethodnu godinu. U Kvitu klikneš "Generiraj PO-SD" — obrazac se automatski popuni svim tvojim primitcima iz KPR-a. Provjeriš, klikneš pošalji. <strong>Gotovo.</strong> 🎯',
  'Koliko mogu zaraditi bez PDV-a?':
    'Prag za PDV je <strong>60.000€ godišnjih primitaka</strong>. Ako ga prijeđeš, od prvog sljedećeg dana ulaziš u PDV. Kvit ti pokazuje progress bar koliko si blizu — nikad više iznenađenja. 📊',
};

const AI_GENERIC =
  'Unutar Kvit aplikacije AI asistent zna sve o paušalnom obrtu. Registriraj se besplatno i dobij odgovor u sekundi. 🚀';

const AI_GENERIC_CUSTOM =
  'Odlično pitanje! Unutar Kvit aplikacije AI asistent odgovori na sve detalje. Registriraj se besplatno i isprobaj. 🚀';

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Moram li imati tehničko znanje?',
    a: 'Ne. Sve je klik po klik. Ako znaš koristiti WhatsApp, znaš koristiti Kvit. Onboarding te vodi korak po korak kroz sve što trebaš postaviti.',
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
  | { id: string; kind: 'ai'; html: string }
  | { id: string; kind: 'user'; text: string }
  | { id: string; kind: 'typing' };

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function LandingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
    setAiMessages((prev) => [
      ...prev,
      { id: uid(), kind: 'user', text: q },
      { id: typingId, kind: 'typing' },
    ]);
    window.setTimeout(() => {
      const html = AI_ANSWERS[q] ?? AI_GENERIC_CUSTOM;
      setAiMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        { id: uid(), kind: 'ai', html },
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
      <style dangerouslySetInnerHTML={{ __html: KVIT_LANDING_CSS }} />
      {/* Desktop: outline Imam račun; mobile: two-row centered nav + equal-width CTAs */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
#kvit-landing .hero{overflow-x:hidden}
#kvit-landing .hero-left{min-width:0}
@media(min-width:641px){
  #kvit-landing .nav-login{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    box-sizing:border-box;
    border:1px solid var(--teal);
    background:transparent;
    color:var(--text);
    padding:0.55rem 0.9rem;
    border-radius:8px;
    font-size:0.9rem;
    font-weight:500;
    line-height:1.2;
    text-decoration:none;
    white-space:nowrap;
    transition:color 0.2s,border-color 0.2s,background 0.2s;
  }
  #kvit-landing .nav-login:hover{
    color:var(--teal3);
    border-color:var(--teal2);
    background:rgba(13,148,136,0.08);
  }
}
@media(max-width:640px){
  #kvit-landing nav{
    flex-direction:column;
    align-items:center;
    gap:0.5rem;
    padding:0.75rem 1.25rem;
  }
  #kvit-landing .logo{
    font-size:1.6rem;
    width:100%;
    text-align:center;
  }
  #kvit-landing .nav-actions{
    display:flex;
    flex-direction:row;
    width:100%;
    max-width:100%;
    gap:0.75rem;
    align-items:stretch;
  }
  #kvit-landing .nav-login,
  #kvit-landing .nav-cta{
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
  #kvit-landing .nav-login{
    border:1px solid var(--teal);
    background:transparent;
    color:var(--text);
  }
  #kvit-landing .nav-login:hover{
    color:var(--teal3);
    border-color:var(--teal2);
    background:rgba(13,148,136,0.08);
  }
  #kvit-landing .nav-cta{
    border:none;
  }
  #kvit-landing .hero{
    padding:8.75rem 1.25rem 3rem;
  }
  #kvit-landing .hero h1{
    font-size:clamp(1.85rem,8.5vw,2.75rem);
    word-break:break-word;
    overflow-wrap:anywhere;
  }
}
`,
        }}
      />
      <div id='kvit-landing'>
        <nav>
          <div className='logo'>
            Kvit<span>.</span>
          </div>
          <ul className='nav-links'>
            <li>
              <Link href='/vodici'>Vodiči</Link>
            </li>
            <li>
              <a href='#prednosti'>Prednosti</a>
            </li>
            <li>
              <a href='#kako-radi'>Kako radi</a>
            </li>
            <li>
              <a href='#cijene'>Cijene</a>
            </li>
            <li>
              <a href='#faq'>FAQ</a>
            </li>
          </ul>
          <div className='nav-actions'>
            <Link href='/login' className='nav-login'>
              Imam račun
            </Link>
            <a
              href={TALLY}
              target='_blank'
              rel='noopener noreferrer'
              className='nav-cta'
            >
              Isprobaj besplatno
            </a>
          </div>
        </nav>

        <div className='hero'>
          <div className='hero-left'>
            <div className='hero-badge'>
              <span className='badge-flag'>🇭🇷</span>
              Napravljeno za hrvatske paušaliste
              <span className='badge-dot' />
            </div>
            <h1>
              Paušalni obrt
              <br />
              bez <em>glavobolje.</em>
            </h1>
            <p className='hero-sub'>
              Jedina aplikacija koja te vodi korak po korak kroz sve obveze
              paušalnog obrta. Bez papirologije, bez stresa, bez kazni.
            </p>
            <div className='hero-ctas'>
              <a
                href={TALLY}
                target='_blank'
                rel='noopener noreferrer'
                className='btn-primary'
              >
                Prijavi se na listu →
              </a>
              <a href='#kako-radi' className='btn-ghost'>
                Kako radi
              </a>
            </div>
            <p className='hero-note'>
              Aplikacija je u fazi lansiranja. Prvih 50 prijava – 3 mjeseca
              gratis!
            </p>
          </div>
          <div className='hero-right'>
            <div className='phone-wrap'>
              <div className='phone'>
                <div className='phone-notch'>
                  <span className='time'>9:41</span>
                  <div className='icons'>
                    <div className='signal'>
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className='battery'>
                      <div className='battery-fill' />
                    </div>
                  </div>
                </div>
                <div className='phone-screen'>
                  <div className='phone-header'>
                    <span className='phone-header-title'>Novi račun</span>
                    <span className='kpr-badge'>KPR ažuriran</span>
                  </div>
                  <div className='phone-form'>
                    <div className='form-group'>
                      <label>Kupac</label>
                      <div className='form-input'>Studio Kreativ d.o.o.</div>
                    </div>
                    <div className='form-group'>
                      <label>Usluga</label>
                      <div className='form-input'>Izrada web stranice</div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group'>
                        <label>Iznos</label>
                        <div className='form-input'>750,00 €</div>
                      </div>
                      <div className='form-group'>
                        <label>Datum</label>
                        <div className='form-input'>09.04.2026</div>
                        <div className='deadline-badge'>
                          ⚠ Rok: 15. u mj.
                        </div>
                      </div>
                    </div>
                    <a href={TALLY} className='phone-btn' target='_blank' rel='noopener noreferrer'>
                      Izdaj račun →
                    </a>
                  </div>
                  <div className='fisk-badge'>Fiskalizacija automatska</div>
                </div>
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
            <div className='stat-label'>kazne ako koristiš Kvit</div>
          </div>
          <div className='stat'>
            <div className='stat-num'>
              30<span>s</span>
            </div>
            <div className='stat-label'>za izdati račun</div>
          </div>
          <div className='stat'>
            <div className='stat-num'>
              4.9<span>★</span>
            </div>
            <div className='stat-label'>ocjena korisnika</div>
          </div>
        </div>

        <section className='section' id='prednosti'>
          <div className='section-tag'>Zašto Kvit</div>
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
                Uneseš ime obrta i OIB. Kvit se spoji s Poreznom i postavi sve
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
                  <div className='ai-name'>Kvit AI asistent</div>
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
                      <div
                        className='bubble'
                        dangerouslySetInnerHTML={{ __html: m.html }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className='quick-btns'>
                <button
                  type='button'
                  className='qb'
                  onClick={() => askAI('Kada moram platiti doprinose?')}
                >
                  Kada platiti doprinose?
                </button>
                <button
                  type='button'
                  className='qb'
                  onClick={() => askAI('Jesam li obveznik fiskalizacije?')}
                >
                  Fiskalizacija?
                </button>
                <button
                  type='button'
                  className='qb'
                  onClick={() => askAI('Kako ispuniti PO-SD obrazac?')}
                >
                  Kako PO-SD?
                </button>
                <button
                  type='button'
                  className='qb'
                  onClick={() => askAI('Koliko mogu zaraditi bez PDV-a?')}
                >
                  Limit bez PDV?
                </button>
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
                Ovo nije chatbot. Ovo je tvoj AI knjigovođa koji zna sve o
                hrvatskom poreznom sustavu.
              </div>
            </div>
          </div>
        </section>

        <section className='section section--tight-top'>
          <div className='section-tag'>Korisnici</div>
          <div className='section-title'>Što kažu paušalisti?</div>
          <p className='section-sub section-sub--accent'>
            Kvit koristi 2.500+ paušalnih obrtnika u Hrvatskoj
          </p>
          <div className='testi-grid'>
            <div className='testi'>
              <div className='stars'>★★★★★</div>
              <p>
                &quot;Konačno nešto što razumijem. Račun napravim za 30
                sekundi, KPR se sam popuni. Nemam pojma zašto sam ovo ručno radio
                godinama.&quot;
              </p>
              <div className='testi-author'>
                <div className='testi-avatar'>MB</div>
                <div>
                  <div className='testi-name'>Marko B.</div>
                  <div className='testi-role'>Grafički dizajner, Zagreb</div>
                </div>
              </div>
            </div>
            <div className='testi'>
              <div className='stars'>★★★★★</div>
              <p>
                &quot;PO-SD sam uvijek radila sa strahom da ću nešto krivo
                upisati. Sad samo kliknem i gotovo. Doslovno sam se prestala
                stresirati.&quot;
              </p>
              <div className='testi-author'>
                <div className='testi-avatar'>AK</div>
                <div>
                  <div className='testi-name'>Ana K.</div>
                  <div className='testi-role'>Prevoditeljica, Split</div>
                </div>
              </div>
            </div>
            <div className='testi'>
              <div className='stars'>★★★★★</div>
              <p>
                &quot;AI asistent me spasio kad sam imao pitanje o
                fiskalizaciji u nedjelju navečer. Odgovor za 5 sekundi, bez
                čekanja na knjigovođu.&quot;
              </p>
              <div className='testi-author'>
                <div className='testi-avatar'>IP</div>
                <div>
                  <div className='testi-name'>Ivan P.</div>
                  <div className='testi-role'>IT freelancer, Osijek</div>
                </div>
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
                <li>Zaprimanje eRačuna</li>
                <li>AI asistent (5 upita/dan)</li>
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
            <div className='price-card featured'>
              <div className='popular-tag'>Najpopularnije</div>
              <div className='price-tier'>Najpopularnije</div>
              <div className='price-name'>Paušalist</div>
              <div className='price-amount'>
                <sup />
                {yearly ? '5.60€' : '7€'}
                <sub>/mj</sub>
              </div>
              <div className='price-desc'>Za aktivne obrtnike</div>
              <ul className='price-features'>
                <li>Neograničeni računi</li>
                <li>Automatski KPR i PO-SD</li>
                <li>Fiskalizacija 1.0 i 2.0</li>
                <li>AI asistent neograničeno</li>
                <li>Podsjetnici na rokove</li>
                <li>Informacijski posrednik uključen</li>
              </ul>
              <a
                href={TALLY}
                target='_blank'
                rel='noopener noreferrer'
                className='price-btn price-btn-primary'
              >
                Isprobaj 30 dana besplatno
              </a>
            </div>
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
                <li>Bankovna integracija</li>
                <li>Auto-matching uplata</li>
                <li>Prioritetna podrška</li>
                <li>Portal za računovođu</li>
                <li>Multi-obrt podrška</li>
              </ul>
              <a
                href={TALLY}
                target='_blank'
                rel='noopener noreferrer'
                className='price-btn price-btn-outline'
              >
                Počni s PRO
              </a>
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
            <h2>Spreman za lakši paušalni obrt?</h2>
            <p>
              Pridruži se tisućama obrtnika koji su se riješili stresa s
              papirologijom.
            </p>
            <a
              href={TALLY}
              target='_blank'
              rel='noopener noreferrer'
              className='btn-primary'
              style={{
                display: 'inline-flex',
                fontSize: '1.05rem',
                padding: '1rem 2.5rem',
              }}
            >
              Počni besplatno →
            </a>
            <p className='cta-note'>
              Aplikacija je u fazi lansiranja. Prvih 50 prijava – 3 mjeseca
              gratis!
            </p>
          </div>
        </div>

        <footer>
          <div className='footer-left'>
            <div className='logo'>
              Kvit<span style={{ color: 'var(--teal)' }}>.</span>
            </div>
          </div>
          <ul className='footer-links'>
            <li>
              <a href={TALLY} target='_blank' rel='noopener noreferrer'>
                Uvjeti korištenja
              </a>
            </li>
            <li>
              <a href={TALLY} target='_blank' rel='noopener noreferrer'>
                Privatnost
              </a>
            </li>
            <li>
              <a href={TALLY} target='_blank' rel='noopener noreferrer'>
                Kontakt
              </a>
            </li>
          </ul>
          <div className='footer-copy'>© 2026 Kvit. Sva prava pridržana.</div>
        </footer>
      </div>
    </>
  );
}
