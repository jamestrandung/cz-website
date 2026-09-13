import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { menu } from '../data/menu';

/** Build-time source boundary. A future Sheets import can return this same model. */
export function loadMenu() {
  for (const product of menu.products) {
    for (const image of [
      product.image,
      ...product.photos.flatMap((p) => Object.values(p.sources)),
    ]) {
      if (!existsSync(resolve(process.cwd(), 'public', image.slice(1)))) {
        throw new Error(`Missing menu image for ${product.id}: ${image}`);
      }
    }
  }
  return menu;
}
