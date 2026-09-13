# Maintain combos and deals

For the current model and rules, see [Architecture](ARCHITECTURE.md), [Pricing rules](PRICING_RULES.md), and [Current pricing reference](CURRENT_PRICING.md).

The horizontal section between Discovery and the catalog is configured in `src/data/combos.ts`. Discovery remains independently configured in `src/data/menu.ts`.

This is a reference menu: customers browse included items and upgrade prices, then order at the counter. There is no cart, POS connection, or checkout.

## Change the section

Edit `dealsSection.title`, `eyebrow`, and `description` in both languages with `t('Vietnamese', 'English')`. Set `enabled: false` to hide the slider. You can call it Deals, Combos, or another title. `enabled` only hides the slider; set each campaign's `active: false` to remove its product links too.

## Add, edit, hide, reorder, or remove a card

Each object passed to `validateCampaigns(menu, [...])` is a card (campaign).

- Give it a stable unique `id`, e.g. `afternoon-break`.
- Set `active: true` to show it, or `false` to hide it and its catalog memberships.
- Write bilingual `title`, `description`, and `note`.
- Choose `theme`: `yellow`, `peach`, `sage`, or `ink`.
- Set `imageProductIds` to one or two existing product IDs. Use pictures of items that can actually be paired. Images use the existing optimized catalog photos; original full-size files are never loaded.
- Add one or more `offers`. Each offer has an ID, bilingual label, integer VND base price, choice groups, and optional extras. One card can group ST1/ST2 or 2/3/4-person offers.
- Reorder cards or offers by moving their objects in the array. Remove an object to delete it.

## Define what is included

Every offer contains generic choice groups. A group has an ID, a bilingual label, a required quantity, and product choices. A quantity of three drinks plus a quantity of one snack means three drinks and one shared snack; upgrades are per drink.

Example to adapt inside a campaign's `offers` array:

```ts
{
  id: 'afternoon-one',
  label: t('Trà & bánh', 'Tea & cake'),
  price: 90000,
  groups: [
    {
      id: 'drink', label: t('món nước', 'drink'), quantity: 1,
      choices: choices(['tra-sua-nhai', 'tra-sua-olong'], tea),
    },
    {
      id: 'food', label: t('món ăn', 'food item'), quantity: 1,
      choices: choices(['croissant-milk', 'tiramisu']),
    },
  ],
  extras: [{ label: t('Khô gà lá chanh', 'Chicken jerky'), productId: 'chicken-jerky', price: 30000 }],
}
```

`choices()` and `groups()` are conveniences in this configuration file. The rendering and pricing engine does not contain ST/TG, coffee, breakfast, or category-specific branches.

Current ST/TG drink lists use `tagged('ST1')` etc., reading each product's `sourceCodes`. Update those tags in `src/data/products.json` to change membership. Codes themselves are arbitrary strings. The food groups are explicit `food1` and `food2` product lists. Group and breakfast drink lists currently use filters in this configuration file; review those filters when adding products or moving categories. You can replace any helper with explicit choices for a curated list.

## Included sizes and upgrade prices

Each product choice has its own `policy`:

| Field | Meaning |
| --- | --- |
| `includedSize` | Optional baseline size. Without it, the lowest eligible configured size is included. |
| `allowedSizes` | Optional list of sizes that may appear. Omit to allow all configured sizes. |
| `allowUnsized` | Whether variants without a size may appear. Temperature does not count as a size. |
| `upgrades` | Surcharges by size, e.g. `{ M: 10000, L: 20000 }`. These are independent of standalone prices. |
| `variantPrices` | Optional exact variant-ID surcharge overrides, e.g. `{ 'special': 5000 }`. Variants must exist and remain eligible under the filters. |

The default `standard` policy includes the lowest configured size (or an unsized serving), with M +10k if larger. `tea` explicitly includes S, so an M-only product still costs +10k. `coffee` explicitly includes M and permits only size M. `sized` permits only labeled sizes and uses the S baseline.

All amounts are integer VND. A surcharge of zero means included. Missing prices for a new larger size fail validation rather than silently making it free. Availability never changes the included baseline: a sold-out S does not make M free.

Current configured behavior (see [Pricing rules](PRICING_RULES.md) for the distinction between owner confirmations and implementation choices):

- ST1 90k: five coffee products in M, Cacao muối Huế, Cà phê muối Huế, and Cacao sữa; food group 1.
- ST2 95k: Cà phê Oreo, Matcha khoai môn, Dừa mây khoai môn, and the five Matcha/cacao products excluding Cacao sữa; food group 2.
- TG1 90k / TG2 85k: S included; M +10k. This includes all three M-only products: Trà sữa khoai môn, Thanh trà mật ong hạt đác, and Bình trà dưỡng nhan.
- ST has no S/M offer switch today. Unsized hot/cold variants remain separate temperature choices. Coffee combos list M as instructed; coffee HOT variants without a printed size are not inferred to be M.
- Group 2/3/4-person offers cost 140/190/240k, with one drink each and one shared potatoes/jerky snack. Coffee M included; tea S included and M +10k.
- Breakfast is 90k: garlic-bread eggs and a size S drink or size M coffee. Drinks without a labeled size are not inferred to be S. Other M drinks carry +10k. Sausage +10k is optional. Poster extras: tiramisu/cheesecake +40k; jerky +30k.
- Food group 1: three croissants, tiramisu, cheesecake. Food group 2: potatoes, caramel croffle, chicken jerky, butter bread with chicken floss.

## Add sizes to Matcha later

1. Add the real variants, labels, prices, and benefits to the Matcha product in `products.json`.
2. Preserve its combo membership tag. Existing `standard` policy automatically includes the lowest configured size and charges M +10k when it is larger.
3. If adding a new size label, add it in the correct order in `sizeOrder` and define its surcharge in the relevant policies. Labels are not limited to S/M.
4. Review promotional notes if they mention standard servings or specific sizes.
5. Check photos' `variantIds`, option groups' `variantIds`, and benefit applicability when changing variant IDs.
6. Run the checks below and inspect both languages.

For a special product rule, supply a choice directly:

```ts
{ productId: 'matcha-latte', policy: { ...standard, upgrades: { M: 10000, L: 20000 } } }
```

## Free benefits and optional extras

The combo references original product variants. Free topping choices and oat-milk substitutions are inherited from those variants; do not copy benefit descriptions into combo data. Product details continue to show every qualifying free topping. No free-topping quantity was invented.

`extras` are separate paid additions; they do not count as included food choices. A product being offered as an optional extra does not get an “included in combo” catalog badge. Standalone add-ons remain in the product's `optionGroups`; if an extra repeats one of them, keep its price consistent.

## Product links and maintenance checks

Catalog and search badges, product detail links, highlighted originating items, and combo item lists all use the same eligibility resolver. Do not hand-edit badges on individual products. Product details show only the yellow combo cards; size and surcharge breakdowns appear after opening a combo. Product detail links account for the selected product's surcharge: TG1 with taro milk tea displays from 100k rather than 90k.

Run:

```sh
npm run menu:check
npm test
npm run build
npm run dev
```

Open localhost:4321. Inspect ST1/ST2 and TG1/TG2, all group sizes, breakfast extras, both languages, and product → combo → product → Back. Browser automation: `npm run test:e2e` (see README for using installed Chrome).

`menu:check` validates campaign schema, unique IDs, referenced products/variants, and resolvable upgrade prices. If you remove a product, remove its combo references, food-list entries, and card image references too. If you remove or rename a variant, fix any exact surcharge overrides before rebuilding.

Production publication and Cloudflare remain deferred; these edits run entirely locally.
