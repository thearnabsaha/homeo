/**
 * Fix second wave of over-represented remedies:
 * Bry (1098), Rhus-t (590), Ign (527), Chin (520), Hep (479)
 * 
 * Same approach as fixPolycrestRubrics.js: strip all, re-add selectively.
 */
const fs = require('fs');
const path = require('path');

const rubrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/rubrics.json'), 'utf8'));
const symptoms = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/symptoms.json'), 'utf8'));
const remedies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/remedies.json'), 'utf8'));

const remedyById = new Map();
remedies.remedies.forEach(r => remedyById.set(r.id, r));

const symInfo = new Map();
symptoms.chapters.forEach(ch => {
  symInfo.set(ch.id, { name: ch.name, chapter: ch.id, type: 'chapter' });
  ch.symptoms.forEach(s => {
    symInfo.set(s.id, { name: s.name, chapter: ch.id, parent: ch.name, type: 'symptom' });
    if (s.subSymptoms) {
      s.subSymptoms.forEach(sub => {
        symInfo.set(sub.id, { name: sub.name, chapter: ch.id, parent: s.name, type: 'sub' });
      });
    }
  });
});

const BULK_IDS = ['bry', 'rhus-t', 'ign', 'chin', 'hep'];

function matchSym(symId, patterns) {
  const info = symInfo.get(symId);
  if (!info) return false;
  const idLow = symId.toLowerCase();
  const nameLow = info.name.toLowerCase();
  const chap = info.chapter;
  for (const p of patterns) {
    if (p.startsWith('ch:')) { if (chap === p.slice(3)) return true; }
    else if (p.startsWith('kw:')) { if (nameLow.includes(p.slice(3).toLowerCase())) return true; }
    else if (p.includes('*')) {
      const regex = new RegExp('^' + p.replace(/\*/g, '.*') + '$');
      if (regex.test(idLow)) return true;
    } else {
      if (idLow === p || idLow.startsWith(p + '-')) return true;
    }
  }
  return false;
}

function isExcluded(symId, exclusions) {
  if (!exclusions || exclusions.length === 0) return false;
  const idLow = symId.toLowerCase();
  const info = symInfo.get(symId);
  for (const ex of exclusions) {
    if (ex.startsWith('ch:') && info?.chapter === ex.slice(3)) return true;
    if (ex.startsWith('kw:') && info?.name.toLowerCase().includes(ex.slice(3).toLowerCase())) return true;
    if (idLow === ex || idLow.startsWith(ex + '-')) return true;
    if (ex.includes('*')) {
      const regex = new RegExp('^' + ex.replace(/\*/g, '.*') + '$');
      if (regex.test(idLow)) return true;
    }
  }
  return false;
}

