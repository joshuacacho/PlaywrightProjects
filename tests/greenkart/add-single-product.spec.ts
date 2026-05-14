// spec: tests/greenkart-basic-operations.plan.md
// seed: tests/seedfromScratch.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Discovery and Cart Management', () => {
  test('Add single product to cart', async ({ page }) => {
    // Navigate to the GreenKart home page
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

    // Click the 'ADD TO CART' button for Broccoli
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();

    // Verify Items counter displays 1
    await expect(page.getByRole('cell', { name: '1', exact: true })).toBeVisible();

    // Verify Price counter displays 120
    await expect(page.getByRole('cell', { name: '120' })).toBeVisible();
  });
});
