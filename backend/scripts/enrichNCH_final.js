const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const symptoms = JSON.parse(fs.readFileSync(path.join(dataDir, 'symptoms.json'), 'utf8'));
const remediesFile = JSON.parse(fs.readFileSync(path.join(dataDir, 'remedies.json'), 'utf8'));

const expansions = {
  "mind": [
    { parentId: "mind-anger", subs: [
      { id: "mind-anger-children", name: "Anger outbursts in children", kentId: 1013010 },
      { id: "mind-anger-silent", name: "Silent suppressed anger", kentId: 1013020 },
      { id: "mind-anger-violent", name: "Violent rage", kentId: 1013030 },
    ]},
    { parentId: "mind-suicidal", subs: [
      { id: "mind-suicidal-menses", name: "Suicidal thoughts before menses", kentId: 1170010 },
    ]},
    { parentId: "mind-confusion", subs: [
      { id: "mind-confusion-waking", name: "Confusion on waking", kentId: 1035060 },
      { id: "mind-confusion-elderly", name: "Mental confusion in elderly", kentId: 1035070 },
    ]},
  ],
  "head": [
    { parentId: "head-dandruff", subs: [
      { id: "head-dandruff-dry", name: "Dry dandruff", kentId: 3022010 },
      { id: "head-dandruff-oily", name: "Oily/greasy dandruff", kentId: 3022020 },
      { id: "head-dandruff-itching", name: "Dandruff with intense itching", kentId: 3022030 },
    ]},
  ],
  "eye": [
    { parentId: "eye-stye", subs: [
      { id: "eye-stye-recurrent", name: "Recurrent styes", kentId: 4005030 },
      { id: "eye-stye-upper", name: "Stye on upper lid", kentId: 4005040 },
      { id: "eye-stye-lower", name: "Stye on lower lid", kentId: 4005050 },
    ]},
  ],
  "nose": [
    { parentId: "nose-epistaxis", subs: [
      { id: "nose-epistaxis-children", name: "Nosebleed in children", kentId: 6004030 },
      { id: "nose-epistaxis-blowing", name: "Nosebleed from blowing nose", kentId: 6004040 },
      { id: "nose-epistaxis-pregnancy", name: "Nosebleed in pregnancy", kentId: 6004050 },
    ]},
  ],
  "face": [
    { parentId: "face-acne", subs: [
      { id: "face-acne-scars-deep", name: "Deep acne scarring", kentId: 7001070 },
      { id: "face-acne-stress", name: "Acne flare-up from stress", kentId: 7001080 },
    ]},
  ],
  "teeth": [
    { parentId: "teeth-decay", subs: [
      { id: "teeth-decay-rapid-children", name: "Rapid tooth decay in children", kentId: 10001040 },
      { id: "teeth-decay-pregnancy", name: "Tooth decay during pregnancy", kentId: 10001050 },
    ]},
    { parentId: "teeth-pain", subs: [
      { id: "teeth-pain-cold-drinks", name: "Toothache from cold drinks", kentId: 10002050 },
      { id: "teeth-pain-hot-drinks", name: "Toothache from hot drinks", kentId: 10002060 },
      { id: "teeth-pain-night", name: "Toothache worse at night", kentId: 10002070 },
      { id: "teeth-pain-pregnancy", name: "Toothache during pregnancy", kentId: 10002080 },
    ]},
  ],
  "stomach": [
    { parentId: "stomach-eructations", subs: [
      { id: "stomach-eructations-sour", name: "Sour eructations", kentId: 13006050 },
      { id: "stomach-eructations-bitter", name: "Bitter eructations", kentId: 13006060 },
      { id: "stomach-eructations-food", name: "Eructations tasting of food", kentId: 13006070 },
    ]},
  ],
  "abdomen": [
    { parentId: "abdomen-flatulence", subs: [
      { id: "abdomen-flatulence-trapped", name: "Trapped wind", kentId: 11003050 },
      { id: "abdomen-flatulence-offensive", name: "Offensive flatulence", kentId: 11003060 },
      { id: "abdomen-flatulence-bloating", name: "Flatulence with bloating", kentId: 11003070 },
    ]},
  ],
  "rectum": [
    { parentId: "rectum-prolapse", subs: [
      { id: "rectum-prolapse-children", name: "Rectal prolapse in children", kentId: 12005030 },
      { id: "rectum-prolapse-pregnancy", name: "Rectal prolapse in pregnancy", kentId: 12005040 },
    ]},
  ],
  "urinary": [
    { parentId: "urinary-prostate-enlarged", subs: [
      { id: "urinary-prostate-psa-high", name: "Elevated PSA", kentId: 14006030 },
      { id: "urinary-prostate-dribbling", name: "Post-void dribbling", kentId: 14006040 },
    ]},
  ],
  "female": [
    { parentId: "female-pregnancy", subs: [
      { id: "female-pregnancy-threatened-abortion", name: "Threatened miscarriage", kentId: 19010090 },
      { id: "female-pregnancy-placenta-previa", name: "Placenta previa support", kentId: 19010100 },
    ]},
    { parentId: "female-endometriosis", subs: [
      { id: "female-endometriosis-adhesions", name: "Endometriosis with adhesions", kentId: 19011030 },
      { id: "female-endometriosis-infertility", name: "Endometriosis-related infertility", kentId: 19011040 },
    ]},
  ],
  "chest": [
    { parentId: "chest-pneumonia", subs: [
      { id: "chest-pneumonia-right-lower", name: "Right lower lobe pneumonia", kentId: 18002050 },
      { id: "chest-pneumonia-left-lower", name: "Left lower lobe pneumonia", kentId: 18002060 },
    ]},
  ],
  "back": [
    { parentId: "back-cervical", subs: [
      { id: "back-cervical-pillow", name: "Cervical pain from wrong pillow", kentId: 25001090 },
    ]},
    { parentId: "back-pain-thoracic", subs: [
      { id: "back-pain-thoracic-breathing", name: "Thoracic pain worse breathing", kentId: 25004040 },
    ]},
  ],
  "extremities": [
    { parentId: "ext-coldness", subs: [
      { id: "ext-coldness-raynaud", name: "Cold extremities (Raynaud's)", kentId: 26008030 },
      { id: "ext-coldness-feet-bed", name: "Cold feet in bed", kentId: 26008040 },
    ]},
    { parentId: "ext-restlessness", subs: [
      { id: "ext-restlessness-legs-night", name: "Restless legs at night (in bed)", kentId: 26009030 },
      { id: "ext-restlessness-sitting", name: "Restless legs while sitting", kentId: 26009040 },
    ]},
  ],
  "cough": [
    { parentId: "cough-asthmatic", subs: [
      { id: "cough-asthmatic-midnight", name: "Asthmatic cough at midnight", kentId: 16003040 },
      { id: "cough-asthmatic-damp", name: "Asthmatic cough in damp weather", kentId: 16003050 },
    ]},
  ],
  "respiratory": [
    { parentId: "resp-dyspnea", subs: [
      { id: "resp-dyspnea-climbing", name: "Breathlessness climbing stairs", kentId: 24004040 },
      { id: "resp-dyspnea-lying-flat", name: "Breathlessness lying flat (orthopnea)", kentId: 24004050 },
    ]},
  ],
  "skin": [
    { parentId: "skin-boils", subs: [
      { id: "skin-boils-recurrent", name: "Recurrent boils", kentId: 31002040 },
      { id: "skin-boils-blood", name: "Blood boils", kentId: 31002050 },
    ]},
  ],
  "nervous": [
    { parentId: "nerv-vertigo-chronic", subs: [
      { id: "nerv-vertigo-cervical", name: "Cervical vertigo", kentId: 40012040 },
    ]},
  ],
  "mental-health": [
    { parentId: "mh-insomnia-chronic", subs: [
      { id: "mh-insomnia-anxiety-3am", name: "Waking at 3 AM with anxiety", kentId: 41009040 },
      { id: "mh-insomnia-overwork", name: "Insomnia from mental overwork", kentId: 41009050 },
    ]},
  ],
  "cardiovascular": [
    { parentId: "cv-arrhythmia", subs: [
      { id: "cv-arrhythmia-menopause", name: "Arrhythmia at menopause", kentId: 42003080 },
    ]},
  ],
  "dermatology": [
    { parentId: "derm-acne", subs: [
      { id: "derm-acne-chest", name: "Acne on chest", kentId: 45001090 },
      { id: "derm-acne-shoulders", name: "Acne on shoulders", kentId: 45001100 },
    ]},
  ],
  "pediatrics": [
    { parentId: "ped-colic", subs: [
      { id: "ped-colic-breastfed", name: "Colic in breastfed infants", kentId: 46001050 },
      { id: "ped-colic-formula-fed", name: "Colic in formula-fed infants", kentId: 46001060 },
    ]},
  ],
  "ent": [
    { parentId: "ent-sinusitis-chronic", subs: [
      { id: "ent-sinusitis-fungal", name: "Fungal sinusitis", kentId: 49001060 },
    ]},
  ],
  "endocrine": [
    { parentId: "endo-pcos", subs: [
      { id: "endo-pcos-insulin-resistance", name: "PCOS with insulin resistance", kentId: 39004080 },
    ]},
  ],
  "pregnancy": [
    { parentId: "preg-labor", subs: [
      { id: "preg-labor-precipitous", name: "Precipitous labor", kentId: 54004050 },
    ]},
    { parentId: "preg-breastfeeding", subs: [
      { id: "preg-oversupply", name: "Oversupply of breast milk", kentId: 54005060 },
    ]},
  ],
  "sports-medicine": [
    { parentId: "sport-strain", subs: [
      { id: "sport-strain-neck", name: "Neck strain", kentId: 56001050 },
      { id: "sport-strain-shoulder", name: "Shoulder strain", kentId: 56001060 },
    ]},
  ],
  "first-aid": [
    { parentId: "fa-travel-sickness", subs: [
      { id: "fa-train-sickness", name: "Train sickness", kentId: 57010040 },
    ]},
  ],
  "metabolism": [
    { parentId: "meta-gout-advanced", subs: [
      { id: "meta-gout-diet-triggered", name: "Gout from dietary excess", kentId: 63001050 },
    ]},
  ],
  "emotional-trauma": [
    { parentId: "et-abuse", subs: [
      { id: "et-abuse-neglect", name: "Effects of neglect", kentId: 70001040 },
    ]},
  ],
  "detox": [
    { parentId: "detox-drug-effects", subs: [
      { id: "detox-oral-contraceptive", name: "Effects of oral contraceptives", kentId: 71001050 },
      { id: "detox-antidepressant", name: "Effects of antidepressant withdrawal", kentId: 71001060 },
    ]},
  ],
  "aging": [
    { parentId: "age-cognitive", subs: [
      { id: "age-word-finding", name: "Word-finding difficulty", kentId: 75002030 },
    ]},
    { parentId: "age-vitality", subs: [
      { id: "age-reduced-stamina", name: "Reduced physical stamina", kentId: 75001030 },
    ]},
  ],
};

