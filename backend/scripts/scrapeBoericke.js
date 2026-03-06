process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const fs = require('fs');
const path = require('path');
const https = require('https');

const missingPath = path.join(__dirname, 'missingRemedies.json');
const missing = JSON.parse(fs.readFileSync(missingPath, 'utf8'));
const outputPath = path.join(__dirname, 'scrapedRemedies.json');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchPage(res.headers.location).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function cleanText(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRemedyPage(html, remedy) {
  const text = cleanText(html);

  let description = '';
  const bodyStart = html.indexOf('</b></p>');
  if (bodyStart > -1) {
    const afterName = html.substring(bodyStart + 8);
    const nextSection = afterName.search(/<font color="#ff0000"><b>/i);
    if (nextSection > -1) {
      description = cleanText(afterName.substring(0, nextSection));
    } else {
      description = cleanText(afterName.substring(0, 500));
    }
  }
  if (!description || description.length < 15) {
    const sentences = text.split(/\.\s+/).filter(s => s.length > 20 && s.length < 300);
    description = sentences.slice(0, 3).join('. ') + '.';
  }
  if (description.length > 500) description = description.substring(0, 497) + '...';
  description = description.replace(/^\s*[,;:\-]+\s*/, '').trim();

  const sectionRegex = /<font color="#ff0000"><b>\s*<p[^>]*>([^.]+)\.\-\-<\/b><\/font>([\s\S]*?)(?=<font color="#ff0000"><b>|<font color="#808000">|Relationship|Copyright|<\/blockquote>)/gi;
  const sections = {};
  let sMatch;
  while ((sMatch = sectionRegex.exec(html)) !== null) {
    const sectionName = cleanText(sMatch[1]);
    const sectionContent = cleanText(sMatch[2]);
    if (sectionContent.length > 5) {
      sections[sectionName] = sectionContent.substring(0, 300);
    }
  }

  const sectionRegex2 = /<font color="#ff0000"><b>[^<]*<\/b><\/font>([^<]*)<p[^>]*>([^<]+)\.\-\-([\s\S]*?)(?=<font color="#ff0000"|<font color="#808000">|Relationship|Copyright|<\/blockquote>)/gi;
  while ((sMatch = sectionRegex2.exec(html)) !== null) {
    const sectionName = cleanText(sMatch[2]);
    const sectionContent = cleanText(sMatch[3]);
    if (sectionContent.length > 5 && !sections[sectionName]) {
      sections[sectionName] = sectionContent.substring(0, 300);
    }
  }

  const worse = [];
  const better = [];
  const worseMatch = text.match(/Worse[,;:\s]+([^.]*?)(?:\.\s*Better|$)/i);
  const betterMatch = text.match(/Better[,;:\s]+([^.]*?)(?:\.\s*(?:Worse|Relationship|Dose|Compare)|$)/i);

  if (worseMatch) {
    worse.push(...worseMatch[1].split(/[;,]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 80).slice(0, 8));
  }
  if (betterMatch) {
    better.push(...betterMatch[1].split(/[;,]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 80).slice(0, 8));
  }

  const modText = text.match(/Modalities\.\s*[-:]?\s*(.*?)(?:Relationship|Dose|Compare|Copyright)/is);
  if (modText && worse.length === 0 && better.length === 0) {
    const modContent = modText[1];
    const w2 = modContent.match(/Worse[,;:\s]+([^.]*?)(?:\.\s*Better|$)/i);
    const b2 = modContent.match(/Better[,;:\s]+([^.]*)/i);
    if (w2) worse.push(...w2[1].split(/[;,]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 80).slice(0, 8));
    if (b2) better.push(...b2[1].split(/[;,]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 80).slice(0, 8));
  }

  let dosage = '';
  const doseMatch = text.match(/Dose\.\s*[-:]?\s*([^.]*\.)/i);
  if (doseMatch) {
    dosage = doseMatch[1].trim();
    if (dosage.length > 200) dosage = dosage.substring(0, 197) + '...';
  }
  if (!dosage) {
    const doseMatch2 = text.match(/(?:potency|trituration|tincture)[^.]*\./i);
    if (doseMatch2) dosage = doseMatch2[0].trim();
  }
  if (!dosage) dosage = 'Third to thirtieth potency.';

  return {
    id: remedy.id,
    name: remedy.name,
    abbr: remedy.abbr,
    description,
    dosage,
    commonSymptoms: [],
    modalities: { worse, better },
    sections,
  };
}

async function scrapeAll() {
  console.log(`Total to scrape: ${missing.length}`);

  const BATCH_SIZE = 8;
  const DELAY_MS = 500;
  const scraped = [];

  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (remedy) => {
        try {
          const html = await fetchPage(remedy.url);
          return parseRemedyPage(html, remedy);
        } catch (err) {
          console.error(`  FAILED: ${remedy.id} - ${err.message}`);
          return {
            id: remedy.id, name: remedy.name, abbr: remedy.abbr,
            description: `${remedy.name} - Boericke's Materia Medica remedy.`,
            dosage: 'Third to thirtieth potency.',
            commonSymptoms: [], modalities: { worse: [], better: [] }, sections: {},
          };
        }
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) scraped.push(result.value);
    }

    if ((i / BATCH_SIZE + 1) % 10 === 0 || i + BATCH_SIZE >= missing.length) {
      console.log(`Progress: ${Math.min(i + BATCH_SIZE, missing.length)}/${missing.length}`);
    }

    if (i + BATCH_SIZE < missing.length) await new Promise(r => setTimeout(r, DELAY_MS));
  }

  fs.writeFileSync(outputPath, JSON.stringify(scraped, null, 2));
  
  const withDesc = scraped.filter(r => r.description && !r.description.endsWith('Materia Medica remedy.'));
  const withMod = scraped.filter(r => r.modalities.worse.length > 0 || r.modalities.better.length > 0);
  const withSections = scraped.filter(r => Object.keys(r.sections || {}).length > 0);
  console.log(`\nDone! Total: ${scraped.length}`);
  console.log(`With descriptions: ${withDesc.length}`);
  console.log(`With modalities: ${withMod.length}`);
  console.log(`With body sections: ${withSections.length}`);
}

scrapeAll().catch(console.error);
