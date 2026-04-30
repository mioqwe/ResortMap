import { test, expect } from '@playwright/test';

const BOOKINGS = [
  { room: '101', guestName: 'Alice Smith' },
  { room: '201', guestName: 'Uma Lopez' },
  { room: '301', guestName: 'Oscar Morris' },
  { room: '401', guestName: 'Ivan Brooks' },
  { room: '501', guestName: 'Derek Foster' }
];

async function getCabanaButtonWithState(page: any, findBooked: boolean = false): Promise<number> {
  return page.evaluate(async (findBookedParam: boolean) => {
    const buttons = Array.from(document.querySelectorAll('.tile-button'));
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      const tileDiv = btn.querySelector('.tile');
      if (tileDiv) {
        const isBooked = tileDiv.classList.contains('booked');
        const hasCabanaImg = btn.querySelector('img[alt="W"]');
        if (hasCabanaImg && isBooked === findBookedParam) {
          return i;
        }
      }
    }
    return -1;
  }, findBooked);
}

async function getFirstAvailableCabanaButtonIndex(page: any): Promise<number> {
  return getCabanaButtonWithState(page, false);
}

async function getFirstBookedCabanaButtonIndex(page: any): Promise<number> {
  return getCabanaButtonWithState(page, true);
}

test.describe('CabanaPopup E2E Tests - Successful Booking Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open popup when clicking available cabana', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('input#room')).toBeVisible();
    await expect(page.locator('input#guestName')).toBeVisible();
  });

  test('should book cabana with valid credentials from bookings.json (room 101)', async ({ page }) => {
    const booking = BOOKINGS[0]; // { room: '101', guestName: 'Alice Smith' }
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.message.success')).toContainText('booked successfully');
  });

  test('should book cabana with valid credentials (room 201)', async ({ page }) => {
    const booking = BOOKINGS[1]; // { room: '201', guestName: 'Uma Lopez' }
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.message.success')).toContainText('booked successfully');
  });

  test('should close popup after successful booking', async ({ page }) => {
    const booking = BOOKINGS[2]; // { room: '301', guestName: 'Oscar Morris' }
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });
    
    // Wait for popup to close
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('should clear form fields after successful booking and popup close', async ({ page }) => {
    const booking = BOOKINGS[3]; // { room: '401', guestName: 'Ivan Brooks' }
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });

    // Click on another cabana to verify form is reset
    const anotherCabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    if (anotherCabanaIdx >= 0) {
      const anotherButton = page.locator('.tile-button').nth(anotherCabanaIdx);
      await anotherButton.click();
      await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });
      
      const roomValue = await page.locator('input#room').inputValue();
      const guestValue = await page.locator('input#guestName').inputValue();
      expect(roomValue).toBe('');
      expect(guestValue).toBe('');
    }
  });
});

test.describe('CabanaPopup E2E Tests - Already Booked Cabana', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show "not available" when clicking booked cabana', async ({ page }) => {
    // First, book a cabana
    const booking = BOOKINGS[4]; // { room: '501', guestName: 'Derek Foster' }
    let cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    let cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });

    // Now try to click the same (now booked) cabana
    cabanaIdx = await getFirstBookedCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();

    // Should show info message "not available" instead of opening popup
    await page.waitForSelector('.message.info', { state: 'visible', timeout: 5000 });
    await expect(page.locator('.message.info')).toContainText('not available');
  });

  test('should NOT open popup when clicking booked cabana', async ({ page }) => {
    // First, book a cabana
    const booking = BOOKINGS[0]; // { room: '101', guestName: 'Alice Smith' }
    let cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    let cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });

    // Now try to click the same (now booked) cabana
    cabanaIdx = await getFirstBookedCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();

    // Wait a bit to ensure popup doesn't open
    await page.waitForTimeout(500);
    const modalVisible = await page.locator('.modal-overlay').isVisible();
    expect(modalVisible).toBe(false);
  });

  test('should display booked visual state on cabana', async ({ page }) => {
    // First, book a cabana
    const booking = BOOKINGS[1]; // { room: '201', guestName: 'Uma Lopez' }
    let cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    let cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });

    // Find the booked cabana and verify it has .booked class
    cabanaIdx = await getFirstBookedCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const bookedTile = page.locator('.tile-button').nth(cabanaIdx).locator('.tile');
    await expect(bookedTile).toHaveClass(/booked/);
    
    // Verify the booked overlay (X mark) is visible
    const bookedOverlay = bookedTile.locator('.booked-overlay');
    await expect(bookedOverlay).toBeVisible();
  });
});

