# Prime Gurme Playwright Tests

These tests require a Shopify preview theme URL through `BASE_URL`. They do not
fall back to the live storefront.

## Install

```powershell
npm install
npm run test:install-browsers
```

## Run

```powershell
$env:BASE_URL="https://example.shopifypreview.com"
npm test
npm run test:smoke
npm run test:desktop
npm run test:mobile
npm run test:ui
```

Open the latest HTML report:

```powershell
npm run test:report
```

## Preview Theme

```powershell
$env:BASE_URL="https://example.shopifypreview.com"
npm run test:smoke
```

## Optional Overrides

```powershell
$env:PRODUCT_PATH="/products/example?variant=123"
$env:EXPECTED_VARIANT_TITLE="24'lu Koli"
$env:COLLECTION_PATH="/collections/all"
npm run test:smoke
```

`EXPECTED_VARIANT_TITLE` is optional. Set it when validating that a variant URL
renders the expected variant text in the server-rendered H1.

Every Playwright test runs in an isolated browser context. The cart test verifies
that the cart drawer opens and the cart counter increases after clicking the
product CTA.
