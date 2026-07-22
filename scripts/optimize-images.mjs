import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const dir = 'public/images';
const files = (await readdir(dir)).filter((f) => extname(f).toLowerCase() === '.png');

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const src = join(dir, file);
  const dest = src.replace(/\.png$/i, '.webp');
  const before = (await stat(src)).size;
  await sharp(src).webp({ quality: 82 }).toFile(dest);
  const after = (await stat(dest)).size;
  totalBefore += before;
  totalAfter += after;
  console.log(`${file} -> ${file.replace(/\.png$/i, '.webp')}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
console.log('Originals kept. Add <picture><source type="image/webp"> or swap <img src> once approved.');
