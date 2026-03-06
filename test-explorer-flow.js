const { chromium } = require('playwright');
const path = require('path');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage({ viewport: { width: 1280, height: 900 } });

  const consoleLogs = [];
  const consoleErrors = [];
  const jsErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push(text);
      jsErrors.push(text);
    }
    consoleLogs.push(`[${type}] ${text}`);
  });

  page.on('pageerror', (err) => {
    jsErrors.push('PAGE ERROR: ' + err.message);
  });

  try {
    // 1. Go to landing and click explorer
    console.log('1. Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);

    await page.click('a[href="/explorer"]');
    await page.waitForTimeout(2000);
    console.log('2. Clicked explorer link');

    // 2. Expand Mind chapter
    const mindBtn = page.locator('nav button').filter({ hasText: 'মন' }).first();
    if (await mindBtn.count() > 0) {
      await mindBtn.click();
      await page.waitForTimeout(1000);
      console.log('3. Expanded Mind chapter');
    }

    // 3. Click on Fear symptom (ভয়)
    const fearBtn = page.locator('button').filter({ hasText: 'ভয়' }).first();
    if (await fearBtn.count() > 0) {
      await fearBtn.click();
      await page.waitForTimeout(2000);
      console.log('4. Clicked Fear symptom');
    } else {
      console.log('4. Fear button not found, trying alternative...');
      const symptomBtn = page.locator('button').filter({ hasText: 'ভয়' });
      await symptomBtn.first().click().catch(() => {});
      await page.waitForTimeout(2000);
    }

    // 4. Screenshot - remedies should appear
    await page.screenshot({ path: path.join(__dirname, 'flow-1-after-symptom-click.png') });
    const text1 = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'flow-1-text.txt'), text1, 'utf8');
    console.log('5. Screenshot 1 saved (after symptom click)');

    // 5. Try clicking a remedy if visible (remedies are buttons, not links)
    const remedyBtn = page.locator('button').filter({ hasText: /অ্যাকোনাইটাম|আর্সেনিকাম|Aconitum|Arsenicum|Ars\.|Acon\./ }).first();
    if (await remedyBtn.count() > 0) {
      await remedyBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(__dirname, 'flow-2-after-remedy-click.png') });
      const url2 = page.url();
      const text2 = await page.evaluate(() => document.body.innerText);
      require('fs').writeFileSync(path.join(__dirname, 'flow-2-text.txt'), 'URL: ' + url2 + '\n\n' + text2, 'utf8');
      console.log('6. Clicked remedy button, URL:', url2);
    } else {
      const anyRemedy = page.locator('button').filter({ hasText: /উচ্চ|মাঝারি|নিম্ন/ }).first();
      if (await anyRemedy.count() > 0) {
        await anyRemedy.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: path.join(__dirname, 'flow-2-after-remedy-click.png') });
        require('fs').writeFileSync(path.join(__dirname, 'flow-2-text.txt'), 'Clicked remedy (by badge)\nURL: ' + page.url(), 'utf8');
      } else {
        require('fs').writeFileSync(path.join(__dirname, 'flow-2-text.txt'), 'No remedy button found. Page text:\n' + (await page.evaluate(() => document.body.innerText)), 'utf8');
        await page.screenshot({ path: path.join(__dirname, 'flow-2-after-remedy-click.png') });
        console.log('6. No remedy button found');
      }
    }

    // 8. Navigate directly to /remedies/ars
    console.log('7. Navigating directly to /remedies/ars...');
    await page.goto('http://localhost:3000/remedies/ars', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(__dirname, 'flow-3-direct-remedy.png') });
    const text3 = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'flow-3-text.txt'), text3, 'utf8');
    console.log('8. Screenshot 3 saved (direct /remedies/ars)');

  } catch (e) {
    console.error('Error:', e.message);
    require('fs').writeFileSync(path.join(__dirname, 'flow-error.txt'), e.message + '\n' + e.stack, 'utf8');
  } finally {
    require('fs').writeFileSync(path.join(__dirname, 'flow-console-errors.txt'), jsErrors.join('\n---\n'), 'utf8');
    require('fs').writeFileSync(path.join(__dirname, 'flow-console-all.txt'), consoleLogs.join('\n'), 'utf8');
    await browser.close();
  }

  console.log('\n--- Console errors ---');
  jsErrors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
}

run();
