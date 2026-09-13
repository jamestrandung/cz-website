# Cà Zone local menu prototype

A static Astro + TypeScript menu with Vietnamese/English switching, accent-insensitive search, sticky category tracking, product-detail dialogs, and the full menu imported from the supplied PDF.

## Maintenance guides

- [Add, update, reorder or remove categories and dishes](docs/maintaining-menu.md) — examples, prices, availability, options and cleanup.
- [Update the Discovery banner](docs/discovery-guide.md) — bilingual copy, featured photos, target category and hiding the section.
- [Optimize and manage images](docs/image-workflow.md) — single-image exports, one-dish updates, full rebuilds, dry runs and removal.

After routine content edits, run `npm run menu:check` and `npm run build`. Photo script checks are available with `npm run test:images`.

## Run locally

Requires Node.js 22.12 or later and npm. Dependencies are already installed in this workspace.

```sh
npm install
npm run dev
```

Open http://localhost:4321. The dev script binds to your local network so you can also use the network URL printed by Astro from a phone on the same Wi-Fi. No domain, Cloudflare account, credentials, or backend is needed.

This Astro version starts a background dev server. To inspect or stop it:

```sh
npx astro dev status
npx astro dev stop
```

To check a production build locally:

```sh
npm run build
npm run preview
```

Astro may use port 4321 or the next available port; use the URL it prints. In sandboxed automation, prefix Astro commands with `ASTRO_TELEMETRY_DISABLED=1` to avoid writing telemetry preferences outside the workspace.

## What's implemented

- Brand yellow/charcoal/cream, original supplied logo, optimized product photographs, and branded category placeholders.
- Locally hosted Be Vietnam Pro fonts with Vietnamese glyphs, plus prominent star/thumbs-up product badges.
- Configurable Discovery copy, category target, and up to two featured products.
- One continuous catalog with sticky, horizontally scrolling categories and active-section tracking.
- Whole-row product detail triggers, full-screen mobile dialogs, keyboard handling, mobile Back, and scroll/focus restoration.
- Local search across VI/EN names, descriptions, categories, and aliases; accent-insensitive matching including đ/d.
- One visible language at a time; locally remembered language; switching works inside dialogs too.
- Size/temperature variants, displayed inclusions/substitutions/add-ons, per-variant availability, product availability, and preparation times.
- Server-generated Vietnamese catalog stays readable without JavaScript.
- Separate links for both store locations and Facebook, with pending GrabFood/ShopeeFood slots.

## Content and source boundaries

This is a **local preview with all 48 PDF menu items**, across nine categories and 66 variants. Product prices, badges, preparation times, and oat-milk substitutions follow the PDF. All seven toppings qualify for the marked M-size free offers, as confirmed by the user. 26 products have real photos; the other 22 use branded category icons. Matcha latte and Cacao sữa have separate hot/iced photo views. Demo stock-out states have been removed. See `docs/menu-reference.md` for the full review table and source decisions.

The two supplied map links and Facebook link are active. GrabFood and ShopeeFood still await URLs. No domain or Cloudflare setup is required locally.

| Change | File |
| --- | --- |
| Menu products, categories, variants and options | `src/data/products.json` |
| Discovery, outbound links and locations | `src/data/menu.ts` |
| Product/variant/option schema and validation | `src/domain/menu.ts` |
| Source adapter and missing-image check | `src/content/loadMenu.ts` |
| Price display and search helpers | `src/domain/presentation.ts` |
| VI/EN interface text | `src/i18n/ui.ts` |
| Main composition | `src/pages/index.astro` |
| Reusable catalog row | `src/components/ProductRow.astro` |
| Dialog/search/language/category interactions | `src/scripts/menu.ts` |
| Brand tokens and responsive styles | `src/styles/global.css` |
| Source photo allowlist | `scripts/product-photos.json` |
| Generated photo data | `src/data/photo-assets.json` |
| Logo, optimized photos, and category placeholders | `public/images/` |

`variants` are the price source of truth. Catalog and search rows show the first variant’s price, in editorial order; details show every variant price. Prices are integer VND. Stable IDs do not depend on display names. Complimentary topping groups explicitly apply to the qualifying M variant and include all seven choices. Oat-milk substitutions remain limited to the four marked products. Unspecified offer quantities and maximum add-on quantities stay unset until ordering requirements are confirmed. The same shape can be loaded from Sheets during a future build without changing the UI components. No cart, option-selection engine, ordering API, branch selector, or checkout has been added.

To change the Discovery content, edit the `discovery` record. Set `enabled: false` to remove it, change its copy/target, or choose zero to two featured product IDs. This prototype has one banner layout, not a general campaign editor.

## Product photos

Current photos are already optimized and included in the project; normal development/builds do not need the originals. Only files explicitly listed in `scripts/product-photos.json` are imported. Camera-number files and named discontinued products are excluded.

To replace a photo or add coverage, edit that mapping with the stable product ID and exact source filename, then run:

```sh
npm run photos:prepare -- '/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG'
```

The local Sharp script preserves originals and produces content-hashed WebP files at 240/480/800/1200 pixels. It handles macOS Unicode filename normalization, validates product/variant IDs, and removes stale files generated by this script. Commit/include `src/data/photo-assets.json` and `public/images/products/` together when version control is set up. No hosted image service is involved.

Catalog/search/hero use responsive thumbnails; detail-sized files are requested only after opening a product. Missing photos show category icons, plus a compact bilingual “Photo coming soon” message in details. Photo choices are for viewing only and do not select an order or alter prices.

See `docs/product-photo-plan.md` for the completed coverage table and `docs/photo-size-report.json` for measured output sizes.

## Checks

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

To test using an existing Chrome installation on macOS instead of downloading Chromium:

```sh
PLAYWRIGHT_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:e2e
```

The browser suite covers mobile/desktop navigation, search → detail → Back, locale persistence and switching in dialogs, scroll restoration, unavailable products, Escape, 320px width, blocked local storage, and the no-JavaScript catalog. Chrome mobile emulation is not a substitute for testing physical iOS and Android devices before launch.

## Release later

Domain purchase and Cloudflare configuration are explicitly deferred. There is no deployment pipeline or DNS change in this prototype. When you are ready, we can verify the real menu/images/links, choose the final domain, configure GitHub + Cloudflare Workers Static Assets together, and deploy `dist/`.

The page currently declares `noindex, nofollow` while the local preview is under review. Review/remove this as part of a real launch. V1 availability changes require rebuilding the static site.
