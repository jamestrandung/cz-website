# Current pricing and eligibility reference

Generated on 2026-09-13 (Asia/Ho_Chi_Minh) from the local working-tree data.

This generated live reference is maintained with the catalog and combo configuration. Regenerate after every relevant content change; do not edit these tables by hand. Deployment status is separate:

```sh
node --import tsx scripts/export-pricing-reference.ts
```

See [Pricing rules](PRICING_RULES.md) for business meaning and confirmed exceptions, [Architecture](ARCHITECTURE.md) for implementation limits, and [Combo maintenance](combos-guide.md) for editing instructions.

Snapshot: **9 categories, 50 products, 68 variants, 4 campaigns, 8 offers.** All amounts below are VND. Unavailable variants are retained; availability never silently changes an included-size baseline.

## Standalone product prices

Rows follow category/product editorial order. Variants remain in editorial order; the first is the catalog/search price. These prices exclude optional paid extras.

### Món tủ của Cà / Signatures

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| ca-phe-oreo | Cà phê Oreo | Oreo coffee | cold: Đá = 65.000đ | available | ST2 |
| matcha-taro | Matcha khoai môn | Taro matcha | cold: Đá = 65.000đ | available | ST2 |
| dua-may-taro | Dừa mây khoai môn | Coconut with taro cloud | cold: Đá = 60.000đ | available | ST2 |
| cacao-muoi | Cacao muối Huế | Huế salted cacao | cold: Đá = 60.000đ | available | ST1 |
| ca-phe-muoi | Cà phê muối Huế | Huế salted coffee | cold: Đá = 55.000đ | available | ST1 |

### Cà phê / Coffee

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| bac-xiu | Bạc xỉu | White coffee | s-cold: S · Đá = 55.000đ; m-cold: M · Đá = 60.000đ; hot: Nóng = 55.000đ | available | ST1 |
| phin-cam | Phin cam | Orange coffee | m-cold: M · Đá = 60.000đ | available | ST1 |
| phin-sua | Phin sữa | Brown coffee | m-cold: M · Đá = 55.000đ; hot: Nóng = 55.000đ | available | ST1 |
| phin-den | Phin đen | Black coffee | m-cold: M · Đá = 50.000đ; hot: Nóng = 50.000đ | available | ST1 |
| phin-cano | Phin cano | Viet Americano | m-cold: M · Đá = 45.000đ; hot: Nóng = 45.000đ | available | ST1 |

### Trà trái cây / Fruit tea

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| tra-buoi | Trà bưởi Aiyu | Pomelo Aiyu tea | s: Size S = 60.000đ; m: Size M = 70.000đ | available | TG2 |
| tra-chanh-day | Trà chanh dây tắc xí muội | Passion fruit, calamansi & plum tea | s: Size S = 55.000đ; m: Size M = 65.000đ | available | TG2 |
| tra-dao-sa | Trà đào sả | Peach lemongrass tea | s: Size S = 55.000đ; m: Size M = 65.000đ | available | TG2 |
| tra-thanh-vai | Trà thanh vải | Lychee tea | s: Size S = 55.000đ; m: Size M = 65.000đ | available | TG2 |
| thanh-tra-mat-ong | Thanh trà mật ong hạt đác | Honey & palm seed chrysanthemum tea | m: Size M = 65.000đ | available | TG2 |

### Trà sữa đậm vị / Milk tea

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| tra-sua-hanh-nhan | Trà sữa milkfoam hạnh nhân nướng | Almond milk foam oolong milk tea | s: Size S = 60.000đ; m: Size M = 70.000đ | available | TG1 |
| tra-sua-taro | Trà sữa khoai môn | Taro oolong milk tea | m: Size M = 65.000đ | available | TG1 |
| tra-sua-nhai | Trà sữa nhài | Jasmine milk tea | s: Size S = 55.000đ; m: Size M = 65.000đ | available | TG1 |
| tra-sua-olong | Trà sữa ô long | Oolong milk tea | s: Size S = 55.000đ; m: Size M = 65.000đ | available | TG1 |
| tra-nhai-macchiato | Trà nhài macchiato | Jasmine tea with milk foam | s: Size S = 50.000đ; m: Size M = 60.000đ | available | TG1 |

