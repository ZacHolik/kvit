/**
 * Stripe SDK wrappers.
 *
 * Server-side:  import { stripe } from '@/lib/stripe/client'
 * Client-side:  import { getStripeJs } from '@/lib/stripe/client'
 *
 * `stripe` is a lazy Proxy — the real Stripe instance is only created on
 * first property access, so importing this module never throws at build time
 * even when STRIPE_SECRET_KEY is absent.
 */

import Stripe from 'stripe';

// ─── Server-side Stripe client ───────────────────────────────────────────────

const g = globalThis as typeof globalThis & { _stripe?: Stripe };

function getStripeInstance(): Stripe {
  if (!g._stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('Missing env var: STRIPE_SECRET_KEY');
    g._stripe = new Stripe(key, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    });
  }
  return g._stripe;
}

// Proxy so callers can use `stripe.customers.create(...)` normally,
// but the actual instance is created lazily.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    const instance = getStripeInstance();
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

// ─── Client-side Stripe.js (lazy-loaded via @stripe/stripe-js) ──────────────

import type { Stripe as StripeJs } from '@stripe/stripe-js';

let stripeJsPromise: Promise<StripeJs | null> | null = null;

export function getStripeJs(): Promise<StripeJs | null> {
  if (stripeJsPromise) return stripeJsPromise;
  stripeJsPromise = import('@stripe/stripe-js').then(({ loadStripe }) => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Missing env var: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      return null;
    }
    return loadStripe(key);
  });
  return stripeJsPromise;
}