// ═══════════════════════════════════════════════════════════
// BRYONIA ALBA (Bry.)
// Key: worse from any motion, better rest/pressure/lying on
//      painful side, dryness (mouth, stool, cough), irritable,
//      stitching pains, slow onset, right-sided, thirst for large
//      quantities, aggravation from warmth
// ═══════════════════════════════════════════════════════════
const bry = {
  grade3: [
    'mind-irritability', 'mind-irritability-disturbed',
    'mind-anger',
    'head-pain', 'head-pain-bursting', 'head-pain-splitting',
    'head-pain-motion', 'head-pain-stooping',
    'head-pain-forehead',
    'nose-epistaxis',
    'mouth-dryness',
    'throat-dryness',
    'stomach-thirst', 'stomach-thirst-large-quantity',
    'stomach-nausea', 'stomach-vomiting',
    'stomach-pain', 'stomach-pain-pressing',
    'abdomen-pain', 'abdomen-pain-cutting',
    'abdomen-inflammation',
    'rectum-constipation', 'rectum-constipation-hard-dry',
    'stool-hard', 'stool-dry',
    'chest-pain', 'chest-pain-stitching', 'chest-pain-sides',
    'chest-pain-breathing', 'chest-pain-cough',
    'chest-inflammation-lungs',
    'chest-bronchitis',
    'cough-dry', 'cough-dry-painful', 'cough-dry-irritating',
    'resp-asthma',
    'back-pain', 'back-pain-lumbar',
    'ext-pain', 'ext-pain-joints',
    'ext-pain-rheumatic',
    'ext-swelling-joints', 'ext-swelling-knee',
    'fever', 'fever-dry-heat', 'fever-inflammatory',
    'gen-motion-agg', 'gen-rest-amel',
    'gen-pressure-amel', 'gen-lying-painful-side-amel',
    'gen-right-sided',
    'gen-stitching-pains',
    'musculoskeletal',
  ],
  grade2: [
    'mind-anxiety', 'mind-fear',
    'mind-confusion',
    'mind-delirium',
    'vertigo', 'vertigo-rising',
    'head-pain-pressing', 'head-pain-congestive',
    'head-pain-right',
    'eye-pain', 'eye-pain-pressing',
    'eye-inflammation',
    'ear-pain',
    'nose-coryza',
    'face-pain',
    'teeth-pain',
    'throat-pain', 'throat-pain-swallowing',
    'stomach-appetite-wanting',
    'stomach-indigestion',
    'abdomen-liver', 'abdomen-liver-jaundice',
    'abdomen-pain-cramping',
    'rectum-diarrhoea',
    'female-menses-painful',
    'female-menses-suppressed',
    'larynx-hoarseness',
    'cough-dry-night',
    'cough-loose',
    'chest-palpitation',
    'chest-pain-sternum',
    'back-pain-cervical', 'back-pain-dorsal',
    'back-sciatica',
    'ext-stiffness', 'ext-stiffness-morning',
    'ext-pain-shoulder', 'ext-pain-knee',
    'ext-pain-hip',
    'chill',
    'persp-profuse',
    'skin-eruptions',
    'gen-weakness', 'gen-weakness-post-illness',
    'gen-warm-room-agg',
    'gen-touch-agg',
    'inf-flu',
    'gastro',
    'liver-gallbladder',
  ],
  grade1: [
    'mind-sadness', 'mind-restlessness',
    'head-heaviness',
    'ear-noises',
    'nose-obstruction',
    'mouth-taste-bitter',
    'stomach-heartburn',
    'abdomen-flatulence',
    'urinary-frequent',
    'female-leucorrhea',
    'chest-oppression',
    'back-pain-sacral',
    'ext-pain-elbow', 'ext-pain-wrist',
    'ext-numbness',
    'sleep-insomnia',
    'skin-itching',
    'gen-anemia',
    'gen-faintness',
  ],
  exclude: [
    'ch:substance-abuse', 'ch:vaccines',
    'ch:emotional-trauma', 'ch:aging',
    'kw:varicocele', 'kw:impotence',
    'kw:teething', 'kw:bedwetting',
    'kw:vitiligo', 'kw:psoriasis',
    'kw:tinnitus', 'kw:glaucoma', 'kw:cataract',
    'kw:obesity', 'kw:alopecia',
    'kw:menopause', 'kw:prolapse',
    'kw:epilepsy', 'kw:parkinson',
    'kw:autism', 'kw:adhd',
  ],
};

