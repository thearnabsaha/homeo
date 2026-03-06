/**
 * Comprehensive data enrichment script
 * Draws from Kent, Boericke, Clarke, Allen, and Boger materia medicas
 * to build the most complete homeopathic repertory dataset possible.
 */

const fs = require('fs');
const path = require('path');

function buildRemedies() {
  return [
    { id: "acon", name: "Aconitum Napellus", abbr: "Acon.", description: "Sudden violent onset from cold dry winds or fright. Intense anxiety, fear of death, restlessness. Everything sudden and intense.", dosage: "30C for acute conditions, 200C for intense fear states", commonSymptoms: ["mind-fear-death","mind-anxiety","mind-restlessness","fever-high-sudden","chest-palpitation-anxiety","head-pain-congestive"], modalities: { worse: ["Evening","Night","Cold dry winds","Warm room","Music","Tobacco smoke"], better: ["Open air","Rest","Wine"] }},
    { id: "ars", name: "Arsenicum Album", abbr: "Ars.", description: "Great restlessness with prostration. Burning pains relieved by heat. Anxiety about health, fear of death. Thirst for small sips. Periodicity of complaints. Fastidious patient.", dosage: "30C for acute, 200C for chronic", commonSymptoms: ["mind-fear-death","mind-anxiety","mind-restlessness","stomach-nausea","stomach-vomiting","skin-itching","skin-burning","abdomen-pain-burning"], modalities: { worse: ["After midnight","Cold","Cold drinks","Cold food","Right side","Seashore"], better: ["Heat","Warm drinks","Head elevated","Company"] }},
    { id: "bell", name: "Belladonna", abbr: "Bell.", description: "Sudden onset, violence, burning heat, bright redness, throbbing. Hot, red, swollen. Delirium with dilated pupils. No thirst with fever. All senses hyperacute.", dosage: "30C for acute fever/headache, 200C for severe conditions", commonSymptoms: ["head-pain-throbbing","head-pain-congestive","head-congestion","fever-high-sudden","face-red-hot","eyes-dilated-pupils","skin-red-hot"], modalities: { worse: ["Touch","Jar","Noise","Drafts","Afternoon","Lying down"], better: ["Semi-erect position","Light covering","Rest"] }},
    { id: "bry", name: "Bryonia Alba", abbr: "Bry.", description: "Slow onset. All complaints worse from any motion. Dryness of mucous membranes. Great thirst for large quantities at long intervals. Irritable, wants to be alone, talks of business.", dosage: "30C for acute, 200C for chronic", commonSymptoms: ["head-pain-pressing","head-pain-forehead","chest-pain-stitching","chest-pain-breathing","abdomen-pain-pressure","extremities-joint-pain","fever-with-thirst"], modalities: { worse: ["Any motion","Warmth","Morning","Eating","Touch","Exertion"], better: ["Rest","Lying on painful side","Pressure","Cold things","Cool open air"] }},
    { id: "calc", name: "Calcarea Carbonica", abbr: "Calc.", description: "Fair, fat, flabby. Profuse perspiration especially head. Cold, damp feet. Sour discharges. Slow development. Craves eggs. Apprehensive, fears losing reason.", dosage: "200C monthly for constitutional treatment", commonSymptoms: ["mind-fear-insanity","mind-anxiety-health","head-perspiration","extremities-cold-feet","stomach-craves-eggs","generalities-obesity","back-pain-lumbar"], modalities: { worse: ["Cold damp","Exertion","Full moon","Standing","Milk"], better: ["Dry weather","Lying on painful side","Sneezing"] }},
    { id: "carb-v", name: "Carbo Vegetabilis", abbr: "Carb-v.", description: "The corpse reviver. Extreme exhaustion, air hunger, wants to be fanned. Flatulence with distension. Cold breath, cold body. Sluggish venous circulation. Collapse states.", dosage: "30C for digestive issues, 200C for collapse", commonSymptoms: ["generalities-exhaustion","abdomen-flatulence","abdomen-distension","respiration-difficult","chest-oppression","stomach-bloating","skin-blue-cold"], modalities: { worse: ["Warm damp weather","Evening","Night","Eating fat","Butter","Coffee","Wine"], better: ["Cool air","Being fanned","Eructation","Elevating feet"] }},
    { id: "caust", name: "Causticum", abbr: "Caust.", description: "Paralysis of single parts. Burning rawness. Sympathetic, idealistic. Contraction of tendons. Restless at night. Warts. Chronic effects of grief and sorrow.", dosage: "200C for chronic conditions", commonSymptoms: ["mind-grief","extremities-paralysis","urine-retention","urine-incontinence","throat-rawness","cough-with-pain","back-pain-lumbar","skin-warts"], modalities: { worse: ["Dry cold winds","Clear fine weather","Coffee","3-4 AM"], better: ["Damp wet weather","Warmth of bed","Cold drinks"] }},
    { id: "cham", name: "Chamomilla", abbr: "Cham.", description: "Oversensitive to pain - pain seems unbearable. Cross, ugly, snappish. One cheek red, other pale. Child wants to be carried. Numbness with the pain.", dosage: "30C for teething/colic, 200C for pain", commonSymptoms: ["mind-irritability","mind-anger","ear-pain-child","abdomen-colic","sleep-disturbed","fever-one-cheek-red"], modalities: { worse: ["Heat","Anger","Open air","Wind","Night","Coffee","Narcotics"], better: ["Being carried","Warm wet weather","Fasting","Cold applications"] }},
    { id: "chin", name: "China Officinalis", abbr: "Chin.", description: "Debility from loss of vital fluids (blood, diarrhea). Periodicity. Bloating of whole abdomen. Sensitive to touch but hard pressure ameliorates. Anemia.", dosage: "30C for acute, 6C for anemia", commonSymptoms: ["generalities-weakness-fluid-loss","abdomen-flatulence","abdomen-distension","fever-intermittent","head-pain-after-hemorrhage","stomach-bloating"], modalities: { worse: ["Slightest touch","Loss of vital fluids","Every other day","Drafts","Open air","Night"], better: ["Hard pressure","Bending double","Warmth","Open air"] }},
    { id: "cimic", name: "Cimicifuga Racemosa", abbr: "Cimic.", description: "Muscular and nervous system. Depression with dark gloomy feelings. Stiffness and pain in neck and back. Sensation as if a cloud enveloped her. Female complaints.", dosage: "30C for acute, 200C for chronic", commonSymptoms: ["mind-depression","mind-fear-insanity","back-pain-neck","back-stiffness","female-menstrual-pain","extremities-muscle-pain"], modalities: { worse: ["Morning","Cold","Damp","During menses","Emotions"], better: ["Warmth","Eating","Open air","Pressure"] }},
    { id: "cocc", name: "Cocculus Indicus", abbr: "Cocc.", description: "Motion sickness. Vertigo. Sensation of hollowness. Effects of night watching/nursing. Slowness of comprehension. Nausea at thought/smell of food.", dosage: "30C for motion sickness/vertigo", commonSymptoms: ["head-vertigo","stomach-nausea-motion","stomach-nausea","mind-slow-comprehension","generalities-weakness-sleeplessness","back-pain-lumbar"], modalities: { worse: ["Motion","Riding","Loss of sleep","Open air","Noise","Jar","Touch","Eating","Drinking","Smoking"], better: ["Lying quietly","In a room"] }},
    { id: "coff", name: "Coffea Cruda", abbr: "Coff.", description: "Unusual activity of body and mind. All senses acute. Sleeplessness from mental activity. Joy, excitement. Toothache better holding cold water.", dosage: "30C for insomnia/overexcitement", commonSymptoms: ["mind-excitable","sleep-insomnia","head-pain-one-sided","mouth-toothache","mind-restlessness"], modalities: { worse: ["Excessive emotions","Narcotics","Strong odors","Noise","Open air","Cold","Night"], better: ["Warmth","Lying down","Holding cold water in mouth"] }},
    { id: "coloc", name: "Colocynthis", abbr: "Coloc.", description: "Agonizing pain in abdomen forcing to bend double. Colic from anger. Cramping, gripping pains. Sciatica. Restless with pain.", dosage: "30C for colic/neuralgia", commonSymptoms: ["abdomen-colic","abdomen-pain-cramping","abdomen-pain-bending-double","extremities-sciatica","mind-anger-effects","stomach-cramps"], modalities: { worse: ["Anger","Indignation","Lying on painless side","Night","Rest"], better: ["Bending double","Hard pressure","Warmth","Coffee","Gentle motion"] }},
    { id: "con", name: "Conium Maculatum", abbr: "Con.", description: "Ascending paralysis. Hard glandular indurations. Vertigo on turning in bed. Effects of celibacy. Gradually increasing weakness. Tumors and cancerous growths.", dosage: "200C for chronic conditions", commonSymptoms: ["head-vertigo-turning","extremities-ascending-paralysis","generalities-glands-hard","generalities-weakness-ascending","male-complaints","female-breast-tumors"], modalities: { worse: ["Turning in bed","Lying down","Celibacy","Before/during menses","Night","Cold"], better: ["Fasting","Motion","Pressure","In the dark","Letting affected part hang down"] }},
    { id: "cupr", name: "Cuprum Metallicum", abbr: "Cupr.", description: "Cramps and spasms. Violent spasmodic effects. Blue face during spasms. Metallic taste. Colic with thumbs clenched. Convulsions.", dosage: "30C for cramps, 200C for convulsions", commonSymptoms: ["abdomen-cramps-violent","extremities-cramps-calves","respiration-spasmodic-cough","chest-spasms","stomach-cramps","generalities-convulsions"], modalities: { worse: ["Touch","Vomiting","Hot weather","Before menses","Raising arms"], better: ["Cold drinks","Stretching","Perspiration"] }},
    { id: "dig", name: "Digitalis Purpurea", abbr: "Dig.", description: "Heart remedy - slow, weak, intermittent pulse. Faintness. Nausea. Liver congestion. Sensation as if heart would stop if patient moves. Dropsy.", dosage: "Mother tincture to 6C for heart conditions", commonSymptoms: ["chest-palpitation","chest-heart-slow","chest-heart-irregular","stomach-nausea","urine-scanty","generalities-dropsy","mind-fear-death"], modalities: { worse: ["Sitting erect","Music","Exertion","Lying on left side"], better: ["Open air","Empty stomach","Rest"] }},
    { id: "dulc", name: "Dulcamara", abbr: "Dulc.", description: "Every cold damp change of weather causes symptoms. Catarrhal affections. Rheumatic complaints from exposure to damp cold. Urticaria from cold.", dosage: "30C for acute colds from damp weather", commonSymptoms: ["generalities-worse-damp","respiration-cold-damp","skin-urticaria","extremities-rheumatic","head-cold-damp","throat-sore-damp"], modalities: { worse: ["Cold damp weather","Night","Rest","Before storm","Autumn","Getting wet"], better: ["Warmth","Dry weather","Motion","External warmth"] }},
    { id: "ferr", name: "Ferrum Metallicum", abbr: "Ferr.", description: "Anemia with flushing face. Pallor alternating with redness. Weakness with desire to lie down. Hemorrhages of bright red blood. False plethora.", dosage: "6C-30C for anemia", commonSymptoms: ["generalities-anemia","face-flushing","head-pain-hammering","stomach-vomiting-after-eating","extremities-weakness","generalities-hemorrhage-bright"], modalities: { worse: ["While sitting quietly","After midnight","Eggs","Tea","Cold bathing","Exertion"], better: ["Walking slowly","Summer","Leaning head on something"] }},
    { id: "gels", name: "Gelsemium Sempervirens", abbr: "Gels.", description: "Great muscular weakness and trembling. Drowsy, droopy, dizzy, dull. Anticipatory anxiety. Influenza. Absence of thirst. Heavy eyelids. Gradual onset.", dosage: "30C for flu/anxiety, 200C for chronic", commonSymptoms: ["mind-anxiety-anticipation","mind-fear-public","head-pain-back-head","head-heaviness","fever-without-thirst","generalities-weakness-trembling","eyes-heavy-drooping"], modalities: { worse: ["Damp weather","Fog","Before thunderstorm","Emotion","Fright","Bad news","10 AM"], better: ["Open air","Continued motion","Stimulants","Urination","Profuse sweating"] }},
    { id: "graph", name: "Graphites", abbr: "Graph.", description: "Tendency to obesity. Rough, hard, skin with eczema oozing honey-like sticky discharge. Constipation. Sad, hesitates, sensitive to music. Cold patient.", dosage: "200C for chronic skin/constitutional", commonSymptoms: ["skin-eczema","skin-oozing-sticky","skin-cracks","stomach-flatulence","abdomen-constipation","generalities-obesity","mind-sadness"], modalities: { worse: ["Warmth","Night","During/after menses","Cold","Light"], better: ["Open air","Wrapping up","Dark","Walking","Eating"] }},
    { id: "hep", name: "Hepar Sulphuris Calcareum", abbr: "Hep.", description: "Extreme sensitivity to pain, cold, touch. Splinter-like pains. Suppuration. Tendency to form pus. Sweats easily without relief. Chilly, irritable.", dosage: "30C to promote drainage, 200C to check suppuration", commonSymptoms: ["skin-suppuration","throat-splinter-pain","ear-pain-sharp","skin-sensitive-touch","cough-croupy","generalities-sensitive-cold"], modalities: { worse: ["Dry cold winds","Cool air","Slightest draft","Touch","Lying on painful side","Night"], better: ["Warmth","Wrapping head","Damp weather","After eating"] }},
    { id: "hyos", name: "Hyoscyamus Niger", abbr: "Hyos.", description: "Foolish, loquacious, obscene behavior. Jealousy. Suspicion. Spasmodic, nervous conditions. Dry, spasmodic cough lying down. Picks at bedclothes.", dosage: "30C for acute, 200C for behavioral", commonSymptoms: ["mind-jealousy","mind-suspicion","mind-delirium","cough-dry-night","cough-worse-lying","sleep-disturbed","generalities-spasms"], modalities: { worse: ["Night","After eating","Lying down","Emotions","Touch","Jealousy"], better: ["Sitting up","Warmth","Stooping"] }},
    { id: "hyper", name: "Hypericum Perforatum", abbr: "Hyper.", description: "The Arnica of nerve injuries. Injuries to nerve-rich areas: fingers, toes, spine. Shooting pains along nerves. Excessive pain from injury. Prevents tetanus.", dosage: "30C for nerve injuries, topically as tincture", commonSymptoms: ["extremities-nerve-injury","back-injury-spine","extremities-shooting-pain","head-injury","extremities-pain-fingers"], modalities: { worse: ["Touch","Cold","Damp","Fog","In a closed room","Exertion","Change of weather"], better: ["Bending head backward","Rubbing"] }},
    { id: "ign", name: "Ignatia Amara", abbr: "Ign.", description: "The great grief remedy. Contradictory symptoms. Silent brooding. Sighing. Lump in throat. Worse from consolation. Hysterical manifestations. Effects of suppressed grief.", dosage: "200C for acute grief/emotional shock", commonSymptoms: ["mind-grief","mind-sighing","throat-lump-sensation","mind-contradictory","mind-hysteria","head-pain-as-nail","sleep-insomnia-grief"], modalities: { worse: ["Morning","Open air","After eating","Coffee","Smoking","External warmth","Consolation"], better: ["While eating","Change of position","Hard pressure","Alone","Deep breathing"] }},
    { id: "iod", name: "Iodum", abbr: "Iod.", description: "Great emaciation despite good appetite. Hot patient. Glandular enlargement especially thyroid. Ravenous hunger, eats constantly yet loses weight. Restless.", dosage: "30C for thyroid/glandular conditions", commonSymptoms: ["generalities-emaciation-eating-well","generalities-glands-enlarged","throat-thyroid-enlarged","stomach-hunger-extreme","generalities-hot-patient","mind-restlessness"], modalities: { worse: ["Heat","Fasting","Rest","Right side","Warm room","Warm weather"], better: ["Cold","Open air","Walking","After eating"] }},
    { id: "ip", name: "Ipecacuanha", abbr: "Ip.", description: "Persistent nausea not relieved by vomiting. Clean tongue with nausea. Hemorrhages of bright red blood with nausea. Bronchial asthma with nausea.", dosage: "30C for nausea/vomiting/hemorrhage", commonSymptoms: ["stomach-nausea-constant","stomach-vomiting","respiration-asthma","cough-rattling","generalities-hemorrhage-nausea","chest-wheezing"], modalities: { worse: ["Periodically","Moist warm wind","Lying down","Overheating"], better: ["Open air","Rest","Pressure","Closing eyes"] }},
    { id: "kali-b", name: "Kali Bichromicum", abbr: "Kali-bi.", description: "Tough, stringy, ropy discharges. Ulceration with punched-out edges. Pain in small spots. Sinus problems. Migrating pains.", dosage: "30C for sinus/mucous membrane conditions", commonSymptoms: ["nose-discharge-stringy","throat-ulceration","head-pain-small-spot","nose-sinusitis","stomach-ulcer","skin-ulcer-punched-out"], modalities: { worse: ["Morning","Hot weather","Beer","Undressing","2-3 AM"], better: ["Heat","Pressure","Motion","Short sleep"] }},
    { id: "kali-c", name: "Kali Carbonicum", abbr: "Kali-c.", description: "Weakness, backache, sweat. Stitching pains. Bag-like swelling over upper eyelids. Worse 2-4 AM. Conservative, duty-bound, irritable. Catches cold easily.", dosage: "200C for chronic conditions", commonSymptoms: ["back-pain-lumbar","back-pain-stitching","chest-pain-stitching","eyes-edema-upper-lid","generalities-worse-2-4am","generalities-weakness","cough-worse-3am"], modalities: { worse: ["2-4 AM","Cold","Soup/Coffee","Drafts","Lying on affected side","Exertion"], better: ["Warmth","Sitting with elbows on knees","Open air","Daytime","Motion"] }},
    { id: "kali-m", name: "Kali Muriaticum", abbr: "Kali-m.", description: "White or grayish-white discharges. Catarrhal conditions. Eustachian tube blockage. Deafness from catarrh. Fibrinous exudations.", dosage: "6X biochemic for catarrhal conditions", commonSymptoms: ["ear-deafness-catarrh","throat-white-patches","nose-discharge-white","skin-eczema-white","generalities-glands-swollen"], modalities: { worse: ["Rich food","Fatty food","Motion","Open air"], better: ["Cold drinks","Rubbing","Letting hair down"] }},
    { id: "kali-p", name: "Kali Phosphoricum", abbr: "Kali-p.", description: "Nervous exhaustion. Mental and physical depression. Conditions from worry, overwork, excitement. Putrid discharges. Brain fag.", dosage: "6X for nervous exhaustion, 30C for acute", commonSymptoms: ["mind-anxiety","mind-depression","mind-exhaustion-mental","generalities-weakness-nervous","sleep-insomnia-worry","head-pain-students"], modalities: { worse: ["Worry","Mental/physical exertion","Early morning","Cold","Excitement"], better: ["Warmth","Rest","Nourishment","Sleep","Gentle motion","Company"] }},
    { id: "lach", name: "Lachesis Mutus", abbr: "Lach.", description: "Left-sided remedy. Worse after sleep. Cannot bear tight clothing, especially around neck/waist. Loquacious. Jealous, suspicious. Hot flushes. Purple/bluish discoloration.", dosage: "200C for chronic, 30C for acute", commonSymptoms: ["mind-jealousy","mind-suspicion","mind-loquacity","throat-worse-left","generalities-worse-after-sleep","generalities-worse-tight-clothing","female-menopause","skin-purple"], modalities: { worse: ["After sleep","Touch","Tight clothing","Hot drinks","Hot bath","Closing eyes","Spring","Left side","Alcohol"], better: ["Open air","Cold drinks","Hard pressure","Appearance of discharges","Loosening garments"] }},
    { id: "led", name: "Ledum Palustre", abbr: "Led.", description: "Puncture wounds, insect bites. Cold affected parts yet aversion to warmth. Ascending rheumatism (feet to hip). Black eye from injury. Tetanus prophylactic.", dosage: "30C for puncture wounds/bites", commonSymptoms: ["extremities-puncture-wound","skin-insect-bites","extremities-rheumatic-ascending","eyes-black-eye","extremities-cold-aversion-warmth","generalities-tetanus-prevention"], modalities: { worse: ["Warmth","Warm bed","Motion","Night","Spirits"], better: ["Cold","Cold applications","Cold bathing","Rest"] }},
    { id: "lyc", name: "Lycopodium Clavatum", abbr: "Lyc.", description: "Right-sided remedy (or right to left). Intellectual but physically weak. Fear of being alone, yet dread of company. Flatulence. Liver remedy. 4-8 PM aggravation.", dosage: "200C for constitutional, 30C for acute", commonSymptoms: ["mind-fear-alone","mind-lack-confidence","abdomen-flatulence","abdomen-bloating-4pm","stomach-fullness-small-amount","generalities-worse-4-8pm","urine-kidney-stones","back-pain-right"], modalities: { worse: ["Right side","4-8 PM","Warmth","Warm room","Hot air","Bed","Oysters","Flatulent food"], better: ["Cold food/drinks","Being uncovered","Motion","After midnight","Warm food/drink","Urinating","Eructation"] }},
    { id: "mag-p", name: "Magnesia Phosphorica", abbr: "Mag-p.", description: "Great anti-spasmodic. Cramping, shooting, darting pains. Right-sided neuralgias. Colic relieved by warmth and pressure. Menstrual cramps.", dosage: "6X in hot water for cramps, 30C otherwise", commonSymptoms: ["abdomen-colic","abdomen-cramps-menstrual","extremities-cramps","head-pain-neuralgic","generalities-spasms","stomach-cramps"], modalities: { worse: ["Cold","Night","Touch","Right side","Milk"], better: ["Warmth","Hot applications","Pressure","Bending double","Rubbing"] }},
    { id: "merc", name: "Mercurius Solubilis", abbr: "Merc.", description: "Human thermometer - sensitive to both heat and cold. Profuse offensive sweat. Increased saliva. Metallic taste. Night aggravation. Tremor. Swollen glands.", dosage: "30C for acute, 200C for chronic", commonSymptoms: ["mouth-saliva-excess","mouth-metallic-taste","throat-sore","generalities-sweat-offensive","generalities-worse-night","generalities-glands-swollen","stool-dysentery"], modalities: { worse: ["Night","Wet damp weather","Perspiration","Warm room","Warm bed","Lying on right side","Drafts to head"], better: ["Moderate temperature","Rest"] }},
    { id: "nat-m", name: "Natrum Muriaticum", abbr: "Nat-m.", description: "The chronic grief remedy. Ailments from suppressed grief. Craves salt. Aversion to sun. Headache from sunrise to sunset. Worse consolation. Mapped tongue. Herpes.", dosage: "200C for constitutional", commonSymptoms: ["mind-grief-suppressed","mind-worse-consolation","head-pain-sunrise-sunset","skin-herpes","generalities-craves-salt","stomach-thirst-extreme","mouth-mapped-tongue"], modalities: { worse: ["10 AM","Consolation","Heat of sun","Seashore","Mental exertion","Noise","Lying down","Talking"], better: ["Open air","Cold bathing","Going without meals","Tight clothing","Lying on right side","Deep breathing","Sweating"] }},
    { id: "nat-s", name: "Natrum Sulphuricum", abbr: "Nat-s.", description: "Head injuries and their chronic effects. Worse humid weather. Liver remedy. Asthma in damp weather. Suicidal tendency from injury. Gonorrhea.", dosage: "200C for head injury sequelae", commonSymptoms: ["head-injury-chronic","mind-depression-head-injury","generalities-worse-damp","abdomen-liver-complaints","respiration-asthma-damp","stool-diarrhea-morning"], modalities: { worse: ["Damp weather","Damp house","Lying on left side","Late evening","Music","4-5 AM"], better: ["Dry weather","Open air","Pressure","Changing position"] }},
    { id: "nit-ac", name: "Nitricum Acidum", abbr: "Nit-ac.", description: "Splinter-like pains especially in ulcers. Offensive discharges. Fissures. Warts. Urine smells like horse's urine. Anxious about health, fears death.", dosage: "30C for acute, 200C for chronic", commonSymptoms: ["skin-warts","skin-fissures","skin-ulcers-splinter-pain","rectum-fissure","mouth-ulcers","urine-offensive","mind-anxiety-health"], modalities: { worse: ["Touch","Jarring","Cold","Night","Changing weather","Mercury","Milk","Heat of bed"], better: ["Riding in car","Mild weather","Steady pressure"] }},
    { id: "nux-v", name: "Nux Vomica", abbr: "Nux-v.", description: "The modern life remedy. Over-stimulation from spicy food, coffee, alcohol, drugs. Irritable, ambitious, competitive. Chilly. Digestive disorders. Hangover remedy.", dosage: "30C for acute digestive/hangover, 200C chronic", commonSymptoms: ["mind-irritability","mind-anger","stomach-nausea-morning","stomach-hangover","abdomen-constipation","sleep-insomnia-3am","head-pain-hangover","generalities-chilly"], modalities: { worse: ["Morning","Mental exertion","After eating","Touch","Anger","Spices","Narcotics","Stimulants","Dry weather","Cold"], better: ["Evening","Rest","Nap","Wrapping up","Hot drinks","Milk","Moist air"] }},
    { id: "op", name: "Opium", abbr: "Op.", description: "Complete loss of sensibility. Drowsiness, stupor. Painlessness of usually painful conditions. Fright remaining with effects. Dark red face. Hot sweaty skin. Constipation.", dosage: "30C-200C for shock/fright effects", commonSymptoms: ["mind-stupor","mind-fright-effects","abdomen-constipation-painless","sleep-deep-snoring","generalities-painlessness","face-dark-red-hot"], modalities: { worse: ["Heat","Sleep","During/after sleep","Fright","While perspiring"], better: ["Cold","Constant walking","Uncovering"] }},
    { id: "petr", name: "Petroleum", abbr: "Petr.", description: "Deep cracks, especially fingertips and heels. Eczema. Motion sickness. Worse in winter. Skin rough, thick, cracked, bleeding. Diarrhea only in daytime.", dosage: "30C for skin/motion sickness", commonSymptoms: ["skin-cracks-deep","skin-eczema-winter","skin-rough-thick","head-vertigo-motion","stomach-nausea-motion","extremities-cracks-fingers"], modalities: { worse: ["Winter","Before/during thunderstorm","Riding in car/boat","Damp","Eating","Cabbage"], better: ["Warm air","Dry weather","Summer","Eating"] }},
    { id: "phos", name: "Phosphorus", abbr: "Phos.", description: "Tall, slender, artistic. Burning pains. Thirst for cold water vomited once warm. Fearful alone, of dark, of thunder. Hemorrhages bright red. Craves salt, ice cream.", dosage: "200C for constitutional, 30C acute", commonSymptoms: ["mind-fear-darkness","mind-fear-thunderstorm","mind-anxiety-alone","chest-pneumonia","generalities-hemorrhage-bright","stomach-thirst-cold","stomach-vomiting-warm-water","generalities-burning"], modalities: { worse: ["Evening","Before midnight","Lying on left/painful side","Thunder","Warm food/drink","Change of weather","Getting wet"], better: ["Cold","Cold food","Open air","Sleep","Rubbing","Sitting up","Dark"] }},
    { id: "phyt", name: "Phytolacca Decandra", abbr: "Phyt.", description: "Glandular swellings. Sore throat radiating to ears. Breast problems. Rheumatism. Mastitis. Pain at root of tongue extending to ears on swallowing.", dosage: "30C for throat/breast conditions", commonSymptoms: ["throat-sore-radiating-ear","throat-dark-red","female-breast-pain","female-mastitis","generalities-glands-swollen","extremities-rheumatic"], modalities: { worse: ["Damp cold weather","Swallowing hot drinks","Motion","Night","Right side","Hot drinks"], better: ["Warmth","Dry weather","Rest","Cold drinks","Hard pressure"] }},
    { id: "plat", name: "Platinum Metallicum", abbr: "Plat.", description: "Haughty, proud, looking down on others. Numbness and coldness of parts. Physical symptoms alternate with mental. Excessive sexual desire. Everything seems small.", dosage: "200C for constitutional/behavioral", commonSymptoms: ["mind-haughty","mind-contempt","female-excessive-desire","extremities-numbness","mind-delusions-greatness","generalities-alternating-symptoms"], modalities: { worse: ["Emotions","Touch","Coitus","Evening","Standing","Sitting"], better: ["Walking in open air","Sunshine"] }},
    { id: "plb", name: "Plumbum Metallicum", abbr: "Plb.", description: "Colic with abdominal wall retracted to spine. Paralysis - wrist drop. Emaciation with blue line on gums. Constipation - hard black balls. Kidney disease.", dosage: "30C for colic/kidney conditions", commonSymptoms: ["abdomen-colic-retracted","abdomen-constipation-hard-balls","extremities-wrist-drop","urine-kidney-disease","generalities-emaciation","generalities-paralysis"], modalities: { worse: ["Night","Motion","Company","Open air"], better: ["Hard pressure","Rubbing","Physical exertion","Bending double"] }},
    { id: "podo", name: "Podophyllum Peltatum", abbr: "Podo.", description: "Profuse, gushing, offensive diarrhea. Liver remedy. Morning diarrhea followed by weakness. Prolapse of rectum with stool. Bilious vomiting.", dosage: "30C for diarrhea/liver conditions", commonSymptoms: ["stool-diarrhea-morning","stool-diarrhea-profuse-gushing","abdomen-liver-complaints","rectum-prolapse","stomach-vomiting-bilious","generalities-weakness-after-stool"], modalities: { worse: ["Early morning","Hot weather","During dentition","After eating","While bathing"], better: ["Lying on abdomen","External warmth","Rubbing right hypochondrium"] }},
    { id: "puls", name: "Pulsatilla Nigricans", abbr: "Puls.", description: "Mild, gentle, yielding. Changeable symptoms. Thirstless with nearly all complaints. Worse from fat, rich food. Craves open air. Thick bland yellow-green discharges.", dosage: "30C for acute, 200C for constitutional", commonSymptoms: ["mind-weeping","mind-abandonment","stomach-nausea-rich-food","nose-discharge-yellow-green","ear-pain-night","generalities-changeable","generalities-thirstless","female-menstrual-irregular"], modalities: { worse: ["Heat","Rich fat food","After eating","Evening","Warm room","Getting feet wet","Lying down"], better: ["Open air","Motion","Cold applications","Cold food/drink","After crying","Erect posture"] }},
    { id: "ran-b", name: "Ranunculus Bulbosus", abbr: "Ran-b.", description: "Intercostal neuralgia. Herpes zoster (shingles). Stitching pains in chest. Muscular pains. Vesicular eruptions with burning.", dosage: "30C for neuralgia/shingles", commonSymptoms: ["chest-pain-intercostal","skin-herpes-zoster","chest-pain-stitching","skin-vesicles","extremities-muscle-pain","chest-pain-breathing"], modalities: { worse: ["Open air","Motion","Contact","Damp weather","Change of weather","Inspiration"], better: ["Standing still","Sitting erect"] }},
    { id: "rhus-t", name: "Rhus Toxicodendron", abbr: "Rhus-t.", description: "Restlessness - must constantly change position. Stiffness better by motion. Joint pains worse beginning motion, better continued motion. Vesicular eruptions. Red tip of tongue.", dosage: "30C for acute, 200C for chronic", commonSymptoms: ["extremities-joint-pain","extremities-stiffness","skin-vesicles","skin-itching","back-pain-stiffness","generalities-worse-rest","generalities-better-motion","extremities-rheumatic"], modalities: { worse: ["Rest","First motion","Cold wet weather","Night","During sleep","Lying on back/right side","Getting wet"], better: ["Continued motion","Warmth","Warm applications","Change of position","Rubbing","Stretching","Hot bathing"] }},
    { id: "ruta", name: "Ruta Graveolens", abbr: "Ruta.", description: "Injuries to tendons, periosteum, cartilage. Bruised feeling. Eye strain. Sprains and strains. Nodosities on tendons. Restless from the bruised feeling.", dosage: "30C for strain/sprain injuries", commonSymptoms: ["extremities-tendon-injury","extremities-sprain","eyes-strain","back-pain-bruised","extremities-bruised-feeling","extremities-nodosities"], modalities: { worse: ["Lying","Sitting","Cold wet weather","Overexertion","Stooping"], better: ["Warmth","Motion","Rubbing","Lying on back"] }},
    { id: "sabad", name: "Sabadilla", abbr: "Sabad.", description: "Hay fever with violent spasmodic sneezing. Lacrimation. Itching in nose. Imaginary diseases. Sensation of a foreign body. Chilly.", dosage: "30C for hay fever/allergies", commonSymptoms: ["nose-sneezing-violent","nose-hay-fever","eyes-lacrimation","nose-itching","throat-foreign-body-sensation","generalities-chilly"], modalities: { worse: ["Cold","Open air","Periodically","Full moon","Thinking of symptoms"], better: ["Heat","Hot drinks","Wrapping up"] }},
    { id: "sabin", name: "Sabina", abbr: "Sabin.", description: "Hemorrhage from uterus. Blood partly clotted, partly fluid. Music intolerable. Promotes expulsion of placenta. Arthritis with uterine complaints.", dosage: "30C for uterine hemorrhage", commonSymptoms: ["female-hemorrhage-uterine","female-menstrual-heavy","extremities-joint-pain","generalities-hemorrhage-clotted","mind-worse-music"], modalities: { worse: ["Heat","Warm room","Night","Foggy weather","Pregnancy","Motion","Music"], better: ["Cool open air","Cold applications"] }},
    { id: "samb", name: "Sambucus Nigra", abbr: "Samb.", description: "Suffocative attacks in children during sleep. Croup. Nose completely blocked. Perspiration during waking, dry during sleep. Edema.", dosage: "30C for croup/nasal blockage", commonSymptoms: ["respiration-suffocative-sleep","cough-croupy","nose-blocked-completely","generalities-perspiration-waking","skin-edema","sleep-suffocative"], modalities: { worse: ["Sleep","Midnight","Dry cold air","During rest","Head low"], better: ["Sitting up","Motion","Warmth"] }},
    { id: "sang", name: "Sanguinaria Canadensis", abbr: "Sang.", description: "Right-sided migraine. Headache beginning in occiput, settling over right eye. Periodical sick headache. Burning in palms and soles. Hot flushes. Nasal polyps.", dosage: "30C for migraine/hot flushes", commonSymptoms: ["head-pain-right-sided","head-pain-occiput-to-forehead","head-pain-periodic","extremities-burning-palms","nose-polyps","female-menopause-flushes"], modalities: { worse: ["Sun","Motion","Touch","Right side","Sweets","Periodically"], better: ["Sleep","Darkness","Pressure","Acids","Lying on right side","Passing flatus"] }},
    { id: "sec", name: "Secale Cornutum", abbr: "Sec.", description: "Burning internally yet cold externally. Aversion to being covered. Hemorrhages - thin, dark, offensive blood. Gangrene. Numbness of extremities. Emaciation.", dosage: "30C for hemorrhage/circulation problems", commonSymptoms: ["generalities-burning-cold-externally","generalities-hemorrhage-dark-thin","skin-gangrene","extremities-numbness","extremities-cold","generalities-emaciation","female-hemorrhage"], modalities: { worse: ["Heat","Covering","Warm applications","After eating"], better: ["Cold","Uncovering","Stretching","Cold applications","Rubbing"] }},
    { id: "sep", name: "Sepia Officinalis", abbr: "Sep.", description: "Indifference to loved ones. Bearing down sensation. Yellowish saddle across nose. Aversion to family. Worse before menses. Ball sensation in inner parts. Stasis remedy.", dosage: "200C for constitutional", commonSymptoms: ["mind-indifference-family","female-bearing-down","face-yellowish-saddle","mind-aversion-family","abdomen-bearing-down","generalities-stasis","female-menstrual-irregular"], modalities: { worse: ["Cold air","Before menses","Morning/evening","After sweat","Left side","Laundry work","Standing","Milk","Pregnancy"], better: ["Exercise","Warmth of bed","Hot applications","Drawing limbs up","Pressure","Cold bathing","After sleep","Crossing/uncrossing legs"] }},
    { id: "sil", name: "Silicea", abbr: "Sil.", description: "Lack of vital heat. Yielding, timid but obstinate when aroused. Ill effects of vaccination. Every little wound suppurates. Offensive foot sweat. Splinter sensation. Slow healing.", dosage: "200C for chronic, 6X for suppuration", commonSymptoms: ["skin-suppuration","skin-slow-healing","generalities-lack-vital-heat","mind-timid","head-perspiration-offensive","extremities-foot-sweat-offensive","generalities-vaccination-effects"], modalities: { worse: ["Cold","Damp","Drafts","Morning","During menses","Checked sweat","Full moon","New moon","Alcohol","Vaccination"], better: ["Warmth","Wrapping up head","Hot applications","Summer","Profuse urination","Wet humid weather"] }},
    { id: "spig", name: "Spigelia Anthelmia", abbr: "Spig.", description: "Left-sided neuralgia especially around eye. Heart palpitation visible through clothing. Pain worse from touch, motion. Worms in children. Violent left-sided headache.", dosage: "30C for neuralgia/heart conditions", commonSymptoms: ["head-pain-left-sided","head-pain-eye-area","chest-palpitation-visible","chest-heart-pain-left","eyes-pain-left","generalities-worms"], modalities: { worse: ["Touch","Motion","Noise","Turning eyes","Night","Jarring","Raising arms","Stooping","Tobacco smoke"], better: ["Lying on right side","With head high","Sunset","Steady pressure","Inspiration"] }},
    { id: "spong", name: "Spongia Tosta", abbr: "Spong.", description: "Croup - dry, barking, sawing cough. Larynx dry. Thyroid enlarged. Sensation of a plug in larynx. Heart hypertrophy. Anxiety with difficult breathing.", dosage: "30C for croup/cough", commonSymptoms: ["cough-croupy-barking","throat-larynx-dry","throat-thyroid-enlarged","cough-dry-sawing","respiration-difficult","chest-anxiety-with-breathing"], modalities: { worse: ["Ascending","Wind","Before midnight","Roused from sleep","Talking","Swallowing","Cold drinks","Sweets","Smoking","Lying with head low","Dry cold wind","Full moon"], better: ["Descending","Eating a little","Warm food","Warm drinks","Lying with head low"] }},
    { id: "stann", name: "Stannum Metallicum", abbr: "Stann.", description: "Great weakness of chest. Mucous discharges from lungs. Pains gradually increase and gradually decrease. Colic better by hard pressure. Sad, despondent.", dosage: "30C for chest weakness/cough", commonSymptoms: ["chest-weakness","cough-deep-mucous","generalities-pain-gradual","abdomen-colic-hard-pressure","mind-sadness","chest-oppression"], modalities: { worse: ["Using voice","Laughing","Talking","Singing","Lying on right side","Descending","10 AM"], better: ["Hard pressure","Rapid walking","Coughing","Expectoration"] }},
    { id: "staph", name: "Staphysagria", abbr: "Staph.", description: "Effects of suppressed anger and indignation. Ailments after humiliation. Surgical wounds. Styes. Hypersensitivity. Teeth decay at roots. Honey-moon cystitis.", dosage: "200C for emotional/surgical", commonSymptoms: ["mind-anger-suppressed","mind-indignation","skin-styes","urine-cystitis-honeymoon","mouth-teeth-decay","skin-surgical-wounds","extremities-joint-pain"], modalities: { worse: ["Anger","Indignation","Grief","Mortification","Touch","Tobacco","Sexual excesses","Mercury","Nap in afternoon"], better: ["After breakfast","Warmth","Rest","Night"] }},
    { id: "stram", name: "Stramonium", abbr: "Stram.", description: "Terror, violence, darkness. Fears darkness and being alone. Desires light and company. Violent delirium. Stammering. No thirst with heat. Painless symptoms with great violence.", dosage: "200C for acute mental states", commonSymptoms: ["mind-fear-darkness","mind-fear-alone","mind-violence","mind-delirium-violent","speech-stammering","generalities-painlessness-violence"], modalities: { worse: ["Dark","Alone","Looking at shiny objects","After sleep","Swallowing","Glistening objects","Trying to swallow liquids"], better: ["Light","Company","Warmth","Open air"] }},
    { id: "sulph", name: "Sulphur", abbr: "Sulph.", description: "The great anti-psoric. Burning everywhere. Dirty, ragged philosopher. Aversion to washing. Red orifices. Sinking feeling at 11 AM. Relapses, incomplete cure remedy.", dosage: "200C once/month for chronic, 30C acute", commonSymptoms: ["skin-burning","skin-itching-warm-bed","generalities-worse-11am","generalities-burning","skin-eruptions-recurrent","rectum-itching","mind-philosophical","generalities-worse-washing"], modalities: { worse: ["11 AM","Washing/bathing","Heat of bed","Standing","Warmth","Night","Rest","Milk","Alcohol","Periodically","Full moon"], better: ["Open air","Motion","Warm dry weather","Drawing up affected limbs","Lying on right side","Dry warm applications"] }},
    { id: "symph", name: "Symphytum Officinale", abbr: "Symph.", description: "Knit-bone. The bone setter's remedy. Fractures. Injuries to bones, periosteum, and cartilage. Pricking pain at site of fracture. Non-union of fractures.", dosage: "6C-30C for fracture healing", commonSymptoms: ["extremities-fracture","extremities-bone-injury","extremities-periosteum-injury","eyes-injury-blunt","generalities-non-union-fracture"], modalities: { worse: ["Touch","Motion","Injuries","Sexual excess"], better: ["Warmth","Rest"] }},
    { id: "tab", name: "Tabacum", abbr: "Tab.", description: "Death-like pallor. Icy cold. Profuse cold sweat. Sea-sickness. Terrible faint sinking feeling in pit of stomach. Nausea - worst nausea of all remedies.", dosage: "30C for motion sickness/nausea", commonSymptoms: ["stomach-nausea-extreme","stomach-motion-sickness","generalities-cold-sweat","face-pallor-deathly","abdomen-sinking-feeling","head-vertigo"], modalities: { worse: ["Opening eyes","Least motion","Riding","Smoking","Smelling tobacco smoke","Evening"], better: ["Cold air","Open air","Uncovering abdomen","Cold applications","Weeping","Vomiting"] }},
    { id: "thuj", name: "Thuja Occidentalis", abbr: "Thuj.", description: "Ill effects of vaccination. Warts, condylomata. Oily skin. Fixed ideas. Left-sided. Rapid exhaustion. Nail complaints. Tea-colored urine.", dosage: "200C for constitutional/vaccination effects", commonSymptoms: ["skin-warts","skin-condylomata","generalities-vaccination-effects","skin-oily","mind-fixed-ideas","generalities-left-sided","urine-tea-colored"], modalities: { worse: ["Cold damp weather","After vaccination","Night","3 AM","3 PM","Moonlight","Tea","Coffee","Sweets","Onions","Fatty food"], better: ["Sneezing","Drawing up limbs","Sweating","Left side","Touch","Rubbing","Stretching","Free secretions","Warmth"] }},
    { id: "verat", name: "Veratrum Album", abbr: "Verat.", description: "Copious, violent evacuations both ways simultaneously. Icy coldness of body especially forehead and vertex. Cold sweat. Collapse with extreme prostration. Craves cold things.", dosage: "30C for cholera-like conditions", commonSymptoms: ["stomach-vomiting-violent","stool-diarrhea-violent","generalities-cold-sweat","generalities-collapse","head-cold-sweat-forehead","generalities-prostration-extreme"], modalities: { worse: ["Night","Wet cold weather","During pain","After fright","Exertion","Drinking","Before/during menses","After stool"], better: ["Walking","Warmth","Covering","Hot drinks","Lying down","Sitting"] }},
    { id: "zinc", name: "Zincum Metallicum", abbr: "Zinc.", description: "Defective vitality. Brain fag. Restless feet and legs. Suppressed eruptions causing brain symptoms. Cannot throw out eruptions. Fidgety feet.", dosage: "30C-200C for neurological/restless conditions", commonSymptoms: ["extremities-restless-legs","extremities-fidgety-feet","mind-brain-fag","generalities-suppressed-eruptions","generalities-weakness-nervous","sleep-restless-legs"], modalities: { worse: ["Wine","Suppressed discharges","After eating","3-4 PM","Touch","Noise"], better: ["Motion","Pressure","Warmth","Rubbing","Hard pressure","Appearance of eruptions"] }},
    { id: "apis", name: "Apis Mellifica", abbr: "Apis.", description: "Stinging, burning pains. Edema and swelling. Thirstless. Worse from heat. Right-sided. Jealousy. Bee-sting like symptoms. Rapid swelling. Scanty urination.", dosage: "30C for acute swelling/stings", commonSymptoms: ["skin-swelling-edema","skin-stinging-burning","urine-scanty","generalities-thirstless","generalities-worse-heat","throat-swelling","eyes-edema-lower-lid","extremities-joint-swelling"], modalities: { worse: ["Heat in any form","Touch","Pressure","Right side","Late afternoon","Closed room","Getting wet"], better: ["Cold","Cold applications","Open air","Uncovering","Cold bathing"] }},
    { id: "ant-t", name: "Antimonium Tartaricum", abbr: "Ant-t.", description: "Great rattling of mucus in chest but unable to expectorate. Drowsiness. Nausea. Thick white coating on tongue. Face pale, cold sweat. Wants to be left alone.", dosage: "30C for chest/respiratory conditions", commonSymptoms: ["chest-rattling-mucus","cough-rattling-unable-expectorate","stomach-nausea","generalities-drowsiness","face-pale-cold","respiration-difficult"], modalities: { worse: ["Lying down","Warm room","Damp cold weather","Evening","4 AM","Sour things","Milk","Anger"], better: ["Sitting erect","Eructation","Expectoration","Lying on right side","Cold open air","Vomiting"] }},
    { id: "arg-n", name: "Argentum Nitricum", abbr: "Arg-n.", description: "Anticipatory anxiety. Impulsive. Craves sugar which aggravates. Splinter-like pains. Flatulence with loud belching. Fear of heights. Hurried feeling. Diarrhea from anticipation.", dosage: "30C for anxiety/digestive issues", commonSymptoms: ["mind-anxiety-anticipation","mind-fear-heights","stomach-flatulence-loud","abdomen-diarrhea-anticipation","eyes-conjunctivitis","throat-splinter-pain","stomach-craves-sugar"], modalities: { worse: ["Warmth","Anxiety","Sugar","Ice cream","After eating","Left side","Night","Mental exertion","Crowded rooms"], better: ["Cool open air","Cold","Pressure","Hard pressure","Belching","Wind blowing on face"] }},
    { id: "arn", name: "Arnica Montana", abbr: "Arn.", description: "The great injury and trauma remedy. Sore, bruised feeling. Bed feels too hard. Says nothing is wrong yet is seriously ill. Ecchymosis. Fear of being touched. Shock.", dosage: "30C for acute trauma, 200C for severe", commonSymptoms: ["generalities-bruised-feeling","generalities-trauma","skin-ecchymosis","mind-says-well-when-ill","generalities-shock","head-injury","extremities-soreness"], modalities: { worse: ["Touch","Motion","Damp cold","Injuries","After sleep","Wine","Lying down"], better: ["Lying down (stretched out)","Lying with head low","Rest","Open air"] }},
    { id: "bapt", name: "Baptisia Tinctoria", abbr: "Bapt.", description: "Profound prostration with rapid onset. Dark red face. Offensive discharges. Confusion - feels scattered, parts of body feel separated. Typhoid states. Putrid conditions.", dosage: "30C for acute septic/typhoid conditions", commonSymptoms: ["mind-confusion","generalities-prostration-rapid","face-dark-besotted","generalities-offensive-discharges","fever-typhoid","throat-dark-putrid","stool-offensive"], modalities: { worse: ["Humid heat","Fog","Indoors","Autumn","Walking","Pressure","On waking"], better: ["Open air","Motion","Walking","After stool"] }},
    { id: "berb", name: "Berberis Vulgaris", abbr: "Berb.", description: "The kidney and liver remedy. Radiating pains from one point. Kidney stones, gallstones. Pain in lumbar region worse standing, motion. Bubbling sensation.", dosage: "Mother tincture to 30C for kidney/gallstones", commonSymptoms: ["urine-kidney-stones","abdomen-gallstones","back-pain-lumbar-radiating","urine-burning","abdomen-liver-pain","generalities-pain-radiating"], modalities: { worse: ["Motion","Standing","Jarring","Fatigue","Urinating"], better: ["Rest","Lying down"] }},
    { id: "bor", name: "Borax", abbr: "Bor.", description: "Fear of downward motion. Aphthae (mouth ulcers). Sensitivity to sudden sounds. Child cries when nursing. Sterility. Diarrhea in children.", dosage: "30C for mouth ulcers/fear conditions", commonSymptoms: ["mind-fear-downward-motion","mouth-aphthae","mouth-ulcers","generalities-sensitive-noise","stool-diarrhea-child","female-sterility"], modalities: { worse: ["Downward motion","Sudden noise","Smoking","Warm weather","After menses","10 AM"], better: ["Pressure","Evening","11 PM","Cold weather"] }},
    { id: "canth", name: "Cantharis", abbr: "Canth.", description: "Burns and scalds - the first remedy. Violent inflammation. Burning, cutting pains in urinary tract. Constant urge to urinate. Bloody urine. Extreme burning.", dosage: "30C for burns/urinary conditions", commonSymptoms: ["urine-burning-extreme","urine-constant-urge","urine-bloody","skin-burns","skin-blisters","generalities-burning-violent","abdomen-peritonitis"], modalities: { worse: ["Urinating","Drinking cold water","Coffee","Bright objects","Sound of water","Touch"], better: ["Rubbing","Cold applications","Warmth","Rest","Night"] }},
    { id: "carb-ac", name: "Carbolicum Acidum", abbr: "Carb-ac.", description: "Terrible pains. Dull, languid. Physical exhaustion. Desire to be alone. Burns. Gangrenous conditions. Allergic conditions.", dosage: "30C for burns/allergic conditions", commonSymptoms: ["generalities-exhaustion","skin-burns-chemical","generalities-gangrenous","mind-desire-alone","skin-allergic-reactions"], modalities: { worse: ["3-4 AM","Evening","Night"], better: ["Rubbing","Smoking","Tea"] }},
    { id: "cina", name: "Cina Maritima", abbr: "Cina.", description: "The worm remedy. Child very irritable, wants to be rocked. Grinding teeth in sleep. Picking nose. Cannot be touched. Ravenous hunger.", dosage: "30C for worms/irritability in children", commonSymptoms: ["generalities-worms","mind-irritability-child","mind-cannot-be-touched","sleep-grinding-teeth","nose-picking","stomach-hunger-extreme-child"], modalities: { worse: ["Night","Looking fixedly at an object","Full moon","Worms","Sun","Summer"], better: ["Being rocked","Lying on abdomen","Motion"] }},
    { id: "clem", name: "Clematis Erecta", abbr: "Clem.", description: "Urinary and skin conditions. Stricture of urethra. Orchitis. Eczema with vesicles. Slow flow of urine.", dosage: "30C for urinary/skin conditions", commonSymptoms: ["urine-slow-flow","male-orchitis","skin-eczema-vesicles","urine-stricture","skin-eruptions-vesicular"], modalities: { worse: ["Night","Warm bed","Washing","New moon","Cold air"], better: ["Open air","Sweating"] }},
    { id: "croc", name: "Crocus Sativus", abbr: "Croc.", description: "Hemorrhages - dark, stringy, clotted blood. Sensation of something alive moving in abdomen. Mood changes rapidly. Singing, dancing alternating with anger.", dosage: "30C for hemorrhage/mood conditions", commonSymptoms: ["generalities-hemorrhage-dark-stringy","abdomen-sensation-alive","mind-alternating-moods","mind-laughing-crying","female-hemorrhage-dark"], modalities: { worse: ["Morning","Fasting","Before breakfast","Looking fixedly","Warm room","Full moon","Pregnancy"], better: ["Open air","After breakfast","Yawning"] }},
    { id: "dros", name: "Drosera Rotundifolia", abbr: "Dros.", description: "Violent spasmodic cough ending in gagging/vomiting. Whooping cough. Deep barking cough. Worse after midnight. Holds chest while coughing.", dosage: "30C for whooping cough/spasmodic cough", commonSymptoms: ["cough-spasmodic-vomiting","cough-whooping","cough-barking-deep","cough-worse-midnight","chest-holds-while-coughing","cough-worse-lying"], modalities: { worse: ["After midnight","Lying down","Warmth","Drinking","Singing","Laughing","Measles"], better: ["Open air","Motion","Walking","Pressure","Sitting up","Conversation"] }},
    { id: "eup-per", name: "Eupatorium Perfoliatum", abbr: "Eup-per.", description: "Bone-break fever. Deep aching in bones as if broken. Influenza with great soreness and aching. Thirst for cold water. Vomiting of bile at close of chill.", dosage: "30C for flu/bone pain", commonSymptoms: ["fever-influenza","extremities-bone-pain-deep","generalities-soreness","fever-bone-break-feeling","stomach-vomiting-bile","head-pain-throbbing"], modalities: { worse: ["Periodically","7-9 AM","Motion","Cold air","Coughing","Lying on affected part","Smelling food"], better: ["Vomiting of bile","Conversation","Getting on hands and knees","Perspiration","Lying on face"] }},
    { id: "euphr", name: "Euphrasia Officinalis", abbr: "Euphr.", description: "The eye remedy. Profuse acrid lacrimation with bland nasal discharge (opposite of Allium cepa). Photophobia. Hay fever with eye symptoms.", dosage: "30C for eye conditions/hay fever", commonSymptoms: ["eyes-lacrimation-acrid","nose-discharge-bland","eyes-photophobia","eyes-inflammation","nose-hay-fever","eyes-burning-tears"], modalities: { worse: ["Open air","Wind","Light","Evening","Warmth","South wind","Sunlight","Indoors","Lying down"], better: ["Dark","Open air","Coffee","Wiping eyes","Winking","Cold applications"] }},
    { id: "ferr-p", name: "Ferrum Phosphoricum", abbr: "Ferr-p.", description: "First stage of inflammation before exudation. No characteristic symptoms. Gradual onset fever. Epistaxis. Anemia. Useful when symptoms are vague but inflammation present.", dosage: "6X-12X for early inflammation", commonSymptoms: ["fever-gradual-onset","nose-epistaxis","generalities-anemia","generalities-inflammation-early","chest-cold-early","head-pain-congestive"], modalities: { worse: ["Night","4-6 AM","Touch","Jarring","Motion","Right side","Cold air","Checked sweat"], better: ["Cold applications","Bleeding","Lying down","Solitude"] }},
    { id: "glon", name: "Glonoinum", abbr: "Glon.", description: "Bursting, pulsating headache. Sun headache. Surges of blood upward. Cannot bear heat on head. Headache instead of menses. Heart feels as if too big.", dosage: "30C for headache from sun/heat", commonSymptoms: ["head-pain-bursting","head-pain-pulsating","head-pain-sun","chest-heart-too-big","head-congestion-upward","generalities-worse-sun"], modalities: { worse: ["Sun","Heat on head","Jar","Wine","Stooping","Ascending","Having hair cut","Suppressions","Perineum"], better: ["Open air","Cold applications","Brandy","Pressure","Lying down","Uncovering head"] }},
    { id: "hell", name: "Helleborus Niger", abbr: "Hell.", description: "Sensorial depression - sees, hears, tastes imperfectly. Picks lips and clothes. Slow answers. Brain conditions after acute diseases. Meningitis. Complete apathy.", dosage: "30C for brain conditions/apathy", commonSymptoms: ["mind-apathy","mind-slow-answers","generalities-sensorial-depression","head-meningitis","generalities-brain-after-acute","mind-picks-lips"], modalities: { worse: ["4-8 PM","Uncovering","Cold air","Exertion","Consolation","Puberty"], better: ["Warmth","Quiet","Wrapping up","Attention being diverted"] }},
    { id: "kali-s", name: "Kali Sulphuricum", abbr: "Kali-s.", description: "Yellow, slimy discharges from any mucous surface. Late stages of inflammation. Worse in warm room, better open air. Dandruff. Psoriasis.", dosage: "6X for catarrhal conditions", commonSymptoms: ["nose-discharge-yellow","skin-dandruff","skin-psoriasis","generalities-discharges-yellow","throat-sore-yellow","ear-discharge-yellow"], modalities: { worse: ["Warmth","Warm room","Evening","Noise","Consolation"], better: ["Cool open air","Fasting","Walking"] }},
    { id: "kreos", name: "Kreosotum", abbr: "Kreos.", description: "Excoriating, acrid, offensive discharges. Rapid decay of teeth. Hemorrhages - dark, oozing. Pulsation throughout body. Vomiting of pregnancy.", dosage: "30C for dental/discharge conditions", commonSymptoms: ["mouth-teeth-rapid-decay","generalities-discharges-offensive-acrid","female-leucorrhea-acrid","stomach-vomiting-pregnancy","generalities-hemorrhage-dark-oozing","skin-itching-burning"], modalities: { worse: ["Open air","Cold","Rest","Lying","During menses","6 PM","After menses","Pregnancy","Dentition","Bathing in cold water"], better: ["Warmth","Hot food","Motion","Pressure"] }},
    { id: "lac-c", name: "Lac Caninum", abbr: "Lac-c.", description: "Symptoms alternate sides. Sore throat alternating sides. Forgetful, absent-minded. Fear of snakes. Diphtheria with alternating sides. Shiny glazed throat.", dosage: "200C for alternating-side conditions", commonSymptoms: ["throat-sore-alternating-sides","generalities-alternating-sides","mind-forgetful","mind-fear-snakes","throat-diphtheria","skin-erysipelas-alternating"], modalities: { worse: ["Touch","Jar","Morning of one day","Evening of next"], better: ["Cold drinks","Cold room","Open air"] }},
    { id: "lil-t", name: "Lilium Tigrinum", abbr: "Lil-t.", description: "Wild, hurried feeling. Pelvic bearing down. Desire to do several things at once but accomplishes nothing. Heart symptoms with uterine. Conflicts between spiritual and sexual.", dosage: "30C-200C for uterine/heart conditions", commonSymptoms: ["mind-hurried","mind-conflicted","female-bearing-down","chest-heart-pain","generalities-pelvic-pressure","mind-desire-several-things"], modalities: { worse: ["Consolation","Warm room","Standing","Walking","Miscarriage"], better: ["Fresh air","Lying on left side","Support to perineum","Keeping busy","Pressure"] }},
    { id: "mez", name: "Mezereum", abbr: "Mez.", description: "Eczema with thick crusts, under which pus collects. Burning, violent itching. Bones especially long bones affected. Post-herpetic neuralgia. Thick scabs.", dosage: "30C for skin/bone conditions", commonSymptoms: ["skin-eczema-crusts-pus","skin-itching-violent","extremities-bone-pain","skin-post-herpetic-neuralgia","skin-scabs-thick","head-eruptions-thick-crusts"], modalities: { worse: ["Cold air","Night","Touch","Motion","Damp weather","Suppressed eruptions","Mercury","Vaccination"], better: ["Wrapping up","Open air"] }},
    { id: "mur-ac", name: "Muriaticum Acidum", abbr: "Mur-ac.", description: "Great muscular weakness. Slides down in bed. Moaning. Mouth ulcers. Hemorrhoids extremely sensitive. Tongue shrunk, leathery. Involuntary stool while urinating.", dosage: "30C for weakness/hemorrhoids", commonSymptoms: ["generalities-weakness-muscular","mouth-ulcers-deep","rectum-hemorrhoids-sensitive","generalities-slides-down-bed","stool-involuntary-urinating","mind-moaning"], modalities: { worse: ["Walking","Touch","Wet weather","Before midnight","Bathing"], better: ["Lying on left side","Warmth","Motion"] }},
    { id: "nat-c", name: "Natrum Carbonicum", abbr: "Nat-c.", description: "Cannot tolerate sun. Milk aggravates. Weak ankles. Chronic effects of sunstroke. Unable to think. Depressed. Sensitive to music. Digestive weakness.", dosage: "30C for sun sensitivity/digestive weakness", commonSymptoms: ["generalities-worse-sun","generalities-worse-milk","extremities-weak-ankles","mind-depression","head-pain-sun","stomach-intolerance-milk"], modalities: { worse: ["Sun","Mental exertion","Music","Heat","Summer","Milk","Thunderstorm","Change of weather","5 AM","Drafts"], better: ["Motion","Boring into ears/nose","Rubbing","Sweating","Pressure"] }},
    { id: "nux-m", name: "Nux Moschata", abbr: "Nux-m.", description: "Drowsiness, sleepiness with all conditions. Dryness of mouth without thirst. Enormous bloating. Fainting. Changeable mood. Absence of mind.", dosage: "30C for drowsiness/bloating conditions", commonSymptoms: ["mind-drowsiness","mind-absent-minded","mouth-dry-without-thirst","abdomen-bloating-enormous","generalities-fainting","generalities-sleepiness"], modalities: { worse: ["Cold wet windy weather","Cold food","Cold washing","Pregnancy","Menses","Lying on painful side"], better: ["Dry warm weather","Wrapping up","Warm room","Hot drinks"] }},
    { id: "ph-ac", name: "Phosphoricum Acidum", abbr: "Ph-ac.", description: "Grief and disappointed love. Apathy. Complete indifference. Physical effects of emotions. Painless debilitating diarrhea. Growing pains. Hair grays early.", dosage: "30C for grief/debility, China tincture in acute", commonSymptoms: ["mind-grief","mind-apathy","mind-indifference","stool-diarrhea-painless","generalities-weakness-grief","generalities-growing-pains","head-hair-gray-early"], modalities: { worse: ["Loss of vital fluids","Sexual excesses","Bad news","Grief","Drafts","Music","From being talked to"], better: ["Warmth","Short sleep","Stool"] }},
    { id: "plan", name: "Plantago Major", abbr: "Plan.", description: "Toothache with earache. Pain radiating from teeth to ears. Profuse salivation with toothache. Earache from teeth. Enuresis.", dosage: "Mother tincture for toothache externally, 30C internally", commonSymptoms: ["mouth-toothache-to-ear","ear-pain-from-teeth","mouth-saliva-with-toothache","urine-enuresis","ear-pain-referred"], modalities: { worse: ["Cold air","Contact","Motion","Night","From left to right"], better: ["Pressure","Sleep","Eating"] }},
    { id: "plat-m", name: "Platina Muriatica", abbr: "Plat-m.", description: "Numbness of various parts. Pains increase and decrease gradually. Female complaints. Ovarian pain. Dark clotted menses.", dosage: "30C for female/neurological conditions", commonSymptoms: ["extremities-numbness-various","generalities-pain-gradual","female-ovarian-pain","female-menses-dark-clotted","mind-haughty"], modalities: { worse: ["Rest","Sitting","Standing","Evening","Touch"], better: ["Motion","Walking in open air"] }},
    { id: "pod", name: "Podophyllinum", abbr: "Pod.", description: "Morning diarrhea. Rumbling then gushing stool. Prolapse of rectum. Liver torpor. Bilious attacks.", dosage: "30C for morning diarrhea/liver", commonSymptoms: ["stool-diarrhea-morning","stool-diarrhea-gushing","rectum-prolapse","abdomen-liver-torpor","stomach-vomiting-bilious"], modalities: { worse: ["Early morning","Hot weather","Dentition","After eating/drinking","During menses"], better: ["Rubbing liver region","Lying on abdomen","External warmth"] }},
    { id: "rob", name: "Robinia Pseudoacacia", abbr: "Rob.", description: "Intensely acrid, sour eructations. Heartburn. Sour vomiting. Migraine with gastric disturbance. Acidity.", dosage: "30C for acidity/heartburn", commonSymptoms: ["stomach-acidity-extreme","stomach-heartburn","stomach-eructation-sour","head-pain-with-acidity","stomach-vomiting-sour"], modalities: { worse: ["Night","Lying down","Fat food","Cabbage","Turnips","Ice cream"], better: ["Eating","Walking","Sitting"] }},
    { id: "sars", name: "Sarsaparilla", abbr: "Sars.", description: "Kidney remedy. Pain at end of urination. Renal colic - right side. Severe pain at conclusion of urination. Sand in urine. Skin dry, shriveled.", dosage: "30C for urinary/kidney conditions", commonSymptoms: ["urine-pain-at-end","urine-kidney-colic-right","urine-sand","skin-dry-shriveled","urine-burning-end","extremities-skin-cracked"], modalities: { worse: ["Spring","Before/at end of urination","Damp weather","Night","After menses","Yawning","Stretching"], better: ["Standing","Uncovering neck/chest"] }},
    { id: "sel", name: "Selenium", abbr: "Sel.", description: "Great debility especially sexual. Loss of sexual power with desire. Hair falls out. Constipation. Sleepy but wakeful.", dosage: "30C for sexual debility/hair loss", commonSymptoms: ["male-sexual-debility","male-desire-with-weakness","head-hair-falls","abdomen-constipation","sleep-insomnia-sleepy","generalities-weakness-sexual"], modalities: { worse: ["Draft of air","Sun","Hot weather","After sleep","Wine","Tea","Singing","Walking"], better: ["After sunset","Cool air","Inhaling cool air"] }},
    { id: "seneg", name: "Senega", abbr: "Seneg.", description: "Bronchial catarrh of old people. Tough mucus difficult to raise. Chest oppression. Eye symptoms with chest. Rattling cough.", dosage: "30C for elderly bronchial conditions", commonSymptoms: ["cough-elderly-rattling","chest-mucus-tough","chest-oppression","eyes-with-chest-symptoms","cough-difficult-expectoration","respiration-difficult-elderly"], modalities: { worse: ["Cold open air","Walking","Rest","During rest","Inhaling","Lying on right side"], better: ["Bending head backward","Sweat","Walking in open air"] }},
    { id: "squil", name: "Squilla Maritima", abbr: "Squil.", description: "Violent cough with sneezing and involuntary urination. Copious mucous rales. Stitching pains. Urination involuntary with cough. Edema.", dosage: "30C for cough with urinary incontinence", commonSymptoms: ["cough-with-sneezing","urine-incontinence-cough","cough-violent-mucous","chest-stitching","skin-edema","cough-with-urination"], modalities: { worse: ["Morning","Undressing","Cold drinks","Lying down","Exertion","Cold air"], better: ["Rest","Expectoration","Sitting up"] }},
    { id: "stict", name: "Sticta Pulmonaria", abbr: "Stict.", description: "Dryness of nasal mucous membrane. Pressure at root of nose. Incessant sneezing. Cough worse at night. Rheumatic pains before the onset of nasal symptoms.", dosage: "30C for sinus/nasal dryness", commonSymptoms: ["nose-dryness","nose-pressure-root","nose-sneezing-incessant","cough-worse-night","extremities-rheumatic-before-cold","head-pain-sinus"], modalities: { worse: ["Sudden change of temperature","Night","Inhaling cold air","After operations"], better: ["Free discharge"] }},
    { id: "stront-c", name: "Strontium Carbonicum", abbr: "Stront-c.", description: "Sequelae of hemorrhages. Chronic sprains. Diarrhea worse at night. Fleeting pains. Bones pain. Shock after surgical operations.", dosage: "30C for hemorrhage sequelae/bone pain", commonSymptoms: ["generalities-hemorrhage-sequelae","extremities-chronic-sprains","stool-diarrhea-night","extremities-bone-pain","generalities-shock-surgical"], modalities: { worse: ["Cold","Damp","Night","Change of weather","Uncovering","Walking"], better: ["Heat","Sun","Wrapping up","Hot bath"] }},
    { id: "tell", name: "Tellurium", abbr: "Tell.", description: "Offensive discharges from ears. Herpetic eruptions. Ringworm. Sciatica. Eczema behind ears. Sacral pain.", dosage: "30C for ear/skin conditions", commonSymptoms: ["ear-discharge-offensive","skin-herpes","skin-ringworm","extremities-sciatica","skin-eczema-behind-ears","back-pain-sacral"], modalities: { worse: ["Touch","Cold","Night","Lying on affected side","Coughing","Laughing"], better: ["Open air","Rest"] }},
    { id: "ter", name: "Terebinthina", abbr: "Ter.", description: "Kidney inflammation. Blood and albumin in urine. Dark, smoky urine. Burning and drawing in kidney region. Hemorrhages - dark passive. Tympanitic abdomen.", dosage: "30C for kidney/urinary conditions", commonSymptoms: ["urine-bloody","urine-dark-smoky","urine-kidney-inflammation","abdomen-tympanitic","generalities-hemorrhage-dark-passive","back-pain-kidney-region"], modalities: { worse: ["Night","Damp weather","Cold","Sitting","Lying on affected side","Pressure"], better: ["Walking in open air","Warmth","Motion"] }},
    { id: "val", name: "Valeriana", abbr: "Val.", description: "Oversensitiveness. Hysteria. Changeable symptoms. Feeling as if thread hanging in throat. Sleeplessness with nightly itching.", dosage: "30C for hysteria/insomnia", commonSymptoms: ["mind-hysteria","mind-oversensitive","generalities-changeable","throat-thread-sensation","sleep-insomnia-itching","mind-excitable"], modalities: { worse: ["Evening","Rest","Standing","Darkness","Before midnight"], better: ["Walking","Change of position","Rubbing","Pressing on part"] }},
    { id: "vib", name: "Viburnum Opulus", abbr: "Vib.", description: "Menstrual cramps. Threatened miscarriage. Bearing-down pains. Cramps extending to thighs. False labor pains. Ovarian pain radiating to thighs.", dosage: "Mother tincture to 30C for menstrual cramps", commonSymptoms: ["female-menstrual-cramps","female-threatened-miscarriage","female-bearing-down","female-ovarian-pain-thighs","abdomen-cramps-to-thighs","female-false-labor"], modalities: { worse: ["Lying on affected side","Evening","Night","Close room","Warm room"], better: ["Open air","Rest","Pressure"] }},
    { id: "medo", name: "Medorrhinum", abbr: "Med.", description: "Intense restlessness, hurried. Ameliorated by seaside/damp weather. Craves oranges, ice, salt, sweets. Forgetful. Everything seems unreal. Sycotic miasm remedy.", dosage: "200C-1M for constitutional/miasmatic", commonSymptoms: ["mind-hurried","mind-forgetful","generalities-better-seaside","generalities-craves-oranges","generalities-craves-ice","generalities-sycotic-miasm"], modalities: { worse: ["Daylight","Heat","3-4 AM","Inland","Thinking of ailment","Stretching","After urinating","Thunderstorm","Sugar","Covering"], better: ["At seaside","Lying on abdomen","Damp weather","Night","Hard rubbing","Fresh air","Uncovering","Stretching","Being fanned"] }},
    { id: "tub", name: "Tuberculinum Bovinum", abbr: "Tub.", description: "Desire to travel. Always tired. Changing symptoms. Takes cold easily. Emaciation despite eating well. Ringworm. Fear of dogs. Allergies.", dosage: "200C-1M infrequently for constitutional", commonSymptoms: ["mind-desire-travel","generalities-takes-cold-easily","generalities-emaciation-eating-well","skin-ringworm","mind-fear-dogs","generalities-allergies","generalities-changing-symptoms"], modalities: { worse: ["Closed rooms","Damp cold","Exertion","Morning","Standing","Weather changes","Before storms","Full moon"], better: ["Open air","Wind","Cold wind","Mountains","Dry weather","Continued motion"] }},
    { id: "lyss", name: "Lyssinum", abbr: "Lyss.", description: "Hydrophobia. Spasms from sight or sound of water. Excessive saliva. Sensitivity to light, noise, odors. Aggravated by bright light.", dosage: "200C for water phobia/extreme sensitivity", commonSymptoms: ["mind-fear-water","mind-spasms-water","mouth-saliva-excess","generalities-sensitive-light","generalities-sensitive-noise","generalities-sensitive-odors"], modalities: { worse: ["Sight/sound of running water","Bright light","Heat of sun","Draft of air","Riding in car","Stooping"], better: ["Gentle rubbing","Bending backward","Warm bath"] }},
    { id: "bufo", name: "Bufo Rana", abbr: "Bufo.", description: "Epilepsy with sexual excitement. Feeble-mindedness. Angry if not understood. Masturbation. Convulsions during sleep. Impetuous.", dosage: "200C for epilepsy/behavioral conditions", commonSymptoms: ["mind-feeble-minded","mind-angry-misunderstood","generalities-epilepsy","generalities-convulsions-sleep","male-masturbation-excessive","mind-impetuous"], modalities: { worse: ["Warm room","On waking","During sleep","Before menses","Sexual excitement"], better: ["Cold air","Bathing","Putting feet in hot water","Bleeding"] }},
    { id: "calc-f", name: "Calcarea Fluorica", abbr: "Calc-f.", description: "Hard, stony glands. Bony growths. Varicose veins. Dental conditions - enamel of teeth. Exostoses. Ganglia. Elastic fibre remedy.", dosage: "6X-12X biochemic for bone/dental conditions", commonSymptoms: ["generalities-glands-hard-stony","extremities-bony-growths","extremities-varicose-veins","mouth-teeth-enamel","extremities-exostoses","extremities-ganglia"], modalities: { worse: ["Rest","Damp weather","Change of weather","Drafts","Cold","Getting wet","Sprains"], better: ["Heat","Warm applications","Rubbing","Hot fomentations","Motion"] }},
    { id: "calc-p", name: "Calcarea Phosphorica", abbr: "Calc-p.", description: "Nutrition remedy. Non-union of fractures. Anemia. Growing pains. Delayed dentition. School headaches. Desires smoked meat and salt.", dosage: "6X for growing children, 200C for constitutional", commonSymptoms: ["generalities-non-union-fracture","generalities-anemia","generalities-growing-pains","mouth-delayed-dentition","head-pain-students","generalities-nutrition-poor"], modalities: { worse: ["Cold damp weather","Dentition","Puberty","Mental exertion","Change of weather","Fruits","Melting snow","Getting wet","Lifting","East wind"], better: ["Summer","Warm dry weather","Lying down","Rest"] }},
    { id: "lyco", name: "Lycosa Tarentula", abbr: "Tarent.", description: "Extreme restlessness. Must keep in constant motion. Music ameliorates. Dancing relieves. Choreic movements. Destructive impulses. Loves bright colors.", dosage: "200C for restlessness/choreic conditions", commonSymptoms: ["mind-restlessness-extreme","mind-better-music","mind-destructive","generalities-better-dancing","extremities-choreic","mind-loves-bright-colors"], modalities: { worse: ["Motion","Touch","Noise","Seeing others in trouble","Cold","Damp","Night","Yearly"], better: ["Open air","Music","Rubbing","Bright colors","Dancing","Sweating","Riding horseback"] }},
  ];
}

