import { comboMarkup, productComboLinks, productComboNote } from './combo-view';
import type { Campaign } from '../domain/combos';
import { thumbnailSet, detailSet } from '../domain/images';
import { badgeIcon } from '../components/badgeIcon';
import {
  escapeHtml,
  formatPrice,
  isAvailable,
  priceLabel,
  searchProducts,
} from '../domain/presentation';
import { stripCaMark, type Locale, type Menu, type Product } from '../domain/menu';
import { ui, type UiKey } from '../i18n/ui';

const menu: Menu = JSON.parse(document.querySelector('#menu-data')!.textContent!);
const campaigns: Campaign[] = JSON.parse(
  document.querySelector('#combo-data')?.textContent ?? '[]',
);
const dialog = document.querySelector<HTMLDialogElement>('#menu-dialog')!;
const detailPanel = document.querySelector<HTMLElement>('#detail-panel')!;
const searchPanel = document.querySelector<HTMLElement>('#search-panel')!;
const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;
const dialogScroll = document.querySelector<HTMLElement>('.dialog-scroll')!;
const backButton = document.querySelector<HTMLButtonElement>('.dialog-back')!;
const closeButton = document.querySelector<HTMLButtonElement>('.dialog-close')!;
const results = document.querySelector<HTMLElement>('#search-results')!;
const feedback = document.querySelector<HTMLElement>('.search-feedback')!;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const escape = escapeHtml;
const arrow =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
let locale: Locale = document.documentElement.lang === 'en' ? 'en' : 'vi';
const tr = (key: UiKey) => ui[key][locale];
let currentProduct: Product | null = null;
let currentPhoto = 0;
let catalogScroll = 0;
let returnFocus: HTMLElement | null = null;
let navigatingHistory = false;
type OverlayState = {
  czMenu: true;
  view: 'search' | 'detail' | 'combo';
  comboId?: string;
  offerId?: string;
  highlightId?: string;
  scroll?: number;
  focusTarget?: string;
  photoIndex?: number;
  depth: number;
  productId?: string;
};
let overlayState: OverlayState | null = null;
// A reload starts at the catalog, even if it happened with a dialog open.
if (history.state?.czMenu) history.replaceState(null, '');

function rowMarkup(p: Product) {
  return `<button type="button" class="product-row ${!isAvailable(p) ? 'is-unavailable' : ''}" data-product="${escape(p.id)}" aria-haspopup="dialog"><span class="product-image"><img src="${escape(p.image)}" ${thumbnailSet(p) ? `srcset="${escape(thumbnailSet(p)!)}" sizes="70px"` : ''} alt="" width="240" height="240" loading="lazy" decoding="async"></span><span class="product-copy"><span class="product-name">${escape(p.name[locale])}</span><span class="product-summary">${escape(p.summary[locale])}</span><span class="product-meta"><span class="price">${priceLabel(p)}</span>${!isAvailable(p) ? `<span class="status">${tr('unavailable')}</span>` : p.badges[0] ? `<span class="badge ${p.badges[0]}">${badgeIcon(p.badges[0])}${tr(p.badges[0])}</span>` : ''}</span>${productComboNote(menu, campaigns, p, locale)}</span><span class="product-open">${arrow}</span></button>`;
}

function renderSearch() {
  const query = searchInput.value;
  const found = searchProducts(menu, query);
  document.querySelector<HTMLButtonElement>('.search-clear')!.hidden = !query;
  if (!query.trim()) {
    feedback.textContent = tr('searchHint');
    results.innerHTML = '<div class="empty-search-art" aria-hidden="true">✳</div>';
  } else {
    feedback.textContent = `${found.length} ${tr('results')}`;
    results.innerHTML = found.length
      ? found.map(rowMarkup).join('')
      : `<div class="search-no-results"><span aria-hidden="true">⌕</span><h3>${tr('searchEmpty')}</h3><p>${tr('searchEmptyHint')}</p></div>`;
  }
}

function photoMarkup(p: Product) {
  const photo = p.photos[currentPhoto] ?? p.photos[0];
  if (!photo)
    return `<div class="detail-placeholder"><img src="${escape(p.image)}" alt="" width="64" height="64"><span>${tr('photoPending')}</span></div>`;
  return `<div class="detail-art"><img src="${escape(photo.sources[800])}" srcset="${escape(detailSet(photo))}" sizes="(max-width: 700px) min(100vw, 360px), 360px" alt="${escape(photo.alt[locale])}" width="800" height="800" style="object-position:${escape(photo.focalPoint)}"></div>${p.photos.length > 1 ? `<div class="photo-choices" role="group" aria-label="${tr('productPhotos')}">${p.photos.map((item, index) => `<button type="button" data-photo-index="${index}" aria-pressed="${index === currentPhoto}">${escape(item.label?.[locale] ?? String(index + 1))}</button>`).join('')}</div>` : ''}`;
}