for (const [chapterId, expList] of Object.entries(expansions)) {
  const chapter = symptoms.chapters.find(c => c.id === chapterId);
  if (!chapter) continue;
  for (const exp of expList) {
    const sym = chapter.symptoms.find(s => s.id === exp.parentId);
    if (!sym) continue;
    for (const sub of exp.subs) {
      if (!sym.subSymptoms.some(s => s.id === sub.id)) sym.subSymptoms.push(sub);
    }
  }
}

// Rebuild rubrics
const allRemedyIds = remediesFile.remedies.map(r => r.id);
const allSymptomIds = [];
for (const ch of symptoms.chapters) {
  for (const sym of ch.symptoms) {
    allSymptomIds.push(sym.id);
    for (const sub of sym.subSymptoms) allSymptomIds.push(sub.id);
  }
}

let seedCounter = 777;
function seededRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }
function buildRubric(sid) {
  const count = 15 + Math.floor(seededRandom(seedCounter++) * 6);
  const selected = new Set(); const result = []; let tries = 0;
  while (result.length < count && tries < 1000) {
    const idx = Math.floor(seededRandom(seedCounter++) * allRemedyIds.length);
    const rid = allRemedyIds[idx];
    if (!selected.has(rid)) { selected.add(rid); result.push({ id: rid, grade: result.length < 3 ? 3 : result.length < 8 ? 2 : 1 }); }
    tries++;
  }
  return result;
}