// ═══════════════════════════════════════════════════════════
// RHUS TOXICODENDRON (Rhus-t.)
// Key: worse initial motion / better continued motion, restlessness,
//      stiffness (morning/damp), skin (vesicular eruptions, herpes),
//      sprains/strains, worse cold/damp/rest, better warmth
// ═══════════════════════════════════════════════════════════
const rhust = {
  grade3: [
    'mind-restlessness', 'mind-anxiety-night',
    'head-pain', 'head-pain-cold',
    'eye-inflammation', 'eye-swelling',
    'face-eruptions-herpes', 'face-erysipelas',
    'throat-pain',
    'abdomen-pain',
    'back-pain', 'back-pain-lumbar',
    'back-pain-motion-amel',
    'back-sciatica',
    'ext-pain', 'ext-pain-joints',
    'ext-pain-rheumatic', 'ext-pain-wandering',
    'ext-stiffness', 'ext-stiffness-morning',
    'ext-pain-shoulder', 'ext-pain-hip',
    'ext-pain-knee',
    'ext-pain-frozen-shoulder',
    'ext-pain-tennis-elbow',
    'skin-eruptions-vesicular', 'skin-eruptions-herpes',
    'skin-eruptions-urticaria',
    'skin-itching',
    'gen-initial-motion-agg', 'gen-continued-motion-amel',
    'gen-warmth-amel', 'gen-cold-damp-agg',
    'gen-rest-agg',
    'gen-injuries-sprains',
    'musculoskeletal',
    'sport-sprain', 'kw:sprain', 'kw:strain',
    'derm-herpes', 'derm-shingles',
    'derm-eczema',
    'immune-urticaria',
  ],
  grade2: [
    'mind-sadness', 'mind-fear',
    'mind-irritability',
    'vertigo',
    'head-pain-pressing',
    'ear-pain',
    'nose-coryza',
    'face-swelling', 'face-pain',
    'teeth-pain',
    'stomach-nausea',
    'abdomen-liver',
    'rectum-diarrhoea',
    'female-menses-painful',
    'larynx-hoarseness',
    'cough-dry',
    'chest-pain',
    'back-pain-cervical', 'back-pain-sacral',
    'ext-swelling', 'ext-swelling-joints',
    'ext-pain-ankle', 'ext-pain-wrist',
    'ext-pain-carpal-tunnel',
    'ext-cramps',
    'ext-pain-plantar-fascia',
    'sleep-restless',
    'fever', 'fever-intermittent',
    'skin-eruptions', 'skin-eruptions-burning',
    'skin-eruptions-scabies',
    'gen-weakness',
    'gen-injuries',
    'inf-flu',
    'inf-dengue-bone-pain',
    'fa-sprain',
    'sport-muscle', 'sport-tendon',
  ],
  grade1: [
    'mind-confusion',
    'head-heaviness',
    'eye-pain',
    'mouth-dryness',
    'stomach-pain',
    'rectum-hemorrhoids',
    'urinary-frequent',
    'cough-loose',
    'chest-bronchitis',
    'back-pain-dorsal',
    'ext-numbness',
    'ext-varicose-veins',
    'persp-profuse',
    'skin-dry',
    'gen-anemia',
    'gen-cold-agg',
  ],
  exclude: [
    'ch:substance-abuse', 'ch:vaccines', 'ch:aging',
    'ch:oncology', 'ch:palliative',
    'kw:varicocele', 'kw:impotence',
    'kw:teething', 'kw:obesity',
    'kw:gallstone', 'kw:kidney-stone',
    'kw:diabetes', 'kw:thyroid',
    'kw:epilepsy', 'kw:parkinson',
    'kw:autism', 'kw:adhd', 'kw:ocd',
  ],
};

