import { z } from 'zod';

export const localizedSchema = z.object({ vi: z.string().min(1), en: z.string().min(1) });
export type Localized = z.infer<typeof localizedSchema>;
export type Locale = 'vi' | 'en';
const money = z.number().int().nonnegative();
const availability = z.enum(['available', 'unavailable']);
const photoSchema = z.object({
  sources: z.object({
    240: z.string().startsWith('/images/products/'),
    480: z.string().startsWith('/images/products/'),
    800: z.string().startsWith('/images/products/'),
    1200: z.string().startsWith('/images/products/'),
  }),
  alt: localizedSchema,
  label: localizedSchema.optional(),
  variantIds: z.array(z.string()).optional(),
  focalPoint: z.string().default('50% 50%'),
});

const optionGroup = z.object({
  id: z.string().min(1),
  label: localizedSchema,
  kind: z.enum(['add-on', 'substitution', 'preference', 'included']),
  variantIds: z.array(z.string()).optional(),
  minSelections: z.number().int().nonnegative(),
  maxSelections: z.number().int().positive().optional(),
  choices: z
    .array(
      z.object({
        id: z.string().min(1),
        label: localizedSchema,
        priceDelta: money,
        maxQuantity: z.number().int().positive().optional(),
      }),
    )
    .min(1),
});

export const productSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  name: localizedSchema,
  summary: localizedSchema,
  description: localizedSchema,
  image: z.string().startsWith('/'),
  imageAlt: localizedSchema,
  photos: z.array(photoSchema).default([]),
  badges: z.array(z.enum(['bestseller', 'must-try'])).default([]),
  availability,
  preparationMinutes: z.number().int().positive().optional(),
  sourceCodes: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  optionGroups: z.array(optionGroup).default([]),
  variants: z
    .array(
      z.object({
        id: z.string().min(1),
        label: localizedSchema,
        price: money,
        availability,
        attributes: z.object({
          size: z.enum(['S', 'M']).optional(),
          temperature: z.enum(['hot', 'cold']).optional(),
        }),
        benefits: z
          .array(
            z.object({
              id: z.string().min(1),
              label: localizedSchema,
              // A descriptive source claim can remain unconfigured until eligibility is confirmed.
              kind: z.enum(['included-choice', 'substitution', 'unconfirmed-inclusion']),
              groupId: z.string().optional(),
              choiceIds: z.array(z.string()).optional(),
              quantity: z.number().int().positive().optional(),
            }),
          )
          .default([]),
      }),
    )
    .min(1),
});

export const menuSchema = z
  .object({
    schemaVersion: z.literal(1),
    currency: z.literal('VND'),
    contentStatus: z.enum(['illustrative', 'pdf-imported']),
    categories: z
      .array(z.object({ id: z.string().min(1), name: localizedSchema, subtitle: localizedSchema }))
      .min(1),
    products: z.array(productSchema).min(1),
  })
  .superRefine((menu, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
    const unique = (ids: string[], label: string) => {
      if (new Set(ids).size !== ids.length) fail(`Duplicate ${label}`);
    };
    unique(
      menu.categories.map((c) => c.id),
      'category IDs',
    );
    unique(
      menu.products.map((p) => p.id),
      'product IDs',
    );
    for (const p of menu.products) {
      if (!menu.categories.some((c) => c.id === p.categoryId)) fail(`Unknown category: ${p.id}`);
      for (const photo of p.photos) {
        if (photo.variantIds?.some((id) => !p.variants.some((v) => v.id === id)))
          fail(`Unknown photo variant: ${p.id}`);
      }
      unique(
        p.variants.map((v) => v.id),
        `variant IDs in ${p.id}`,
      );
      unique(
        p.optionGroups.map((g) => g.id),
        `option group IDs in ${p.id}`,
      );
      for (const g of p.optionGroups) {
        unique(
          g.choices.map((c) => c.id),
          `choice IDs in ${p.id}/${g.id}`,
        );
        if (
          g.maxSelections !== undefined &&
          (g.minSelections > g.maxSelections || g.maxSelections > g.choices.length)
        )
          fail(`Invalid option limits: ${p.id}/${g.id}`);
        if (g.variantIds?.some((id) => !p.variants.some((v) => v.id === id)))
          fail(`Unknown option variant: ${p.id}/${g.id}`);
      }
      for (const v of p.variants) {
        unique(
          v.benefits.map((b) => b.id),
          `benefit IDs in ${p.id}/${v.id}`,
        );
        for (const b of v.benefits) {
          if (b.kind !== 'unconfirmed-inclusion' && (!b.groupId || !b.choiceIds?.length))
            fail(`Missing benefit choices: ${p.id}/${v.id}`);
          if (b.groupId) {
            const group = p.optionGroups.find((g) => g.id === b.groupId);
            if (!group || b.choiceIds?.some((id) => !group.choices.some((c) => c.id === id)))
              fail(`Unknown benefit option: ${p.id}/${v.id}`);
            if (group?.variantIds && !group.variantIds.includes(v.id))
              fail(`Benefit outside option variants: ${p.id}/${v.id}`);
          }
        }
      }
    }
  });

export type Menu = z.infer<typeof menuSchema>;
export type Product = Menu['products'][number];
export type Variant = Product['variants'][number];
export {
  text,
  isAvailable,
  formatPrice,
  priceLabel,
  normalizeSearch,
  searchProducts,
} from './presentation';
