const { test, expect } = require('@playwright/test');
const { PRODUCT_PATH } = require('./helpers');

test.describe('Cart', () => {
  test('@smoke adds the selected product variant to cart', async ({ page }) => {
    await page.goto(PRODUCT_PATH, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(customElements.get('cart-action')));

    const addToCart = page.locator('cart-action.product-form .ajax-cart-btn:visible').first();
    await expect(addToCart).toBeVisible();

    const [addResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().includes('/cart/add')),
      addToCart.click(),
    ]);

    expect(addResponse.ok()).toBeTruthy();
    await expect(page.locator('ajax-cart')).toHaveClass(/active/);
  });
});
