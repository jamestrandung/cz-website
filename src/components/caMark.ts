// Glyph outlines for the "cà" logo mark, page 21 of the brand Canva design
// (DAFHyyOt8ds, Acherus Militant Bold). Extracted exactly from the font subset
// embedded in Canva's PDF export (no tracing), one path per glyph, positioned
// inside the box as in the design. Shared source for both the Astro component
// (CaMark.astro) and plain-string HTML renderers (combo-view.ts), so the path
// data lives in exactly one place.
const CA_MARK_WIDTH = 707.8;
const CA_MARK_HEIGHT = 410.3;
export const CA_MARK_VIEWBOX = `0 0 ${CA_MARK_WIDTH} ${CA_MARK_HEIGHT}`;
const CA_MARK_ASPECT = CA_MARK_WIDTH / CA_MARK_HEIGHT;

const CA_MARK_PATHS = [
  'M141.2 229.8Q141.2 200.3 155.3 175.3Q169.4 150.3 193.8 134.5Q218.2 118.7 248.9 117.9L248.9 160.8Q232.1 161.6 218.4 171.1Q204.8 180.6 196.8 195.9Q188.8 211.3 188.8 229.8Q188.8 248.3 196.8 263.6Q204.8 279 218.4 288.2Q232.1 297.5 248.9 298.3L248.9 341.3Q217.8 340 193.4 324.6Q169 309.3 155.1 284.3Q141.2 259.2 141.2 229.8ZM313.3 281.9L328.9 298.8Q332.2 302.5 332.6 304.7Q333.1 306.8 330.1 309.7Q315.4 324 296.3 332.2Q277.1 340.4 256.1 341.3L256.1 298.3Q283.4 297.1 300.7 280.3Q303.6 277.3 306.1 277.3Q309.5 277.3 313.3 281.9ZM330.1 149.4Q333.1 152.4 332.6 154.5Q332.2 156.6 328.9 160.4L313.3 177.2Q309.5 181.8 306.1 181.8Q303.6 181.8 300.7 178.9Q291.4 169.6 279.2 165.4Q267 161.2 256.1 160.8L256.1 117.9Q299.4 119.1 330.1 149.4Z',
  'M508.9 327.8L508.9 214.2Q508.9 184.3 499 171.7Q489.1 159.1 460.1 159.1Q442 159.1 426 161.2Q410 163.3 398.3 165.4Q392.8 165.4 391.3 163.7Q389.9 162 388.2 157L383.1 136.8Q381.9 131.8 382.9 129.4Q384 127.1 388.6 125.9Q391.1 125 402.9 123.1Q414.7 121.2 430.7 119.6Q446.6 117.9 462.2 117.9Q502.6 117.9 522.8 129.4Q543 141 549.9 163.7Q556.9 186.4 556.9 219.7L556.9 327.8Q556.9 332.8 555.2 334.7Q553.5 336.6 548 336.6L522.4 336.6Q518.2 336.6 515.2 334.3Q512.3 332 508.9 327.8ZM501.8 211.7L501.8 245.8Q491.2 242 480.7 239.7Q470.2 237.3 458.4 237.3Q434.4 237.3 423.7 246.8Q413 256.3 413 271Q413 283.2 422.7 293.9Q432.3 304.7 454.2 304.7Q466.8 304.7 479.7 298.3Q492.5 292 501.8 282.8L501.8 321.5Q476.9 341.3 439.1 341.3Q420.1 341.3 403.3 333.5Q386.5 325.7 376 310.1Q365.5 294.6 365.5 271Q365.5 247.9 376.4 232.9Q387.3 218 405.8 210.6Q424.3 203.3 447.1 203.3Q458 203.3 473.4 205.6Q488.7 207.9 501.8 211.7ZM448.3 27.9L500.9 84.2Q510.2 94.7 500.1 94.7L474 94.7Q466 94.7 459.7 89.3L426.9 61.5Q422.7 58.1 422.5 55.6Q422.2 53.1 424.3 49.3L436.1 30.4Q439.9 24.5 443.3 24.5Q445.8 24.5 448.3 27.9Z',
];

export interface CaMarkOptions {
  size?: number;
  boxColor?: string;
  textColor?: string;
}

export const caMarkSvg = ({
  size = 32,
  boxColor = 'var(--ink)',
  textColor = '#fff',
}: CaMarkOptions = {}): string => {
  const width = (size * CA_MARK_ASPECT).toFixed(2);
  const paths = CA_MARK_PATHS.map((d) => `<path d="${d}"/>`).join('');
  return `<svg width="${width}" height="${size}" viewBox="${CA_MARK_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="${CA_MARK_WIDTH}" height="${CA_MARK_HEIGHT}" fill="${boxColor}"/><g fill="${textColor}">${paths}</g></svg>`;
};
