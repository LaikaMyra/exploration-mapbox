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
    } else if (req.url === '/map.js') {
        fs.readFile(path.join(__dirname, 'map.js'), 'utf8', (err, content) => {
            if (err) {
                logError('Failed to load map.js', err);
                res.writeHead(500);
                res.end('Error loading map.js');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(content);
        });
    } else if (req.url === '/api/locations') {
        try {
            const locationsPath = path.join(__dirname, '../mongodb-standIn/collections/locations.json');
            console.log('Reading locations from:', locationsPath);
            
            if (!fs.existsSync(locationsPath)) {
                logError('Locations file not found', new Error(`File not found: ${locationsPath}`));
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
            logError('Error serving locations', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else if (req.url === '/api/jobs') {
        try {
            const jobsPath = path.join(__dirname, '../mongodb-standIn/collections/jobs.json');
            console.log('Reading jobs from:', jobsPath);
            
            if (!fs.existsSync(jobsPath)) {
                logError('Jobs file not found', new Error(`File not found: ${jobsPath}`));
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
            logError('Error serving jobs', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else if (req.url === '/api/technicians') {
        try {
            const techniciansPath = path.join(__dirname, '../mongodb-standIn/collections/technicians.json');
            console.log('Reading technicians from:', techniciansPath);
            
            if (!fs.existsSync(techniciansPath)) {
                logError('Technicians file not found', new Error(`File not found: ${techniciansPath}`));
                res.writeHead(404);
                res.end('Technicians file not found');
                return;
            }

            const data = fs.readFileSync(techniciansPath, 'utf8');
            console.log('Technicians data:', data);
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(data);
        } catch (error) {
            logError('Error serving technicians', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
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
