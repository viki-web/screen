const http = require('http');
const puppeteer = require('puppeteer');

const server = http.createServer(async (req, res) => {
    let message = 'It works!\n';
    let version = 'NodeJS ' + process.versions.node + '\n';
    let puppeteerStatus = 'Puppeteer status: ';

    try {
        // Attempt to launch a browser instance to verify Puppeteer is working
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        await browser.close();
        puppeteerStatus += 'Installed and working!';
    } catch (error) {
        puppeteerStatus += 'Not installed or not working.';
    }

    const response = [message, version, puppeteerStatus].join('\n');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(response);
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});