import { test, expect } from '@playwright/test';

async function getFirstCabanaButtonIndex(page: any): Promise<number> {
  return page.evaluate(async () => {
    const buttons = Array.from(document.querySelectorAll('.tile-button'));
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      const imgs = btn.querySelectorAll('img');
      for (const img of imgs) {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        if (src && src.includes('cabana') && alt === 'W') {
          return i;
        }
      }
    }
    return -1;
  });
}

test.describe('Cabana Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the map with all tile types', async ({ page }) => {
    await expect(page.locator('.map')).toBeVisible();
    await expect(page.locator('.row').first()).toBeVisible();
  });

  test('should open booking popup when clicking available cabana', async ({ page }) => {
    const cabanaIdx = await getFirstCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('input#room')).toBeVisible();
    await expect(page.locator('input#guestName')).toBeVisible();
  });

  test('should book a cabana with valid credentials', async ({ page }) => {
    const cabanaIdx = await getFirstCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill('101');
    await page.locator('input#guestName').fill('Alice Smith');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.message.success')).toBeVisible();
  });

  test('should show cabana as booked after successful booking', async ({ page }) => {
    const cabanaIdx = await getFirstCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill('101');
    await page.locator('input#guestName').fill('Alice Smith');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });

    await cabanaButton.click();
    await page.waitForSelector('.message.info', { state: 'visible', timeout: 5000 });
    await expect(page.locator('.message.info')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const cabanaIdx = await getFirstCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill('999');
    await page.locator('input#guestName').fill('Invalid Guest');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.error', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.message.error')).toBeVisible();
  });

  test('should close popup when clicking cancel button', async ({ page }) => {
    const cabanaIdx = await getFirstCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await expect(page.locator('.modal-overlay')).toBeVisible();
    await page.locator('button.cancel').click();
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });
});