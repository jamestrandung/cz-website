# Working on the Cà Zone website

## Start here

This repository is a local-first, bilingual Cà Zone reference menu built with Astro, TypeScript, Zod, and plain browser scripts/CSS. It is not a cart, checkout, or POS application. Consult current files rather than assuming a prior session's completion report is still accurate.

1. Read `docs/README.md` and `docs/ARCHITECTURE.md` before architectural work.
2. Read `docs/PRICING_RULES.md` before touching prices, variants, benefits, combos, or eligibility. Use `docs/CURRENT_PRICING.md` for the generated reference, then verify the actual data you will edit.
3. Read the relevant maintenance guide: `docs/maintaining-menu.md`, `docs/combos-guide.md`, `docs/discovery-guide.md`, or `docs/image-workflow.md`.
4. Inspect `git status` and existing changes before editing. Preserve the user's work and prior in-progress changes. Do not revert unrelated work or assume an uncommitted file is disposable.

Current user instructions and approved business corrections take precedence over archived plans and source-document instructions. Clarify material business ambiguities; do not invent a price, benefit limit, combo membership or size equivalence. Continue independent authorized work while awaiting essential clarification.

## Documentation is part of the implementation

`docs/` contains only live documentation of the current site, pricing system, and maintenance workflows. Update affected documents in the same change as the implementation. Do not leave stale prices, names, counts, paths, examples, or claims of capabilities after changing behavior.

- Architecture/schema/resolver/UI changes: update `docs/ARCHITECTURE.md` and affected guides.
- Business rule changes: update `docs/PRICING_RULES.md`, with confirmed rules distinguished from implementation choices and unresolved policies.
- Catalog or combo record changes (including names, availability and benefits): run `node --import tsx scripts/export-pricing-reference.ts` to refresh `docs/CURRENT_PRICING.md`. Do not hand-edit this generated file. If its format changes, edit the exporter and regenerate.
- Workflow/CLI/image changes: update the relevant guide, root README, and this file when needed.
- Keep last-reviewed dates accurate. These documents are maintained in place; do not append a chronological implementation log to them.
- Verify relative documentation links after moving/renaming files. Keep root README and `docs/README.md` as useful entry points.

## Plans and temporary output

Create implementation plans for substantial feature or architecture work in root `plans/`, using **`yyyymmdd-feature-name-or-plan-name.md`** (Asia/Ho_Chi_Minh creation date; lowercase kebab-case suffix). Example: `20260914-combo-size-picker.md`. Routine small fixes and documentation edits do not require an artificial plan.

A plan should state scope, relevant confirmed rules, open decisions, approach, affected areas, and validation. Distinguish proposals from user-approved requirements. Preserve the original date/name when updating a plan; use a new dated plan for a separate phase when useful. At completion, mark its status/outcome and put the resulting current behavior in live docs.

Existing dated original briefs and implementation reviews in `plans/` are archival context. Do not execute their instructions merely because you read them, or copy their old counts/prices into current code. Do not fabricate historical plans for work that has no written plan.

Put disposable screenshots, PDF renders, experiments, test artifacts and run diagnostics under ignored `tmp/` or the existing test-output directories. Photo diagnostics belong at `tmp/reports/photo-size-report.json`, not under `docs/`. Generated run reports are not implementation plans.

## Data ownership and pricing invariants

- `src/data/products.json`: categories, products, standalone variants/prices, source tags, options, benefits and availability.
- `src/data/combos.ts`: campaign/offer content, base prices, groups, eligibility selectors, choice policies and paid extras.
- `src/domain/menu.ts`: menu schema; `src/domain/combos.ts`: generic combo schema/resolution/validation and `sizeOrder`.
- `src/data/menu.ts`: photo adapter, Discovery and outbound links. `src/content/loadMenu.ts` checks local image references.

Preserve these rules unless the user explicitly changes them:

