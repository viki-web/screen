const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/convert', async (req, res) => {
  const { html, css } = req.body;

  if (!html) {
    return res.status(400).send('HTML content is required');
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Set the content
    await page.setContent(`
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>
    `);

    // Capture screenshot
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath });

    await browser.close();

    // Send the screenshot
    res.sendFile(screenshotPath, () => {
      fs.unlinkSync(screenshotPath); // Clean up the file after sending
    });
  } catch (error) {
    res.status(500).send('Error generating image');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});