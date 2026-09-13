import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { menu, discovery, locations, externalActions } from '../src/data/menu';
import {
  menuSchema,
  searchProducts,
  priceLabel,
  isAvailable,
  splitCaMark,
  stripCaMark,
} from '../src/domain/menu';
import { categoryProducts } from '../src/domain/presentation';
import { caMarkHtml } from '../src/components/caMark';

test('Signatures lead Coffee and drinks sort by their displayed first-variant price', () => {
  assert.deepEqual(
    menu.categories.slice(0, 2).map((c) => c.id),
    ['signature', 'coffee'],
  );
  const before = JSON.stringify(menu);
  assert.equal(categoryProducts(menu, 'coffee')[0].id, 'phin-cam');
  for (const id of ['signature', 'coffee', 'tea', 'milk-tea', 'matcha', 'healthy']) {
    const prices = categoryProducts(menu, id).map((p) => p.variants[0].price);
    assert.deepEqual(
      prices,
      [...prices].sort((a, b) => b - a),
    );
  }
  assert.deepEqual(
    categoryProducts(menu, 'tea').map((p) => p.id),
    ['thanh-tra-mat-ong', 'tra-buoi', 'tra-chanh-day', 'tra-dao-sa', 'tra-thanh-vai'],
  );
  for (const id of ['food', 'sweet', 'toppings']) {
    assert.deepEqual(
      categoryProducts(menu, id),
      menu.products.filter((p) => p.categoryId === id),
    );
  }
  assert.equal(JSON.stringify(menu), before);
});

test('Vietnamese search handles diacritics, đ, whitespace, and English', () => {
  assert.ok(searchProducts(menu, '  CA PHE   MUOI ').some((p) => p.id === 'ca-phe-muoi'));
  assert.ok(searchProducts(menu, 'den').some((p) => p.id === 'phin-den'));
  assert.ok(searchProducts(menu, 'white coffee').some((p) => p.id === 'bac-xiu'));
  assert.deepEqual(searchProducts(menu, '  '), []);
  assert.deepEqual(searchProducts(menu, 'zxqv-nothing'), []);
});
test('catalog prices use the first variant in editorial order', () => {
  assert.equal(priceLabel(menu.products.find((p) => p.id === 'bac-xiu')!), '55.000đ');
  assert.equal(priceLabel(menu.products.find((p) => p.id === 'matcha-latte')!), '60.000đ');
  assert.equal(priceLabel(menu.products.find((p) => p.id === 'sausage')!), '60.000đ');
  const reordered = structuredClone(menu.products.find((p) => p.id === 'bac-xiu')!);
  [reordered.variants[0], reordered.variants[1]] = [reordered.variants[1], reordered.variants[0]];
  assert.equal(priceLabel(reordered), '60.000đ');
});
test('an unavailable variant leaves the product available if another is available', () => {
  const p = structuredClone(menu.products.find((p) => p.id === 'matcha-latte')!);
  assert.equal(isAvailable(p), true);
  p.variants.forEach((v) => (v.availability = 'unavailable'));
  assert.equal(isAvailable(p), false);
  const unavailable = structuredClone(menu.products.find((p) => p.id === 'cacao-oreo')!);
  unavailable.availability = 'unavailable';
  assert.equal(isAvailable(unavailable), false);
  assert.ok(searchProducts(menu, 'cacao').some((p) => p.id === 'cacao-oreo'));
});
test('schema rejects bad prices, IDs, translations, and category references', () => {
  for (const modify of [
    (m: typeof menu) => {
      m.products[0].variants[0].price = -1;
    },
    (m: typeof menu) => {
      m.products[0].variants[0].price = 100.5;
    },
    (m: typeof menu) => {
      m.products[0].name.en = '';
    },
    (m: typeof menu) => {
      m.products[0].categoryId = 'unknown';
    },
    (m: typeof menu) => {
      m.products[1].id = m.products[0].id;
    },
    (m: typeof menu) => {
      m.products[0].variants[1].id = m.products[0].variants[0].id;
    },
  ]) {
    const m = structuredClone(menu);
    modify(m);
    assert.equal(menuSchema.safeParse(m).success, false);
  }
});
test('[cà] logo marker ignores case and composition, escapes copy, and is rejected in product copy', () => {
  assert.deepEqual(splitCaMark('[Cà] đông [cà] phê'), ['', 'Cà', ' đông ', 'cà', ' phê']);
  assert.equal(stripCaMark('[CÀ][ca\u0300] phê'), 'CÀcà phê');
  assert.equal(stripCaMark('Cà [ca] phê'), 'Cà [ca] phê');
  assert.equal(caMarkHtml('a & b'), 'a &amp; b');
  assert.match(
    caMarkHtml('<b>[cà]</b>'),
    /^&lt;b&gt;<span class="sr-only">cà<\/span><svg class="ca-mark"[^]*<\/svg>&lt;\/b&gt;$/,
  );
  const m = structuredClone(menu);
  m.products[0].description.vi = 'Thêm [cà] sữa';
  assert.match(menuSchema.safeParse(m).error!.message, /only allowed in campaign titles/);
});
test('free topping benefits cover all seven toppings on the qualifying M variant', () => {
  const m = structuredClone(menu);
  const matcha = m.products.find((p) => p.id === 'matcha-latte')!;
  matcha.variants[0].benefits[0].choiceIds = ['nonexistent'];
  assert.equal(menuSchema.safeParse(m).success, false);
  const tea = menu.products.find((p) => p.id === 'tra-buoi')!;
  assert.equal(tea.variants[0].benefits.length, 0);
  assert.equal(tea.variants[1].benefits[0].kind, 'included-choice');
  assert.equal(tea.variants[1].benefits[0].choiceIds?.length, 7);
  assert.ok(tea.variants[1].benefits[0].choiceIds?.includes('palm-seed'));
  assert.deepEqual(tea.optionGroups[0].variantIds, ['m']);
});
test('option selection bounds are validated', () => {
  const m = structuredClone(menu);
  const group = m.products.find((p) => p.id === 'sausage')!.optionGroups[0];
  group.maxSelections = 1;
  group.minSelections = 3;
  assert.equal(menuSchema.safeParse(m).success, false);
});
test('all prototype images and Discovery destinations exist', () => {
  for (const p of menu.products) assert.ok(existsSync(`public${p.image}`), p.image);
  assert.ok(menu.categories.some((c) => c.id === discovery.targetCategory));
  for (const id of discovery.featuredProductIds) assert.ok(menu.products.some((p) => p.id === id));
});

