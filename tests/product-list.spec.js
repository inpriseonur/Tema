const { test, expect } = require('@playwright/test');
const {
  COLLECTION_PATH,
  expectNoCriticalErrors,
  expectNoHorizontalOverflow,
  monitorCriticalErrors,
} = require('./helpers');

test.describe('Product lists', () => {
  test('@smoke renders usable product cards without horizontal overflow', async ({ page }) => {
    const criticalErrors = monitorCriticalErrors(page);

    await page.goto(COLLECTION_PATH, { waitUntil: 'domcontentloaded' });

    const productCards = page.locator('.single-product-wrap');
    await expect(productCards.first()).toBeVisible();
    expect(await productCards.count()).toBeGreaterThan(0);

    await expectNoHorizontalOverflow(page);
    await expectNoCriticalErrors(criticalErrors);
  });

  test('@smoke exposes product-detail action on desktop cards', async ({ page, viewport }) => {
    test.skip(!viewport || viewport.width < 1200, 'Desktop-only product-card action check');

    await page.goto(COLLECTION_PATH, { waitUntil: 'domcontentloaded' });

    const firstCard = page.locator('.single-product-wrap').first();
    await firstCard.hover();

    const detailAction = firstCard.locator('.product-card-detail-action');
    await expect(detailAction).toBeVisible();
    await expect(detailAction).toHaveAttribute('href', /\/products\//);
    await expect(firstCard.locator('.product-card-cart-action')).toBeHidden();
  });
});
