/**
 * Enrichment script for remedies.json
 * Uses data from Kent Repertory abbreviation list (homeoint.org)
 * and standard homeopathic materia medica knowledge.
 */

const fs = require('fs');
const path = require('path');

const remedies = [
  {
    id: "acon", name: "Aconitum Napellus", abbr: "Acon.", kentId: 1001,
    description: "Great remedy for sudden onset of complaints from exposure to cold, dry winds or from fright. Marked by intense anxiety, fear of death, restlessness. Complaints come on violently and suddenly.",
    commonSymptoms: ["mind-fear-death", "mind-anxiety", "mind-restlessness", "fever-high-sudden", "chest-palpitation-anxiety"],
    dosage: "30C for acute conditions, 200C for intense fear states. 3-4 doses at 15-minute intervals in acute cases.",
    modalities: { worse: ["Evening", "Night", "Cold dry winds", "Fright", "Warm room"], better: ["Open air", "Rest", "Wine"] }
  },
  {
    id: "ars", name: "Arsenicum Album", abbr: "Ars.", kentId: 1015,
    description: "Marked by great restlessness with extreme weakness and prostration. Burning pains relieved by warmth. Great anxiety, fear of death, especially after midnight. Fastidious, desires sips of water.",
    commonSymptoms: ["mind-fear-death", "mind-anxiety-night", "mind-restless-midnight", "stomach-vomiting", "rectum-diarrhoea-night", "skin-eruptions", "gen-weakness"],
    dosage: "30C for acute conditions, 200C for chronic. 6C for food poisoning, repeated every 2 hours.",
    modalities: { worse: ["After midnight", "Cold", "Cold food/drinks", "Exertion", "Right side"], better: ["Warmth", "Warm drinks", "Elevating head", "Motion"] }
  },
  {
    id: "bell", name: "Belladonna", abbr: "Bell.", kentId: 1020,
    description: "Sudden, violent onset. High fever with burning heat, red face, throbbing headache, dilated pupils. Right-sided complaints. Delirium in fever. Sensitive to light, noise, and jarring.",
    commonSymptoms: ["head-pain-throbbing", "fever-high-sudden", "throat-pain-right", "eyes-photophobia", "mind-delirium-fever"],
    dosage: "30C for acute conditions. 200C for severe cases. Repeat every 2-4 hours as needed.",
    modalities: { worse: ["Afternoon (3pm)", "Sun", "Light", "Noise", "Touch", "Jarring", "Right side"], better: ["Rest", "Standing", "Bending backward"] }
  },
  {
    id: "bry", name: "Bryonia Alba", abbr: "Bry.", kentId: 1025,
    description: "All complaints worse from any motion. Dryness of all mucous membranes. Stitching pains. Irritable, wants to be left alone. Thirst for large quantities of cold water at long intervals.",
    commonSymptoms: ["head-pain-bursting", "chest-pain-stitching", "gen-motion-worse", "stomach-thirst-large-quantities", "mind-irritability", "rectum-constipation"],
    dosage: "30C for acute complaints, 200C for chronic conditions. Repeat 3 times daily.",
    modalities: { worse: ["Any motion", "Warmth", "Morning", "Eating", "Hot weather", "Touch"], better: ["Rest", "Lying on painful side", "Pressure", "Cool air", "Drawing knees up"] }
  },
  {
    id: "calc", name: "Calcarea Carbonica", abbr: "Calc.", kentId: 1030,
    description: "Constitutional remedy for fair, fat, flabby persons. Profuse perspiration of head especially during sleep. Cold damp feet. Sour-smelling body. Slow in development (children). Desires eggs.",
    commonSymptoms: ["head-perspiration-sleep", "gen-cold-sensitive", "ext-coldness-feet", "gen-obesity", "stomach-desires-sweets"],
    dosage: "200C single dose, repeated monthly. 30C for acute episodes. Not to be given frequently.",
    modalities: { worse: ["Cold air", "Wet weather", "Standing", "Exertion", "Full moon"], better: ["Dry weather", "Lying on painful side", "Drawing up limbs"] }
  },
  {
    id: "cham", name: "Chamomilla", abbr: "Cham.", kentId: 1035,
    description: "Extreme irritability and anger. Unbearable pain driving the patient to distraction. One cheek red, the other pale. The child demands things then throws them away. Teething troubles.",
    commonSymptoms: ["mind-anger-violent", "mind-irritable-children", "rectum-diarrhoea-dentition", "ear-pain", "face-redness-one-sided"],
    dosage: "30C for teething and colic. 200C for severe irritability. Repeat as needed.",
    modalities: { worse: ["Heat", "Anger", "Night", "Dentition", "Wind", "Coffee"], better: ["Being carried (child)", "Warm wet weather", "Cold applications"] }
  },
  {
    id: "chin", name: "China Officinalis", abbr: "Chin.", kentId: 1040,
    description: "Great debility from loss of vital fluids (blood, sweat, diarrhoea). Periodicity of complaints. Bloating of entire abdomen. Hypersensitive to touch and drafts. Anemia.",
    commonSymptoms: ["gen-weakness-diarrhoea", "abdomen-flatulence", "abdomen-distension", "fever-intermittent", "gen-faintness"],
    dosage: "30C for acute complaints, 200C for chronic debility. Repeat 3 times daily.",
    modalities: { worse: ["Slightest touch", "Drafts", "Loss of vital fluids", "Alternate days"], better: ["Hard pressure", "Bending double", "Warmth", "Open air"] }
  },
  {
    id: "con", name: "Conium Maculatum", abbr: "Con.", kentId: 1042,
    description: "Ascending paralysis. Vertigo on turning in bed or turning eyes sideways. Hard glands and indurations. Effects of suppressed sexual desire. Tumors of breast. Gradually increasing weakness.",
    commonSymptoms: ["head-vertigo-turning", "gen-weakness", "chest-pain-mammae", "ext-weakness-legs", "male-desire-diminished"],
    dosage: "30C to 200C depending on condition. Constitutional dosing preferred.",
    modalities: { worse: ["Turning in bed", "Night", "Celibacy", "Touch", "After injury"], better: ["Motion", "Pressure", "Letting limbs hang down", "In the dark"] }
  },
  {
    id: "dulc", name: "Dulcamara", abbr: "Dulc.", kentId: 1044,
    description: "Complaints from exposure to cold damp weather, especially after warm days. Every cold settles in the eyes, nose, or throat. Urticaria from cold. Thick yellow discharges.",
    commonSymptoms: ["nose-coryza", "gen-cold-wet-agg", "skin-eruptions-urticaria", "rectum-diarrhoea", "ext-stiffness"],
    dosage: "30C for acute cold conditions. 200C for recurring complaints from damp. Repeat as needed.",
    modalities: { worse: ["Cold wet weather", "Autumn", "Night", "Rest", "Change from warm to cold"], better: ["Warmth", "Dry weather", "Motion"] }
  },
  {
    id: "gels", name: "Gelsemium Sempervirens", abbr: "Gels.", kentId: 1045,
    description: "Heaviness, weakness, and trembling. Drooping eyelids. Dull headache with heavy feeling. Stage fright and anticipatory anxiety. Influenza remedy. Absence of thirst.",
    commonSymptoms: ["head-heaviness", "gen-weakness", "mind-fear-crowd", "eyes-pain", "fever-chills", "stomach-thirstless"],
    dosage: "30C for influenza and acute conditions. 200C for anticipation anxiety. Repeat 3-4 times daily.",
    modalities: { worse: ["Damp weather", "Emotion", "Excitement", "Bad news", "Spring", "Tobacco"], better: ["Open air", "Continued motion", "Profuse urination", "Stimulants"] }
  },
  {
    id: "graph", name: "Graphites", abbr: "Graph.", kentId: 1046,
    description: "Skin eruptions with thick, honey-like, sticky discharge. Cracks in skin folds. Tendency to obesity. Constipation with hard stool coated with mucus. Nails thick and crumbling.",
    commonSymptoms: ["skin-eruptions-eczema", "skin-cracks", "rectum-constipation-chronic", "gen-obesity", "ext-corns"],
    dosage: "30C for skin complaints, 200C for deep-seated conditions. 6C for local skin issues repeated 3 times daily.",
    modalities: { worse: ["Warmth", "Night", "Menses", "Light"], better: ["Dark", "Wrapping up", "In open air"] }
  },
  {
    id: "hep", name: "Hepar Sulphuris Calcareum", abbr: "Hep.", kentId: 1047,
    description: "Extreme sensitivity to cold and touch. Splinter-like pains. Suppuration—hastens or prevents it depending on potency. Irritable and hasty. Chilly, oversensitive.",
    commonSymptoms: ["gen-cold-sensitive", "gen-touch-sensitive", "throat-pain", "skin-eruptions-boils", "cough-dry-cold-air"],
    dosage: "Low potency (6C) to ripen abscess, high potency (200C) to abort. 30C for general use.",
    modalities: { worse: ["Cold air", "Drafts", "Touch", "Lying on painful side", "Night"], better: ["Warmth", "Wrapping up head", "Damp weather", "After eating"] }
  },
  {
    id: "hyos", name: "Hyoscyamus Niger", abbr: "Hyos.", kentId: 1048,
    description: "Delirium with jealousy and suspicion. Involuntary urination. Twitching, jerking of muscles. Foolish behavior, exposes body. Dry spasmodic cough worse lying down.",
    commonSymptoms: ["mind-jealousy", "mind-suspicious", "mind-delirium", "cough-dry-lying", "urine-involuntary"],
    dosage: "30C to 200C depending on condition severity. Single dose in acute delirium.",
    modalities: { worse: ["Night", "Lying down", "After eating", "Touch", "Jealousy"], better: ["Sitting up", "Stooping"] }
  },
  {
    id: "ign", name: "Ignatia Amara", abbr: "Ign.", kentId: 1049,
    description: "Effects of grief, disappointment, and suppressed emotions. Contradictory symptoms—hungry but nauseous, pain better from pressure, etc. Frequent sighing. Globus hystericus (lump in throat).",
    commonSymptoms: ["mind-sadness", "mind-weeping-causeless", "throat-lump", "resp-sighing", "mind-indifference-loved-ones"],
    dosage: "200C single dose for acute grief. 30C repeated for ongoing emotional states.",
    modalities: { worse: ["Grief", "Worry", "Morning", "Open air", "Coffee", "Tobacco", "Touch"], better: ["Deep breathing", "Eating", "Change of position", "Hard pressure", "Being alone"] }
  },
  {
    id: "ip", name: "Ipecacuanha", abbr: "Ip.", kentId: 1050,
    description: "Persistent nausea not relieved by vomiting. Clean tongue with intense nausea. Hemorrhages of bright red blood. Spasmodic cough with nausea and vomiting. Rattling cough in chest.",
    commonSymptoms: ["stomach-nausea-constant", "stomach-vomiting", "cough-spasmodic", "resp-rattling", "cough-expectoration-bloody"],
    dosage: "30C for nausea and vomiting. 200C for hemorrhage. Repeat every 15 minutes in acute nausea.",
    modalities: { worse: ["Periodically", "Moist warm wind", "Lying down", "Overeating", "Veal", "Pork"], better: ["Open air", "Rest", "Pressure", "Closing eyes"] }
  },
  {
    id: "kali-bi", name: "Kali Bichromicum", abbr: "Kali-bi.", kentId: 1051,
    description: "Thick, stringy, ropy discharges from any mucous membrane. Pains in small spots that can be covered by a fingertip. Sinusitis with pressure at root of nose. Round deep ulcers.",
    commonSymptoms: ["nose-discharge-thick", "nose-discharge-yellow", "nose-obstruction", "throat-mucus-tenacious", "stomach-pain"],
    dosage: "30C for acute sinusitis. 200C for chronic cases. 6C repeated frequently for colds.",
    modalities: { worse: ["Morning", "Hot weather", "Beer", "Undressing", "Spring"], better: ["Heat", "Motion", "Pressure"] }
  },
  {
    id: "kali-c", name: "Kali Carbonicum", abbr: "Kali-c.", kentId: 1052,
    description: "Stitching pains that are sharp and cutting. Weakness and backache. Puffiness of upper eyelids. Worse 2-4 AM. Irritable, never wants to be alone. Sensitive to every draft and change of weather.",
    commonSymptoms: ["back-pain-lumbar", "chest-pain-stitching", "gen-cold-sensitive", "sleep-insomnia-after-midnight", "eyes-swelling-upper"],
    dosage: "30C to 200C. Constitutional remedy, often given in infrequent doses.",
    modalities: { worse: ["2-4 AM", "Cold air", "Drafts", "Lying on affected side", "Soup", "After coition"], better: ["Warmth", "Open air", "Daytime", "Sitting with elbows on knees"] }
  },
  {
    id: "lach", name: "Lachesis Mutus", abbr: "Lach.", kentId: 1055,
    description: "Left-sided remedy. Cannot bear anything tight around neck or waist. Worse after sleep. Jealousy and suspicion. Loquacity. Hot patient. Purple/bluish discoloration. Menopausal flushes.",
    commonSymptoms: ["gen-left-sided", "throat-pain-left", "mind-jealousy", "mind-suspicious", "female-menopause-hot-flushes"],
    dosage: "200C constitutional dose. 30C for acute left-sided sore throat. Infrequent dosing.",
    modalities: { worse: ["After sleep", "Left side", "Spring", "Warm bath", "Pressure", "Sun"], better: ["Open air", "Hard pressure", "Warm applications", "Discharges appearing"] }
  },
  {
    id: "lyc", name: "Lycopodium Clavatum", abbr: "Lyc.", kentId: 1058,
    description: "Right-sided remedy with complaints going from right to left. Bloating after eating even a small amount. Desire for warm food/drink. Anticipatory anxiety despite confidence. Worse 4-8 PM. Bossy yet fearful.",
    commonSymptoms: ["gen-right-sided", "abdomen-flatulence", "abdomen-distension-eating", "mind-anxiety-future", "stomach-bloating-eating", "mind-fear-crowd"],
    dosage: "200C constitutional dose. 30C for acute digestive complaints. Repeated infrequently.",
    modalities: { worse: ["4-8 PM", "Right side", "Warm room", "Eating (even a little)", "Oysters", "Flatulent food"], better: ["Warm drinks", "Motion", "Cool air", "After midnight", "Loosening clothing"] }
  },
  {
    id: "merc", name: "Mercurius Vivus", abbr: "Merc.", kentId: 1060,
    description: "Profuse salivation especially at night. Offensive breath. Metallic taste. Tongue shows imprint of teeth. Sensitive to both heat and cold. Night sweats without relief. Trembling.",
    commonSymptoms: ["mouth-salivation", "mouth-breath-offensive", "mouth-taste-metallic", "fever-perspiration-night", "gen-trembling"],
    dosage: "30C for acute conditions. 200C for deep-seated problems. Not to be given in high potency frequently.",
    modalities: { worse: ["Night", "Wet damp weather", "Perspiration", "Warm room/bed", "Right side"], better: ["Moderate temperature", "Rest"] }
  },
  {
    id: "nat-m", name: "Natrum Muriaticum", abbr: "Nat-m.", kentId: 1065,
    description: "Effects of grief held internally—weeps alone, dislikes consolation. Craves salt. Headache from sun, like little hammers. Watery discharges like egg white. Herpes on lips. Mapped tongue.",
    commonSymptoms: ["mind-sadness-alone", "head-pain-sun", "nose-discharge-watery", "skin-eruptions-herpes", "stomach-desires-salt"],
    dosage: "200C constitutional dose. 30C for acute headaches. Infrequent doses—once weekly or monthly.",
    modalities: { worse: ["Sun", "Heat", "10 AM", "Seashore", "Consolation", "Lying down"], better: ["Open air", "Bathing in cold water", "Skipping meals", "Tight clothing"] }
  },
  {
    id: "nux-v", name: "Nux Vomica", abbr: "Nux-v.", kentId: 1070,
    description: "Oversensitive to all impressions. Irritable, impatient, angry. Effects of overindulgence in food, drink, stimulants. Morning aggravation. Constipation with frequent ineffectual urging. Chilly.",
    commonSymptoms: ["mind-irritability", "mind-anger-trifles", "rectum-constipation-ineffectual", "stomach-nausea-morning", "gen-cold-sensitive", "sleep-insomnia-thoughts"],
    dosage: "30C for acute complaints. 200C for chronic overindulgence. Take at bedtime.",
    modalities: { worse: ["Morning", "Mental exertion", "After eating", "Spices", "Stimulants", "Cold", "Dry weather"], better: ["Nap", "Rest", "Evening", "Damp wet weather", "Strong pressure"] }
  },
  {
    id: "phos", name: "Phosphorus", abbr: "Phos.", kentId: 1075,
    description: "Burning pains throughout body. Desires cold water which is vomited when warm in stomach. Tall, thin, sensitive. Hemorrhagic tendency. Fear of thunderstorms. Sympathetic, desires company.",
    commonSymptoms: ["stomach-vomiting", "stomach-thirst-cold", "mind-fear-thunder", "cough-expectoration-bloody", "gen-weakness"],
    dosage: "30C for acute conditions. 200C for chronic. 1M for constitutional treatment. Infrequent doses.",
    modalities: { worse: ["Evening", "Cold", "Thunderstorm", "Lying on left side", "Warm food"], better: ["Cold food/drinks", "Sleep", "Dark", "Open air", "Being rubbed", "Sitting up"] }
  },
  {
    id: "puls", name: "Pulsatilla Nigricans", abbr: "Puls.", kentId: 1080,
    description: "Mild, gentle, tearful disposition. Wants sympathy and consolation. Changeable symptoms. Thirstlessness. Worse from warm room, better in open air. Thick, bland, yellowish-green discharges.",
    commonSymptoms: ["mind-weeping-consolation", "stomach-thirstless", "nose-discharge-thick", "nose-discharge-yellow", "gen-heat-agg", "ear-pain"],
    dosage: "30C for acute conditions. 200C constitutional. Well-suited for children and gentle women.",
    modalities: { worse: ["Warmth", "Warm room", "Evening", "Rich/fatty food", "Getting wet", "After eating"], better: ["Open air", "Motion", "Cold applications", "Cold food/drink", "After crying"] }
  },
  {
    id: "rhus-t", name: "Rhus Toxicodendron", abbr: "Rhus-t.", kentId: 1085,
    description: "Stiffness and pain better from continued motion, worse from first motion and rest. Rheumatic complaints. Restlessness—must constantly change position. Herpes and vesicular eruptions.",
    commonSymptoms: ["ext-pain-rheumatic", "ext-stiffness-morning", "gen-motion-better", "gen-rest-worse", "skin-eruptions-vesicular", "mind-restless-bed"],
    dosage: "30C for acute joint complaints. 200C for chronic. Repeat 3 times daily in acute cases.",
    modalities: { worse: ["Cold wet weather", "Rest", "First motion", "Night", "Overexertion", "Getting wet"], better: ["Continued motion", "Warmth", "Warm dry weather", "Rubbing", "Stretching limbs"] }
  },
  {
    id: "sep", name: "Sepia Succus", abbr: "Sep.", kentId: 1088,
    description: "Indifference to loved ones. Bearing-down sensation as if everything would protrude. Irritable, wants to be alone. Yellow-brown saddle across nose. Menstrual irregularities.",
    commonSymptoms: ["mind-indifference-loved-ones", "female-irregular", "female-leucorrhoea", "skin-discoloration-yellow", "gen-weakness"],
    dosage: "200C constitutional. 30C for acute menopausal or menstrual complaints.",
    modalities: { worse: ["Cold air", "Before menses", "Pregnancy", "Morning and evening", "Standing", "Washing"], better: ["Vigorous exercise", "Warmth of bed", "Pressure", "Drawing limbs up", "Dancing"] }
  },
  {
    id: "sil", name: "Silicea (Silica)", abbr: "Sil.", kentId: 1090,
    description: "Yields slowly to treatment. Ill effects of vaccination. Every injury suppurates. Offensive foot sweat. Fistulas. Splinter sensation. Timid, yielding nature. Cold, chilly patient. Slow healing.",
    commonSymptoms: ["gen-cold-sensitive", "skin-ulcers", "skin-eruptions-boils", "ext-coldness-feet", "fever-perspiration-offensive"],
    dosage: "200C constitutional. 6C for promoting drainage of abscesses. 30C for general use.",
    modalities: { worse: ["Cold", "Drafts", "Damp", "Morning", "New moon", "Vaccination"], better: ["Warmth", "Wrapping up", "Summer", "Profuse urination"] }
  },
  {
    id: "sulph", name: "Sulphur", abbr: "Sulph.", kentId: 1095,
    description: "Great anti-psoric remedy. Burning everywhere—skin, feet, vertex. Aggravation from bathing. Standing is the worst position. Dirty, filthy appearance. Burning feet at night puts them out of bed.",
    commonSymptoms: ["skin-itching-night", "skin-eruptions", "gen-heat-agg", "ext-coldness-feet", "rectum-diarrhoea-morning"],
    dosage: "200C constitutional. 30C for acute skin problems. Often used as an intercurrent remedy.",
    modalities: { worse: ["11 AM", "Warmth of bed", "Bathing", "Standing", "Night", "Milk", "Alcohol"], better: ["Open air", "Motion", "Drawing up affected limbs", "Dry warm weather"] }
  },
  {
    id: "thuj", name: "Thuja Occidentalis", abbr: "Thuj.", kentId: 1097,
    description: "Warts—especially soft, pedunculated. Left-sided remedy. Effects of vaccination. Skin oily, perspires on uncovered parts. Fixed ideas. Nails distorted, brittle. Urinary complaints.",
    commonSymptoms: ["skin-warts", "skin-warts-pedunculated", "gen-left-sided", "urine-burning", "skin-eruptions"],
    dosage: "200C for warts and constitutional treatment. 30C for acute urinary complaints.",
    modalities: { worse: ["Cold damp weather", "Vaccination", "3 AM", "Night", "Moonlight", "Onions", "Tea"], better: ["Warmth", "Drawing up limbs", "Lying on affected side", "Sneezing"] }
  },
  {
    id: "apis", name: "Apis Mellifica", abbr: "Apis.", kentId: 1100,
    description: "Stinging, burning pains. Swelling with pitting oedema. Thirstlessness. Worse from heat. Better from cold applications. Right side then left. Anaphylaxis. Urticaria.",
    commonSymptoms: ["gen-oedema", "skin-eruptions-urticaria", "throat-swelling", "eyes-swelling-lids", "urine-scanty"],
    dosage: "30C for acute stings and hives. 200C for deeper conditions. Repeat every 15-30 minutes in allergic reactions.",
    modalities: { worse: ["Heat", "Touch", "Pressure", "Right side", "After sleep", "Late afternoon"], better: ["Cold", "Cold applications", "Open air", "Uncovering"] }
  },
  {
    id: "arg-n", name: "Argentum Nitricum", abbr: "Arg-n.", kentId: 1102,
    description: "Anticipation anxiety—diarrhoea from apprehension. Craving for sweets which aggravate. Fear of heights. Time passes too slowly. Splinter-like pains. Emotional diarrhoea.",
    commonSymptoms: ["mind-anxiety-future", "mind-fear-height", "rectum-diarrhoea-anxiety", "stomach-desires-sweets", "eyes-inflammation"],
    dosage: "30C before events for anticipation anxiety. 200C constitutional. Repeat as needed.",
    modalities: { worse: ["Warmth", "Sweets", "Sugar", "Night", "After eating", "Anticipation", "Crowded rooms"], better: ["Cold", "Fresh air", "Pressure", "Eructation"] }
  },
  {
    id: "arn", name: "Arnica Montana", abbr: "Arn.", kentId: 1105,
    description: "First remedy for trauma, bruising, and injuries. Sore, bruised feeling all over. Bed feels too hard. Denies being ill—says he is fine when seriously ill. Fear of being touched.",
    commonSymptoms: ["gen-touch-sensitive", "ext-pain", "gen-weakness", "mind-fear-strangers"],
    dosage: "30C immediately after injury. 200C for severe trauma. 6C repeated frequently post-surgery.",
    modalities: { worse: ["Touch", "Motion", "Damp cold", "Injuries", "Overexertion"], better: ["Lying down", "Lying with head low"] }
  },
  {
    id: "caust", name: "Causticum", abbr: "Caust.", kentId: 1108,
    description: "Paralytic conditions gradually developing. Rawness and soreness. Sympathetic to suffering of others. Cough better from sipping cold water. Urine involuntary on coughing, sneezing, or laughing. Warts on face and hands.",
    commonSymptoms: ["urine-involuntary-cough", "cough-dry", "ext-weakness", "skin-warts", "gen-cold-wet-agg"],
    dosage: "30C to 200C. Constitutional remedy. Repeat infrequently.",
    modalities: { worse: ["Dry cold wind", "Fine weather", "3 AM", "Grief", "Evening"], better: ["Damp wet weather", "Warmth", "Warmth of bed", "Sips of cold water"] }
  },
  {
    id: "cimic", name: "Cimicifuga Racemosa", abbr: "Cimic.", kentId: 1109,
    description: "Pain in neck and back. Dark, heavy menses with severe cramping. Alternating mental and physical symptoms. Pain like electric shock. Gloom and dejection. Rheumatic complaints in muscles.",
    commonSymptoms: ["back-pain-cervical", "female-dysmenorrhoea", "mind-sadness", "ext-pain-rheumatic", "back-stiffness-neck"],
    dosage: "30C for menstrual cramps. 200C for deep-seated muscular pain. Repeat 3 times daily.",
    modalities: { worse: ["Cold damp weather", "During menses", "Morning", "Motion"], better: ["Warmth", "Eating", "Gentle continued motion"] }
  },
  {
    id: "cina", name: "Cina Maritima", abbr: "Cina.", kentId: 1110,
    description: "Children's remedy. Irritable, cross, ugly child. Grinding teeth during sleep. Picking at nose. Worm symptoms. Involuntary urination at night. Ravenous appetite or total loss of appetite.",
    commonSymptoms: ["mind-irritable-children", "sleep-grinding-teeth", "rectum-itching-worms", "urine-involuntary-night", "stomach-appetite-ravenous"],
    dosage: "30C for worm symptoms. 200C for chronic behavioral issues. Repeat 2-3 times daily.",
    modalities: { worse: ["Full moon", "Looking at objects steadily", "Touch", "Night"], better: ["Lying on abdomen", "Being rocked", "Motion"] }
  },
  {
    id: "coff", name: "Coffea Cruda", abbr: "Coff.", kentId: 1112,
    description: "Oversensitivity to pain—pains seem unbearable. Sleeplessness from excitement or joy. Mind and body overactive. Toothache better from holding cold water in mouth. Heart palpitations.",
    commonSymptoms: ["sleep-insomnia-thoughts", "mind-restlessness", "chest-palpitation", "head-pain"],
    dosage: "30C for insomnia. 200C for acute hypersensitivity. Take at bedtime.",
    modalities: { worse: ["Strong emotions", "Joy", "Noise", "Touch", "Night", "Open air", "Cold"], better: ["Warmth", "Lying down", "Holding ice water in mouth (toothache)"] }
  },
  {
    id: "coloc", name: "Colocynthis", abbr: "Coloc.", kentId: 1114,
    description: "Violent cramping pains relieved by hard pressure and bending double. Colic from anger or indignation. Neuralgic pains. Sciatica especially left-sided.",
    commonSymptoms: ["abdomen-pain-cramping", "abdomen-pain-bending-double", "abdomen-pain-pressure-amel", "mind-anger-ailments", "ext-pain-hip-left"],
    dosage: "30C for acute colic. 200C for sciatica and deep pains. Repeat every 15 minutes in acute colic.",
    modalities: { worse: ["Anger", "Indignation", "Evening", "Taking cold", "Lying on painless side"], better: ["Hard pressure", "Bending double", "Warmth", "Coffee", "Lying on abdomen"] }
  },
  {
    id: "cup", name: "Cuprum Metallicum", abbr: "Cupr.", kentId: 1115,
    description: "Violent cramping and spasms. Cramps beginning in fingers and toes. Whooping cough with cyanosis. Convulsions from fright. Nausea relieved by drinking cold water.",
    commonSymptoms: ["ext-cramping", "ext-cramping-calves", "cough-whooping", "gen-convulsions", "stomach-nausea"],
    dosage: "30C for muscle cramps. 200C for convulsive conditions. Repeat as needed.",
    modalities: { worse: ["Before menses", "Touch", "Vomiting", "Hot weather"], better: ["Drinking cold water", "Stretching", "Perspiration"] }
  },
  {
    id: "dros", name: "Drosera Rotundifolia", abbr: "Dros.", kentId: 1116,
    description: "Violent spasmodic cough ending in retching or vomiting. Deep, hoarse barking cough. Cough worse after midnight. Whooping cough. Sensation of feather in larynx. Tuberculosis of joints.",
    commonSymptoms: ["cough-barking", "cough-spasmodic", "cough-whooping", "cough-dry-night", "ext-pain-joints"],
    dosage: "30C for acute cough. 200C for whooping cough. Repeat 3 times daily.",
    modalities: { worse: ["After midnight", "Lying down", "Warmth", "Talking", "Singing", "Laughing"], better: ["Open air", "Motion", "Pressure", "Sitting up"] }
  },
  {
    id: "ferr", name: "Ferrum Metallicum", abbr: "Ferr.", kentId: 1117,
    description: "Anemia with flushing. Face alternately pale and flushed. Hemorrhages of bright blood. Weakness worse from exertion. False plethora. Cold extremities. Better from gentle motion.",
    commonSymptoms: ["face-redness-alternating-pale", "gen-weakness-exertion", "ext-coldness-hands", "ext-coldness-feet", "gen-motion-better"],
    dosage: "30C for mild anemia. 6C repeated for iron deficiency. 200C for deep constitutional cases.",
    modalities: { worse: ["Night", "Exertion", "After eating", "Rest", "Eggs", "Tea"], better: ["Gentle motion", "Walking slowly", "Summer", "Lying down"] }
  },
  {
    id: "hyper", name: "Hypericum Perforatum", abbr: "Hyper.", kentId: 1120,
    description: "Nerve injuries with shooting pains. Injuries to nerve-rich areas (fingers, toes, spine). Puncture wounds. Post-surgical nerve pain. Concussion of spine. Tetanus prevention.",
    commonSymptoms: ["ext-pain-fingers", "ext-pain-toes", "back-pain-coccyx", "back-pain", "gen-touch-sensitive"],
    dosage: "30C for nerve injuries. 200C for spinal injuries. Also used externally as tincture for wounds.",
    modalities: { worse: ["Cold", "Damp", "Touch", "Exertion", "Jarring", "Foggy weather"], better: ["Bending head backward", "Rest", "Lying on face"] }
  },
  {
    id: "iod", name: "Iodum", abbr: "Iod.", kentId: 1122,
    description: "Great hunger—eats frequently but emaciates. Warm-blooded, aggravated by warmth. Hard, enlarged glands. Thyroid enlargement (goiter). Restlessness compelling motion. Dark-haired individuals.",
    commonSymptoms: ["gen-emaciation", "stomach-appetite-ravenous", "gen-heat-agg", "gen-motion-better"],
    dosage: "30C for thyroid conditions. 200C for deep-seated glandular complaints.",
    modalities: { worse: ["Warmth", "Warm room", "Rest", "Right side", "Fasting"], better: ["Cold", "Cold air", "Motion", "Eating"] }
  },
  {
    id: "kreos", name: "Kreosotum", abbr: "Kreos.", kentId: 1124,
    description: "Excoriating discharges. Rapid decay of teeth in children. Offensive discharges. Bleeding tendency—dark blood. Vomiting of undigested food hours after eating. Gums spongy and bleeding.",
    commonSymptoms: ["mouth-bleeding-gums", "stomach-vomiting-food", "female-leucorrhoea-acrid", "skin-ulcers"],
    dosage: "30C for dental problems. 200C for deep leucorrhoea. Repeat 2-3 times daily.",
    modalities: { worse: ["Open air", "Cold", "Rest", "After menses", "Teeth cutting"], better: ["Warmth", "Warm food", "Motion", "Hot water"] }
  },
  {
    id: "led", name: "Ledum Palustre", abbr: "Led.", kentId: 1126,
    description: "Puncture wounds. Insect bites and stings. Coldness of affected part but better from cold. Joints swollen, hot, pale. Rheumatism starting from feet ascending. Tetanus prophylaxis.",
    commonSymptoms: ["ext-pain-joints", "ext-swelling-joints", "ext-pain-ankle", "ext-pain-toes"],
    dosage: "30C immediately for puncture wounds. 200C for gouty joints. Repeat 3 times daily.",
    modalities: { worse: ["Warmth", "Warmth of bed", "Night", "Motion", "Alcohol"], better: ["Cold", "Cold applications", "Cold bathing", "Rest", "Putting feet in cold water"] }
  },
  {
    id: "mag-p", name: "Magnesia Phosphorica", abbr: "Mag-p.", kentId: 1128,
    description: "Cramps and spasms relieved by heat and pressure. Radiating, shooting neuralgic pains. Right-sided complaints. Colic relieved by bending double with heat. Menstrual cramps with warm bottle.",
    commonSymptoms: ["abdomen-pain-cramping", "female-dysmenorrhoea-warmth", "ext-cramping", "gen-right-sided"],
    dosage: "6X tissue salt dissolved in hot water, sipped frequently. 30C-200C for severe cramps.",
    modalities: { worse: ["Cold", "Touch", "Right side", "Night"], better: ["Warmth", "Hot applications", "Bending double", "Pressure", "Rubbing"] }
  },
  {
    id: "merc-c", name: "Mercurius Corrosivus", abbr: "Merc-c.", kentId: 1130,
    description: "Violent tenesmus of bladder and rectum. Bloody mucus stools with burning. Severe dysentery. Nephritis with albuminuria. More violent and destructive than Mercurius.",
    commonSymptoms: ["rectum-diarrhoea", "urine-burning", "stool-bloody", "stool-mucus"],
    dosage: "30C for acute dysentery. Repeat every 2-4 hours. Low potency preferred.",
    modalities: { worse: ["Evening", "Night", "Swallowing", "Acids", "Autumn", "Hot days and cold nights"], better: ["Rest"] }
  },
  {
    id: "merc-i-f", name: "Mercurius Iodatus Flavus", abbr: "Merc-i-f.", kentId: 1131,
    description: "Predominately right-sided sore throat. Yellow-coated tongue base. Glands enlarged and hard. Useful in diphtheria beginning on right side. Stringy mucus.",
    commonSymptoms: ["throat-pain-right", "throat-inflammation-tonsils-right", "mouth-tongue-yellow"],
    dosage: "30C for right-sided sore throat. Repeat 3 times daily.",
    modalities: { worse: ["Right side", "Night", "Damp weather"], better: ["Cold drinks"] }
  },
  {
    id: "merc-i-r", name: "Mercurius Iodatus Ruber", abbr: "Merc-i-r.", kentId: 1132,
    description: "Predominately left-sided sore throat. Dark red fauces. Stiff neck. Mumps. Useful when throat begins on left side. Glands painful and indurated.",
    commonSymptoms: ["throat-pain-left", "throat-inflammation-tonsils-left", "back-stiffness-neck"],
    dosage: "30C for left-sided sore throat. Repeat 3 times daily.",
    modalities: { worse: ["Left side", "Night", "Damp weather", "Empty swallowing"], better: ["Cold drinks", "Rest"] }
  },
  {
    id: "nat-c", name: "Natrum Carbonicum", abbr: "Nat-c.", kentId: 1135,
    description: "Intolerance to sun and heat. Chronic headaches from sun. Cannot digest milk. Weak ankles that turn easily. Good natured, selfless people who are emotionally sensitive.",
    commonSymptoms: ["head-pain-sun", "gen-heat-agg", "gen-weakness", "ext-pain-ankle", "stomach-aversion-milk"],
    dosage: "30C to 200C constitutional. Infrequent dosing.",
    modalities: { worse: ["Sun", "Heat", "Milk", "Mental exertion", "Music", "5 AM"], better: ["Motion", "Rubbing", "Boring into ear/nose"] }
  },
  {
    id: "nat-p", name: "Natrum Phosphoricum", abbr: "Nat-p.", kentId: 1136,
    description: "Acid conditions. Sour eructations and vomiting. Thick creamy yellow discharges. Worms with grinding of teeth and picking of nose. Acidity of stomach. Heartburn.",
    commonSymptoms: ["stomach-heartburn", "stomach-eructations-sour", "mouth-taste-sour", "stool-green", "sleep-grinding-teeth"],
    dosage: "6X tissue salt for acidity, repeated 3 times daily. 30C for deeper conditions.",
    modalities: { worse: ["Sugar", "Sweets", "Fats", "During thunderstorm"], better: ["Cold things", "Cool open air"] }
  },
  {
    id: "nat-s", name: "Natrum Sulphuricum", abbr: "Nat-s.", kentId: 1137,
    description: "Complaints from damp weather and living in damp places. Head injuries with slow recovery. Morning diarrhoea. Asthma in damp weather. Green discharges. Suicidal thoughts.",
    commonSymptoms: ["gen-cold-wet-agg", "rectum-diarrhoea-morning", "resp-asthmatic-humid", "mind-suicidal", "cough-loose-morning"],
    dosage: "6X tissue salt for dampness complaints. 200C for head injury effects.",
    modalities: { worse: ["Damp weather", "Damp rooms", "Morning", "Lying on left side", "Head injuries"], better: ["Open air", "Dry weather", "Pressure", "Change of position"] }
  },
  {
    id: "nit-ac", name: "Nitricum Acidum", abbr: "Nit-ac.", kentId: 1138,
    description: "Splinter-like pains. Fissures—anal, at corners of mouth. Offensive discharges. Dark complexion. Vindictive, unforgiving. Warts that bleed easily. Affects junctions of skin and mucous membrane.",
    commonSymptoms: ["rectum-fissure", "skin-warts", "skin-ulcers", "mouth-ulcers", "rectum-haemorrhoids-bleeding"],
    dosage: "30C for fissures and warts. 200C constitutional. Repeat 2-3 times daily.",
    modalities: { worse: ["Evening and night", "Cold", "Touch", "Jarring", "Walking", "Milk"], better: ["Riding in a car", "Mild weather", "Steady pressure"] }
  },
  {
    id: "op", name: "Opium", abbr: "Op.", kentId: 1140,
    description: "Drowsy stupor. Painlessness of all complaints. Dark red or hot face. Constipation with round hard black balls without urging. Retention of stool and urine from fright. Snoring.",
    commonSymptoms: ["sleep-snoring", "rectum-constipation-difficult", "mind-fear", "sleep-sleepiness", "gen-faintness"],
    dosage: "30C to 200C. Use carefully. Not to be repeated frequently.",
    modalities: { worse: ["Heat", "Sleep", "Fright", "Perspiration", "Stimulants"], better: ["Cold", "Constant walking", "Cold air"] }
  },
  {
    id: "petr", name: "Petroleum", abbr: "Petr.", kentId: 1142,
    description: "Deep cracks and fissures in skin, especially in winter. Skin rough, thick, and cracked. Motion sickness. Eczema with thick crusts. Cold spots on body. Better in warm air.",
    commonSymptoms: ["skin-cracks-winter", "skin-cracks-hands", "skin-eruptions-eczema", "skin-dry", "stomach-nausea-riding"],
    dosage: "30C for winter eczema. 200C constitutional. 6C for motion sickness.",
    modalities: { worse: ["Winter", "Cold", "Damp", "Riding/travelling", "Before thunderstorm"], better: ["Warm air", "Dry weather", "Eating"] }
  },
  {
    id: "phyt", name: "Phytolacca Decandra", abbr: "Phyt.", kentId: 1144,
    description: "Sore throat dark red or purple. Pain shoots to ears on swallowing. Mastitis with hard, painful breasts. Rheumatism in fibrous tissues. Swollen glands. Electric-like pains.",
    commonSymptoms: ["throat-pain-extending-ear", "chest-pain-mammae", "ext-pain-rheumatic", "throat-inflammation-tonsils"],
    dosage: "30C for sore throat and mastitis. Repeat 3 times daily. Tincture externally for breast lumps.",
    modalities: { worse: ["Cold", "Damp", "Motion", "Swallowing", "Night", "Right side"], better: ["Warmth", "Rest", "Dry weather", "Biting teeth together"] }
  },
  {
    id: "plb", name: "Plumbum Metallicum", abbr: "Plb.", kentId: 1146,
    description: "Violent colic with abdomen retracted (navel drawn to spine). Constipation with hard round black balls. Progressive muscular atrophy. Paralysis of extensors. Emaciation of affected parts.",
    commonSymptoms: ["abdomen-pain-cramping", "rectum-constipation", "gen-emaciation", "ext-weakness", "ext-numbness"],
    dosage: "30C for colic. 200C for chronic paralytic conditions.",
    modalities: { worse: ["Night", "Motion", "Exertion", "Clear weather"], better: ["Hard pressure", "Rubbing", "Bending double", "Physical exertion (strangely)"] }
  },
  {
    id: "pod", name: "Podophyllum Peltatum", abbr: "Podo.", kentId: 1148,
    description: "Profuse, gushing diarrhoea, especially in early morning. Stool offensive, yellowish-green, forcible. Gurgling in abdomen before stool. Liver complaints. Teething with diarrhoea.",
    commonSymptoms: ["rectum-diarrhoea-morning", "stool-watery", "stool-offensive", "abdomen-rumbling", "abdomen-liver"],
    dosage: "30C for acute diarrhoea. Repeat after each loose stool. 200C for chronic liver complaints.",
    modalities: { worse: ["Early morning (2-4 AM)", "Hot weather", "Teething", "After eating/drinking", "Bathing"], better: ["Lying on abdomen", "External warmth", "Rubbing liver region"] }
  },
  {
    id: "ran-b", name: "Ranunculus Bulbosus", abbr: "Ran-b.", kentId: 1150,
    description: "Intercostal neuralgia, especially left side. Herpes zoster (shingles) with severe burning. Stitching pains in chest worse from touch and motion. Vesicular eruptions.",
    commonSymptoms: ["chest-pain-stitching-left", "skin-eruptions-vesicular", "chest-pain-left", "skin-eruptions-herpes"],
    dosage: "30C for shingles and intercostal pain. Repeat 3 times daily.",
    modalities: { worse: ["Touch", "Motion", "Cold air", "Damp weather", "Change of temperature"], better: ["Standing", "Rest"] }
  },
  {
    id: "ruta", name: "Ruta Graveolens", abbr: "Ruta.", kentId: 1152,
    description: "Injuries to periosteum and cartilage. Eye strain from fine work. Bruised feeling of bones. Tennis elbow. Sprains where tendons and ligaments are affected. Wrist ganglion.",
    commonSymptoms: ["ext-pain-wrist", "ext-pain-knee", "eyes-pain-reading", "ext-stiffness", "back-pain-lumbar"],
    dosage: "30C for sprains and eye strain. 200C for chronic periosteal conditions.",
    modalities: { worse: ["Lying down", "Cold wet weather", "Overexertion", "Ascending/descending stairs"], better: ["Motion", "Warmth", "Rubbing", "Lying on back"] }
  },
  {
    id: "spig", name: "Spigelia Anthelmia", abbr: "Spig.", kentId: 1155,
    description: "Left-sided neuralgic headache. Pain in and around eyes, especially left. Heart pains visible through chest wall. Violent palpitation. Needle-like pains. Worms (especially children).",
    commonSymptoms: ["head-pain-sides-left", "eyes-pain-left", "chest-heart-pain", "chest-palpitation-visible", "rectum-itching-worms"],
    dosage: "30C for neuralgic pains. 200C for cardiac conditions. Repeat 2-3 times daily.",
    modalities: { worse: ["Touch", "Motion", "Noise", "Turning", "Washing", "Inspiration", "Cold rainy weather"], better: ["Lying on right side with head high", "Steady pressure", "Sunset"] }
  },
  {
    id: "spong", name: "Spongia Tosta", abbr: "Spong.", kentId: 1156,
    description: "Dry, barking, croupy cough. Croup waking from sleep before midnight. Respiration like sawing through a board. Anxiety with difficult respiration. Goiter. Dry cough relieved by eating/drinking.",
    commonSymptoms: ["cough-barking", "cough-dry", "resp-difficult", "throat-dryness"],
    dosage: "30C for croup. Repeat every 30 minutes. 200C for chronic respiratory conditions.",
    modalities: { worse: ["Before midnight", "Dry cold wind", "Exertion", "Roused from sleep", "Full moon"], better: ["Eating", "Drinking", "Lying with head low", "Descending"] }
  },
  {
    id: "staph", name: "Staphysagria", abbr: "Staph.", kentId: 1157,
    description: "Effects of suppressed anger and indignation. Ailments from humiliation. Hypersensitivity. Styes recurring. Urinary complaints especially after catheterization. Surgical wounds that do not heal.",
    commonSymptoms: ["mind-anger-suppressed", "mind-anger-ailments", "eyes-styes-recurring", "urine-burning", "skin-ulcers"],
    dosage: "200C for suppressed emotions. 30C for styes. Single dose preferred.",
    modalities: { worse: ["Anger", "Indignation", "Grief", "Touch", "Tobacco", "Sexual excess"], better: ["Warmth", "Rest", "After breakfast"] }
  },
  {
    id: "stram", name: "Stramonium", abbr: "Stram.", kentId: 1158,
    description: "Violent delirium with terror and desire for light and company. Fear of darkness, of water, of shining objects. Convulsions from fright. Involuntary movements. Stammering speech.",
    commonSymptoms: ["mind-fear-darkness", "mind-fear-water", "mind-delirium-violent", "gen-convulsions", "mouth-speech-difficult"],
    dosage: "200C for acute terror/delirium. 30C for fear of darkness. Single dose.",
    modalities: { worse: ["Darkness", "Being alone", "Looking at shining objects", "After sleep", "Swallowing"], better: ["Light", "Company", "Warmth"] }
  },
  {
    id: "tab", name: "Tabacum", abbr: "Tab.", kentId: 1160,
    description: "Violent nausea with cold sweat. Death-like paleness. Motion sickness—worse opening eyes. Coldness of whole body. Sea sickness. Angina pectoris with nausea.",
    commonSymptoms: ["stomach-nausea", "stomach-nausea-riding", "face-paleness", "fever-perspiration-cold", "head-vertigo"],
    dosage: "30C for motion sickness. Take before travelling. Repeat every 30 minutes if needed.",
    modalities: { worse: ["Opening eyes", "Least motion", "Riding", "Tobacco (in sensitive people)"], better: ["Open air", "Uncovering abdomen", "Cold applications", "Closing eyes"] }
  },
  {
    id: "verat", name: "Veratrum Album", abbr: "Verat.", kentId: 1165,
    description: "Collapse with extreme coldness, cold sweat on forehead. Profuse violent purging and vomiting simultaneously. Craving for cold drinks and ice. Extreme weakness after stools.",
    commonSymptoms: ["rectum-diarrhoea", "stomach-vomiting", "fever-perspiration-cold", "gen-weakness-diarrhoea", "stomach-desires-cold-drinks"],
    dosage: "30C for acute collapse. 200C for serious conditions. Repeat frequently in acute cases.",
    modalities: { worse: ["Night", "Cold", "Wet weather", "Drinking", "Exertion", "After stool"], better: ["Warmth", "Walking", "Lying down", "Hot drinks"] }
  },
  {
    id: "zinc", name: "Zincum Metallicum", abbr: "Zinc.", kentId: 1170,
    description: "Restless legs and feet—must move them constantly. Brain fag and exhaustion. Suppressed eruptions or discharges leading to brain symptoms. Convulsions from suppressed eruptions.",
    commonSymptoms: ["ext-restless-legs", "gen-weakness", "mind-memory", "gen-convulsions", "sleep-restless"],
    dosage: "30C to 200C. Constitutional remedy. Repeat infrequently.",
    modalities: { worse: ["Exhaustion", "After dinner", "Wine", "Suppressed discharges", "5 PM"], better: ["Motion", "Free discharges appearing", "Eating", "Pressure"] }
  },
  {
    id: "cact", name: "Cactus Grandiflorus", abbr: "Cact.", kentId: 1172,
    description: "Sensation as if heart were grasped by an iron hand. Constriction of chest, heart, bladder. Palpitation day and night. Hemorrhages of bright blood. Fear of death from heart disease.",
    commonSymptoms: ["chest-constriction-heart", "chest-palpitation", "chest-heart-pain", "mind-fear-death"],
    dosage: "30C for cardiac symptoms. Tincture to 6C for milder cases. Repeat 3 times daily.",
    modalities: { worse: ["Lying on left side", "Exertion", "Walking", "Stairs", "11 AM and 11 PM"], better: ["Open air", "Rest"] }
  },
  {
    id: "calc-f", name: "Calcarea Fluorica", abbr: "Calc-f.", kentId: 1174,
    description: "Hard stony glands. Varicose veins. Bone exostoses. Lumbago worse on beginning motion, better from continued motion. Cracked skin with hard edges. Hard knots in breast.",
    commonSymptoms: ["back-pain-lumbar", "ext-stiffness-morning", "skin-cracks", "skin-cicatrices", "gen-motion-better"],
    dosage: "6X tissue salt repeated 3 times daily. 12X for chronic conditions. 200C for deep-seated cases.",
    modalities: { worse: ["Cold damp weather", "Rest", "Beginning motion", "Drafts"], better: ["Continued motion", "Warmth", "Hot applications"] }
  },
  {
    id: "calc-p", name: "Calcarea Phosphorica", abbr: "Calc-p.", kentId: 1175,
    description: "Growth remedy for children. Delayed dentition, late walking. Bones slow to unite after fracture. School headaches in growing children. Desires smoked meats. Numbness and crawling.",
    commonSymptoms: ["head-pain", "gen-weakness", "ext-numbness", "back-pain", "rectum-diarrhoea-dentition"],
    dosage: "6X tissue salt for children's growth. 200C constitutional. 30C for headaches.",
    modalities: { worse: ["Cold damp weather", "Dentition", "Puberty", "Mental exertion", "Change of weather"], better: ["Summer", "Warm dry weather", "Lying down"] }
  },
  {
    id: "carb-v", name: "Carbo Vegetabilis", abbr: "Carb-v.", kentId: 1177,
    description: "The corpse reviver. Collapse with coldness of body, cold breath, yet wants to be fanned. Extreme flatulence with distension. Sluggish venous circulation. Blue discoloration.",
    commonSymptoms: ["abdomen-flatulence", "abdomen-distension", "gen-weakness", "gen-faintness", "skin-discoloration-blue"],
    dosage: "30C for acute collapse. 200C for chronic digestive complaints. 6C for simple flatulence.",
    modalities: { worse: ["Evening", "Warm damp weather", "Wine", "Rich food", "Butter", "Coffee", "Lying down"], better: ["Fanning", "Cool air", "Eructation", "Elevating feet"] }
  },
  {
    id: "chel", name: "Chelidonium Majus", abbr: "Chel.", kentId: 1179,
    description: "Right-sided remedy centered on liver. Pain under right scapula. Jaundice. Bitter taste. Preference for hot food and drinks. Right foot cold, left normal. Bilious conditions.",
    commonSymptoms: ["abdomen-liver-pain", "back-pain-scapulae", "skin-discoloration-yellow", "mouth-taste-bitter", "gen-right-sided"],
    dosage: "30C for liver and gallbladder complaints. Tincture or 6C for mild bilious conditions.",
    modalities: { worse: ["Right side", "4 AM", "Motion", "Touch", "Change of weather", "Eating"], better: ["Hot food and drinks", "Eating", "Pressure", "Bending backward"] }
  },
  {
    id: "dig", name: "Digitalis Purpurea", abbr: "Dig.", kentId: 1180,
    description: "Cardiac remedy. Very slow pulse. Sensation as if heart would stop if patient moved. Cardiac dropsy. Cyanosis. Nausea and faintness from thinking of food. Jaundice with slow pulse.",
    commonSymptoms: ["chest-palpitation", "chest-weakness", "gen-faintness", "stomach-nausea", "skin-discoloration-yellow"],
    dosage: "30C for cardiac symptoms. Low potencies preferred. Not to be given in high potency.",
    modalities: { worse: ["Sitting up", "Motion", "Exertion", "Music"], better: ["Empty stomach", "Open air", "Rest", "Lying flat"] }
  },
  {
    id: "euphr", name: "Euphrasia Officinalis", abbr: "Euphr.", kentId: 1182,
    description: "Profuse acrid tearing from eyes with bland nasal discharge (opposite of Allium cepa). Eye inflammation with photophobia. Profuse fluent coryza with eye symptoms.",
    commonSymptoms: ["eyes-lachrymation", "eyes-inflammation", "nose-coryza-fluent", "eyes-redness", "eyes-discharge"],
    dosage: "30C for acute eye conditions. 6C repeated frequently for mild eye inflammation.",
    modalities: { worse: ["Light", "Wind", "Warm room", "Evening", "Indoors"], better: ["Open air", "Winking", "Wiping eyes", "Dark", "Coffee"] }
  },
  {
    id: "kali-m", name: "Kali Muriaticum", abbr: "Kali-m.", kentId: 1184,
    description: "White or gray-white discharges and coated tongue. Eustachian tube catarrh with deafness. Eczema with white discharge. Second stage of inflammation when discharge begins.",
    commonSymptoms: ["ear-hearing-loss", "mouth-tongue-white", "skin-eruptions-eczema", "nose-discharge", "throat-mucus"],
    dosage: "6X tissue salt repeated 3-4 times daily. 30C for acute ear conditions.",
    modalities: { worse: ["Rich fatty food", "Cold air", "Damp weather", "Motion"], better: ["Rubbing", "Letting hair down"] }
  },
  {
    id: "kali-p", name: "Kali Phosphoricum", abbr: "Kali-p.", kentId: 1185,
    description: "Nerve nutrient. Mental and physical exhaustion. Brain fag from overwork. Nervous dread without cause. Insomnia from business worries. Offensive discharges. Humming in ears.",
    commonSymptoms: ["gen-weakness", "mind-anxiety", "sleep-insomnia-anxiety", "mind-memory", "mind-concentration"],
    dosage: "6X tissue salt as nerve tonic, repeated 3-4 times daily. 30C for acute mental exhaustion.",
    modalities: { worse: ["Cold", "Worry", "Mental exertion", "Early morning", "Touch"], better: ["Warmth", "Sleep", "Rest", "Nourishment", "Company"] }
  },
  {
    id: "kali-s", name: "Kali Sulphuricum", abbr: "Kali-s.", kentId: 1186,
    description: "Yellow mucus discharges from any organ. Rattling of mucus in chest. Worse in warm room, better in open air. Third stage of inflammation. Wandering pains. Peeling skin.",
    commonSymptoms: ["nose-discharge-yellow", "cough-expectoration-yellow", "skin-eruptions-scaly", "gen-heat-agg", "ext-pain-wandering"],
    dosage: "6X tissue salt for yellow discharges. 30C for deeper conditions.",
    modalities: { worse: ["Heated room", "Evening", "Warmth", "Rich food"], better: ["Open air", "Cool air", "Fasting", "Walking"] }
  },
  {
    id: "lil-t", name: "Lilium Tigrinum", abbr: "Lil-t.", kentId: 1188,
    description: "Bearing-down sensation as if pelvic contents would come out. Hurried feeling. Heart symptoms with uterine complaints. Wild, crazy feeling. Consciousness of uterus.",
    commonSymptoms: ["female-dysmenorrhoea", "chest-palpitation-anxiety", "mind-restlessness", "mind-anxiety"],
    dosage: "30C to 200C for menstrual and cardiac complaints.",
    modalities: { worse: ["Warmth", "Standing", "Walking", "Consolation"], better: ["Busy occupation", "Fresh air", "Crossing legs (for bearing-down)"] }
  },
  {
    id: "med", name: "Medorrhinum", abbr: "Med.", kentId: 1190,
    description: "Deep-acting nosode. Chronic conditions dating from suppressed gonorrhoea. Restless and hurried. Better at seaside. Tenderness of soles. Craves oranges, ice. Fidgety legs and arms.",
    commonSymptoms: ["mind-restlessness", "ext-pain-soles", "ext-restless-legs", "sleep-insomnia"],
    dosage: "200C to 1M. Single dose, infrequent repetition. Wait 4-6 weeks between doses.",
    modalities: { worse: ["Dawn", "Damp", "Cold", "Thinking of ailments", "Day"], better: ["Night", "Seaside", "Lying on abdomen", "Stretching out", "Damp weather (sometimes)"] }
  },
  {
    id: "psor", name: "Psorinum", abbr: "Psor.", kentId: 1192,
    description: "Extremely chilly, must be warmly covered. Dirty, unwashed appearance. Skin eruptions worse from warmth of bed. Great despair about recovery. Hungry at night, must eat.",
    commonSymptoms: ["gen-cold-sensitive", "skin-eruptions", "skin-itching-warmth", "mind-sadness", "stomach-appetite-increased"],
    dosage: "200C to 1M. Nosode, single dose. Wait weeks between repetitions.",
    modalities: { worse: ["Cold", "Change of weather", "Winter", "Warmth of bed (skin)", "Coffee"], better: ["Warmth (general)", "Eating", "Lying with arms spread"] }
  },
  {
    id: "tub", name: "Tuberculinum", abbr: "Tub.", kentId: 1195,
    description: "Nosode for those with tubercular tendency. Desire to travel and change. Catches cold easily. Emaciation despite good appetite. Allergies. Desire for cold milk. Aversion to fat.",
    commonSymptoms: ["gen-cold-sensitive", "gen-emaciation", "nose-coryza", "resp-asthmatic", "stomach-aversion-fat"],
    dosage: "200C to 1M. Single dose, not to be repeated frequently. Wait 4-6 weeks.",
    modalities: { worse: ["Cold damp weather", "Standing", "Change of weather", "Night", "Close room"], better: ["Open air", "Mountains", "Warmth (except headache)", "Dry weather"] }
  },
  {
    id: "all-c", name: "Allium Cepa", abbr: "All-c.", kentId: 1200,
    description: "Profuse acrid nasal discharge with bland lachrymation (opposite of Euphrasia). Streaming eyes and nose. Sneezing. Colds beginning on left and moving to right side. Spring colds.",
    commonSymptoms: ["nose-discharge-watery", "nose-sneezing-frequent", "eyes-lachrymation", "nose-coryza-fluent", "nose-coryza-warm-room"],
    dosage: "30C for acute colds. Repeat every 2-4 hours. 6C for mild conditions.",
    modalities: { worse: ["Warm room", "Evening", "Wet weather", "Damp cold wind"], better: ["Open air", "Cold room", "After eating"] }
  },
  {
    id: "ant-c", name: "Antimonium Crudum", abbr: "Ant-c.", kentId: 1202,
    description: "Thick white-coated tongue is the keynote. Stomach complaints from overindulgence. Irritable, doesn't want to be touched or looked at. Cracked corners of mouth. Hardened skin on soles.",
    commonSymptoms: ["mouth-tongue-white", "stomach-nausea-eating", "mind-irritability", "skin-cracks", "ext-corns-painful"],
    dosage: "30C for stomach complaints. 200C for chronic skin conditions.",
    modalities: { worse: ["Overeating", "Heat of sun", "Cold bathing", "Evening", "Sour food"], better: ["Open air", "Rest", "Warm bath"] }
  },
  {
    id: "ant-t", name: "Antimonium Tartaricum", abbr: "Ant-t.", kentId: 1203,
    description: "Great rattling of mucus with inability to expectorate. Drowsiness and weakness. Nausea and vomiting with cold sweat. Pale or cyanotic face. Useful in old people and children with chest complaints.",
    commonSymptoms: ["resp-rattling", "cough-loose", "gen-weakness", "stomach-nausea", "resp-difficult"],
    dosage: "30C for rattling cough. 200C for serious respiratory conditions. Repeat as needed.",
    modalities: { worse: ["Warm room", "Lying down", "Damp cold weather", "Evening", "Anger"], better: ["Sitting up", "Expectoration", "Cold air", "Vomiting"] }
  },
  {
    id: "bapt", name: "Baptisia Tinctoria", abbr: "Bapt.", kentId: 1205,
    description: "Great prostration with besotted look. Dark red face. Foul odor of body, breath, stool. Feels scattered and in pieces. Falls asleep while being spoken to. Typhoid states.",
    commonSymptoms: ["gen-weakness", "fever-high", "mind-confusion", "mouth-breath-offensive", "stool-offensive"],
    dosage: "30C for acute fever/flu. Repeat every 2-4 hours. 200C for typhoid-like states.",
    modalities: { worse: ["Fog", "Open air", "Humidity", "Walking"], better: ["Rest"] }
  },
  {
    id: "borax", name: "Borax", abbr: "Bor.", kentId: 1207,
    description: "Fear of downward motion—child screams when lowered. Mouth ulcers (aphthae) in children. Starts from slightest noise. Motion sickness from downward motion. Hot mouth with aphthae.",
    commonSymptoms: ["mind-fear", "mouth-ulcers", "mind-restlessness", "sleep-insomnia"],
    dosage: "30C for aphthae and fear of downward motion. 200C for chronic conditions.",
    modalities: { worse: ["Downward motion", "Sudden noise", "Cold wet weather", "10 AM", "Fruit"], better: ["Pressure", "Holding affected part", "Evening"] }
  },
  {
    id: "canth", name: "Cantharis", abbr: "Canth.", kentId: 1209,
    description: "Violent burning and cutting pains, especially in urinary tract. Constant urging to urinate with burning. Urine passes drop by drop. Burns and scalds. Restless with burning.",
    commonSymptoms: ["urine-burning", "urine-frequent", "urine-retention", "skin-eruptions-vesicular"],
    dosage: "30C for UTI symptoms. Repeat every 2 hours. 200C for severe cases. Also used externally as tincture for burns.",
    modalities: { worse: ["Urinating", "Drinking", "Touch", "Cold water", "Bright objects"], better: ["Rubbing", "Rest", "Warmth", "Cold applications (burns)"] }
  },
  {
    id: "spong-new", name: "Spongia Tosta", abbr: "Spong.", kentId: 1211,
    description: "Dry barking croupy cough as if sawing through a dry log. Anxiety with oppression. Goiter. Cough better from eating and drinking. Laryngeal dryness with constant clearing.",
    commonSymptoms: ["cough-barking", "cough-dry", "resp-difficult", "throat-dryness", "chest-anxiety-in"],
    dosage: "30C for croup. 200C for severe respiratory distress. Repeat every 30 minutes in croup.",
    modalities: { worse: ["Before midnight", "Ascending", "Cold wind", "Talking", "Sweets", "Smoking"], better: ["Eating", "Drinking warm things", "Lying with head low"] }
  },
  {
    id: "aur", name: "Aurum Metallicum", abbr: "Aur.", kentId: 1215,
    description: "Deep depression with suicidal thoughts. Feels worthless and desires death. Bone pains, especially nose and skull. Heart hypertrophy. High blood pressure. Very conscientious.",
    commonSymptoms: ["mind-suicidal", "mind-sadness", "chest-palpitation", "nose-obstruction", "gen-weakness"],
    dosage: "200C to 1M constitutional. Not to be repeated frequently. Single dose preferred.",
    modalities: { worse: ["Cold weather", "Night", "Mental exertion", "Grief", "Disappointment"], better: ["Warmth", "Open air", "Music", "Walking", "Moonlight"] }
  },
  {
    id: "bar-c", name: "Baryta Carbonica", abbr: "Bar-c.", kentId: 1217,
    description: "Delayed development in children—physically and mentally. Enlarged tonsils with recurrent sore throat. Shy, timid, hides behind furniture. Senile dementia in old age. Swollen cervical glands.",
    commonSymptoms: ["throat-inflammation-tonsils", "throat-swelling-tonsils", "mind-fear-strangers", "mind-memory", "mind-concentration-children"],
    dosage: "200C constitutional for children. 30C for acute tonsillitis. Infrequent repetition.",
    modalities: { worse: ["Cold air", "Thinking of complaints", "Company", "Washing", "Damp"], better: ["Open air", "Walking"] }
  },
  {
    id: "berb", name: "Berberis Vulgaris", abbr: "Berb.", kentId: 1219,
    description: "Kidney and gallbladder remedy. Pains radiating from one point in all directions. Renal colic. Bubbling sensation in kidneys. Stinging, tearing pains in joints. Urinary complaints.",
    commonSymptoms: ["urine-kidney-pain", "urine-sediment-red", "urine-sediment-sandy", "abdomen-liver-pain", "ext-pain-joints"],
    dosage: "30C for renal colic. Tincture or 6C for mild urinary complaints. Repeat 3 times daily.",
    modalities: { worse: ["Motion", "Standing", "Fatigue", "Urinating"], better: ["Rest"] }
  },
  {
    id: "bov", name: "Bovista", abbr: "Bov.", kentId: 1220,
    description: "Bleeding between periods. Skin eruptions from use of cosmetics. Palpitation from overexertion. Awkward, drops things. Stammering from excitement. Misplaces words when speaking.",
    commonSymptoms: ["female-irregular", "skin-eruptions", "chest-palpitation-exertion", "mind-memory-words"],
    dosage: "30C for menstrual irregularities. 200C constitutional.",
    modalities: { worse: ["Morning", "Early morning on waking", "Full moon", "Hot weather"], better: ["Cold", "Eating", "Open air"] }
  },
  {
    id: "bufo", name: "Bufo Rana", abbr: "Bufo.", kentId: 1222,
    description: "Epileptic convulsions with howling before attack. Mind dulled. Sexual excesses. Infantile behavior in adults. Convulsions during sleep. Lymphangitis with red streaks.",
    commonSymptoms: ["gen-convulsions", "mind-confusion", "gen-weakness", "sleep-disturbed"],
    dosage: "200C for convulsive conditions. Single dose. Do not repeat frequently.",
    modalities: { worse: ["Sleep", "Warm room", "Sexual excesses", "Before menses"], better: ["Cold bathing", "Putting feet in hot water"] }
  },
  {
    id: "camph", name: "Camphora Officinarum", abbr: "Camph.", kentId: 1224,
    description: "Collapse with icy coldness of whole body yet does not want to be covered. Sudden sinking of strength. First stage of cholera. Cold perspiration on face. Skin pale and blue.",
    commonSymptoms: ["gen-weakness", "fever-perspiration-cold", "gen-faintness", "skin-discoloration-blue"],
    dosage: "Tincture on sugar for acute collapse. 30C for milder cases. Repeat frequently in emergencies.",
    modalities: { worse: ["Night", "Cold", "Motion", "Contact"], better: ["Warmth", "Thinking about complaints"] }
  },
  {
    id: "caps", name: "Capsicum Annuum", abbr: "Caps.", kentId: 1225,
    description: "Homesickness with red face and sleeplessness. Burning in mouth and stomach. Stinging in ears during cough. Fat, lazy, unclean persons. Cough with pain in distant parts.",
    commonSymptoms: ["mind-homesickness", "stomach-pain-burning", "ear-pain", "cough-violent"],
    dosage: "30C for homesickness and burning complaints. Repeat 3 times daily.",
    modalities: { worse: ["Open air", "Cold", "Drinking", "Drafts", "After eating"], better: ["Eating", "Warmth", "Continued motion"] }
  },
  {
    id: "clem", name: "Clematis Erecta", abbr: "Clem.", kentId: 1227,
    description: "Inflammation of testes especially right. Urethral stricture. Skin eruptions oozing after scratching. Dark-haired men. Dental pain worse at night. Glandular induration.",
    commonSymptoms: ["male-pain-testes-right", "male-swelling-testes-right", "skin-eruptions-moist", "urine-burning"],
    dosage: "30C for testicular inflammation. 200C for chronic urethral conditions.",
    modalities: { worse: ["Night", "Warmth of bed", "Washing", "New moon"], better: ["Open air", "Cold applications", "Sweating"] }
  },
  {
    id: "eup-per", name: "Eupatorium Perfoliatum", abbr: "Eup-per.", kentId: 1230,
    description: "Bone-breaking pain—aching in bones as if broken. Influenza with great soreness. Thirst for cold drinks before chill. Vomiting of bile after chill. Dengue-like fever.",
    commonSymptoms: ["ext-pain-joints", "fever-chills", "gen-weakness", "stomach-vomiting-bile", "back-pain"],
    dosage: "30C for influenza. Repeat every 2-4 hours. 200C for severe bone pain.",
    modalities: { worse: ["7-9 AM", "Periodically", "Cold air", "Motion", "Lying on bones"], better: ["Vomiting bile", "Conversation", "Getting on hands and knees", "Sweating"] }
  },
  {
    id: "helon", name: "Helonias Dioica", abbr: "Helon.", kentId: 1232,
    description: "Uterine prolapse with backache. Consciousness of womb—always feels it. Leucorrhoea with heaviness. Exhaustion from overwork. Diabetic tendencies. Albuminuria during pregnancy.",
    commonSymptoms: ["female-leucorrhoea", "back-pain-lumbar", "gen-weakness", "female-irregular"],
    dosage: "30C for uterine complaints. Tincture to 6C for mild cases.",
    modalities: { worse: ["Fatigue", "Cold", "Stooping", "Standing"], better: ["Being occupied", "Being busy", "Holding abdomen"] }
  },
  {
    id: "kali-i", name: "Kali Iodatum", abbr: "Kali-i.", kentId: 1234,
    description: "Acrid watery nasal discharge. Syphilitic complaints. Glandular swellings. Bones and periosteum affected. Worse from warmth. Pains at night. Iodide headache over eyes.",
    commonSymptoms: ["nose-discharge-watery", "nose-coryza-fluent", "gen-heat-agg", "ext-pain-joints"],
    dosage: "30C for acute sinusitis. 200C for chronic syphilitic conditions.",
    modalities: { worse: ["Night", "Warmth", "Warm room", "Damp weather", "3 AM"], better: ["Open air", "Motion", "Cold"] }
  },
  {
    id: "kalm", name: "Kalmia Latifolia", abbr: "Kalm.", kentId: 1236,
    description: "Shooting pains that travel downward. Heart disease following rheumatism. Slow pulse. Neuralgic pains shifting rapidly. Right-sided sciatica. Visible palpitation.",
    commonSymptoms: ["chest-heart-pain", "chest-palpitation", "ext-pain-rheumatic", "ext-pain-wandering"],
    dosage: "30C for cardiac-rheumatic conditions. 200C for chronic cases.",
    modalities: { worse: ["Leaning forward", "Bending forward", "Looking down", "Morning", "Sun"], better: ["Lying still", "Eating", "Recumbent position"] }
  },
  {
    id: "lac-c", name: "Lac Caninum", abbr: "Lac-c.", kentId: 1238,
    description: "Symptoms alternate sides—today right, tomorrow left. Sore throat alternating sides. Extremely sensitive to touch, even of clothing. Floating sensation. Forgetful.",
    commonSymptoms: ["throat-pain", "mind-memory", "chest-pain-mammae", "gen-touch-sensitive"],
    dosage: "200C for alternating symptoms. 30C for acute sore throat.",
    modalities: { worse: ["Touch", "Jarring", "Morning on waking"], better: ["Cold drinks", "Open air"] }
  },
  {
    id: "lac-d", name: "Lac Defloratum", abbr: "Lac-d.", kentId: 1239,
    description: "Sick headache with nausea and vomiting. Headache preceded by dimness of vision. Great despondency. Obesity. Constipation. Intolerance of milk.",
    commonSymptoms: ["head-pain", "stomach-nausea", "stomach-aversion-milk", "gen-obesity", "rectum-constipation"],
    dosage: "30C for migraine. 200C for chronic conditions.",
    modalities: { worse: ["Morning", "Menses", "Cold air", "Motion"], better: ["Open air", "Lying down"] }
  },
  {
    id: "laur", name: "Laurocerasus", abbr: "Laur.", kentId: 1240,
    description: "Gasping for breath—clutches at heart. Cyanosis. Suffocative spells. Long-lasting fainting. Cold skin. Sensation of a ball in the throat. Last stages of cardiac or respiratory disease.",
    commonSymptoms: ["resp-difficult", "gen-faintness", "chest-weakness", "skin-discoloration-blue"],
    dosage: "30C for acute breathing difficulties. Tincture in emergencies.",
    modalities: { worse: ["Sitting up", "Exertion", "Cold food"], better: ["Open air", "Lying down"] }
  },
  {
    id: "lyss", name: "Lyssin (Hydrophobinum)", abbr: "Lyss.", kentId: 1242,
    description: "Fear of water. Convulsions from sight of water. Hyperesthesia of all senses. Cannot bear sight of running water. Dread of being alone. Loquacity with rapid speech.",
    commonSymptoms: ["mind-fear-water", "gen-convulsions", "mind-fear-alone", "mind-restlessness"],
    dosage: "200C to 1M. Nosode, single dose preferred.",
    modalities: { worse: ["Sight/sound of water", "Bright lights", "Heat of sun", "Riding"], better: ["Gentle rubbing", "Bending backward"] }
  },
];

fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'remedies.json'),
  JSON.stringify({ remedies }, null, 2)
);

console.log(`Written remedies.json with ${remedies.length} remedies`);
