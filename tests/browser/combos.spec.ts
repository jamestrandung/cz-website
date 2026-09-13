import { test, expect } from '@playwright/test';
test('slider sits between Discovery and catalog and scrolls', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.deal-card')).toHaveCount(4);
  expect(
    await page
      .locator('.discovery')
      .evaluate(
        (e) =>
          !!(
            e.compareDocumentPosition(document.querySelector('#deals')!) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ),
      ),
  ).toBe(true);
  expect(
    await page
      .locator('#deals')
      .evaluate(
        (e) =>
          !!(
            e.compareDocumentPosition(document.querySelector('#catalog')!) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ),
      ),
  ).toBe(true);
  await page.locator('[data-deal-scroll="1"]').click();
  await expect
    .poll(() => page.locator('.deals-track').evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('combo choices preserve pricing, benefits, language and nested back navigation', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('.deal-card[data-combo="thu-gian"]').click();
  await expect(page.locator('.combo-price')).toContainText('90.000đ');
  await expect(page.locator('.combo-item[data-product="tra-sua-taro"]')).toContainText('+10.000đ');
  await page.locator('[data-combo-offer="tg2"]').click();
  await expect(page.locator('.combo-price')).toContainText('85.000đ');
  await expect(page.locator('.combo-item[data-product="tra-duong-nhan"]')).toContainText(
    '+10.000đ',
  );
  await expect(page.locator('.combo-item[data-product="tra-buoi"] .benefit')).toContainText(
    'Size M',
  );
  await page.locator('.combo-item[data-product="butter-floss-bread"]').click();
  await expect(page.locator('#detail-title')).toHaveText('Bánh mì bơ chà bông');
  await page.locator('.dialog-back').click();
  await expect(page.locator('[data-combo-offer="tg2"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.combo-item[data-product="butter-floss-bread"]')).toBeFocused();
  await page.locator('.dialog-languages [data-locale="en"]').click();
  await expect(page.locator('#combo-title')).toHaveText('Take a little break');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.deal-card[data-combo="thu-gian"]')).toBeFocused();
  expect(errors).toEqual([]);
});
test('product entry shows actual combo price and highlights eligible product', async ({ page }) => {
  await page.goto('/');
  await page.locator('.product-list [data-product="tra-sua-taro"]').click();
  const link = page.locator('.product-combo-link[data-combo="thu-gian"]');
  await expect(link).toContainText('100.000đ');
  await link.click();
  await expect(page.locator('.combo-item-highlight')).toContainText('Trà sữa khoai môn');
  await page.locator('.combo-item-highlight').click();
  await expect(page.locator('#detail-title')).toHaveText('Trà sữa khoai môn');
  await page.goBack();
  await expect(page.locator('#combo-title')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#detail-title')).toHaveText('Trà sữa khoai môn');
  await expect(link).toBeFocused();
  await page.locator('.dialog-close').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('[cà] title marker shows the logo mark on card, dialog and product link across languages', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.locator('.deal-card[data-combo="ca-dong"]');
  const cardMarks = card.locator('.deal-title .ca-mark').filter({ visible: true });
  await expect(cardMarks).toHaveCount(2);
  await expect(card).toHaveAccessibleName(/Cà\s*đông\s*cà\s*phê/);
  await page.locator('.header-controls [data-locale="en"]').click();
  await expect(card.locator('[data-locale-only="en"]')).toBeVisible();
  await expect(card.locator('[data-locale-only="en"]')).toHaveText('Better with company');
  await expect(cardMarks).toHaveCount(0);
  await page.locator('.header-controls [data-locale="vi"]').click();
  await expect(cardMarks).toHaveCount(2);
  await card.click();
  await expect(page.locator('#combo-title .ca-mark')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: /Cà\s*đông\s*cà\s*phê/ })).toBeVisible();
  await page.locator('.dialog-languages [data-locale="en"]').click();
  await expect(page.locator('#combo-title')).toHaveText('Better with company');
  await page.locator('.dialog-languages [data-locale="vi"]').click();
  await expect(page.locator('#combo-title .ca-mark')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await page.locator('.product-list [data-product="tra-sua-taro"]').click();
  await expect(page.locator('.product-combo-link[data-combo="ca-dong"] .ca-mark')).toHaveCount(2);
});
test('ST has no artificial S/M options and breakfast keeps sausage extra', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.locator('.deal-card[data-combo="sang-tao"]').click();
  await expect(page.locator('.combo-item[data-product="bac-xiu"]')).toContainText('M · Đá');
  await expect(page.locator('.combo-item[data-product="bac-xiu"]')).not.toContainText('S · Đá');
  await page.locator('[data-combo-offer="st2"]').click();
  await expect(page.locator('.combo-item[data-product="cacao-sua"]')).toHaveCount(0);
  await expect(page.locator('.combo-item[data-product="matcha-latte"]')).toContainText(
    'Đã bao gồm',
  );
  expect(await page.locator('.dialog-scroll').evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
    true,
  );
  await page.locator('.dialog-close').click();
  await page.locator('.deal-card[data-combo="op-la"]').click();
  await expect(page.locator('.combo-price')).toContainText('90.000đ');
  await expect(page.locator('.combo-extras .option-row').first()).toContainText('+10.000đ');
});
