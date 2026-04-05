const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT = __dirname;

const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml',
    '.txt': 'text/plain', '.webp': 'image/webp', '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
    let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);

    // If the path has no extension, append .html when the file either
    // doesn't exist OR is a directory (e.g. /projects when projects/ exists)
    if (!path.extname(filePath)) {
        const exists = fs.existsSync(filePath);
        const isDir = exists && fs.statSync(filePath).isDirectory();
        if (!exists || isDir) {
            filePath += '.html';
        }
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(PORT, () => console.log(`Dev server running at http://localhost:${PORT}`));
