const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://kentrepertory.com';
const DELAY_MS = 1200;

const CHAPTERS = [
  { id: 'mind', name: 'Mind', kentId: 1000000 },
  { id: 'vertigo', name: 'Vertigo', kentId: 2000000 },
  { id: 'head', name: 'Head', kentId: 3000000 },
  { id: 'eye', name: 'Eye', kentId: 4000000 },
  { id: 'vision', name: 'Vision', kentId: 5000000 },
  { id: 'ear', name: 'Ear', kentId: 6000000 },
  { id: 'hearing', name: 'Hearing', kentId: 7000000 },
  { id: 'nose', name: 'Nose', kentId: 8000000 },
  { id: 'face', name: 'Face', kentId: 9000000 },
  { id: 'mouth', name: 'Mouth', kentId: 10000000 },
  { id: 'teeth', name: 'Teeth', kentId: 11000000 },
  { id: 'throat', name: 'Throat', kentId: 12000000 },
  { id: 'external-throat', name: 'External Throat', kentId: 13000000 },
  { id: 'stomach', name: 'Stomach', kentId: 14000000 },
  { id: 'abdomen', name: 'Abdomen', kentId: 15000000 },
  { id: 'rectum', name: 'Rectum', kentId: 16000000 },
  { id: 'stool', name: 'Stool', kentId: 17000000 },
  { id: 'bladder', name: 'Bladder', kentId: 18000000 },
  { id: 'kidneys', name: 'Kidneys', kentId: 19000000 },
  { id: 'urine', name: 'Urine', kentId: 20000000 },
  { id: 'male', name: 'Genitalia Male', kentId: 21000000 },
  { id: 'female', name: 'Genitalia Female', kentId: 22000000 },
  { id: 'larynx', name: 'Larynx and Trachea', kentId: 23000000 },
  { id: 'respiration', name: 'Respiration', kentId: 24000000 },
  { id: 'cough', name: 'Cough', kentId: 25000000 },
  { id: 'expectoration', name: 'Expectoration', kentId: 26000000 },
  { id: 'chest', name: 'Chest', kentId: 27000000 },
  { id: 'back', name: 'Back', kentId: 28000000 },
  { id: 'extremities', name: 'Extremities', kentId: 29000000 },
  { id: 'sleep', name: 'Sleep', kentId: 30000000 },
  { id: 'chill', name: 'Chill', kentId: 31000000 },
  { id: 'fever', name: 'Fever', kentId: 32000000 },
  { id: 'perspiration', name: 'Perspiration', kentId: 33000000 },
  { id: 'skin', name: 'Skin', kentId: 34000000 },
  { id: 'generalities', name: 'Generalities', kentId: 35000000 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPage(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'RepertoryAI-DataCollector/1.0 (Educational Research)',
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

function parseSymptomPage(html) {
  const $ = cheerio.load(html);
  const symptoms = [];
  const remedies = [];

  $('a[href*="symptoms.php"]').each((_, el) => {
    const href = $(el).attr('href');
    const name = $(el).text().trim();
    const match = href.match(/id=(\d+)/);
    if (match && name) {
      symptoms.push({ name, kentId: parseInt(match[1]) });
    }
  });

  $('a[href*="remedies.php"]').each((_, el) => {
    const href = $(el).attr('href');
    const name = $(el).text().trim();
    const match = href.match(/id=(\d+)/);
    if (match && name) {
      remedies.push({ name, kentId: parseInt(match[1]) });
    }
  });

  const strengthText = $('body').text();
  const lowMatch = strengthText.match(/low\s+(\d+)/);
  const medMatch = strengthText.match(/medium\s+(\d+)/);
  const highMatch = strengthText.match(/high\s+(\d+)/);

  return {
    subSymptoms: symptoms,
    remedies,
    counts: {
      low: lowMatch ? parseInt(lowMatch[1]) : 0,
      medium: medMatch ? parseInt(medMatch[1]) : 0,
      high: highMatch ? parseInt(highMatch[1]) : 0,
    },
  };
}

async function scrapeChapter(chapter, maxDepth = 2) {
  console.log(`\nScraping chapter: ${chapter.name} (ID: ${chapter.kentId})`);
  const url = `${BASE_URL}/symptoms.php?id=${chapter.kentId}`;
  const html = await fetchPage(url);

  if (!html) {
    console.log(`  Skipping ${chapter.name} - failed to fetch`);
    return { symptoms: [], remedies: [] };
  }

  const parsed = parseSymptomPage(html);
  console.log(`  Found ${parsed.subSymptoms.length} sub-symptoms, ${parsed.remedies.length} remedies`);

  const allSymptoms = [];
  const allRemedies = [];

  for (const sym of parsed.subSymptoms) {
    const symptom = {
      name: sym.name,
      kentId: sym.kentId,
      chapter: chapter.id,
      subSymptoms: [],
      remedies: [],
    };

    if (maxDepth > 0) {
      await sleep(DELAY_MS);
      const subUrl = `${BASE_URL}/symptoms.php?id=${sym.kentId}`;
      const subHtml = await fetchPage(subUrl);

      if (subHtml) {
        const subParsed = parseSymptomPage(subHtml);
        symptom.subSymptoms = subParsed.subSymptoms.map((s) => ({
          name: s.name,
          kentId: s.kentId,
        }));
        symptom.remedies = subParsed.remedies;

        for (const remedy of subParsed.remedies) {
          if (!allRemedies.find((r) => r.kentId === remedy.kentId)) {
            allRemedies.push(remedy);
          }
        }
      }
    }

    allSymptoms.push(symptom);
  }

  return { symptoms: allSymptoms, remedies: allRemedies };
}

async function main() {
  console.log('Kent Repertory Scraper');
  console.log('=====================');
  console.log(`Scraping ${CHAPTERS.length} chapters from ${BASE_URL}`);
  console.log(`Rate limit: 1 request per ${DELAY_MS}ms\n`);

  const allChapters = [];
  const allRemedies = new Map();

  for (const chapter of CHAPTERS) {
    const result = await scrapeChapter(chapter, 1);

    allChapters.push({
      id: chapter.id,
      name: chapter.name,
      kentId: chapter.kentId,
      order: CHAPTERS.indexOf(chapter) + 1,
      symptoms: result.symptoms.map((s) => ({
        id: `${chapter.id}-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40)}`,
        name: s.name,
        kentId: s.kentId,
        subSymptoms: s.subSymptoms.map((sub) => ({
          id: `${chapter.id}-${sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40)}`,
          name: sub.name,
          kentId: sub.kentId,
        })),
      })),
    });

    for (const remedy of result.remedies) {
      if (!allRemedies.has(remedy.kentId)) {
        allRemedies.set(remedy.kentId, {
          id: remedy.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: remedy.name,
          kentId: remedy.kentId,
        });
      }
    }

    await sleep(DELAY_MS);
  }

  const dataDir = path.join(__dirname, '..', 'data');

  const scrapedSymptoms = { chapters: allChapters };
  fs.writeFileSync(
    path.join(dataDir, 'scraped-symptoms.json'),
    JSON.stringify(scrapedSymptoms, null, 2)
  );
  console.log(`\nSaved ${allChapters.length} chapters to scraped-symptoms.json`);

  const scrapedRemedies = {
    remedies: [...allRemedies.values()].map((r) => ({
      ...r,
      abbr: r.name,
      description: '',
      commonSymptoms: [],
      dosage: '',
      modalities: { worse: [], better: [] },
    })),
  };
  fs.writeFileSync(
    path.join(dataDir, 'scraped-remedies.json'),
    JSON.stringify(scrapedRemedies, null, 2)
  );
  console.log(`Saved ${allRemedies.size} remedies to scraped-remedies.json`);

  console.log('\nScraping complete!');
  console.log('Scraped data saved to backend/data/scraped-*.json');
  console.log('To use scraped data, rename files to replace the curated data files.');
}

main().catch(console.error);
