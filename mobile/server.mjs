import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const root = join(import.meta.dirname, 'dist');
const target = 'https://extra.u-picardie.fr/calendar';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

createServer(async (req, res) => {
  if (req.url.startsWith('/api/celcat/')) {
    const path = req.url.slice('/api/celcat'.length);
    if (!path.startsWith('/Home/ReadResourceListItems') && !path.startsWith('/Home/GetCalendarData')) {
      res.writeHead(403).end('Endpoint interdit');
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    try {
      const upstream = await fetch(target + path, {
        method: req.method,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(req.method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } : {})
        },
        body: req.method === 'POST' ? Buffer.concat(chunks) : undefined
      });
      res.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') || 'application/json' });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502).end(JSON.stringify({ error: 'CELCAT indisponible' }));
    }
    return;
  }

  const requested = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, requested === '/' ? 'index.html' : requested);
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html');
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=86400' });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Ortho Planning : http://localhost:${port}`));
