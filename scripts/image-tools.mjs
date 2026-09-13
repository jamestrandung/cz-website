import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

export const widths = [240, 480, 800, 1200];
export function safeName(value) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
    throw new Error(`Use lowercase letters, numbers and single hyphens for IDs/names: ${value}`);
  return value;
}
export async function inspectImage(filename) {
  const original = await fs.readFile(filename);
  const info = await sharp(original).metadata();
  if (!['jpeg', 'png', 'webp'].includes(info.format) || (info.pages ?? 1) !== 1)
    throw new Error(`Expected a single JPG, PNG or WebP image: ${filename}`);
  return { original, info };
}
export async function encodeImage(original, name) {
  safeName(name);
  const results = [];
  for (const width of widths) {
    // Fixed square canvases keep srcset width descriptors truthful, even for small originals.
    // Contain preserves the whole photo, with charcoal padding for non-square originals.
    const buffer = await sharp(original)
      .autoOrient()
      .resize(width, width, { fit: 'contain', background: '#1c1c23' })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 10);
    results.push({
      width,
      height: width,
      filename: `${name}-${width}-${hash}.webp`,
      bytes: buffer.length,
      buffer,
    });
  }
  return results;
}
export async function writeImages(outputDir, images) {
  await fs.mkdir(outputDir, { recursive: true });
  for (const image of images)
    await fs.writeFile(path.join(outputDir, image.filename), image.buffer);
}
export async function writeJson(filename, value) {
  const temporary = `${filename}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(value, null, 2) + '\n');
  await fs.rename(temporary, filename);
}
