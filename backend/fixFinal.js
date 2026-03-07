/**
 * DEFINITIVE fix: strip ALL 21 over-represented remedies and re-add
 * using EXACT symptom ID lists only. No prefix matching, no cascading.
 * Target: 30-80 symptoms per polycrest.
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
  symInfo.set(ch.id, ch.name);
  ch.symptoms.forEach(s => {
    symInfo.set(s.id, s.name);
    if (s.subSymptoms) s.subSymptoms.forEach(sub => symInfo.set(sub.id, sub.name));
  });
});

const BULK_IDS = [
  'calc','lyc','ars','bell','phos','puls','sil','nux-v','sulph','merc',
  'sep','nat-m','graph','kali-c','acon','lach',
  'bry','rhus-t','ign','chin','hep'
];

// Format: { symptomId: grade }
// Only EXACT IDs. Every entry here is a deliberate clinical decision.

const allowlists = {

// ═══ CALCAREA CARBONICA ═══
// Children, bones, glands, obesity, kidney stones, anxiety about health, cold/sweat
calc: {
  3: ['mind-fear-disease','mind-anxiety-health','mind-obstinate','head-perspiration','head-perspiration-cold','teeth-pain','stomach-desires-eggs','stomach-desires-sweets','stomach-appetite-ravenous','abdomen-enlarged','rectum-constipation-children','kidneys-stones','urinary-kidney-stones-recurrent','female-menses-profuse','female-menses-early','female-leucorrhea','persp-profuse','persp-head','persp-cold','gen-obesity','ped-teething','ped-teething-fever','ped-teething-diarrhea','ped-delayed-development','ped-delayed-walking','ped-delayed-dentition','ped-rickets','meta-calcium-def','meta-vit-d-def','ger-osteoporosis'],
  2: ['mind-fear','mind-fear-death','mind-fear-insanity','mind-anxiety','mind-confusion','mind-dullness','mind-memory','head-pain','head-eruptions-crusts','eye-inflammation-scrofulous','ear-discharge-offensive','nose-polyps','throat-swelling-tonsils','stomach-appetite-wanting','stomach-indigestion','stomach-acidity','abdomen-flatulence','abdomen-liver','rectum-constipation','rectum-diarrhoea-sour','urinary-frequent','chest-palpitation','back-pain-lumbar','ext-pain-joints','ext-swelling-knee','chill-morning','skin-eruptions-eczema','skin-warts','gen-weakness-post-illness','gen-cold-agg','gen-anemia','endo-thyroid','endo-hypothyroid','sleep-insomnia','immune-allergy','gen-emaciation'],
  1: ['mind-weeping','mind-sadness','vertigo','head-heaviness','eye-stye','nose-coryza','mouth-aphthae','stomach-nausea','abdomen-pain','stool-hard','cough-dry','chest-bronchitis','back-pain','ext-cramps','skin-itching','gen-trembling','gen-faintness'],
},

// ═══ LYCOPODIUM ═══
// Right-sided, 4-8pm agg, digestive, liver, flatulence, lack of confidence, kidney stones
lyc: {
  3: ['mind-anxiety-anticipation','mind-lack-confidence','mind-timidity','mind-irritability','stomach-appetite-quickly-satiated','stomach-bloating','stomach-flatulence','stomach-indigestion','abdomen-flatulence','abdomen-enlarged','abdomen-liver','abdomen-liver-jaundice','rectum-constipation','rectum-hemorrhoids','kidneys-stones','kidneys-pain','urine-sediment-red-sand','male-impotence-old-age','endo-diabetes','gen-right-sided'],
  2: ['mind-fear-failure','mind-anxiety','mind-confusion','mind-sadness','head-pain-right','head-pain-temples','nose-obstruction','face-wrinkled','mouth-taste-bitter','stomach-appetite-ravenous','stomach-acidity','stomach-heartburn','abdomen-pain','rectum-diarrhoea','urinary-frequent','urinary-kidney-stones-colic','female-menses-late','resp-dyspnoea','chest-bronchitis','back-pain-lumbar','ext-pain-heel','sleep-insomnia','skin-dry','gen-weakness-post-illness','liver-gallbladder','ger-debility'],
  1: ['mind-dullness','mind-memory','vertigo','head-hair-falling','eye-stye','ear-pain','throat-pain','stomach-nausea','stomach-pain','abdomen-pain-cramping','stool-hard','bladder-cystitis','cough-dry','chest-pain','ext-pain-joints','ext-stiffness','ext-cramps-calves','gen-emaciation','gen-anemia'],
},

// ═══ ARSENICUM ALBUM ═══
// Burning pains better heat, restlessness, anxiety, midnight agg, food poisoning, asthma
ars: {
  3: ['mind-anxiety','mind-anxiety-health','mind-anxiety-midnight','mind-restlessness','mind-fear','mind-fear-death','mind-fastidious','stomach-vomiting','stomach-nausea','stomach-pain-burning','stomach-thirst-small-sips','rectum-diarrhoea','rectum-diarrhoea-watery','resp-asthma','resp-asthma-midnight','skin-eruptions-burning','skin-eruptions-psoriasis','skin-itching-burning','gen-burning','gen-midnight-agg','gen-restlessness','gen-cold-agg','gen-weakness-post-illness','derm-psoriasis','derm-eczema','immune-allergy','immune-hay-fever'],
  2: ['mind-sadness','mind-despair','head-pain','head-pain-burning','nose-coryza-fluent','mouth-aphthae','mouth-dryness','throat-pain-burning','abdomen-pain-burning','rectum-diarrhoea-painful','cough-dry','cough-suffocative','chest-pain-burning','skin-eruptions-eczema','skin-ulcers','gen-emaciation','gen-anemia','gen-periodicity','endo-diabetes','fever-burning-heat','fever-intermittent','onc-fatigue-cancer','pall-pain'],
  1: ['vertigo','eye-lachrymation','ear-pain','face-pale','teeth-pain','stomach-indigestion','abdomen-liver','stool-offensive','urinary-frequent','female-menses-painful','chest-palpitation','back-pain','ext-numbness','sleep-insomnia','persp-cold','gen-faintness'],
},

// ═══ BELLADONNA ═══
// Sudden onset, high fever, throbbing, congestion, redness, right-sided, delirium
bell: {
  3: ['mind-delirium','mind-delirium-fever','mind-rage','mind-starting','head-pain-throbbing','head-pain-congestive','head-pain-sun','head-congestion','head-heat','eye-inflammation','eye-inflammation-conjunctivitis','eye-photophobia','eye-pupils-dilated','ear-pain-right','ear-inflammation','throat-inflammation-tonsillitis','throat-redness','throat-pain-right','abdomen-pain-cramping','fever-high','fever-burning-heat','fever-dry-heat','fever-inflammatory','gen-inflammation','gen-throbbing','ped-fever','ped-convulsions-fever','inf-scarlet-fever'],
  2: ['mind-anxiety','mind-excitement','head-pain','head-pain-right','head-pain-bursting','face-redness','face-heat','face-swelling','mouth-dryness','teeth-pain-throbbing','stomach-nausea','stomach-vomiting','larynx-laryngitis','cough-dry','cough-barking','cough-spasmodic','chest-inflammation-lungs','skin-eruptions-rash','skin-redness','nerv-convulsions','ent-otitis','fa-sunstroke','fa-heatstroke'],
  1: ['vertigo','eye-pain','nose-epistaxis','throat-pain','stomach-pain','abdomen-pain','urinary-retention','female-menses-profuse','back-pain','ext-pain-joints','sleep-insomnia','gen-convulsions','gen-faintness'],
},

// ═══ PHOSPHORUS ═══
// Bleeding, burning, tall thin, respiratory, liver, anxiety, desire cold drinks
phos: {
  3: ['mind-anxiety','mind-fear-dark','mind-fear-thunderstorm','mind-fear-being-alone','mind-sensitive','head-hair-falling','nose-epistaxis','nose-epistaxis-profuse','mouth-bleeding-gums','stomach-vomiting-blood','stomach-thirst-cold-water','stomach-thirst-ice-cold','chest-hemorrhage-lungs','chest-inflammation-lungs','chest-bronchitis','cough-dry-tickling','larynx-hoarseness','gen-hemorrhage','gen-hemorrhage-bright','gen-burning','gen-emaciation','gen-anemia-hemorrhage','hema-easy-bruising','hema-anemia'],
  2: ['mind-sadness','mind-restlessness','mind-memory','head-pain','head-pain-congestive','eye-hemorrhage','vision-dim','vision-flashes','ear-noises','face-pale','throat-pain-burning','stomach-nausea','stomach-indigestion','abdomen-liver','abdomen-liver-jaundice','rectum-diarrhoea','rectum-hemorrhoids-bleeding','stool-bloody','cough-dry','resp-asthma','chest-pain-burning','chest-palpitation','back-pain','ext-numbness','ext-trembling','sleep-insomnia','fever-hectic','skin-eruptions','gen-weakness-post-illness','gen-faintness','endo-diabetes','nerv-neuralgia'],
  1: ['vertigo','eye-lachrymation','nose-coryza','mouth-dryness','teeth-pain','stomach-appetite-ravenous','abdomen-flatulence','urinary-frequent','female-menses-profuse','cough-loose','chest-oppression','persp-night','skin-ulcers','gen-trembling'],
},

// ═══ PULSATILLA ═══
// Weeping, changeability, thirstlessness, better open air, thick yellow discharge, female
puls: {
  3: ['mind-weeping','mind-weeping-easily','mind-sadness','mind-timidity','mind-yielding','mind-fear-being-alone','ear-discharge-thick','ear-inflammation','nose-coryza','nose-discharge-thick-yellow','nose-obstruction','eye-inflammation-catarrhal','stomach-nausea','stomach-indigestion-fatty-food','stomach-thirstless','female-menses-painful','female-menses-late','female-menses-scanty','female-menses-suppressed','female-leucorrhea','female-pregnancy','cough-dry-night','cough-loose-cannot-raise','expectoration-thick','gen-changeability','gen-warm-room-agg','gen-open-air-amel','gen-thirstlessness','ent-otitis','ent-sinusitis'],
  2: ['mind-anxiety','mind-irritability','mind-jealousy','head-pain','head-pain-menses','vertigo','eye-stye','face-acne','mouth-dryness-without-thirst','teeth-pain-warm','throat-pain','stomach-vomiting','abdomen-pain-cramping','rectum-diarrhoea','rectum-hemorrhoids','urinary-incontinence','female-ovarian-pain','female-morning-sickness','chest-bronchitis','back-pain-lumbar','ext-pain-wandering','ext-varicose-veins','sleep-insomnia','skin-eruptions-urticaria','gen-faintness','preg-morning-sickness'],
  1: ['ear-noises','face-swelling','mouth-aphthae','stomach-heartburn','abdomen-flatulence','stool-changeable','bladder-cystitis','cough-evening','chest-oppression','back-pain','ext-swelling','persp-one-sided','skin-itching','gen-weakness'],
},

// ═══ SILICEA ═══
// Suppuration, slow healing, cold sensitive, glandular, splinter pains, brittle nails
sil: {
  3: ['mind-timidity','mind-yielding','mind-obstinate','mind-fear-failure','eye-stye','ear-discharge-offensive','ear-inflammation-chronic','nose-discharge-offensive','teeth-abscess','throat-swelling-tonsils','ext-throat-swelling-glands','ext-throat-swelling-glands-hard','rectum-constipation','rectum-fistula','skin-abscess','skin-boils','skin-ulcers','skin-slow-healing','skin-eruptions-pustular','persp-feet','persp-offensive','gen-suppuration','gen-slow-healing','gen-cold-agg','gen-weakness-post-illness','immune-low-immunity','ped-recurrent-infections','dental-abscess'],
  2: ['mind-anxiety','mind-sensitive','mind-concentration','head-pain-occiput','head-perspiration','head-eruptions','eye-inflammation','nose-coryza','mouth-aphthae','stomach-nausea','abdomen-pain','rectum-hemorrhoids','female-leucorrhea','larynx-hoarseness','cough-dry','chest-bronchitis','back-pain-cervical','ext-pain-joints','ext-nails-brittle','ext-nails-ingrown','sleep-insomnia','fever-hectic','skin-warts','skin-corns','gen-anemia','gen-emaciation','derm-acne','derm-keloid'],
  1: ['vertigo','head-pain','ear-pain','teeth-pain-cold','throat-pain','stomach-appetite-wanting','abdomen-flatulence','stool-hard','urinary-frequent','cough-loose','back-pain-lumbar','ext-numbness','persp-night','gen-trembling','ger-osteoporosis'],
},

// ═══ NUX VOMICA ═══
// Irritability, oversensitivity, digestive, constipation, hangover, cold agg, morning agg
'nux-v': {
  3: ['mind-irritability','mind-anger','mind-impatience','mind-quarrelsome','mind-sensitive','mind-sensitive-noise','mind-sensitive-light','head-pain-morning','head-pain-hangover','nose-coryza','mouth-taste-bitter','stomach-nausea','stomach-nausea-morning','stomach-vomiting','stomach-indigestion','stomach-acidity','stomach-heartburn','stomach-hiccough','abdomen-flatulence','abdomen-liver','rectum-constipation','rectum-constipation-ineffectual','rectum-hemorrhoids','sleep-insomnia','gen-cold-agg','gen-morning-agg','sa-alcohol','sa-alcohol-craving','sa-caffeine'],
  2: ['mind-anxiety','mind-restlessness','vertigo-morning','head-pain','head-pain-congestive','nose-obstruction','face-pain','teeth-pain','throat-pain','stomach-appetite-wanting','stomach-bloating','stomach-pain','abdomen-pain-cramping','abdomen-liver-jaundice','rectum-diarrhoea-alternating','stool-hard','urinary-retention','male-emission','larynx-hoarseness','cough-dry','resp-asthma','back-pain','back-pain-lumbar','ext-cramps','ext-cramps-calves','gen-weakness','gen-spasms','endo-diabetes','liver-gallbladder'],
  1: ['mind-confusion','mind-sadness','head-congestion','eye-photophobia','ear-pain','stomach-desires-stimulants','female-menses-painful','cough-spasmodic','chest-pain','chest-oppression','back-pain-cervical','ext-stiffness','fever','persp-morning','skin-eruptions','gen-faintness','gen-trembling'],
},

// ═══ SULPHUR ═══
// Skin (itching, burning), heat agg, standing agg, 11am hunger, chronic, psora
sulph: {
  3: ['mind-irritability','mind-laziness','mind-philosophical','head-pain-vertex','head-heat','head-eruptions-eczema','eye-inflammation-chronic','eye-redness','ear-discharge-offensive','face-eruptions-acne','face-redness','stomach-appetite-11am','stomach-burning','rectum-diarrhoea-morning','rectum-hemorrhoids','rectum-hemorrhoids-burning','rectum-itching','skin-eruptions','skin-itching','skin-itching-burning','skin-eruptions-eczema','skin-eruptions-psoriasis','skin-eruptions-boils','skin-eruptions-scabies','skin-eruptions-burning','skin-dry','gen-heat-agg','gen-standing-agg','gen-burning','gen-offensive-discharges','derm-psoriasis','derm-eczema','derm-scabies'],
  2: ['mind-anxiety','mind-confusion','mind-memory','head-pain','head-eruptions','eye-lachrymation','nose-discharge-offensive','mouth-taste-bitter','throat-pain-burning','stomach-acidity','stomach-nausea','stomach-indigestion','abdomen-flatulence','abdomen-liver','stool-offensive','urinary-frequent','female-leucorrhea','female-menses-late','larynx-hoarseness','cough-dry','resp-asthma','chest-bronchitis','back-pain-lumbar','ext-pain-joints','ext-heat-feet','sleep-insomnia','fever-burning-heat','persp-offensive','gen-weakness-post-illness','gen-emaciation','immune-allergy'],
  1: ['vertigo','head-heaviness','nose-coryza','face-pale','mouth-aphthae','stomach-pain','abdomen-pain','rectum-constipation','female-menses-painful','cough-loose','chest-oppression','back-pain','ext-stiffness','persp-night','gen-anemia','gen-faintness','ger-debility'],
},

// ═══ MERCURIUS ═══
// Salivation, metallic taste, night sweats, glands, ulceration, offensive, night agg
merc: {
  3: ['mouth-salivation','mouth-salivation-sleep','mouth-taste-metallic','mouth-aphthae','mouth-bleeding-gums','mouth-inflammation','teeth-pain-night','teeth-abscess','throat-inflammation-tonsillitis','throat-ulceration','ext-throat-swelling-glands','ear-discharge-offensive','ear-inflammation','eye-inflammation','eye-discharge','nose-discharge-offensive','abdomen-liver-jaundice','rectum-diarrhoea-bloody','stool-bloody','stool-mucus','skin-ulcers','skin-eruptions-pustular','persp-night','persp-offensive','gen-night-agg','gen-offensive-discharges','gen-trembling','gen-suppuration','dental-abscess','dental-gingivitis','ent-tonsillitis','ent-sinusitis'],
  2: ['mind-anxiety-night','mind-restlessness','mind-memory','head-pain','head-perspiration','nose-coryza','nose-epistaxis','face-swelling','throat-pain','throat-inflammation','stomach-nausea','stomach-indigestion','abdomen-liver','abdomen-flatulence','rectum-constipation','rectum-hemorrhoids','urinary-frequent','female-leucorrhea','female-menses-profuse','larynx-hoarseness','cough-dry','chest-bronchitis','back-pain','ext-pain-joints','skin-eruptions','skin-boils','gen-weakness','gen-anemia','inf-syphilis'],
  1: ['mind-confusion','vertigo','head-heaviness','ear-pain','face-eruptions','stomach-appetite-wanting','abdomen-inflammation','bladder-cystitis','female-menses-painful','cough-loose','chest-pain','ext-numbness','sleep-insomnia','fever-night','skin-dry','gen-faintness'],
},

// ═══ SEPIA ═══
// Female complaints, bearing-down, indifference to family, liver spots, menopause
sep: {
  3: ['mind-indifference','mind-indifference-family','mind-irritability','mind-sadness','mind-aversion-company','head-pain-menses','face-yellowness','face-chloasma','stomach-nausea-morning','stomach-nausea-pregnancy','stomach-vomiting-pregnancy','abdomen-bearing-down','rectum-constipation','rectum-prolapse','urinary-incontinence','urinary-incontinence-cough','female-menses-painful','female-menses-late','female-menses-irregular','female-leucorrhea','female-prolapse','female-bearing-down','female-ovarian-pain','female-menopause','female-hot-flashes','skin-chloasma','gen-bearing-down','gen-exercise-amel','preg-morning-sickness','derm-melasma'],
  2: ['mind-anxiety','mind-weeping','mind-fear','vertigo','head-pain','head-hair-falling','eye-inflammation','mouth-taste-bitter','throat-pain','stomach-appetite-wanting','stomach-desires-sour','abdomen-liver','rectum-hemorrhoids','female-menses-early','female-menses-profuse','female-menses-scanty','female-menses-suppressed','female-leucorrhea-yellow','female-morning-sickness','larynx-hoarseness','cough-dry','back-pain-lumbar','back-pain-sacral','ext-restlessness-legs','sleep-insomnia','persp-offensive','skin-eruptions-herpes','gen-weakness-post-illness','gen-cold-agg','endo-thyroid'],
  1: ['mind-concentration','mind-memory','head-heaviness','nose-coryza','face-acne','stomach-heartburn','abdomen-flatulence','urinary-frequent','chest-bronchitis','back-pain','ext-numbness','skin-warts','skin-itching','gen-anemia','gen-faintness'],
},

// ═══ NATRUM MURIATICUM ═══
// Grief, sun agg, headache, herpes, salt craving, emaciation, dry skin
'nat-m': {
  3: ['mind-grief','mind-grief-silent','mind-sadness','mind-weeping-alone','mind-reserved','mind-aversion-company','head-pain-sun','head-pain-throbbing','head-pain-temples','head-pain-forehead','eye-lachrymation','eye-lachrymation-wind','nose-coryza-fluent','face-eruptions-herpes','face-mapped','mouth-aphthae','mouth-herpes','stomach-desires-salt','stomach-thirst-extreme','skin-eruptions-eczema','skin-eruptions-herpes','skin-dry','skin-cracked','gen-emaciation','gen-sun-agg','gen-heat-agg','gen-anemia','derm-eczema','derm-herpes','derm-cold-sore','mh-depression','mh-grief','emotional-trauma'],
  2: ['mind-anxiety','mind-irritability','mind-fear-crowd','mind-concentration','mind-memory','vertigo','head-pain','head-hair-falling','eye-stye','ear-pain','nose-epistaxis','face-acne','face-oily','teeth-pain','throat-dryness','stomach-nausea','stomach-appetite-wanting','abdomen-pain','rectum-constipation','stool-hard','urinary-frequent','female-menses-painful','female-leucorrhea','cough-dry','chest-palpitation','back-pain-lumbar','ext-weakness','sleep-insomnia','persp-profuse','gen-weakness-post-illness','gen-cold-agg','endo-thyroid','immune-hay-fever'],
  1: ['mind-dullness','head-heaviness','nose-obstruction','face-pale','mouth-dryness','stomach-indigestion','abdomen-flatulence','rectum-hemorrhoids','female-ovarian-pain','cough-loose','chest-bronchitis','back-pain','ext-numbness','ext-cramps','skin-eruptions-urticaria','gen-faintness','gen-trembling'],
},

// ═══ GRAPHITES ═══
// Skin (eczema, cracks, honey discharge), constipation, obesity, thick discharges, nails
graph: {
  3: ['mind-sadness','mind-weeping-music','mind-timidity','mind-indecision','head-eruptions-eczema','head-eruptions-crusts','eye-inflammation-chronic','eye-stye','eye-discharge','ear-discharge-thick','ear-eczema','face-eruptions-eczema','stomach-bloating','rectum-constipation','rectum-fissure','stool-hard','skin-eruptions-eczema','skin-eruptions-moist','skin-eruptions-crusty','skin-cracks','skin-fissures','skin-dry','skin-itching','ext-nails-brittle','ext-nails-thick','gen-obesity','derm-eczema','derm-psoriasis','derm-keloid','derm-nail-fungus'],
  2: ['mind-anxiety','mind-irritability','head-pain','eye-inflammation','ear-inflammation-chronic','nose-coryza','face-acne','teeth-pain','stomach-indigestion','stomach-appetite-wanting','stomach-flatulence','abdomen-flatulence','abdomen-pain','rectum-hemorrhoids','female-leucorrhea','female-menses-late','female-menses-scanty','cough-dry','back-pain','ext-pain-joints','ext-stiffness','ext-corns','sleep-insomnia','persp-offensive','skin-warts','skin-ulcers','skin-eruptions-herpes','gen-cold-agg','gen-anemia'],
  1: ['mind-memory','vertigo','head-heaviness','nose-obstruction','mouth-dryness','throat-pain','stomach-nausea','abdomen-liver','urinary-frequent','larynx-hoarseness','chest-bronchitis','back-pain-lumbar','ext-numbness','skin-boils','gen-weakness','gen-faintness'],
},

// ═══ KALI CARBONICUM ═══
// 2-4am agg, back pain stitching, weakness, asthma, sharp pains, bloating
'kali-c': {
  3: ['mind-fear','mind-anxiety-stomach','mind-irritability','mind-starting-sleep','back-pain-lumbar','back-pain-stitching','back-pain-sacral','chest-pain-stitching','chest-bronchitis','chest-inflammation-lungs','resp-asthma','resp-asthma-night','resp-dyspnoea','cough-dry','cough-dry-night','stomach-bloating','abdomen-flatulence','gen-weakness','gen-weakness-post-illness','gen-cold-agg'],
  2: ['mind-confusion','mind-sadness','vertigo','head-pain','eye-swelling-upper','ear-pain','nose-coryza','face-swelling','throat-pain','stomach-nausea','stomach-indigestion','abdomen-pain','rectum-constipation','rectum-hemorrhoids','urinary-frequent','female-menses-painful','female-menses-profuse','female-leucorrhea','larynx-hoarseness','cough-spasmodic','chest-palpitation','back-pain','ext-pain-joints','ext-stiffness','sleep-insomnia','chill','persp-profuse','persp-night','skin-dry','gen-anemia','gen-emaciation'],
  1: ['mind-memory','head-heaviness','nose-epistaxis','mouth-dryness','teeth-pain','stomach-appetite-wanting','abdomen-liver','stool-hard','cough-loose','chest-oppression','ext-numbness','ext-cramps','gen-trembling','gen-faintness'],
},

// ═══ ACONITUM ═══
// Sudden onset, cold wind exposure, high anxiety/panic, first stage fever
acon: {
  3: ['mind-fear','mind-fear-death','mind-anxiety','mind-restlessness','mind-panic','ear-pain-cold-wind','nose-coryza-dry','throat-pain','throat-inflammation','cough-dry','cough-dry-cold-air','cough-barking','fever-high','fever-dry-heat','fever-inflammatory','chill-sudden','gen-cold-wind-agg','gen-sudden-onset','gen-fright-effects','inf-flu','inf-common-cold'],
  2: ['mind-starting','mind-excitement','head-pain','head-pain-congestive','eye-inflammation','ear-pain','ear-inflammation','nose-epistaxis','face-redness','mouth-dryness','teeth-pain','stomach-nausea','stomach-vomiting','abdomen-pain','urinary-retention','larynx-laryngitis','larynx-croup','cough-spasmodic','resp-asthma','chest-palpitation','back-pain','ext-numbness','sleep-insomnia','persp-profuse','skin-eruptions-rash','gen-inflammation','ped-fever','ped-croup'],
  1: ['vertigo','head-heaviness','nose-obstruction','face-pain','stomach-appetite-wanting','rectum-diarrhoea','female-menses-painful','cough-dry-night','chest-bronchitis','back-pain-lumbar','ext-stiffness','gen-weakness','gen-convulsions'],
},

// ═══ LACHESIS ═══
// Left-sided, jealousy, loquacity, menopause, hemorrhage, worse sleep/morning/heat, throat
lach: {
  3: ['mind-jealousy','mind-loquacity','mind-suspicion','mind-irritability','head-pain-left','head-pain-congestive','throat-pain-left','throat-inflammation','throat-swelling','throat-constriction','throat-pain-empty-swallowing','female-menopause','female-hot-flashes','female-ovarian-pain-left','chest-palpitation','chest-angina-pectoris','gen-left-sided','gen-sleep-agg','gen-morning-agg','gen-constriction','gen-hemorrhage','gen-hemorrhage-dark','hema-easy-bruising'],
  2: ['mind-anxiety','mind-fear','mind-restlessness','vertigo','head-pain-throbbing','eye-inflammation','nose-epistaxis','face-redness','mouth-aphthae','teeth-pain','stomach-nausea','abdomen-liver','rectum-hemorrhoids','rectum-hemorrhoids-bleeding','rectum-hemorrhoids-protruding','female-menses-suppressed','female-menses-profuse','female-leucorrhea','larynx-laryngitis','cough-suffocative','resp-asthma','back-pain','ext-varicose-veins','sleep-insomnia','persp-night','skin-ulcers','gen-weakness','gen-anemia','cv-hypertension','nerv-stroke'],
  1: ['mind-confusion','mind-memory','head-heaviness','ear-pain-left','nose-coryza','face-eruptions','stomach-pain','abdomen-pain','urinary-frequent','cough-morning','back-pain-lumbar','ext-numbness','skin-itching','gen-faintness'],
},

// ═══ BRYONIA ═══
// Worse ANY motion, better rest/pressure, dryness, stitching pains, slow onset, thirst
bry: {
  3: ['mind-irritability','head-pain-motion','head-pain-bursting','head-pain-splitting','head-pain-stooping','mouth-dryness','throat-dryness','stomach-thirst-large-quantity','stomach-nausea','stomach-vomiting','rectum-constipation','stool-hard','chest-pain-stitching','chest-pain-sides','chest-pain-breathing','chest-pain-cough','chest-inflammation-lungs','chest-bronchitis','cough-dry','cough-dry-painful','back-pain-lumbar','ext-pain-joints','ext-pain-rheumatic','ext-swelling-joints','fever-dry-heat','fever-inflammatory','gen-motion-agg','gen-rest-amel','gen-pressure-amel'],
  2: ['mind-anxiety','mind-delirium','vertigo-rising','head-pain','head-pain-right','head-pain-pressing','eye-inflammation','ear-pain','nose-coryza','face-pain','teeth-pain','throat-pain-swallowing','stomach-appetite-wanting','stomach-indigestion','abdomen-liver','abdomen-liver-jaundice','abdomen-pain','rectum-diarrhoea','female-menses-painful','cough-dry-night','cough-loose','chest-palpitation','back-pain','back-sciatica','ext-stiffness','ext-pain-shoulder','ext-pain-knee','ext-pain-hip','chill','gen-weakness-post-illness','gen-warm-room-agg','inf-flu'],
  1: ['mind-confusion','mind-sadness','head-heaviness','nose-obstruction','mouth-taste-bitter','stomach-heartburn','abdomen-flatulence','stool-dry','urinary-frequent','chest-oppression','back-pain-cervical','ext-numbness','sleep-insomnia','persp-profuse','skin-eruptions','gen-anemia','gen-faintness'],
},

// ═══ RHUS TOXICODENDRON ═══
// Worse initial motion, better continued motion, stiffness, sprains, vesicular skin, damp agg
'rhus-t': {
  3: ['mind-restlessness','back-pain','back-pain-lumbar','back-sciatica','ext-pain-joints','ext-pain-rheumatic','ext-stiffness','ext-stiffness-morning','ext-pain-shoulder','ext-pain-hip','ext-pain-knee','ext-pain-frozen-shoulder','ext-pain-tennis-elbow','skin-eruptions-vesicular','skin-eruptions-herpes','skin-eruptions-urticaria','gen-injuries-sprains','derm-herpes','derm-shingles','immune-urticaria','musculoskeletal'],
  2: ['mind-anxiety-night','head-pain','eye-inflammation','eye-swelling','face-eruptions-herpes','throat-pain','abdomen-pain','rectum-diarrhoea','female-menses-painful','larynx-hoarseness','cough-dry','chest-pain','back-pain-cervical','back-pain-sacral','ext-swelling-joints','ext-pain-ankle','ext-pain-wrist','ext-pain-carpal-tunnel','ext-pain-plantar-fascia','ext-cramps','fever-intermittent','skin-eruptions-burning','gen-weakness','inf-flu','inf-dengue-bone-pain'],
  1: ['vertigo','ear-pain','nose-coryza','face-swelling','stomach-nausea','abdomen-liver','urinary-frequent','sleep-restless','skin-itching','gen-cold-agg','gen-anemia'],
},

// ═══ IGNATIA ═══
// Grief, emotional shock, sighing, globus, paradoxical symptoms, spasms
ign: {
  3: ['mind-grief','mind-grief-silent','mind-sadness','mind-weeping','mind-weeping-involuntary','mind-sighing','mind-sensitive','mind-changeable','mind-contradictory','mind-disappointment','head-pain-nail-like','throat-lump','throat-globus','throat-constriction','stomach-hiccough','female-menses-suppressed','sleep-insomnia','gen-spasms','gen-paradoxical-symptoms','mh-depression','mh-grief','mh-panic','emotional-trauma'],
  2: ['mind-anxiety','mind-irritability','mind-mood-swings','mind-fear','mind-hysteria','vertigo','head-pain','head-pain-pressing','eye-twitching','face-twitching','mouth-taste-bitter','stomach-nausea','stomach-vomiting','abdomen-pain-cramping','rectum-hemorrhoids','rectum-constipation','female-menses-painful','female-menopause','larynx-hoarseness','cough-dry','cough-spasmodic','chest-palpitation','back-pain','ext-cramps','ext-twitching','gen-trembling','gen-weakness','preg-morning-sickness','detox-antidepressant'],
  1: ['mind-concentration','mind-memory','head-heaviness','ear-pain','nose-coryza','stomach-pain','abdomen-flatulence','urinary-frequent','cough-evening','chest-pain','persp-profuse','skin-itching','gen-anemia','gen-faintness','sa-tobacco-craving'],
},

// ═══ CHINA OFFICINALIS ═══
// Debility from fluid loss, periodicity, bloating, liver/spleen, intermittent fever, anemia
chin: {
  3: ['mind-irritability','mind-sensitive-noise','head-pain-throbbing','stomach-bloating','stomach-flatulence','stomach-appetite-wanting','abdomen-flatulence','abdomen-enlarged','abdomen-liver','abdomen-spleen','abdomen-liver-jaundice','rectum-diarrhoea-painless','rectum-diarrhoea-watery','stool-undigested','fever-intermittent','chill','persp-profuse','persp-night','gen-weakness-post-illness','gen-hemorrhage','gen-anemia','gen-anemia-hemorrhage','gen-periodicity','hema-anemia','inf-malaria'],
  2: ['mind-sadness','mind-anxiety','vertigo','head-pain','head-pain-temples','eye-pain','ear-noises','ear-noises-buzzing','ear-pain','nose-epistaxis','mouth-taste-bitter','throat-pain','stomach-nausea','abdomen-pain','rectum-hemorrhoids','female-menses-profuse','chest-hemorrhage-lungs','back-pain','ext-weakness','fever-hectic','skin-eruptions','gen-emaciation','gen-faintness','gen-night-agg','liver-gallbladder','inf-dengue-bone-pain'],
  1: ['mind-memory','head-heaviness','nose-coryza','face-swelling','stomach-pain','abdomen-inflammation','stool-bloody','urinary-frequent','cough-dry','chest-bronchitis','back-pain-lumbar','ext-numbness','sleep-insomnia','skin-ulcers','gen-trembling'],
},

// ═══ HEPAR SULPHURIS ═══
// Extreme sensitivity, suppuration, splinter pains, chilly, thick offensive discharge, croup
hep: {
  3: ['mind-irritability','mind-anger','mind-sensitive-pain','ear-discharge-offensive','ear-inflammation-media','nose-discharge-offensive','nose-sinusitis','teeth-abscess','throat-pain','throat-inflammation-tonsillitis','throat-swelling-tonsils','ext-throat-swelling-glands','skin-abscess','skin-boils','skin-ulcers','skin-eruptions-pustular','skin-eruptions-boils','larynx-croup','larynx-laryngitis','cough-barking','cough-suffocative','cough-dry-cold-air','gen-suppuration','gen-cold-agg','gen-touch-agg','dental-abscess','ent-tonsillitis','ent-sinusitis','ped-croup','immune-low-immunity'],
  2: ['mind-anxiety','head-pain','eye-inflammation','eye-stye','eye-discharge','ear-pain','ear-pain-cold-wind','nose-coryza','nose-obstruction','face-swelling','face-acne','mouth-aphthae','mouth-bleeding-gums','throat-inflammation','stomach-nausea','abdomen-pain','rectum-constipation','rectum-hemorrhoids','female-leucorrhea','cough-loose','cough-spasmodic','expectoration-thick','chest-bronchitis','back-pain','ext-pain','ext-swelling','persp-offensive','skin-eruptions','skin-eruptions-impetigo','gen-weakness','ped-recurrent-tonsils','ped-recurrent-otitis','derm-acne','derm-boils'],
  1: ['vertigo','head-heaviness','nose-epistaxis','stomach-appetite-wanting','abdomen-flatulence','stool-mucus','urinary-frequent','cough-morning','chest-oppression','back-pain-lumbar','ext-numbness','ext-stiffness','sleep-insomnia','fever','skin-dry','gen-trembling'],
},

};

// ─── STEP 1: Strip all 21 bulk remedy entries ───
const bulkSet = new Set(BULK_IDS);
let totalRemoved = 0;
for (const [symId, entries] of Object.entries(rubrics)) {
  if (!Array.isArray(entries)) continue;
  const before = entries.length;
  rubrics[symId] = entries.filter(e => !bulkSet.has(e.remedyId));
  totalRemoved += before - rubrics[symId].length;
}
console.log('Step 1: Removed ' + totalRemoved + ' entries');

// ─── STEP 2: Re-add from exact ID lists ───
let totalAdded = 0;
let missingIds = 0;

for (const [remedyId, grades] of Object.entries(allowlists)) {
  let added = 0;
  for (const [gradeStr, symIds] of Object.entries(grades)) {
    const grade = parseInt(gradeStr);
    for (const symId of symIds) {
      if (!symInfo.has(symId)) {
        missingIds++;
        continue;
      }
      if (!rubrics[symId]) rubrics[symId] = [];
      const exists = rubrics[symId].some(e => e.remedyId === remedyId);
      if (!exists) {
        rubrics[symId].push({ remedyId, grade });
        added++;
      }
    }
  }
  const r = remedyById.get(remedyId);
  console.log('  ' + (r ? r.abbr : remedyId) + ': ' + added + ' symptoms');
  totalAdded += added;
}

console.log('Step 2: Added ' + totalAdded + ' entries (missing IDs: ' + missingIds + ')');

// ─── STEP 3: Check empties ───
let emptyCount = 0;
const empties = [];
for (const [symId, entries] of Object.entries(rubrics)) {
  if (!Array.isArray(entries) || entries.length === 0) {
    emptyCount++;
    empties.push(symId);
  }
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

console.log('\nFinal polycrest distribution:');
for (const rid of BULK_IDS) {
  const r = remedyById.get(rid);
  console.log('  ' + (r ? r.abbr : rid) + ': ' + (finalCounts[rid] || 0));
}

const totalEntries = Object.values(rubrics).reduce((sum, e) => sum + (Array.isArray(e) ? e.length : 0), 0);
console.log('\nTotal entries: ' + totalEntries);

// ─── STEP 5: Save ───
fs.writeFileSync(path.join(__dirname, 'data/rubrics.json'), JSON.stringify(rubrics, null, 2));
fs.writeFileSync(path.join(__dirname, '../frontend/src/data/rubrics.json'), JSON.stringify(rubrics, null, 2));
console.log('Saved');
