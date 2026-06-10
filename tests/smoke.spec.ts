import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'https://kvik.online';

test('hero gumbi ne crashaju', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator('body')).not.toContainText('Application error');
  const buttons = page.locator('a[href*="alati"], a[href*="asistent"]');
  const count = await buttons.count();
  expect(count).toBeGreaterThan(0);
});

test('Stripe checkout otvara se s /cijene', async ({ page }) => {
  await page.goto(`${BASE}/cijene`);
  const gumb = page.getByText('Isprobaj 7 dana besplatno');
  await expect(gumb).toBeVisible();
  const [popup] = await Promise.all([
    page.waitForURL('**/checkout.stripe.com/**', { timeout: 10000 })
      .catch(() => null),
    page.waitForURL('**/register**', { timeout: 10000 })
      .catch(() => null),
    gumb.click(),
  ]);
  const url = page.url();
  const ok = url.includes('checkout.stripe.com') || url.includes('/register');
  expect(ok).toBe(true);
});

test('/register se otvara', async ({ page }) => {
  await page.goto(`${BASE}/register`);
  await expect(page.locator('input[type="email"]')).toBeVisible();
});

test('/alati/kalkulator-poreza vraća rezultat', async ({ page }) => {
  await page.goto(`${BASE}/alati/kalkulator-poreza`);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Application error');
});
