/**
 * Scrape the old homeo app at homeo.ecloudinfo.in to discover API endpoints
 * and extract all repertory data.
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching main page...');
  const html = await fetch('https://homeo.ecloudinfo.in/HMedicalTry/Index');
  
  // Find all script src
  const scriptSrcRe = /src=["']([^"']+)["']/g;
  let m;
  const scripts = [];
  while ((m = scriptSrcRe.exec(html)) !== null) {
    if (m[1].includes('.js')) scripts.push(m[1]);
  }
  console.log('Script files found:', scripts);

  // Find ng-app and ng-controller
  const ngAppRe = /ng-app=["']([^"']+)["']/;
  const ngApp = html.match(ngAppRe);
  if (ngApp) console.log('ng-app:', ngApp[1]);

  const ngCtrlRe = /ng-controller=["']([^"']+)["']/g;
  while ((m = ngCtrlRe.exec(html)) !== null) {
    console.log('ng-controller:', m[1]);
  }

  // Look for inline scripts with API calls
  const inlineRe = /<script(?:\s[^>]*)?>([^]*?)<\/script>/gi;
  while ((m = inlineRe.exec(html)) !== null) {
    const content = m[1].trim();
    if (content.length > 50 && (content.includes('$http') || content.includes('.get') || content.includes('.post') || content.includes('Repertory') || content.includes('Condition') || content.includes('Symptom'))) {
      console.log('\n=== INLINE SCRIPT WITH API REFS ===');
      console.log(content.substring(0, 5000));
    }
  }

  // Try to fetch the angular JS file
  for (const src of scripts) {
    if (src.includes('angular') || src.includes('HMedical') || src.includes('Index') || src.includes('app')) {
      const fullUrl = src.startsWith('http') ? src : 'https://homeo.ecloudinfo.in' + (src.startsWith('/') ? '' : '/') + src;
      console.log('\nFetching JS: ' + fullUrl);
      try {
        const js = await fetch(fullUrl);
        if (js.includes('$http') || js.includes('Repertory') || js.includes('GetCondition')) {
          console.log('=== JS FILE CONTENT (first 5000 chars) ===');
          console.log(js.substring(0, 5000));
        } else {
          console.log('(no API references in this file, length=' + js.length + ')');
        }
      } catch (e) {
        console.log('Error fetching: ' + e.message);
      }
    }
  }

  // Print full HTML for analysis
  console.log('\n=== FULL HTML ===');
  console.log(html);
}

main().catch(console.error);