### Liều thuốc tâm hồn / Matcha & cacao

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| matcha-oreo | Matcha Oreo | Oreo matcha latte | cold: Đá = 70.000đ | available | ST2 |
| matcha-coco-cloud | Matcha coco kem mây | Matcha coconut cloud | cold: Đá = 65.000đ | available | ST2 |
| cacao-oreo | Cacao Oreo | Oreo cacao | cold: Đá = 65.000đ | available | ST2 |
| matcha-latte | Matcha latte | Matcha latte | cold: Đá = 60.000đ; hot: Nóng = 60.000đ | available | ST2 |
| matcha-coco | Matcha coco | Matcha coconut | cold: Đá = 60.000đ | available | ST2 |
| cacao-sua | Cacao sữa | Cacao with fresh milk | cold: Đá = 55.000đ; hot: Nóng = 55.000đ | available | ST1 |

### Sống khoẻ / Fruity & healthy

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| tra-xoai | Trà xoài | Mango tea | s: Size S = 60.000đ; m: Size M = 70.000đ | available | TG2 |
| tra-duong-nhan | Bình trà dưỡng nhan | Herbal chrysanthemum tea pot | m: Size M = 65.000đ | available | TG2 |
| tra-chanh-atiso | Trà chanh Atiso | Atiso lemon tea | s: Size S = 55.000đ; m: Size M = 65.000đ | available | TG2 |
| cam-ep | Cam ép | Orange juice | s: Size S = 55.000đ; m: Size M = 60.000đ | available | TG2 |
| da-me | Đá me đậu phộng | Iced tamarind & peanut | s: Size S = 55.000đ | available | TG1 |

### Chống đói / Something savory

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| sausage | Xúc xích Đức & khoai | German sausage & potato wedges | portion: Một phần = 60.000đ | available | — |
| croissant-floss | Sừng trâu chà bông | Chicken floss croissant | portion: Một phần = 45.000đ | available | — |
| croissant-almond | Sừng trâu hạnh nhân | Almond croissant | portion: Một phần = 45.000đ | available | — |
| croissant-milk | Sừng trâu chấm sữa | Croissant with sweet dipping sauce | portion: Một phần = 45.000đ | available | — |
| garlic-eggs | Ốp la bơ tỏi | Fried eggs & garlic bread | portion: Một phần = 45.000đ | available | — |
| cup-noodles | Mì ly | Cup noodles | portion: Một phần = 20.000đ | available | — |

### Chống buồn miệng / Snacks & treats

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| tiramisu | Tiramisu | Tiramisu | portion: Một phần = 45.000đ | available | — |
| cheesecake | Bánh phô mai chanh dây | Passion fruit cheesecake | portion: Một phần = 45.000đ | available | — |
| potato-wedges | Khoai tây chiên không dầu | Air-fried potato wedges | portion: Một phần = 40.000đ | available | — |
| croffle | Croffle caramel | Caramel croffle | portion: Một phần = 40.000đ | available | — |
| butter-floss-bread | Bánh mì bơ chà bông | Butter bread with chicken floss | portion: Một phần = 40.000đ | available | — |
| chicken-jerky | Khô gà lá chanh | Lime leaf chicken jerky | portion: Một phần = 35.000đ | available | — |

### Topping / Toppings

| Product ID | Product | English | Variant ID: label = price | Availability | Source tags |
| --- | --- | --- | --- | --- | --- |
| black-pearl | Trân châu đen | Black pearls | portion: Một phần = 10.000đ | available | — |
| grass-jelly | Sương sáo | Grass jelly | portion: Một phần = 10.000đ | available | — |
| aloe | Nha đam | Aloe vera cubes | portion: Một phần = 10.000đ | available | — |
| palm-seed | Hạt đác | Palm seeds | portion: Một phần = 15.000đ | available | — |
| white-pearl | Trân châu trắng | White pearls | portion: Một phần = 10.000đ | available | — |
| aiyu | Thạch Aiyu | Aiyu jelly | portion: Một phần = 10.000đ | available | — |
| coconut-jelly | Thạch dừa | Coconut jelly | portion: Một phần = 10.000đ | available | — |

## Product option groups

Choices are scoped to their option group. A choice ID that resembles a product ID is not an automatically synchronized foreign key to a standalone price. Missing limits are shown as unspecified, not unlimited.

