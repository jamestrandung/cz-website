import type { Locale, Menu, Product } from '../domain/menu';
import { resolveGroup, memberships, productComboPrice, type Campaign } from '../domain/combos';
import { escapeHtml, formatPrice } from '../domain/presentation';
import { thumbnailSet } from '../domain/images';
import { ticketIcon } from '../components/ticketIcon';
import { caMarkHtml } from '../components/caMark';
import { ui, comboCount, type UiKey } from '../i18n/ui';
export const esc = escapeHtml;
// Interface copy lives in i18n/ui.ts; escape it like any other inserted text.
const tx = (locale: Locale, key: UiKey) => esc(ui[key][locale]);
export function productComboNote(menu: Menu, campaigns: Campaign[], p: Product, locale: Locale) {
  const count = memberships(menu, campaigns, p).length;
  return count
    ? `<span class="combo-product-note">${ticketIcon}${esc(comboCount(count)[locale])}</span>`
    : '';
}
export function productComboLinks(menu: Menu, campaigns: Campaign[], p: Product, locale: Locale) {
  const matches = memberships(menu, campaigns, p);
  if (!matches.length) return '';
  return `<section class="product-combos"><h3>${tx(locale, 'inCombo')}</h3>${matches
    .map(
      ({ campaign: c, offers }) =>
        `<button type="button" class="product-combo-link" data-combo="${esc(c.id)}" data-offer="${esc(offers[0].id)}" data-highlight="${esc(p.id)}"><span>${ticketIcon}<strong>${caMarkHtml(c.title[locale])}</strong><small>${offers.map((o) => esc(o.label[locale])).join(' · ')}</small></span><span>${tx(locale, 'from')} ${formatPrice(Math.min(...offers.map((o) => productComboPrice(menu, o, p))))} →</span></button>`,
    )
    .join('')}</section>`;
}
export function comboMarkup(
  menu: Menu,
  campaign: Campaign,
  offerId: string | undefined,
  locale: Locale,
  highlightId?: string,
) {
  const o = campaign.offers.find((o) => o.id === offerId) ?? campaign.offers[0];
  const groupMarkup = o.groups
    .map((g) => {
      const entries = resolveGroup(menu, g);
      return `<section><h3>${tx(locale, 'choose')} ${g.quantity} ${esc(g.label[locale])} <span>${entries.length} ${tx(locale, 'choices')}</span></h3>${entries
        .map(({ product: p, variants }) => {
          const available =
            p.availability === 'available' &&
            variants.some((v) => v.variant.availability === 'available');
          return `<button type="button" class="combo-item ${p.id === highlightId ? 'combo-item-highlight' : ''} ${!available ? 'is-unavailable' : ''}" data-product="${esc(p.id)}"><img src="${esc(p.image)}" ${thumbnailSet(p) ? `srcset="${esc(thumbnailSet(p)!)}" sizes="64px"` : ''} alt="" width="64" height="64" loading="lazy"><span><strong>${esc(p.name[locale])}</strong>${variants.map(({ variant: v, surcharge }) => `<small class="combo-variant">${esc(v.label[locale])} <b>${surcharge ? `+${formatPrice(surcharge)}` : tx(locale, 'includedInCombo')}</b>${v.availability === 'unavailable' ? ` · ${tx(locale, 'unavailable')}` : ''}</small>${v.benefits.map((b) => `<small class="benefit">${esc(v.label[locale])}: ${esc(b.label[locale])}</small>`).join('')}`).join('')}${!available ? `<small class="status">${tx(locale, 'unavailable')}</small>` : ''}${p.id === highlightId ? `<small class="combo-item-origin">${tx(locale, 'viewingItem')}</small>` : ''}</span><span aria-hidden="true">↗</span></button>`;
        })
        .join('')}</section>`;
    })
    .join('');
  return `<div class="combo-detail-head deal-${campaign.theme}"><p class="eyebrow">${tx(locale, 'comboEyebrow')}</p><h2 id="combo-title">${caMarkHtml(campaign.title[locale])}</h2><p>${esc(campaign.description[locale])}</p><div class="combo-price"><strong>${formatPrice(o.price)}</strong><span>${o.groups.map((g) => `${g.quantity} ${esc(g.label[locale])}`).join(' + ')}</span></div></div><div class="combo-body">${campaign.offers.length > 1 ? `<div class="combo-offers" role="group" aria-label="${tx(locale, 'comboOptions')}">${campaign.offers.map((opt) => `<button type="button" data-combo-offer="${esc(opt.id)}" aria-pressed="${opt.id === o.id}"><span>${esc(opt.label[locale])}</span><strong>${formatPrice(opt.price)}</strong></button>`).join('')}</div>` : ''}<p class="combo-terms">${esc(campaign.note[locale])}</p>${groupMarkup}${o.extras.length ? `<section class="combo-extras"><h3>${tx(locale, 'optionalExtras')}</h3>${o.extras.map((e) => `<div class="option-row"><span>${esc(e.label[locale])}</span><strong>+${formatPrice(e.price)}</strong></div>`).join('')}</section>` : ''}<p class="combo-terms">${tx(locale, 'comboFinePrint')}</p></div>`;
}