function renderDetails(p: Product) {
  const category = menu.categories.find((c) => c.id === p.categoryId)!;
  detailPanel.innerHTML = `<div class="detail-media">${photoMarkup(p)}</div><div class="detail-body"><p class="eyebrow">${escape(stripCaMark(category.name[locale]))}</p><h2 id="detail-title">${escape(p.name[locale])}</h2><p class="detail-description">${escape(p.description[locale])}</p><div class="detail-status">${!isAvailable(p) ? `<span class="status">${tr('unavailable')}</span>` : p.badges.map((b) => `<span class="badge ${b}">${badgeIcon(b)}${tr(b)}</span>`).join('')}${p.preparationMinutes ? `<span class="detail-time">◷ ${p.preparationMinutes} ${tr('min')}</span>` : ''}</div><h3>${tr('variants')}</h3><div>${p.variants.map((v) => `<div class="variant-row ${v.availability === 'unavailable' ? 'variant-muted' : ''}"><div><span class="variant-label">${escape(v.label[locale])}${v.availability === 'unavailable' || p.availability === 'unavailable' ? `<span class="status">${tr('unavailable')}</span>` : ''}</span>${v.benefits.map((b) => `<span class="benefit">↳ ${escape(b.label[locale])}</span>`).join('')}</div><strong>${formatPrice(v.price)}</strong></div>`).join('')}</div>${p.optionGroups.map((g) => `<h3>${escape(g.label[locale])}</h3>${g.choices.map((c) => `<div class="option-row"><span>${escape(c.label[locale])}</span><span>${c.priceDelta === 0 ? tr('complimentary') : `+${formatPrice(c.priceDelta)}`}</span></div>`).join('')}`).join('')}${productComboLinks(menu, campaigns, p, locale)}<p class="detail-note">${tr('detailNote')}</p></div>`;
}

function lockCatalog() {
  if (dialog.open) return;
  catalogScroll = window.scrollY;
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.cssText = `position:fixed;top:-${catalogScroll}px;left:0;right:0;${scrollbarGap ? `padding-right:${scrollbarGap}px` : ''}`;
}

function closeDialog() {
  const wasOpen = dialog.open;
  if (wasOpen) dialog.close();
  document.body.style.cssText = '';
  if (wasOpen) {
    window.scrollTo({ top: catalogScroll, behavior: 'instant' });
    returnFocus?.focus({ preventScroll: true });
  }
  overlayState = null;
  currentProduct = null;
}

