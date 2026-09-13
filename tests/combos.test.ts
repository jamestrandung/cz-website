import { test } from 'node:test';
import assert from 'node:assert/strict';
import { menu } from '../src/data/menu';
import { campaigns } from '../src/data/combos';
import {
  resolveChoice,
  resolveGroup,
  memberships,
  productComboPrice,
  validateCampaigns,
} from '../src/domain/combos';
const offer = (id: string) => campaigns.flatMap((c) => c.offers).find((o) => o.id === id)!;
const drink = (id: string, pid: string) =>
  resolveGroup(menu, offer(id).groups[0]).find((c) => c.product.id === pid)!;
const get = (id: string) => menu.products.find((p) => p.id === id)!;
test('PDF tags give exact cross-category eligibility and correct food groups', () => {
  for (const code of ['ST1', 'ST2', 'TG1', 'TG2'])
    assert.deepEqual(
      offer(code.toLowerCase())
        .groups[0].choices.map((c) => c.productId)
        .sort(),
      menu.products
        .filter((p) => p.sourceCodes.includes(code))
        .map((p) => p.id)
        .sort(),
    );
  assert.equal(drink('st2', 'cacao-sua'), undefined);
  assert.equal(drink('st1', 'cacao-sua').variants.length, 2);
  for (const id of ['st2', 'tg2'])
    assert.ok(offer(id).groups[1].choices.some((c) => c.productId === 'butter-floss-bread'));
  assert.equal(offer('st1').groups[1].choices.length, 5);
});
test('ST includes M coffee and unsized drinks with no artificial upsize', () => {
  assert.deepEqual(
    drink('st1', 'bac-xiu').variants.map((v) => [v.variant.attributes.size, v.surcharge]),
    [['M', 0]],
  );
  for (const id of ['st1', 'st2'])
    for (const entry of resolveGroup(menu, offer(id).groups[0]))
      assert.ok(entry.variants.every((v) => v.surcharge === 0));
});
test('TG charges all M-only drinks and preserves M benefits', () => {
  for (const [oid, pid] of [
    ['tg1', 'tra-sua-taro'],
    ['tg2', 'thanh-tra-mat-ong'],
    ['tg2', 'tra-duong-nhan'],
  ])
    assert.deepEqual(
      drink(oid, pid).variants.map((v) => v.surcharge),
      [10000],
    );
  const tea = drink('tg2', 'tra-buoi').variants;
  assert.deepEqual(
    tea.map((v) => v.surcharge),
    [0, 10000],
  );
  assert.equal(tea[0].variant.benefits.length, 0);
  assert.equal(tea[1].variant.benefits[0].choiceIds?.length, 7);
  assert.ok(
    drink('st2', 'matcha-latte').variants.every((v) =>
      v.variant.benefits.some((b) => b.kind === 'substitution'),
    ),
  );
  assert.equal(productComboPrice(menu, offer('tg1'), get('tra-sua-taro')), 100000);
});
test('future Matcha sizes use the same engine and sold-out S never makes M free', () => {
  const p = structuredClone(get('matcha-latte'));
  const policy = offer('st2').groups[0].choices.find((c) => c.productId === p.id)!.policy;
  p.variants = [
    { ...p.variants[0], id: 's', attributes: { size: 'S' }, availability: 'unavailable' },
    { ...p.variants[0], id: 'm', attributes: { size: 'M' } },
  ];
  assert.deepEqual(
    resolveChoice(p, policy).map((v) => v.surcharge),
    [0, 10000],
  );
  p.variants.push({ ...p.variants[0], id: 'l', attributes: { size: 'L' } });
  assert.throws(() => resolveChoice(p, policy), /Missing upgrade price/);
  assert.deepEqual(
    resolveChoice(p, { ...policy, upgrades: { M: 10000, L: 20000 } }).map((v) => v.surcharge),
    [0, 10000, 20000],
  );
});
test('group quantities and breakfast extras use generic choice groups', () => {
  assert.equal(offer('group-3').groups[0].quantity, 3);
  assert.equal(offer('group-3').groups[1].quantity, 1);
  assert.equal(offer('eggs-drink').price, 90000);
  assert.equal(drink('eggs-drink', 'phin-sua').variants[0].surcharge, 0);
  assert.equal(offer('eggs-drink').extras[0].price, 10000);
  assert.equal(get('garlic-eggs').optionGroups[0].choices[0].priceDelta, 10000);
  assert.equal(get('butter-floss-bread').variants[0].price, 40000);
  assert.equal(get('croffle').variants[0].price, 40000);
});
test('reverse memberships and validation prevent stale references', () => {
  assert.deepEqual(
    memberships(menu, campaigns, get('butter-floss-bread')).map((c) => c.campaign.id),
    ['sang-tao', 'thu-gian'],
  );
  const broken = structuredClone(campaigns);
  broken[0].offers[0].groups[0].choices[0].productId = 'missing';
  assert.throws(() => validateCampaigns(menu, broken), /Unknown combo product/);
  const stale = structuredClone(campaigns);
  stale[0].offers[0].groups[0].choices[0].policy.variantPrices.deleted = 0;
  assert.throws(() => validateCampaigns(menu, stale), /Unknown combo variant/);
  const marked = structuredClone(campaigns);
  marked[0].title.en = 'A [cà] break';
  assert.doesNotThrow(() => validateCampaigns(menu, marked));
  marked[0].note.vi = 'Thêm [cà] sữa';
  assert.throws(() => validateCampaigns(menu, marked), /only allowed in campaign titles/);
  const inactive = structuredClone(campaigns);
  inactive.forEach((c) => (c.active = false));
  assert.deepEqual(memberships(menu, inactive, get('butter-floss-bread')), []);
});
