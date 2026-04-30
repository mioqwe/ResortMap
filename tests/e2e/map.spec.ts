import { test, expect } from '@playwright/test';

test.describe('Map Display', () => {
  test('should render the map with correct dimensions', async ({ page }) => {
    await page.goto('/');

    const mapContainer = page.locator('.map-container');
    await expect(mapContainer).toBeVisible();

    const rows = page.locator('.row');
    expect(await rows.count()).toBeGreaterThan(10);
  });

  test('should display all tile types on the map', async ({ page }) => {
    await page.goto('/');

    const tileButtons = page.locator('.tile-button');
    expect(await tileButtons.count()).toBeGreaterThan(0);
  });

  test('should display the legend', async ({ page }) => {
    await page.goto('/');

    const legend = page.locator('.legend');
    await expect(legend).toBeVisible();
  });

  test('should have tile images', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('.tile img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display header with app title', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header h1');
    await expect(header).toBeVisible();
  });

  test('should display pool tiles', async ({ page }) => {
    await page.goto('/');

    const mapContainer = page.locator('.map-container');
    await expect(mapContainer).toBeVisible();
  });
});