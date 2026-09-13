import { menuSchema, text as t } from '../domain/menu';
import sourceMenu from './products.json';
import photoAssets from './photo-assets.json';
import type { Product } from '../domain/menu';

// Menu data and owner corrections: see docs/PRICING_RULES.md and docs/CURRENT_PRICING.md.
const photosByProduct: Record<string, Product['photos']> = photoAssets;
for (const id of Object.keys(photosByProduct)) {
  if (!sourceMenu.products.some((p) => p.id === id))
    throw new Error(`Unknown photo product: ${id}`);
}
export const menu = menuSchema.parse({
  ...sourceMenu,
  products: sourceMenu.products.map((p) => {
    const photos = photosByProduct[p.id] ?? [];
    const placeholder =
      p.categoryId === 'toppings'
        ? 'toppings'
        : ['food', 'sweet'].includes(p.categoryId)
          ? 'food'
          : 'drink';
    return {
      ...p,
      photos,
      image: photos[0]?.sources[240] ?? `/images/placeholders/${placeholder}.svg`,
      imageAlt: photos[0]?.alt ?? t('Ảnh đang cập nhật', 'Photo coming soon'),
    };
  }),
});

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

export const externalActions = [
  {
    id: 'grab',
    label: t('GrabFood', 'GrabFood'),
    detail: t('Giao món đến bạn', 'Delivered to you'),
    url: null as string | null,
  },
  {
    id: 'shopee',
    label: t('ShopeeFood', 'ShopeeFood'),
    detail: t('Đặt món quen thuộc', 'Order your favorites'),
    url: null as string | null,
  },
  {
    id: 'facebook',
    label: t('Nhắn cho Cà', 'Say hello'),
    detail: t('Liên hệ & đặt chỗ', 'Contact & reservations'),
    url: 'https://facebook.com/cazone.saigon',
  },
];

export const locations = [
  {
    id: 'nguyen-gia-tri',
    name: t('Nguyễn Gia Trí', 'Nguyễn Gia Trí'),
    url: 'https://maps.app.goo.gl/15eq7HsJnHKaW3Wk9',
  },
  {
    id: 'nguyen-thi-nho',
    name: t('Nguyễn Thị Nhỏ', 'Nguyễn Thị Nhỏ'),
    url: 'https://maps.app.goo.gl/Zmw1gFV8wdaEqN8XA',
  },
];