test.describe('CabanaPopup E2E Tests - Invalid Credentials', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show error message for invalid room number', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
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

  test('should show error message for room that exists but name does not match', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    // Room 101 exists but name is wrong
    await page.locator('input#room').fill('101');
    await page.locator('input#guestName').fill('Wrong Name');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.error', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.message.error')).toContainText('Invalid');
  });

  test('should keep popup open after invalid credentials error', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill('999');
    await page.locator('input#guestName').fill('Invalid Guest');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.error', { state: 'visible', timeout: 10000 });

    // Popup should still be visible
    await expect(page.locator('.modal-overlay')).toBeVisible();
  });

  test('should preserve form fields after invalid credentials error', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill('999');
    await page.locator('input#guestName').fill('Invalid Guest');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.error', { state: 'visible', timeout: 10000 });

    // Verify form fields are preserved
    const roomValue = await page.locator('input#room').inputValue();
    const guestValue = await page.locator('input#guestName').inputValue();
    expect(roomValue).toBe('999');
    expect(guestValue).toBe('Invalid Guest');
  });

  test('should allow retry with valid credentials after invalid attempt', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    // First try with invalid
    await page.locator('input#room').fill('999');
    await page.locator('input#guestName').fill('Invalid Guest');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.error', { state: 'visible', timeout: 10000 });

    // Now correct with valid data
    await page.locator('input#room').fill('101');
    await page.locator('input#guestName').fill('Alice Smith');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.message.success')).toContainText('booked successfully');
  });
});

test.describe('CabanaPopup E2E Tests - Form Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show error when submitting with empty room field', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    // Leave room empty, fill name
    await page.locator('input#guestName').fill('Alice Smith');
    await page.locator('button[type="submit"]').click();

    // Should show validation error (not API error)
    await page.waitForSelector('.error', { state: 'visible', timeout: 5000 });
    await expect(page.locator('.error')).toContainText('Please enter both');
  });

  test('should show error when submitting with empty guest name field', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    // Fill room, leave name empty
    await page.locator('input#room').fill('101');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.error', { state: 'visible', timeout: 5000 });
    await expect(page.locator('.error')).toContainText('Please enter both');
  });

  test('should show error when submitting with empty room and name', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    // Click submit without filling anything
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.error', { state: 'visible', timeout: 5000 });
    await expect(page.locator('.error')).toContainText('Please enter both');
  });

  test('should show error when submitting with whitespace-only fields', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill('   ');
    await page.locator('input#guestName').fill('   ');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.error', { state: 'visible', timeout: 5000 });
    await expect(page.locator('.error')).toContainText('Please enter both');
  });

  test('should preserve form fields after validation error', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    // Fill with whitespace
    await page.locator('input#room').fill('   ');
    await page.locator('input#guestName').fill('   ');
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('.error', { state: 'visible', timeout: 5000 });

    // Verify fields are preserved (with whitespace)
    const roomValue = await page.locator('input#room').inputValue();
    const guestValue = await page.locator('input#guestName').inputValue();
    expect(roomValue).toBe('   ');
    expect(guestValue).toBe('   ');
  });
});

test.describe('CabanaPopup E2E Tests - Cancel and Close Behavior', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should close popup when clicking cancel button', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('button.cancel').click();
    
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('should clear form fields when clicking cancel', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    // Fill some data
    await page.locator('input#room').fill('101');
    await page.locator('input#guestName').fill('Alice Smith');

    await page.locator('button.cancel').click();
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });

    // Open popup again to verify fields are cleared
    const newCabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    if (newCabanaIdx >= 0) {
      const newButton = page.locator('.tile-button').nth(newCabanaIdx);
      await newButton.click();
      await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

      const roomValue = await page.locator('input#room').inputValue();
      const guestValue = await page.locator('input#guestName').inputValue();
      expect(roomValue).toBe('');
      expect(guestValue).toBe('');
    }
  });

  test('should close popup when pressing Escape key', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.keyboard.press('Escape');
    
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('should close popup when clicking X button', async ({ page }) => {
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('.close-btn').click();
    
    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });
});

test.describe('CabanaPopup E2E Tests - Loading State', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show "Booking..." text on submit button while submitting', async ({ page }) => {
    const booking = BOOKINGS[0];
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);

    // Submit and wait for success - the button text during submission is transient
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });

    // Verify final state shows success and popup closes
    const buttonText = await page.locator('button[type="submit"]').count();
    expect(buttonText).toBe(0); // Button no longer visible (popup closed)
  });

  test('should disable form inputs while submitting', async ({ page }) => {
    const booking = BOOKINGS[2];
    const cabanaIdx = await getFirstAvailableCabanaButtonIndex(page);
    expect(cabanaIdx).toBeGreaterThanOrEqual(0);

    const cabanaButton = page.locator('.tile-button').nth(cabanaIdx);
    await cabanaButton.click();
    await page.waitForSelector('.modal-overlay', { state: 'visible', timeout: 10000 });

    await page.locator('input#room').fill(booking.room);
    await page.locator('input#guestName').fill(booking.guestName);

    // Submit and verify it completes successfully
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector('.message.success', { state: 'visible', timeout: 10000 });

    // After successful booking, inputs should not be visible (popup closed)
    const inputsVisible = await page.locator('input#room').count();
    expect(inputsVisible).toBe(0);
  });
});