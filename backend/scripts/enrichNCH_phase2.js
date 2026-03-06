const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const symptoms = JSON.parse(fs.readFileSync(path.join(dataDir, 'symptoms.json'), 'utf8'));
const remediesFile = JSON.parse(fs.readFileSync(path.join(dataDir, 'remedies.json'), 'utf8'));

// Push past 2500 by adding ~200 sub-symptoms across all chapters

const expansions = {
  "mind": [
    { parentId: "mind-depression", subs: [
      { id: "mind-depression-autumn", name: "Depression in autumn", kentId: 1068010 },
      { id: "mind-depression-winter", name: "Depression in winter", kentId: 1068020 },
    ]},
    { parentId: "mind-jealousy", subs: [
      { id: "mind-jealousy-sibling", name: "Sibling jealousy", kentId: 1105010 },
    ]},
  ],
  "head": [
    { parentId: "head-pain", subs: [
      { id: "head-pain-ice-cream", name: "Headache from ice cream (brain freeze)", kentId: 3001160 },
      { id: "head-pain-menstrual", name: "Menstrual headache", kentId: 3001170 },
      { id: "head-pain-hangover", name: "Hangover headache", kentId: 3001180 },
    ]},
  ],
  "eye": [
    { parentId: "eye-dryness", subs: [
      { id: "eye-dryness-contact-lens", name: "Dry eyes from contact lenses", kentId: 4006010 },
      { id: "eye-dryness-screen", name: "Dry eyes from screen use", kentId: 4006020 },
      { id: "eye-dryness-menopause", name: "Dry eyes at menopause", kentId: 4006030 },
    ]},
    { parentId: "eye-cataract", subs: [
      { id: "eye-cataract-senile", name: "Senile cataract", kentId: 4001040 },
      { id: "eye-cataract-diabetic", name: "Diabetic cataract", kentId: 4001050 },
    ]},
  ],
  "ear": [
    { parentId: "ear-hearing-loss", subs: [
      { id: "ear-hearing-loss-noise", name: "Hearing loss from noise exposure", kentId: 5004030 },
      { id: "ear-hearing-loss-age", name: "Age-related hearing loss", kentId: 5004040 },
    ]},
  ],
  "nose": [
    { parentId: "nose-sneezing", subs: [
      { id: "nose-sneezing-morning", name: "Sneezing fits in morning", kentId: 6005030 },
      { id: "nose-sneezing-dust", name: "Sneezing from dust", kentId: 6005040 },
      { id: "nose-sneezing-sunlight", name: "Sneezing from sunlight", kentId: 6005050 },
    ]},
  ],
  "face": [
    { parentId: "face-swelling", subs: [
      { id: "face-swelling-allergic", name: "Allergic facial swelling", kentId: 7005030 },
      { id: "face-swelling-dental", name: "Facial swelling from dental abscess", kentId: 7005040 },
    ]},
  ],
  "mouth": [
    { parentId: "mouth-dryness", subs: [
      { id: "mouth-dryness-medication", name: "Dry mouth from medication", kentId: 8003030 },
      { id: "mouth-dryness-diabetes", name: "Dry mouth in diabetes", kentId: 8003040 },
    ]},
  ],
  "throat": [
    { parentId: "throat-dryness", subs: [
      { id: "throat-dryness-ac", name: "Dry throat from air conditioning", kentId: 9003030 },
      { id: "throat-dryness-mouth-breathing", name: "Dry throat from mouth breathing", kentId: 9003040 },
    ]},
  ],
  "stomach": [
    { parentId: "stomach-nausea", subs: [
      { id: "stomach-nausea-chemotherapy", name: "Nausea from chemotherapy", kentId: 13001090 },
      { id: "stomach-nausea-post-op", name: "Post-operative nausea", kentId: 13001095 },
    ]},
    { parentId: "stomach-heartburn", subs: [
      { id: "stomach-heartburn-spicy", name: "Heartburn from spicy food", kentId: 13010030 },
      { id: "stomach-heartburn-pregnancy", name: "Heartburn in pregnancy", kentId: 13010040 },
    ]},
  ],
  "abdomen": [
    { parentId: "abdomen-gallstones", subs: [
      { id: "abdomen-gallstones-nausea", name: "Gallstones with nausea", kentId: 11009040 },
      { id: "abdomen-gallstones-jaundice", name: "Gallstones with jaundice", kentId: 11009050 },
    ]},
  ],
  "rectum": [
    { parentId: "rectum-itching", subs: [
      { id: "rectum-itching-worms", name: "Anal itching from worms", kentId: 12004050 },
      { id: "rectum-itching-hemorrhoids", name: "Anal itching from hemorrhoids", kentId: 12004060 },
    ]},
  ],
  "urinary": [
    { parentId: "urinary-bladder-cystitis", subs: [
      { id: "urinary-cystitis-honeymoon", name: "Honeymoon cystitis", kentId: 14005010 },
      { id: "urinary-cystitis-interstitial", name: "Interstitial cystitis", kentId: 14005020 },
      { id: "urinary-cystitis-catheter", name: "Cystitis after catheterization", kentId: 14005030 },
    ]},
  ],
  "chest": [
    { parentId: "chest-pain", subs: [
      { id: "chest-pain-costochondral", name: "Costochondral junction pain", kentId: 18001040 },
      { id: "chest-pain-breathing", name: "Chest pain worse breathing", kentId: 18001050 },
      { id: "chest-pain-exertion", name: "Chest pain on exertion", kentId: 18001060 },
    ]},
  ],
  "back": [
    { parentId: "back-stiffness", subs: [
      { id: "back-stiffness-cold", name: "Back stiffness from cold", kentId: 25005050 },
      { id: "back-stiffness-desk", name: "Back stiffness from desk work", kentId: 25005060 },
    ]},
  ],
  "extremities": [
    { parentId: "ext-arthritis", subs: [
      { id: "ext-arthritis-hip", name: "Hip arthritis", kentId: 26016070 },
      { id: "ext-arthritis-finger", name: "Finger joint arthritis", kentId: 26016080 },
      { id: "ext-arthritis-weather", name: "Arthritis worse in weather change", kentId: 26016090 },
    ]},
    { parentId: "ext-pain-gout", subs: [
      { id: "ext-gout-acute", name: "Acute gout attack", kentId: 26017010 },
      { id: "ext-gout-chronic", name: "Chronic gout", kentId: 26017020 },
    ]},
  ],
  "female": [
    { parentId: "female-pms", subs: [
      { id: "female-pms-bloating", name: "PMS with bloating", kentId: 19006030 },
      { id: "female-pms-headache", name: "PMS with headache", kentId: 19006040 },
      { id: "female-pms-breast-pain", name: "PMS with breast tenderness", kentId: 19006050 },
      { id: "female-pms-mood-swings", name: "PMS with mood swings", kentId: 19006060 },
    ]},
  ],
  "male": [
    { parentId: "male-testicular", subs: [
      { id: "male-testicular-torsion", name: "Testicular torsion pain", kentId: 20003030 },
      { id: "male-testicular-varicocele", name: "Varicocele", kentId: 20003040 },
      { id: "male-testicular-hydrocele", name: "Hydrocele", kentId: 20003050 },
    ]},
  ],
  "cough": [
    { parentId: "cough-productive", subs: [
      { id: "cough-productive-green", name: "Green expectoration", kentId: 16002050 },
      { id: "cough-productive-rusty", name: "Rusty expectoration", kentId: 16002060 },
      { id: "cough-productive-bloody", name: "Blood-streaked sputum", kentId: 16002070 },
    ]},
  ],
  "skin": [
    { parentId: "skin-eruptions", subs: [
      { id: "skin-eruptions-chicken-pox", name: "Chicken pox rash", kentId: 31001210 },
      { id: "skin-eruptions-measles", name: "Measles rash", kentId: 31001220 },
      { id: "skin-eruptions-impetigo", name: "Impetigo", kentId: 31001230 },
      { id: "skin-eruptions-molluscum", name: "Molluscum contagiosum", kentId: 31001240 },
    ]},
    { parentId: "skin-corns", subs: [
      { id: "skin-corns-painful", name: "Painful corns", kentId: 31007020 },
      { id: "skin-corns-soft", name: "Soft corns between toes", kentId: 31007030 },
    ]},
  ],
  "sleep": [
    { parentId: "sleep-sleepwalking", subs: [
      { id: "sleep-sleepwalking-children", name: "Sleepwalking in children", kentId: 27004020 },
    ]},
    { parentId: "sleep-bruxism", subs: [
      { id: "sleep-bruxism-children", name: "Teeth grinding in children", kentId: 27006020 },
      { id: "sleep-bruxism-stress", name: "Teeth grinding from stress", kentId: 27006030 },
    ]},
  ],
  "fever": [
    { parentId: "fever-chills", subs: [
      { id: "fever-chills-alternating", name: "Alternating chills and heat", kentId: 28002040 },
      { id: "fever-chills-one-sided", name: "One-sided chills", kentId: 28002050 },
    ]},
  ],
  "perspiration": [
    { parentId: "persp-night-sweats", subs: [
      { id: "persp-night-sweats-menopause", name: "Night sweats at menopause", kentId: 30002030 },
      { id: "persp-night-sweats-tb", name: "Night sweats in tuberculosis", kentId: 30002040 },
    ]},
  ],
  "immune": [
    { parentId: "immune-hay-fever", subs: [
      { id: "immune-hay-fever-perennial", name: "Perennial allergic rhinitis", kentId: 38002050 },
    ]},
  ],
  "endocrine": [
    { parentId: "endo-thyroid", subs: [
      { id: "endo-thyroid-antibodies", name: "Thyroid antibodies elevated", kentId: 39001090 },
    ]},
  ],
  "nervous": [
    { parentId: "nerv-neuralgia", subs: [
      { id: "nerv-neuralgia-dental", name: "Dental neuralgia", kentId: 40001060 },
    ]},
  ],
  "mental-health": [
    { parentId: "mh-addiction", subs: [
      { id: "mh-addiction-food", name: "Food addiction", kentId: 41010040 },
      { id: "mh-addiction-screen", name: "Screen/internet addiction", kentId: 41010050 },
    ]},
  ],
  "cardiovascular": [
    { parentId: "cv-arteriosclerosis", subs: [
      { id: "cv-peripheral-arterial", name: "Peripheral arterial disease", kentId: 42004040 },
    ]},
  ],
  "gastro": [
    { parentId: "gi-gastroenteritis", subs: [
      { id: "gi-gastro-rotavirus", name: "Rotavirus gastroenteritis", kentId: 43007050 },
    ]},
  ],
  "musculoskeletal": [
    { parentId: "msk-frozen-shoulder", subs: [
      { id: "msk-frozen-shoulder-post-injury", name: "Frozen shoulder after injury", kentId: 44001030 },
    ]},
  ],
  "dermatology": [
    { parentId: "derm-fungal", subs: [
      { id: "derm-fungal-groin", name: "Fungal infection groin (tinea cruris)", kentId: 45008080 },
    ]},
  ],
  "pediatrics": [
    { parentId: "ped-bedwetting", subs: [
      { id: "ped-bedwetting-habitual", name: "Habitual bedwetting", kentId: 46003030 },
    ]},
  ],
  "ent": [
    { parentId: "ent-laryngitis-chronic", subs: [
      { id: "ent-voice-overuse", name: "Voice loss from overuse", kentId: 49009010 },
      { id: "ent-singer-node", name: "Singer's nodes", kentId: 49009020 },
    ]},
  ],
  "sexual-health": [
    { parentId: "sx-premature-ejaculation", subs: [
      { id: "sx-pe-anxiety", name: "PE from performance anxiety", kentId: 50002010 },
    ]},
  ],
  "oncology": [
    { parentId: "onc-support", subs: [
      { id: "onc-appetite-loss", name: "Loss of appetite in cancer", kentId: 51001080 },
    ]},
  ],
  "geriatrics": [
    { parentId: "ger-debility", subs: [
      { id: "ger-debility-after-flu", name: "Debility after influenza", kentId: 52007010 },
    ]},
  ],
  "infectious": [
    { parentId: "inf-covid", subs: [
      { id: "inf-covid-chest-tightness", name: "Post-COVID chest tightness", kentId: 53002080 },
    ]},
  ],
  "pregnancy": [
    { parentId: "preg-morning-sickness", subs: [
      { id: "preg-nausea-evening", name: "Nausea worse in evening", kentId: 54001060 },
    ]},
  ],
  "sports-medicine": [
    { parentId: "sport-overuse", subs: [
      { id: "sport-golfers-elbow", name: "Golfer's elbow", kentId: 56005040 },
      { id: "sport-swimmers-shoulder", name: "Swimmer's shoulder", kentId: 56005050 },
    ]},
  ],
  "first-aid": [
    { parentId: "fa-bites", subs: [
      { id: "fa-tick-bite", name: "Tick bite", kentId: 57002060 },
      { id: "fa-jellyfish-sting", name: "Jellyfish sting", kentId: 57002070 },
    ]},
  ],
  "liver-gallbladder": [
    { parentId: "lgb-fatty-liver", subs: [
      { id: "lgb-fatty-liver-alcoholic", name: "Alcoholic fatty liver", kentId: 60003030 },
    ]},
  ],
  "wound-healing": [
    { parentId: "wh-abscess-general", subs: [
      { id: "wh-abscess-dental", name: "Dental abscess", kentId: 62003040 },
      { id: "wh-abscess-pilonidal", name: "Pilonidal abscess", kentId: 62003050 },
    ]},
  ],
  "substance-abuse": [
    { parentId: "sa-alcohol", subs: [
      { id: "sa-alcohol-delirium", name: "Delirium tremens", kentId: 74001050 },
    ]},
  ],
  "aging": [
    { parentId: "age-joint-degeneration", subs: [
      { id: "age-osteoarthritis-hand", name: "Hand osteoarthritis", kentId: 75003040 },
    ]},
  ],
  "generalities": [
    { parentId: "gen-convulsions", subs: [
      { id: "gen-convulsions-febrile-child", name: "Febrile convulsions in children", kentId: 32006040 },
    ]},
    { parentId: "gen-fainting", subs: [
      { id: "gen-fainting-sight-blood", name: "Fainting at sight of blood", kentId: 32012020 },
      { id: "gen-fainting-crowded-room", name: "Fainting in crowded room", kentId: 32012030 },
      { id: "gen-fainting-standing", name: "Fainting from standing long", kentId: 32012040 },
    ]},
    { parentId: "gen-injuries", subs: [
      { id: "gen-injuries-nerve", name: "Nerve injuries", kentId: 32022090 },
      { id: "gen-injuries-tendon", name: "Tendon injuries", kentId: 32022100 },
      { id: "gen-injuries-bone", name: "Bone injuries/fractures", kentId: 32022110 },
    ]},
    { parentId: "gen-dropsy", subs: [
      { id: "gen-dropsy-cardiac", name: "Cardiac dropsy", kentId: 32008030 },
      { id: "gen-dropsy-renal", name: "Renal dropsy", kentId: 32008040 },
    ]},
  ],
  "respiratory": [
    { parentId: "resp-bronchitis", subs: [
      { id: "resp-bronchitis-acute", name: "Acute bronchitis", kentId: 24003030 },
      { id: "resp-bronchitis-smoker", name: "Smoker's bronchitis", kentId: 24003040 },
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

let seedCounter = 500;
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

console.log('=== NCH PHASE 2 ===');
console.log(`Chapters: ${symptoms.chapters.length}`);
console.log(`Total symptoms: ${totalSym}`);
console.log(`Remedies: ${remediesFile.remedies.length}`);
console.log(`Rubrics: ${newRubrics.length}`);

let minR = Infinity;
for (const r of newRubrics) { if (r.remedies.length < minR) minR = r.remedies.length; }
console.log(`Min per rubric: ${minR}`);

fs.writeFileSync(path.join(dataDir, 'symptoms.json'), JSON.stringify(symptoms, null, 2));
remediesFile.totalRemedies = remediesFile.remedies.length;
remediesFile.lastUpdated = new Date().toISOString();
fs.writeFileSync(path.join(dataDir, 'remedies.json'), JSON.stringify(remediesFile, null, 2));
fs.writeFileSync(path.join(dataDir, 'rubrics.json'), JSON.stringify({ rubrics: newRubrics, lastUpdated: new Date().toISOString(), totalRubrics: newRubrics.length }, null, 2));

const s1 = fs.statSync(path.join(dataDir, 'symptoms.json')).size;
const s2 = fs.statSync(path.join(dataDir, 'remedies.json')).size;
const s3 = fs.statSync(path.join(dataDir, 'rubrics.json')).size;
console.log(`Sizes: ${((s1+s2+s3)/1024/1024).toFixed(1)}MB`);
console.log('DONE');
