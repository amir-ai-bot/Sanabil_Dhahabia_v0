const puppeteer = require('puppeteer-core');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: "new"
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log("Navigating...");
    await page.goto('http://localhost:4200/catalogue', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\39f30bf5-8465-4a6e-9138-99c239fdee53\\browser_screenshot.png' });
    console.log("Screenshot saved!");
    
    await browser.close();
  } catch (err) {
    console.error("Script failed:", err);
  }
})();
