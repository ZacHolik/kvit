import PageTopBar from '@/components/cta/PageTopBar';
import InlineCTA from '@/components/cta/InlineCTA';
import FloatingCTA from '@/components/cta/FloatingCTA';
import BottomCTA from '@/components/cta/BottomCTA';

export const metadata = {
  title: 'CTA Test — Kvik (interno)',
  description: 'Interna test stranica za sve CTA komponente i varijante.',
  robots: { index: false, follow: false },
};

export default function TestCtaPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">CTA komponente — test stranica</h1>
        <p className="mt-2 text-sm text-slate-400">
          Interna stranica (noindex). Renderira sve varijante svih komponenti za vizualnu provjeru
          prije rollouta.
        </p>
      </header>

      {/* ====================== PAGE TOP BAR ====================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">PageTopBar — VRH</h2>

        <div>
          <p className="mb-1 text-xs text-slate-400">VRH-VODIC-A (default)</p>
          <PageTopBar
            pageType="vodic"
            pageSlug="test-vodic"
            pageUrl="https://kvik.online/vodici/test-vodic"
            forceVariant="A"
          />
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">VRH-VODIC-B</p>
          <PageTopBar
            pageType="vodic"
            pageSlug="test-vodic"
            pageUrl="https://kvik.online/vodici/test-vodic"
            forceVariant="B"
          />
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">
            VRH-ALAT-A (default) — href override /alati/po-sd
          </p>
          <PageTopBar
            pageType="alat"
            pageSlug="po-sd"
            pageUrl="https://kvik.online/alati/po-sd"
            ctaHrefOverride="/alati/po-sd"
            forceVariant="A"
          />
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">VRH-ALAT-B</p>
          <PageTopBar
            pageType="alat"
            pageSlug="po-sd"
            pageUrl="https://kvik.online/alati/po-sd"
            ctaHrefOverride="/alati/po-sd"
            forceVariant="B"
          />
        </div>
      </section>

      {/* ====================== INLINE CTA ====================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">InlineCTA — SREDINA</h2>

        <div>
          <p className="mb-1 text-xs text-slate-400">Tema: po-sd</p>
          <InlineCTA tema="po-sd" pageSlug="test-vodic" />
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">Tema: razred</p>
          <InlineCTA tema="razred" pageSlug="test-vodic" />
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">Tema: doprinosi</p>
          <InlineCTA tema="doprinosi" pageSlug="test-vodic" />
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">Tema: interni-akt</p>
          <InlineCTA tema="interni-akt" pageSlug="test-vodic" />
        </div>
      </section>

      {/* ====================== BOTTOM CTA ====================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">BottomCTA — DNO</h2>

        <div>
          <p className="mb-1 text-xs text-slate-400">DNO-A (default svuda)</p>
          <BottomCTA pageType="vodic" pageSlug="test-vodic" forceVariant="A" />
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">DNO-B (test — &quot;Aktiviraj Kvik&quot;)</p>
          <BottomCTA pageType="vodic" pageSlug="test-vodic" forceVariant="B" />
        </div>

        <div>
          <p className="mb-1 text-xs text-slate-400">DNO-C (test — /asistent)</p>
          <BottomCTA pageType="vodic" pageSlug="test-vodic" forceVariant="C" />
        </div>
      </section>

      {/* ====================== FLOATING CTA ====================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">FloatingCTA — STICKY</h2>
        <p className="text-sm text-slate-400">
          Floating se inače pojavi nakon 30% scrolla i dismissable je. Ovdje je forsiran na vidljiv.
          Vidiš ga na dnu prozora.
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
          U produkciji: FLOATING-A na compliance vodičima i svim alatima; FLOATING-A/B random na
          how-to vodičima. Da bi se vidjele obje varijante, otvori /test-cta?force=B u DevToolsima
          ili promijeni `forceVariant` ispod ručno.
        </div>
        <FloatingCTA
          pageType="vodic"
          pageSlug="test-vodic"
          pageVariant="howto"
          forceVariant="A"
          forceVisible
        />
      </section>

      <footer className="border-t border-slate-800 pt-6 text-xs text-slate-500">
        Test stranica — noindex. Brisat će se ili sakriti nakon Sprinta 4. Kvik 2026.
      </footer>
    </main>
  );
}
