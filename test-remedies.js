const { chromium } = require('playwright');
const path = require('path');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    // 1. Go to landing, click explorer
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.click('a[href="/explorer"]');
    await page.waitForTimeout(2000);

    // 2. Expand Mind chapter
    const mindBtn = page.locator('nav button').filter({ hasText: 'মন' }).first();
    if (await mindBtn.count() > 0) await mindBtn.click();
    await page.waitForTimeout(1000);

    // 3. Click Fear (ভয়)
    const fearBtn = page.locator('button').filter({ hasText: 'ভয়' }).first();
    if (await fearBtn.count() > 0) await fearBtn.click();
    await page.waitForTimeout(3000);

    // 4. Screenshot - remedies should load
    await page.screenshot({ path: path.join(__dirname, 'remedy-test-1-after-fear.png') });
    const text1 = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'remedy-test-1-text.txt'), text1, 'utf8');

    const hasRemedies = text1.includes('অ্যাকোনাইটাম') || text1.includes('আর্সেনিকাম') || text1.includes('Ars.') || text1.includes('Acon.');
    console.log('Remedies loaded:', hasRemedies);

    // 5. Click first remedy if visible
    const remedyBtn = page.locator('button').filter({ hasText: /অ্যাকোনাইটাম|আর্সেনিকাম|Ars\.|Acon\.|উচ্চ|মাঝারি/ }).first();
    if (await remedyBtn.count() > 0) {
      await remedyBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(__dirname, 'remedy-test-2-detail.png') });
      const url2 = page.url();
      const text2 = await page.evaluate(() => document.body.innerText);
      require('fs').writeFileSync(path.join(__dirname, 'remedy-test-2-text.txt'), 'URL: ' + url2 + '\n\n' + text2, 'utf8');
      console.log('Clicked remedy, URL:', url2);
    } else {
      require('fs').writeFileSync(path.join(__dirname, 'remedy-test-2-text.txt'), 'No remedy button found', 'utf8');
      await page.screenshot({ path: path.join(__dirname, 'remedy-test-2-detail.png') });
    }

    // 6. Direct nav to /remedies/ars
    await page.goto('http://localhost:3000/remedies/ars', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(__dirname, 'remedy-test-3-direct-ars.png') });
    const text3 = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'remedy-test-3-text.txt'), text3, 'utf8');

    const directWorks = !text3.includes('কিছু ভুল হয়েছে') && (text3.includes('আর্সেনিকাম') || text3.includes('Arsenicum'));
    console.log('Direct /remedies/ars works:', directWorks);

  } catch (e) {
    console.error('Error:', e.message);
    require('fs').writeFileSync(path.join(__dirname, 'remedy-test-error.txt'), e.message, 'utf8');
  } finally {
    require('fs').writeFileSync(path.join(__dirname, 'remedy-test-errors.txt'), errors.join('\n---\n'), 'utf8');
    await browser.close();
  }
  console.log('Console errors:', errors.length);
}

run();
