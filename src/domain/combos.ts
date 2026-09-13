import { z } from 'zod';
import {
  localizedSchema,
  markedLocalizedSchema,
  type Menu,
  type Product,
  type Variant,
} from './menu';
const id = z.string().min(1);
const money = z.number().int().nonnegative();
// Size labels and upgrade amounts are content, not application branches.
export const sizeOrder = ['S', 'M', 'L'];
const policySchema = z.object({
  includedSize: z.string().optional(),
  allowedSizes: z.array(z.string()).optional(),
  allowUnsized: z.boolean().default(true),
  upgrades: z.record(z.string(), money).default({ M: 10000 }),
  variantPrices: z.record(z.string(), money).default({}),
});
const choiceSchema = z.object({ productId: id, policy: policySchema });
const groupSchema = z.object({
  id,
  label: localizedSchema,
  quantity: z.number().int().positive(),
  choices: z.array(choiceSchema).min(1),
});
const offerSchema = z.object({
  id,
  label: localizedSchema,
  price: money,
  groups: z.array(groupSchema).min(1),
  extras: z
    .array(z.object({ label: localizedSchema, price: money, productId: id.optional() }))
    .default([]),
});
export const campaignSchema = z.object({
  id,
  active: z.boolean(),
  title: markedLocalizedSchema,
  description: localizedSchema,
  theme: z.enum(['yellow', 'sage', 'peach', 'ink']),
  imageProductIds: z.array(id).min(1).max(2),
  offers: z.array(offerSchema).min(1),
  note: localizedSchema,
});
export type Campaign = z.infer<typeof campaignSchema>;
export type ComboOffer = Campaign['offers'][number];
export type Choice = ComboOffer['groups'][number]['choices'][number];
export type VariantPolicy = Choice['policy'];
export type ResolvedVariant = { variant: Variant; surcharge: number };
export function resolveChoice(product: Product, policy: VariantPolicy): ResolvedVariant[] {
  const sizes = product.variants
    .flatMap((v) => (v.attributes.size ? [v.attributes.size] : []))
    .filter((s) => !policy.allowedSizes || policy.allowedSizes.includes(s));
  for (const size of sizes)
    if (!sizeOrder.includes(size)) throw new Error(`Unknown size order: ${size}`);
  // Availability never changes the baseline price.
  const base =
    policy.includedSize ??
    [...sizes].sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))[0];
  return product.variants.flatMap((variant) => {
    const size = variant.attributes.size;
    if (size ? policy.allowedSizes && !policy.allowedSizes.includes(size) : !policy.allowUnsized)
      return [];
    const surcharge =
      policy.variantPrices[variant.id] ?? (!size || size === base ? 0 : policy.upgrades[size]);
    if (surcharge === undefined)
      throw new Error(`Missing upgrade price: ${product.id}/${variant.id}`);
    return [{ variant, surcharge }];
  });
}
export function resolveGroup(menu: Menu, group: ComboOffer['groups'][number]) {
  return group.choices
    .map((choice) => {
      const product = menu.products.find((p) => p.id === choice.productId);
      if (!product) throw new Error(`Unknown combo product: ${choice.productId}`);
      return { product, variants: resolveChoice(product, choice.policy) };
    })
    .filter((c) => c.variants.length);
}
export function memberships(menu: Menu, campaigns: Campaign[], product: Product) {
  return campaigns
    .filter((c) => c.active)
    .flatMap((campaign) => {
      const offers = campaign.offers.filter((o) =>
        o.groups.some((g) => resolveGroup(menu, g).some((c) => c.product.id === product.id)),
      );
      return offers.length ? [{ campaign, offers }] : [];
    });
}
export function productComboPrice(menu: Menu, offer: ComboOffer, product: Product) {
  const surcharges = offer.groups.flatMap((g) =>
    resolveGroup(menu, g)
      .filter((c) => c.product.id === product.id)
      .flatMap((c) => c.variants.map((v) => v.surcharge)),
  );
  return offer.price + Math.min(...surcharges);
}
export function validateCampaigns(menu: Menu, raw: unknown): Campaign[] {
  const campaigns = z.array(campaignSchema).parse(raw);
  const unique = (ids: string[]) => {
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate combo ID or choice');
  };
  unique(campaigns.map((c) => c.id));
  for (const c of campaigns) {
    unique(c.offers.map((o) => o.id));
    for (const pid of c.imageProductIds)
      if (!menu.products.some((p) => p.id === pid)) throw new Error(`Unknown combo image: ${pid}`);
    for (const o of c.offers) {
      unique(o.groups.map((g) => g.id));
      for (const g of o.groups) {
        unique(g.choices.map((c) => c.productId));
        for (const choice of g.choices) {
          const p = menu.products.find((p) => p.id === choice.productId);
          if (!p) throw new Error(`Unknown combo product: ${choice.productId}`);
          for (const vid of Object.keys(choice.policy.variantPrices))
            if (!p.variants.some((v) => v.id === vid))
              throw new Error(`Unknown combo variant: ${vid}`);
          if (!resolveChoice(p, choice.policy).length)
            throw new Error(`No eligible variants: ${p.id}`);
        }
      }
      for (const e of o.extras)
        if (e.productId && !menu.products.some((p) => p.id === e.productId))
          throw new Error(`Unknown extra: ${e.productId}`);
    }
  }
  return campaigns;
}
