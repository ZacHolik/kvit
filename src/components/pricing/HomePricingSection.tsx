'use client';

import { useState } from 'react';

import type { BillingPlan } from '@/config/pricing';

import PricingPlanSelector from './PricingPlanSelector';

async function startCheckout(plan: BillingPlan) {
  const leadEmail =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('kvik_lead_email') ?? undefined
      : undefined;

  const res = await fetch('/api/stripe/checkout-anonymous', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, lead_email: leadEmail }),
  });
  const data = (await res.json()) as { url?: string };
  if (data.url) {
    window.location.href = data.url;
  }
}

/** Odjeljak Cijene na naslovnoj — isti selector kao /cijene i /register. */
export default function HomePricingSection() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = (plan: BillingPlan) => {
    setCheckoutLoading(true);
    void startCheckout(plan);
  };

  return (
    <PricingPlanSelector
      theme='cijene'
      defaultInterval='yearly'
      checkoutLoading={checkoutLoading}
      onCheckout={handleCheckout}
    />
  );
}
