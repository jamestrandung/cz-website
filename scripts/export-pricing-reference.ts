/** Documentation export only: reads validated content and writes docs/CURRENT_PRICING.md. */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { menu } from '../src/data/menu';
import { campaigns } from '../src/data/combos';
import { resolveGroup } from '../src/domain/combos';
import { stripCaMark } from '../src/domain/menu';
import { formatPrice } from '../src/domain/presentation';
const cell = (value: unknown) =>
  String(value ?? '—')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
const lines: string[] = [];
const put = (...s: string[]) => lines.push(...s);
const table = (headers: string[], rows: unknown[][]) => {
  put(`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`);
  for (const row of rows) put(`| ${row.map(cell).join(' | ')} |`);
  put('');
};
const stamp = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
put(
  '# Current pricing and eligibility reference',
  '',
  `Generated on ${stamp} (Asia/Ho_Chi_Minh) from the local working-tree data.`,
  '',
  'This generated live reference is maintained with the catalog and combo configuration. Regenerate after every relevant content change; do not edit these tables by hand. Deployment status is separate:',
  '',
  '```sh',
  'node --import tsx scripts/export-pricing-reference.ts',
  '```',
  '',
  'See [Pricing rules](PRICING_RULES.md) for business meaning and confirmed exceptions, [Architecture](ARCHITECTURE.md) for implementation limits, and [Combo maintenance](combos-guide.md) for editing instructions.',
  '',
  `Snapshot: **${menu.categories.length} categories, ${menu.products.length} products, ${menu.products.reduce((n, p) => n + p.variants.length, 0)} variants, ${campaigns.length} campaigns, ${campaigns.reduce((n, c) => n + c.offers.length, 0)} offers.** All amounts below are VND. Unavailable variants are retained; availability never silently changes an included-size baseline.`,
  '',
  '## Standalone product prices',
  '',
  'Rows follow category/product editorial order. Variants remain in editorial order; the first is the catalog/search price. These prices exclude optional paid extras.',
  '',
);
for (const category of menu.categories) {
  put(`### ${stripCaMark(category.name.vi)} / ${stripCaMark(category.name.en)}`, '');
  table(
    [
      'Product ID',
      'Product',
      'English',
      'Variant ID: label = price',
      'Availability',
      'Source tags',
    ],
    menu.products
      .filter((p) => p.categoryId === category.id)
      .map((p) => [
        p.id,
        p.name.vi,
        p.name.en,
        p.variants
          .map(
            (v) =>
              `${v.id}: ${v.label.vi} = ${formatPrice(v.price)}${v.availability === 'unavailable' ? ' (unavailable)' : ''}`,
          )
          .join('; '),
        p.availability,
        p.sourceCodes.join(', ') || '—',
      ]),
  );
}
put(
  '## Product option groups',
  '',
  'Choices are scoped to their option group. A choice ID that resembles a product ID is not an automatically synchronized foreign key to a standalone price. Missing limits are shown as unspecified, not unlimited.',
  '',
);
for (const p of menu.products.filter((p) => p.optionGroups.length)) {
  put(`### ${p.name.vi} (${p.id})`, '');
  table(
    [
      'Group',
      'Kind',
      'Applicable variant IDs',
      'Min/max selections',
      'Choice ID: label = adjustment; max quantity',
    ],
    p.optionGroups.map((g) => [
      g.id,
      g.kind,
      g.variantIds?.join(', ') ?? 'All',
      `${g.minSelections} / ${g.maxSelections ?? 'unspecified'}`,
      g.choices
        .map(
          (c) =>
            `${c.id}: ${c.label.vi} = ${c.priceDelta === 0 ? '0 (free)' : `+${formatPrice(c.priceDelta)}`}; max ${c.maxQuantity ?? 'unspecified'}`,
        )
        .join('; '),
    ]),
  );
}
put(
  '## Variant benefits',
  '',
  'These original catalog benefits are inherited when a variant is eligible in a combo. An M surcharge alone does not create a benefit.',
  '',
);
table(
  ['Product ID', 'Variant ID', 'Benefit', 'Kind', 'Option group / eligible choices', 'Quantity'],
  menu.products.flatMap((p) =>
    p.variants.flatMap((v) =>
      v.benefits.map((b) => [
        p.id,
        v.id,
        b.label.vi,
        b.kind,
        `${b.groupId ?? '—'} / ${b.choiceIds?.join(', ') ?? '—'}`,
        b.quantity ?? 'unspecified',
      ]),
    ),
  ),
);
put(
  '## Campaigns and resolved offers',
  '',
  'Each offer lists all included choices and their actual resolved variant surcharges. The base price is charged once per offer; optional extras are separate. Group quantity describes the bundle, not an enforced selection control in this reference UI.',
  '',
);
for (const c of campaigns) {
  put(
    `### ${stripCaMark(c.title.vi)} (${c.id})`,
    '',
    `Status: **${c.active ? 'active' : 'inactive'}**. Theme: ${c.theme}. Card images: ${c.imageProductIds.join(', ')}.`,
    '',
    `Configured note: ${c.note.vi}`,
    '',
  );
  for (const o of c.offers) {
    put(`#### ${o.label.vi} (${o.id})`, '', `Base price: **${formatPrice(o.price)}**.`, '');
    for (const g of o.groups) {
      put(`Choose **${g.quantity} ${g.label.vi}** (group ID: ${g.id}).`, '');
      table(
        ['Product ID', 'Product', 'Eligible variant ID: label = surcharge', 'Availability'],
        resolveGroup(menu, g).map(({ product: p, variants }) => [
          p.id,
          p.name.vi,
          variants
            .map(
              ({ variant: v, surcharge }) =>
                `${v.id}: ${v.label.vi} = ${surcharge ? `+${formatPrice(surcharge)}` : 'Included'}${v.availability === 'unavailable' ? ' (unavailable)' : ''}`,
            )
            .join('; '),
          p.availability,
        ]),
      );
    }
    if (o.extras.length) {
      put('Optional extras (not included-group membership):', '');
      table(
        ['Extra', 'Referenced product', 'Price'],
        o.extras.map((e) => [
          e.label.vi,
          e.productId ?? 'No product reference',
          `+${formatPrice(e.price)}`,
        ]),
      );
    }
  }
}
put(
  '## Snapshot boundaries',
  '',
  '- Source: `src/data/products.json`, `src/data/menu.ts`, `src/data/combos.ts`, resolved by `src/domain/combos.ts`.',
  '- No selected-order totals, tax/fees, stock synchronization, schedules, POS mappings, or promotion stacking rules are generated.',
  '- Generating this reference validates imported schemas but does not replace `npm run menu:check`, which also checks image and mapping consistency.',
  '- The human-maintained business rules distinguish owner confirmations from current configuration choices; do not infer unconfirmed policy from this table alone.',
  '',
);
const output = fileURLToPath(new URL('../docs/CURRENT_PRICING.md', import.meta.url));
writeFileSync(output, lines.join('\n'));
console.log(`Wrote ${output}`);