### Trà bưởi Aiyu (tra-buoi)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| free-toppings | included | m | 0 / unspecified | black-pearl: Trân châu đen = 0 (free); max unspecified; grass-jelly: Sương sáo = 0 (free); max unspecified; aloe: Nha đam = 0 (free); max unspecified; palm-seed: Hạt đác = 0 (free); max unspecified; white-pearl: Trân châu trắng = 0 (free); max unspecified; aiyu: Thạch Aiyu = 0 (free); max unspecified; coconut-jelly: Thạch dừa = 0 (free); max unspecified |

### Trà đào sả (tra-dao-sa)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| free-toppings | included | m | 0 / unspecified | black-pearl: Trân châu đen = 0 (free); max unspecified; grass-jelly: Sương sáo = 0 (free); max unspecified; aloe: Nha đam = 0 (free); max unspecified; palm-seed: Hạt đác = 0 (free); max unspecified; white-pearl: Trân châu trắng = 0 (free); max unspecified; aiyu: Thạch Aiyu = 0 (free); max unspecified; coconut-jelly: Thạch dừa = 0 (free); max unspecified |

### Trà thanh vải (tra-thanh-vai)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| free-toppings | included | m | 0 / unspecified | black-pearl: Trân châu đen = 0 (free); max unspecified; grass-jelly: Sương sáo = 0 (free); max unspecified; aloe: Nha đam = 0 (free); max unspecified; palm-seed: Hạt đác = 0 (free); max unspecified; white-pearl: Trân châu trắng = 0 (free); max unspecified; aiyu: Thạch Aiyu = 0 (free); max unspecified; coconut-jelly: Thạch dừa = 0 (free); max unspecified |

### Trà sữa milkfoam hạnh nhân nướng (tra-sua-hanh-nhan)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| free-toppings | included | m | 0 / unspecified | black-pearl: Trân châu đen = 0 (free); max unspecified; grass-jelly: Sương sáo = 0 (free); max unspecified; aloe: Nha đam = 0 (free); max unspecified; palm-seed: Hạt đác = 0 (free); max unspecified; white-pearl: Trân châu trắng = 0 (free); max unspecified; aiyu: Thạch Aiyu = 0 (free); max unspecified; coconut-jelly: Thạch dừa = 0 (free); max unspecified |

### Trà sữa nhài (tra-sua-nhai)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| free-toppings | included | m | 0 / unspecified | black-pearl: Trân châu đen = 0 (free); max unspecified; grass-jelly: Sương sáo = 0 (free); max unspecified; aloe: Nha đam = 0 (free); max unspecified; palm-seed: Hạt đác = 0 (free); max unspecified; white-pearl: Trân châu trắng = 0 (free); max unspecified; aiyu: Thạch Aiyu = 0 (free); max unspecified; coconut-jelly: Thạch dừa = 0 (free); max unspecified |

### Trà sữa ô long (tra-sua-olong)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| free-toppings | included | m | 0 / unspecified | black-pearl: Trân châu đen = 0 (free); max unspecified; grass-jelly: Sương sáo = 0 (free); max unspecified; aloe: Nha đam = 0 (free); max unspecified; palm-seed: Hạt đác = 0 (free); max unspecified; white-pearl: Trân châu trắng = 0 (free); max unspecified; aiyu: Thạch Aiyu = 0 (free); max unspecified; coconut-jelly: Thạch dừa = 0 (free); max unspecified |

### Trà nhài macchiato (tra-nhai-macchiato)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| free-toppings | included | m | 0 / unspecified | black-pearl: Trân châu đen = 0 (free); max unspecified; grass-jelly: Sương sáo = 0 (free); max unspecified; aloe: Nha đam = 0 (free); max unspecified; palm-seed: Hạt đác = 0 (free); max unspecified; white-pearl: Trân châu trắng = 0 (free); max unspecified; aiyu: Thạch Aiyu = 0 (free); max unspecified; coconut-jelly: Thạch dừa = 0 (free); max unspecified |

### Matcha Oreo (matcha-oreo)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| milk | substitution | All | 0 / 1 | oat: Sữa yến mạch = 0 (free); max 1 |

### Cacao Oreo (cacao-oreo)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| milk | substitution | All | 0 / 1 | oat: Sữa yến mạch = 0 (free); max 1 |

### Matcha latte (matcha-latte)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| milk | substitution | All | 0 / 1 | oat: Sữa yến mạch = 0 (free); max 1 |

### Cacao sữa (cacao-sua)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| milk | substitution | All | 0 / 1 | oat: Sữa yến mạch = 0 (free); max 1 |

