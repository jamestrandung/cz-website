# Pricing rules and business decisions

Live business-rules document. Last verified: 2026-09-13. Maintained from the owner's instructions, supplied menus/posters, and the current local implementation. [Architecture](ARCHITECTURE.md) explains how these rules are represented. [Current pricing reference](CURRENT_PRICING.md) lists the exact live-file snapshot, including every standalone variant and combo choice.

## Authority and source basis

Owner corrections take precedence over older printed prices or earlier conversation assumptions. Code shows what the site currently does; code alone does not establish an unconfirmed business policy. The generated reference is a dated snapshot, not an alternative place to edit prices.

| Source | What it establishes |
| --- | --- |
| Owner's latest size clarification and final “yes” | ST currently has no size tiers; ST1 includes coffee M. TG uses S baseline and M +10k, including all three M-only TG drinks. Future size variants must be accommodated generically. |
| Owner's food corrections | Croffle caramel 40k; add Ốp la bơ tỏi with sausage +10k; the intended bread is Bánh mì bơ chà bông, 40k, in ST2/TG2. |
| Owner's offer clarification | All seven toppings qualify where a free topping offer applies. Regular qualifying topping/oat-milk benefits continue inside combos. Breakfast 90k includes eggs plus S drink or M coffee; sausage is +10k. |
| `Menu - A3.pdf` | Drink names, standalone variants/prices, ST1/ST2/TG1/TG2 product tags, free-benefit markings, and the original food/topping catalog. Latest reviewed file also shows croffle 40k. |
| `Menu Food.pdf` | Food prices and Combo 1/2 labels. The owner explained how those labels map to ST/TG. |
| Combo posters `6.png`, `7.png`, `9.png`, `11.png` | ST/TG prices, group offers, breakfast offer and poster-specific paid extras. Their graphics do not replace structured eligibility. |

Original local source locations were `/Users/james.tran/Downloads/Menu - A3.pdf`, `/Users/james.tran/Downloads/Menu Food.pdf`, and `/Users/james.tran/Downloads/Ca Zone/Combo/`. Renamed food photos were supplied in `/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG`. These are provenance paths, not required runtime paths or portable links.

The current model uses per-choice size pricing. The correct bread name is Bánh mì bơ chà bông; croffle is 40k. Historical proposals and import records are archived under root `plans/`.

## Money and standalone prices

All stored monetary values are nonnegative integer Vietnamese đồng. `90000` means 90,000đ; “90k” in discussion means the same amount. Display uses Vietnamese numeric formatting and the `đ` suffix in both languages. No exchange rates, taxes, service charges, rounding policy, or delivery fees are calculated by the website.

The catalog's standalone price belongs to a **product variant**, not a category, photo, or combo. The listing shows the first variant in editorial order. It does not search for the cheapest variant and does not substitute another price when that first variant is unavailable. Product details show all variants.

Drinks are ordered by that displayed first-variant price descending within each of six configured drink categories. Food and toppings preserve editorial order. Search uses relevance, then source order. Neither search nor category order ranks by combo savings.

Standalone option prices are additions to the chosen variant price. The business arithmetic is:

`standalone total = variant price + applicable paid option amounts`

This describes the rule; the site currently displays the components and does not collect a selection or calculate an order total. Free choices have zero adjustment only in their applicable context.

## Combo principle and exceptions

The general principle is to include the lowest size and let customers pay to upsize. The generic default policy therefore includes the lowest eligible configured size, or a standard unsized serving. Explicit commercial policies can set a different baseline.

The important current exceptions are:

- **ST1 coffee:** M is included in the base price, including Bạc xỉu even though it also has a standalone S variant. Coffee is not charged +10k merely because its label is M.
- **TG:** the included baseline remains S even if a particular product is sold only in M. All three M-only TG drinks require +10k: Trà sữa khoai môn, Thanh trà mật ong hạt đác, and Bình trà dưỡng nhan.
- **Unsized drinks:** an unsized serving is not implicitly S or M. Standard policy includes it with no surcharge. Current ST2 drinks and the non-coffee ST1 drinks use this behavior.
- **Availability:** selling out S does not make M free. Removing a variant from the catalog is a different content change and can change a default lowest-size baseline; review its policy when doing so.

