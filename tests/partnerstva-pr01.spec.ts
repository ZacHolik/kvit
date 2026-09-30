import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const OUT = path.join(process.cwd(), 'artifacts', 'partnerstva-pr01');

test.describe('partnerstva PR01 (production)', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT, { recursive: true });
  });

  test('full page 1280px, no horizontal scroll at 390px, no Facebook', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    const fb: string[] = [];
    page.on('request', (req) => {
      const u = req.url();
      if (u.includes('connect.facebook.net') || u.includes('facebook.com/tr')) {
        fb.push(u);
      }
    });
    await page.goto('/partnerstva/PR01');
    await page.screenshot({
      path: path.join(OUT, 'partnerstva-pr01-1280.png'),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/partnerstva/PR01');
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(390);
    await page.screenshot({
      path: path.join(OUT, 'partnerstva-pr01-390.png'),
      fullPage: true,
    });
    expect(fb).toHaveLength(0);
    await context.close();
  });
});
