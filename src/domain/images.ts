import type { Product } from './menu';

export function thumbnailSet(p: Product) {
  const photo = p.photos[0];
  return photo ? `${photo.sources[240]} 240w, ${photo.sources[480]} 480w` : undefined;
}
export function detailSet(photo: Product['photos'][number]) {
  return `${photo.sources[800]} 800w, ${photo.sources[1200]} 1200w`;
}