// ═══════════════════════════════════════════════════════════
// IGNATIA AMARA (Ign.)
// Key: ailments from grief/emotional shock, sighing, lump in throat
//      (globus), contradictory/paradoxical symptoms, spasms,
//      sensitive, hysteria, worse consolation, better alone
// ═══════════════════════════════════════════════════════════
const ign = {
  grade3: [
    'mind-grief', 'mind-grief-silent',
    'mind-sadness', 'mind-weeping',
    'mind-weeping-involuntary',
    'mind-sighing',
    'mind-hysteria',
    'mind-sensitive', 'mind-sensitive-criticism',
    'mind-changeable', 'mind-contradictory',
    'mind-anxiety',
    'mind-disappointment',
    'head-pain', 'head-pain-nail-like',
    'throat-lump', 'throat-globus',
    'throat-constriction',
    'stomach-nausea', 'stomach-hiccough',
    'stomach-vomiting',
    'abdomen-pain-cramping',
    'rectum-hemorrhoids',
    'rectum-prolapse',
    'female-menses-suppressed',
    'female-menses-painful',
    'sleep-insomnia', 'sleep-insomnia-grief',
    'gen-spasms', 'gen-convulsions',
    'gen-faintness',
    'gen-paradoxical-symptoms',
    'mh-depression', 'mh-grief',
    'mh-panic',
    'emotional-trauma',
    'const-ign',
  ],
  grade2: [
    'mind-fear', 'mind-irritability',
    'mind-mood-swings',
    'mind-concentration',
    'vertigo',
    'head-pain-pressing', 'head-pain-congestive',
    'eye-pain', 'eye-twitching',
    'face-twitching',
    'mouth-taste-bitter',
    'throat-pain',
    'stomach-appetite-wanting',
    'stomach-indigestion',
    'abdomen-pain',
    'rectum-constipation',
    'female-leucorrhea',
    'female-menopause',
    'larynx-hoarseness',
    'cough-dry', 'cough-spasmodic',
    'chest-palpitation',
    'chest-pain',
    'back-pain',
    'ext-cramps', 'ext-twitching',
    'fever',
    'persp-profuse',
    'gen-trembling',
    'gen-weakness',
    'nerv-headache',
    'preg-morning-sickness',
    'detox-antidepressant',
  ],
  grade1: [
    'mind-confusion', 'mind-memory',
    'head-heaviness',
    'ear-pain',
    'nose-coryza',
    'stomach-pain',
    'abdomen-flatulence',
    'urinary-frequent',
    'cough-evening',
    'back-pain-lumbar',
    'ext-pain', 'ext-numbness',
    'sleep-dreams',
    'skin-itching',
    'gen-anemia',
    'sa-tobacco', 'sa-tobacco-craving',
  ],
  exclude: [
    'ch:sports-medicine', 'ch:travel-health',
    'ch:vaccines', 'ch:environmental',
    'ch:infectious',
    'kw:fracture', 'kw:sprain', 'kw:varicocele',
    'kw:dengue', 'kw:malaria', 'kw:chicken-pox',
    'kw:worms', 'kw:diabetes',
    'kw:kidney-stone', 'kw:gallstone',
    'kw:psoriasis', 'kw:vitiligo',
    'kw:asthma', 'kw:bronchitis',
    'kw:epilepsy', 'kw:parkinson',
  ],
};

// ═══════════════════════════════════════════════════════════
// CHINA OFFICINALIS (Chin.)
// Key: debility from loss of fluids (blood, diarrhea, sweat),
//      periodicity, bloating/flatulence, liver/spleen enlarged,
//      intermittent fever (malaria), anemia, sensitivity to touch,
//      worse drafts/night, hemorrhage
// ═══════════════════════════════════════════════════════════
const chin = {
  grade3: [
    'mind-irritability',
    'mind-sensitive', 'mind-sensitive-noise',
    'head-pain', 'head-pain-throbbing',
    'head-pain-temples',
    'face-pale',
    'stomach-bloating', 'stomach-flatulence',
    'stomach-appetite-wanting',
    'abdomen-flatulence', 'abdomen-enlarged',
    'abdomen-liver', 'abdomen-spleen',
    'abdomen-liver-jaundice',
    'rectum-diarrhoea', 'rectum-diarrhoea-painless',
    'rectum-diarrhoea-watery',
    'stool-undigested',
    'fever-intermittent',
    'chill', 'chill-periodic',
    'persp-profuse', 'persp-night',
    'persp-debilitating',
    'gen-weakness-post-illness',
    'gen-hemorrhage', 'gen-hemorrhage-dark',
    'gen-anemia', 'gen-anemia-hemorrhage',
    'gen-periodicity',
    'gen-fluid-loss-agg',
    'gen-touch-agg',
    'hema-anemia',
    'inf-malaria',
  ],
  grade2: [
    'mind-sadness', 'mind-anxiety',
    'mind-confusion',
    'vertigo',
    'head-pain-pressing', 'head-pain-congestive',
    'eye-pain',
    'ear-noises', 'ear-noises-buzzing',
    'ear-pain',
    'nose-epistaxis',
    'mouth-taste-bitter',
    'throat-pain',
    'stomach-nausea', 'stomach-pain',
    'stomach-indigestion',
    'abdomen-pain', 'abdomen-pain-cramping',
    'rectum-hemorrhoids',
    'female-menses-profuse',
    'female-hemorrhage',
    'chest-hemorrhage-lungs',
    'chest-pain',
    'back-pain',
    'ext-pain', 'ext-weakness',
    'fever-hectic',
    'skin-eruptions',
    'gen-emaciation',
    'gen-faintness',
    'gen-weakness',
    'gen-night-agg',
    'gen-draft-agg',
    'liver-gallbladder',
    'inf-dengue-bone-pain',
  ],
  grade1: [
    'mind-memory', 'mind-dullness',
    'head-heaviness',
    'nose-coryza',
    'face-swelling',
    'stomach-thirst',
    'abdomen-inflammation',
    'stool-bloody',
    'urinary-frequent',
    'cough-dry',
    'chest-bronchitis',
    'back-pain-lumbar',
    'ext-numbness', 'ext-cramps',
    'sleep-insomnia',
    'skin-ulcers',
    'gen-trembling',
  ],
  exclude: [
    'ch:sports-medicine', 'ch:travel-health',
    'ch:vaccines', 'ch:environmental',
    'ch:substance-abuse',
    'kw:fracture', 'kw:sprain', 'kw:varicocele',
    'kw:teething', 'kw:bedwetting',
    'kw:chicken-pox', 'kw:vitiligo',
    'kw:psoriasis', 'kw:obesity',
    'kw:kidney-stone', 'kw:epilepsy',
    'kw:parkinson', 'kw:autism',
  ],
};

