# Cà Zone online menu — proposed delivery plan

> Archived planning/source record. Retained for context; it may describe superseded proposals, prices, counts, or behavior. Use [current architecture](../docs/ARCHITECTURE.md) and [current pricing rules](../docs/PRICING_RULES.md) for maintenance. Do not use this record as current implementation instructions.

Date: 12 September 2026  
Status: Local prototype includes the complete PDF menu and 26 products with optimized photos; ordering-channel links and launch preparation remain.  
Source: `20260912-online-menu-original-brief.md`

The brief defines the intended product. This plan proposes how to deliver it; proposed interaction details and acceptance targets below are not additional confirmed requirements. At planning time the workspace contained only the brief. The local Astro prototype now uses the supplied brand direction and logo, plus the complete imported PDF menu with optimized photos and branded placeholders for missing photos. See `README.md` and `20260913-menu-import-review.md` for implementation and source details.

Confirmed scope update: run and review locally first. Domain purchase and Cloudflare configuration are deferred until the user is ready to set them up together. The deployment stages below remain future work.

## 1. Recommended approach

Build one representative, working menu prototype before importing the entire menu or polishing the visual design. Use it to establish the data contract and test category navigation, product details, search, and language switching together.

Then review the prototype, apply a visual direction grounded in Cà Zone's existing assets and focused reference research, populate the full menu, and prepare a production release.

The V1 boundary stays as written: static browsing and outbound actions. Cart, checkout, accounts, backend, database, staff editing, and branch selection belong to later versions.

## 2. Customer experience and proposed behavior

| Area | What we build | Implementation and edge cases |
| --- | --- | --- |
| Header | Brand, compact search control, VI/EN switch | Initially let the header scroll away. Repeat access to search/language in the sticky navigation region only if prototype testing shows it is needed; avoid two large persistent bars. |
| Discovery | Optional visual content before categories | Config specifies enabled state, order, localized copy, images, and an optional action targeting a product, category, or external URL. Start with a simple block arrangement; do not invent campaigns or build a generic page editor. When empty, collapse the section completely. |
| Category navigation | Horizontal links on one continuous catalog | CSS sticky positioning; native category anchors; measured scroll offset; section visibility tracking. Move the horizontal strip only when the active category leaves its visible bounds. Account for short sections, the final section at the bottom, image loading, and smooth-scroll transitions. |
| Product rows | Thumbnail, name, short description, price, status | Whole row is one accessible trigger. Keep names and prices legible; any description truncation has complete text in details. Use one shared row component in catalog and search. |
| Product details | Full-screen mobile dialog | Larger photo, full localized copy, explicit variant prices, included benefits, substitutions, and add-on information. Use a native dialog with accessible labeling, focus containment, Escape/close handling, background scroll lock, and focus/scroll restoration. Prototype mobile browser Back closing the dialog through a temporary history entry. |
| Unavailable products | Visible, subdued, clearly marked “Tạm hết” | Keep details accessible so guests can still inspect the item. Distinguish an unavailable variant from a wholly unavailable product. Styling must preserve readable contrast and cannot rely on color alone. |
| Search | Search icon opens a focused search panel | Search preloaded menu text locally. Proposed separate results view preserves the underlying catalog rather than changing its category geometry. Opening a result shows product details; closing returns to the same query/results. Closing search returns to the catalog position. Use one dialog surface with explicit search/detail states rather than stacking modal dialogs. |
| Language | Vietnamese default, remembered VI/EN choice | One visible language at a time. Update interface, content, dialog, results, document language, and accessibility labels together. Preserve query and selected product; keep the current item/category in view if translated text changes layout. Storage failures fall back to Vietnamese without breaking browsing. |
| External actions | Grab, ShopeeFood, locations, Facebook/booking | Keep links in data. Clearly label external destinations. If a platform has separate branch links, show a short location list for that action without creating branch-specific menu state. Never guess business URLs. |
| Larger screens | Usable bounded layout | Start with a readable maximum width and the same continuous catalog. Desktop dialog can be centered. Final tablet/desktop composition remains a design-review decision. |

