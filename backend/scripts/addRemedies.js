const fs = require('fs');
const path = require('path');

const remediesPath = path.join(__dirname, '..', 'data', 'remedies.json');
const scrapedPath = path.join(__dirname, 'scrapedRemedies.json');
const symptomsPath = path.join(__dirname, '..', 'data', 'symptoms.json');

const remediesData = JSON.parse(fs.readFileSync(remediesPath, 'utf8'));
const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));
const symptoms = JSON.parse(fs.readFileSync(symptomsPath, 'utf8'));

const existingIds = new Set(remediesData.remedies.map(r => r.id));

const allSymptomIds = [];
for (const ch of symptoms.chapters) {
  for (const s of (ch.symptoms || [])) {
    allSymptomIds.push(s.id);
  }
}

const sectionToChapterMap = {
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
  'Fever': ['fever', 'general'],
  'Sleep': ['sleep', 'nervous-system'],
  'Generalities': ['general', 'endocrine'],
};

function mapSectionsToSymptoms(sections) {
  const matched = new Set();
  
  for (const [sectionName, content] of Object.entries(sections)) {
    if (['Relationship', 'Dose', 'Modalities', 'Compare'].includes(sectionName)) continue;
    
    const chapterPrefixes = sectionToChapterMap[sectionName] || [];
    
    for (const symptomId of allSymptomIds) {
      const parts = symptomId.split('-');
      const chapterPart = parts[0];
      
      if (chapterPrefixes.some(p => chapterPart === p || chapterPart.startsWith(p))) {
        const contentLower = (content || '').toLowerCase();
        const symptomWords = parts.slice(1).filter(w => w.length > 2);
        
        const matchCount = symptomWords.filter(w => contentLower.includes(w)).length;
        if (matchCount >= Math.max(1, Math.floor(symptomWords.length * 0.5))) {
          matched.add(symptomId);
        }
      }
    }
  }
  
  return [...matched].slice(0, 20);
}

let added = 0;
for (const r of scraped) {
  if (existingIds.has(r.id)) continue;
  
  let desc = r.description || `${r.name} - Boericke's Materia Medica remedy.`;
  desc = desc.replace(/\u00e9/g, 'e').replace(/\u0153/g, 'oe').replace(/[\u0080-\u009f]/g, '');
  
  let dosage = (r.dosage || 'Third to thirtieth potency.').replace(/^-\s*/, '');
  dosage = dosage.replace(/\u00e9/g, 'e').replace(/\u0153/g, 'oe').replace(/[\u0080-\u009f]/g, '');
  
  const worse = (r.modalities?.worse || []).map(s => s.replace(/[\u0080-\u009f]/g, ''));
  const better = (r.modalities?.better || []).map(s => s.replace(/[\u0080-\u009f]/g, ''));
  
  if (worse.length === 0 && r.sections?.Modalities) {
    const modText = r.sections.Modalities;
    const wm = modText.match(/Worse[,;:\s]+([^.]*?)(?:\.\s*Better|$)/i);
    const bm = modText.match(/Better[,;:\s]+([^.]*)/i);
    if (wm) worse.push(...wm[1].split(/[;,]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 80).slice(0, 8));
    if (bm) better.push(...bm[1].split(/[;,]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 80).slice(0, 8));
  }
  
  const commonSymptoms = mapSectionsToSymptoms(r.sections || {});
  
  const abbrFormatted = r.abbr.charAt(0) + r.abbr.slice(1).toLowerCase().replace(/-([a-z])/g, (m, c) => '-' + c) + '.';
  
  remediesData.remedies.push({
    id: r.id,
    name: r.name,
    abbr: abbrFormatted,
    description: desc,
    dosage,
    commonSymptoms,
    modalities: { worse, better },
  });
  
  added++;
}

fs.writeFileSync(remediesPath, JSON.stringify(remediesData, null, 2));
console.log(`Added ${added} new remedies. Total: ${remediesData.remedies.length}`);

const withSymptoms = remediesData.remedies.filter(r => r.commonSymptoms?.length > 0).length;
console.log(`Remedies with symptom mappings: ${withSymptoms}`);