### Trà chanh Atiso (tra-chanh-atiso)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| free-toppings | included | m | 0 / unspecified | black-pearl: Trân châu đen = 0 (free); max unspecified; grass-jelly: Sương sáo = 0 (free); max unspecified; aloe: Nha đam = 0 (free); max unspecified; palm-seed: Hạt đác = 0 (free); max unspecified; white-pearl: Trân châu trắng = 0 (free); max unspecified; aiyu: Thạch Aiyu = 0 (free); max unspecified; coconut-jelly: Thạch dừa = 0 (free); max unspecified |

### Xúc xích Đức & khoai (sausage)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| extras | add-on | All | 0 / unspecified | sausage: Xúc xích · mỗi cây = +10.000đ; max unspecified |

### Ốp la bơ tỏi (garlic-eggs)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| extras | add-on | All | 0 / unspecified | sausage: Xúc xích · mỗi cây = +10.000đ; max unspecified |

### Mì ly (cup-noodles)

| Group | Kind | Applicable variant IDs | Min/max selections | Choice ID: label = adjustment; max quantity |
| --- | --- | --- | --- | --- |
| extras | add-on | All | 0 / unspecified | sausage: Xúc xích · mỗi cây = +10.000đ; max unspecified; chicken: Gà xé · mỗi phần = +10.000đ; max unspecified |

## Variant benefits

These original catalog benefits are inherited when a variant is eligible in a combo. An M surcharge alone does not create a benefit.

| Product ID | Variant ID | Benefit | Kind | Option group / eligible choices | Quantity |
| --- | --- | --- | --- | --- | --- |
| tra-buoi | m | Tặng kèm topping tuỳ chọn | included-choice | free-toppings / black-pearl, grass-jelly, aloe, palm-seed, white-pearl, aiyu, coconut-jelly | unspecified |
| tra-dao-sa | m | Tặng kèm topping tuỳ chọn | included-choice | free-toppings / black-pearl, grass-jelly, aloe, palm-seed, white-pearl, aiyu, coconut-jelly | unspecified |
| tra-thanh-vai | m | Tặng kèm topping tuỳ chọn | included-choice | free-toppings / black-pearl, grass-jelly, aloe, palm-seed, white-pearl, aiyu, coconut-jelly | unspecified |
| tra-sua-hanh-nhan | m | Tặng kèm topping tuỳ chọn | included-choice | free-toppings / black-pearl, grass-jelly, aloe, palm-seed, white-pearl, aiyu, coconut-jelly | unspecified |
| tra-sua-nhai | m | Tặng kèm topping tuỳ chọn | included-choice | free-toppings / black-pearl, grass-jelly, aloe, palm-seed, white-pearl, aiyu, coconut-jelly | unspecified |
| tra-sua-olong | m | Tặng kèm topping tuỳ chọn | included-choice | free-toppings / black-pearl, grass-jelly, aloe, palm-seed, white-pearl, aiyu, coconut-jelly | unspecified |
| tra-nhai-macchiato | m | Tặng kèm topping tuỳ chọn | included-choice | free-toppings / black-pearl, grass-jelly, aloe, palm-seed, white-pearl, aiyu, coconut-jelly | unspecified |
| matcha-oreo | cold | Đổi sữa yến mạch miễn phí | substitution | milk / oat | 1 |
| cacao-oreo | cold | Đổi sữa yến mạch miễn phí | substitution | milk / oat | 1 |
| matcha-latte | cold | Đổi sữa yến mạch miễn phí | substitution | milk / oat | 1 |
| matcha-latte | hot | Đổi sữa yến mạch miễn phí | substitution | milk / oat | 1 |
| cacao-sua | cold | Đổi sữa yến mạch miễn phí | substitution | milk / oat | 1 |
| cacao-sua | hot | Đổi sữa yến mạch miễn phí | substitution | milk / oat | 1 |
| tra-chanh-atiso | m | Tặng kèm topping tuỳ chọn | included-choice | free-toppings / black-pearl, grass-jelly, aloe, palm-seed, white-pearl, aiyu, coconut-jelly | unspecified |

## Campaigns and resolved offers

Each offer lists all included choices and their actual resolved variant surcharges. The base price is charged once per offer; optional extras are separate. Group quantity describes the bundle, not an enforced selection control in this reference UI.

### Bật sáng tạo (sang-tao)

Status: **active**. Theme: yellow. Card images: matcha-latte, potato-wedges.