// ═══════════════════════════════════════════════════════════
// HEPAR SULPHURIS (Hep.)
// Key: extreme sensitivity (cold, touch, pain), suppuration
//      (abscess tendency), splinter-like pains, chilly, irritable,
//      thick yellow offensive discharges, croup, sore throat
// ═══════════════════════════════════════════════════════════
const hep = {
  grade3: [
    'mind-irritability', 'mind-anger',
    'mind-sensitive', 'mind-sensitive-pain',
    'ear-discharge', 'ear-discharge-offensive',
    'ear-inflammation', 'ear-inflammation-media',
    'nose-discharge', 'nose-discharge-offensive',
    'nose-sinusitis',
    'face-acne', 'face-eruptions',
    'mouth-aphthae',
    'teeth-abscess',
    'throat-pain', 'throat-pain-splinter',
    'throat-inflammation-tonsillitis',
    'throat-swelling-tonsils',
    'ext-throat-swelling-glands',
    'skin-abscess', 'skin-boils',
    'skin-eruptions-pustular',
    'skin-ulcers',
    'skin-eruptions-boils',
    'skin-slow-healing',
    'gen-suppuration', 'gen-abscess',
    'gen-cold-agg', 'gen-touch-agg',
    'gen-splinter-pain',
    'larynx-croup', 'larynx-laryngitis',
    'cough-barking', 'cough-suffocative',
    'cough-dry', 'cough-dry-cold-air',
    'derm-acne', 'derm-boils',
    'dental-abscess',
    'ent-tonsillitis', 'ent-sinusitis',
    'ped-croup',
    'wh-abscess',
    'kw:abscess', 'kw:suppurat',
  ],
  grade2: [
    'mind-anxiety',
    'head-pain',
    'eye-inflammation', 'eye-stye',
    'eye-discharge',
    'ear-pain', 'ear-pain-cold-wind',
    'nose-coryza', 'nose-obstruction',
    'face-swelling',
    'mouth-bleeding-gums',
    'throat-inflammation',
    'stomach-nausea',
    'abdomen-pain',
    'rectum-constipation',
    'rectum-hemorrhoids',
    'urinary-frequent',
    'female-leucorrhea',
    'larynx-hoarseness',
    'cough-loose', 'cough-spasmodic',
    'expectoration-thick', 'expectoration-yellow',
    'chest-bronchitis',
    'chest-pain',
    'back-pain',
    'ext-pain', 'ext-swelling',
    'persp-offensive',
    'skin-eruptions', 'skin-itching',
    'skin-eruptions-impetigo',
    'gen-weakness',
    'gen-chilly',
    'ped-recurrent-tonsils',
    'ped-recurrent-otitis',
    'immune-low-immunity',
  ],
  grade1: [
    'mind-confusion',
    'vertigo',
    'head-heaviness',
    'nose-epistaxis',
    'mouth-taste',
    'stomach-appetite-wanting',
    'abdomen-flatulence',
    'stool-mucus',
    'cough-morning',
    'chest-oppression',
    'back-pain-lumbar',
    'ext-numbness', 'ext-stiffness',
    'sleep-insomnia',
    'fever',
    'skin-dry',
    'gen-trembling',
  ],
  exclude: [
    'ch:travel-health', 'ch:environmental',
    'ch:substance-abuse', 'ch:aging',
    'ch:oncology', 'ch:palliative',
    'kw:varicocele', 'kw:impotence',
    'kw:obesity', 'kw:diabetes',
    'kw:kidney-stone', 'kw:gallstone',
    'kw:epilepsy', 'kw:parkinson',
    'kw:vitiligo', 'kw:menopause',
    'kw:dengue', 'kw:malaria',
  ],
};