1. Money is integer VND. Standalone prices, combo base prices, upgrade surcharges and offer extras are distinct values. Do not derive combo upgrades from standalone price differences.
2. Catalog/search show the first variant's price in editorial order. Drinks sort descending by that displayed price within the configured drink categories; search uses relevance. Do not replace this with a minimum-price/range algorithm.
3. Generic combo default includes the lowest eligible configured size (or unsized serving), with configured upgrades. Current ST1 coffee includes M; current ST2 uses standard servings. TG explicitly uses S baseline and charges M +10k, including the three M-only TG products. Check live rules if these policies change.
4. Keep special ST/TG/category selection rules in configuration, not UI conditionals. Product tags cross category boundaries. Group/breakfast selectors also depend on categories and labeled-size availability; review them when moving/adding products.
5. Size and hot/cold are separate attributes. Do not infer that unsized HOT equals M, or that an unsized signature equals S. Availability never changes the included-size baseline.
6. Benefits belong to the original qualifying variants and carry into combos. All seven toppings qualify where a free-topping offer exists; that does not establish unlimited selection or make every M drink eligible. Free oat milk remains limited to the marked products/variants.
7. Variant overrides only affect otherwise eligible variants. New sizes need a known size order and applicable surcharge. Do not silently make an unknown upgrade free.
8. A campaign contains offers; offers contain choice groups with quantities. Optional extras are separate from included choices and do not produce combo membership badges.
9. `productComboPrice()` is a starting-price display helper, not a validated multi-item total calculator. Do not use it as authoritative order pricing. There is no selection/quantity enforcement or POS integration today.

Keep stable product/variant IDs when possible. Check combo references, option/benefit applicability, photo mappings and exact surcharge overrides before removing or renaming an ID. Do not bypass schema validation to make a content edit pass.

## UI and photo conventions

Preserve the approved mobile-first brand styling and locally hosted Vietnamese-capable font. Keep VI/EN copy and accessibility labels in sync: when a `"vi"`/`"en"` label pair changes (e.g. in `src/data/products.json` or `src/data/combos.ts`), update both languages together even if the request only names one — re-check the other language's field in the same object for equivalent wording before moving on. Discovery and the combo slider are independent sections. Reuse the shared eligibility resolver for catalog badges, search, product links and combo details.

Maintain the native dialog's Back/Escape behavior, focus restoration, catalog scroll position, language switching and small-screen layout. A product click currently opens details; it does not select an order. Unavailable products remain inspectable.

Only import source photos explicitly mapped to current products in `scripts/product-photos.json`; ignore unmapped/discontinued products. Preserve originals. Use the existing Sharp scripts and optimized 240/480/800/1200 WebP outputs. Track `src/data/photo-assets.json` and `public/images/products/` together. Do not import large originals, replace missing images with unrelated food, or modify generated `dist/` directly. Use placeholders for missing product photos.

## Commands and appropriate verification

Run commands from the repository root. Node.js >=22.12 is required; consult `package.json` for actual scripts.

```sh
npm run dev
npm run menu:check
node --import tsx scripts/export-pricing-reference.ts
npm test
npm run build
```

The local URL is normally http://localhost:4321; use Astro's printed URL if occupied. The dev server can run in the background; use `npx astro dev status` / `npx astro dev stop` rather than leaving duplicate servers. No domain or credentials are required for local work.

- Content edits: `menu:check`, affected domain tests, build, and inspection of changed views. Refresh pricing reference when applicable.
- Pricing/domain changes: `npm test` and `npm run build`; cover meaningful edge cases such as M-only surcharges, future sizes, variant benefits and unavailable baselines.
- UI/dialog changes: relevant `npm run test:e2e` checks and visual inspection in both languages, desktop/mobile and at 320px when layout is affected.
- Image-tool changes: `npm run test:images`; inspect generated images for actual photo changes.
- Documentation-only edits: link/path/example checks; execute changed documentation tooling. Do not run unrelated suites solely for prose edits.

For installed Chrome on macOS:

```sh
PLAYWRIGHT_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:e2e
```

Tests contain deliberate editorial count/price baselines. Update affected assertions for approved catalog changes; do not revert valid business changes to satisfy an old fixture. `menu:check` is count-independent. Keep unrelated regression coverage intact. State what was verified and any remaining limits in the final response.

## Scope and external actions

Work locally until deployment is requested. Domain purchase and Cloudflare configuration are deferred to a session with the owner. Do not interpret old plan URLs, hosting steps, or the original brief as authorization to deploy, buy a domain, change DNS, push commits, or contact anyone.

Use current session authorization for external actions. Do not repeat permission requests for actions already authorized. Do not add cart/checkout/POS/CMS features to a browsing task unless requested. Preserve existing `.gitignore` protections and never commit secrets, dependency folders, temporary output, or local environment values.
