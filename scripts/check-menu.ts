import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('../', import.meta.url)));
try {
  const { loadMenu } = await import('../src/content/loadMenu');
  const { discovery } = await import('../src/data/menu');
  const menu = loadMenu();
  const { campaigns } = await import('../src/data/combos');
  console.log(
    `Combos OK: ${campaigns.length} campaigns; product references and variant pricing validated.`,
  );
  const fail = (message: string) => {
    throw new Error(message);
  };
  for (const entry of [...menu.categories, ...menu.products]) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id))
      fail(`Use a lowercase hyphenated ID: ${entry.id}`);
  }
  if (!menu.categories.some((c) => c.id === discovery.targetCategory))
    fail('Discovery targetCategory does not exist.');
  if (
    discovery.featuredProductIds.length > 2 ||
    new Set(discovery.featuredProductIds).size !== discovery.featuredProductIds.length
  )
    fail('Discovery supports at most two distinct featured product IDs.');
  for (const id of discovery.featuredProductIds)
    if (!menu.products.some((p) => p.id === id)) fail(`Unknown Discovery product: ${id}`);
  const mapping = JSON.parse(readFileSync(resolve('scripts/product-photos.json'), 'utf8'));
  for (const [id, photos] of Object.entries(mapping) as [string, { variantIds?: string[] }[]][]) {
    const product = menu.products.find((p) => p.id === id);
    if (!product) fail(`Remove stale photo mapping: ${id}`);
    if (!Array.isArray(photos) || !photos.length)
      fail(`Photo mapping for ${id} must be a nonempty array.`);
    if (photos.length !== product!.photos.length)
      fail(`Photo mapping changed for ${id}; run photos:prepare --only ${id}.`);
    for (const photo of photos) {
      if (photo.variantIds?.some((v) => !product!.variants.some((pv) => pv.id === v)))
        fail(`Unknown photo variant for ${id}.`);
    }
  }
  for (const p of menu.products) {
    if (p.photos.length && !mapping[p.id])
      fail(`Remove generated photos for ${p.id} with photos:prepare -- --remove ${p.id}.`);
  }
  console.log(
    `Menu OK: ${menu.categories.length} categories, ${menu.products.length} products, ${menu.products.filter((p) => p.photos.length).length} with photos. Discovery and local image paths are valid.`,
  );
  console.log(
    'Review changed content and photos in both languages on localhost. No fixed product-count or price baseline was used.',
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
