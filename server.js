#!/usr/bin/env node
/**
 * Zero-dependency static file server for the Angel Dale 2.0 site.
 *
 * Usage:  node server.js [port]     (default port: 8080)
 * Then open http://localhost:8080 in your browser.
 *
 * Designed for VS Code: prints "Starting server" / "Server running at"
 * lines that the "Serve Site (port 8080)" task in .vscode/tasks.json
 * uses to know when the server is ready.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.argv[2]) || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function sendFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(
        '<h1>404 Not Found</h1><p>Could not find <code>' +
          filePath.replace(ROOT, '') +
          '</code></p><p><a href="/">Back to home</a></p>'
      );
    }
    res.writeHead(200, {
      'Content-Type': type,
      // Always revalidate so edits show up with a simple browser refresh.
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    let urlPath;
    try {
      urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    } catch (e) {
      urlPath = '/';
    }
    if (urlPath.endsWith('/')) urlPath += 'index.html';

    // Resolve inside the project folder only (block path traversal).
    const filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT + path.sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('403 Forbidden');
    }

    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isDirectory()) {
        // Redirect "/folder" -> "/folder/" so relative links keep working.
        if (!req.url.endsWith('/')) {
          res.writeHead(301, { Location: req.url + '/' });
          return res.end();
        }
        return sendFile(path.join(filePath, 'index.html'), res);
      }
      if (err || !stat.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(
          '<h1>404 Not Found</h1><p><a href="/">Back to home</a></p>'
        );
      }
      sendFile(filePath, res);
    });
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // Don't break the VS Code pre-launch task if a server is already up.
    console.log(`Port ${PORT} is already in use - a server is probably already running.`);
    console.log(`Server running at http://localhost:${PORT}`);
    process.exit(0);
  }
  console.error('Server error:', err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log('Starting server for ' + ROOT);
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop.');
});