function renderCombo() {
  const c = campaigns.find((c) => c.id === overlayState?.comboId && c.active);
  if (!c || !overlayState) {
    closeDialog();
    return;
  }
  detailPanel.innerHTML = comboMarkup(
    menu,
    c,
    overlayState.offerId,
    locale,
    overlayState.highlightId,
  );
}
function showState(state: OverlayState) {
  lockCatalog();
  overlayState = state;
  backButton.hidden = state.depth <= 1;
  if (state.view === 'search') {
    currentProduct = null;
    detailPanel.hidden = true;
    searchPanel.hidden = false;
    dialog.setAttribute('aria-labelledby', 'search-title');
    renderSearch();
  } else if (state.view === 'combo') {
    currentProduct = null;
    searchPanel.hidden = true;
    detailPanel.hidden = false;
    renderCombo();
    if (!overlayState) return;
    dialog.setAttribute('aria-labelledby', 'combo-title');
  } else {
    const product = menu.products.find((p) => p.id === state.productId);
    if (!product) {
      closeDialog();
      return;
    }
    currentProduct = product;
    currentPhoto = state.photoIndex ?? 0;
    searchPanel.hidden = true;
    detailPanel.hidden = false;
    renderDetails(product);
    dialog.setAttribute('aria-labelledby', 'detail-title');
  }
  if (!dialog.open) dialog.showModal();
  dialogScroll.scrollTop = state.scroll ?? 0;
  const returnTarget = state.focusTarget
    ? dialogScroll.querySelector<HTMLElement>(state.focusTarget)
    : null;
  if (returnTarget) returnTarget.focus({ preventScroll: true });
  else if (state.view === 'search') searchInput.focus({ preventScroll: true });
  else closeButton.focus({ preventScroll: true });
}
function pushState(state: OverlayState, focusTarget?: string) {
  if (navigatingHistory) return;
  if (overlayState) {
    overlayState = {
      ...overlayState,
      scroll: dialogScroll.scrollTop,
      focusTarget,
      photoIndex: currentPhoto,
    };
    history.replaceState(overlayState, '');
  }
  history.pushState(state, '');
  showState(state);
}
function closeAll() {
  if (!overlayState || navigatingHistory) return;
  navigatingHistory = true;
  history.go(-overlayState.depth);
}
window.addEventListener('popstate', (event) => {
  navigatingHistory = false;
  if (event.state?.czMenu) showState(event.state as OverlayState);
  else closeDialog();
});
closeButton.addEventListener('click', closeAll);
backButton.addEventListener('click', () => {
  if (!navigatingHistory) {
    navigatingHistory = true;
    history.back();
  }
});
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeAll();
});
// Search inputs consume Escape to clear themselves in some browsers. Handle the
// dialog-level shortcut before that default so dismissal is consistent.
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closeAll();
  }
});
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    closeAll();
});

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const photoButton = event.target.closest<HTMLButtonElement>('[data-photo-index]');
  if (photoButton && currentProduct) {
    const index = Number(photoButton.dataset.photoIndex);
    if (currentProduct.photos[index]) {
      currentPhoto = index;
      if (overlayState) {
        overlayState.photoIndex = index;
        history.replaceState(overlayState, '');
      }
      detailPanel.querySelector('.detail-media')!.innerHTML = photoMarkup(currentProduct);
      detailPanel
        .querySelector<HTMLButtonElement>(`[data-photo-index="${index}"]`)!
        .focus({ preventScroll: true });
    }
  }
  const offerButton = event.target.closest<HTMLElement>('[data-combo-offer]');
  if (offerButton && overlayState?.view === 'combo') {
    overlayState.offerId = offerButton.dataset.comboOffer;
    history.replaceState(overlayState, '');
    const scroll = dialogScroll.scrollTop;
    renderCombo();
    detailPanel
      .querySelector<HTMLElement>(`[data-combo-offer="${overlayState.offerId}"]`)
      ?.focus({ preventScroll: true });
    dialogScroll.scrollTop = scroll;
    return;
  }
  const comboButton = event.target.closest<HTMLElement>('[data-combo]');
  if (comboButton) {
    pushState(
      {
        czMenu: true,
        view: 'combo',
        depth: (overlayState?.depth ?? 0) + 1,
        comboId: comboButton.dataset.combo,
        offerId: comboButton.dataset.offer,
        highlightId: comboButton.dataset.highlight,
      },
      `[data-combo="${comboButton.dataset.combo}"]`,
    );
    return;
  }
  const trigger = event.target.closest<HTMLElement>('[data-product]');
  if (trigger) {
    pushState(
      {
        czMenu: true,
        view: 'detail',
        depth: (overlayState?.depth ?? 0) + 1,
        productId: trigger.dataset.product,
      },
      `[data-product="${trigger.dataset.product}"]`,
    );
  }
  if (event.target.closest('[data-search]')) pushState({ czMenu: true, view: 'search', depth: 1 });
  const language = event.target.closest<HTMLButtonElement>('[data-locale]');
  if (language) applyLocale(language.dataset.locale as Locale, true);
});
document.querySelector('.search-form')!.addEventListener('submit', (event) => {
  event.preventDefault();
  searchInput.blur();
});
searchInput.addEventListener('input', () => {
  renderSearch();
});
document.querySelector('.search-clear')!.addEventListener('click', () => {
  searchInput.value = '';
  renderSearch();
  searchInput.focus();
});