Configured note: Giá đã gồm món nước và món ăn bên dưới. Cà phê dùng size M; các món còn lại dùng phần tiêu chuẩn.

#### ST1 · Cà phê & cacao (st1)

Base price: **90.000đ**.

Choose **1 món nước** (group ID: drinks).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| bac-xiu | Bạc xỉu | m-cold: M · Đá = Included | available |
| phin-cam | Phin cam | m-cold: M · Đá = Included | available |
| phin-sua | Phin sữa | m-cold: M · Đá = Included | available |
| phin-den | Phin đen | m-cold: M · Đá = Included | available |
| phin-cano | Phin cano | m-cold: M · Đá = Included | available |
| cacao-muoi | Cacao muối Huế | cold: Đá = Included | available |
| ca-phe-muoi | Cà phê muối Huế | cold: Đá = Included | available |
| cacao-sua | Cacao sữa | cold: Đá = Included; hot: Nóng = Included | available |

Choose **1 món ăn** (group ID: food).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| croissant-floss | Sừng trâu chà bông | portion: Một phần = Included | available |
| croissant-almond | Sừng trâu hạnh nhân | portion: Một phần = Included | available |
| croissant-milk | Sừng trâu chấm sữa | portion: Một phần = Included | available |
| tiramisu | Tiramisu | portion: Một phần = Included | available |
| cheesecake | Bánh phô mai chanh dây | portion: Một phần = Included | available |

#### ST2 · Matcha & món tủ (st2)

Base price: **95.000đ**.

Choose **1 món nước** (group ID: drinks).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| ca-phe-oreo | Cà phê Oreo | cold: Đá = Included | available |
| matcha-taro | Matcha khoai môn | cold: Đá = Included | available |
| dua-may-taro | Dừa mây khoai môn | cold: Đá = Included | available |
| matcha-oreo | Matcha Oreo | cold: Đá = Included | available |
| matcha-coco-cloud | Matcha coco kem mây | cold: Đá = Included | available |
| cacao-oreo | Cacao Oreo | cold: Đá = Included | available |
| matcha-latte | Matcha latte | cold: Đá = Included; hot: Nóng = Included | available |
| matcha-coco | Matcha coco | cold: Đá = Included | available |

Choose **1 món ăn** (group ID: food).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| potato-wedges | Khoai tây chiên không dầu | portion: Một phần = Included | available |
| croffle | Croffle caramel | portion: Một phần = Included | available |
| chicken-jerky | Khô gà lá chanh | portion: Một phần = Included | available |
| butter-floss-bread | Bánh mì bơ chà bông | portion: Một phần = Included | available |

### Một chút thư giãn (thu-gian)

Status: **active**. Theme: peach. Card images: tra-sua-hanh-nhan, croissant-milk.

Configured note: Giá cơ bản áp dụng size S. Size M thêm 10.000đ mỗi ly, kể cả món chỉ có size M.

#### TG1 · Trà sữa & bánh (tg1)

Base price: **90.000đ**.

Choose **1 món nước** (group ID: drinks).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| tra-sua-hanh-nhan | Trà sữa milkfoam hạnh nhân nướng | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-taro | Trà sữa khoai môn | m: Size M = +10.000đ | available |
| tra-sua-nhai | Trà sữa nhài | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-olong | Trà sữa ô long | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-nhai-macchiato | Trà nhài macchiato | s: Size S = Included; m: Size M = +10.000đ | available |
| da-me | Đá me đậu phộng | s: Size S = Included | available |

Choose **1 món ăn** (group ID: food).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| croissant-floss | Sừng trâu chà bông | portion: Một phần = Included | available |
| croissant-almond | Sừng trâu hạnh nhân | portion: Một phần = Included | available |
| croissant-milk | Sừng trâu chấm sữa | portion: Một phần = Included | available |
| tiramisu | Tiramisu | portion: Một phần = Included | available |
| cheesecake | Bánh phô mai chanh dây | portion: Một phần = Included | available |

#### TG2 · Trà trái cây & ăn vặt (tg2)

Base price: **85.000đ**.

