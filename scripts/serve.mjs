// Tiny static server for dist/ — mirrors what shared hosting does (index.html per folder, 404.html).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = 'dist'; const port = Number(process.env.PORT ?? 4330);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); let file = join(root, p);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { if (!extname(file)) file = join(root, p + '.html'); }
  try {
    const data = await readFile(file);
    const type = types[extname(file)] ?? 'application/octet-stream';
    // Mirror the DEFLATE rules in public/.htaccess, so local numbers match the host.
    const compressible = /^(text\/|application\/(javascript|json)|image\/svg)/.test(type);
    if (compressible && (req.headers['accept-encoding'] ?? '').includes('gzip')) {
      const gz = gzipSync(data, { level: 6 });
      res.writeHead(200, { 'content-type': type, 'content-encoding': 'gzip', 'content-length': gz.length, vary: 'Accept-Encoding' });
      res.end(gz);
    } else {
      res.writeHead(200, { 'content-type': type, 'content-length': data.length });
      res.end(data);
    }
  }
  catch { const nf = await readFile(join(root, '404.html')).catch(() => Buffer.from('404')); res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }); res.end(nf); }
}).listen(port, () => console.log('serving dist on', port));
