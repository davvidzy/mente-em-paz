/**
 * Converte imagens originais de images-src/ em WebP otimizado para public/img/.
 * Gera duas larguras (400 e 800) para srcset. Prints de depoimentos: conteúdo intacto,
 * apenas redimensionado/convertido.
 *
 * Uso: npm run images
 *   images-src/depoimentos/maria.jpg → public/img/depoimentos/maria-400.webp e maria-800.webp
 * (a pasta images-src/brand/ guarda os PNGs originais da logo e é ignorada)
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import sharp from "sharp";

const SRC = "images-src";
const OUT = "public/img";
const WIDTHS = [400, 800];
const EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) {
      if (name !== "brand") yield* walk(p);
    } else if (EXT.has(extname(p).toLowerCase())) yield p;
  }
}

let count = 0;
for await (const file of walk(SRC)) {
  const rel = relative(SRC, file).replace(extname(file), "");
  const meta = await sharp(file).metadata();
  for (const w of WIDTHS) {
    const out = join(OUT, `${rel}-${w}.webp`);
    await mkdir(dirname(out), { recursive: true });
    await sharp(file)
      .resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out);
    count++;
  }
  console.log("✓", rel);
}
console.log(count ? `${count} arquivos gerados em ${OUT}/` : `Nenhuma imagem em ${SRC}/ (fora de brand/).`);