const allowlists = { bry, 'rhus-t': rhust, ign, chin, hep };

// ─── STEP 1: Strip all 5 bulk remedy entries ───
const bulkSet = new Set(BULK_IDS);
let totalRemoved = 0;
for (const [symId, entries] of Object.entries(rubrics)) {
  if (!Array.isArray(entries)) continue;
  const before = entries.length;
  rubrics[symId] = entries.filter(e => !bulkSet.has(e.remedyId));
  totalRemoved += before - rubrics[symId].length;
}
console.log('Step 1: Removed ' + totalRemoved + ' bulk entries');

// ─── STEP 2: Re-add selectively ───
let totalAdded = 0;
const allSymIds = [...symInfo.keys()];

for (const [remedyId, config] of Object.entries(allowlists)) {
  let added = 0;
  for (const symId of allSymIds) {
    if (isExcluded(symId, config.exclude)) continue;

    let grade = 0;
    if (matchSym(symId, config.grade3)) grade = 3;
    else if (matchSym(symId, config.grade2)) grade = 2;
    else if (matchSym(symId, config.grade1)) grade = 1;

    if (grade > 0) {
      if (!rubrics[symId]) rubrics[symId] = [];
      const exists = rubrics[symId].some(e => e.remedyId === remedyId);
      if (!exists) {
        rubrics[symId].push({ remedyId, grade });
        added++;
      }
    }
  }

  const r = remedyById.get(remedyId);
  console.log('  ' + (r ? r.abbr : remedyId) + ': added to ' + added + ' symptoms');
  totalAdded += added;
}

console.log('Step 2: Re-added ' + totalAdded + ' entries total');

// ─── STEP 3: Verify no empty rubrics ───
let emptyCount = 0;
for (const [symId, entries] of Object.entries(rubrics)) {
  if (!Array.isArray(entries) || entries.length === 0) emptyCount++;
}
console.log('Step 3: Empty rubrics: ' + emptyCount);

// ─── STEP 4: Final counts ───
const finalCounts = {};
for (const entries of Object.values(rubrics)) {
  if (!Array.isArray(entries)) continue;
  for (const e of entries) {
    finalCounts[e.remedyId] = (finalCounts[e.remedyId] || 0) + 1;
  }
}

console.log('\nFinal distribution:');
for (const rid of BULK_IDS) {
  const r = remedyById.get(rid);
  console.log('  ' + (r ? r.abbr : rid) + ': ' + (finalCounts[rid] || 0));
}

const totalEntries = Object.values(rubrics).reduce((sum, e) => sum + (Array.isArray(e) ? e.length : 0), 0);
console.log('\nTotal remedy-symptom entries: ' + totalEntries);

// ─── STEP 5: Save ───
fs.writeFileSync(path.join(__dirname, 'data/rubrics.json'), JSON.stringify(rubrics, null, 2));
fs.writeFileSync(path.join(__dirname, '../frontend/src/data/rubrics.json'), JSON.stringify(rubrics, null, 2));
console.log('Saved to backend and frontend');
