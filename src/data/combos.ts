import { text as t } from '../domain/presentation';
import { validateCampaigns, type VariantPolicy, type Choice } from '../domain/combos';
import { menu } from './menu';
export const dealsSection = {
  enabled: true,
  eyebrow: t('THÊM MÓN NGON, THÊM NIỀM VUI', 'A LITTLE MORE TO ENJOY'),
  title: t('Combo đúng gu', 'Better together'),
  description: t(
    'Một món nước, thêm món ngon. Chọn combo dành cho bạn.',
    'Your favorite sip, with something delicious on the side.',
  ),
};
// Shared policies can also be overridden for an individual product choice.
const standard: VariantPolicy = { allowUnsized: true, upgrades: { M: 10000 }, variantPrices: {} };
const tea: VariantPolicy = { ...standard, includedSize: 'S' };
const coffee: VariantPolicy = {
  ...standard,
  includedSize: 'M',
  allowedSizes: ['M'],
  allowUnsized: false,
};
const sized: VariantPolicy = { ...tea, allowUnsized: false };
const choices = (ids: string[], policy = standard): Choice[] =>
  ids.map((productId) => ({ productId, policy }));
const tagged = (tag: string, policy = standard) =>
  menu.products
    .filter((p) => p.sourceCodes.includes(tag))
    .map((p) => ({ productId: p.id, policy: p.categoryId === 'coffee' ? coffee : policy }));
const food1 = ['croissant-floss', 'croissant-almond', 'croissant-milk', 'tiramisu', 'cheesecake'];
const food2 = ['potato-wedges', 'croffle', 'chicken-jerky', 'butter-floss-bread'];
const groups = (drinks: Choice[], foods: string[], quantity = 1) => [
  {
    id: 'drinks',
    label: t('món nước', quantity > 1 ? 'drinks' : 'drink'),
    quantity,
    choices: drinks,
  },
  {
    id: 'food',
    label: t(
      quantity > 1 ? 'phần ăn chung' : 'món ăn',
      quantity > 1 ? 'shared snack' : 'food item',
    ),
    quantity: 1,
    choices: choices(foods),
  },
];
const groupDrinks = menu.products
  .filter((p) => ['coffee', 'tea', 'milk-tea'].includes(p.categoryId))
  .map((p) => ({ productId: p.id, policy: p.categoryId === 'coffee' ? coffee : sized }));
const breakfastDrinks = menu.products
  .filter(
    (p) =>
      ['coffee', 'signature', 'tea', 'milk-tea', 'matcha', 'healthy'].includes(p.categoryId) &&
      p.variants.some((v) => v.attributes.size),
  )
  .map((p) => ({ productId: p.id, policy: p.categoryId === 'coffee' ? coffee : sized }));
export const campaigns = validateCampaigns(menu, [
  {
    id: 'sang-tao',
    active: true,
    title: t('Bật sáng tạo', 'Spark your creativity'),
    description: t(
      'Cà phê, matcha & một món ngon tiếp năng lượng.',
      'Coffee, matcha & a delicious little boost.',
    ),
    theme: 'yellow',
    imageProductIds: ['matcha-latte', 'potato-wedges'],
    note: t(
      'Giá đã gồm món nước và món ăn bên dưới. Cà phê dùng size M; các món còn lại dùng phần tiêu chuẩn.',
      'Includes a drink and food from the lists below. Coffee is size M; other drinks use their standard serving.',
    ),
    offers: [
      {
        id: 'st1',
        label: t('ST1 · Cà phê & cacao', 'ST1 · Coffee & cacao'),
        price: 90000,
        groups: groups(tagged('ST1'), food1),
      },
      {
        id: 'st2',
        label: t('ST2 · Matcha & món tủ', 'ST2 · Matcha & signatures'),
        price: 95000,
        groups: groups(tagged('ST2'), food2),
      },
    ],
  },
  {
    id: 'thu-gian',
    active: true,
    title: t('Một chút thư giãn', 'Take a little break'),
    description: t(
      'Trà thơm, bánh ngon. Dành một chút thời gian cho mình.',
      'A lovely tea, a tasty bite. A moment just for you.',
    ),
    theme: 'peach',
    imageProductIds: ['tra-sua-hanh-nhan', 'croissant-milk'],
    note: t(
      'Giá cơ bản áp dụng size S. Size M thêm 10.000đ mỗi ly, kể cả món chỉ có size M.',
      'Base price includes size S. Size M adds 10,000đ per drink, including drinks only sold in M.',
    ),
    offers: [
      {
        id: 'tg1',
        label: t('TG1 · Trà sữa & bánh', 'TG1 · Milk tea & cake'),
        price: 90000,
        groups: groups(tagged('TG1', tea), food1),
      },
      {
        id: 'tg2',
        label: t('TG2 · Trà trái cây & ăn vặt', 'TG2 · Fruit tea & snacks'),
        price: 85000,
        groups: groups(tagged('TG2', tea), food2),
      },
    ],
  },
  {
    id: 'ca-dong',
    active: true,
    title: t('[Cà] đông [cà] phê', 'Better with company'),
    description: t(
      'Rủ bạn tới Cà. Mỗi người một ly, cùng chia món ngon.',
      'Bring your people. A drink each, a snack to share.',
    ),
    theme: 'sage',
    imageProductIds: ['phin-sua', 'potato-wedges'],
    note: t(
      'Mỗi người một trà size S hoặc cà phê size M, cùng một phần ăn chung. Nâng trà lên M thêm 10.000đ mỗi ly.',
      'One size S tea or size M coffee per person, plus one shared snack. Upgrade tea to M for 10,000đ per drink.',
    ),
    offers: [2, 3, 4].map((n, i) => ({
      id: `group-${n}`,
      label: t(`${n} người`, `${n} people`),
      price: [140000, 190000, 240000][i],
      groups: groups(groupDrinks, ['potato-wedges', 'chicken-jerky'], n),
    })),
  },
  {
    id: 'op-la',
    active: true,
    title: t('Ốp la & món nước', 'Eggs & your favorite sip'),
    description: t(
      'Bữa ngon cả ngày, bắt đầu từ ốp la bơ tỏi.',
      'Garlic bread and eggs. A good meal, any time.',
    ),
    theme: 'ink',
    imageProductIds: ['garlic-eggs', 'phin-sua'],
    note: t(
      'Ốp la bơ tỏi cùng một món nước size S hoặc cà phê size M. Nâng nước từ S lên M thêm 10.000đ. Xúc xích tính riêng.',
      'Garlic-bread eggs with one size S drink or size M coffee. Upgrade S to M for 10,000đ. Sausage is extra.',
    ),
    offers: [
      {
        id: 'eggs-drink',
        label: t('Ốp la + món nước', 'Eggs + drink'),
        price: 90000,
        groups: groups(breakfastDrinks, ['garlic-eggs']),
        extras: [
          { label: t('Xúc xích', 'Sausage'), price: 10000 },
          { label: t('Tiramisu', 'Tiramisu'), productId: 'tiramisu', price: 40000 },
          {
            label: t('Bánh phô mai chanh dây', 'Passion fruit cheesecake'),
            productId: 'cheesecake',
            price: 40000,
          },
          {
            label: t('Khô gà lá chanh', 'Chicken jerky'),
            productId: 'chicken-jerky',
            price: 30000,
          },
        ],
      },
    ],
  },
]);
