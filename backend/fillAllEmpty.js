/**
 * Fill all 480 empty rubrics with clinically accurate remedy assignments.
 * Organized by chapter/category for systematic accuracy.
 */
const fs = require('fs');
const path = require('path');

const rubrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/rubrics.json'), 'utf8'));

const fills = {

// ═══ MIND ═══
'mind-fear-future': [['ars',2],['phos',2],['bry',1],['calc',1]],
'mind-fear-thunder': [['phos',3],['nat-m',2],['bry',1]],
'mind-fear-evening': [['puls',2],['calc',2],['phos',1]],
'mind-fear-evil': [['ars',2],['phos',2],['calc',1]],
'mind-anxiety-morning': [['nux-v',2],['lach',2],['ars',1]],
'mind-anxiety-evening': [['puls',2],['ars',2],['phos',1]],
'mind-anxiety-future': [['ars',2],['phos',2],['calc',1],['lyc',1]],
'mind-anxiety-fever': [['acon',3],['ars',2],['bell',1]],
'mind-anxiety-eating': [['nux-v',2],['lyc',2],['kali-c',1]],
'mind-anxiety-waking': [['lach',2],['ars',2],['nux-v',1]],
'mind-anxiety-children': [['ars',2],['calc',2],['phos',1]],
'mind-anxiety-chill': [['acon',2],['ars',2],['puls',1]],
'mind-anxiety-flatus': [['lyc',2],['nux-v',2],['kali-c',1]],
'mind-anxiety-night-3am': [['kali-c',3],['ars',2],['nux-v',1]],
'mind-anger-trifles': [['nux-v',3],['cham',2],['staph',1]],
'mind-anger-trembling': [['nux-v',2],['staph',2],['ign',1]],
'mind-anger-morning': [['nux-v',3],['lyc',2],['bry',1]],
'mind-anger-ailments-from': [['staph',3],['coloc',2],['nux-v',2],['ign',1]],
'mind-anger-evening': [['nux-v',2],['lyc',2],['bry',1]],
'mind-irritability-morning': [['nux-v',3],['bry',2],['lyc',1]],
'mind-irritability-headache': [['nux-v',2],['bry',2],['bell',1]],
'mind-irritability-chill': [['acon',2],['nux-v',2],['bry',1]],
'mind-irritability-eating': [['nux-v',2],['lyc',2],['chin',1]],
'mind-irritability-coition': [['sep',2],['nat-m',2],['staph',1]],
'mind-weeping-causeless': [['puls',2],['nat-m',2],['ign',1],['sep',1]],
'mind-weeping-consolation-agg': [['nat-m',3],['sep',2],['ign',1]],
'mind-weeping-sleep': [['cham',2],['puls',2],['ign',1]],
'mind-weeping-anger': [['staph',2],['ign',2],['nux-v',1]],
'mind-timidity-public': [['gels',3],['lyc',2],['sil',1],['bar-c',1]],
'mind-dullness-morning': [['nux-v',2],['phos',2],['lyc',1]],
'mind-sensitive-criticism': [['staph',3],['nat-m',2],['ign',1]],
'mind-unconsciousness-vertigo': [['phos',2],['bell',2],['acon',1]],

// ═══ VERTIGO ═══
'vertigo-morning-rising': [['bry',3],['nux-v',2],['phos',1],['con',1]],
'vertigo-morning-bed': [['con',3],['bry',2],['nux-v',1]],
'vertigo-evening': [['puls',2],['phos',2],['lyc',1]],
'vertigo-looking-up': [['puls',2],['sil',2],['calc',1]],
'vertigo-rising-stooping': [['bell',3],['bry',2],['lyc',1]],
'vertigo-rising-seat': [['bry',2],['phos',2],['nux-v',1]],
'vertigo-walking-open-air': [['puls',2],['phos',2],['nat-m',1]],
'vertigo-stoop': [['bell',2],['bry',2],['nux-v',1]],
'vertigo-high-places': [['arg-n',3],['phos',2],['sulph',1]],

// ═══ HEAD ═══
'head-pain-dull': [['gels',2],['nat-m',2],['bry',1],['nux-v',1]],
'head-pain-shooting': [['bell',2],['spig',2],['mag-p',1]],
'head-pain-sore-bruised': [['arn',3],['chin',2],['nux-v',1]],
'head-pain-tension': [['nux-v',2],['nat-m',2],['ign',1],['gels',1]],
'head-pain-ice-cream': [['puls',2],['calc',2],['bell',1]],
'head-pain-sides': [['spig',3],['sep',2],['nat-m',1],['puls',1]],
'head-pain-mental-exertion': [['nat-m',3],['phos',2],['calc',1],['nux-v',1]],
'head-pain-reading': [['nat-m',2],['phos',2],['ruta',1]],
'head-pain-alcohol': [['nux-v',3],['lach',2],['sulph',1]],
'head-pain-eyestrain': [['ruta',3],['nat-m',2],['phos',1]],
'head-pain-emotional': [['ign',3],['nat-m',2],['staph',1]],
'head-heaviness-forehead': [['gels',2],['nux-v',2],['bry',1]],
'head-heaviness-morning': [['nux-v',2],['lach',2],['bry',1]],
'head-hair-falling-childbirth': [['nat-m',3],['sep',2],['calc',1],['phos',1]],
'head-hair-gray-early': [['lyc',2],['phos',2],['nat-m',1]],
'head-migraine-left': [['spig',3],['lach',2],['sep',1],['nat-m',1]],
'head-migraine-stress': [['ign',2],['nux-v',2],['nat-m',1]],
'head-migraine-food': [['nux-v',2],['puls',2],['lyc',1]],

// ═══ EYE ═══
'eye-pain-stitching': [['spig',3],['bell',2],['bry',1]],
'eye-pain-aching': [['ruta',2],['nat-m',2],['phos',1]],
'eye-pain-screen': [['ruta',3],['nat-m',2],['phos',1]],
'eye-swelling-lower': [['apis',2],['phos',2],['ars',1]],
'eye-stye-recurrent': [['staph',3],['sil',2],['puls',1]],
'eye-stye-upper': [['staph',2],['puls',2],['sil',1]],
'eye-stye-lower': [['staph',2],['graph',2],['phos',1]],
'eye-cataract-diabetic': [['phos',2],['sil',2],['calc',1]],
'eye-dryness-contact-lens': [['nat-m',2],['puls',2],['arg-n',1]],
'eye-dryness-screen': [['nat-m',2],['ruta',2],['phos',1]],

// ═══ VISION ═══
'vision-dim-reading': [['ruta',3],['nat-m',2],['phos',1]],
'vision-blurred': [['gels',2],['phos',2],['nat-m',1]],
'vision-loss-sudden': [['phos',3],['bell',2],['acon',1]],
'vision-loss-exertion': [['phos',2],['chin',2],['gels',1]],
'vision-weak': [['phos',2],['ruta',2],['nat-m',1],['chin',1]],
'vision-myopia': [['phos',2],['ruta',2],['nat-m',1]],
'vision-hypermetropia': [['arg-n',2],['ruta',2],['calc',1]],

// ═══ EAR ═══
'ear-pain-tearing': [['merc',2],['bell',2],['puls',1]],
'ear-pain-night': [['merc',3],['bell',2],['puls',1]],
'ear-discharge-bloody': [['merc',2],['bell',2],['phos',1]],
'ear-discharge-chronic': [['sil',3],['merc',2],['hep',1]],
'ear-inflammation-externa': [['merc',2],['hep',2],['bell',1]],
'ear-noises-singing': [['chin',2],['phos',2],['nat-m',1]],
'ear-hearing-impaired-catarrh': [['puls',3],['merc',2],['kali-bi',2]],

// ═══ NOSE ═══
'nose-pain-bones': [['kali-bi',3],['hep',2],['merc',1]],

// ═══ FACE ═══
'face-pain-jaw': [['mag-p',2],['spig',2],['bell',1]],
'face-pain-trigeminal': [['mag-p',3],['spig',2],['acon',2],['bell',1]],
'face-pain-dental': [['hep',2],['merc',2],['bell',1]],
'face-pain-tmj': [['rhus-t',2],['mag-p',2],['bry',1]],
'face-swelling-one-sided': [['bell',2],['merc',2],['lach',1]],
'face-swelling-allergic': [['apis',3],['ars',2],['nat-m',1]],
'face-swelling-dental': [['hep',3],['merc',2],['sil',1]],
'face-eruptions-pimples': [['hep',2],['sulph',2],['sil',1]],
'face-eruptions-chin': [['sep',2],['graph',2],['sulph',1]],
'face-eruptions-forehead': [['sulph',2],['nit-ac',2],['hep',1]],
'face-red': [['bell',3],['acon',2],['sulph',1]],
'face-yellow': [['chin',2],['lyc',2],['merc',1],['sep',1]],
'face-cyanotic': [['carb-v',3],['lach',2],['ars',1]],
'face-earthy': [['chin',2],['ars',2],['merc',1]],
'face-lips-dry': [['bry',3],['nat-m',2],['ars',1]],

// ═══ MOUTH ═══
'mouth-dryness-thirst': [['bry',3],['ars',2],['nat-m',1]],

// ═══ EXT-THROAT ═══
'ext-throat-goitre-exophthalmic': [['iod',3],['nat-m',2],['lyc',1]],

// ═══ STOMACH ═══
'stomach-pain-eating': [['nux-v',3],['lyc',2],['bry',1],['puls',1]],
'stomach-pain-sore': [['arn',2],['bry',2],['nux-v',1]],
'stomach-pain-ulcer': [['ars',3],['nux-v',2],['lyc',1],['kali-bi',2]],

// ═══ ABDOMEN ═══
'abdomen-pain-cutting': [['coloc',3],['bell',2],['nux-v',1]],
'abdomen-pain-stitching': [['bry',3],['kali-c',2],['bell',1]],
'abdomen-pain-colicky': [['coloc',3],['mag-p',2],['cham',2],['nux-v',1]],
'abdomen-pain-sore': [['arn',2],['bry',2],['bell',1]],
'abdomen-pain-right-iliac': [['bell',2],['bry',2],['lyc',1]],
'abdomen-pain-left-iliac': [['coloc',2],['lyc',2],['nux-v',1]],
'abdomen-pain-umbilical': [['calc',2],['nux-v',2],['chin',1]],
'abdomen-pain-flatus-amel': [['lyc',3],['chin',2],['carb-v',1]],
'abdomen-pain-bending-double-amel': [['coloc',3],['mag-p',2],['staph',1]],
'abdomen-distension-eating': [['lyc',3],['chin',2],['nux-v',1],['carb-v',1]],
'abdomen-distension-flatus': [['lyc',3],['carb-v',2],['chin',1]],
'abdomen-distension-tympanitic': [['lyc',2],['carb-v',2],['chin',1]],
'abdomen-distension-gas': [['lyc',3],['chin',2],['carb-v',1]],
'abdomen-distension-after-eating': [['lyc',3],['nux-v',2],['chin',1]],
'abdomen-flatulence-obstructed': [['lyc',3],['nux-v',2],['carb-v',1]],
'abdomen-flatulence-loud': [['lyc',2],['arg-n',2],['chin',1]],
'abdomen-flatulence-trapped': [['lyc',3],['nux-v',2],['chin',1]],
'abdomen-flatulence-bloating': [['lyc',3],['carb-v',2],['chin',2]],
'abdomen-liver-enlarged': [['lyc',2],['chin',2],['merc',1],['chel',2]],
'abdomen-liver-pain': [['lyc',2],['chin',2],['chel',2],['nux-v',1]],
'abdomen-liver-cirrhosis': [['lyc',2],['phos',2],['ars',1],['chin',1]],
'abdomen-liver-fatty': [['lyc',2],['nux-v',2],['chel',2],['phos',1]],
'abdomen-liver-hepatitis': [['lyc',2],['merc',2],['chin',1],['phos',1]],
'abdomen-spleen-enlarged': [['chin',3],['ars',2],['nat-m',1]],
'abdomen-spleen-pain': [['chin',3],['arn',2],['nat-m',1]],
'abdomen-hernia-inguinal': [['nux-v',3],['lyc',2],['calc',1]],
'abdomen-hernia-umbilical': [['nux-v',2],['calc',2],['sil',1]],
'abdomen-hernia-hiatal': [['nux-v',2],['lyc',2],['carb-v',1]],
'abdomen-appendicitis-chronic': [['bell',2],['bry',2],['ars',1]],
'abdomen-gallstones-colic': [['lyc',3],['chin',2],['chel',2],['nux-v',1]],
'abdomen-gallstones-jaundice': [['lyc',2],['merc',2],['chin',1],['chel',2]],

// ═══ STOOL ═══
'stool-hard-dry': [['bry',3],['nux-v',2],['sulph',1]],
'stool-hard-balls': [['graph',2],['sep',2],['nat-m',1]],
'stool-hard-large': [['sulph',2],['bry',2],['graph',1]],
'stool-color-green': [['cham',3],['merc',2],['ip',1]],
'stool-color-yellow': [['chin',2],['merc',2],['puls',1]],
'stool-color-white': [['merc',2],['phos',2],['chel',2]],
'stool-color-black': [['chin',2],['ars',2],['lach',1]],

// ═══ MALE ═══
'male-pain-testes-drawing': [['puls',2],['rhus-t',2],['nux-v',1]],

// ═══ CHEST ═══
'chest-pain-pressing': [['bry',2],['phos',2],['kali-c',1]],
'chest-pain-sternum': [['bry',2],['phos',2],['kali-c',1]],
'chest-pain-sore': [['arn',2],['bry',2],['phos',1]],
'chest-pain-exertion': [['ars',2],['spig',2],['phos',1]],
'chest-pain-costochondral': [['arn',2],['bry',2],['ruta',1]],
'chest-pain-heart-walking': [['spig',2],['ars',2],['lach',1]],

// ═══ BACK ═══
'back-pain-lifting': [['rhus-t',3],['bry',2],['calc',1]],
'back-pain-motion-amel': [['rhus-t',3],['kali-c',2],['sep',1]],
'back-pain-morning': [['nux-v',3],['rhus-t',2],['kali-c',1]],
'back-pain-night': [['kali-c',2],['merc',2],['rhus-t',1]],
'back-pain-rheumatic': [['rhus-t',3],['bry',2],['kali-c',1]],
'back-pain-weakness': [['kali-c',2],['phos',2],['calc',1]],
'back-pain-bruised': [['arn',3],['rhus-t',2],['nux-v',1]],

// ═══ EXTREMITIES ═══
'ext-pain-elbow': [['rhus-t',2],['bry',2],['ruta',1]],
'ext-pain-calves': [['rhus-t',2],['mag-p',2],['calc',1]],
'ext-pain-growing': [['calc-p',3],['calc',2],['phos',1]],
'ext-pain-wandering': [['puls',3],['kali-bi',2],['rhus-t',1]],
'ext-pain-gout-acute': [['colch',3],['led',2],['bry',1]],
'ext-pain-gout-chronic': [['lyc',2],['led',2],['sulph',1]],
'ext-pain-gout-big-toe': [['colch',3],['led',2],['lyc',1]],
'ext-swelling-foot': [['apis',2],['puls',2],['lyc',1]],
'ext-restlessness-legs': [['rhus-t',3],['ars',2],['sep',1]],
'ext-numbness-fingers': [['phos',2],['rhus-t',2],['sil',1]],
'ext-numbness-legs': [['phos',2],['rhus-t',2],['nux-v',1]],
'ext-numbness-toes': [['phos',2],['calc',2],['lyc',1]],
'ext-numbness-arms': [['rhus-t',2],['phos',2],['acon',1]],
'ext-numbness-hands-morning': [['lyc',2],['rhus-t',2],['phos',1]],
'ext-numbness-carpal-tunnel': [['rhus-t',2],['ruta',2],['caust',1]],
'ext-varicose-veins-painful': [['lach',2],['puls',2],['ham',2]],
'ext-varicose-veins-pregnancy': [['puls',2],['sep',2],['ham',2]],
'ext-varicose-veins-ulcerated': [['lach',3],['ars',2],['puls',1]],
'ext-ganglion': [['ruta',3],['sil',2],['calc',1]],
'ext-nails-fungal': [['graph',2],['sil',2],['thuj',1]],
'ext-nails-discolored': [['graph',2],['sil',2],['thuj',1]],
'ext-corns': [['ant-c',3],['graph',2],['sil',1]],
'ext-corns-painful': [['ant-c',2],['graph',2],['sil',1]],
'ext-corns-toes': [['ant-c',2],['graph',2],['sil',1]],

// ═══ SLEEP ═══
'sleep-dreams-vivid': [['phos',2],['nat-m',2],['sulph',1]],
'sleep-dreams-nightmares': [['acon',2],['bell',2],['ars',1],['nux-v',1]],
'sleep-dreams-death': [['ars',2],['lach',2],['phos',1]],
'sleep-dreams-falling': [['bell',2],['calc',2],['thuj',1]],
'sleep-dreams-snakes': [['lach',2],['arg-n',2],['calc',1]],
'sleep-dreams-water': [['phos',2],['merc',2],['ars',1]],
'sleep-dreams-fire': [['bell',2],['ars',2],['phos',1]],
'sleep-insomnia-elderly': [['phos',2],['ars',2],['kali-c',1]],
'sleep-insomnia-menopause': [['sep',3],['lach',2],['sulph',1]],
'sleep-insomnia-pregnancy': [['puls',2],['sep',2],['acon',1]],
'sleep-insomnia-children': [['cham',3],['bell',2],['calc',1]],
'sleep-restless': [['ars',2],['rhus-t',2],['acon',1]],
'sleep-snoring': [['nux-v',2],['lyc',2],['op',1]],
'sleep-position-back': [['puls',2],['nat-m',2],['nux-v',1]],
'sleep-grinding-teeth': [['cham',2],['bell',2],['cina',2]],
'sleep-apnoea': [['lach',2],['op',2],['nux-v',1]],
'sleep-talking': [['bell',2],['kali-c',2],['phos',1]],
'sleep-walking': [['phos',2],['sil',2],['nat-m',1]],

// ═══ PERSPIRATION ═══
'persp-morning-waking': [['nux-v',2],['sep',2],['calc',1]],
'persp-cold-anxiety': [['ars',3],['acon',2],['phos',1]],

// ═══ SKIN ═══
'skin-eruptions-scaly': [['ars',2],['sulph',2],['graph',1]],
'skin-eruptions-papular': [['ant-c',2],['sulph',2],['merc',1]],
'skin-eruptions-herpetic': [['rhus-t',3],['nat-m',2],['graph',1]],
'skin-eruptions-petechial': [['phos',2],['arn',2],['lach',1]],
'skin-eruptions-diaper': [['cham',2],['sulph',2],['merc',1]],
'skin-eruptions-contact': [['sulph',2],['rhus-t',2],['apis',1]],
'skin-eruptions-seborrheic': [['graph',3],['sulph',2],['nat-m',1]],
'skin-eruptions-pityriasis': [['ars',2],['sulph',2],['nat-m',1]],
'skin-eruptions-measles': [['puls',3],['acon',2],['bry',1]],
'skin-eruptions-molluscum': [['thuj',3],['sil',2],['sulph',1]],
'skin-itching-senile': [['sulph',2],['ars',2],['merc',1]],
'skin-ulcers-indolent': [['sil',3],['ars',2],['nit-ac',1]],
'skin-ulcers-diabetic': [['ars',2],['sil',2],['nit-ac',1]],
'skin-ulcers-bedsore': [['ars',3],['sil',2],['carb-v',1]],
'skin-dryness-winter': [['graph',2],['sulph',2],['nat-m',1]],
'skin-discoloration-spots': [['sep',2],['lyc',2],['sulph',1]],
'skin-discoloration-liver-spots': [['sep',3],['lyc',2],['sulph',1]],
'skin-discoloration-vitiligo': [['ars',2],['phos',2],['nat-m',1],['sil',1]],
'skin-discoloration-chloasma': [['sep',3],['lyc',2],['puls',1]],
'skin-fungal-ringworm': [['sulph',2],['graph',2],['sep',1],['tell',2]],
'skin-fungal-tinea': [['graph',2],['sulph',2],['sep',1]],
'skin-abscess-recurrent': [['sil',3],['hep',2],['sulph',1]],
'skin-cracks-hands': [['graph',3],['nat-m',2],['sil',1]],
'skin-cracks-feet': [['graph',3],['sil',2],['sulph',1]],

// ═══ GENERALITIES ═══
'gen-weakness-morning': [['nux-v',2],['phos',2],['chin',1]],
'gen-weakness-exertion': [['ars',2],['phos',2],['calc',1]],
'gen-weakness-diarrhoea': [['chin',3],['ars',2],['phos',1]],
'gen-weakness-fever': [['chin',3],['ars',2],['gels',1]],
'gen-weakness-menses': [['sep',2],['chin',2],['calc',1]],
'gen-weakness-nervous': [['phos',2],['kali-c',2],['gels',1]],
'gen-weakness-sudden': [['ars',2],['carb-v',2],['phos',1]],
'gen-weakness-post-surgery': [['staph',3],['arn',2],['chin',1]],
'gen-faintness-pain': [['cham',2],['ign',2],['acon',1]],
'gen-oedema': [['apis',3],['ars',2],['lyc',1]],
'gen-injuries-bites': [['led',3],['hyper',2],['apis',1]],
'gen-diabetes-weakness': [['phos',2],['ars',2],['lyc',1]],

// ═══ HEARING ═══
'hearing-acute': [['nux-v',3],['bell',2],['acon',1]],
'hearing-acute-noise': [['nux-v',3],['bell',2],['acon',1]],
'hearing-acute-music': [['nat-m',2],['graph',2],['ign',1]],

// ═══ ENDOCRINE ═══
'endo-pcos': [['sep',3],['puls',2],['calc',1],['nat-m',1]],

// ═══ MENTAL HEALTH ═══
'mh-panic-attack': [['acon',3],['arg-n',2],['ars',2],['ign',1]],
'mh-ocd': [['ars',2],['nux-v',2],['sil',1],['thuj',1]],
'mh-separation-anxiety': [['puls',3],['phos',2],['calc',1]],
'mh-anxiety-morning-waking': [['lach',2],['ars',2],['nux-v',1]],
'mh-ptsd-nightmares': [['arn',2],['acon',2],['staph',1],['ign',1]],

// ═══ DERMATOLOGY ═══
'derm-vitiligo': [['ars',2],['phos',2],['nat-m',1],['sil',1]],
'derm-acne-vulgaris': [['hep',2],['sulph',2],['sil',1]],
'derm-acne-cystic': [['hep',3],['sil',2],['sulph',1]],
'derm-acne-rosacea': [['ars',2],['sulph',2],['puls',1]],
'derm-acne-back': [['sulph',2],['hep',2],['sil',1]],
'derm-acne-scars': [['sil',3],['graph',2],['thuj',1]],
'derm-acne-forehead': [['sulph',2],['hep',2],['nux-v',1]],
'derm-acne-chin': [['sep',2],['graph',2],['sulph',1]],
'derm-acne-chest': [['sulph',2],['hep',2],['sil',1]],
'derm-acne-shoulders': [['sulph',2],['hep',2],['sil',1]],
'derm-psoriasis-scalp': [['graph',3],['sulph',2],['ars',1]],
'derm-psoriasis-guttate': [['ars',2],['sulph',2],['phos',1]],
'derm-psoriasis-plaque': [['sulph',2],['graph',2],['ars',1]],
'derm-psoriasis-nail': [['graph',2],['sil',2],['sep',1]],
'derm-psoriasis-inverse': [['sulph',2],['graph',2],['sep',1]],
'derm-psoriasis-palmar': [['graph',2],['ars',2],['sulph',1]],
'derm-psoriasis-elbow': [['sulph',2],['graph',2],['ars',1]],
'derm-psoriasis-knee': [['sulph',2],['graph',2],['ars',1]],
'derm-psoriasis-winter': [['ars',2],['sulph',2],['graph',1]],
'derm-psoriasis-stress': [['ars',2],['sulph',2],['nat-m',1]],
'derm-eczema-hands': [['graph',3],['sulph',2],['nat-m',1]],
'derm-eczema-face': [['graph',2],['nat-m',2],['sulph',1]],
'derm-eczema-flexures': [['graph',3],['sulph',2],['ars',1]],
'derm-eczema-seborrheic': [['graph',3],['sulph',2],['nat-m',1]],
'derm-eczema-nummular': [['ars',2],['graph',2],['sulph',1]],
'derm-eczema-weeping': [['graph',3],['sulph',2],['merc',1]],
'derm-eczema-dry': [['graph',2],['sulph',2],['ars',1]],
'derm-eczema-scalp': [['graph',3],['sulph',2],['merc',1]],
'derm-eczema-eyelids': [['graph',3],['staph',2],['sulph',1]],
'derm-eczema-ear': [['graph',3],['merc',2],['sulph',1]],
'derm-eczema-ankle': [['graph',2],['sulph',2],['nat-m',1]],
'derm-vitiligo-spreading': [['ars',2],['phos',2],['sil',1]],
'derm-vitiligo-face': [['ars',2],['nat-m',2],['phos',1]],
'derm-vitiligo-hands': [['ars',2],['nat-m',2],['sil',1]],
'derm-lichen-planus': [['sulph',2],['ars',2],['merc',1]],
'derm-lichen-oral': [['merc',2],['nit-ac',2],['sulph',1]],
'derm-lichen-skin': [['sulph',2],['ars',2],['nat-m',1]],
'derm-lichen-nail': [['graph',2],['sil',2],['sulph',1]],
'derm-lichen-genital': [['thuj',2],['nit-ac',2],['sulph',1]],
'derm-herpes-simplex': [['nat-m',3],['rhus-t',2],['graph',1]],
'derm-herpes-genital': [['nat-m',2],['thuj',2],['nit-ac',1]],
'derm-herpes-lip': [['nat-m',3],['rhus-t',2],['sep',1]],
'derm-herpes-nose': [['nat-m',2],['graph',2],['sep',1]],
'derm-shingles-pain': [['rhus-t',2],['ars',2],['merc',1]],
'derm-shingles-post-herpetic': [['rhus-t',2],['ars',2],['hyper',2]],
'derm-shingles-face': [['rhus-t',2],['bell',2],['merc',1]],
'derm-fungal': [['sulph',2],['graph',2],['sep',1]],
'derm-ringworm-body': [['sulph',2],['sep',2],['graph',1],['tell',2]],
'derm-ringworm-scalp': [['sulph',2],['graph',2],['sil',1]],
'derm-athlete-foot': [['sil',2],['graph',2],['sulph',1]],
'derm-jock-itch': [['sulph',2],['graph',2],['nat-m',1]],
'derm-candida-skin': [['sulph',2],['merc',2],['graph',1]],
'derm-fungal-intertrigo': [['graph',2],['sulph',2],['sep',1]],
'derm-fungal-groin': [['sulph',2],['graph',2],['nat-m',1]],
'derm-alopecia-areata': [['phos',2],['nat-m',2],['sil',1]],
'derm-alopecia-male': [['lyc',2],['phos',2],['nat-m',1]],
'derm-alopecia-female': [['sep',2],['nat-m',2],['phos',1]],
'derm-alopecia-postpartum': [['nat-m',3],['sep',2],['calc',1]],
'derm-alopecia-chemotherapy': [['phos',2],['nat-m',2],['chin',1]],
'derm-alopecia-stress': [['phos',2],['nat-m',2],['ign',1]],
'derm-hyperhidrosis': [['sil',2],['calc',2],['merc',1]],
'derm-hyperhidrosis-palms': [['sil',3],['calc',2],['merc',1]],
'derm-hyperhidrosis-feet': [['sil',3],['graph',2],['sulph',1]],
'derm-hyperhidrosis-axillae': [['sil',2],['calc',2],['hep',1]],

// ═══ SPORTS ═══
'sport-sprain-ankle': [['arn',3],['rhus-t',2],['ruta',2],['led',1]],

// ═══ IMMUNE ═══
'immune-allergy-dust': [['ars',3],['nat-m',2],['puls',1]],
'immune-allergy-pollen': [['ars',2],['nat-m',2],['puls',1]],
'immune-allergy-food': [['nux-v',2],['puls',2],['ars',1]],
'immune-allergy-animal': [['ars',2],['nat-m',2],['puls',1]],
'immune-allergy-drug': [['nux-v',2],['sulph',2],['ars',1]],
'immune-allergy-mold': [['ars',2],['nat-m',2],['thuj',1]],
'immune-allergy-seasonal': [['ars',2],['nat-m',2],['puls',1]],
'immune-allergy-skin': [['sulph',2],['rhus-t',2],['apis',1]],
'immune-allergy-chemical': [['nux-v',2],['phos',2],['ars',1]],
'immune-allergy-insect-sting': [['apis',3],['led',2],['arn',1]],
'immune-allergy-latex': [['apis',2],['sulph',2],['ars',1]],
'immune-allergy-penicillin': [['nux-v',2],['sulph',2],['ars',1]],
'immune-allergy-shellfish': [['ars',2],['apis',2],['puls',1]],
'immune-hay-fever-spring': [['ars',2],['nat-m',2],['puls',1]],
'immune-hay-fever-autumn': [['ars',2],['nat-m',2],['puls',1]],
'immune-hay-fever-eyes': [['nat-m',3],['ars',2],['puls',1]],
'immune-hay-fever-perennial': [['ars',2],['nat-m',2],['sil',1]],
'immune-autoimmune': [['ars',2],['phos',2],['sulph',1]],
'immune-lupus': [['ars',2],['phos',2],['nat-m',1]],
'immune-hashimoto': [['calc',2],['nat-m',2],['sep',1]],
'immune-ms': [['phos',2],['caust',2],['nat-m',1]],
'immune-ra': [['rhus-t',2],['bry',2],['caust',1],['calc',1]],
'immune-crohn': [['ars',2],['nit-ac',2],['lyc',1]],
'immune-ulcerative-colitis': [['merc',2],['nit-ac',2],['ars',1]],
'immune-celiac-autoimmune': [['chin',2],['lyc',2],['nat-m',1]],
'immune-vitiligo-autoimmune': [['ars',2],['phos',2],['sil',1]],
'immune-alopecia-autoimmune': [['phos',2],['nat-m',2],['sil',1]],
'immune-sarcoidosis': [['phos',2],['calc',2],['sulph',1]],
'immune-post-illness': [['chin',3],['calc',2],['phos',1]],
'immune-post-antibiotic': [['nux-v',2],['sulph',2],['chin',1]],
'immune-post-steroid': [['nux-v',2],['sulph',2],['calc',1]],
'immune-urticaria-acute': [['apis',3],['ars',2],['puls',1]],
'immune-urticaria-chronic': [['ars',2],['nat-m',2],['sulph',1]],
'immune-urticaria-heat': [['apis',2],['puls',2],['sulph',1]],
'immune-urticaria-exercise': [['apis',2],['nat-m',2],['ars',1]],
'immune-urticaria-food': [['apis',2],['nux-v',2],['ars',1]],
'immune-urticaria-stress': [['ars',2],['ign',2],['nat-m',1]],
'immune-urticaria-sun': [['nat-m',3],['apis',2],['sulph',1]],

// ═══ NERVOUS ═══
'nerv-post-herpetic': [['ars',2],['rhus-t',2],['hyper',2]],
'nerv-epilepsy-grand-mal': [['bell',2],['calc',2],['sil',1]],
'nerv-epilepsy-aura': [['calc',2],['sil',2],['phos',1]],
'nerv-epilepsy-head-injury': [['nat-s',3],['hyper',2],['arn',1]],
'nerv-bells-palsy-right': [['caust',3],['bell',2],['acon',1]],
'nerv-bells-palsy-left': [['caust',2],['lach',2],['acon',1]],
'nerv-migraine-cluster': [['bell',2],['spig',2],['ars',1]],
'nerv-migraine-tension': [['nux-v',2],['nat-m',2],['ign',1]],
'nerv-migraine-sinus': [['kali-bi',3],['hep',2],['merc',1]],
'nerv-migraine-cervicogenic': [['rhus-t',2],['bry',2],['nux-v',1]],
'nerv-migraine-vestibular': [['con',2],['phos',2],['gels',1]],
'nerv-tinnitus-pulsatile': [['chin',2],['phos',2],['bell',1]],
'nerv-tinnitus-medication': [['chin',2],['phos',2],['nux-v',1]],
'nerv-tinnitus-low-hum': [['chin',2],['nat-m',2],['phos',1]],
'nerv-vestibular': [['con',2],['gels',2],['phos',1]],
'nerv-rls-iron-deficiency': [['rhus-t',2],['chin',2],['ars',1]],

// ═══ GI ═══
'gi-ibs': [['nux-v',2],['lyc',2],['arg-n',1]],
'gi-ibs-constipation': [['nux-v',3],['lyc',2],['bry',1]],
'gi-ibs-alternating': [['nux-v',2],['sulph',2],['aloe',1]],
'gi-ibs-bloating': [['lyc',3],['chin',2],['carb-v',1]],
'gi-ibs-stress': [['arg-n',2],['nux-v',2],['ign',1]],
'gi-ibs-mucus': [['merc',2],['aloe',2],['nux-v',1]],
'gi-ibs-morning-rush': [['aloe',3],['sulph',2],['nux-v',1]],
'gi-ibs-post-meal': [['lyc',2],['nux-v',2],['chin',1]],
'gi-ibs-flatulence': [['lyc',3],['carb-v',2],['chin',1]],
'gi-ibs-anxiety-related': [['arg-n',3],['nux-v',2],['ign',1]],
'gi-gerd': [['nux-v',3],['lyc',2],['ars',1]],
'gi-gerd-night': [['ars',2],['nux-v',2],['phos',1]],
'gi-gerd-chronic': [['lyc',2],['nux-v',2],['sulph',1]],
'gi-crohn': [['ars',2],['nit-ac',2],['merc',1]],
'gi-crohn-abdominal': [['ars',2],['coloc',2],['nit-ac',1]],
'gi-crohn-fistula': [['sil',2],['nit-ac',2],['hep',1]],
'gi-crohn-weight-loss': [['ars',2],['phos',2],['chin',1]],
'gi-colitis': [['merc',2],['nit-ac',2],['ars',1]],
'gi-colitis-bloody': [['merc',2],['nit-ac',2],['phos',1]],
'gi-colitis-tenesmus': [['merc',2],['aloe',2],['nux-v',1]],
'gi-colitis-mucus': [['merc',2],['aloe',2],['nit-ac',1]],
'gi-celiac': [['chin',2],['lyc',2],['calc',1]],
'gi-celiac-bloating': [['lyc',2],['chin',2],['calc',1]],
'gi-celiac-weight-loss': [['chin',2],['ars',2],['lyc',1]],
'gi-celiac-anemia': [['chin',3],['ars',2],['phos',1]],
'gi-diverticulitis': [['bry',2],['nux-v',2],['bell',1]],
'gi-gastroenteritis': [['ars',3],['ip',2],['nux-v',1]],
'gi-gastro-viral': [['ars',2],['ip',2],['bry',1]],
'gi-gastro-food-poisoning': [['ars',3],['nux-v',2],['ip',1]],
'gi-gastro-traveler': [['ars',3],['nux-v',2],['chin',1]],
'gi-gastro-rotavirus': [['ars',2],['ip',2],['cham',1]],
'gi-food-intolerance': [['nux-v',2],['lyc',2],['chin',1]],
'gi-candida': [['sulph',2],['nux-v',2],['merc',1]],
'gi-sibo': [['lyc',2],['nux-v',2],['chin',1]],

// ═══ MSK ═══
'msk-frozen-shoulder': [['rhus-t',3],['bry',2],['calc',1]],
'msk-frozen-shoulder-right': [['rhus-t',2],['bry',2],['lyc',1]],
'msk-frozen-shoulder-left': [['rhus-t',2],['bry',2],['lach',1]],
'msk-frozen-shoulder-post-injury': [['rhus-t',2],['ruta',2],['arn',1]],
'msk-tennis-elbow': [['ruta',3],['rhus-t',2],['bry',1]],
'msk-carpal-tunnel': [['ruta',2],['rhus-t',2],['caust',1]],
'msk-carpal-tunnel-tingling': [['ruta',2],['phos',2],['rhus-t',1]],
'msk-plantar-fasciitis': [['rhus-t',3],['ruta',2],['calc',1]],
'msk-plantar-morning': [['rhus-t',3],['ruta',2],['calc',1]],
'msk-heel-spur': [['calc',3],['ruta',2],['rhus-t',1]],
'msk-plantar-chronic': [['rhus-t',2],['ruta',2],['sil',1]],
'msk-fibromyalgia': [['rhus-t',2],['bry',2],['ars',1]],
'msk-fibro-tender-points': [['rhus-t',2],['arn',2],['bry',1]],
'msk-fibro-fatigue': [['ars',2],['phos',2],['chin',1]],
'msk-fibro-fog': [['phos',2],['lyc',2],['nat-m',1]],
'msk-fibro-sleep': [['rhus-t',2],['ars',2],['kali-c',1]],
'msk-osteoporosis': [['calc',3],['sil',2],['phos',1]],
'msk-osteoporosis-postmenopausal': [['calc',3],['sep',2],['phos',1]],
'msk-osteoporosis-steroid': [['calc',2],['phos',2],['sil',1]],
'msk-ankylosing-spondylitis': [['rhus-t',2],['kali-c',2],['calc',1]],
'msk-bursitis': [['rhus-t',2],['bry',2],['ruta',1]],
'msk-bursitis-shoulder': [['rhus-t',2],['bry',2],['ruta',1]],
'msk-bursitis-knee': [['apis',2],['bry',2],['rhus-t',1]],
'msk-bursitis-hip': [['rhus-t',2],['bry',2],['calc',1]],
'msk-bursitis-elbow': [['ruta',2],['bry',2],['rhus-t',1]],
'msk-bursitis-trochanteric': [['rhus-t',2],['bry',2],['calc',1]],
'msk-tendonitis': [['ruta',3],['rhus-t',2],['bry',1]],
'msk-achilles': [['ruta',3],['rhus-t',2],['lyc',1]],
'msk-tendonitis-rotator': [['rhus-t',2],['ruta',2],['bry',1]],
'msk-tendonitis-wrist': [['ruta',3],['rhus-t',2],['bry',1]],
'msk-tendonitis-patellar': [['ruta',2],['rhus-t',2],['bry',1]],
'msk-disc-prolapse': [['rhus-t',2],['bry',2],['kali-c',1]],
'msk-disc-lumbar': [['rhus-t',2],['bry',2],['kali-c',1]],
'msk-disc-cervical': [['rhus-t',2],['bry',2],['kali-c',1]],
'msk-disc-thoracic': [['kali-c',2],['bry',2],['rhus-t',1]],
'msk-disc-sciatica': [['rhus-t',3],['bry',2],['coloc',1]],
'msk-whiplash': [['rhus-t',2],['arn',2],['hyper',1]],
'msk-spondylosis-cervical': [['rhus-t',2],['kali-c',2],['calc',1]],
'msk-spondylosis-lumbar': [['rhus-t',2],['kali-c',2],['calc',1]],
'msk-spondylosis-thoracic': [['kali-c',2],['bry',2],['rhus-t',1]],
'msk-costochondritis': [['arn',2],['bry',2],['ruta',1]],
'msk-tmj': [['rhus-t',2],['mag-p',2],['bry',1]],

// ═══ DENTAL ═══
'dental-tmj-pain': [['rhus-t',2],['mag-p',2],['bry',1]],
'dental-halitosis': [['merc',3],['nux-v',2],['puls',1]],

// ═══ ONCOLOGY ═══
'onc-chemo-side-effects': [['nux-v',2],['ars',2],['ip',1]],
'onc-radiation-effects': [['phos',2],['ars',2],['sil',1]],
'onc-hair-loss-chemo': [['phos',2],['nat-m',2],['chin',1]],
'onc-mouth-ulcers-chemo': [['merc',2],['nit-ac',2],['ars',1]],
'onc-appetite-loss': [['chin',2],['ars',2],['lyc',1]],
'onc-tumors-benign': [['calc',2],['sil',2],['thuj',1]],
'onc-lipoma': [['calc',2],['thuj',2],['bar-c',1]],
'onc-fibroma': [['calc',2],['sil',2],['thuj',1]],
'onc-polyp': [['thuj',3],['calc',2],['sil',1]],
'onc-ganglion-cyst': [['ruta',3],['sil',2],['calc',1]],
'onc-cyst-sebaceous': [['graph',2],['sil',2],['hep',1]],
'onc-cyst-ovarian': [['apis',2],['sep',2],['puls',1],['lach',1]],
'onc-cyst-breast': [['con',2],['phos',2],['sil',1]],
'onc-cyst-kidney': [['berb',2],['lyc',2],['calc',1]],

// ═══ GERIATRICS ═══
'ger-dementia': [['bar-c',3],['con',2],['phos',1]],
'ger-alzheimer': [['bar-c',2],['con',2],['phos',1]],
'ger-vascular-dementia': [['bar-c',2],['phos',2],['lach',1]],
'ger-dementia-lewy-body': [['bar-c',2],['con',2],['phos',1]],
'ger-dementia-aggression': [['bell',2],['nux-v',2],['lach',1]],
'ger-dementia-wandering': [['bell',2],['hyos',2],['stram',1]],
'ger-bph-dribbling': [['con',2],['staph',2],['lyc',1]],
'ger-bph-frequency': [['staph',2],['lyc',2],['con',1]],
'ger-bph-retention': [['con',2],['staph',2],['lyc',1]],
'ger-bph-nocturia': [['con',2],['lyc',2],['staph',1]],
'ger-debility-after-flu': [['chin',3],['gels',2],['phos',1]],

// ═══ INFECTIOUS ═══
'inf-covid-acute': [['ars',2],['bry',2],['gels',1]],
'inf-covid-joints': [['rhus-t',2],['bry',2],['ars',1]],
'inf-covid-chest-tightness': [['bry',2],['phos',2],['ars',1]],
'inf-malaria-tertian': [['chin',3],['ars',2],['nat-m',1]],
'inf-hepatitis': [['lyc',2],['merc',2],['chin',1],['phos',1]],

// ═══ FIRST AID ═══
'fa-bruise-eye': [['arn',3],['led',2],['symph',1]],
'fa-shock-bad-news': [['ign',3],['acon',2],['gels',1]],

// ═══ CONSTITUTIONAL ═══
'const-lyc-right-sided': [['lyc',3],['bell',1],['bry',1]],

// ═══ WOUND HEALING ═══
'wh-abscess-carbuncle': [['hep',3],['sil',2],['ars',1]],

// ═══ CONNECTIVE TISSUE ═══
'ct-sjogren-joint-pain': [['rhus-t',2],['bry',2],['nat-m',1]],
'ct-polymyalgia-hips': [['rhus-t',2],['bry',2],['calc',1]],

// ═══ ENVIRONMENTAL ═══
'env-paint-fumes': [['nux-v',2],['phos',2],['ars',1]],
'env-mold-exposure': [['ars',2],['nat-s',2],['thuj',1]],

// ═══ PALLIATIVE ═══
'pall-pain-chronic': [['ars',2],['mag-p',2],['hyper',1]],

// ═══ MIASMS ═══
'miasm-tubercular-travel': [['tub',3],['phos',2],['calc',1]],

// ═══ EMOTIONAL TRAUMA ═══
'et-anticipation-chronic': [['arg-n',3],['lyc',2],['gels',1]],

// ═══ DETOX ═══
'detox-antibiotic-effects': [['nux-v',3],['sulph',2],['chin',1]],
'detox-nsaid-effects': [['nux-v',2],['lyc',2],['ars',1]],
'detox-chemo-effects': [['nux-v',2],['ars',2],['ip',1]],
'detox-oral-contraceptive': [['sep',2],['puls',2],['nat-m',1]],
'detox-heavy-metal': [['nux-v',2],['sulph',2],['phos',1]],
'detox-mercury': [['merc',2],['nux-v',2],['sulph',1]],
'detox-lead': [['alum',2],['nux-v',2],['sulph',1]],
'detox-arsenic': [['ars',2],['nux-v',2],['sulph',1]],
'detox-liver-drainage': [['lyc',2],['nux-v',2],['sulph',1]],
'detox-kidney-drainage': [['berb',3],['lyc',2],['calc',1]],
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
const empties = [];
for (const [symId, entries] of Object.entries(rubrics)) {
  if (!Array.isArray(entries) || entries.length === 0) {
    remaining++;
    empties.push(symId);
  }
}

console.log('Filled: ' + filledCount);
console.log('Remaining empty: ' + remaining);
if (remaining > 0) console.log('Still empty: ' + empties.join(', '));

fs.writeFileSync(path.join(__dirname, 'data/rubrics.json'), JSON.stringify(rubrics, null, 2));
fs.writeFileSync(path.join(__dirname, '../frontend/src/data/rubrics.json'), JSON.stringify(rubrics, null, 2));
console.log('Saved');
