/**
 * Servidor estático mínimo (com suporte a Range, como a Hostinger) para testar o dist/.
 * Uso: node scripts/static-server.mjs <porta> [prefixo]
 *   node scripts/static-server.mjs 4173          → site na raiz
 *   node scripts/static-server.mjs 4174 /promo/  → site em subpasta
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const port = Number(process.argv[2] ?? 4173);
const prefix = process.argv[3] ?? "/";
const root = process.argv[4] ?? "dist";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (!url.startsWith(prefix)) {
    res.writeHead(404).end("fora do prefixo");
    return;
  }
  let file = normalize(join(root, url.slice(prefix.length)));
  if (!file.startsWith(normalize(root))) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.endsWith("/")) {
      res.writeHead(301, { Location: url + "/" }).end();
      return;
    }
    file = join(file, "index.html");
  }
  if (!existsSync(file)) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    createReadStream(join(root, "404.html")).pipe(res);
    return;
  }
  const size = statSync(file).size;
  const type = types[extname(file)] ?? "application/octet-stream";
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, {
      "Content-Type": type,
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
    });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`dist/ em http://localhost:${port}${prefix}`));