Search should ignore case and Vietnamese accents, including `đ`/`d`, so “ca phe” can match “Cà phê.” Index both Vietnamese and English names, descriptions, categories, and deliberate aliases, while displaying results in the chosen language. Prefer exact/name matches over description matches. Include an empty-query state, result count, clear control, and localized no-results state. Do not add fuzzy-search infrastructure unless real queries demonstrate a need.

## 3. Data model: ready for options without speculative infrastructure

Use local structured records with TypeScript types and build-time schema validation. Store money as integer VND, not formatted strings; format at the presentation boundary. Use stable IDs independent of names, language, display order, and future spreadsheet row positions.

| Record | Proposed contents |
| --- | --- |
| Menu/site configuration | Schema version, currency, default locale, ordered category IDs, external actions, and Discovery blocks. |
| Category | Stable ID, Vietnamese/English label, display order. |
| Product | Stable ID, category ID, localized name/short description/full description, image reference, badges, availability, variant records, and applicable option groups. |
| Variant | Stable ID, localized label, attributes such as size/temperature, integer price, availability, and any variant-specific benefits or option rules. A single-price product has one default variant. |
| Option group | Stable ID, localized label, choices, defaults where meaningful, and selection limits. |
| Option choice | Stable ID, localized label, price adjustment, and explicit applicability to variants where required. |
| Included benefit/substitution | Structured reference to the relevant choice/group, qualifying variant IDs, and included quantity or price adjustment. Use explicit data for real rules rather than hiding eligibility in description text. |
| Image asset | Local file reference, useful localized alternative text where appropriate, and optional crop/focal-point metadata if needed. |
| Discovery block | Stable ID, supported block type, enabled flag, order, localized copy, image/product references, and optional typed destination. |

Avoid storing competing `basePrice`, `sizes`, and `variants` price sources. Variants own the displayed price. Confirmed after prototype review: catalog and search rows show the first variant price in editorial order. Details explain which variant costs what. Add-on charges remain separately labeled and do not inflate the base menu price.

Validate the schema against these cases before locking it:

1. One product with one price.
2. S/M variants with different prices.
3. A free topping included only with a particular variant.
4. Oat milk free for selected products and paid where the real menu specifies it.
5. A paid extra such as sausage.
6. Hot/cold availability, including a size/temperature combination that does not exist.
7. A fully unavailable product and a product with only one unavailable variant.
8. Long Vietnamese/English names and descriptions, with and without badges.

Confirmed prototype content choice: use a small illustrative menu first; add real content later. Use roughly 8–12 clearly identified illustrative products. Their prices, offers, and imagery are test fixtures, not facts about Cà Zone and not production content. Use simple labeled placeholder thumbnails initially; actual product photos replace them before launch.

Build validation should reject duplicate IDs, broken category/product/variant references, missing required translations, invalid monetary values, impossible option limits, and missing production images. Cross-check conditional benefits against the source menu manually as well.

Do not add branch tables now. Keep product data separate from the content-loading boundary so a later menu resolver can apply branch-specific price and availability overrides. Preparing for transactions reduces avoidable data changes; it does not guarantee that future ordering requirements will require no architectural work.

## 4. Technical structure