Upgrade amounts are independent of standalone price differences. Cam ép, for example, is S 55k / M 60k standalone, but its TG upsize is still +10k. The amount is configurable rather than permanently fixed in the UI.

The intended arithmetic for a fully chosen combo is:

`combo total = offer base price + sum of per-item variant surcharges + applicable paid extras`

For a multi-drink offer, each drink has its own surcharge. Do not multiply the entire combo base price by the number of people. Included food is already covered by the base price. Optional food extras are separate from included food choices. The current site lists these amounts; it has no completed-combo selection or total calculator.

## Current offers

| Offer | Base | Included choices | Size policy |
| --- | ---: | --- | --- |
| ST1 | 90k | 1 ST1 drink + 1 Combo 1 food | Coffee M or other standard serving; no current size upgrade |
| ST2 | 95k | 1 ST2 drink + 1 Combo 2 food | Standard serving; no current size upgrade |
| TG1 | 90k | 1 TG1 drink + 1 Combo 1 food | S included; M +10k |
| TG2 | 85k | 1 TG2 drink + 1 Combo 2 food | S included; M +10k |
| Cà đông, 2 people | 140k | 2 drinks + 1 shared snack | Coffee M included; tea S included, M +10k per drink |
| Cà đông, 3 people | 190k | 3 drinks + 1 shared snack | Same policy |
| Cà đông, 4 people | 240k | 4 drinks + 1 shared snack | Same policy |
| Ốp la + drink | 90k | Ốp la bơ tỏi + 1 drink | S drink or M coffee included; other M +10k; sausage +10k extra |

The group/breakfast drink filters and their treatment of M-only/unsized products are described under current implementation choices below. They should not be mistaken for separately confirmed rules for every possible product.

### Drink eligibility from the printed tags

Tags are product-level eligibility markers; size pricing is a separate rule. A category title does not fully define an ST/TG list.

| Tag | Exact current products |
| --- | --- |
| ST1 | Bạc xỉu; Phin cam; Phin sữa; Phin đen; Phin cano; Cacao muối Huế; Cà phê muối Huế; Cacao sữa |
| ST2 | Cà phê Oreo; Matcha khoai môn; Dừa mây khoai môn; Matcha Oreo; Matcha coco kem mây; Cacao Oreo; Matcha latte; Matcha coco |
| TG1 | Trà sữa milkfoam hạnh nhân nướng; Trà sữa khoai môn; Trà sữa nhài; Trà sữa ô long; Trà nhài macchiato; Đá me đậu phộng |
| TG2 | Trà bưởi Aiyu; Trà chanh dây tắc xí muội; Trà đào sả; Trà thanh vải; Thanh trà mật ong hạt đác; Trà xoài; Bình trà dưỡng nhan; Trà chanh Atiso; Cam ép |

The owner's “Cacao latte” exception corresponds to the catalog/PDF item named **Cacao sữa** (`cacao-sua`): it belongs to ST1, not ST2. Standard servings can still have hot/cold variants; one size does not mean one temperature.

### Food eligibility

**Combo 1**, shared by ST1/TG1:

- Sừng trâu chà bông (`croissant-floss`)
- Sừng trâu hạnh nhân (`croissant-almond`)
- Sừng trâu chấm sữa (`croissant-milk`)
- Tiramisu (`tiramisu`)
- Bánh phô mai chanh dây (`cheesecake`)

**Combo 2**, shared by ST2/TG2:

- Khoai tây chiên không dầu (`potato-wedges`)
- Croffle caramel (`croffle`)
- Khô gà lá chanh (`chicken-jerky`)
- Bánh mì bơ chà bông (`butter-floss-bread`)

The group combo has one shared potatoes **or** chicken-jerky portion, regardless of group size. Breakfast has one Ốp la bơ tỏi portion. Neither eggs nor the sausage-and-potatoes dish is automatically part of Combo 1/2 simply because it is a savory food.

## Free toppings

All seven toppings may be chosen when a qualifying free offer applies:

