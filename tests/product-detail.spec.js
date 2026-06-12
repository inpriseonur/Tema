const { test, expect } = require('@playwright/test');
const {
  PRODUCT_PATH,
  expectNoCriticalErrors,
  expectNoHorizontalOverflow,
  monitorCriticalErrors,
} = require('./helpers');

test.describe('Product detail', () => {
  test('@smoke loads the primary purchase experience', async ({ page }) => {
    const criticalErrors = monitorCriticalErrors(page);

    await page.goto(PRODUCT_PATH, { waitUntil: 'domcontentloaded' });

    const title = page.locator('h1[data-product-variant-title]');
    await expect(title).toBeVisible();
    await expect(title).not.toHaveText('');
    await expect(page.locator('.product_img_top')).toBeVisible();
    await expect(page.locator('cart-action.product-form .ajax-cart-btn:visible').first()).toBeVisible();

    const expectedVariantTitle = process.env.EXPECTED_VARIANT_TITLE;
    if (expectedVariantTitle) {
      await expect(title).toContainText(expectedVariantTitle);
    }

    await expectNoHorizontalOverflow(page);
    await expectNoCriticalErrors(criticalErrors);
  });

  test('@smoke keeps the desktop product layout stable when opening packaging video', async ({
    page,
    viewport,
  }) => {
    test.skip(!viewport || viewport.width < 1200, 'Desktop-only gallery stability check');

    await page.goto(PRODUCT_PATH, { waitUntil: 'domcontentloaded' });

    const videoCTA = page.locator('[data-packaging-video-cta]').first();
    test.skip((await videoCTA.count()) === 0, 'The configured product has no packaging video CTA');

    const relatedHeading = page.locator('relative-pro, .related-product, #related-slider').first();
    test.skip((await relatedHeading.count()) === 0, 'No related-products anchor is available');

    const before = await relatedHeading.evaluate((element) => element.getBoundingClientRect().top);
    await videoCTA.click();
    await page.waitForTimeout(700);
    const after = await relatedHeading.evaluate((element) => element.getBoundingClientRect().top);

    expect(Math.abs(after - before), `Related products moved by ${after - before}px`).toBeLessThanOrEqual(3);
  });
});
