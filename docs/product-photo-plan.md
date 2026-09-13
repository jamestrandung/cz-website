# Product photo integration

Completed 2026-09-13. Source: `/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG`.

## Included content

Imported only the explicitly named current menu products in `scripts/product-photos.json`, following the user’s instruction to ignore discontinued products. Camera-number files, the supplementary subfolder, Bạc xỉu muối Huế and Matcha muối Huế are excluded. Originals remain untouched.

**26 of 48 products have photographs, using 28 source files.** Matcha latte and Cacao sữa each have an extra hot view. The other 22 products use drink, food, or topping category icons, with “Ảnh đang cập nhật” / “Photo coming soon” in a compact detail panel.

Reviewed the 28 selected photos together against the mapped names. The original warm/dark backgrounds and full compositions are preserved; near-square sources receive minimal padding. Hero images are framed photos. Photo choice controls only change the picture, not the displayed prices or order options.

## Local pipeline

`npm run photos:prepare -- "/path/to/CAZONE-JPG"` reads an explicit source allowlist, resolves Unicode filenames, checks product and variant references, and writes content-hashed WebP files and `src/data/photo-assets.json`. No source-folder scan automatically assigns images. No Cloudflare dependency or external image service.

Include generated images and their manifest with the project. Normal builds do not access the Downloads folder. New photos require a mapping update and regeneration; the components already handle photo/placeholder display. Asset paths are verified during builds.

Catalog and search request 240/480-pixel responsive thumbnails and lazy-load rows. The hero uses the same responsive sizes. Details request 800/1200-pixel images on opening; hot photos load when selected. The image files contain no source EXIF metadata.

## Measured sizes

Selected originals: 88.1 MiB. All 112 generated files: 3.64 MiB. These are stored totals, not initial-page download sizes.

| Width | Per image | Total for 28 images |
| --- | --- | --- |
| 240px | 4.5–8.1 KiB | 167.8 KiB |
| 480px | 13.0–23.7 KiB | 473.2 KiB |
| 800px | 27.9–53.2 KiB | 1047.8 KiB |
| 1200px | 54.2–107.1 KiB | 2037.8 KiB |

Detailed machine-readable sizes: `photo-size-report.json`.

## Source mapping

| Menu item | Source photo(s) |
| --- | --- |
| Bạc xỉu | bạc xỉu.jpg |
| Phin cam | phin cam.jpg |
| Phin sữa | phin sữa đá.jpg |
| Phin đen | phin đen đá.jpg |
| Phin cano | phin cano.jpg |
| Cacao muối Huế | cacao muối huế.jpg |
| Cà phê muối Huế | cà phê muối huế.jpg |
| Trà bưởi Aiyu | Trà bưởi aiyu.jpg |
| Trà chanh dây tắc xí muội | Trà chanh dây tăc xí muội.jpg |
| Thanh trà mật ong hạt đác | Thanh trà hạt đác.jpg |
| Trà sữa milkfoam hạnh nhân nướng | Trà sữa milkfoam hạnh nhân nướng.jpg |
| Trà sữa ô long | trà sữa ô long.jpg |
| Trà nhài macchiato | Trà lài macchiato.jpg |
| Matcha latte | matcha latte.jpg; matcha latte nóng.jpg |
| Cacao sữa | cacao sữa đá.jpg; Cacao sữa nóng.jpg |
| Bình trà dưỡng nhan | Bình trà dưỡng nhan.jpg |
| Cam ép | Cam ép.jpg |
| Đá me đậu phộng | Đá me.jpg |
| Xúc xích Đức & khoai | Xúc xích khoai chiên.jpg |
| Sừng trâu chà bông | Sừng trâu chà bông.jpg |
| Sừng trâu hạnh nhân | Sừng trâu hạnh nhân.jpg |
| Sừng trâu chấm sữa | Sừng trâu chấm sữa.jpg |
| Mì ly | Mì ly.jpg |
| Khoai tây chiên không dầu | Khoai tây chiên.jpg |
| Croffle caramel | Croffle caramel.jpg |
| Khô gà lá chanh | Khô gà lá chanh.jpg |

## Still without photos

- Cà phê Oreo
- Matcha khoai môn
- Dừa mây khoai môn
- Trà đào sả
- Trà thanh vải
- Trà sữa khoai môn
- Trà sữa nhài
- Matcha Oreo
- Matcha coco kem mây
- Cacao Oreo
- Matcha coco
- Trà xoài
- Trà chanh Atiso
- Tiramisu
- Bánh phô mai chanh dây
- Trân châu đen
- Sương sáo
- Nha đam
- Hạt đác
- Trân châu trắng
- Thạch Aiyu
- Thạch dừa
