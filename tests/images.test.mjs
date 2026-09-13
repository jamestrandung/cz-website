import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { preparePhotos } from '../scripts/prepare-photos.mjs';

test('full, selective, dry-run, invalid-input and removal workflows preserve unrelated photos and originals', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cazone-image-test-'));
  try {
    for (const dir of ['scripts', 'src/data', 'source'])
      await fs.mkdir(path.join(root, dir), { recursive: true });
    const write = (file, value) => fs.writeFile(path.join(root, file), JSON.stringify(value));
    const menu = {
      products: ['one', 'two'].map((id) => ({
        id,
        name: { vi: id, en: id },
        variants: [{ id: 'cold' }],
      })),
    };
    const mapping = { one: [{ source: 'cà.jpg' }], two: [{ source: 'two.png' }] };
    await write('src/data/products.json', menu);
    await write('scripts/product-photos.json', mapping);
    const original = await sharp({
      create: { width: 100, height: 200, channels: 3, background: 'red' },
    })
      .jpeg()
      .toBuffer();
    await fs.writeFile(path.join(root, 'source', 'cà.jpg'.normalize('NFD')), original);
    await sharp(original).png().toFile(path.join(root, 'source/two.png'));
    const args = { projectRoot: root, sourceRoot: path.join(root, 'source') };
    await preparePhotos({ ...args, dryRun: true });
    await assert.rejects(fs.access(path.join(root, 'src/data/photo-assets.json')));
    await preparePhotos(args);
    const read = async () =>
      JSON.parse(await fs.readFile(path.join(root, 'src/data/photo-assets.json'), 'utf8'));
    const before = await read();
    for (const photo of Object.values(before).flat())
      for (const [width, src] of Object.entries(photo.sources)) {
        const metadata = await sharp(path.join(root, 'public', src)).metadata();
        assert.equal(metadata.width, Number(width));
        assert.equal(metadata.height, Number(width));
        assert.equal(metadata.exif, undefined);
      }
    // Updating one product needs only that product's source and preserves the other product.
    await fs.unlink(path.join(root, 'source/two.png'));
    await sharp({ create: { width: 140, height: 140, channels: 3, background: 'blue' } })
      .jpeg()
      .toFile(path.join(root, 'source/new.jpg'));
    mapping.one[0].source = 'new.jpg';
    await write('scripts/product-photos.json', mapping);
    await preparePhotos({ ...args, only: 'one' });
    const after = await read();
    assert.deepEqual(after.two, before.two);
    assert.notDeepEqual(after.one, before.one);
    await assert.rejects(fs.access(path.join(root, 'public', before.one[0].sources[240])));
    assert.deepEqual(
      await fs.readFile(path.join(root, 'source', 'cà.jpg'.normalize('NFD'))),
      original,
    );
    const manifest = await fs.readFile(path.join(root, 'src/data/photo-assets.json'), 'utf8');
    mapping.one[0].source = 'missing.jpg';
    await write('scripts/product-photos.json', mapping);
    await assert.rejects(preparePhotos({ ...args, only: 'one' }), /Expected one source/);
    assert.equal(
      await fs.readFile(path.join(root, 'src/data/photo-assets.json'), 'utf8'),
      manifest,
    );
    await assert.rejects(preparePhotos({ ...args, remove: 'one' }), /Remove one/);
    delete mapping.one;
    await write('scripts/product-photos.json', mapping);
    await preparePhotos({ projectRoot: root, remove: 'one' });
    assert.deepEqual(await read(), { two: before.two });
    await assert.rejects(fs.access(path.join(root, 'public', after.one[0].sources[240])));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('standalone optimizer documents its CLI and writes four sizes plus a reusable manifest', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cazone-standalone-test-'));
  try {
    const source = path.join(root, 'source.png');
    await sharp({ create: { width: 160, height: 100, channels: 3, background: 'green' } })
      .png()
      .toFile(source);
    const command = path.resolve('scripts/optimize-image.mjs');
    assert.match(
      execFileSync(process.execPath, [command, '--help'], { encoding: 'utf8' }),
      /photos:optimize/,
    );
    const args = [
      command,
      '--input',
      source,
      '--output',
      path.join(root, 'out'),
      '--name',
      'example',
    ];
    execFileSync(process.execPath, [...args, '--dry-run'], { stdio: 'pipe' });
    await assert.rejects(fs.access(path.join(root, 'out')));
    execFileSync(process.execPath, args, { stdio: 'pipe' });
    const manifest = JSON.parse(await fs.readFile(path.join(root, 'out/example.json'), 'utf8'));
    assert.deepEqual(
      manifest.map((i) => i.width),
      [240, 480, 800, 1200],
    );
    for (const item of manifest)
      assert.equal((await fs.stat(path.join(root, 'out', item.filename))).size, item.bytes);
    assert.throws(() => execFileSync(process.execPath, [...args, '--unknown'], { stdio: 'pipe' }));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
