/**
 * Gera ícones (favicon PNG, apple-touch, PWA) e a imagem de compartilhamento (OG 1200×630)
 * a partir dos SVGs oficiais em src/assets/brand/.
 * Uso: node scripts/build-brand-assets.mjs
 */
import sharp from "sharp";

const fav = "public/favicon.svg";
const sym = "src/assets/brand/logo-symbol.svg";
const vert = "src/assets/brand/logo-vertical.svg";
const CANVAS = "#F8F5EF";

await sharp(fav, { density: 300 }).resize(32, 32).png().toFile("public/favicon-32.png");

async function padded(size, out, ratio) {
  const inner = Math.round(size * ratio);
  const icon = await sharp(sym, { density: 600 }).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: CANVAS } })
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toFile(out);
}
await padded(180, "public/apple-touch-icon.png", 0.7);
await padded(192, "public/icon-192.png", 0.62);
await padded(512, "public/icon-512.png", 0.62);

const logo = await sharp(vert, { density: 400 }).resize({ height: 380 }).png().toBuffer();
const art = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${CANVAS}"/>
  <circle cx="1080" cy="-40" r="300" fill="none" stroke="#DED9D0" stroke-width="2"/>
  <circle cx="1080" cy="-40" r="230" fill="none" stroke="#DED9D0" stroke-width="1.5"/>
  <line x1="460" y1="150" x2="460" y2="480" stroke="#DED9D0" stroke-width="2"/>
  <text x="515" y="272" font-family="Georgia, serif" font-size="44" font-weight="600" fill="#253E43">Você cuida de quem ama.</text>
  <text x="515" y="336" font-family="Georgia, serif" font-size="44" font-style="italic" fill="#253E43">Agora é hora de</text>
  <text x="515" y="400" font-family="Georgia, serif" font-size="44" font-style="italic" fill="#253E43">cuidar de você.</text>
  <text x="517" y="462" font-family="Arial, sans-serif" font-size="21" fill="#58736D" letter-spacing="3">MÉTODO DE DESCANSO NOTURNO</text>
</svg>`);
await sharp(art).composite([{ input: logo, left: 140, top: 125 }]).jpeg({ quality: 86 }).toFile("public/og-image.jpg");

console.log("Ícones e og-image.jpg gerados em public/");