| Topping | Normal standalone price |
| --- | ---: |
| Trân châu đen | 10k |
| Sương sáo | 10k |
| Nha đam | 10k |
| Hạt đác | 15k |
| Trân châu trắng | 10k |
| Thạch Aiyu | 10k |
| Thạch dừa | 10k |

The qualifying **M variants** are Trà bưởi Aiyu, Trà đào sả, Trà thanh vải, Trà sữa milkfoam hạnh nhân nướng, Trà sữa nhài, Trà sữa ô long, Trà nhài macchiato, and Trà chanh Atiso.

Their S variants do not acquire this benefit. Other M drinks do not acquire it merely by being M. For example, Trà sữa khoai môn's +10k combo surcharge does not create a free-topping entitlement that is absent from its catalog variant.

Within a qualifying drink, the free option choices have `priceDelta: 0`; normal standalone topping prices remain unchanged. Hạt đác is not surcharged in a free offer despite its normal 15k price. The product benefit links to all seven valid choice IDs.

**Eligibility does not establish quantity.** The owner confirmed which toppings qualify, not how many choices/portions may be redeemed. Current free-topping groups have `minSelections: 0` and no maximum; benefits have no quantity. That is incomplete order-selection policy, not permission for unlimited toppings. Current UI is descriptive and avoids enforcing an invented limit.

## Free oat-milk substitutions

Only Matcha Oreo, Cacao Oreo, Matcha latte, and Cacao sữa carry the configured free oat-milk substitution. It applies to their marked variants, including hot and cold where both exist. Their optional milk group allows at most one oat choice, with zero adjustment and quantity one in the benefit record.

This benefit survives combo eligibility resolution because combos refer to the original variants. It does not apply to all Matcha drinks, all cacao drinks, or every drink in ST2.

## Paid add-ons and discounted extras

| Context | Price |
| --- | ---: |
| Ốp la bơ tỏi standalone | 45k |
| Its optional sausage | +10k |
| Xúc xích Đức & khoai standalone | 60k |
| Its additional sausage | +10k per sausage |
| Mì ly standalone | 20k |
| Mì ly sausage | +10k per sausage |
| Mì ly shredded chicken | +10k per portion |
| Bánh mì bơ chà bông standalone | 40k |
| Croffle caramel standalone | 40k |
| Breakfast combo sausage | +10k |
| Breakfast combo optional Tiramisu | +40k (standalone 45k) |
| Breakfast combo optional cheesecake | +40k (standalone 45k) |
| Breakfast combo optional chicken jerky | +30k (standalone 35k) |

The 90k breakfast base includes eggs without sausage. With one sausage, the total is 100k before any drink upgrade or other extra. The same sausage should not be charged once as a product option and again as an offer extra; the two current entries describe the same add-on in different views. Automated deduplication is not implemented because no selections are collected.

Paid combo extras store their own offer-specific price. A `productId` on an extra is a reference, not an instruction to use the standalone product price. Standalone price edits therefore do not silently change a breakfast extra price. Optional extras do not count as included-group membership when deriving catalog badges.

The breakfast poster also mentions extra egg +10k and extra bread +5k alongside the standalone dishes. These are **not currently configured** in the product's option groups: the explicit implementation request added sausage. Do not describe the website as supporting every poster add-on. Confirm scope before adding these options.

## Worked examples

Amounts below demonstrate the business arithmetic; they are not live cart calculations.

| Choice | Calculation | Total |
| --- | --- | ---: |
| ST1 Phin sữa M + croissant | 90k base + 0 | 90k |
| ST2 Matcha latte + croffle, oat milk requested | 95k base + 0 standard serving + 0 substitution | 95k |
| TG1 Trà sữa nhài S + Tiramisu | 90k base | 90k |
| TG1 Trà sữa nhài M + Tiramisu | 90k + 10k; marked free topping eligibility remains | 100k |
| TG1 Trà sữa khoai môn M + croissant | 90k + 10k despite no S variant | 100k |
| TG2 Thanh trà mật ong hạt đác M + bread | 85k + 10k | 95k |
| TG2 Cam ép M + chicken jerky | 85k + 10k, not the standalone 5k size difference | 95k |
| Group of 3: coffee M, tea S, tea M + shared potatoes | 190k + 0 + 0 + 10k | 200k |
| Breakfast + coffee M + sausage | 90k + 0 + 10k | 100k |
| Breakfast + tea M + sausage | 90k + 10k + 10k | 110k |
| Breakfast + coffee M + extra Tiramisu | 90k + 40k | 130k |
| Standalone eggs + sausage | 45k + 10k | 55k |