function applyLocale(next: Locale, preservePosition = false) {
  const currentAnchor = Array.from(
    document.querySelectorAll<HTMLElement>('.product-list [data-product]'),
  ).find((e) => e.getBoundingClientRect().bottom > nav.getBoundingClientRect().bottom);
  const offset = currentAnchor?.getBoundingClientRect().top;
  const dialogPosition = dialogScroll.scrollTop;
  locale = next;
  document.documentElement.lang = locale;
  try {
    localStorage.setItem('cazone-locale', locale);
  } catch {
    /* Browsing still works without storage. */
  }
  document.querySelectorAll<HTMLElement>('[data-vi][data-en]').forEach((el) => {
    el.textContent = el.dataset[locale]!;
  });
  document.querySelectorAll<HTMLElement>('[data-locale-only]').forEach((el) => {
    el.hidden = el.dataset.localeOnly !== locale;
  });
  document.querySelectorAll<HTMLElement>('[data-label-vi]').forEach((el) => {
    el.setAttribute('aria-label', locale === 'vi' ? el.dataset.labelVi! : el.dataset.labelEn!);
  });
  document
    .querySelectorAll<HTMLButtonElement>('[data-locale]')
    .forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.locale === locale)),
    );
  document.title = `Cà Zone — ${tr('menu')}`;
  document
    .querySelector('meta[name=description]')!
    .setAttribute(
      'content',
      locale === 'vi'
        ? 'Khám phá cà phê, trà và món ngon tại Cà Zone.'
        : 'Discover coffee, tea, and little bites at Cà Zone.',
    );
  closeButton.setAttribute('aria-label', tr('close'));
  backButton.setAttribute('aria-label', tr('back'));
  searchInput.setAttribute('aria-label', tr('search'));
  searchInput.placeholder = tr('searchPlaceholder');
  document.querySelector('.search-clear')!.setAttribute('aria-label', tr('clear'));
  if (currentProduct) renderDetails(currentProduct);
  if (overlayState?.view === 'combo') renderCombo();
  if (!searchPanel.hidden) renderSearch();
  dialogScroll.scrollTop = dialogPosition;
  if (preservePosition && currentAnchor && offset !== undefined && !dialog.open)
    window.scrollBy({
      top: currentAnchor.getBoundingClientRect().top - offset,
      behavior: 'instant',
    });
  trackCategory();
}

const nav = document.querySelector<HTMLElement>('.category-nav')!;
const track = document.querySelector<HTMLElement>('.category-track')!;
const tabs = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-category]'));
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
let activeId = '';
let scheduled = false;
let targetId: string | null = null;
let targetTimeout: ReturnType<typeof setTimeout> | null = null;
function setActive(id: string) {
  if (activeId === id) return;
  activeId = id;
  for (const tab of tabs) {
    const active = tab.dataset.category === id;
    tab.classList.toggle('active', active);
    if (active) {
      tab.setAttribute('aria-current', 'true');
      const r = tab.getBoundingClientRect(),
        t = track.getBoundingClientRect();
      if (r.left < t.left || r.right > t.right)
        track.scrollBy({
          left: r.left < t.left ? r.left - t.left - 8 : r.right - t.right + 8,
          behavior: reducedMotion.matches ? 'instant' : 'smooth',
        });
    } else tab.removeAttribute('aria-current');
  }
}
function trackCategory() {
  if (dialog.open) return;
  if (targetId) {
    setActive(targetId);
    return;
  }
  let active = sections[0].id;
  const line = nav.getBoundingClientRect().height + 28;
  for (const section of sections)
    if (section.getBoundingClientRect().top <= line) active = section.id;
  if (window.scrollY + innerHeight >= document.documentElement.scrollHeight - 3)
    active = sections.at(-1)!.id;
  setActive(active);
}
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (
    !anchor ||
    (event instanceof MouseEvent &&
      (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey))
  )
    return;
  const section = document.getElementById(anchor.hash.slice(1));
  if (!section || !section.hasAttribute('data-section')) return;
  event.preventDefault();
  targetId = section.id;
  setActive(section.id);
  window.scrollTo({
    top: section.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 20,
    behavior: reducedMotion.matches ? 'instant' : 'smooth',
  });
  if (targetTimeout) clearTimeout(targetTimeout);
  targetTimeout = setTimeout(
    () => {
      targetId = null;
      trackCategory();
    },
    reducedMotion.matches ? 0 : 850,
  );
});
for (const eventName of ['wheel', 'touchstart'])
  window.addEventListener(
    eventName,
    () => {
      targetId = null;
    },
    { passive: true },
  );
window.addEventListener(
  'scroll',
  () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        trackCategory();
        scheduled = false;
      });
    }
  },
  { passive: true },
);
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
  trackCategory();
}).observe(nav);
applyLocale(locale);

const dealTrack = document.querySelector<HTMLElement>('.deals-track');
if (dealTrack) {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-deal-scroll]'));
  const updateDealButtons = () =>
    buttons.forEach((button) => {
      button.disabled =
        Number(button.dataset.dealScroll) < 0
          ? dealTrack.scrollLeft < 2
          : dealTrack.scrollLeft + dealTrack.clientWidth >= dealTrack.scrollWidth - 2;
    });
  buttons.forEach((button) =>
    button.addEventListener('click', () =>
      dealTrack.scrollBy({
        left:
          Number(button.dataset.dealScroll) *
          (dealTrack.querySelector<HTMLElement>('.deal-card')!.offsetWidth +
            parseFloat(getComputedStyle(dealTrack).columnGap)),
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
      }),
    ),
  );
  dealTrack.addEventListener('scroll', updateDealButtons, { passive: true });
  new ResizeObserver(updateDealButtons).observe(dealTrack);
  updateDealButtons();
}
