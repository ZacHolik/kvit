import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const OUT = path.join(process.cwd(), 'artifacts', 'pricing-visual');

test.describe('pricing visual proof (production)', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT, { recursive: true });
  });

  for (const width of [1280, 390] as const) {
    test(`home #cijene @ ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
      });
      const page = await context.newPage();
      await page.goto('/#cijene');
      await page.waitForSelector('#cijene');
      const pricing = page.locator('#cijene .max-w-md').first();
      await expect(pricing.getByRole('button', { name: /Godišnje/i })).toHaveClass(/bg-\[#0d9488\]/);
      await pricing.screenshot({ path: path.join(OUT, `home-${width}.png`) });
      await context.close();
    });

    test(`/cijene block @ ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
      });
      const page = await context.newPage();
      await page.goto('/cijene');
      const pricing = page.locator('main .max-w-md').first();
      await expect(pricing.getByRole('button', { name: /Godišnje/i })).toHaveClass(/bg-\[#0d9488\]/);
      await pricing.screenshot({ path: path.join(OUT, `cijene-${width}.png`) });
      await context.close();
    });
  }

  test('floating CTA promo on pausalni-obrt-vodic @ 1280px', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    await page.goto('/vodici/pausalni-obrt-vodic');
    await page.evaluate(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, h * 0.35);
    });
    const bar = page.locator('[data-cta-position="floating"]');
    await expect(bar).toBeVisible({ timeout: 15000 });
    await expect(bar.getByRole('link')).toContainText(/PROMO26.*72/);
    await bar.screenshot({ path: path.join(OUT, 'floating-vodic-1280.png') });
    await context.close();
  });
});