Use Astro static output, TypeScript, component-scoped CSS/shared design tokens, and small browser modules. Start without a client UI framework or global state library. Astro supports processed browser scripts directly, which fits this interaction scope. [Astro scripts documentation](https://docs.astro.build/en/guides/client-side-scripts/)

Proposed organization:

```text
src/
  assets/                  Product and brand source images
  data/                    Products, categories, Discovery, site configuration
  domain/                  Schema, validation, derived menu/pricing helpers
  content/                 loadMenu() source boundary
  i18n/                    Interface translations and locale helpers
  components/              Header, Discovery, CategoryNav, ProductRow,
                           ProductDetails, SearchPanel, ExternalActions
  scripts/                 Locale, category tracking, dialog and search behavior
  styles/                  Shared tokens and base styles
  pages/                   index.astro and 404.astro
tests/                     Data/search tests and critical browser journeys
public/                    Favicon and static hosting metadata
astro.config.mjs
wrangler.jsonc
README.md
```

Generate the Vietnamese catalog as static HTML so initial browsing is immediate and the core menu remains readable if JavaScript fails. Enhance the existing page with locale changes and interactions. Ship only the client data needed for alternate text, details, and search; avoid duplicating full hidden catalogs and loading large detail images up front. Preserve basic category anchors in the unenhanced page.

Keep browser state small and explicit: locale, active category, dialog view, query, selected product, and return context. Derive product content and prices from the menu records. In particular, the product-details renderer should accept a product/variant model without owning future cart state.

Optimize locally stored images at build time into responsive sizes. Reserve image dimensions, lazy-load below-fold thumbnails, and load large detail images when needed. Prioritize only genuinely above-fold imagery. Astro provides build-time image processing and responsive image support. [Astro images documentation](https://docs.astro.build/en/guides/images/)

## 5. Delivery stages and review points

| Stage | Work | Concrete deliverable / completion condition |
| --- | --- | --- |
| 1. Content inventory and focused reference research | Inspect the current menu, logo, colors/fonts, photos, and outbound links when available. Review 3–5 relevant menu experiences for density, Discovery, details, navigation, and bilingual handling. Separate useful behavior from branding. | Content-gap list, brief reference comparison, and at most two low-fidelity arrangements. Choose a provisional arrangement for the prototype; leave visual tokens adjustable. |
| 2. Data foundation and static shell | Set up Astro/TypeScript, schema, representative records, components, and static build. | One page generated from validated menu data. Changing product/category/Discovery records changes the page without component edits. |
| 3. Working structural prototype | Add category tracking, dialog transitions, search, localization, availability states, and external-action structure. | All V1 behaviors can be reviewed together on a phone. Demo empty Discovery, no search results, long text, unavailable variants, and variant benefits. |
| 4. Prototype review and visual refinement | Review browsing density, sticky behavior, price clarity, dialog use, search return flow, and VI/EN changes. Apply an agreed direction using existing brand assets. | Refined mobile screens and usable desktop layout, with documented decisions on the intentionally open visual questions. |
| 5. Full content and quality checks | Import confirmed menu, review translations, optimize images, verify prices/options and links, test actual target browsers. | Production dataset with no placeholder offers/prices/photos, passing behavior checks, and documented performance measurements. |
| 6. Deployment and handover | Configure GitHub checks and Cloudflare deployment; review preview; connect the intended domain as part of the release. Document updates and rollback. | Verified HTTPS site at `menu.cazone.vn`, plus a short guide to changing products, prices, availability, Discovery, and publishing updates. |

First implementation scope: stages 2–3 using the confirmed illustrative-menu approach, with the minimum reference work needed from stage 1. Real menu assets do not block this prototype. Review the working prototype before applying a full visual treatment or mass-importing content. No reliable calendar estimate yet: menu size, usable photo coverage, translation readiness, and review cycles are unknown. Re-estimate after inventory and the first end-to-end prototype.

## 6. Acceptance checks

| Area | Evidence we should collect |
| --- | --- |
| Data accuracy | Representative tricky records validated; full prices and benefits checked against the authoritative menu before launch. Missing assets/translations fail production validation. |
| Category behavior | Sticky only after Discovery; click lands below the sticky bar; manual scrolling updates the active category; final category works at document bottom; horizontal strip does not jerk the page. |
| Details and return flow | Opening/closing repeatedly preserves catalog position and focus; mobile Back closes the active detail state; search → detail → search preserves the query. Test dialog behavior in iOS Safari and Android Chrome. |
| Language | Default VI, remembered EN on reload, all visible/accessibility text changes, open details refresh, search stays usable, and blocked local storage does not crash. |
| Search | Accented/unaccented Vietnamese, `đ`/`d`, English, whitespace, empty query, no matches, and unavailable items behave correctly. |
| Accessibility | Keyboard operation, visible focus, labeled icon buttons, dialog semantics, reduced motion, readable status contrast, and approximately 44px touch targets. Check 200% text zoom. |
| Responsive layout | Representative 320/375/390/430px widths plus tablet/desktop; long names; no unintended horizontal page overflow; safe-area handling in the full-screen dialog. |
| Performance | Measure a production build with mobile throttling. Proposed lab targets: LCP ≤2.5s, CLS ≤0.1, initial compressed custom JS ≤40KB excluding menu payload, and an initial viewport transfer target ≤500KB. Report actual results and tradeoffs. Assess field interaction performance after launch if measurements are available; lab scores are not a guarantee of real-user results. |
| Release | Build and type/schema checks pass, critical browser journeys pass, external links verified, HTTPS/domain works, 404 behavior checked, no prototype content remains, and rollback documented. |

Use focused unit tests for schema rules, price derivation, and search normalization, plus a small browser suite for the cross-feature journeys above. Avoid broad snapshots of every component. Repeat checks when changes affect the behavior being tested.

## 7. Hosting and day-to-day updates

Deploy Astro's built `dist/` as Cloudflare Workers Static Assets. A purely static Astro deployment needs no request-time rendering worker. Keep the Wrangler configuration explicit and committed rather than depending on implicit deployment detection. [Cloudflare Astro deployment guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)

Use one deployment path: GitHub checks validate changes, and Cloudflare's Git integration builds/deploys the selected production branch. Verify account access, repository choice, build environment, and preview configuration during release setup. Do not add a second independent production deployment pipeline.

A V1 update follows: edit data/images → validate and build → review → deploy. Availability is a published snapshot; staff cannot mark an item unavailable instantly without an edit and deployment. Choose HTML caching that allows new menus to appear promptly while caching hashed assets efficiently. Avoid an offline service worker in V1 because stale pricing and availability would complicate updates.

Before domain activation, inspect existing `menu.cazone.vn` DNS/hosting so an existing destination is understood. Keep the previous working deployment available for rollback. Include localized page metadata where feasible, brand favicon/social preview, and keep illustrative preview content out of search indexing.

## 8. Evolution after V1

| Version | Intended extension | What V1 preserves |
| --- | --- | --- |
| V2 | Build-time Google Sheets import; branch overrides if required | `loadMenu()` returns the same validated domain records. A Sheets adapter maps rows into them and rejects bad imports before deployment. Sheets credentials stay in build secrets. A failed import keeps the last successful site live. |
| V3 | Option selection, quantities, cart | Reuse stable product/variant/choice IDs and eligibility data. Add selection validation, price calculation, and a separate cart module around the detail view. Recheck actual transaction rules at this stage. |
| V4+ | Direct ordering and payments | Introduce authoritative server-side pricing, availability checks, and order/payment handling when requested. Browser menu data cannot be the authority for accepting a paid order. |

## 9. Inputs and unresolved decisions

Needed for an accurate full menu: the authoritative current menu/prices, complete option/inclusion rules, official brand assets, usable product photos, and verified external links by channel/location. Proposed translation workflow: draft English from approved Vietnamese source, then obtain a business terminology/content review.

Needed for release: target GitHub repository/account, Cloudflare access, and control of the domain's DNS. These are not necessary for a local structural prototype.

Still open for prototype review: exact header composition, Discovery arrangement and height, row/image dimensions, pricing notation, colors/fonts/radius, animations, product-detail composition, and tablet/desktop layout. No proposed UI default above should be treated as finalized brand direction.

The first review should answer four practical questions: Can a guest reach a category quickly? Can they understand prices and included options without guessing? Can they inspect several products without losing their place? Does Discovery help discovery without making the full menu feel far away?
