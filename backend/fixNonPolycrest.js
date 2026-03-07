/**
 * Fix non-polycrest remedies that are also over-represented (>120 symptoms).
 * Same approach: strip all entries and re-add with exact clinical ID lists.
 */
const fs = require('fs');
const path = require('path');

const rubrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/rubrics.json'), 'utf8'));
const symptoms = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/symptoms.json'), 'utf8'));
const remedies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/remedies.json'), 'utf8'));

const rMap = new Map();
remedies.remedies.forEach(r => rMap.set(r.id, r));

const symInfo = new Map();
symptoms.chapters.forEach(ch => {
  symInfo.set(ch.id, ch.name);
  ch.symptoms.forEach(s => {
    symInfo.set(s.id, s.name);
    if (s.subSymptoms) s.subSymptoms.forEach(sub => symInfo.set(sub.id, sub.name));
  });
});

const allowlists = {

// ═══ CHAMOMILLA (315 → ~60) ═══
// Teething, colic, angry/cross, one cheek red, irritability in children, unbearable pain
cham: {
  3: ['mind-anger','mind-irritability','mind-restlessness','mind-peevish','mind-crying','ped-teething','ped-teething-fever','ped-teething-diarrhea','ped-colic','ped-colic-evening','ped-sleep-disturbed','ped-night-crying','abdomen-pain-cramping','abdomen-colic','ear-pain','ear-pain-right','ear-pain-children','teeth-pain','teeth-pain-heat-agg','teeth-pain-coffee','teeth-pain-night','gen-sensitivity-pain','gen-convulsions-febrile-child'],
  2: ['mind-sensitivity','mind-impatience','mind-moaning','head-pain','face-redness-one-cheek','face-heat','stomach-nausea','abdomen-pain','rectum-diarrhoea','rectum-diarrhoea-green','stool-green','stool-sour','female-menses-painful','female-menses-clots','cough-dry','cough-dry-night','cough-suffocative','sleep-insomnia','sleep-restless','persp-warm','gen-night-agg','inf-otitis','ent-otitis'],
  1: ['vertigo','nose-coryza','throat-pain','stomach-vomiting','chest-bronchitis','back-pain','ext-pain','gen-spasms','gen-warm-room-agg'],
},

// ═══ MAGNESIA PHOSPHORICA (308 → ~50) ═══
// Cramping/neuralgic pains, better warmth/pressure, colic, right-sided
'mag-p': {
  3: ['abdomen-pain-cramping','abdomen-colic','abdomen-pain-hypogastric','female-menses-painful','female-menses-cramping','female-ovarian-pain-right','head-pain-neuralgic','face-pain','face-pain-right','teeth-pain','gen-cramps','gen-spasms','gen-injuries-nerves','gen-injuries-nerve','ped-colic','ped-colic-evening'],
  2: ['mind-restlessness','head-pain','stomach-hiccough','stomach-pain','abdomen-flatulence','abdomen-pain','rectum-constipation','chest-pain-stitching','back-pain-lumbar','ext-cramps','ext-cramps-calves','ext-pain-sciatica','ext-pain-neuralgic','gen-warm-amel','gen-pressure-amel','gen-right-sided','nerv-neuralgia','nerv-trigeminal'],
  1: ['vertigo','ear-pain','throat-pain','cough-spasmodic','back-pain','ext-stiffness','sleep-insomnia','gen-convulsions','gen-weakness'],
},

// ═══ STAPHYSAGRIA (286 → ~55) ═══
// Suppressed anger, indignation, surgical wounds, styes, cystitis from sex, prostate
staph: {
  3: ['mind-anger-suppressed','mind-indignation','mind-grief','mind-sensitive','mind-disappointed','eye-stye','eye-stye-recurring','urinary-cystitis-honeymoon','urinary-incontinence','bladder-cystitis','male-prostate','male-prostate-enlarged','male-prostate-frequent-urge','skin-eruptions-after-anger','gen-injuries','gen-surgery-effects','mh-abuse-effects','emotional-trauma'],
  2: ['mind-irritability','mind-sadness','mind-concentration','head-pain','teeth-pain','teeth-pain-decayed','teeth-decay','face-acne','face-eruptions','stomach-nausea','abdomen-pain','rectum-hemorrhoids','female-leucorrhea','cough-dry','back-pain','back-pain-cervical','ext-pain-joints','ext-pain-neuralgic','skin-warts','skin-eruptions','derm-acne','dental-decay'],
  1: ['vertigo','eye-inflammation','nose-coryza','mouth-aphthae','throat-pain','stomach-appetite-wanting','ext-stiffness','sleep-insomnia','persp-night','gen-weakness'],
},

// ═══ GELSEMIUM (279 → ~50) ═══
// Anticipation, flu, weakness/drowsiness, droopy eyelids, trembling, dullness
gels: {
  3: ['mind-anxiety-anticipation','mind-dullness','mind-fear-public','mind-fear-dentist','mind-trembling','head-pain-occiput','head-pain-band','head-heaviness','eye-drooping-lids','eye-vision-blurred','gen-weakness','gen-trembling','gen-drowsiness','gen-faintness','inf-flu','inf-flu-muscle-ache','const-puls-thirstless'],
  2: ['mind-anxiety','mind-fear','mind-concentration','vertigo','head-pain','head-pain-congestive','face-flushed','eye-photophobia','ear-pain','nose-coryza','throat-pain','stomach-nausea','abdomen-pain','rectum-diarrhoea','urinary-retention','female-menses-painful','larynx-hoarseness','cough-dry','chest-oppression','back-pain','ext-weakness','ext-pain','fever-low-grade','chill','persp-profuse','gen-fright-effects','mh-panic','mh-stage-fright'],
  1: ['vertigo-motion','nose-epistaxis','mouth-dryness','stomach-vomiting','bladder-cystitis','chest-palpitation','sleep-insomnia','skin-eruptions','gen-motion-agg'],
},

// ═══ THUJA (247 → ~55) ═══
// Warts, condylomata, sycotic, vaccination effects, growths, left-sided, oily skin
thuj: {
  3: ['skin-warts','skin-warts-flat','skin-warts-pedunculated','skin-warts-genital','skin-warts-plantar','skin-eruptions-condylomata','skin-growths','male-condylomata','female-condylomata','gen-vaccination-effects','gen-vaccination','derm-warts','derm-molluscum','immune-vaccination-effects','miasms'],
  2: ['mind-fixed-ideas','mind-anxiety','mind-sensitive','head-pain-left','head-eruptions','face-acne','face-oily','nose-polyps','nose-sinusitis','teeth-decay','stomach-nausea','abdomen-pain','rectum-hemorrhoids','rectum-fistula','urinary-frequent','female-ovarian-cyst','chest-pain','back-pain','ext-pain-joints','ext-nails-brittle','ext-nails-ingrown','skin-eruptions','skin-growths-benign','skin-moles','gen-left-sided','ct-scleroderma','env-mold-respiratory'],
  1: ['vertigo','eye-stye','ear-pain','throat-pain','rectum-constipation','female-leucorrhea','cough-dry','ext-stiffness','sleep-insomnia','persp-offensive','gen-cold-agg'],
},

// ═══ CAUSTICUM (234 → ~55) ═══
// Paralytic weakness, contractures, warts, hoarseness, cough with incontinence, empathy
caust: {
  3: ['mind-sympathetic','mind-sensitive','larynx-hoarseness','larynx-hoarseness-morning','larynx-loss-voice','cough-dry','cough-dry-cold-air','cough-with-incontinence','urinary-incontinence','urinary-incontinence-cough','ext-contracture','ext-weakness','ext-pain-rheumatic','ext-stiffness','skin-warts','skin-warts-large','gen-paralytic-weakness','gen-convulsions-epileptic'],
  2: ['mind-anxiety','mind-sadness','mind-restlessness','head-pain','eye-inflammation','eye-photophobia','ear-pain','nose-obstruction','face-pain','face-paralysis','teeth-pain','throat-pain','stomach-heartburn','abdomen-pain','rectum-constipation','rectum-hemorrhoids','rectum-fissure','back-pain','ext-pain-carpal-tunnel','ext-pain-tennis-elbow','ext-numbness','ext-corns','sleep-insomnia','skin-burns','gen-cold-agg','nerv-paralysis','nerv-bells-palsy'],
  1: ['vertigo','nose-coryza','mouth-dryness','stomach-nausea','female-menses-painful','chest-bronchitis','back-pain-lumbar','ext-cramps','persp-night','gen-trembling'],
},

// ═══ APIS MELLIFICA (234 → ~50) ═══
// Stinging pains, swelling/edema, worse heat, better cold, thirstless, urticaria
apis: {
  3: ['eye-swelling','eye-swelling-upper','eye-inflammation-conjunctivitis','face-swelling','face-swelling-oedematous','throat-swelling','throat-pain-stinging','skin-eruptions-urticaria','skin-swelling','skin-stinging','skin-erysipelas','gen-swelling','gen-stinging-pain','gen-heat-agg','gen-cold-amel','gen-thirstlessness','immune-urticaria','immune-allergy','immune-anaphylaxis','immune-insect-bite'],
  2: ['mind-jealousy','mind-irritability','head-pain','eye-pain','ear-inflammation','nose-polyps','mouth-swelling','stomach-thirstless','abdomen-ascites','urinary-retention','urinary-scanty','kidneys-nephritis','female-ovarian-cyst','female-ovarian-pain-right','chest-pleurisy','ext-swelling','ext-swelling-joints','ext-swelling-knee','skin-eruptions-rash','fever-with-swelling','gen-inflammation'],
  1: ['vertigo','nose-coryza','throat-pain','stomach-nausea','rectum-diarrhoea','cough-dry','back-pain','ext-pain','sleep-insomnia','persp-suppressed'],
},

// ═══ IPECACUANHA (216 → ~45) ═══
// Nausea constant, vomiting, clean tongue, hemorrhage bright, bronchitis in children, cough
ip: {
  3: ['stomach-nausea','stomach-nausea-constant','stomach-nausea-eating','stomach-vomiting','stomach-vomiting-bile','cough-suffocative','cough-rattling','cough-spasmodic','cough-loose-cannot-raise','resp-asthma','resp-asthma-children','chest-bronchitis','gen-hemorrhage','gen-hemorrhage-bright','gen-nausea-all-complaints'],
  2: ['mind-irritability','head-pain','face-pale','nose-epistaxis','mouth-salivation','stomach-appetite-wanting','abdomen-pain','rectum-diarrhoea','rectum-diarrhoea-green','stool-bloody','female-menses-profuse','female-hemorrhage','larynx-hoarseness','cough-dry','expectoration-bloody','chest-oppression','fever-intermittent','persp-cold','ped-bronchiolitis'],
  1: ['vertigo','eye-inflammation','ear-pain','throat-pain','stomach-hiccough','back-pain','ext-cramps','sleep-insomnia','skin-eruptions','gen-weakness'],
},

// ═══ NITRIC ACID (205 → ~50) ═══
// Splinter pains, fissures, ulcers, warts, bleeding, orifices, offensive discharges
'nit-ac': {
  3: ['mouth-aphthae','mouth-aphthae-burning','mouth-ulcers','rectum-fissure','rectum-hemorrhoids','rectum-hemorrhoids-bleeding','skin-warts','skin-warts-genital','skin-ulcers','skin-ulcers-deep','skin-fissures','skin-cracks','gen-splinter-pain','gen-orifices','derm-warts','derm-fissure','dental-mouth-ulcers'],
  2: ['mind-irritability','mind-anxiety-health','head-pain','eye-inflammation','ear-discharge-offensive','nose-discharge-offensive','mouth-bleeding-gums','teeth-pain','throat-ulceration','stomach-pain','abdomen-pain','rectum-constipation','stool-bloody','urinary-painful','female-leucorrhea-offensive','back-pain','ext-pain-joints','skin-eruptions','skin-boils','gen-offensive-discharges','gen-hemorrhage'],
  1: ['vertigo','face-acne','stomach-nausea','abdomen-liver','cough-dry','chest-pain','ext-numbness','sleep-insomnia','persp-offensive','gen-weakness','gen-anemia'],
},

// ═══ RUTA GRAVEOLENS (174 → ~40) ═══
// Tendons, sprains, periosteum, eye strain, ganglion, restless legs
ruta: {
  3: ['eye-strain','eye-pain-reading','ext-pain-joints','ext-pain-wrist','ext-pain-ankle','ext-pain-knee','ext-sprains','gen-injuries','gen-injuries-tendon','gen-injuries-bones','gen-injuries-bone','gen-bruised-feeling','musculoskeletal','msk-spondylosis'],
  2: ['head-pain','eye-inflammation','back-pain','back-pain-lumbar','back-sciatica','ext-stiffness','ext-pain-hip','ext-pain-shoulder','ext-restlessness-legs','ext-ganglion','ext-pain-carpal-tunnel','ext-pain-plantar-fascia','ext-numbness','rectum-constipation','rectum-prolapse','skin-bruises'],
  1: ['vertigo','face-pain','stomach-nausea','chest-pain','ext-cramps','gen-weakness','gen-cold-agg'],
},

// ═══ ARNICA MONTANA (167 → ~40) ═══
// Trauma, bruising, sprains, soreness, fear of being touched, concussion
arn: {
  3: ['mind-fear-touch','gen-injuries','gen-injuries-head','gen-injuries-bruise','gen-bruised-feeling','ext-soreness','skin-bruises','gen-trauma','hema-easy-bruising'],
  2: ['mind-shock','head-pain','head-pain-injury','eye-hemorrhage','nose-epistaxis','face-swelling','mouth-bleeding-gums','stomach-nausea','abdomen-pain','rectum-hemorrhoids','chest-pain','back-pain','back-pain-lumbar','ext-pain-joints','ext-sprains','ext-pain-shoulder','ext-pain-knee','ext-pain-hip','ext-swelling','persp-night','gen-weakness','gen-hemorrhage','gen-soreness'],
  1: ['vertigo','ear-pain','throat-pain','stomach-vomiting','female-menses-profuse','cough-dry','sleep-insomnia','skin-eruptions','gen-faintness'],
},

// ═══ ARGENTUM NITRICUM (158 → ~45) ═══
// Anticipation anxiety, diarrhea before events, sugar craving, gastric, conjunctivitis
'arg-n': {
  3: ['mind-anxiety-anticipation','mind-anxiety','mind-fear-public','mind-fear-crowd','mind-fear-height','mind-hurry','mind-impulsive','stomach-bloating','stomach-flatulence','abdomen-flatulence','rectum-diarrhoea','rectum-diarrhoea-anticipation','eye-inflammation-conjunctivitis','eye-discharge','throat-pain-splinter','larynx-hoarseness','gen-sugar-agg','mh-panic','mh-phobia','mh-stage-fright'],
  2: ['mind-restlessness','mind-sadness','head-pain','head-pain-congestive','eye-pain','eye-inflammation','nose-coryza','face-pale','mouth-aphthae','stomach-nausea','stomach-pain','stomach-desires-sweets','stomach-acidity','abdomen-pain','stool-green','urinary-frequent','female-menses-painful','cough-dry','chest-palpitation','back-pain','ext-trembling','gen-trembling','gen-weakness'],
  1: ['vertigo','ear-noises','throat-dryness','rectum-constipation','chest-bronchitis','ext-numbness','sleep-insomnia','skin-eruptions','gen-faintness'],
},

// ═══ CONIUM (138 → ~40) ═══
// Glands hard, tumors, elderly weakness, vertigo lying, suppressed sexual desire
con: {
  3: ['mind-dullness','mind-memory','mind-indifference','ext-throat-swelling-glands','ext-throat-swelling-glands-hard','female-breast-lumps','female-breast-pain','male-prostate','male-prostate-enlarged','vertigo','vertigo-lying','vertigo-turning','gen-glandular','gen-weakness','ger-debility','ger-vertigo','ger-memory','onc-support'],
  2: ['mind-sadness','head-pain','eye-photophobia','eye-inflammation','face-swelling','stomach-nausea','abdomen-liver','rectum-constipation','urinary-retention','urinary-frequent','female-menses-suppressed','female-leucorrhea','chest-pain','back-pain','ext-weakness','ext-trembling','ext-numbness','sleep-insomnia','skin-eruptions','gen-cold-agg'],
  1: ['vertigo-morning','nose-coryza','mouth-dryness','throat-pain','stomach-appetite-wanting','cough-dry','persp-night','gen-trembling'],
},

// ═══ HYPERICUM (138 → ~35) ═══
// Nerve injuries, laceration, puncture wounds, spine, fingers/toes, coccyx
hyper: {
  3: ['gen-injuries-nerves','gen-injuries-nerve','gen-injuries-head','back-pain-coccyx','ext-pain-fingers','ext-pain-toes','ext-pain-neuralgic','gen-puncture-wounds','gen-nerve-pain','nerv-neuralgia'],
  2: ['mind-shock','head-pain','head-pain-injury','teeth-pain','teeth-pain-after-dental','back-pain','back-pain-sacral','ext-pain','ext-numbness','ext-pain-sciatica','ext-pain-carpal-tunnel','ext-pain-plantar-fascia','skin-wounds','gen-injuries','gen-bruised-feeling'],
  1: ['face-pain','stomach-nausea','chest-pain','ext-cramps','sleep-insomnia','gen-weakness','gen-trembling'],
},

// ═══ CARBO VEGETABILIS (132 → ~40) ═══
// Collapse, coldness with desire for air, bloating upper abdomen, flatulence
'carb-v': {
  3: ['stomach-bloating','stomach-flatulence','abdomen-flatulence','abdomen-distension','gen-faintness','gen-collapse','gen-coldness','gen-air-desire','gen-weakness-post-illness','gen-conval-slow'],
  2: ['mind-confusion','mind-dullness','head-pain','face-pale','stomach-indigestion','stomach-acidity','stomach-heartburn','stomach-nausea','abdomen-pain','rectum-hemorrhoids','rectum-hemorrhoids-bleeding','stool-offensive','chest-oppression','resp-dyspnoea','cough-loose','persp-cold','gen-anemia','gen-hemorrhage','gen-coldness-extremities','ger-debility'],
  1: ['vertigo','nose-epistaxis','mouth-taste-bitter','throat-pain','stomach-appetite-wanting','female-menses-profuse','back-pain','ext-weakness','sleep-insomnia','skin-ulcers','gen-trembling'],
},

// ═══ SPIGELIA (122 → ~30) ═══
// Left-sided headache, heart, neuralgia, worms, sharp stitching pains
spig: {
  3: ['head-pain-left','head-pain-neuralgic','head-pain-stitching','face-pain','face-pain-left','eye-pain','eye-pain-pressing','chest-palpitation','chest-pain-stitching','chest-angina-pectoris','nerv-trigeminal','nerv-neuralgia'],
  2: ['mind-fear','head-pain','eye-inflammation','ear-noises','teeth-pain','stomach-nausea','abdomen-pain','chest-pain','back-pain','gen-left-sided','gen-stitching-pain','cv-palpitation'],
  1: ['vertigo','nose-coryza','throat-pain','cough-dry','ext-pain','sleep-insomnia','gen-weakness'],
},

// ═══ LEDUM (121 → ~35) ═══
// Puncture wounds, insect bites, gout, cold amel, joints, bruising
led: {
  3: ['ext-pain-joints','ext-pain-gout','ext-pain-ankle','ext-pain-toes','ext-swelling-joints','gen-puncture-wounds','gen-insect-bites','gen-cold-amel','immune-insect-bite'],
  2: ['mind-irritability','eye-hemorrhage','face-acne','ext-pain-knee','ext-pain-wrist','ext-pain-hip','ext-pain-rheumatic','ext-stiffness','ext-swelling','ext-sprains','skin-bruises','skin-eruptions','gen-injuries','gen-gout','gen-ascending-symptoms'],
  1: ['head-pain','eye-inflammation','nose-epistaxis','stomach-nausea','back-pain','ext-cramps','sleep-insomnia','gen-cold-agg','gen-weakness'],
},

// ═══ BAR-C (Baryta Carbonica) (120 → ~35) ═══
// Children delayed, elderly weakness, enlarged tonsils, glands, memory loss
'bar-c': {
  3: ['mind-dullness','mind-memory','mind-timidity','mind-shy','throat-swelling-tonsils','ext-throat-swelling-glands','ped-delayed-development','ped-delayed-walking','ped-delayed-speech','ped-recurrent-tonsils','ger-debility','ger-memory','ger-vertigo'],
  2: ['mind-confusion','mind-fear','vertigo','head-pain','eye-inflammation','ear-inflammation','nose-obstruction','face-swelling','teeth-pain','stomach-appetite-wanting','abdomen-enlarged','rectum-constipation','male-prostate-enlarged','larynx-hoarseness','cough-dry','chest-bronchitis','back-pain','ext-weakness','gen-weakness','gen-glandular','gen-cold-agg','endo-hypothyroid'],
  1: ['ear-pain','nose-coryza','mouth-dryness','throat-pain','stomach-nausea','sleep-insomnia','skin-warts','gen-trembling','gen-emaciation'],
},

// ═══ COLOC (Colocynthis) (117 → ~30) ═══
// Cramping colic better pressure/bending double, anger effects, sciatica
coloc: {
  3: ['abdomen-pain-cramping','abdomen-colic','abdomen-pain','abdomen-pain-hypogastric','female-menses-painful','female-menses-cramping','female-ovarian-pain','gen-pressure-amel','gen-bending-double-amel'],
  2: ['mind-anger','mind-irritability','head-pain','face-pain','face-pain-right','stomach-nausea','stomach-vomiting','stomach-pain','rectum-diarrhoea','rectum-diarrhoea-painful','stool-jelly-like','back-sciatica','ext-pain-sciatica','ext-pain-hip','ext-cramps','nerv-neuralgia','nerv-trigeminal'],
  1: ['vertigo','eye-pain','ear-pain','throat-pain','urinary-frequent','cough-dry','chest-pain','sleep-insomnia','gen-weakness'],
},

// ═══ ALOE (100 → ~25) ═══
// Rectal urgency, diarrhea, hemorrhoids, portal congestion, insecurity of sphincter
aloe: {
  3: ['rectum-diarrhoea','rectum-diarrhoea-morning','rectum-hemorrhoids','rectum-hemorrhoids-protruding','rectum-hemorrhoids-bleeding','rectum-prolapse','stool-mucus','stool-involuntary','abdomen-pain','abdomen-liver'],
  2: ['mind-irritability','stomach-bloating','stomach-indigestion','abdomen-flatulence','abdomen-distension','abdomen-pain-hypogastric','rectum-constipation-alternating-diarrhoea','stool-watery','stool-bloody','gen-morning-agg'],
  1: ['head-pain','face-heat','stomach-nausea','back-pain-lumbar','ext-weakness','gen-weakness'],
},

};

