# Reusable image workflow

Two local scripts are available. Neither changes your source image, uploads it, or needs Cloudflare.

| Task | Command |
| --- | --- |
| Produce optimized copies of one image for inspection or reuse elsewhere | `npm run photos:optimize` |
| Add/replace photos on this menu, including product mapping and generated URLs | `npm run photos:prepare` |

**Use `photos:prepare` for normal menu updates.** The standalone optimizer does not update the website automatically.

## Setup

Open Terminal in the website folder. On a new machine install Node.js 22.12+ and run `npm install` once; Sharp is a pinned project dependency. No Python or global image tool is needed.

```sh
cd '/Users/james.tran/Desktop/agents/gpt/cazone/website'
npm run photos:prepare -- --help
npm run photos:optimize -- --help
```

Keep quotes around paths containing spaces. The `--` after the npm command passes subsequent arguments to the script. Run only one image-processing command at a time.

## Add or replace one dish's photos

This workflow works without having the entire original photo library available.

1. Make sure the dish already exists in `src/data/products.json`. Find its stable `id`, for example `bac-xiu`.
2. Put your source JPG, PNG or WebP in a folder you can access. The current originals are in:

   ```text
   /Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG
   ```

3. Open `scripts/product-photos.json`. Add a top-level key or replace the existing entry for that ID. This is an example entry inside the existing JSON object:

   ```json
   "bac-xiu": [
     { "source": "bạc xỉu.jpg" }
   ]
   ```

   Do not duplicate the key. Include a comma between this entry and the next/previous entry as required. `source` is relative to the folder passed to the command. You can use a subfolder, e.g. `"new-shoot/bac-xiu.jpg"`. Case and accents must match; the script handles macOS composed/decomposed Unicode equivalents. Do not use an absolute filename or `..` in the mapping.

4. Validate that dish and source without writing anything:

   ```sh
   npm run photos:prepare -- '/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG' --only bac-xiu --dry-run
   ```

5. Generate and integrate it:

   ```sh
   npm run photos:prepare -- '/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG' --only bac-xiu
   npm run menu:check
   npm run build
   ```

6. Review the catalog, search result and product details in the local browser. Check that the correct drink/food is shown and that the whole product and cup label remain readable.

For a new photo in a different folder, change the source filename in the mapping and pass that folder instead. Only the selected dish's mapped source files are required. `--only` replaces **all photo views for that dish**, not just one image in its array; other dishes' generated photos stay intact.

To update several dishes in one run, use a comma-separated list:

```sh
npm run photos:prepare -- '/path/to/source-folder' --only bac-xiu,phin-cam
```

If you replace the file while retaining its filename, run the same command again. New content gets new hashed URLs, so the website can pick up the change without relying on an old browser cache. A renamed dish also needs a run to refresh the generated alternative text.

## Multiple photos, including hot and iced

The **first entry** is the catalog/search/Discovery photo and the initial detail view. Additional photos are available through buttons in details. Add a label in **both languages to every entry** when there is more than one photo:

```json
"matcha-latte": [
  {
    "source": "matcha latte.jpg",
    "variantIds": ["cold"],
    "label": { "vi": "Đá", "en": "Iced" }
  },
  {
    "source": "matcha latte nóng.jpg",
    "variantIds": ["hot"],
    "label": { "vi": "Nóng", "en": "Hot" }
  }
]
```

`variantIds` is optional, but if present must match this dish's actual variant IDs. For Bạc xỉu, for example, iced variant IDs are `s-cold` and `m-cold`, not `cold`. You may omit `variantIds` for a general product photo. It records an association; the viewing buttons do not select a variant for an order or change prices.

To remove just a hot view, remove that entry from the array and run `--only` for the dish. To change the primary image, move the desired entry to the first position and run `--only`.

## Remove photos or revert to a placeholder

1. Delete that dish's complete key from `scripts/product-photos.json`.
2. Run:

   ```sh
   npm run photos:prepare -- --remove bac-xiu
   npm run menu:check
   ```

No source folder is needed. This removes the generated photo references for that dish and prunes unreferenced generated files. Other dishes' photos and all originals remain untouched. If the dish still exists, it immediately uses its category placeholder. If you are deleting the dish too, follow [the dish-removal checklist](maintaining-menu.md#remove-a-dish-permanently).

You can remove several sets with `--remove bac-xiu,phin-cam`. You must remove their mapping keys first, otherwise the script stops. Do not combine `--only` and `--remove`.

## Rebuild the entire mapped library

Use this when you have **all** mapped sources in one folder tree:

```sh
npm run photos:prepare -- '/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG' --dry-run
npm run photos:prepare -- '/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG'
```

