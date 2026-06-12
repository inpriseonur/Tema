const { expect } = require('@playwright/test');

const PRODUCT_PATH =
  process.env.PRODUCT_PATH ||
  '/products/san-pellegrino-dogal-mineralli-su-cam-sise-koli?variant=44854939058221';

const COLLECTION_PATH = process.env.COLLECTION_PATH || '/collections/all';

function monitorCriticalErrors(page) {
  const errors = [];
  const siteOrigin = new URL(process.env.BASE_URL).origin;
  const ignoredPageErrors = [
    /sandboxed and lacks the "allow-same-origin" flag/i,
    /accessing a frame with origin "https:\/\/pdp\.gokwik\.co"/i,
    /^Load failed$/i,
    /Cross-origin script load denied by Cross-Origin Resource Sharing policy/i,
  ];

  page.on('pageerror', (error) => {
    if (ignoredPageErrors.some((pattern) => pattern.test(error.message))) return;
    errors.push(`Page error: ${error.message}`);
  });

  page.on('response', (response) => {
    if (response.status() < 500) return;

    const responseURL = new URL(response.url());
    if (responseURL.origin === siteOrigin) {
      errors.push(`${response.status()} response: ${response.url()}`);
    }
  });

  return errors;
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(
    overflow.scrollWidth,
    `Horizontal overflow detected: ${overflow.scrollWidth}px > ${overflow.clientWidth}px`,
  ).toBeLessThanOrEqual(overflow.clientWidth + 2);
}

async function expectNoCriticalErrors(errors) {
  expect(errors, errors.join('\n')).toEqual([]);
}

module.exports = {
  COLLECTION_PATH,
  PRODUCT_PATH,
  expectNoCriticalErrors,
  expectNoHorizontalOverflow,
  monitorCriticalErrors,
};