“Free topping eligible” in these examples does not assert a redemption count. The website does not promise a fixed 15k saving: savings vary with the actual eligible food/drink combination and variant, and some combinations need surcharges.

## POS and customer presentation

The owner described separate POS choices such as a combo's S and M options. The later clarification establishes that ST currently has no size tiers and only TG needs size upgrades. POS structure is operational context, not the domain model.

The website models one offer with variant-level adjustments and shows applicable sizes beside each drink. It does not duplicate every ST offer into S/M products. There is no stored POS ID/mapping or integration yet. If needed later, map selections to POS entries as a separate concern without duplicating product/benefit data.

Catalog/search badges count matching active **campaigns**. Product details show yellow combo cards with matching offer labels and starting prices. Detailed size/surcharge text is shown inside combo details rather than beneath these cards. Combo details show the original product's eligible variants and benefits. Clicking a product opens its detail view; it does not select it into a basket. The product-specific starting-price helper accounts for that product's minimum surcharge only; see [Architecture](ARCHITECTURE.md#variant-resolution-exact-current-algorithm) for its limits.

## Current implementation choices requiring care

These are deliberately recorded separately from explicit owner confirmations:

- Coffee policy permits labeled M variants and excludes HOT coffee variants with no size attribute. Their equivalence to M has not been explicitly defined. Unsized hot/cold Cacao sữa and Matcha latte remain allowed under standard policy.
- Group drinks are selected from current Coffee, Fruit tea and Milk tea categories. Tagged TG drinks in Fruity & healthy are not automatically included in the group combo.
- Breakfast uses products in configured drink categories that have a labeled size. Unsized signatures/Matcha are currently excluded rather than inferred to be S. Adding sizes can cause these products to enter the breakfast filter automatically.
- Group and breakfast reuse the S-baseline policy for non-coffee drinks, so eligible M-only products also show +10k there. The owner's final explicit M-only confirmation concerned TG; this broader behavior follows the current configured policy and should be reviewed if those offers need different exclusions.
- The group/breakfast configurations allow independent per-drink upgrades. Repeat-drink limits and substitution limits are not encoded or enforced.

## Limits and open decisions

The first draft is a pricing reference, not an ordering system. The following should be settled before implementing selected orders:

1. Free-topping selection count and quantities; whether multiples of the same topping are permitted.
2. Maximum add-on quantities and whether Mì ly can take both sausage and chicken.
3. Hot coffee combo eligibility and treatment of drinks with no labeled size in breakfast/group offers.
4. Any restrictions on repeating drinks in multi-person combos, replacing included foods, or combining other promotions.
5. POS mappings, choice validation, final stock checks, and preventing duplicate charges for the same extra.
6. Any tax, service charge, rounding, discount stacking, time window, branch-specific price, or fulfillment rules. None should be inferred from this reference.
7. Whether to add the poster's extra egg/bread options and how to expose them.

These are future feature/operating decisions, not claims that the already implemented display rules are unknown. The all-M-only-TG +10k decision is resolved.

## Keeping the record accurate

Edit catalog prices/options/benefits in `src/data/products.json`; combo membership/base prices/policies/extras in `src/data/combos.ts`. Size ordering currently lives in `src/domain/combos.ts`. Follow [Menu maintenance](maintaining-menu.md) and [Combo maintenance](combos-guide.md).

After approved price or rule changes, update this explanation when the business meaning changes, regenerate [Current pricing reference](CURRENT_PRICING.md), and run `npm run menu:check` plus the relevant tests/build. Exact reference generation is documented in the index. Do not treat a manually edited reference table as an application change.
