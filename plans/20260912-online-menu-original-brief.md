# Cà Zone Online Menu — Codex Implementation Brief

> Archived planning/source record. Retained for context; it may describe superseded proposals, prices, counts, or behavior. Use [current architecture](../docs/ARCHITECTURE.md) and [current pricing rules](../docs/PRICING_RULES.md) for maintenance. Do not use this record as current implementation instructions.

## 1. Goal

Build a fast, mobile-first online menu for Cà Zone to replace the current A3 PDF experience.

Primary URL:

`https://menu.cazone.vn`

V1 is primarily for **browsing and product discovery**, but the structure should be designed so transactional features such as product customization and **Add to Cart** can be added later without rebuilding the site from scratch.

---

## 2. Tech Stack

- **Astro**
- **TypeScript**
- HTML/CSS
- Minimal client-side JavaScript where needed
- Local structured menu data for V1
- **GitHub** for source control
- **Cloudflare Workers Static Assets** for hosting/CDN/HTTPS
- `menu.cazone.vn` as the custom domain

Keep V1 static and simple.

No backend, database, authentication, checkout, or ordering infrastructure is required yet.

---

## 3. Deployment Architecture

```text
GitHub
   ↓
Astro build
   ↓
Static HTML / CSS / JS / optimized images
   ↓
Cloudflare
   ↓
menu.cazone.vn
   ↓
Customer
```

The initial site should be fully static.

---

## 4. Product Roadmap

### V1 — Mobile Menu

Build the customer-facing menu experience with:

- Configurable Discovery section
- Sticky category navigation
- Compact product catalog
- Product detail view
- VI/EN language switching
- Client-side search
- Product availability state
- External links to ordering/contact/location channels

### V2 — Easier Menu Management

Move menu data out of code into a staff-friendly source, likely:

```text
Google Sheets
   ↓
Astro build
   ↓
Static website
```

Potential additions:

- Easier editing of products/prices
- Branch-specific menu data
- Branch-specific availability
- Richer structured product options
- Better promotion/discovery configuration

### V3 — Transaction Features

Add transactional behavior while keeping the same core menu structure:

- Product customization
- Size/options selection
- Add to Cart
- Cart state
- Quantity handling

### V4+ — Direct Ordering

Possible future capabilities:

- Checkout
- Direct ordering
- Promotions
- Corporate/office ordering
- Affiliate ordering
- Loyalty/account features
- Analytics and personalization

These are future possibilities, not V1 requirements.

---

# 5. V1 UX Structure

The main mobile page should follow this general structure:

```text
HEADER

DISCOVERY
Large, visual, configurable content
Scrolls away normally

CATEGORY NAVIGATION
Sticky after reaching the top

CATALOG
Compact product rows grouped by category

FOOTER / EXTERNAL ACTIONS
```

Exact visual styling is intentionally **not finalized yet**.

Do not over-design the UI before further competitor/design research and prototype review.

---

## 6. Discovery Section

There should be a configurable visual section above the normal menu catalog.

The implementation should **not assume what content will appear here**.

Possible future uses include:

- Seasonal items
- New drinks
- Best sellers
- Combos
- Discount offers
- Promotions
- Limited-time campaigns

The section should be driven by configuration/data so its content can change without rewriting components.

In V1, configuration can live in local data/code.

A staff-editable interface is a V2 concern.

The Discovery section should scroll away normally.

---

## 7. Category Navigation

Immediately below Discovery, show a horizontally scrollable category navigation bar.

Example:

```text
Cà phê | Matcha | Trà | Trà sữa | Đồ ăn | Bánh | ...
```

Required behavior:

- Scrolls normally while the user is in the Discovery area
- Becomes **sticky** when it reaches the top of the viewport
- Clicking a category scrolls to that menu section
- As the user manually scrolls through the menu, the active category updates automatically
- The horizontal tab strip should automatically move when necessary so the active category remains visible

Keep the catalog on a single continuous page rather than separate pages per category.

---

## 8. Catalog Product Rows

Products should use a compact one-column layout suitable for mobile.

Each product row should include:

- Small product image
- Product name
- Short description
- Price or price range
- Optional status/badges where relevant

Conceptually:

```text
[ image ]  Matcha Latte
           Matcha + fresh milk
           55K / 65K
```

Every product should have an image.

Product photography should help recognition without dominating the screen.

The entire product row should be clickable.

---

## 9. Product Detail View

Tapping a product row should open a **full-screen mobile overlay / drawer**, rather than navigating away to a different page.

The detail view should initially show:

