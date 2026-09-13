import type { Localized, Menu, Product } from './menu';

export const text = (vi: string, en: string): Localized => ({ vi, en });
export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

// Marks where the "cà" logo mark (CaMark) should replace literal text, e.g.
// "[Cà] đông [cà] phê". Case inside the brackets is kept only for the
// plain-text fallback (stripCaMark) — the rendered mark itself has one fixed
// look regardless of case.
const CA_MARK = /\[(Cà|cà)\]/g;
export const stripCaMark = (value: string) => value.replace(CA_MARK, '$1');
export const renderCaMark = (
  value: string,
  escapeText: (s: string) => string,
  markHtml: string,
): string => {
  let result = '';
  let lastIndex = 0;
  for (const match of value.matchAll(CA_MARK)) {
    // The mark itself is aria-hidden (decorative), so pair it with a visually
    // hidden copy of the real word for the accessible name.
    result +=
      escapeText(value.slice(lastIndex, match.index)) +
      `<span class="sr-only">${escapeText(match[1])}</span>${markHtml}`;
    lastIndex = match.index! + match[0].length;
  }
  return result + escapeText(value.slice(lastIndex));
};
export const isAvailable = (p: Product) =>
  p.availability === 'available' && p.variants.some((v) => v.availability === 'available');
export const formatPrice = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
export function priceLabel(p: Product) {
  // Variant order is editorial: the first is the catalog's starting option.
  return formatPrice(p.variants[0].price);
}

const drinkCategories = new Set(['signature', 'coffee', 'tea', 'milk-tea', 'matcha', 'healthy']);
export function categoryProducts(menu: Menu, categoryId: string): Product[] {
  const products = menu.products.filter((p) => p.categoryId === categoryId);
  // Sort by the visible price; retain editorial order for ties and non-drink groups.
  return drinkCategories.has(categoryId)
    ? products.sort((a, b) => b.variants[0].price - a.variants[0].price)
    : products;
}
export function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}
export function searchProducts(menu: Menu, query: string): Product[] {
  const q = normalizeSearch(query);
  if (!q) return [];
  const tokens = q.split(' ');
  return menu.products
    .map((p, index) => {
      const name = normalizeSearch(`${p.name.vi} ${p.name.en} ${p.aliases.join(' ')}`);
      const category = menu.categories.find((c) => c.id === p.categoryId)!;
      const all = normalizeSearch(
        `${name} ${p.summary.vi} ${p.summary.en} ${p.description.vi} ${p.description.en} ${category.name.vi} ${category.name.en}`,
      );
      return {
        p,
        index,
        score: tokens.every((t) => all.includes(t)) ? (name.includes(q) ? 2 : 1) : 0,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((r) => r.p);
}
