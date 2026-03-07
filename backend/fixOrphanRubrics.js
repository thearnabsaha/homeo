const fs = require('fs');
const path = require('path');

const rubrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/rubrics.json'), 'utf8'));
const symptoms = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/symptoms.json'), 'utf8'));

const symptomById = new Map();
symptoms.chapters.forEach(ch => {
  symptomById.set(ch.id, ch.name);
  ch.symptoms.forEach(s => {
    symptomById.set(s.id, s.name);
    if (s.subSymptoms) s.subSymptoms.forEach(sub => symptomById.set(sub.id, sub.name));
  });
});

// Manually curated mapping: orphan key -> correct real symptom ID(s)
const orphanMap = {
  "insomnia": ["sleep-insomnia"],
  "anxiety-nervousness": ["mind-anxiety"],
  "constipation": ["rectum-constipation"],
  "cough-general": ["cough-dry", "cough-dry-constant"],
  "numbness-tingling": ["ext-numbness-hands-morning", "ext-numbness-fingers"],
  "premature-aging": ["age-premature-aging"],
  "bashfulness": ["mind-timidity"],
  "flatulence": ["abdomen-flatulence"],
  "hoarseness": ["larynx-hoarseness"],
  "joint-pain-general": ["ext-pain-joints", "ext-stiffness-morning"],
  "voice-loss": ["larynx-voice-lost"],
  "laryngitis": ["larynx-laryngitis"],
  "cartilage-inflammation": ["gen-inflammation"],
  "bruised-feeling": ["gen-injuries-bruises"],
  "joint-stiffness": ["ext-stiffness-morning"],
  "bruising": ["hema-easy-bruising"],
  "muscle-soreness": ["gen-injuries-bruises", "ext-pain"],
  "sprains-strains": ["gen-injuries-sprains"],
  "venous-congestion": ["ext-varicose-veins"],
  "swelling-general": ["ext-swelling", "ext-swelling-feet"],
  "trauma": ["ger-falls"],
  "post-surgical-pain": ["gen-injuries-wounds"],
  "glandular-swelling": ["ext-throat-swelling-glands"],
  "hearing-difficulty": ["hearing-impaired-nerve"],
  "night-sweats": ["persp-night"],
  "weakness-debility": ["gen-weakness-post-illness", "ger-debility"],
  "burning-pains": ["gen-heat-agg"],
  "old-age-complaints": ["ger-debility", "ger-memory-decline"],
  "neuritis": ["nerv-neuralgia"],
  "vision-impaired": ["vision-dim"],
  "trembling": ["gen-trembling"],
  "impotence": ["male-impotence-old-age", "sx-ed-psychogenic"],
  "mental-dullness": ["mind-dullness"],
  "chronic-fatigue": ["gen-weakness-chronic-fatigue"],
  "recurrent-infections": ["ped-recurrent-infections"],
  "perfectionism": ["mind-anxiety"],
  "sensitivity": ["mind-sensitive"],
  "desire-to-travel": ["mind-restlessness"],
  "family-history-cancer": ["gen-cancerous"],
  "deafness": ["hearing-impaired-nerve"],
  "tinnitus": ["nerv-tinnitus"],
  "worms-intestinal": ["rectum-worms"],
  "respiratory-catarrh": ["nose-coryza", "resp-asthma"],
  "buzzing-in-ears": ["ear-noises-buzzing"],
  "prostate-enlargement": ["urinary-prostate"],
  "kidney-stones": ["kidneys-stones"],
  "bladder-catarrh": ["bladder-cystitis"],
  "mucus-in-urine": ["urine-sediment-red-sand"],
  "difficulty-urinating": ["urinary-retention"],
  "enuresis-bedwetting": ["urinary-incontinence-night"],
  "bladder-irritation": ["bladder-cystitis"],
  "kidney-pain": ["kidneys-pain"],
  "frequent-urination": ["urinary-frequent"],
  "bedwetting": ["ped-bedwetting-habitual"],
  "renal-colic": ["urinary-kidney-stones-colic"],
  "urinary-obstruction": ["urinary-retention"],
  "prostate-problems": ["urinary-prostate"],
  "constant-urging": ["urinary-frequent"],
  "menorrhagia": ["female-menses-profuse"],
  "uterine-hemorrhage": ["gen-hemorrhage"],
  "nosebleed": ["nose-epistaxis-profuse"],
  "threatened-abortion": ["female-pregnancy-threatened-abortion"],
  "hemorrhage": ["chest-hemorrhage-lungs"],
  "hip-pain": ["ext-pain-hip"],
  "profuse-bleeding": ["nose-epistaxis-profuse", "female-menses-profuse"],
  "facial-neuralgia": ["face-pain-neuralgia"],
  "restless-legs": ["ext-restlessness-legs"],
  "neuralgia": ["nerv-neuralgia"],
  "hysteria": ["mind-anxiety"],
  "nervous-exhaustion": ["gen-weakness-chronic-fatigue", "mind-dullness"],
  "twitching": ["eye-twitching", "gen-trembling"],
  "liver-disorders": ["abdomen-liver", "abdomen-liver-jaundice"],
  "jaundice": ["abdomen-liver-jaundice"],
  "fever-general": ["fever-burning-heat"],
  "loss-of-appetite": ["stomach-appetite-wanting"],
  "digestive-weakness": ["stomach-indigestion-chronic", "stomach-indigestion"],
  "general-debility": ["ger-debility"],
  "bitter-taste": ["mouth-taste-bitter"],
  "diabetes": ["endo-diabetes"],
  "menstrual-irregularity": ["female-menses-irregular"],
  "excessive-thirst": ["gen-diabetes-thirst", "stomach-thirst-extreme"],
  "albuminuria": ["urinary-urine-albumin"],
  "excessive-hunger": ["stomach-appetite-ravenous"],
  "weight-loss": ["gen-emaciation"],
  "sugar-in-urine": ["urine-sugar"],
  "cardiac-weakness": ["chest-palpitation"],
  "angina-pectoris": ["chest-angina-pectoris"],
  "palpitation": ["chest-palpitation"],
  "hypertension": ["cv-hypertension-renal"],
  "breathlessness": ["resp-asthma", "resp-dyspnoea"],
  "cardiac-dropsy": ["gen-oedema-dropsical"],
  "chronic-constipation": ["rectum-constipation-chronic"],
  "eye-disorders": ["eye-inflammation-chronic"],
  "indigestion": ["stomach-indigestion-chronic"],
  "sore-throat": ["throat-pain-burning"],
  "skin-diseases": ["skin-eruptions", "skin-itching"],
  "debility": ["ger-debility"],
  "weakness-after-illness": ["gen-weakness-post-illness"],
  "poor-concentration": ["mind-concentration"],
  "low-libido": ["sx-low-libido"],
  "excessive-urination": ["urinary-frequent"],
  "old-ulcers": ["skin-ulcers"],
  "prickly-heat": ["skin-eruptions-rash"],
  "chronic-fever": ["fever-intermittent"],
  "low-immunity": ["immune-low-immunity"],
  "general-weakness": ["gen-weakness-post-illness", "ger-debility"],
  "gout": ["ext-gout"],
  "digestive-complaints": ["stomach-indigestion-chronic"],
  "liver-enlargement": ["abdomen-liver"],
  "inflammation": ["throat-inflammation", "gen-inflammation"],
  "digestive-disorders": ["stomach-indigestion-chronic"],
  "wounds": ["gen-injuries-wounds"],
  "bronchitis": ["chest-bronchitis"],
  "asthma": ["resp-asthma"],
  "spasmodic-cough": ["cough-spasmodic"],
  "chest-congestion": ["chest-oppression"],
  "whooping-cough": ["cough-spasmodic-whooping"],
  "hemoptysis": ["chest-hemorrhage-lungs"],
  "chronic-diarrhea": ["rectum-diarrhoea-chronic"],
  "dysentery": ["rectum-diarrhoea-bloody"],
  "mucous-colitis": ["abdomen-pain-cramping"],
  "hemorrhoids": ["rectum-hemorrhoids"],
  "intestinal-catarrh": ["abdomen-pain-cramping", "rectum-diarrhoea-chronic"],
};

