const fs = require('fs');
const path = require('path');

const rubricsPath = path.join(__dirname, '..', 'data', 'rubrics.json');
const remediesPath = path.join(__dirname, '..', 'data', 'remedies.json');
const symptomsPath = path.join(__dirname, '..', 'data', 'symptoms.json');
const scrapedPath = path.join(__dirname, 'scrapedRemedies.json');

const rubrics = JSON.parse(fs.readFileSync(rubricsPath, 'utf8'));
const remediesData = JSON.parse(fs.readFileSync(remediesPath, 'utf8'));
const symptoms = JSON.parse(fs.readFileSync(symptomsPath, 'utf8'));
const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));

const existingRemedyIds = new Set(remediesData.remedies.slice(0, 227).map(r => r.id));
const newRemedyIds = new Set(remediesData.remedies.slice(227).map(r => r.id));
const scrapedMap = {};
for (const r of scraped) scrapedMap[r.id] = r;

const sectionToChapter = {
  'Mind': ['mind'],
  'Head': ['head'],
  'Eyes': ['eye', 'eyes'],
  'Ears': ['ear'],
  'Nose': ['nose'],
  'Face': ['face'],
  'Mouth': ['mouth', 'dental', 'teeth'],
  'Throat': ['throat'],
  'Stomach': ['stomach', 'gastric'],
  'Abdomen': ['abdomen', 'abdominal'],
  'Rectum': ['rectum', 'rectal', 'anus'],
  'Stool': ['stool'],
  'Urinary': ['urinary', 'kidney', 'bladder'],
  'Male': ['male-reproductive', 'prostate'],
  'Female': ['female-reproductive', 'gynecological', 'menstrual', 'pregnancy'],
  'Respiratory': ['respiratory', 'chest', 'lung'],
  'Heart': ['heart', 'cardiovascular'],
  'Back': ['back'],
  'Extremities': ['extremities', 'musculoskeletal', 'joints'],
  'Skin': ['skin', 'dermatological'],
  'Fever': ['fever'],
  'Sleep': ['sleep'],
  'Generalities': ['general', 'endocrine', 'metabolism'],
};

const symptomKeywords = {};
for (const ch of symptoms.chapters) {
  for (const s of (ch.symptoms || [])) {
    const words = s.id.split('-').filter(w => w.length > 2);
    symptomKeywords[s.id] = {
      chapter: ch.id,
      words,
      name: s.name.toLowerCase(),
    };
  }
}

function getRelevantSections(remedyId) {
  const data = scrapedMap[remedyId];
  if (!data || !data.sections) return {};
  const result = {};
  for (const [section, content] of Object.entries(data.sections)) {
    if (['Relationship', 'Dose', 'Compare'].includes(section)) continue;
    result[section] = content.toLowerCase();
  }
  return result;
}

function scoreRemedyForSymptom(remedyId, symptomId) {
  const symInfo = symptomKeywords[symptomId];
  if (!symInfo) return 0;
  
  const sections = getRelevantSections(remedyId);
  if (Object.keys(sections).length === 0) return 0;
  
  let bestScore = 0;
  
  for (const [sectionName, content] of Object.entries(sections)) {
    const chapterPrefixes = sectionToChapter[sectionName] || [];
    const symptomChapter = symInfo.chapter;
    
    let chapterMatch = false;
    for (const prefix of chapterPrefixes) {
      if (symptomChapter === prefix || symptomChapter.startsWith(prefix)) {
        chapterMatch = true;
        break;
      }
    }
    
    if (!chapterMatch) continue;
    
    const words = symInfo.words;
    if (words.length === 0) continue;
    
    let matchCount = 0;
    for (const word of words) {
      if (content.includes(word.toLowerCase())) matchCount++;
    }
    
    const ratio = matchCount / words.length;
    if (ratio >= 0.5 && matchCount >= 1) {
      const score = ratio;
      if (score > bestScore) bestScore = score;
    }
  }
  
  const data = scrapedMap[remedyId];
  if (data?.description) {
    const descLower = data.description.toLowerCase();
    const words = symInfo.words;
    let matchCount = 0;
    for (const word of words) {
      if (descLower.includes(word.toLowerCase())) matchCount++;
    }
    const ratio = matchCount / words.length;
    if (ratio >= 0.6 && matchCount >= 2) {
      const score = ratio * 0.8;
      if (score > bestScore) bestScore = score;
    }
  }
  
  return bestScore;
}

let totalAdded = 0;
const rubricKeys = Object.keys(rubrics);

for (const symptomId of rubricKeys) {
  const currentRemedies = rubrics[symptomId];
  const currentIds = new Set(currentRemedies.map(r => r.remedyId));
  
  const candidates = [];
  
  for (const remedyId of newRemedyIds) {
    if (currentIds.has(remedyId)) continue;
    
    const score = scoreRemedyForSymptom(remedyId, symptomId);
    if (score > 0) {
      candidates.push({ remedyId, score });
    }
  }
  
  candidates.sort((a, b) => b.score - a.score);
  
  const toAdd = candidates.slice(0, 5);
  
  for (const c of toAdd) {
    let grade = 1;
    if (c.score >= 0.8) grade = 3;
    else if (c.score >= 0.6) grade = 2;
    
    rubrics[symptomId].push({ remedyId: c.remedyId, grade });
    totalAdded++;
  }
}

fs.writeFileSync(rubricsPath, JSON.stringify(rubrics, null, 2));

console.log(`Total new remedy-symptom mappings added: ${totalAdded}`);
console.log(`Average per rubric: ${(totalAdded / rubricKeys.length).toFixed(1)}`);

let min = Infinity, max = 0, total = 0;
for (const k of rubricKeys) {
  const len = rubrics[k].length;
  if (len < min) min = len;
  if (len > max) max = len;
  total += len;
}
console.log(`Rubric sizes - Min: ${min}, Max: ${max}, Avg: ${(total / rubricKeys.length).toFixed(1)}`);