// ─── STEP 1: Strip ───
const stripIds = Object.keys(allowlists);
const stripSet = new Set(stripIds);
let totalRemoved = 0;
for (const [symId, entries] of Object.entries(rubrics)) {
  if (!Array.isArray(entries)) continue;
  const before = entries.length;
  rubrics[symId] = entries.filter(e => !stripSet.has(e.remedyId));
  totalRemoved += before - rubrics[symId].length;
}
console.log('Step 1: Removed ' + totalRemoved + ' entries for ' + stripIds.length + ' remedies');

// ─── STEP 2: Re-add ───
let totalAdded = 0;
let missingIds = 0;
for (const [remedyId, grades] of Object.entries(allowlists)) {
  let added = 0;
  for (const [gradeStr, symIds] of Object.entries(grades)) {
    const grade = parseInt(gradeStr);
    for (const symId of symIds) {
      if (!symInfo.has(symId)) { missingIds++; continue; }
      if (!rubrics[symId]) rubrics[symId] = [];
      if (!rubrics[symId].some(e => e.remedyId === remedyId)) {
        rubrics[symId].push({ remedyId, grade });
        added++;
      }
    }
  }
  const r = rMap.get(remedyId);
  console.log('  ' + (r ? r.abbr : remedyId) + ': ' + added);
  totalAdded += added;
}
console.log('Step 2: Added ' + totalAdded + ' (missing IDs: ' + missingIds + ')');

// ─── STEP 3: Fix empties ───
let emptyCount = 0;
for (const entries of Object.values(rubrics)) {
  if (!Array.isArray(entries) || entries.length === 0) emptyCount++;
}
console.log('Empty rubrics: ' + emptyCount);

// ─── STEP 4: Final counts ───
const counts = {};
let totalEntries = 0;
for (const entries of Object.values(rubrics)) {
  if (!Array.isArray(entries)) continue;
  for (const e of entries) {
    counts[e.remedyId] = (counts[e.remedyId] || 0) + 1;
    totalEntries++;
  }
}

console.log('\nNon-polycrest distribution:');
for (const rid of stripIds) {
  const r = rMap.get(rid);
  console.log('  ' + (r ? r.abbr : rid) + ': ' + (counts[rid] || 0));
}
console.log('\nTotal entries: ' + totalEntries);

// ─── STEP 5: Save ───
fs.writeFileSync(path.join(__dirname, 'data/rubrics.json'), JSON.stringify(rubrics, null, 2));
fs.writeFileSync(path.join(__dirname, '../frontend/src/data/rubrics.json'), JSON.stringify(rubrics, null, 2));
console.log('Saved');
