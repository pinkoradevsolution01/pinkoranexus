const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'frontend', 'build');
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/octet-stream',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function getMimeType(filePath) {
  return contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function resolveAsset(urlPath) {
  const safePath = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(safePath).replace(/^(\.\.(\\|\/|$))+/, '');
  let candidate = path.join(buildDir, normalized);

  if (safePath === '/' || safePath === '') {
    candidate = path.join(buildDir, 'index.html');
  }

  return candidate;
}

if (!fs.existsSync(buildDir)) {
  console.error(`Frontend build not found at ${buildDir}`);
  console.error('Run a production build first, or restore a valid frontend build directory.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const method = req.method || 'GET';

  if (method !== 'GET' && method !== 'HEAD') {
    send(res, 405, 'Method Not Allowed', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }

  const filePath = resolveAsset(req.url || '/');
  const exists = fs.existsSync(filePath) && fs.statSync(filePath).isFile();

  if (exists) {
    res.writeHead(200, {
      'Content-Type': getMimeType(filePath),
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const indexPath = path.join(buildDir, 'index.html');
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache',
  });
  fs.createReadStream(indexPath).pipe(res);
});

server.listen(port, () => {
  console.log(`Frontend build server running on http://localhost:${port}`);
});