- Larger product image
- Full product name
- Full description
- Price / variant pricing
- Relevant product information

Closing the detail view should return the user to the same scroll position in the catalog.

The detail view should be designed so future transaction controls can be added later:

```text
Size
Sugar
Ice
Toppings
Milk option
Quantity

[ Add to Cart ]
```

These transaction controls are **not required in V1**.

---

# 10. Product Data Model

Do not model a product as only:

```text
name + price
```

The current Cà Zone menu already has products with:

- S/M size differences
- Different prices by size
- Free toppings for some variants
- Free oat milk substitution for selected products
- Paid add-ons such as extra sausage
- Hot/cold variations
- Temporarily unavailable items

Design the data model so these concepts can be represented from the beginning, even if V1 only displays some of them.

Conceptually:

```text
Product
├── id
├── name
├── description
├── category
├── image
├── basePrice / variants
├── availability
├── badges
├── sizes
├── options
├── includedOptions
├── paidAddOns
└── substitutions
```

The schema should be transaction-ready even though V1 is not transactional.

---

## 11. Availability

Products should support configurable availability.

If an item is temporarily unavailable:

- Keep it visible in the menu
- Visually disable/de-emphasize it
- Show a clear status such as:

`Tạm hết`

Do not remove unavailable products entirely.

In V1, availability can be configured in local data.

---

# 12. Search

Include client-side menu search in V1.

Search should:

- Run entirely in the browser
- Search already-loaded menu data
- Require no backend
- Be available through a compact search icon/control rather than permanently consuming significant header space

It should support searching product names and relevant text.

---

# 13. Language

V1 should support:

- **Vietnamese**
- **English**

Display only one language at a time.

Use a compact language switcher such as:

```text
VI | EN
```

Requirements:

- Vietnamese is the default
- Remember the user's selected language locally in the browser
- Switching language updates all user-facing menu text
- Do not rely only on browser-language auto-detection

Localizable content includes:

- Category names
- Product names
- Product descriptions
- Discovery content
- Badges
- Availability text
- Interface labels
- Footer/actions

Structure content accordingly, e.g.:

```text
name
├── vi
└── en

description
├── vi
└── en
```

Locale-specific URLs are not required in V1.

---

# 14. Branches

All current Cà Zone branches use the same menu/pricing.

Therefore:

- Do not show a branch selector in V1
- Keep the data model flexible enough to support branch-specific menus or availability later

---

# 15. External Actions in V1

The menu should provide links to external channels for actions that are not yet handled by the website.

Include links for:

- **Grab**
- **ShopeeFood**
- **Google Maps / store locations**
- **Facebook page / contact for booking**

These are outbound links only.

Do not implement direct ordering in V1.

---

# 16. V1 Non-Goals

Do **not** build the following yet:

- Shopping cart
- Checkout
- Payment
- Customer authentication
- Customer accounts
- Loyalty
- Ordering backend
- Database
- Real-time inventory backend
- Admin dashboard
- Corporate ordering
- Affiliate ordering
- Complex branch logic

The architecture should allow future expansion, but V1 should remain lightweight.

---

# 17. Design Principles

The UI should optimize for:

1. **Mobile-first browsing**
2. **Fast scanning**
3. **Compact information density**
4. **Strong product imagery**
5. **Easy category navigation**
6. **Smooth transition to future transaction features**
7. **Fast page loading**
8. **Simple architecture**

The broad UX concept is:

```text
DISCOVERY
large, visual, selective/configurable

        ↓

CATALOG
compact, fast, comprehensive
```

The interface should feel more like a modern mobile ordering catalog than a digital version of an A3 printed menu.

---

# 18. Items Intentionally Left Open

Do not lock these decisions yet:

- Exact visual style
- Typography
- Colors beyond existing brand direction
- Card radius
- Exact thumbnail size/aspect ratio
- Discovery layout
- Animation details
- Exact header layout
- Exact category naming/grouping
- Exact product-detail composition
- How aggressively images are used in Discovery
- Final responsive behavior for tablet/desktop

These should be decided after further visual/competitor research and prototype review.

---

# 19. Initial Implementation Goal for Codex

Start by building a clean structural prototype that proves:

- Astro project setup works
- Menu data is cleanly separated from presentation
- Discovery is configurable
- Category tabs stick and track scroll position
- Product rows are compact and reusable
- Product detail overlay works
- VI/EN switching works
- Client-side search works
- Availability state works
- The codebase can later support product customization/cart without architectural rework

Prioritize **clean structure and extensibility over visual polish** in the first implementation.