Choose **1 món nước** (group ID: drinks).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| tra-buoi | Trà bưởi Aiyu | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-chanh-day | Trà chanh dây tắc xí muội | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-dao-sa | Trà đào sả | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-thanh-vai | Trà thanh vải | s: Size S = Included; m: Size M = +10.000đ | available |
| thanh-tra-mat-ong | Thanh trà mật ong hạt đác | m: Size M = +10.000đ | available |
| tra-xoai | Trà xoài | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-duong-nhan | Bình trà dưỡng nhan | m: Size M = +10.000đ | available |
| tra-chanh-atiso | Trà chanh Atiso | s: Size S = Included; m: Size M = +10.000đ | available |
| cam-ep | Cam ép | s: Size S = Included; m: Size M = +10.000đ | available |

Choose **1 món ăn** (group ID: food).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| potato-wedges | Khoai tây chiên không dầu | portion: Một phần = Included | available |
| croffle | Croffle caramel | portion: Một phần = Included | available |
| chicken-jerky | Khô gà lá chanh | portion: Một phần = Included | available |
| butter-floss-bread | Bánh mì bơ chà bông | portion: Một phần = Included | available |

### Cà đông cà phê (ca-dong)

Status: **active**. Theme: sage. Card images: phin-sua, potato-wedges.

Configured note: Mỗi người một trà size S hoặc cà phê size M, cùng một phần ăn chung. Nâng trà lên M thêm 10.000đ mỗi ly.

#### 2 người (group-2)

Base price: **140.000đ**.

Choose **2 món nước** (group ID: drinks).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| bac-xiu | Bạc xỉu | m-cold: M · Đá = Included | available |
| phin-cam | Phin cam | m-cold: M · Đá = Included | available |
| phin-sua | Phin sữa | m-cold: M · Đá = Included | available |
| phin-den | Phin đen | m-cold: M · Đá = Included | available |
| phin-cano | Phin cano | m-cold: M · Đá = Included | available |
| tra-buoi | Trà bưởi Aiyu | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-chanh-day | Trà chanh dây tắc xí muội | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-dao-sa | Trà đào sả | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-thanh-vai | Trà thanh vải | s: Size S = Included; m: Size M = +10.000đ | available |
| thanh-tra-mat-ong | Thanh trà mật ong hạt đác | m: Size M = +10.000đ | available |
| tra-sua-hanh-nhan | Trà sữa milkfoam hạnh nhân nướng | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-taro | Trà sữa khoai môn | m: Size M = +10.000đ | available |
| tra-sua-nhai | Trà sữa nhài | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-olong | Trà sữa ô long | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-nhai-macchiato | Trà nhài macchiato | s: Size S = Included; m: Size M = +10.000đ | available |

Choose **1 phần ăn chung** (group ID: food).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| potato-wedges | Khoai tây chiên không dầu | portion: Một phần = Included | available |
| chicken-jerky | Khô gà lá chanh | portion: Một phần = Included | available |

#### 3 người (group-3)

Base price: **190.000đ**.

Choose **3 món nước** (group ID: drinks).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| bac-xiu | Bạc xỉu | m-cold: M · Đá = Included | available |
| phin-cam | Phin cam | m-cold: M · Đá = Included | available |
| phin-sua | Phin sữa | m-cold: M · Đá = Included | available |
| phin-den | Phin đen | m-cold: M · Đá = Included | available |
| phin-cano | Phin cano | m-cold: M · Đá = Included | available |
| tra-buoi | Trà bưởi Aiyu | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-chanh-day | Trà chanh dây tắc xí muội | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-dao-sa | Trà đào sả | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-thanh-vai | Trà thanh vải | s: Size S = Included; m: Size M = +10.000đ | available |
| thanh-tra-mat-ong | Thanh trà mật ong hạt đác | m: Size M = +10.000đ | available |
| tra-sua-hanh-nhan | Trà sữa milkfoam hạnh nhân nướng | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-taro | Trà sữa khoai môn | m: Size M = +10.000đ | available |
| tra-sua-nhai | Trà sữa nhài | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-olong | Trà sữa ô long | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-nhai-macchiato | Trà nhài macchiato | s: Size S = Included; m: Size M = +10.000đ | available |

Choose **1 phần ăn chung** (group ID: food).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| potato-wedges | Khoai tây chiên không dầu | portion: Một phần = Included | available |
| chicken-jerky | Khô gà lá chanh | portion: Một phần = Included | available |

#### 4 người (group-4)

Base price: **240.000đ**.

