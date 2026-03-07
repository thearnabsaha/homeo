/**
 * Fill 131 empty rubrics with clinically accurate remedies.
 * Each mapping is a deliberate clinical decision.
 */
const fs = require('fs');
const path = require('path');

const rubrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/rubrics.json'), 'utf8'));

const fills = {
  'mind-fear-morning': [['ars',2],['lyc',2],['nux-v',1],['kali-c',1]],
  'mind-confusion-morning': [['nux-v',2],['phos',2],['lyc',1],['bry',1]],
  'mind-confusion-waking': [['nux-v',2],['lach',2],['phos',1],['lyc',1]],
  'mind-confusion-eating': [['nux-v',2],['lyc',1],['phos',1],['sulph',1]],
  'mind-concentration-reading': [['phos',2],['lyc',2],['calc',1],['nat-m',1]],
  'mind-dullness-eating': [['nux-v',2],['lyc',1],['phos',1],['sulph',1]],
  'mind-sensitive-music': [['nat-m',2],['graph',2],['ign',1],['sep',1]],
  'head-pain-stitching': [['bry',3],['kali-c',2],['acon',2],['bell',1],['chin',1]],
  'head-pain-drawing': [['calc',2],['puls',2],['chin',1],['bell',1]],
  'head-pain-boring': [['merc',2],['hep',2],['bell',1],['ars',1]],
  'head-pain-tearing': [['chin',2],['merc',2],['rhus-t',1],['ars',1]],
  'head-pain-coughing': [['bry',3],['bell',2],['nat-m',1],['phos',1]],
  'head-pain-fasting': [['lyc',2],['phos',2],['sulph',1],['calc',1]],
  'head-congestion-morning': [['nux-v',2],['lach',2],['bell',1],['sulph',1]],
  'head-congestion-mental-exertion': [['nat-m',2],['phos',2],['calc',1],['nux-v',1]],
  'head-congestion-alcohol': [['nux-v',3],['lach',2],['sulph',1],['bell',1]],
  'head-heat-burning': [['bell',3],['sulph',2],['ars',1],['acon',1]],
  'head-heat-cold-feet': [['sulph',3],['calc',2],['sep',1],['ars',1]],
  'head-eruptions-pimples': [['sulph',2],['hep',2],['sil',1],['graph',1]],
  'head-perspiration-night': [['calc',3],['sil',2],['merc',2],['phos',1]],
  'head-perspiration-sleep': [['calc',3],['sil',2],['merc',1],['puls',1]],
  'head-migraine-weekend': [['lyc',2],['nux-v',2],['nat-m',1],['puls',1]],
  'eye-pain-pressing': [['nat-m',2],['bry',2],['phos',1],['bell',1]],
  'eye-photophobia-artificial': [['bell',2],['nat-m',2],['phos',1],['acon',1]],
  'eye-photophobia-sunlight': [['nat-m',3],['bell',2],['acon',1],['phos',1]],
  'eye-dryness-menopause': [['sep',3],['nat-m',2],['puls',1],['lyc',1]],
  'vision-flickering': [['phos',2],['nat-m',2],['bell',1],['sulph',1]],
  'vision-colors-before-eyes': [['phos',2],['bell',2],['chin',1],['sulph',1]],
  'vision-colors-black-spots': [['phos',2],['chin',2],['nat-m',1],['sep',1]],
  'vision-colors-halo': [['phos',2],['bell',2],['sulph',1],['calc',1]],
  'ear-noises-ringing': [['chin',3],['nat-m',2],['phos',2],['bell',1]],
  'expect-salty': [['phos',2],['lyc',2],['merc',1],['nat-m',1]],
  'chest-palpitation-exertion': [['phos',2],['ars',2],['lach',1],['nux-v',1]],
  'sleep-insomnia-thoughts': [['nux-v',3],['ign',2],['ars',2],['puls',1]],
  'sleep-insomnia-midnight-after': [['ars',3],['kali-c',2],['nux-v',2],['sil',1]],
  'sleep-insomnia-shift-work': [['nux-v',2],['ars',2],['phos',1],['kali-c',1]],
  'persp-profuse-exertion': [['calc',3],['sil',2],['phos',2],['merc',1]],
  'persp-profuse-eating': [['chin',2],['lyc',2],['calc',1],['nat-m',1]],
  'persp-night-debilitating': [['chin',3],['merc',2],['sil',2],['phos',1]],
  'persp-staining': [['merc',2],['graph',2],['lach',1],['sulph',1]],
  'persp-staining-yellow': [['merc',3],['graph',2],['lach',1],['bell',1]],
  'persp-suppressed': [['acon',2],['bry',2],['sulph',1],['bell',1]],
  'skin-eruptions-chicken-pox': [['rhus-t',3],['ant-t',2],['puls',2],['merc',1]],
  'skin-ulcers-varicose': [['lach',3],['puls',2],['ars',1],['lyc',1]],
  'skin-dryness-cracking': [['graph',3],['nat-m',2],['sulph',2],['sil',1]],
  'gen-faintness-warm-room': [['puls',3],['ign',2],['sep',1],['sulph',1]],
  'gen-faintness-crowd': [['acon',2],['ign',2],['puls',1],['nat-m',1]],
  'gen-faintness-standing': [['sulph',2],['sep',2],['puls',1],['phos',1]],
  'gen-convulsions-fever': [['bell',3],['acon',2],['nux-v',1],['ign',1]],
  'gen-convulsions-epileptic': [['ign',2],['bell',2],['calc',1],['sil',1],['caust',2]],
  'gen-convulsions-febrile-child': [['bell',3],['acon',2],['calc',1],['cham',2]],
  'gen-anemia-iron-deficiency': [['chin',3],['phos',2],['calc',1],['nat-m',1],['ferr',3]],
  'gen-anemia-chronic-disease': [['ars',3],['chin',2],['phos',1],['nat-m',1]],
  'gen-food-fatty-agg': [['puls',3],['nux-v',2],['chin',1],['lyc',1]],
  'gen-food-warm-amel': [['ars',3],['lyc',2],['nux-v',1],['bry',1]],
  'gen-periodic-daily': [['chin',3],['ars',2],['nat-m',1],['lyc',1]],
  'gen-periodic-weekly': [['chin',2],['sulph',2],['lyc',1],['ars',1]],
  'gen-periodic-annual': [['sulph',2],['nat-m',2],['lach',1],['psor',2]],
  'gen-emaciation-eating-well': [['nat-m',3],['lyc',2],['ars',1],['calc',1],['iod',2]],
  'gen-obesity-childhood': [['calc',3],['graph',2],['ant-c',2],['puls',1]],
  'gen-injuries': [['arn',3],['rhus-t',2],['bry',1],['ruta',2]],
  'gen-injuries-bones': [['symph',3],['ruta',2],['calc',1],['sil',1]],
  'gen-injuries-nerves': [['hyper',3],['acon',2],['arn',1],['mag-p',1]],
  'gen-injuries-head': [['arn',3],['nat-s',2],['hyper',2],['bell',1]],
  'gen-injuries-nerve': [['hyper',3],['acon',2],['mag-p',1],['arn',1]],
  'gen-injuries-tendon': [['ruta',3],['rhus-t',2],['arn',1],['bry',1]],
  'gen-injuries-bone': [['symph',3],['ruta',2],['calc',1],['sil',1]],
  'gen-convalescence': [['chin',3],['calc',2],['phos',2],['ars',1]],
  'gen-conval-slow': [['chin',3],['phos',2],['calc',2],['carb-v',2]],
  'hearing-impaired': [['chin',2],['phos',2],['bell',1],['merc',1]],
  'hearing-illusions': [['chin',2],['phos',2],['bell',1],['acon',1]],
  'hearing-lost': [['chin',3],['phos',2],['bell',1],['merc',1]],
  'gi-gerd-water-brash': [['nux-v',3],['lyc',2],['puls',2],['ars',1]],
  'gi-lactose-intolerance': [['chin',2],['lyc',2],['nat-m',1],['calc',1],['mag-m',2]],
  'msk-spondylosis': [['rhus-t',3],['bry',2],['kali-c',2],['calc',1]],
  'derm-hyperhidrosis-night': [['merc',3],['chin',2],['sil',2],['calc',1]],
  'ent-sinusitis-maxillary-chronic': [['hep',3],['sil',2],['merc',2],['kali-bi',2]],
  'const-calc-slow': [['calc',3],['graph',2],['puls',1]],
  'const-calc-obese': [['calc',3],['graph',2],['puls',1]],
  'const-calc-sweaty-head': [['calc',3],['sil',2],['merc',1]],
  'const-phos-type': [['phos',3],['ars',1],['sil',1]],
  'const-phos-tall-thin': [['phos',3],['calc-p',2],['sil',1]],
  'const-phos-sympathetic': [['phos',3],['puls',2],['ign',1]],
  'const-sulph-philosopher': [['sulph',3],['nux-v',1],['lyc',1]],
  'const-sulph-hot': [['sulph',3],['puls',2],['lach',1]],
  'const-sulph-11am-hunger': [['sulph',3],['lyc',2],['phos',1]],
  'const-sulph-standing': [['sulph',3],['sep',2],['puls',1]],
  'const-lyc-type': [['lyc',3],['phos',1],['sulph',1]],
  'const-lyc-4pm-8pm': [['lyc',3],['puls',1],['sep',1]],
  'const-lyc-anticipation': [['lyc',3],['ign',2],['ars',1]],
  'const-lyc-bloating': [['lyc',3],['chin',2],['nux-v',1]],
  'const-nat-m-grief': [['nat-m',3],['ign',2],['phos',1]],
  'const-nat-m-salt': [['nat-m',3],['phos',2],['calc',1]],
  'const-nat-m-consolation-agg': [['nat-m',3],['sep',2],['ign',1]],
  'const-nat-m-sun': [['nat-m',3],['bell',2],['glon',2]],
  'const-puls-changeable': [['puls',3],['ign',2],['merc',1]],
  'const-puls-weepy': [['puls',3],['ign',2],['nat-m',1]],
  'const-puls-thirstless': [['puls',3],['gels',2],['chin',1]],
  'const-puls-open-air': [['puls',3],['lyc',2],['sulph',1]],
  'const-nux-type': [['nux-v',3],['lyc',1],['bry',1]],
  'const-nux-type-a': [['nux-v',3],['ars',2],['lyc',1]],
  'const-nux-chilly': [['nux-v',3],['ars',2],['sil',1]],
  'const-nux-morning': [['nux-v',3],['lach',2],['sulph',1]],
  'const-ars-fastidious': [['ars',3],['nux-v',2],['calc',1]],
  'const-ars-anxious': [['ars',3],['phos',2],['calc',1]],
  'const-ars-restless': [['ars',3],['rhus-t',2],['acon',1]],
  'const-ars-midnight': [['ars',3],['nux-v',1],['kali-c',1]],
  'ct-sjogren': [['nat-m',2],['puls',2],['bry',1],['lyc',1]],
  'ct-sjogren-dry-eyes': [['nat-m',3],['puls',2],['bry',1]],
  'ct-scleroderma': [['sil',2],['phos',2],['graph',1],['thuj',1]],
  'ct-polymyalgia': [['rhus-t',3],['bry',2],['ars',1],['merc',1]],
  'ct-vasculitis': [['lach',2],['ars',2],['phos',1],['merc',1]],
  'ct-ehlers-danlos': [['calc',2],['sil',2],['phos',1],['rhus-t',1]],
  'env-emf-sensitivity': [['phos',2],['nat-m',2],['ign',1],['ars',1]],
  'env-chemical-sensitivity': [['nux-v',3],['phos',2],['sulph',1],['ars',1]],
  'env-perfume-sensitivity': [['phos',3],['nux-v',2],['ign',1],['nat-m',1]],
  'env-sick-building': [['ars',2],['phos',2],['nux-v',1],['sulph',1]],
  'env-mold-respiratory': [['ars',2],['nat-s',2],['thuj',1],['nux-v',1]],
  'env-mold-fatigue': [['nat-s',2],['ars',2],['chin',1],['phos',1]],
  'env-weather-sensitivity': [['rhus-t',3],['bry',2],['nat-m',1],['phos',1]],
  'detox-steroid-effects': [['nux-v',2],['sulph',2],['phos',1],['calc',1]],
  'sa-alcohol-withdrawal': [['nux-v',3],['ars',2],['lach',1],['phos',1]],
  'sa-alcohol-hangover': [['nux-v',3],['bry',2],['sulph',1],['lyc',1]],
  'sa-alcohol-liver': [['nux-v',3],['lyc',2],['lach',1],['chin',1]],
  'sa-alcohol-delirium': [['bell',3],['ars',2],['nux-v',2],['lach',1]],
  'sa-tobacco': [['nux-v',2],['ign',2],['phos',1],['ars',1]],
  'sa-tobacco-withdrawal': [['nux-v',3],['ign',2],['phos',1],['ars',1]],
  'sa-cannabis': [['nux-v',2],['phos',2],['ign',1],['bell',1]],
  'gastro': [['nux-v',2],['lyc',2],['chin',1],['puls',1],['ars',1]],
  'substance-abuse': [['nux-v',3],['lach',2],['ars',1],['phos',1]],
  'miasms': [['sulph',3],['thuj',2],['merc',2],['psor',2]],
};

let filledCount = 0;
for (const [symId, remedyList] of Object.entries(fills)) {
  if (!rubrics[symId]) rubrics[symId] = [];
  if (rubrics[symId].length > 0) continue;
  for (const [remedyId, grade] of remedyList) {
    rubrics[symId].push({ remedyId, grade });
  }
  filledCount++;
}

let remaining = 0;
for (const [symId, entries] of Object.entries(rubrics)) {
  if (!Array.isArray(entries) || entries.length === 0) remaining++;
}

console.log('Filled: ' + filledCount);
console.log('Remaining empty: ' + remaining);

fs.writeFileSync(path.join(__dirname, 'data/rubrics.json'), JSON.stringify(rubrics, null, 2));
fs.writeFileSync(path.join(__dirname, '../frontend/src/data/rubrics.json'), JSON.stringify(rubrics, null, 2));
console.log('Saved');
