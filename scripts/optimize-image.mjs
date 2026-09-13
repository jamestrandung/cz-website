import path from 'node:path';
import { parseArgs } from 'node:util';
import { inspectImage, encodeImage, writeImages, writeJson, safeName } from './image-tools.mjs';

const help = `Optimize one photo without changing the menu or the original.

npm run photos:optimize -- --input "/path/photo.jpg" --output "tmp/optimized" --name "my-drink"

Required: --input FILE  --output DIRECTORY  --name LOWERCASE-ID
Optional: --dry-run (inspect only; write nothing), --help
Outputs: 240/480/800/1200px square WebP files and NAME.json in the output folder.
Use photos:prepare to integrate a photo into the menu. See docs/image-workflow.md.`;
try {
  const { values } = parseArgs({
    options: {
      input: { type: 'string' },
      output: { type: 'string' },
      name: { type: 'string' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean' },
    },
  });
  if (values.help) {
    console.log(help);
  } else {
    if (!values.input || !values.output || !values.name) throw new Error(help);
    safeName(values.name);
    const { original, info } = await inspectImage(values.input);
    console.log(
      `Source: ${info.width}×${info.height}, ${original.length} bytes. Original remains untouched.`,
    );
    if (Math.min(info.width, info.height) < 1200)
      console.warn('Small source: larger outputs may upscale. This does not add real detail.');
    if (!values['dry-run']) {
      const images = await encodeImage(original, values.name);
      await writeImages(values.output, images);
      await writeJson(
        path.join(values.output, `${values.name}.json`),
        images.map(({ buffer, ...item }) => item),
      );
      console.table(images.map(({ buffer, ...item }) => item));
    } else console.log('Dry run: no files written.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