Choose **4 món nước** (group ID: drinks).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| bac-xiu | Bạc xỉu | m-cold: M · Đá = Included | available |
| phin-cam | Phin cam | m-cold: M · Đá = Included | available |
| phin-sua | Phin sữa | m-cold: M · Đá = Included | available |
| phin-den | Phin đen | m-cold: M · Đá = Included | available |
| phin-cano | Phin cano | m-cold: M · Đá = Included | available |
| tra-buoi | Trà bưởi Aiyu | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-chanh-day | Trà chanh dây tắc xí muội | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-dao-sa | Trà đào sả | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-thanh-vai | Trà thanh vải | s: Size S = Included; m: Size M = +10.000đ | available |
| thanh-tra-mat-ong | Thanh trà mật ong hạt đác | m: Size M = +10.000đ | available |
| tra-sua-hanh-nhan | Trà sữa milkfoam hạnh nhân nướng | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-taro | Trà sữa khoai môn | m: Size M = +10.000đ | available |
| tra-sua-nhai | Trà sữa nhài | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-olong | Trà sữa ô long | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-nhai-macchiato | Trà nhài macchiato | s: Size S = Included; m: Size M = +10.000đ | available |

Choose **1 phần ăn chung** (group ID: food).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| potato-wedges | Khoai tây chiên không dầu | portion: Một phần = Included | available |
| chicken-jerky | Khô gà lá chanh | portion: Một phần = Included | available |

### Ốp la & món nước (op-la)

Status: **active**. Theme: ink. Card images: garlic-eggs, phin-sua.

Configured note: Ốp la bơ tỏi cùng một món nước size S hoặc cà phê size M. Nâng nước từ S lên M thêm 10.000đ. Xúc xích tính riêng.

#### Ốp la + món nước (eggs-drink)

Base price: **90.000đ**.

Choose **1 món nước** (group ID: drinks).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| bac-xiu | Bạc xỉu | m-cold: M · Đá = Included | available |
| phin-cam | Phin cam | m-cold: M · Đá = Included | available |
| phin-sua | Phin sữa | m-cold: M · Đá = Included | available |
| phin-den | Phin đen | m-cold: M · Đá = Included | available |
| phin-cano | Phin cano | m-cold: M · Đá = Included | available |
| tra-buoi | Trà bưởi Aiyu | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-chanh-day | Trà chanh dây tắc xí muội | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-dao-sa | Trà đào sả | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-thanh-vai | Trà thanh vải | s: Size S = Included; m: Size M = +10.000đ | available |
| thanh-tra-mat-ong | Thanh trà mật ong hạt đác | m: Size M = +10.000đ | available |
| tra-sua-hanh-nhan | Trà sữa milkfoam hạnh nhân nướng | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-taro | Trà sữa khoai môn | m: Size M = +10.000đ | available |
| tra-sua-nhai | Trà sữa nhài | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-sua-olong | Trà sữa ô long | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-nhai-macchiato | Trà nhài macchiato | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-xoai | Trà xoài | s: Size S = Included; m: Size M = +10.000đ | available |
| tra-duong-nhan | Bình trà dưỡng nhan | m: Size M = +10.000đ | available |
| tra-chanh-atiso | Trà chanh Atiso | s: Size S = Included; m: Size M = +10.000đ | available |
| cam-ep | Cam ép | s: Size S = Included; m: Size M = +10.000đ | available |
| da-me | Đá me đậu phộng | s: Size S = Included | available |

Choose **1 món ăn** (group ID: food).

| Product ID | Product | Eligible variant ID: label = surcharge | Availability |
| --- | --- | --- | --- |
| garlic-eggs | Ốp la bơ tỏi | portion: Một phần = Included | available |

Optional extras (not included-group membership):

| Extra | Referenced product | Price |
| --- | --- | --- |
| Xúc xích | No product reference | +10.000đ |
| Tiramisu | tiramisu | +40.000đ |
| Bánh phô mai chanh dây | cheesecake | +40.000đ |
| Khô gà lá chanh | chicken-jerky | +30.000đ |

## Snapshot boundaries

- Source: `src/data/products.json`, `src/data/menu.ts`, `src/data/combos.ts`, resolved by `src/domain/combos.ts`.
- No selected-order totals, tax/fees, stock synchronization, schedules, POS mappings, or promotion stacking rules are generated.
- Generating this reference validates imported schemas but does not replace `npm run menu:check`, which also checks image and mapping consistency.
- The human-maintained business rules distinguish owner confirmations from current configuration choices; do not infer unconfirmed policy from this table alone.
