import type { Locale, Menu, Product } from '../domain/menu';
import { resolveGroup, memberships, productComboPrice, type Campaign } from '../domain/combos';
import { formatPrice } from '../domain/presentation';
import { thumbnailSet } from '../domain/images';
import { ticketIcon } from '../components/ticketIcon';
export const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
export const say = (locale: Locale, vi: string, en: string) => (locale === 'vi' ? vi : en);
export function productComboNote(menu: Menu, campaigns: Campaign[], p: Product, locale: Locale) {
  const count = memberships(menu, campaigns, p).length;
  return count
    ? `<span class="combo-product-note">${ticketIcon}${say(locale, `Có trong ${count} combo`, `In ${count} ${count === 1 ? 'combo' : 'combos'}`)}</span>`
    : '';
}
export function productComboLinks(menu: Menu, campaigns: Campaign[], p: Product, locale: Locale) {
  const matches = memberships(menu, campaigns, p);
  if (!matches.length) return '';
  return `<section class="product-combos"><h3>${say(locale, 'Mua cùng combo', 'Enjoy it in a combo')}</h3>${matches
    .map(
      ({ campaign: c, offers }) =>
        `<button type="button" class="product-combo-link" data-combo="${esc(c.id)}" data-offer="${esc(offers[0].id)}" data-highlight="${esc(p.id)}"><span>${ticketIcon}<strong>${esc(c.title[locale])}</strong><small>${offers.map((o) => esc(o.label[locale])).join(' · ')}</small></span><span>${say(locale, 'Từ', 'From')} ${formatPrice(Math.min(...offers.map((o) => productComboPrice(menu, o, p))))} →</span></button>`,
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
      return `<section><h3>${say(locale, 'Chọn', 'Choose')} ${g.quantity} ${esc(g.label[locale])} <span>${entries.length} ${say(locale, 'lựa chọn', 'choices')}</span></h3>${entries
        .map(({ product: p, variants }) => {
          const available =
            p.availability === 'available' &&
            variants.some((v) => v.variant.availability === 'available');
          return `<button type="button" class="combo-item ${p.id === highlightId ? 'combo-item-highlight' : ''} ${!available ? 'is-unavailable' : ''}" data-product="${esc(p.id)}"><img src="${esc(p.image)}" ${thumbnailSet(p) ? `srcset="${esc(thumbnailSet(p)!)}" sizes="64px"` : ''} alt="" width="64" height="64" loading="lazy"><span><strong>${esc(p.name[locale])}</strong>${variants.map(({ variant: v, surcharge }) => `<small class="combo-variant">${esc(v.label[locale])} <b>${surcharge ? `+${formatPrice(surcharge)}` : say(locale, 'Đã bao gồm', 'Included')}</b>${v.availability === 'unavailable' ? ` · ${say(locale, 'Tạm hết', 'Unavailable')}` : ''}</small>${v.benefits.map((b) => `<small class="benefit">${esc(v.label[locale])}: ${esc(b.label[locale])}</small>`).join('')}`).join('')}${!available ? `<small class="status">${say(locale, 'Tạm hết', 'Unavailable')}</small>` : ''}${p.id === highlightId ? `<small class="combo-item-origin">${say(locale, 'Món bạn đang xem', 'The item you were viewing')}</small>` : ''}</span><span aria-hidden="true">↗</span></button>`;
        })
        .join('')}</section>`;
    })
    .join('');
  return `<div class="combo-detail-head deal-${campaign.theme}"><p class="eyebrow">${say(locale, 'MỘT CHÚT CÀ, THÊM MÓN NGON', 'YOUR SIP, WITH A LITTLE EXTRA')}</p><h2 id="combo-title">${esc(campaign.title[locale])}</h2><p>${esc(campaign.description[locale])}</p><div class="combo-price"><strong>${formatPrice(o.price)}</strong><span>${o.groups.map((g) => `${g.quantity} ${esc(g.label[locale])}`).join(' + ')}</span></div></div><div class="combo-body">${campaign.offers.length > 1 ? `<div class="combo-offers" role="group" aria-label="${say(locale, 'Lựa chọn combo', 'Combo options')}">${campaign.offers.map((opt) => `<button type="button" data-combo-offer="${esc(opt.id)}" aria-pressed="${opt.id === o.id}"><span>${esc(opt.label[locale])}</span><strong>${formatPrice(opt.price)}</strong></button>`).join('')}</div>` : ''}<p class="combo-terms">${esc(campaign.note[locale])}</p>${groupMarkup}${o.extras.length ? `<section class="combo-extras"><h3>${say(locale, 'Thêm theo ý thích', 'Optional extras')}</h3>${o.extras.map((e) => `<div class="option-row"><span>${esc(e.label[locale])}</span><strong>+${formatPrice(e.price)}</strong></div>`).join('')}</section>` : ''}<p class="combo-terms">${say(locale, 'Ưu đãi topping và đổi sữa yến mạch vẫn áp dụng theo món nước và kích cỡ đủ điều kiện. Chạm vào món để xem chi tiết. Gọi combo tại quầy.', 'Regular topping and oat-milk offers still apply to eligible drinks and sizes. Tap an item for details. Order your combo at the counter.')}</p></div>`;
}
