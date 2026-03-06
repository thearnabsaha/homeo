const { chromium } = require('playwright');
const path = require('path');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleLogs = [];
  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push(text);
    }
    consoleLogs.push(`[${type}] ${text}`);
  });

  page.on('requestfailed', (request) => {
    failedRequests.push({
      type: 'request_failed',
      url: request.url(),
      failure: request.failure()?.errorText || 'unknown',
    });
  });

  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push({
        type: 'http_error',
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      });
    }
  });

  try {
    // 1. Go to explorer
    console.log('1. Navigating to explorer...');
    await page.goto('http://localhost:3000/explorer', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 2. Expand Mind chapter
    console.log('2. Expanding Mind chapter...');
    const mindBtn = page.locator('nav button').filter({ hasText: 'মন' }).first();
    if (await mindBtn.count() > 0) {
      await mindBtn.click();
      await page.waitForTimeout(1000);
    }

    // 3. Click on a symptom in the main area (ভয় / Fear) - symptom appears in main content after chapter expand
    console.log('3. Clicking on symptom ভয়...');
    const symptomBtn = page.locator('main button').filter({ hasText: 'ভয়' }).first();
    if (await symptomBtn.count() > 0) {
      await symptomBtn.click();
      await page.waitForTimeout(2500);
    } else {
      // Fallback: click first symptom in main area
      const anySymptom = page.locator('main button.text-left').first();
      if (await anySymptom.count() > 0) {
        await anySymptom.click();
        await page.waitForTimeout(2500);
      }
    }

    // 4. Screenshot of symptom view
    await page.screenshot({ path: path.join(__dirname, 'flow-1-symptom-remedies.png') });
    const symptomText = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync(path.join(__dirname, 'flow-1-symptom-remedies.txt'), symptomText, 'utf8');
    console.log('4. Screenshot 1 saved');

    // 5. Click on a remedy if visible (remedies are shown as buttons in SymptomTree)
    console.log('5. Looking for remedy to click...');
    const remedyBtn = page.locator('main button').filter({ hasText: /অ্যাকোনাইটাম|আর্সেনিকাম|বেলাডোনা|Aconitum|Arsenicum|Belladonna/ }).first();
    if (await remedyBtn.count() > 0) {
      const btnText = await remedyBtn.textContent();
      console.log('   Found remedy button:', btnText?.slice(0, 50));
      await remedyBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(__dirname, 'flow-2-remedy-page.png') });
      const remedyText = await page.evaluate(() => document.body.innerText);
      require('fs').writeFileSync(path.join(__dirname, 'flow-2-remedy-page.txt'), remedyText, 'utf8');
      console.log('6. Screenshot 2 (remedy page) saved');
    } else {
      const anyRemedyBtn = page.locator('main button.flex').filter({ hasText: /উচ্চ|মাঝারি|নিম্ন/ }).first();
      if (await anyRemedyBtn.count() > 0) {
        await anyRemedyBtn.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: path.join(__dirname, 'flow-2-remedy-page.png') });
        const remedyText = await page.evaluate(() => document.body.innerText);
        require('fs').writeFileSync(path.join(__dirname, 'flow-2-remedy-page.txt'), remedyText, 'utf8');
        console.log('6. Screenshot 2 (remedy page) saved');
      } else {
        console.log('   No remedy button found - navigating directly to remedy page');
        await page.goto('http://localhost:3000/remedies/acon', { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(__dirname, 'flow-2-remedy-page.png') });
        const remedyText = await page.evaluate(() => document.body.innerText);
        require('fs').writeFileSync(path.join(__dirname, 'flow-2-remedy-page.txt'), remedyText, 'utf8');
        console.log('6. Screenshot 2 (remedy page via direct nav) saved');
      }
    }

    // Save console and network info
    require('fs').writeFileSync(
      path.join(__dirname, 'flow-console-errors.txt'),
      consoleErrors.length ? consoleErrors.join('\n\n') : 'No console errors',
      'utf8'
    );
    require('fs').writeFileSync(
      path.join(__dirname, 'flow-console-all.txt'),
      consoleLogs.slice(-50).join('\n'),
      'utf8'
    );
    require('fs').writeFileSync(
      path.join(__dirname, 'flow-failed-requests.txt'),
      failedRequests.length ? JSON.stringify(failedRequests, null, 2) : 'No failed requests',
      'utf8'
    );

    console.log('\n--- Console Errors:', consoleErrors.length);
    consoleErrors.forEach((e) => console.log('  ', e));
    console.log('\n--- Failed Requests:', failedRequests.length);
    failedRequests.forEach((r) => console.log('  ', r.url, r.failure));
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: path.join(__dirname, 'flow-error.png') });
  } finally {
    await browser.close();
  }
}

run();
