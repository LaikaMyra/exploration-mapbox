const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            content = content.replace('<%= process.env.MAPBOX_ACCESS_TOKEN %>', process.env.MAPBOX_ACCESS_TOKEN);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/map.js') {
        fs.readFile(path.join(__dirname, 'map.js'), 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading map.js');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(content);
        });
    } else if (req.url === '/api/locations') {
        fs.readFile(path.join(__dirname, '../mongodb/collections/locations.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading locations');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (req.url === '/api/jobs') {
        fs.readFile(path.join(__dirname, '../mongodb/collections/jobs.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading jobs');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
