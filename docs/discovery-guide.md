# Updating Discovery

The horizontal Deals/Combos slider below Discovery is a separate section. See [the combo guide](combos-guide.md) to edit it; changing Discovery does not change combos.

Discovery is the large yellow banner at the top of the menu. It has an eyebrow, headline, description, button, decorative stamp, and up to two featured product photos.

Open `src/data/menu.ts` and edit **only the `export const discovery = { ... }` block**. This is TypeScript, not JSON: use `t('Vietnamese', 'English')` for localized copy. Keep the surrounding menu adapter, store locations and outbound links intact.

## Example configuration

This is the current configuration, ready to use as a starting point:

```ts
export const discovery = {
  enabled: true,
  eyebrow: t('MỘT CHÚT CÀ, NHIỀU CẢM HỨNG', 'A LITTLE COFFEE, A LOT OF INSPIRATION'),
  title: t('Đúng gu bạn.\nTrọn ngày vui.', 'Your kind of sip.\nYour kind of day.'),
  description: t(
    'Cà phê đậm đà, trà thanh mát và vài món ngon.\nCứ thong thả, chọn món bạn thích.',
    'Bold coffee, refreshing tea, and a little something to eat.\nTake your time. Find your favorite.',
  ),
  action: t('Khám phá món tủ', 'Find your favorite'),
  targetCategory: 'signature',
  featuredProductIds: ['ca-phe-muoi', 'matcha-latte'],
};
```

| Field | Effect |
| --- | --- |
| `enabled` | `true` shows the whole section; `false` hides it |
| `eyebrow` | Small uppercase text above the headline |
| `title` | Large headline; `\n` inserts a deliberate line break |
| `description` | Supporting text below the headline; also accepts `\n` |
| `action` | Main button label |
| `targetCategory` | Category ID to scroll to when that button is clicked; not a URL |
| `featuredProductIds` | Zero to two distinct product IDs; first uses the left photo position, second the right |

## Common changes

**Change a promotion's wording:** replace both languages of the eyebrow, title, description and button. Keep the headline around two short lines and the description around two or three lines. Avoid long button labels. Preview both languages at 320–390px wide; a short Vietnamese phrase may need a longer English translation.

**Send the button to Coffee:** set `targetCategory: 'coffee'`. Use an existing category ID from `products.json`, not its translated display name. Changing this target does not reorder categories.

**Feature another dish:** replace an ID in `featuredProductIds`, e.g. `['phin-cam', 'matcha-latte']`. Its displayed name and first photo come from that product automatically. Clicking the photo opens that dish's details. The two featured products do not have to belong to the target category, and their order is not affected by catalog price sorting.

Choose products with real photos for this banner. Without one, their category icon appears in the frame. To change the featured image, reorder that dish's photo mapping so the desired photo is first, then regenerate its photos. This changes its catalog photo too; there is not a separate hero-image override.

**Hide Discovery:** change `enabled` to `false`. Keep the category/product references valid, or set `featuredProductIds: []` and retain a valid target category; validation still checks references while hidden. Re-enable with `true`.

**Show fewer featured items:** use one ID or `[]`. The section supports up to two; the current two-card layout does not recenter a single image or remove the decorative art area when empty. Two photographed items are the recommended arrangement. More than two needs a layout change rather than another array entry.

**Change the circular stamp:** edit `stampFirst` and `stampSecond` in `src/i18n/ui.ts`. The “CÀ PHÊ, MÓN NGON…” header tagline is `headerTagline` there too; it is outside Discovery's content record.

## Scope and validation

This is one manually edited banner, with no carousel, scheduling, external-link button, per-product hero crop, or campaign CMS. Layout, photo-frame styling and responsive behavior live in `src/pages/index.astro` and `src/styles/global.css`; ordinary content updates do not require CSS changes.

After editing:

```sh
npm run menu:check
npm run build
```

Then review `http://localhost:4321/` in VI and EN, click the main button, click each photo, and check phone width for text/frame overlap. Neither command deploys the website. If a featured product is removed later, update its reference here before completing that deletion.

Back to [menu maintenance](maintaining-menu.md) · [photo workflow](image-workflow.md).