test('complete PDF import contains 50 items, 68 variants, and nine original groups', () => {
  assert.equal(menu.contentStatus, 'pdf-imported');
  assert.equal(menu.products.length, 50);
  assert.equal(
    menu.products.reduce((n, p) => n + p.variants.length, 0),
    68,
  );
  assert.deepEqual(
    menu.categories.map((c) => menu.products.filter((p) => p.categoryId === c.id).length),
    [5, 5, 5, 5, 6, 5, 6, 6, 7],
  );
  assert.ok(
    menu.products.every(
      (p) => isAvailable(p) && p.variants.every((v) => v.availability === 'available'),
    ),
  );
});

test('oat milk and free toppings are restricted to the products marked in the PDF', () => {
  const withOat = menu.products
    .filter((p) => p.optionGroups.some((g) => g.id === 'milk'))
    .map((p) => p.id)
    .sort();
  assert.deepEqual(withOat, ['cacao-oreo', 'cacao-sua', 'matcha-latte', 'matcha-oreo']);
  const free = menu.products.filter((p) => p.optionGroups.some((g) => g.id === 'free-toppings'));
  assert.deepEqual(free.map((p) => p.id).sort(), [
    'tra-buoi',
    'tra-chanh-atiso',
    'tra-dao-sa',
    'tra-nhai-macchiato',
    'tra-sua-hanh-nhan',
    'tra-sua-nhai',
    'tra-sua-olong',
    'tra-thanh-vai',
  ]);
  for (const p of free) {
    assert.ok(p.variants.filter((v) => v.id !== 'm').every((v) => v.benefits.length === 0));
    assert.equal(p.optionGroups[0].choices.length, 7);
    assert.ok(p.optionGroups[0].choices.every((c) => c.priceDelta === 0));
  }
});

test('PDF exceptions retain their prices, sizes, food extras, and preparation times', () => {
  const get = (id: string) => menu.products.find((p) => p.id === id)!;
  assert.equal(get('palm-seed').variants[0].price, 15000);
  assert.ok(
    menu.products
      .filter((p) => p.categoryId === 'toppings' && p.id !== 'palm-seed')
      .every((p) => p.variants[0].price === 10000),
  );
  assert.deepEqual(
    get('da-me').variants.map((v) => [v.attributes.size, v.price]),
    [['S', 55000]],
  );
  assert.deepEqual(
    get('phin-den').variants.map((v) => [v.attributes.temperature, v.price]),
    [
      ['cold', 50000],
      ['hot', 50000],
    ],
  );
  assert.deepEqual(
    get('cup-noodles').optionGroups[0].choices.map((c) => [c.id, c.priceDelta]),
    [
      ['sausage', 10000],
      ['chicken', 10000],
    ],
  );
  assert.deepEqual(
    menu.products
      .filter((p) => p.preparationMinutes === 15)
      .map((p) => p.id)
      .sort(),
    ['croffle', 'potato-wedges', 'sausage'],
  );
});

test('provided location and Facebook links are wired separately from ordering channels', () => {
  assert.deepEqual(
    locations.map((l) => l.url),
    ['https://maps.app.goo.gl/15eq7HsJnHKaW3Wk9', 'https://maps.app.goo.gl/Zmw1gFV8wdaEqN8XA'],
  );
  assert.equal(
    externalActions.find((a) => a.id === 'facebook')!.url,
    'https://facebook.com/cazone.saigon',
  );
});

test('photo import covers only the current mapped products and supplies every responsive asset', () => {
  const withPhotos = menu.products.filter((p) => p.photos.length);
  assert.equal(withPhotos.length, 30);
  assert.equal(
    withPhotos.reduce((n, p) => n + p.photos.length, 0),
    32,
  );
  for (const p of menu.products) {
    if (!p.photos.length) assert.match(p.image, /^\/images\/placeholders\//);
    else assert.equal(p.image, p.photos[0].sources[240]);
    for (const photo of p.photos) {
      for (const source of Object.values(photo.sources)) {
        assert.match(source, /^\/images\/products\/[a-z0-9-]+\.webp$/);
        assert.ok(existsSync(`public${source}`));
      }
    }
  }
  const m = structuredClone(menu);
  m.products.find((p) => p.id === 'matcha-latte')!.photos[1].variantIds = ['nonexistent'];
  assert.equal(menuSchema.safeParse(m).success, false);
});
