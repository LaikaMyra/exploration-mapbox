const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml'
};

// Enhanced logging function
const logError = (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${message}:`, error);
    if (error.stack) {
        console.error(`[${timestamp}] Stack trace:`, error.stack);
    }
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle static files
    if (req.url.startsWith('/icons/')) {
        const filePath = path.join(__dirname, 'icons', req.url.replace('/icons/', ''));
        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                logError(`Failed to serve icon file: ${req.url}`, err);
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
        return;
    }

    // Handle app static files
    if (req.url.match(/\.(css|js)$/)) {
        const filePath = path.join(__dirname, req.url);
        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                logError(`Failed to serve static file: ${req.url}`, err);
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
        return;
    }

    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, content) => {
            if (err) {
                logError('Failed to load index.html', err);
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            try {
                content = content.replace('<%= process.env.MAPBOX_ACCESS_TOKEN %>', process.env.MAPBOX_ACCESS_TOKEN);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            } catch (error) {
                logError('Failed to process index.html template', error);
                res.writeHead(500);
                res.end('Error processing template');
            }
        });
    } else {
        logError('Route not found', new Error(`404: ${req.url}`));
        res.writeHead(404);
        res.end('Not found');
    }
});

// Add uncaught exception handler
process.on('uncaughtException', (error) => {
    logError('Uncaught Exception', error);
    // Give the error logging time to complete before exiting
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

// Add unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
    logError('Unhandled Rejection', reason);
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
