import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { inspectImage, encodeImage, writeImages, writeJson, safeName } from './image-tools.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const help = `Generate menu photos from scripts/product-photos.json. Originals remain untouched.

npm run photos:prepare -- "/path/to/photos"                    # rebuild all mapped photos
npm run photos:prepare -- "/path/to/photos" --only bac-xiu     # update one dish only
npm run photos:prepare -- "/path/to/photos" --dry-run          # validate, write nothing
npm run photos:prepare -- --remove bac-xiu                    # after removing its mapping

--only and --remove accept comma-separated IDs. They cannot be combined.
Unlisted source files are ignored. Run one image command at a time.
See docs/image-workflow.md for add/replace/remove instructions.`;

export async function preparePhotos({
  projectRoot = root,
  sourceRoot,
  only,
  remove,
  dryRun = false,
}) {
  if (only && remove) throw new Error('Use either --only or --remove, not both.');
  const mapping = JSON.parse(
    await fs.readFile(path.join(projectRoot, 'scripts/product-photos.json'), 'utf8'),
  );
  const menu = JSON.parse(
    await fs.readFile(path.join(projectRoot, 'src/data/products.json'), 'utf8'),
  );
  const manifestPath = path.join(projectRoot, 'src/data/photo-assets.json');
  let existing = {};
  try {
    existing = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const parseIds = (value) => value?.split(',').map((id) => safeName(id.trim()));
  const onlyIds = parseIds(only),
    removeIds = parseIds(remove);
  if (!sourceRoot && !removeIds)
    throw new Error('Provide a source folder. Use --help for examples.');
  const ids = removeIds ?? onlyIds ?? Object.keys(mapping);
  const assets = onlyIds || removeIds ? structuredClone(existing) : {};
  const selected = [];
  const filenames = removeIds ? [] : await fs.readdir(sourceRoot, { recursive: true });
  for (const id of ids) {
    safeName(id);
    if (removeIds) {
      if (mapping[id]) throw new Error(`Remove ${id} from scripts/product-photos.json first.`);
      delete assets[id];
      continue;
    }
    const product = menu.products.find((p) => p.id === id);
    const entries = mapping[id];
    if (!product || !Array.isArray(entries) || !entries.length)
      throw new Error(`Missing product or nonempty photo mapping: ${id}`);
    for (const [index, entry] of entries.entries()) {
      if (
        typeof entry.source !== 'string' ||
        path.isAbsolute(entry.source) ||
        entry.source.split(/[\\/]/).includes('..')
      )
        throw new Error(`Use a relative source filename: ${id}`);
      if (entries.length > 1 && !entry.label)
        throw new Error(`Add a vi/en label to every photo for ${id}.`);
      if (entry.label && (!entry.label.vi?.trim() || !entry.label.en?.trim()))
        throw new Error(`Missing photo translation: ${id}`);
      if (
        entry.variantIds &&
        (!Array.isArray(entry.variantIds) ||
          entry.variantIds.some((v) => !product.variants.some((pv) => pv.id === v)))
      )
        throw new Error(`Unknown photo variant: ${id}`);
      const matches = filenames.filter((f) => f.normalize('NFC') === entry.source.normalize('NFC'));
      if (matches.length !== 1) throw new Error(`Expected one source file: ${entry.source}`);
      const { original, info } = await inspectImage(path.join(sourceRoot, matches[0]));
      if (Math.min(info.width, info.height) < 1200)
        console.warn(`Small source for ${id}: larger outputs may upscale; no detail is added.`);
      selected.push({ product, entry, index, original });
    }
  }
  if (dryRun)
    return {
      dryRun: true,
      products: ids,
      photos: selected.length,
      action: removeIds ? 'remove' : 'generate',
    };
  // Encode everything before changing files. A bad source cannot replace a working manifest.
  const pending = [];
  const report = {
    scope: removeIds ? 'remove' : onlyIds ? 'selected' : 'all',
    products: ids.length,
    photos: selected.length,
    sourceBytes: 0,
    outputBytes: 0,
    widths: {},
  };
  for (const { product, entry, index, original } of selected) {
    const images = await encodeImage(original, `${product.id}-${index}`);
    pending.push(...images);
    if (index === 0) assets[product.id] = [];
    assets[product.id].push({
      sources: Object.fromEntries(
        images.map((img) => [img.width, `/images/products/${img.filename}`]),
      ),
      alt: Object.fromEntries(
        ['vi', 'en'].map((locale) => [
          locale,
          `${product.name[locale]}${entry.label ? ` · ${entry.label[locale]}` : ''}`,
        ]),
      ),
      ...(entry.label ? { label: entry.label } : {}),
      ...(entry.variantIds ? { variantIds: entry.variantIds } : {}),
      focalPoint: '50% 50%',
    });
    report.sourceBytes += original.length;
    for (const image of images) {
      report.outputBytes += image.bytes;
      (report.widths[image.width] ??= []).push(image.bytes);
    }
  }
  for (const [width, sizes] of Object.entries(report.widths))
    report.widths[width] = {
      minBytes: Math.min(...sizes),
      maxBytes: Math.max(...sizes),
      totalBytes: sizes.reduce((a, b) => a + b, 0),
    };
  const outputDir = path.join(projectRoot, 'public/images/products');
  await writeImages(outputDir, pending);
  await writeJson(manifestPath, assets);
  const live = new Set(
    Object.values(assets)
      .flat()
      .flatMap((p) => Object.values(p.sources).map((s) => path.basename(s))),
  );
  for (const filename of await fs.readdir(outputDir)) {
    if (/^[a-z0-9-]+-\d+-\d{3,4}-[a-f0-9]{10}\.webp$/.test(filename) && !live.has(filename))
      await fs.unlink(path.join(outputDir, filename));
  }
  await fs.mkdir(path.join(projectRoot, 'docs'), { recursive: true });
  await writeJson(path.join(projectRoot, 'docs/photo-size-report.json'), report);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values, positionals } = parseArgs({
      allowPositionals: true,
      options: {
        only: { type: 'string' },
        remove: { type: 'string' },
        'dry-run': { type: 'boolean' },
        help: { type: 'boolean' },
      },
    });
    if (values.help) console.log(help);
    else {
      if (positionals.length > 1) throw new Error('Provide one source folder only.');
      console.log(
        JSON.stringify(
          await preparePhotos({
            sourceRoot: positionals[0],
            only: values.only,
            remove: values.remove,
            dryRun: values['dry-run'],
          }),
          null,
          2,
        ),
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
