const { chromium } = require('playwright');
const path = require('path');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    viewport: { width: 1280, height: 900 },
    locale: 'bn-BD'
  });
  const page = await context.newPage();

  try {
    // 1. Landing page top
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(__dirname, 'screenshot-1-landing-top.png') });
    const landingTopText = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'text-1-landing-top.txt'), landingTopText, 'utf8');

    // 2. Scroll to features, stats, how it works
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(__dirname, 'screenshot-2-features-stats.png') });
    const featuresText = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'text-2-features.txt'), featuresText, 'utf8');

    // 3. Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(__dirname, 'screenshot-3-footer.png') });
    const footerText = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'text-3-footer.txt'), footerText, 'utf8');

    // 4. Explorer - sidebar with chapters
    await page.goto('http://localhost:3000/explorer', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(__dirname, 'screenshot-4-explorer-sidebar.png') });
    const explorerText = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'text-4-explorer.txt'), explorerText, 'utf8');

    // 5. Click first chapter
    const firstChapter = await page.locator('button:has-text("মন"), button:has-text("Mind"), nav button').first();
    if (await firstChapter.count() > 0) {
      await firstChapter.click();
      await page.waitForTimeout(1500);
    }
    await page.screenshot({ path: path.join(__dirname, 'screenshot-5-explorer-symptoms.png') });
    const symptomsText = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'text-5-symptoms.txt'), symptomsText, 'utf8');

    // 6. Consult page
    await page.goto('http://localhost:3000/consult', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(__dirname, 'screenshot-6-consult.png') });
    const consultText = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'text-6-consult.txt'), consultText, 'utf8');

    console.log('All screenshots and text captured successfully');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

run();
