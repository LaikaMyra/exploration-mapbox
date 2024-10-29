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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        try {
            const locationsPath = path.join(__dirname, '../mongodb/collections/locations.json');
            console.log('Reading locations from:', locationsPath);
            
            if (!fs.existsSync(locationsPath)) {
                console.error('Locations file not found');
                res.writeHead(404);
                res.end('Locations file not found');
                return;
            }

            const data = fs.readFileSync(locationsPath, 'utf8');
            console.log('Locations data:', data);
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(data);
        } catch (error) {
            console.error('Error serving locations:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else if (req.url === '/api/jobs') {
        try {
            const jobsPath = path.join(__dirname, '../mongodb/collections/jobs.json');
            console.log('Reading jobs from:', jobsPath);
            
            if (!fs.existsSync(jobsPath)) {
                console.error('Jobs file not found');
                res.writeHead(404);
                res.end('Jobs file not found');
                return;
            }

            const data = fs.readFileSync(jobsPath, 'utf8');
            console.log('Jobs data:', data);
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(data);
        } catch (error) {
            console.error('Error serving jobs:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
