import { test, expect } from '@playwright/test';

test('catalog renders without overflow and contains every imported item', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/');
  await expect(page.locator('.product-list [data-product]')).toHaveCount(50);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('h1')).toContainText('Đúng gu bạn');
  expect(errors).toEqual([]);
});

test('category anchors, manual scrolling and horizontal active-tab visibility', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-category="food"]').click();
  await expect(page.locator('[data-category="food"]')).toHaveAttribute('aria-current', 'true');
  await expect
    .poll(async () =>
      page.locator('#food').evaluate((e) => Math.round(e.getBoundingClientRect().top)),
    )
    .toBeLessThan(110);
  await page.waitForTimeout(900);
  await page.evaluate(() =>
    window.scrollTo({
      top: document.querySelector('#sweet')!.getBoundingClientRect().top + scrollY - 80,
      behavior: 'instant',
    }),
  );
  await expect(page.locator('[data-category="sweet"]')).toHaveAttribute('aria-current', 'true');
  await expect
    .poll(async () =>
      page.locator('[data-category="sweet"]').evaluate((e) => {
        const r = e.getBoundingClientRect(),
          t = e.parentElement!.getBoundingClientRect();
        return r.left >= t.left - 1 && r.right <= t.right + 1;
      }),
    )
    .toBe(true);
});

test('details show real option shapes and closing restores catalog position', async ({ page }) => {
  await page.goto('/');
  const row = page.locator('.product-list [data-product="matcha-latte"]');
  await row.scrollIntoViewIfNeeded();
  const scroll = await page.evaluate(() => scrollY);
  await row.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#detail-panel')).toContainText('Đổi sữa yến mạch miễn phí');
  await expect(page.locator('#detail-panel')).toContainText('Nóng');
  await expect(page.locator('#detail-panel')).not.toContainText('Tạm hết');
  await page.locator('.dialog-close').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => scrollY)) - scroll))
    .toBeLessThan(3);
  await expect(row).toBeFocused();
});

test('search, nested details and browser Back preserve results and close the overlay', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-search]').click();
  await page.locator('#search-input').fill('ca phe muoi');
  await expect(page.locator('#search-results [data-product]')).toHaveCount(1);
  await page.locator('#search-results [data-product]').click();
  await expect(page.locator('#detail-title')).toHaveText('Cà phê muối Huế');
  await page.goBack();
  await expect(page.locator('#search-input')).toBeVisible();
  await expect(page.locator('#search-input')).toHaveValue('ca phe muoi');
  await page.goBack();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('language persists and updates search, details and availability labels', async ({ page }) => {
  await page.goto('/');
  await page.locator('.header-controls [data-locale="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('Your kind of sip');
  await page.reload();
  await expect(page.locator('[data-category="coffee"]')).toHaveText('Coffee');
  await page.locator('[data-search]').click();
  await page.locator('#search-input').fill('cacao');
  await expect(page.locator('#search-results')).toContainText('Oreo cacao');
  await expect(page.locator('#search-results')).not.toContainText('Unavailable');
  await page.locator('#search-results [data-product="cacao-oreo"]').click();
  await expect(page.locator('#detail-panel')).toContainText('Free oat milk swap');
  await page.locator('.dialog-languages [data-locale="vi"]').click();
  await expect(page.locator('#detail-panel')).toContainText('Đổi sữa yến mạch miễn phí');
  await expect(page.locator('.dialog-close')).toHaveAttribute('aria-label', 'Đóng');
  await page.locator('.dialog-close').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('body')).not.toHaveAttribute('style', /position: fixed/);
});

test('320px layout remains readable and storage failure does not break the menu', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Storage disabled');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Storage disabled');
    };
  });
  await page.goto('/');
  await page.locator('.header-controls [data-locale="en"]').click();
  await expect(page.locator('h1')).toContainText('Your kind of sip');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('[data-search]').click();
  await page.locator('#search-input').fill('matcha');
  await expect(page.locator('#search-results [data-product="matcha-latte"]')).toBeVisible();
});

test('unaccented search has clear empty and no-results states', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-search]').click();
  await expect(page.locator('.search-feedback')).toContainText('Thử');
  await page.locator('#search-input').fill('xxxxzzzz');
  await expect(page.locator('#search-results')).toContainText('Chưa tìm thấy');
  await page.locator('.search-clear').click();
  await expect(page.locator('#search-input')).toHaveValue('');
  await page.locator('#search-input').fill('den');
  await expect(page.locator('#search-results')).toContainText('Phin đen');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('core Vietnamese menu is readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://localhost:4321');
  await expect(page.locator('.product-list [data-product]')).toHaveCount(50);
  await expect(page.locator('[data-category="tea"]')).toHaveAttribute('href', '#tea');
  await context.close();
});

test('free topping details show all seven options for M and supplied links are present', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.product-list [data-product="tra-buoi"]').click();
  await expect(page.locator('#detail-panel')).toContainText('Topping miễn phí · Size M');
  await expect(page.locator('#detail-panel .option-row')).toHaveCount(7);
  await expect(page.locator('#detail-panel')).toContainText('Hạt đác');
  await expect(page.locator('#detail-panel .variant-row').first()).not.toContainText('Tặng kèm');
  await page.locator('.dialog-close').click();
  await expect(page.locator('.location-links a')).toHaveCount(2);
  await expect(page.locator('a[href="https://facebook.com/cazone.saigon"]')).toBeVisible();
});

test('photo thumbnails stay small and detail photos load on demand with hot/cold switching', async ({
  page,
}) => {
  const photoRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/images/products/')) photoRequests.push(request.url());
  });
  await page.goto('/');
  const row = page.locator('.product-list [data-product="matcha-latte"]');
  await row.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      row.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  expect(photoRequests.some((url) => /-(800|1200)-/.test(url))).toBe(false);
  await expect(row.locator('img')).toHaveAttribute('srcset', /240w, .*480w/);
  await row.click();
  const detail = page.locator('.detail-art img');
  await expect
    .poll(() =>
      detail.evaluate(
        (img: HTMLImageElement) =>
          img.complete && img.naturalWidth > 0 && /-(800|1200)-/.test(img.currentSrc),
      ),
    )
    .toBe(true);
  await expect(detail).toHaveAttribute('alt', 'Matcha latte · Đá');
  await page.locator('[data-photo-index="1"]').click();
  await expect(detail).toHaveAttribute('alt', 'Matcha latte · Nóng');
  await expect(page.locator('[data-photo-index="1"]')).toBeFocused();
  await page.locator('.dialog-languages [data-locale="en"]').click();
  await expect(detail).toHaveAttribute('alt', 'Matcha latte · Hot');
  await expect(page.locator('[data-photo-index="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#detail-panel')).toContainText('60.000đ');
  await page.locator('.dialog-close').click();
  await expect(row).toBeFocused();
});

test('missing photos use a compact bilingual placeholder and search uses optimized images', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.product-list [data-product="ca-phe-oreo"]').click();
  await expect(page.locator('.detail-placeholder')).toContainText('Ảnh đang cập nhật');
  await expect(page.locator('.detail-art')).toHaveCount(0);
  await page.locator('.dialog-languages [data-locale="en"]').click();
  await expect(page.locator('.detail-placeholder')).toContainText('Photo coming soon');
  await page.locator('.dialog-close').click();
  await page.locator('[data-search]').click();
  await page.locator('#search-input').fill('bac xiu');
  const image = page.locator('#search-results [data-product="bac-xiu"] img');
  await expect(image).toHaveAttribute('srcset', /240w, .*480w/);
  await expect
    .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
    .toBe(true);
});