function buildRubrics() {
  return [
    // =================== MIND ====================
    { symptomId: "mind-fear-death", remedies: [
      { id: "acon", grade: 3 },{ id: "ars", grade: 3 },{ id: "phos", grade: 2 },{ id: "dig", grade: 2 },{ id: "cimic", grade: 1 },{ id: "gels", grade: 1 },{ id: "arg-n", grade: 1 },{ id: "plat", grade: 1 },{ id: "nit-ac", grade: 2 },{ id: "calc", grade: 2 },{ id: "lach", grade: 2 },
    ]},
    { symptomId: "mind-fear-darkness", remedies: [
      { id: "stram", grade: 3 },{ id: "phos", grade: 3 },{ id: "calc", grade: 2 },{ id: "lyss", grade: 2 },{ id: "caust", grade: 1 },{ id: "carb-v", grade: 1 },{ id: "lyc", grade: 2 },
    ]},
    { symptomId: "mind-fear-alone", remedies: [
      { id: "phos", grade: 3 },{ id: "ars", grade: 3 },{ id: "lyc", grade: 2 },{ id: "stram", grade: 3 },{ id: "kali-c", grade: 2 },{ id: "sep", grade: 2 },{ id: "puls", grade: 2 },{ id: "hyos", grade: 1 },{ id: "arg-n", grade: 2 },
    ]},
    { symptomId: "mind-anxiety", remedies: [
      { id: "acon", grade: 3 },{ id: "ars", grade: 3 },{ id: "arg-n", grade: 3 },{ id: "calc", grade: 2 },{ id: "phos", grade: 2 },{ id: "kali-c", grade: 2 },{ id: "lyc", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "puls", grade: 2 },{ id: "sep", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "kali-p", grade: 2 },{ id: "gels", grade: 2 },{ id: "ign", grade: 2 },
    ]},
    { symptomId: "mind-anxiety-anticipation", remedies: [
      { id: "arg-n", grade: 3 },{ id: "gels", grade: 3 },{ id: "lyc", grade: 3 },{ id: "sil", grade: 2 },{ id: "phos", grade: 2 },{ id: "calc", grade: 2 },{ id: "med" || "medo", grade: 2 },
    ]},
    { symptomId: "mind-anxiety-health", remedies: [
      { id: "ars", grade: 3 },{ id: "nit-ac", grade: 3 },{ id: "phos", grade: 2 },{ id: "kali-c", grade: 2 },{ id: "calc", grade: 2 },{ id: "lyc", grade: 1 },{ id: "nux-v", grade: 1 },
    ]},
    { symptomId: "mind-restlessness", remedies: [
      { id: "acon", grade: 3 },{ id: "ars", grade: 3 },{ id: "rhus-t", grade: 3 },{ id: "cham", grade: 2 },{ id: "coff", grade: 2 },{ id: "zinc", grade: 2 },{ id: "lyco", grade: 3 },{ id: "merc", grade: 2 },{ id: "iod", grade: 2 },{ id: "medo", grade: 2 },
    ]},
    { symptomId: "mind-irritability", remedies: [
      { id: "nux-v", grade: 3 },{ id: "cham", grade: 3 },{ id: "bry", grade: 3 },{ id: "staph", grade: 2 },{ id: "kali-c", grade: 2 },{ id: "lyc", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "sep", grade: 2 },{ id: "sulph", grade: 2 },{ id: "hep", grade: 2 },{ id: "cina", grade: 3 },
    ]},
    { symptomId: "mind-grief", remedies: [
      { id: "ign", grade: 3 },{ id: "nat-m", grade: 3 },{ id: "ph-ac", grade: 3 },{ id: "caust", grade: 2 },{ id: "staph", grade: 2 },{ id: "puls", grade: 2 },{ id: "lach", grade: 1 },
    ]},
    { symptomId: "mind-anger", remedies: [
      { id: "nux-v", grade: 3 },{ id: "cham", grade: 3 },{ id: "staph", grade: 3 },{ id: "coloc", grade: 3 },{ id: "bry", grade: 2 },{ id: "lyc", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "sep", grade: 2 },{ id: "sulph", grade: 2 },
    ]},
    { symptomId: "mind-depression", remedies: [
      { id: "nat-m", grade: 3 },{ id: "sep", grade: 3 },{ id: "ign", grade: 3 },{ id: "cimic", grade: 2 },{ id: "kali-p", grade: 2 },{ id: "puls", grade: 2 },{ id: "calc", grade: 2 },{ id: "graph", grade: 2 },{ id: "ph-ac", grade: 2 },{ id: "nat-s", grade: 2 },{ id: "sulph", grade: 1 },
    ]},
    { symptomId: "mind-jealousy", remedies: [
      { id: "lach", grade: 3 },{ id: "hyos", grade: 3 },{ id: "apis", grade: 2 },{ id: "puls", grade: 1 },{ id: "nux-v", grade: 1 },
    ]},
    { symptomId: "mind-fear-insanity", remedies: [
      { id: "calc", grade: 3 },{ id: "cimic", grade: 2 },{ id: "arg-n", grade: 2 },{ id: "puls", grade: 1 },{ id: "stram", grade: 2 },
    ]},
    { symptomId: "mind-fear-public", remedies: [
      { id: "gels", grade: 3 },{ id: "lyc", grade: 3 },{ id: "sil", grade: 2 },{ id: "arg-n", grade: 2 },{ id: "puls", grade: 1 },
    ]},
    { symptomId: "mind-weeping", remedies: [
      { id: "puls", grade: 3 },{ id: "ign", grade: 3 },{ id: "nat-m", grade: 3 },{ id: "sep", grade: 2 },{ id: "calc", grade: 2 },{ id: "lyc", grade: 2 },{ id: "graph", grade: 2 },
    ]},

    // =================== HEAD ====================
    { symptomId: "head-pain-throbbing", remedies: [
      { id: "bell", grade: 3 },{ id: "glon", grade: 3 },{ id: "nat-m", grade: 2 },{ id: "sang", grade: 2 },{ id: "puls", grade: 2 },{ id: "ferr-p", grade: 2 },{ id: "chin", grade: 2 },{ id: "acon", grade: 2 },{ id: "merc", grade: 1 },
    ]},
    { symptomId: "head-pain-congestive", remedies: [
      { id: "bell", grade: 3 },{ id: "glon", grade: 3 },{ id: "ferr-p", grade: 2 },{ id: "acon", grade: 2 },{ id: "phos", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "sang", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "sulph", grade: 1 },
    ]},
    { symptomId: "head-pain-pressing", remedies: [
      { id: "bry", grade: 3 },{ id: "nat-m", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "puls", grade: 2 },{ id: "phos", grade: 2 },{ id: "bell", grade: 2 },{ id: "calc", grade: 2 },{ id: "sulph", grade: 2 },{ id: "gels", grade: 2 },{ id: "sep", grade: 2 },
    ]},
    { symptomId: "head-pain-forehead", remedies: [
      { id: "bry", grade: 3 },{ id: "nux-v", grade: 2 },{ id: "gels", grade: 2 },{ id: "puls", grade: 2 },{ id: "bell", grade: 2 },{ id: "kali-b", grade: 2 },{ id: "sulph", grade: 2 },{ id: "calc", grade: 1 },{ id: "stict", grade: 2 },{ id: "nat-m", grade: 2 },
    ]},
    { symptomId: "head-pain-back-head", remedies: [
      { id: "gels", grade: 3 },{ id: "nat-m", grade: 2 },{ id: "sang", grade: 2 },{ id: "sil", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "bry", grade: 2 },{ id: "sep", grade: 2 },{ id: "carb-v", grade: 1 },{ id: "calc", grade: 2 },{ id: "phos", grade: 2 },
    ]},
    { symptomId: "head-pain-one-sided", remedies: [
      { id: "sang", grade: 3 },{ id: "spig", grade: 3 },{ id: "puls", grade: 2 },{ id: "sep", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "bell", grade: 2 },{ id: "lach", grade: 2 },{ id: "kali-b", grade: 2 },{ id: "ign", grade: 2 },
    ]},
    { symptomId: "head-pain-right-sided", remedies: [
      { id: "sang", grade: 3 },{ id: "bell", grade: 2 },{ id: "lyc", grade: 2 },{ id: "mag-p", grade: 2 },{ id: "iris", grade: 2 },{ id: "ars", grade: 1 },{ id: "bry", grade: 2 },
    ]},
    { symptomId: "head-pain-left-sided", remedies: [
      { id: "spig", grade: 3 },{ id: "lach", grade: 3 },{ id: "sep", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "thuj", grade: 2 },{ id: "phos", grade: 1 },
    ]},
    { symptomId: "head-pain-temple", remedies: [
      { id: "spig", grade: 2 },{ id: "sang", grade: 2 },{ id: "bell", grade: 2 },{ id: "bry", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "puls", grade: 2 },{ id: "chin", grade: 2 },
    ]},
    { symptomId: "head-pain-vertex", remedies: [
      { id: "glon", grade: 2 },{ id: "sep", grade: 2 },{ id: "sulph", grade: 2 },{ id: "calc", grade: 2 },{ id: "lach", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "phos", grade: 2 },
    ]},
    { symptomId: "head-pain-bursting", remedies: [
      { id: "glon", grade: 3 },{ id: "bell", grade: 3 },{ id: "bry", grade: 3 },{ id: "nat-m", grade: 2 },{ id: "chin", grade: 2 },{ id: "nux-v", grade: 2 },
    ]},
    { symptomId: "head-pain-sun", remedies: [
      { id: "glon", grade: 3 },{ id: "bell", grade: 3 },{ id: "nat-c", grade: 3 },{ id: "nat-m", grade: 2 },{ id: "sang", grade: 2 },{ id: "acon", grade: 1 },
    ]},
    { symptomId: "head-congestion", remedies: [
      { id: "bell", grade: 3 },{ id: "glon", grade: 3 },{ id: "acon", grade: 2 },{ id: "phos", grade: 2 },{ id: "sulph", grade: 2 },{ id: "ferr-p", grade: 2 },{ id: "nux-v", grade: 2 },
    ]},
    { symptomId: "head-vertigo", remedies: [
      { id: "cocc", grade: 3 },{ id: "con", grade: 3 },{ id: "bell", grade: 2 },{ id: "gels", grade: 2 },{ id: "phos", grade: 2 },{ id: "tab", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "calc", grade: 2 },{ id: "sulph", grade: 2 },
    ]},
    { symptomId: "head-heaviness", remedies: [
      { id: "gels", grade: 3 },{ id: "bry", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "calc", grade: 2 },{ id: "sep", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "bell", grade: 2 },
    ]},
    { symptomId: "head-perspiration", remedies: [
      { id: "calc", grade: 3 },{ id: "sil", grade: 3 },{ id: "merc", grade: 2 },{ id: "sep", grade: 2 },{ id: "phos", grade: 1 },
    ]},

    // =================== EYES ====================
    { symptomId: "eyes-inflammation", remedies: [
      { id: "bell", grade: 3 },{ id: "euphr", grade: 3 },{ id: "arg-n", grade: 2 },{ id: "merc", grade: 2 },{ id: "acon", grade: 2 },{ id: "puls", grade: 2 },{ id: "sulph", grade: 2 },
    ]},
    { symptomId: "eyes-lacrimation", remedies: [
      { id: "euphr", grade: 3 },{ id: "puls", grade: 2 },{ id: "merc", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "sulph", grade: 1 },
    ]},

    // =================== NOSE ====================
    { symptomId: "nose-discharge-yellow-green", remedies: [
      { id: "puls", grade: 3 },{ id: "kali-b", grade: 3 },{ id: "kali-s", grade: 3 },{ id: "merc", grade: 2 },{ id: "hep", grade: 2 },{ id: "calc", grade: 2 },
    ]},
    { symptomId: "nose-discharge-stringy", remedies: [
      { id: "kali-b", grade: 3 },{ id: "hep", grade: 1 },{ id: "hydr", grade: 2 },
    ]},
    { symptomId: "nose-sinusitis", remedies: [
      { id: "kali-b", grade: 3 },{ id: "sil", grade: 2 },{ id: "merc", grade: 2 },{ id: "hep", grade: 2 },{ id: "puls", grade: 2 },{ id: "lyc", grade: 2 },{ id: "stict", grade: 2 },
    ]},
    { symptomId: "nose-sneezing-violent", remedies: [
      { id: "sabad", grade: 3 },{ id: "acon", grade: 2 },{ id: "ars", grade: 2 },{ id: "stict", grade: 2 },{ id: "euphr", grade: 2 },
    ]},
    { symptomId: "nose-hay-fever", remedies: [
      { id: "sabad", grade: 3 },{ id: "euphr", grade: 2 },{ id: "ars", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "puls", grade: 1 },
    ]},
    { symptomId: "nose-epistaxis", remedies: [
      { id: "ferr-p", grade: 3 },{ id: "phos", grade: 3 },{ id: "acon", grade: 2 },{ id: "bell", grade: 2 },{ id: "merc", grade: 2 },{ id: "croc", grade: 2 },{ id: "ip", grade: 2 },
    ]},

    // =================== THROAT ====================
    { symptomId: "throat-sore", remedies: [
      { id: "merc", grade: 3 },{ id: "bell", grade: 3 },{ id: "lach", grade: 3 },{ id: "hep", grade: 2 },{ id: "phyt", grade: 2 },{ id: "lyc", grade: 2 },{ id: "apis", grade: 2 },{ id: "nit-ac", grade: 2 },
    ]},
    { symptomId: "throat-lump-sensation", remedies: [
      { id: "ign", grade: 3 },{ id: "lach", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "nux-v", grade: 1 },
    ]},
    { symptomId: "throat-splinter-pain", remedies: [
      { id: "hep", grade: 3 },{ id: "nit-ac", grade: 3 },{ id: "arg-n", grade: 2 },{ id: "lach", grade: 2 },
    ]},
    { symptomId: "throat-worse-left", remedies: [
      { id: "lach", grade: 3 },{ id: "sep", grade: 2 },{ id: "merc", grade: 1 },
    ]},

    // =================== STOMACH ====================
    { symptomId: "stomach-nausea", remedies: [
      { id: "ip", grade: 3 },{ id: "nux-v", grade: 3 },{ id: "cocc", grade: 3 },{ id: "tab", grade: 3 },{ id: "ars", grade: 2 },{ id: "puls", grade: 2 },{ id: "sep", grade: 2 },{ id: "ant-t", grade: 2 },{ id: "ferr", grade: 2 },{ id: "coloc", grade: 1 },
    ]},
    { symptomId: "stomach-vomiting", remedies: [
      { id: "ip", grade: 3 },{ id: "verat", grade: 3 },{ id: "ars", grade: 3 },{ id: "nux-v", grade: 2 },{ id: "phos", grade: 2 },{ id: "ant-t", grade: 2 },{ id: "kreos", grade: 2 },
    ]},
    { symptomId: "stomach-bloating", remedies: [
      { id: "lyc", grade: 3 },{ id: "carb-v", grade: 3 },{ id: "chin", grade: 3 },{ id: "nux-m", grade: 3 },{ id: "arg-n", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "puls", grade: 2 },{ id: "graph", grade: 2 },
    ]},
    { symptomId: "stomach-acidity", remedies: [
      { id: "rob", grade: 3 },{ id: "nux-v", grade: 3 },{ id: "lyc", grade: 2 },{ id: "puls", grade: 2 },{ id: "carb-v", grade: 2 },{ id: "calc", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "phos", grade: 2 },{ id: "sulph", grade: 2 },
    ]},
    { symptomId: "stomach-heartburn", remedies: [
      { id: "rob", grade: 3 },{ id: "nux-v", grade: 3 },{ id: "lyc", grade: 2 },{ id: "puls", grade: 2 },{ id: "calc", grade: 2 },{ id: "ars", grade: 2 },{ id: "carb-v", grade: 2 },
    ]},

    // =================== ABDOMEN ====================
    { symptomId: "abdomen-flatulence", remedies: [
      { id: "lyc", grade: 3 },{ id: "carb-v", grade: 3 },{ id: "chin", grade: 3 },{ id: "arg-n", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "puls", grade: 2 },{ id: "graph", grade: 2 },{ id: "sulph", grade: 2 },
    ]},
    { symptomId: "abdomen-colic", remedies: [
      { id: "coloc", grade: 3 },{ id: "mag-p", grade: 3 },{ id: "cham", grade: 3 },{ id: "cupr", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "plb", grade: 2 },{ id: "stann", grade: 2 },{ id: "bell", grade: 2 },
    ]},
    { symptomId: "abdomen-pain-cramping", remedies: [
      { id: "coloc", grade: 3 },{ id: "mag-p", grade: 3 },{ id: "cupr", grade: 3 },{ id: "nux-v", grade: 2 },{ id: "bell", grade: 2 },{ id: "cham", grade: 2 },{ id: "vib", grade: 2 },
    ]},
    { symptomId: "abdomen-constipation", remedies: [
      { id: "nux-v", grade: 3 },{ id: "op", grade: 3 },{ id: "sulph", grade: 3 },{ id: "sil", grade: 2 },{ id: "calc", grade: 2 },{ id: "graph", grade: 2 },{ id: "lyc", grade: 2 },{ id: "plb", grade: 2 },{ id: "sep", grade: 2 },{ id: "bry", grade: 2 },{ id: "nat-m", grade: 2 },
    ]},
    { symptomId: "abdomen-liver-complaints", remedies: [
      { id: "lyc", grade: 3 },{ id: "nat-s", grade: 3 },{ id: "podo", grade: 3 },{ id: "chel", grade: 3 },{ id: "merc", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "berb", grade: 2 },{ id: "calc", grade: 2 },
    ]},
    { symptomId: "abdomen-gallstones", remedies: [
      { id: "berb", grade: 3 },{ id: "lyc", grade: 2 },{ id: "calc", grade: 2 },{ id: "chin", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "chel", grade: 3 },{ id: "carb-v", grade: 1 },
    ]},

    // =================== STOOL/RECTUM ====================
    { symptomId: "stool-diarrhea-morning", remedies: [
      { id: "podo", grade: 3 },{ id: "sulph", grade: 3 },{ id: "nat-s", grade: 3 },{ id: "phos", grade: 2 },{ id: "bry", grade: 2 },{ id: "aloe", grade: 3 },
    ]},
    { symptomId: "stool-diarrhea-violent", remedies: [
      { id: "verat", grade: 3 },{ id: "ars", grade: 3 },{ id: "podo", grade: 2 },{ id: "ip", grade: 2 },{ id: "phos", grade: 2 },
    ]},
    { symptomId: "rectum-hemorrhoids", remedies: [
      { id: "nux-v", grade: 3 },{ id: "sulph", grade: 3 },{ id: "mur-ac", grade: 3 },{ id: "calc", grade: 2 },{ id: "sep", grade: 2 },{ id: "puls", grade: 2 },{ id: "graph", grade: 2 },
    ]},

    // =================== URINARY ====================
    { symptomId: "urine-burning", remedies: [
      { id: "canth", grade: 3 },{ id: "berb", grade: 2 },{ id: "sars", grade: 2 },{ id: "apis", grade: 2 },{ id: "merc", grade: 2 },{ id: "acon", grade: 2 },
    ]},
    { symptomId: "urine-kidney-stones", remedies: [
      { id: "berb", grade: 3 },{ id: "lyc", grade: 3 },{ id: "sars", grade: 3 },{ id: "canth", grade: 2 },{ id: "calc", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "phos", grade: 2 },{ id: "bell", grade: 1 },{ id: "acon", grade: 1 },{ id: "ter", grade: 2 },
    ]},
    { symptomId: "urine-scanty", remedies: [
      { id: "apis", grade: 3 },{ id: "dig", grade: 2 },{ id: "canth", grade: 2 },{ id: "ter", grade: 2 },{ id: "ars", grade: 2 },{ id: "bell", grade: 1 },
    ]},
    { symptomId: "urine-incontinence", remedies: [
      { id: "caust", grade: 3 },{ id: "squil", grade: 2 },{ id: "puls", grade: 2 },{ id: "bell", grade: 2 },{ id: "sep", grade: 2 },{ id: "nat-m", grade: 1 },
    ]},

    // =================== CHEST ====================
    { symptomId: "chest-pain-stitching", remedies: [
      { id: "bry", grade: 3 },{ id: "kali-c", grade: 3 },{ id: "ran-b", grade: 3 },{ id: "squil", grade: 2 },{ id: "phos", grade: 2 },{ id: "sulph", grade: 2 },{ id: "acon", grade: 2 },{ id: "merc", grade: 1 },
    ]},
    { symptomId: "chest-pain-left", remedies: [
      { id: "spig", grade: 3 },{ id: "lach", grade: 3 },{ id: "acon", grade: 2 },{ id: "phos", grade: 2 },{ id: "bry", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "dig", grade: 2 },
    ]},
    { symptomId: "chest-pain-right", remedies: [
      { id: "bry", grade: 3 },{ id: "lyc", grade: 2 },{ id: "kali-c", grade: 2 },{ id: "phos", grade: 2 },{ id: "sang", grade: 2 },{ id: "ran-b", grade: 2 },
    ]},
    { symptomId: "chest-pain-breathing", remedies: [
      { id: "bry", grade: 3 },{ id: "ran-b", grade: 3 },{ id: "kali-c", grade: 2 },{ id: "phos", grade: 2 },{ id: "acon", grade: 2 },{ id: "sulph", grade: 2 },
    ]},
    { symptomId: "chest-palpitation", remedies: [
      { id: "spig", grade: 3 },{ id: "dig", grade: 3 },{ id: "acon", grade: 3 },{ id: "lil-t", grade: 2 },{ id: "lach", grade: 2 },{ id: "naja", grade: 2 },{ id: "calc", grade: 2 },{ id: "phos", grade: 2 },{ id: "arg-n", grade: 2 },{ id: "iod", grade: 2 },
    ]},
    { symptomId: "chest-heart-pain-left", remedies: [
      { id: "spig", grade: 3 },{ id: "lach", grade: 2 },{ id: "acon", grade: 2 },{ id: "dig", grade: 2 },{ id: "naja", grade: 2 },{ id: "cact", grade: 3 },
    ]},
    { symptomId: "chest-oppression", remedies: [
      { id: "phos", grade: 3 },{ id: "ars", grade: 2 },{ id: "carb-v", grade: 2 },{ id: "seneg", grade: 2 },{ id: "ip", grade: 2 },{ id: "ant-t", grade: 2 },{ id: "stann", grade: 2 },
    ]},
    { symptomId: "chest-pneumonia", remedies: [
      { id: "phos", grade: 3 },{ id: "bry", grade: 3 },{ id: "ant-t", grade: 2 },{ id: "sulph", grade: 2 },{ id: "lyc", grade: 2 },{ id: "hep", grade: 2 },{ id: "acon", grade: 2 },{ id: "ferr-p", grade: 2 },
    ]},

    // =================== RESPIRATION/COUGH ====================
    { symptomId: "cough-dry-night", remedies: [
      { id: "hyos", grade: 3 },{ id: "dros", grade: 3 },{ id: "bell", grade: 2 },{ id: "phos", grade: 2 },{ id: "spong", grade: 2 },{ id: "acon", grade: 2 },{ id: "bry", grade: 2 },
    ]},
    { symptomId: "cough-croupy", remedies: [
      { id: "spong", grade: 3 },{ id: "hep", grade: 3 },{ id: "dros", grade: 3 },{ id: "acon", grade: 3 },{ id: "samb", grade: 2 },{ id: "calc", grade: 1 },
    ]},
    { symptomId: "cough-rattling-unable-expectorate", remedies: [
      { id: "ant-t", grade: 3 },{ id: "ip", grade: 2 },{ id: "seneg", grade: 2 },{ id: "dulc", grade: 1 },{ id: "hep", grade: 2 },
    ]},
    { symptomId: "cough-spasmodic-vomiting", remedies: [
      { id: "dros", grade: 3 },{ id: "ip", grade: 3 },{ id: "cupr", grade: 2 },{ id: "bell", grade: 2 },{ id: "nux-v", grade: 1 },
    ]},
    { symptomId: "respiration-asthma", remedies: [
      { id: "ip", grade: 3 },{ id: "ars", grade: 3 },{ id: "nat-s", grade: 2 },{ id: "spong", grade: 2 },{ id: "samb", grade: 2 },{ id: "carb-v", grade: 2 },{ id: "phos", grade: 2 },{ id: "kali-c", grade: 2 },{ id: "sulph", grade: 2 },{ id: "nux-v", grade: 2 },
    ]},

    // =================== BACK ====================
    { symptomId: "back-pain-lumbar", remedies: [
      { id: "berb", grade: 3 },{ id: "nux-v", grade: 3 },{ id: "calc", grade: 2 },{ id: "kali-c", grade: 2 },{ id: "rhus-t", grade: 2 },{ id: "bry", grade: 2 },{ id: "sep", grade: 2 },{ id: "sulph", grade: 2 },{ id: "cimic", grade: 2 },{ id: "cocc", grade: 2 },
    ]},
    { symptomId: "back-pain-neck", remedies: [
      { id: "cimic", grade: 3 },{ id: "rhus-t", grade: 2 },{ id: "bry", grade: 2 },{ id: "gels", grade: 2 },{ id: "calc", grade: 2 },{ id: "sil", grade: 2 },
    ]},
    { symptomId: "back-stiffness", remedies: [
      { id: "rhus-t", grade: 3 },{ id: "cimic", grade: 3 },{ id: "bry", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "calc", grade: 2 },{ id: "dulc", grade: 2 },
    ]},
    { symptomId: "back-pain-stitching", remedies: [
      { id: "kali-c", grade: 3 },{ id: "bry", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "berb", grade: 2 },{ id: "sep", grade: 2 },
    ]},

    // =================== EXTREMITIES ====================
    { symptomId: "extremities-joint-pain", remedies: [
      { id: "rhus-t", grade: 3 },{ id: "bry", grade: 3 },{ id: "coloc", grade: 2 },{ id: "calc", grade: 2 },{ id: "puls", grade: 2 },{ id: "led", grade: 2 },{ id: "sulph", grade: 2 },{ id: "merc", grade: 2 },{ id: "phyt", grade: 2 },{ id: "staph", grade: 2 },
    ]},
    { symptomId: "extremities-stiffness", remedies: [
      { id: "rhus-t", grade: 3 },{ id: "bry", grade: 3 },{ id: "calc", grade: 2 },{ id: "dulc", grade: 2 },{ id: "caust", grade: 2 },{ id: "lyc", grade: 2 },
    ]},
    { symptomId: "extremities-rheumatic", remedies: [
      { id: "rhus-t", grade: 3 },{ id: "bry", grade: 3 },{ id: "dulc", grade: 2 },{ id: "coloc", grade: 2 },{ id: "puls", grade: 2 },{ id: "merc", grade: 2 },{ id: "led", grade: 2 },{ id: "kali-c", grade: 2 },{ id: "calc", grade: 2 },{ id: "phyt", grade: 2 },
    ]},
    { symptomId: "extremities-sciatica", remedies: [
      { id: "coloc", grade: 3 },{ id: "mag-p", grade: 3 },{ id: "rhus-t", grade: 2 },{ id: "tell", grade: 2 },{ id: "gels", grade: 2 },{ id: "ars", grade: 2 },{ id: "bry", grade: 2 },
    ]},
    { symptomId: "extremities-cramps-calves", remedies: [
      { id: "cupr", grade: 3 },{ id: "mag-p", grade: 2 },{ id: "calc", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "sulph", grade: 2 },{ id: "verat", grade: 2 },
    ]},
    { symptomId: "extremities-cold-feet", remedies: [
      { id: "calc", grade: 3 },{ id: "sil", grade: 3 },{ id: "puls", grade: 2 },{ id: "sep", grade: 2 },{ id: "sulph", grade: 2 },{ id: "graph", grade: 2 },
    ]},
    { symptomId: "extremities-restless-legs", remedies: [
      { id: "zinc", grade: 3 },{ id: "rhus-t", grade: 2 },{ id: "caust", grade: 2 },{ id: "ars", grade: 2 },{ id: "med" || "medo", grade: 2 },
    ]},
    { symptomId: "extremities-bone-pain", remedies: [
      { id: "eup-per", grade: 3 },{ id: "rhus-t", grade: 2 },{ id: "merc", grade: 2 },{ id: "sil", grade: 2 },{ id: "calc-p", grade: 2 },{ id: "mez", grade: 2 },
    ]},
    { symptomId: "extremities-fracture", remedies: [
      { id: "symph", grade: 3 },{ id: "calc-p", grade: 3 },{ id: "ruta", grade: 2 },{ id: "sil", grade: 2 },{ id: "calc-f", grade: 2 },
    ]},

    // =================== SLEEP ====================
    { symptomId: "sleep-insomnia", remedies: [
      { id: "coff", grade: 3 },{ id: "nux-v", grade: 3 },{ id: "acon", grade: 2 },{ id: "ign", grade: 2 },{ id: "puls", grade: 2 },{ id: "ars", grade: 2 },{ id: "kali-p", grade: 2 },{ id: "sulph", grade: 2 },{ id: "val", grade: 2 },
    ]},
    { symptomId: "sleep-disturbed", remedies: [
      { id: "cham", grade: 3 },{ id: "coff", grade: 3 },{ id: "nux-v", grade: 2 },{ id: "ars", grade: 2 },{ id: "bell", grade: 2 },{ id: "puls", grade: 2 },
    ]},

    // =================== FEVER ====================
    { symptomId: "fever-high-sudden", remedies: [
      { id: "acon", grade: 3 },{ id: "bell", grade: 3 },{ id: "ferr-p", grade: 2 },{ id: "gels", grade: 2 },{ id: "bry", grade: 2 },{ id: "phos", grade: 1 },
    ]},
    { symptomId: "fever-influenza", remedies: [
      { id: "eup-per", grade: 3 },{ id: "gels", grade: 3 },{ id: "bry", grade: 3 },{ id: "rhus-t", grade: 2 },{ id: "ars", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "bell", grade: 2 },{ id: "ferr-p", grade: 2 },
    ]},
    { symptomId: "fever-intermittent", remedies: [
      { id: "chin", grade: 3 },{ id: "ars", grade: 3 },{ id: "nat-m", grade: 2 },{ id: "ip", grade: 2 },{ id: "puls", grade: 2 },{ id: "sulph", grade: 2 },
    ]},

    // =================== SKIN ====================
    { symptomId: "skin-itching", remedies: [
      { id: "sulph", grade: 3 },{ id: "ars", grade: 3 },{ id: "rhus-t", grade: 2 },{ id: "merc", grade: 2 },{ id: "graph", grade: 2 },{ id: "mez", grade: 2 },{ id: "kreos", grade: 2 },{ id: "sep", grade: 2 },
    ]},
    { symptomId: "skin-eczema", remedies: [
      { id: "graph", grade: 3 },{ id: "sulph", grade: 3 },{ id: "merc", grade: 2 },{ id: "rhus-t", grade: 2 },{ id: "mez", grade: 2 },{ id: "petr", grade: 2 },{ id: "ars", grade: 2 },{ id: "sep", grade: 2 },{ id: "nat-m", grade: 2 },
    ]},
    { symptomId: "skin-suppuration", remedies: [
      { id: "hep", grade: 3 },{ id: "sil", grade: 3 },{ id: "merc", grade: 2 },{ id: "calc", grade: 2 },{ id: "sulph", grade: 2 },
    ]},
    { symptomId: "skin-warts", remedies: [
      { id: "thuj", grade: 3 },{ id: "nit-ac", grade: 3 },{ id: "caust", grade: 3 },{ id: "dulc", grade: 2 },{ id: "calc", grade: 2 },
    ]},
    { symptomId: "skin-herpes", remedies: [
      { id: "nat-m", grade: 3 },{ id: "rhus-t", grade: 3 },{ id: "graph", grade: 2 },{ id: "sep", grade: 2 },{ id: "ars", grade: 2 },{ id: "tell", grade: 2 },
    ]},
    { symptomId: "skin-herpes-zoster", remedies: [
      { id: "ran-b", grade: 3 },{ id: "rhus-t", grade: 3 },{ id: "mez", grade: 3 },{ id: "ars", grade: 2 },{ id: "lach", grade: 2 },{ id: "nat-m", grade: 2 },
    ]},
    { symptomId: "skin-burning", remedies: [
      { id: "ars", grade: 3 },{ id: "sulph", grade: 3 },{ id: "phos", grade: 2 },{ id: "apis", grade: 2 },{ id: "canth", grade: 2 },{ id: "merc", grade: 2 },
    ]},
    { symptomId: "skin-urticaria", remedies: [
      { id: "apis", grade: 3 },{ id: "dulc", grade: 3 },{ id: "rhus-t", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "puls", grade: 2 },{ id: "ars", grade: 2 },
    ]},

    // =================== FEMALE ====================
    { symptomId: "female-menstrual-pain", remedies: [
      { id: "mag-p", grade: 3 },{ id: "cimic", grade: 3 },{ id: "vib", grade: 3 },{ id: "puls", grade: 2 },{ id: "sep", grade: 2 },{ id: "bell", grade: 2 },{ id: "cham", grade: 2 },{ id: "coloc", grade: 2 },
    ]},
    { symptomId: "female-menstrual-irregular", remedies: [
      { id: "puls", grade: 3 },{ id: "sep", grade: 3 },{ id: "calc", grade: 2 },{ id: "cimic", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "graph", grade: 2 },
    ]},
    { symptomId: "female-menopause", remedies: [
      { id: "lach", grade: 3 },{ id: "sep", grade: 3 },{ id: "sang", grade: 2 },{ id: "sulph", grade: 2 },{ id: "calc", grade: 2 },{ id: "graph", grade: 2 },
    ]},
    { symptomId: "female-bearing-down", remedies: [
      { id: "sep", grade: 3 },{ id: "lil-t", grade: 3 },{ id: "bell", grade: 2 },{ id: "puls", grade: 2 },{ id: "calc", grade: 2 },
    ]},
    { symptomId: "female-leucorrhea-acrid", remedies: [
      { id: "kreos", grade: 3 },{ id: "sep", grade: 2 },{ id: "merc", grade: 2 },{ id: "puls", grade: 2 },{ id: "calc", grade: 2 },{ id: "graph", grade: 2 },
    ]},

    // =================== MALE ====================
    { symptomId: "male-sexual-debility", remedies: [
      { id: "sel", grade: 3 },{ id: "ph-ac", grade: 3 },{ id: "lyc", grade: 2 },{ id: "arg-n", grade: 2 },{ id: "con", grade: 2 },{ id: "staph", grade: 2 },
    ]},

    // =================== GENERALITIES ====================
    { symptomId: "generalities-weakness", remedies: [
      { id: "ars", grade: 3 },{ id: "carb-v", grade: 3 },{ id: "chin", grade: 3 },{ id: "gels", grade: 3 },{ id: "phos", grade: 2 },{ id: "kali-c", grade: 2 },{ id: "calc", grade: 2 },{ id: "sep", grade: 2 },{ id: "lyc", grade: 2 },{ id: "ferr", grade: 2 },{ id: "ph-ac", grade: 2 },{ id: "mur-ac", grade: 2 },
    ]},
    { symptomId: "generalities-burning", remedies: [
      { id: "ars", grade: 3 },{ id: "sulph", grade: 3 },{ id: "phos", grade: 3 },{ id: "canth", grade: 2 },{ id: "apis", grade: 2 },{ id: "sec", grade: 2 },{ id: "merc", grade: 2 },
    ]},
    { symptomId: "generalities-worse-motion", remedies: [
      { id: "bry", grade: 3 },{ id: "bell", grade: 2 },{ id: "nux-v", grade: 2 },{ id: "coloc", grade: 1 },
    ]},
    { symptomId: "generalities-better-motion", remedies: [
      { id: "rhus-t", grade: 3 },{ id: "dulc", grade: 2 },{ id: "ferr", grade: 2 },{ id: "puls", grade: 2 },{ id: "lyc", grade: 1 },
    ]},
    { symptomId: "generalities-anemia", remedies: [
      { id: "ferr", grade: 3 },{ id: "ferr-p", grade: 3 },{ id: "calc-p", grade: 2 },{ id: "chin", grade: 2 },{ id: "nat-m", grade: 2 },{ id: "phos", grade: 2 },
    ]},
    { symptomId: "generalities-hemorrhage-bright", remedies: [
      { id: "phos", grade: 3 },{ id: "ip", grade: 3 },{ id: "ferr-p", grade: 2 },{ id: "acon", grade: 2 },{ id: "bell", grade: 2 },{ id: "ferr", grade: 2 },{ id: "croc", grade: 2 },
    ]},
    { symptomId: "generalities-vaccination-effects", remedies: [
      { id: "thuj", grade: 3 },{ id: "sil", grade: 3 },{ id: "mez", grade: 2 },{ id: "sulph", grade: 2 },
    ]},
    { symptomId: "generalities-obesity", remedies: [
      { id: "calc", grade: 3 },{ id: "graph", grade: 3 },{ id: "phyt", grade: 2 },{ id: "sulph", grade: 2 },{ id: "ant-t", grade: 1 },
    ]},
    { symptomId: "generalities-emaciation-eating-well", remedies: [
      { id: "iod", grade: 3 },{ id: "nat-m", grade: 3 },{ id: "tub", grade: 2 },{ id: "calc", grade: 2 },{ id: "lyc", grade: 2 },
    ]},
  ];
}

// ==========================
// Write enriched remedies.json
// ==========================
const remedies = buildRemedies();
const remediesOutput = { remedies, lastUpdated: new Date().toISOString(), totalRemedies: remedies.length };
fs.writeFileSync(path.join(__dirname, '..', 'data', 'remedies.json'), JSON.stringify(remediesOutput, null, 2));
console.log(`Wrote ${remedies.length} remedies to remedies.json`);

// ==========================
// Write enriched rubrics.json
// ==========================
const rubricsArr = buildRubrics();
const rubricsOutput = { rubrics: rubricsArr, lastUpdated: new Date().toISOString(), totalRubrics: rubricsArr.length };
fs.writeFileSync(path.join(__dirname, '..', 'data', 'rubrics.json'), JSON.stringify(rubricsOutput, null, 2));

let totalMappings = 0;
for (const r of rubricsArr) totalMappings += r.remedies.length;
console.log(`Wrote ${rubricsArr.length} rubrics with ${totalMappings} symptom-remedy mappings to rubrics.json`);