A full run rebuilds the manifest from the current mapping and removes old generated assets that are no longer referenced. It requires every listed source. Unlisted files are ignored; there is no automatic matching of camera-number files or discontinued dishes. Never add discontinued files to the mapping just to process everything in a folder.

## Optimize one image independently

Use this for producing copies without changing menu records or images:

```sh
npm run photos:optimize -- \
  --input '/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG/bạc xỉu.jpg' \
  --output 'tmp/optimized-bac-xiu' \
  --name 'bac-xiu' \
  --dry-run
```

Remove `--dry-run` to generate files:

```sh
npm run photos:optimize -- \
  --input '/Users/james.tran/Downloads/Ca Zone/Pictures/Food/CAZONE-JPG/bạc xỉu.jpg' \
  --output 'tmp/optimized-bac-xiu' \
  --name 'bac-xiu'
```

Unlike mapped source names, `--input` is a literal filesystem path. If a filename looks correct but isn't found, drag the source file from Finder into Terminal to use its exact path, or use `photos:prepare`, which resolves Unicode filename equivalents.

The output directory is created if needed. `--name` must use lowercase letters/numbers and single hyphens. The result contains four files such as `bac-xiu-240-<hash>.webp` and `bac-xiu.json`, listing each file's width, height and byte size. The script prints a size table. Reusing the name replaces its JSON manifest; earlier image files with different hashes remain in this standalone output folder. It does not prune your other files.

These standalone outputs are **not automatically included in the website**. To integrate the photo, use the mapping and `photos:prepare` workflow above. The `tmp/` folder is for local output and is ignored by version control.

## Output quality and file behavior

| Size | Website use |
| --- | --- |
| 240 × 240 | Small catalog/search thumbnails |
| 480 × 480 | Higher-density thumbnails and featured cards |
| 800 × 800 | Product detail image |
| 1200 × 1200 | Higher-density detail image |

Both commands use WebP quality 80, preserve the complete composition with charcoal padding for non-square photos, honor image orientation, and strip source metadata. They do not cut out backgrounds or alter the product. For a different crop, supply an already-cropped source copy and retain your original separately.

Use sharp originals with at least 1200 pixels on the shorter edge when possible. Small images are accepted with a warning; fixed-size outputs can upscale them, which does **not** recover detail. This keeps actual output dimensions consistent with the website's responsive-image declarations. Animated/multipage files and formats other than JPG/PNG/WebP are rejected. A corrupt source stops processing before the working menu manifest is replaced.

Output byte sizes depend on image detail; there is no fixed byte-size guarantee. Inspect the latest run diagnostics in `tmp/reports/photo-size-report.json`. Larger detail files load only after opening a product, and extra views load when selected.

For menu integration, these files change together:

- `scripts/product-photos.json`: your editable source mapping.
- `public/images/products/`: generated WebP files; originals are never copied here.
- `src/data/photo-assets.json`: generated product-to-image data, alternative text and variants. Do not hand-edit it.
- `tmp/reports/photo-size-report.json`: sizes for the **most recent run**, with `scope` of `all`, `selected`, or `remove`. A selective run's totals are not the whole library's totals.

Normal builds need only generated images and the generated manifest, not the Downloads folder or an image service. Back up/share those outputs together. Keep the source library and mapping if you need to regenerate later. Do not edit `dist/` directly; it is regenerated by `npm run build`.

## Troubleshooting

| Message/symptom | Action |
| --- | --- |
| `Expected one source file` | Check folder, exact relative filename, extension, case and subfolder; for a full run check every mapping |
| `Missing product or nonempty photo mapping` | Create the dish first; match its ID exactly; provide at least one source entry |
| `Unknown photo variant` | Correct `variantIds` to actual IDs in that dish's `variants` |
| `Add a vi/en label` | Label every entry in a multiple-photo array |
| `Remove ID ... first` | Delete its mapping key before running `--remove` |
| `Use lowercase letters...` | Correct the product ID/output name; display names and source filenames may contain Vietnamese |
| `Small source` | Use a larger original if available; otherwise inspect the larger output for softness |
| Photo still looks unchanged | Regenerate it, reload the local browser, check mapping order and that you edited the right source |
| Processing failed | Read the terminal error, correct the source/mapping and rerun; encoding finishes before the menu manifest changes |

`npm run menu:check` checks references and local files, but cannot prove that an existing same-length mapping was regenerated after a filename/content change. Always run the image script after changing a mapping/source and visually inspect the result.

Script regression checks: `npm run test:images`. These use temporary fixtures, including selective updates, missing inputs, Unicode filenames, low-resolution sources and removal, and do not edit your live photos.