// Validate all target IDs exist
let errors = 0;
for (const [orphan, targets] of Object.entries(orphanMap)) {
  for (const t of targets) {
    if (!symptomById.has(t)) {
      console.log('WARNING: target ' + t + ' for orphan ' + orphan + ' does not exist');
      errors++;
    }
  }
}

// Check which orphans are not mapped
const unmapped = [];
for (const symId of Object.keys(rubrics)) {
  if (!symptomById.has(symId) && !orphanMap[symId]) {
    unmapped.push(symId);
  }
}
if (unmapped.length > 0) {
  console.log('UNMAPPED orphans: ' + unmapped.join(', '));
  errors += unmapped.length;
}

if (errors > 0) {
  console.log('ERRORS found: ' + errors + '. Fix them before proceeding.');
  process.exit(1);
}

// Apply: move remedies from orphan keys to real symptom IDs
let moved = 0;
let deleted = 0;
for (const [orphan, targets] of Object.entries(orphanMap)) {
  const orphanEntries = rubrics[orphan];
  if (!orphanEntries || !Array.isArray(orphanEntries)) continue;

  for (const target of targets) {
    if (!rubrics[target]) rubrics[target] = [];
    
    for (const entry of orphanEntries) {
      const exists = rubrics[target].some(e => e.remedyId === entry.remedyId);
      if (!exists) {
        rubrics[target].push({ remedyId: entry.remedyId, grade: entry.grade });
        moved++;
      }
    }
  }

  delete rubrics[orphan];
  deleted++;
}

console.log('Moved ' + moved + ' remedy mappings to correct symptom IDs');
console.log('Deleted ' + deleted + ' orphan keys');

// Verify: no more orphans
let remaining = 0;
for (const symId of Object.keys(rubrics)) {
  if (!symptomById.has(symId)) remaining++;
}
console.log('Remaining orphan keys: ' + remaining);

const outPath = path.join(__dirname, 'data/rubrics.json');
fs.writeFileSync(outPath, JSON.stringify(rubrics, null, 2));

const frontendPath = path.join(__dirname, '../frontend/src/data/rubrics.json');
fs.writeFileSync(frontendPath, JSON.stringify(rubrics, null, 2));
console.log('Saved to both backend and frontend');