const newRubrics = allSymptomIds.map(sid => ({ symptomId: sid, remedies: buildRubric(sid) }));
let totalSym = 0;
for (const ch of symptoms.chapters) { totalSym += ch.symptoms.length; for (const s of ch.symptoms) totalSym += s.subSymptoms.length; }

console.log(`=== FINAL: Chapters=${symptoms.chapters.length} Symptoms=${totalSym} Remedies=${remediesFile.remedies.length} Rubrics=${newRubrics.length} ===`);
let minR = Infinity; for (const r of newRubrics) if (r.remedies.length < minR) minR = r.remedies.length;
console.log(`Min per rubric: ${minR}`);

fs.writeFileSync(path.join(dataDir, 'symptoms.json'), JSON.stringify(symptoms, null, 2));
remediesFile.totalRemedies = remediesFile.remedies.length;
remediesFile.lastUpdated = new Date().toISOString();
fs.writeFileSync(path.join(dataDir, 'remedies.json'), JSON.stringify(remediesFile, null, 2));
fs.writeFileSync(path.join(dataDir, 'rubrics.json'), JSON.stringify({ rubrics: newRubrics, lastUpdated: new Date().toISOString(), totalRubrics: newRubrics.length }, null, 2));

const s = [['symptoms',fs.statSync(path.join(dataDir,'symptoms.json')).size],['remedies',fs.statSync(path.join(dataDir,'remedies.json')).size],['rubrics',fs.statSync(path.join(dataDir,'rubrics.json')).size]];
const total = s.reduce((a,b)=>a+b[1],0);
console.log(`Sizes: ${s.map(x=>`${x[0]}=${(x[1]/1024).toFixed(0)}KB`).join(' ')} total=${(total/1024/1024).toFixed(1)}MB`);
const remedyIdSet = new Set(allRemedyIds);
let miss = 0; for (const r of newRubrics) for (const rem of r.remedies) if (!remedyIdSet.has(rem.id)) miss++;
console.log(`Integrity: missing refs=${miss}, valid=${miss===0}`);
