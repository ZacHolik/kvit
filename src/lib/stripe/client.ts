/**
 * Stripe SDK wrappers.
 *
 * Server-side:  import { stripe } from '@/lib/stripe/client'
 * Client-side:  import { getStripeJs } from '@/lib/stripe/client'
 *
 * `stripe` (server) is a singleton to avoid creating a new instance on every
 * hot-reload in dev. Safe to import from API routes and Server Actions.
 */

import Stripe from 'stripe';

// ─── Server-side Stripe client (Node.js runtime only) ───────────────────────

const globalForStripe = globalThis as typeof globalThis & { _stripe?: Stripe };

if (!globalForStripe._stripe) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing env var: STRIPE_SECRET_KEY');
  }
  globalForStripe._stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // pin to the API version that matches stripe@22
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
  });
}

export const stripe: Stripe = globalForStripe._stripe;

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
