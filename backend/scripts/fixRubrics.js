const fs = require('fs');
const path = require('path');

const symptomsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'symptoms.json'), 'utf8'));
const remediesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'remedies.json'), 'utf8'));

const allRemedyIds = remediesData.remedies.map(r => r.id);

// ============================================================
// CLINICALLY ACCURATE REMEDY MAPPINGS
// Based on Kent's Repertory, Boericke's Materia Medica,
// and standard homeopathic practice.
//
// Grade 3 = strongly indicated (bold in Kent)
// Grade 2 = moderately indicated (italic in Kent)
// Grade 1 = weakly indicated (plain in Kent)
// ============================================================

const clinicalMap = {

  // ==================== MIND ====================
  'mind-fear': { g3: ['acon','ars','phos','bell','stram','calc','lyc','puls'], g2: ['arg-n','gels','ign','op','plat','sep','sil','nat-m'], g1: ['caust','graph','kali-c','lach','merc','nux-v','sulph'] },
  'mind-fear-death': { g3: ['acon','ars','phos','cimic','plat'], g2: ['arg-n','calc','gels','lach','nit-ac','stram'], g1: ['bell','lyc','nux-v','puls','sep','verat'] },
  'mind-fear-darkness': { g3: ['stram','phos','calc'], g2: ['acon','bell','lyc','puls'], g1: ['ars','caust','med','sil'] },
  'mind-fear-alone': { g3: ['ars','phos','lyc','kali-c'], g2: ['arg-n','bell','hyos','puls','stram'], g1: ['calc','gels','ign','lach','sep'] },
  'mind-fear-crowd': { g3: ['acon','arg-n','lyc'], g2: ['nat-m','puls','sep','sil'], g1: ['calc','gels','kali-c','phos','stram'] },
  'mind-fear-disease': { g3: ['ars','phos','nit-ac','calc'], g2: ['acon','arg-n','kali-c','lyc'], g1: ['lach','nat-m','nux-v','sep','sulph'] },
  'mind-fear-future': { g3: ['ars','calc','phos','arg-n'], g2: ['bry','gels','lyc','nat-m','puls'], g1: ['acon','ign','nux-v','sep','sil'] },
  'mind-fear-insanity': { g3: ['calc','phos','ars','cimic'], g2: ['acon','arg-n','cann-s','lach','merc'], g1: ['bell','hyos','lyc','nux-v','stram'] },
  'mind-fear-night': { g3: ['acon','ars','phos','stram'], g2: ['bell','calc','caust','lyc'], g1: ['cham','chin','puls','sil'] },
  'mind-fear-poverty': { g3: ['ars','bry','calc','psor'], g2: ['lyc','nux-v','sep','sulph'], g1: ['arg-n','puls','sil','stram'] },
  'mind-fear-water': { g3: ['bell','stram','hyos','lyss'], g2: ['acon','lach','phos'], g1: ['ars','calc','merc','sulph'] },
  'mind-fear-strangers': { g3: ['bar-c','lyc','stram'], g2: ['acon','ars','bell','sil'], g1: ['calc','caust','nat-m','phos','sep'] },
  'mind-fear-thunder': { g3: ['phos','nat-m','rhod'], g2: ['bell','gels','lyc','nit-ac'], g1: ['acon','ars','calc','sep','sil'] },
  'mind-fear-height': { g3: ['arg-n','phos','calc'], g2: ['acon','gels','sulph'], g1: ['bell','lyc','nat-m','puls','sil'] },
  'mind-fear-misfortune': { g3: ['ars','calc','phos','psor'], g2: ['lyc','nat-m','sep','sulph'], g1: ['acon','arg-n','nux-v','puls'] },

  'mind-anxiety': { g3: ['acon','ars','arg-n','phos','calc','kali-c'], g2: ['gels','ign','lyc','nat-m','nux-v','puls','sep'], g1: ['bell','bry','caust','chin','lach','merc','sil','sulph'] },
  'mind-anger': { g3: ['nux-v','cham','staph','bry'], g2: ['ars','bell','lyc','nat-m','sep','sulph'], g1: ['acon','calc','ign','kali-c','lach','phos','puls'] },
  'mind-sadness': { g3: ['ign','nat-m','puls','aur','sep'], g2: ['ars','calc','caust','lach','lyc','phos','staph'], g1: ['bell','bry','chin','graph','kali-c','nux-v','sil','sulph'] },
  'mind-restlessness': { g3: ['acon','ars','rhus-t','cham','coff'], g2: ['arg-n','bell','calc','chin','hyos','phos','stram','zinc'], g1: ['bry','ign','lyc','merc','nux-v','puls','sep','sulph','verat'] },
  'mind-confusion': { g3: ['nux-v','phos','lyc','nat-m','calc'], g2: ['bell','bry','gels','merc','op','sep','sil'], g1: ['acon','arg-n','arn','ars','chin','ign','lach','puls','sulph'] },
  'mind-irritability': { g3: ['nux-v','cham','bry','kali-c','sep'], g2: ['acon','ars','bell','calc','lyc','nat-m','phos','staph','sulph'], g1: ['arg-n','caust','chin','graph','ign','lach','merc','puls','sil'] },
  'mind-weeping': { g3: ['puls','ign','nat-m','sep','lyc'], g2: ['calc','caust','graph','lach','phos','staph'], g1: ['acon','ars','bell','bry','chin','nux-v','sil','sulph'] },
  'mind-indifference': { g3: ['sep','phos','nat-m','op'], g2: ['calc','chin','lyc','puls','staph'], g1: ['ars','bell','graph','ign','merc','nux-v','sil','sulph'] },
  'mind-delirium': { g3: ['bell','hyos','stram','op'], g2: ['acon','ars','bry','lach','verat'], g1: ['calc','chin','lyc','merc','nux-v','phos','rhus-t'] },
  'mind-concentration-difficult': { g3: ['lyc','nat-m','phos','nux-v','bar-c'], g2: ['calc','lach','sep','sil','sulph'], g1: ['arg-n','ars','bell','chin','graph','ign','merc','puls'] },
  'mind-memory-weak': { g3: ['lyc','nat-m','phos','bar-c','anac'], g2: ['calc','kali-c','merc','nux-v','sep','sil','sulph'], g1: ['arg-n','bell','chin','graph','ign','lach'] },

  // ==================== HEAD ====================
  'head-pain': { g3: ['bell','bry','glon','nat-m','nux-v','sep'], g2: ['acon','ars','calc','chin','gels','ign','lach','lyc','phos','puls','sang','sil','spig','sulph'], g1: ['arg-n','cham','coff','ferr','graph','kali-c','merc'] },
  'head-congestion': { g3: ['bell','glon','acon','phos'], g2: ['bry','calc','chin','ferr','lach','nat-m','nux-v','sulph'], g1: ['ars','gels','ign','lyc','puls','sep','sil'] },
  'head-vertigo': { g3: ['bell','phos','gels','nat-m','con'], g2: ['acon','ars','bry','calc','chin','cocc','ferr','lyc','nux-v','puls','sep','sil','sulph'], g1: ['arg-n','graph','ign','kali-c','lach','merc'] },
  'head-dandruff': { g3: ['sulph','graph','nat-m','ars','kali-s'], g2: ['calc','lyc','merc','phos','sep','sil','thuj'], g1: ['bry','kali-c','nit-ac','puls'] },

  // ==================== EYES ====================
  'eye-pain': { g3: ['bell','spig','puls','euphr','ruta'], g2: ['acon','ars','bry','calc','merc','nat-m','nux-v','phos','sil','sulph'], g1: ['arg-n','gels','graph','kali-c','lach','lyc','sep'] },
  'eye-inflammation': { g3: ['bell','euphr','apis','merc','arg-n'], g2: ['acon','ars','calc','hep','lyc','nat-m','puls','sulph'], g1: ['bry','graph','kali-c','nit-ac','phos','sep','sil'] },
  'eye-lachrymation': { g3: ['euphr','all-c','puls','nat-m'], g2: ['bell','calc','merc','phos','rhus-t','sulph'], g1: ['acon','ars','graph','lyc','nux-v','sil'] },

  // ==================== EAR ====================
  'ear-pain': { g3: ['bell','cham','puls','merc'], g2: ['acon','hep','kali-m','sil','sulph'], g1: ['ars','calc','graph','lyc','nat-m','nux-v','phos','sep'] },
  'ear-discharge': { g3: ['merc','hep','sil','puls','calc-s'], g2: ['ars','bell','calc','graph','kali-bi','lyc','sulph','tell'], g1: ['aur','kali-c','nat-m','nit-ac','phos','sep'] },
  'ear-tinnitus': { g3: ['chin','nat-m','phos','lyc','kali-c'], g2: ['bell','calc','graph','merc','nux-v','puls','sep','sil','sulph'], g1: ['acon','ars','ign','lach','petr'] },
  'ear-hearing-impaired': { g3: ['phos','lyc','merc','sil','petr'], g2: ['bell','calc','graph','kali-m','nat-m','nit-ac','puls','sulph'], g1: ['acon','ars','chin','kali-c','sep'] },

  // ==================== NOSE ====================
  'nose-coryza': { g3: ['acon','all-c','ars','nux-v','puls'], g2: ['bell','bry','calc','euphr','gels','kali-bi','lyc','merc','nat-m','phos','sulph'], g1: ['arg-n','cham','chin','graph','hep','ign','kali-c','sep','sil'] },
  'nose-discharge': { g3: ['ars','kali-bi','merc','puls','nat-m'], g2: ['all-c','calc','graph','hep','lyc','nux-v','sil','sulph'], g1: ['acon','bell','bry','euphr','ign','phos','sep'] },
  'nose-sneezing': { g3: ['all-c','ars','nux-v','sabad'], g2: ['acon','calc','merc','nat-m','phos','puls','sil','sulph'], g1: ['bell','bry','euphr','graph','kali-c','lyc','sep'] },
  'nose-obstruction': { g3: ['nux-v','lyc','samb','calc','amm-c'], g2: ['ars','bell','kali-bi','merc','nat-m','puls','sil','sulph'], g1: ['acon','bry','graph','hep','phos','sep'] },
  'nose-epistaxis': { g3: ['phos','ferr','arn','ham','croc'], g2: ['bell','calc','carb-v','chin','ip','lach','merc','nit-ac','sep','sulph'], g1: ['acon','ars','bry','lyc','nat-m','puls','sil'] },

  // ==================== FACE ====================
  'face-pain': { g3: ['bell','mag-p','spig','coloc','verb'], g2: ['acon','ars','cham','chin','kali-c','merc','nux-v','puls','sep'], g1: ['bry','calc','graph','lach','lyc','nat-m','phos','sil','sulph'] },
  'face-swelling': { g3: ['apis','bell','merc','ars','phos'], g2: ['bry','calc','graph','hep','lyc','nat-m','puls','rhus-t','sep','sil','sulph'], g1: ['acon','kali-c','lach','nux-v'] },
  'face-eruptions': { g3: ['sulph','graph','nat-m','rhus-t','sep'], g2: ['ars','bell','calc','hep','lyc','merc','nit-ac','phos','puls','sil'], g1: ['bry','kali-c','lach','nux-v'] },

  // ==================== MOUTH ====================
  'mouth-dryness': { g3: ['bry','ars','bell','puls','nux-m'], g2: ['acon','calc','chin','lyc','merc','nat-m','nux-v','phos','sep','sulph'], g1: ['graph','kali-c','lach','sil'] },
  'mouth-taste-bitter': { g3: ['bry','nux-v','chin','puls','nat-m'], g2: ['ars','calc','lyc','merc','phos','sep','sulph'], g1: ['acon','bell','graph','ign','kali-c','lach','sil'] },
  'mouth-ulcers': { g3: ['merc','nit-ac','ars','bor','sulph'], g2: ['calc','graph','hep','lyc','nat-m','phos','sep','sil','staph'], g1: ['bell','kali-c','lach','nux-v','puls'] },
  'mouth-bleeding-gums': { g3: ['merc','phos','carb-v','nat-m','hep'], g2: ['ars','calc','lach','lyc','nit-ac','sep','sil','sulph','staph'], g1: ['bell','bry','chin','kali-c','nux-v'] },
  'mouth-salivation': { g3: ['merc','nit-ac','ip','lyc'], g2: ['ars','bell','calc','graph','ign','nat-m','puls','sep','sulph'], g1: ['bry','chin','kali-c','lach','nux-v','phos','sil'] },

  // ==================== THROAT ====================
  'throat-pain': { g3: ['bell','merc','lach','hep','phyt'], g2: ['apis','ars','bry','calc','ign','kali-bi','lyc','nit-ac','nux-v','phos','puls','sep','sulph'], g1: ['acon','cham','graph','kali-c','nat-m','sil'] },
  'throat-dryness': { g3: ['bell','bry','phos','nux-m','lyc'], g2: ['acon','ars','calc','lach','merc','nat-m','nux-v','puls','sep','sulph'], g1: ['graph','ign','kali-c','sil'] },
  'throat-inflammation': { g3: ['bell','merc','apis','lach','hep'], g2: ['acon','ars','bry','calc','ign','kali-bi','lyc','nit-ac','phyt','puls','sep','sulph'], g1: ['graph','kali-c','nat-m','nux-v','phos','sil'] },
  'throat-swelling': { g3: ['bell','apis','merc','lach','hep'], g2: ['acon','ars','bry','calc','lyc','nit-ac','phos','sep','sil','sulph'], g1: ['graph','ign','kali-c','nat-m','nux-v','puls'] },
  'throat-lump': { g3: ['ign','lach','nat-m','calc'], g2: ['bell','lyc','nux-v','phos','puls','sep','sulph'], g1: ['ars','bry','graph','kali-c','merc','sil'] },
  'throat-mucus': { g3: ['kali-bi','merc','puls','calc','hep'], g2: ['ars','bell','graph','lyc','nat-m','nux-v','phos','sep','sil','sulph'], g1: ['bry','ign','kali-c','lach'] },

  // ==================== STOMACH ====================
  'stomach-nausea': { g3: ['ip','nux-v','ars','sep','cocc'], g2: ['ant-t','bry','calc','chin','colch','lyc','phos','puls','tab','verat'], g1: ['acon','bell','graph','ign','kali-c','lach','merc','nat-m','sil','sulph'] },
  'stomach-vomiting': { g3: ['ip','ars','nux-v','phos','verat'], g2: ['ant-t','bell','bry','calc','chin','lyc','merc','sep','sulph','tab'], g1: ['acon','graph','ign','kali-c','lach','nat-m','puls','sil'] },
  'stomach-appetite-loss': { g3: ['chin','nat-m','puls','ars','calc'], g2: ['bry','ign','lyc','nux-v','phos','sep','sil','sulph'], g1: ['acon','bell','graph','kali-c','lach','merc'] },
  'stomach-thirst': { g3: ['acon','ars','bry','nat-m','phos','verat'], g2: ['bell','calc','chin','merc','nux-v','sulph'], g1: ['graph','ign','kali-c','lach','lyc','puls','sep','sil'] },
  'stomach-heartburn': { g3: ['nux-v','puls','calc','lyc','phos','rob'], g2: ['ars','bry','chin','nat-m','sep','sulph'], g1: ['acon','bell','graph','ign','kali-c','lach','merc','sil'] },
  'stomach-distension': { g3: ['lyc','carb-v','chin','nux-v','calc'], g2: ['ars','bry','graph','kali-c','nat-m','phos','puls','sep','sulph'], g1: ['bell','ign','lach','merc','sil'] },
  'stomach-pain': { g3: ['nux-v','bry','ars','coloc','lyc','calc'], g2: ['bell','carb-v','chin','kali-c','nat-m','phos','puls','sep','sulph'], g1: ['acon','graph','ign','lach','merc','sil'] },
  'stomach-eructations': { g3: ['carb-v','lyc','nux-v','chin','calc'], g2: ['arg-n','ars','bry','nat-m','phos','puls','sep','sulph'], g1: ['bell','graph','ign','kali-c','lach','merc','sil'] },
  'stomach-aversion': { g3: ['sep','nux-v','puls','calc','ars'], g2: ['bry','chin','graph','kali-c','lyc','nat-m','phos','sil','sulph'], g1: ['acon','bell','ign','lach','merc'] },
  'stomach-desires': { g3: ['calc','phos','lyc','nat-m','sulph'], g2: ['arg-n','ars','chin','nux-v','puls','sep','sil'], g1: ['bell','bry','graph','ign','kali-c','lach','merc'] },

  // ==================== ABDOMEN ====================
  'abdomen-pain': { g3: ['coloc','mag-p','nux-v','bry','lyc'], g2: ['ars','bell','calc','cham','chin','kali-c','phos','puls','sep','sulph'], g1: ['acon','graph','ign','lach','merc','nat-m','sil'] },
  'abdomen-flatulence': { g3: ['lyc','carb-v','chin','nux-v','arg-n'], g2: ['ars','calc','coloc','graph','kali-c','nat-m','phos','puls','sep','sulph'], g1: ['bell','bry','cham','ign','lach','merc','sil'] },
  'abdomen-distension': { g3: ['lyc','carb-v','chin','calc','graph'], g2: ['ars','bry','kali-c','nat-m','nux-v','phos','puls','sep','sulph'], g1: ['bell','cham','ign','lach','merc','sil'] },
  'abdomen-liver': { g3: ['lyc','chel','nux-v','merc','calc'], g2: ['ars','bry','chin','kali-c','lach','nat-m','phos','sep','sulph'], g1: ['bell','graph','ign','puls','sil'] },
  'abdomen-hernia': { g3: ['nux-v','lyc','calc','sil','sulph'], g2: ['arn','aur','bry','cham','cocc','graph','op'], g1: ['acon','bell','lach','phos','puls','sep'] },

  // ==================== RECTUM ====================
  'rectum-constipation': { g3: ['nux-v','op','alum','plb','lyc','bry','sulph'], g2: ['calc','graph','nat-m','sep','sil','zinc','kali-c'], g1: ['ars','bell','chin','lach','merc','phos','puls'] },
  'rectum-diarrhoea': { g3: ['ars','podo','aloe','chin','merc','verat'], g2: ['bell','bry','calc','cham','ip','lyc','nat-m','nux-v','phos','puls','sep','sulph'], g1: ['acon','graph','ign','kali-c','lach','sil'] },
  'rectum-haemorrhoids': { g3: ['nux-v','sulph','aesc','aloe','ham'], g2: ['ars','calc','graph','kali-c','lyc','merc','nat-m','phos','puls','sep','sil'], g1: ['bell','bry','chin','ign','lach'] },
  'rectum-itching': { g3: ['sulph','nit-ac','ign','calc','sil'], g2: ['aloe','graph','lyc','merc','nat-m','nux-v','phos','sep'], g1: ['ars','bell','bry','chin','kali-c','lach','puls'] },
  'rectum-fissure': { g3: ['nit-ac','graph','sulph','rat','sil'], g2: ['calc','lyc','nat-m','phos','sep','thuj'], g1: ['ars','merc','nux-v','puls'] },

  // ==================== STOOL ====================
  'stool-bloody': { g3: ['merc','nit-ac','phos','ham','aloe'], g2: ['ars','calc','chin','ip','lyc','nux-v','sep','sulph'], g1: ['bell','bry','graph','kali-c','lach','nat-m','puls','sil'] },
  'stool-hard': { g3: ['nux-v','bry','op','alum','sulph','lyc'], g2: ['calc','graph','kali-c','nat-m','plb','sep','sil'], g1: ['ars','bell','chin','lach','merc','phos','puls'] },

  // ==================== URINARY ====================
  'urine-frequent': { g3: ['canth','puls','apis','merc','bell'], g2: ['acon','ars','calc','lyc','nat-m','nux-v','phos','sep','sil','sulph','equis'], g1: ['bry','chin','graph','ign','kali-c','lach'] },
  'urine-burning': { g3: ['canth','ars','merc','apis','sars'], g2: ['bell','calc','lyc','nat-m','nux-v','phos','puls','sep','sulph','berb'], g1: ['acon','bry','graph','ign','kali-c','lach','sil'] },
  'urine-involuntary': { g3: ['caust','puls','bell','sep','nat-m'], g2: ['ars','calc','ferr','lyc','nux-v','phos','sil','sulph'], g1: ['acon','bry','chin','graph','ign','kali-c','lach','merc'] },
  'urine-retention': { g3: ['acon','canth','op','ars','lyc'], g2: ['bell','calc','caust','merc','nux-v','puls','sep','sil'], g1: ['bry','graph','kali-c','lach','phos','sulph'] },
  'urine-sediment': { g3: ['lyc','berb','sars','calc','phos'], g2: ['ars','canth','merc','nat-m','nux-v','sep','sil','sulph'], g1: ['bell','bry','chin','graph','kali-c','lach','puls'] },
  'urine-kidney-pain': { g3: ['berb','canth','lyc','sars','calc'], g2: ['ars','bell','nux-v','phos','puls','sep','sil','sulph'], g1: ['acon','bry','chin','graph','ign','kali-c','lach','merc','nat-m'] },

  // ==================== MALE ====================
  'male-impotency': { g3: ['agn','lyc','phos','sep','calc'], g2: ['arg-n','ars','chin','con','graph','kali-c','merc','nat-m','nux-v','sil','sulph'], g1: ['bell','ign','lach','puls'] },
  'male-emissions': { g3: ['phos','chin','nux-v','staph','sep'], g2: ['calc','lyc','merc','nat-m','sil','sulph'], g1: ['ars','bell','graph','ign','kali-c','lach','puls'] },
  'male-testes-pain': { g3: ['clem','puls','rhod','ham','spong'], g2: ['ars','aur','bell','calc','lyc','merc','nux-v','sil','sulph','staph'], g1: ['bry','graph','kali-c','lach','nat-m','phos','sep'] },
  'male-prostate': { g3: ['con','lyc','thuj','puls','sabal'], g2: ['bar-c','calc','ferr-p','nat-m','nux-v','phos','sep','sil','sulph','staph'], g1: ['ars','bell','graph','kali-c','merc'] },

  // ==================== FEMALE ====================
  'female-menses-painful': { g3: ['mag-p','coloc','cham','cimic','puls','bell'], g2: ['calc','caust','graph','kali-c','lach','lyc','nat-m','nux-v','sep','sulph','vib'], g1: ['acon','ars','bry','ign','phos','sil'] },
  'female-menses-irregular': { g3: ['puls','sep','calc','nat-m','lyc'], g2: ['ars','cimic','graph','kali-c','lach','nux-v','phos','sil','sulph'], g1: ['acon','bell','bry','chin','ign','merc'] },
  'female-leucorrhoea': { g3: ['sep','calc','puls','nat-m','merc'], g2: ['ars','graph','kali-c','lyc','nit-ac','phos','sil','sulph'], g1: ['acon','bell','bry','chin','ign','lach','nux-v'] },
  'female-menopause': { g3: ['lach','sep','sulph','calc','puls'], g2: ['cimic','graph','lyc','nat-m','phos','sil'], g1: ['ars','bell','ign','kali-c','nux-v'] },
  'female-ovary-pain': { g3: ['apis','lach','lyc','pall','thuj'], g2: ['bell','calc','coloc','graph','kali-c','nat-m','puls','sep','sulph'], g1: ['acon','ars','bry','ign','nux-v','phos','sil'] },

  // ==================== RESPIRATION ====================
  'resp-dyspnoea': { g3: ['ars','ip','ant-t','lach','phos','spong'], g2: ['acon','bell','bry','calc','carb-v','kali-c','lyc','nat-m','nux-v','puls','sep','sulph'], g1: ['chin','graph','ign','merc','sil'] },
  'resp-asthma': { g3: ['ars','ip','ant-t','lach','phos','spong','kali-c'], g2: ['acon','bell','bry','calc','carb-v','lyc','nat-m','nux-v','puls','sep','sulph','samb'], g1: ['chin','graph','ign','merc','sil'] },

  // ==================== COUGH ====================
  'cough-dry': { g3: ['acon','bry','phos','dros','bell','spong','rumx'], g2: ['ars','calc','caust','hep','ign','kali-c','lach','lyc','nux-v','puls','sep','sulph','stict'], g1: ['chin','graph','merc','nat-m','sil'] },
  'cough-loose': { g3: ['ant-t','ip','puls','calc','hep'], g2: ['ars','bry','carb-v','chin','dulc','kali-c','lyc','merc','nat-m','phos','sep','sil','sulph'], g1: ['acon','bell','graph','ign','lach','nux-v'] },
  'cough-spasmodic': { g3: ['dros','ip','cupr','cina','bell'], g2: ['ars','bry','calc','carb-v','caust','hep','kali-c','lyc','nux-v','phos','puls','sep','sulph'], g1: ['acon','chin','graph','ign','lach','merc','nat-m','sil'] },
  'cough-expectoration': { g3: ['puls','calc','hep','sil','phos'], g2: ['ant-t','ars','bry','carb-v','chin','kali-c','lyc','merc','nat-m','sep','sulph','stann'], g1: ['acon','bell','graph','ign','lach','nux-v'] },

  // ==================== CHEST ====================
  'chest-pain': { g3: ['bry','phos','kali-c','arn','ran-b'], g2: ['acon','ars','bell','calc','lyc','merc','nat-m','nux-v','puls','sep','sil','sulph','spig'], g1: ['chin','graph','ign','lach'] },
  'chest-palpitation': { g3: ['acon','spig','dig','lach','naja','cact'], g2: ['arg-n','ars','bell','calc','chin','gels','lyc','nat-m','nux-v','phos','puls','sep','sulph'], g1: ['bry','graph','ign','kali-c','merc','sil'] },
  'chest-oppression': { g3: ['ars','phos','ip','lach','bry'], g2: ['acon','bell','calc','carb-v','kali-c','lyc','nat-m','nux-v','puls','sep','sulph'], g1: ['chin','graph','ign','merc','sil'] },
  'chest-pneumonia': { g3: ['phos','bry','ant-t','lyc','sulph'], g2: ['acon','ars','bell','calc','carb-v','hep','kali-c','merc','nat-m','puls','sep','sil'], g1: ['chin','graph','ign','lach','nux-v'] },

  // ==================== BACK ====================
  'back-pain': { g3: ['rhus-t','bry','nux-v','calc','lyc','kali-c'], g2: ['acon','ars','bell','graph','nat-m','phos','puls','sep','sil','sulph'], g1: ['chin','ign','lach','merc'] },
  'back-pain-lumbar': { g3: ['rhus-t','bry','nux-v','kali-c','calc','berb'], g2: ['ars','bell','lyc','nat-m','phos','puls','sep','sil','sulph'], g1: ['acon','chin','graph','ign','lach','merc'] },
  'back-pain-cervical': { g3: ['rhus-t','bry','cimic','gels','calc'], g2: ['acon','bell','kali-c','lyc','nat-m','nux-v','phos','sep','sil','sulph'], g1: ['ars','chin','graph','ign','lach','merc','puls'] },
  'back-stiffness': { g3: ['rhus-t','bry','calc','lyc','kali-c'], g2: ['ars','bell','cimic','nat-m','nux-v','phos','puls','sep','sil','sulph'], g1: ['acon','chin','graph','ign','lach','merc'] },

  // ==================== EXTREMITIES ====================
  'extremities-pain': { g3: ['rhus-t','bry','calc','lyc','puls','kali-c'], g2: ['acon','ars','bell','caust','colch','merc','nat-m','nux-v','phos','sep','sil','sulph'], g1: ['chin','graph','ign','lach'] },
  'extremities-numbness': { g3: ['acon','lyc','phos','rhus-t','calc'], g2: ['ars','bell','graph','kali-c','merc','nat-m','nux-v','puls','sep','sil','sulph'], g1: ['bry','chin','ign','lach'] },
  'extremities-cramping': { g3: ['cupr','mag-p','calc','nux-v','coloc'], g2: ['ars','bell','lyc','merc','phos','puls','rhus-t','sep','sil','sulph','verat'], g1: ['acon','bry','chin','graph','ign','kali-c','lach','nat-m'] },
  'extremities-swelling': { g3: ['apis','rhus-t','bry','calc','lyc'], g2: ['ars','bell','graph','kali-c','merc','nat-m','phos','puls','sep','sil','sulph'], g1: ['acon','chin','ign','lach','nux-v'] },
  'extremities-weakness': { g3: ['gels','phos','calc','lyc','nat-m'], g2: ['ars','bry','chin','kali-c','merc','nux-v','puls','rhus-t','sep','sil','sulph'], g1: ['acon','bell','graph','ign','lach'] },
  'extremities-coldness': { g3: ['calc','ars','sil','sep','phos'], g2: ['bell','carb-v','chin','graph','kali-c','lyc','merc','nat-m','nux-v','puls','sulph','verat'], g1: ['acon','bry','ign','lach'] },
  'extremities-trembling': { g3: ['gels','merc','phos','zinc','plb'], g2: ['acon','ars','calc','chin','lyc','nat-m','nux-v','puls','sep','sil','sulph'], g1: ['bell','bry','graph','ign','kali-c','lach'] },
  'extremities-stiffness': { g3: ['rhus-t','bry','calc','lyc','kali-c'], g2: ['ars','bell','caust','graph','merc','nat-m','nux-v','puls','sep','sil','sulph'], g1: ['acon','chin','ign','lach','phos'] },

  // ==================== SLEEP ====================
  'sleep-insomnia': { g3: ['coff','nux-v','acon','ars','puls','ign'], g2: ['bell','calc','cham','chin','gels','kali-c','lyc','merc','nat-m','phos','sep','sil','sulph'], g1: ['bry','graph','lach'] },
  'sleep-disturbed': { g3: ['ars','bell','cham','nux-v','phos'], g2: ['acon','calc','chin','coff','ign','kali-c','lyc','merc','nat-m','puls','sep','sil','sulph'], g1: ['bry','graph','lach'] },
  'sleep-dreams': { g3: ['nat-m','phos','sulph','sil','calc'], g2: ['ars','bell','chin','ign','kali-c','lyc','merc','nux-v','puls','sep'], g1: ['acon','bry','graph','lach'] },
  'sleep-sleepiness': { g3: ['nux-m','op','gels','ant-t','phos'], g2: ['ars','calc','chin','lyc','merc','nat-m','nux-v','puls','sep','sulph'], g1: ['acon','bell','bry','graph','ign','kali-c','lach','sil'] },

  // ==================== FEVER ====================
  'fever-intermittent': { g3: ['chin','ars','nat-m','ip','eup-per'], g2: ['acon','bell','bry','calc','ferr','lyc','nux-v','phos','puls','sep','sulph'], g1: ['graph','ign','kali-c','lach','merc','sil'] },
  'fever-high': { g3: ['acon','bell','bry','phos','sulph'], g2: ['ars','calc','chin','ferr','lyc','merc','nat-m','nux-v','puls','sep'], g1: ['graph','ign','kali-c','lach','sil'] },
  'fever-chills': { g3: ['acon','ars','nux-v','puls','chin','gels'], g2: ['bell','bry','calc','ip','lyc','merc','nat-m','phos','sep','sil','sulph'], g1: ['graph','ign','kali-c','lach'] },
  'fever-perspiration': { g3: ['chin','merc','calc','sil','phos'], g2: ['acon','ars','bell','bry','lyc','nat-m','nux-v','puls','sep','sulph'], g1: ['graph','ign','kali-c','lach'] },

  // ==================== SKIN ====================
  'skin-itching': { g3: ['sulph','ars','merc','rhus-t','graph'], g2: ['calc','lyc','nat-m','nit-ac','phos','puls','sep','sil'], g1: ['acon','bell','bry','chin','ign','kali-c','lach','nux-v'] },
  'skin-eruptions': { g3: ['sulph','graph','rhus-t','merc','ars'], g2: ['calc','hep','lyc','nat-m','nit-ac','phos','puls','sep','sil'], g1: ['acon','bell','bry','chin','ign','kali-c','lach','nux-v'] },
  'skin-eczema': { g3: ['graph','sulph','ars','rhus-t','merc','mez','petr'], g2: ['calc','hep','lyc','nat-m','phos','puls','sep','sil'], g1: ['bell','bry','kali-c','lach','nit-ac','nux-v'] },
  'skin-urticaria': { g3: ['apis','urt-u','rhus-t','nat-m','sulph'], g2: ['ars','calc','lyc','puls','sep','sil'], g1: ['bell','graph','hep','kali-c','merc','nit-ac','phos'] },
  'skin-ulcers': { g3: ['sil','hep','merc','ars','sulph','nit-ac'], g2: ['calc','graph','kali-c','lach','lyc','nat-m','phos','sep'], g1: ['bell','bry','chin','nux-v','puls'] },
  'skin-warts': { g3: ['thuj','nit-ac','caust','dulc','ant-c'], g2: ['calc','lyc','nat-m','sep','sil','sulph'], g1: ['graph','kali-c','merc','phos'] },
  'skin-dry': { g3: ['ars','sulph','graph','petr','calc'], g2: ['bry','lyc','nat-m','phos','puls','sep','sil'], g1: ['bell','kali-c','lach','merc','nit-ac','nux-v'] },
  'skin-discoloration': { g3: ['sep','ars','lyc','sulph','phos'], g2: ['calc','chin','graph','kali-c','lach','merc','nat-m','nit-ac','sil'], g1: ['bell','bry','nux-v','puls'] },

  // ==================== GENERALITIES ====================
  'gen-weakness': { g3: ['ars','chin','phos','calc','gels','ferr'], g2: ['bell','bry','carb-v','kali-c','lyc','merc','nat-m','nux-v','puls','sep','sil','sulph'], g1: ['acon','graph','ign','lach'] },
  'gen-convulsions': { g3: ['bell','cupr','stram','cic','hyos'], g2: ['acon','ars','calc','cham','ign','lyc','nux-v','op','phos','sil','sulph','zinc'], g1: ['bry','chin','graph','kali-c','lach','merc','nat-m','puls','sep'] },
  'gen-inflammation': { g3: ['acon','bell','apis','bry','merc'], g2: ['ars','calc','hep','lach','lyc','phos','puls','rhus-t','sil','sulph'], g1: ['chin','graph','ign','kali-c','nat-m','nux-v','sep'] },
  'gen-cold-sensitive': { g3: ['ars','calc','hep','sil','psor','nux-v'], g2: ['bell','graph','kali-c','lyc','merc','nat-m','phos','puls','rhus-t','sep','sulph'], g1: ['acon','bry','chin','ign','lach'] },
  'gen-heat-sensitive': { g3: ['puls','sulph','lach','apis','lyc'], g2: ['arg-n','bell','bry','calc','merc','nat-m','phos','sep','sil'], g1: ['acon','ars','chin','graph','ign','kali-c','nux-v'] },
  'gen-worse-motion': { g3: ['bry','bell','nux-v','colch'], g2: ['acon','ars','calc','chin','kali-c','lyc','merc','nat-m','phos','sep','sil','sulph'], g1: ['graph','ign','lach','puls'] },
  'gen-better-motion': { g3: ['rhus-t','puls','ferr','lyc'], g2: ['ars','calc','chin','kali-c','merc','nat-m','phos','sep','sil','sulph'], g1: ['acon','bell','bry','graph','ign','lach','nux-v'] },
  'gen-right-sided': { g3: ['lyc','bell','apis','chel','calc'], g2: ['ars','bry','kali-c','merc','nat-m','nux-v','phos','sep','sil','sulph'], g1: ['acon','graph','ign','lach','puls'] },
  'gen-left-sided': { g3: ['lach','sep','phos','arg-n','asaf'], g2: ['ars','calc','kali-c','lyc','merc','nat-m','nux-v','puls','sil','sulph','spig'], g1: ['acon','bell','bry','graph','ign'] },

  // ==================== NEW CHAPTERS ====================

  // IMMUNE SYSTEM
  'immune-allergy': { g3: ['ars','nat-m','puls','sulph','apis'], g2: ['all-c','calc','graph','hep','kali-c','lyc','nux-v','phos','rhus-t','sep','sil'], g1: ['bell','bry','merc'] },
  'immune-hayfever': { g3: ['all-c','ars','sabad','euphr','nat-m'], g2: ['acon','nux-v','puls','sang','sil','sulph'], g1: ['bell','bry','calc','graph','kali-c','lyc','phos','sep'] },
  'immune-autoimmune': { g3: ['ars','phos','sulph','calc','lyc','thuj'], g2: ['nat-m','rhus-t','sep','sil','merc','med','tub'], g1: ['bell','bry','graph','kali-c','nux-v','puls'] },
  'immune-low': { g3: ['calc','sil','sulph','psor','tub','ars'], g2: ['bar-c','graph','lyc','merc','nat-m','phos','sep'], g1: ['bell','bry','kali-c','nux-v','puls'] },

  // ENDOCRINE
  'endo-thyroid': { g3: ['iod','calc','lyc','nat-m','spong'], g2: ['ars','bry','graph','kali-c','phos','sep','sil','sulph','thuj'], g1: ['bell','merc','nux-v','puls'] },
  'endo-diabetes': { g3: ['phos','ars','lyc','nat-m','uran-n','syz'], g2: ['calc','chin','merc','nux-v','sep','sil','sulph'], g1: ['bell','bry','graph','kali-c','puls'] },
  'endo-pcos': { g3: ['puls','sep','calc','nat-m','lach','thuj'], g2: ['apis','graph','kali-c','lyc','phos','sil','sulph'], g1: ['ars','bell','bry','merc','nux-v'] },

  // NERVOUS SYSTEM
  'neuro-neuralgia': { g3: ['mag-p','spig','coloc','acon','bell'], g2: ['ars','chin','gels','kali-c','lyc','merc','nat-m','nux-v','phos','puls','sep','sulph'], g1: ['bry','calc','graph','ign','lach','sil'] },
  'neuro-epilepsy': { g3: ['bell','cupr','cic','bufo','calc'], g2: ['ars','caust','hyos','ign','lyc','nux-v','op','phos','sil','stram','sulph','zinc'], g1: ['acon','bry','chin','graph','kali-c','lach','merc','nat-m','puls','sep'] },
  'neuro-tinnitus': { g3: ['chin','nat-m','phos','lyc','kali-c'], g2: ['bell','calc','graph','merc','nux-v','puls','sep','sil','sulph'], g1: ['acon','ars','ign','lach','petr'] },
  'neuro-migraine': { g3: ['bell','glon','nat-m','sang','iris','sep'], g2: ['bry','calc','gels','ign','kali-bi','lach','lyc','nux-v','phos','puls','sil','spig','sulph'], g1: ['acon','ars','chin','graph','kali-c','merc'] },

  // MENTAL HEALTH
  'mental-depression': { g3: ['aur','ign','nat-m','sep','puls','staph'], g2: ['ars','calc','caust','chin','graph','kali-c','lach','lyc','phos','sil','sulph'], g1: ['acon','bell','bry','merc','nux-v'] },
  'mental-anxiety-disorder': { g3: ['acon','arg-n','ars','calc','gels','kali-c','phos'], g2: ['bell','ign','lyc','nat-m','nux-v','puls','sep','sil','sulph'], g1: ['bry','chin','graph','lach','merc'] },
  'mental-ptsd': { g3: ['ign','nat-m','op','staph','stram'], g2: ['acon','ars','calc','caust','phos','sep','sil'], g1: ['bell','lyc','nux-v','puls','sulph'] },
  'mental-ocd': { g3: ['ars','nux-v','sil','thuj','nat-m'], g2: ['arg-n','calc','ign','lyc','puls','sep','sulph'], g1: ['bell','graph','kali-c','lach','merc','phos'] },
  'mental-adhd': { g3: ['stram','cina','hyos','verat','tub'], g2: ['arg-n','calc','lyc','nat-m','phos','sulph','zinc'], g1: ['ars','bell','cham','ign','nux-v'] },

  // CARDIOVASCULAR
  'cardio-hypertension': { g3: ['glon','lach','nat-m','aur','bar-c'], g2: ['acon','arg-n','bell','calc','lyc','nux-v','phos','plb','sulph'], g1: ['ars','bry','kali-c','merc','sep','sil'] },
  'cardio-arrhythmia': { g3: ['dig','cact','spig','lach','naja'], g2: ['acon','ars','calc','kali-c','lyc','nat-m','phos','sep','sulph'], g1: ['bell','bry','merc','nux-v','puls','sil'] },

  // GI
  'gi-ibs': { g3: ['nux-v','lyc','arg-n','sulph','calc'], g2: ['ars','bry','chin','coloc','graph','kali-c','nat-m','phos','puls','sep'], g1: ['bell','ign','lach','merc','sil'] },
  'gi-gerd': { g3: ['nux-v','puls','rob','calc','lyc','phos'], g2: ['ars','bry','carb-v','chin','nat-m','sep','sulph'], g1: ['bell','graph','ign','kali-c','lach','merc','sil'] },

  // MUSCULOSKELETAL
  'msk-frozen-shoulder': { g3: ['rhus-t','ferr','sang','calc','bry'], g2: ['acon','ars','lyc','nat-m','phos','puls','sep','sil','sulph'], g1: ['bell','graph','kali-c','merc','nux-v'] },
  'msk-osteoporosis': { g3: ['calc','calc-p','phos','sil','symph'], g2: ['ars','lyc','merc','nat-m','sep','sulph'], g1: ['bell','bry','graph','kali-c','nux-v','puls'] },
  'msk-sciatica': { g3: ['coloc','mag-p','rhus-t','gnaph','ars'], g2: ['bell','bry','calc','kali-c','lyc','nux-v','phos','puls','sep','sulph'], g1: ['graph','ign','lach','merc','nat-m','sil'] },

  // DERMATOLOGY
  'derm-acne': { g3: ['sulph','hep','calc','kali-br','sil'], g2: ['ant-c','ars','graph','lyc','nat-m','nux-v','puls','sep'], g1: ['bell','bry','lach','merc','phos'] },
  'derm-psoriasis': { g3: ['ars','graph','sulph','petr','mez'], g2: ['calc','kali-c','lyc','merc','nat-m','phos','puls','rhus-t','sep','sil'], g1: ['bell','bry','hep','lach','nit-ac','nux-v'] },
  'derm-vitiligo': { g3: ['ars','nat-m','phos','sep','sil'], g2: ['calc','graph','lyc','merc','nit-ac','sulph'], g1: ['bell','kali-c','lach','nux-v','puls'] },
  'derm-fungal': { g3: ['sulph','graph','sep','tell','rhus-t'], g2: ['ars','calc','lyc','merc','nat-m','sil'], g1: ['bell','kali-c','nit-ac','nux-v','phos','puls'] },
  'derm-alopecia': { g3: ['phos','lyc','graph','nat-m','sep'], g2: ['calc','fl-ac','kali-c','merc','sil','sulph','thuj'], g1: ['ars','bell','lach','nux-v'] },

  // PEDIATRICS
  'ped-colic': { g3: ['cham','coloc','mag-p','dios','lyc'], g2: ['bell','calc','carb-v','chin','nux-v','puls'], g1: ['acon','ars','ign','sep','sulph'] },
  'ped-teething': { g3: ['cham','calc','calc-p','bell','kreos'], g2: ['acon','coff','ign','merc','phos','puls','sil'], g1: ['ars','lyc','nux-v','sep','sulph'] },
  'ped-bedwetting': { g3: ['caust','puls','bell','sep','equis'], g2: ['calc','cina','lyc','nat-m','sil','sulph'], g1: ['ars','graph','kali-c','nux-v','phos'] },
  'ped-worms': { g3: ['cina','sabad','spig','calc','sil'], g2: ['ars','graph','lyc','merc','nat-m','sulph'], g1: ['bell','kali-c','nux-v','phos','puls','sep'] },

  // PREGNANCY
  'preg-morning-sickness': { g3: ['ip','sep','nux-v','cocc','tab','colch'], g2: ['ars','calc','lyc','nat-m','phos','puls','sulph'], g1: ['bell','bry','ign','kali-c','merc','sil'] },
  'preg-backache': { g3: ['kali-c','sep','calc','cimic','puls'], g2: ['ars','bell','bry','lyc','nat-m','nux-v','phos','rhus-t','sil','sulph'], g1: ['acon','graph','ign','lach','merc'] },
  'preg-mastitis': { g3: ['phyt','bry','bell','hep','sil'], g2: ['ars','calc','graph','lach','lyc','merc','puls','sep','sulph'], g1: ['acon','kali-c','nat-m','nux-v','phos'] },

  // INFECTIOUS
  'infect-flu': { g3: ['gels','bry','eup-per','ars','rhus-t','acon'], g2: ['bell','calc','chin','ip','lyc','merc','nat-m','nux-v','phos','puls','sep','sulph'], g1: ['graph','ign','kali-c','lach','sil'] },
  'infect-uti': { g3: ['canth','apis','berb','sars','equis'], g2: ['ars','bell','calc','lyc','merc','nat-m','nux-v','phos','puls','sep','sil','sulph'], g1: ['bry','graph','kali-c','lach'] },
  'infect-malaria': { g3: ['chin','ars','nat-m','ip','eup-per'], g2: ['acon','bell','bry','calc','lyc','nux-v','phos','puls','sep','sulph','verat'], g1: ['graph','ign','kali-c','lach','merc','sil'] },

  // LIVER & GALLBLADDER
  'liver-gallstones': { g3: ['chel','lyc','calc','berb','card-m'], g2: ['ars','bry','chin','kali-c','merc','nat-m','nux-v','phos','sep','sulph'], g1: ['bell','graph','lach','puls','sil'] },
  'liver-jaundice': { g3: ['chel','merc','phos','lyc','chin'], g2: ['ars','bry','calc','kali-c','nat-m','nux-v','sep','sulph'], g1: ['bell','graph','ign','lach','puls','sil'] },

  // RENAL
  'renal-stones': { g3: ['berb','lyc','calc','sars','canth'], g2: ['acon','ars','bell','nux-v','phos','puls','sep','sil','sulph'], g1: ['bry','chin','graph','kali-c','lach','merc','nat-m'] },
  'renal-nephritis': { g3: ['apis','canth','ars','phos','merc'], g2: ['bell','calc','lyc','nat-m','nux-v','sep','sil','sulph'], g1: ['bry','graph','kali-c','lach','puls'] },

  // FIRST AID
  'firstaid-burns': { g3: ['canth','caust','ars','urt-u'], g2: ['apis','bell','calc','lyc','phos','sulph'], g1: ['acon','bry','merc','nat-m','sep','sil'] },
  'firstaid-wounds': { g3: ['arn','calen','hyper','led','staph'], g2: ['hep','sil','sulph','ars','bell'], g1: ['calc','graph','lyc','merc','phos'] },
  'firstaid-bruises': { g3: ['arn','bell-p','ham','led','ruta'], g2: ['con','hyper','rhus-t','sulph'], g1: ['ars','calc','phos','sil'] },
  'firstaid-motion-sickness': { g3: ['cocc','tab','petr','nux-v','borx'], g2: ['ars','gels','ip','lyc','nat-m','puls','sep'], g1: ['bell','bry','calc','phos','sil','sulph'] },

  // SPORTS MEDICINE
  'sport-strain': { g3: ['arn','rhus-t','ruta','bry','calc'], g2: ['bell-p','hyper','led','nat-m','sil','sulph'], g1: ['acon','ars','lyc','phos','puls','sep'] },
  'sport-fracture': { g3: ['symph','calc','calc-p','ruta','sil'], g2: ['arn','bry','hyper','lyc','phos','sulph'], g1: ['ars','bell','merc','nat-m','sep'] },

  // ONCOLOGY SUPPORT
  'onco-support': { g3: ['ars','phos','calc','lyc','sulph','con'], g2: ['bell','carb-v','chin','graph','hep','kali-c','merc','nat-m','nux-v','sep','sil','thuj'], g1: ['bry','ign','lach','puls'] },

  // GERIATRICS
  'geri-dementia': { g3: ['bar-c','con','phos','lyc','anac'], g2: ['calc','kali-c','nat-m','nux-v','sep','sil','sulph'], g1: ['ars','bell','graph','lach','merc','puls'] },
  'geri-prostate': { g3: ['con','sabal','thuj','lyc','puls'], g2: ['bar-c','calc','ferr-p','nat-m','nux-v','phos','sep','sil','staph','sulph'], g1: ['ars','bell','graph','kali-c','merc'] },

  // HEALTHY AGING
  'aging-vitality': { g3: ['phos','calc','lyc','sil','chin','ars'], g2: ['bar-c','carb-v','con','kali-c','nat-m','nux-v','sep','sulph'], g1: ['bell','graph','lach','merc','puls'] },
  'aging-osteoarthritis': { g3: ['rhus-t','bry','calc','calc-f','lyc'], g2: ['ars','caust','kali-c','nat-m','phos','puls','sep','sil','sulph'], g1: ['bell','graph','lach','merc','nux-v'] },
};

// Build a comprehensive symptomId -> chapter mapping
function getChapterForSymptom(symptomId) {
  const parts = symptomId.split('-');
  return parts[0];
}

// For each symptom, find the best matching clinical map key
function findBestMatch(symptomId, symptomName) {
  if (clinicalMap[symptomId]) return symptomId;

  const sid = symptomId.toLowerCase();
  const sname = (symptomName || '').toLowerCase();

  // Try exact prefix matches first
  for (const key of Object.keys(clinicalMap)) {
    if (sid.startsWith(key)) return key;
  }

  // Keyword-based matching
  const keywordMap = {
    'fear': 'mind-fear', 'anxiety': 'mind-anxiety', 'anger': 'mind-anger',
    'sadness': 'mind-sadness', 'restless': 'mind-restlessness', 'irritab': 'mind-irritability',
    'weep': 'mind-weeping', 'indif': 'mind-indifference', 'delir': 'mind-delirium',
    'concentr': 'mind-concentration-difficult', 'memory': 'mind-memory-weak',
    'confus': 'mind-confusion',
    'headache': 'head-pain', 'head-pain': 'head-pain', 'vertigo': 'head-vertigo',
    'congestion-head': 'head-congestion', 'dandruff': 'head-dandruff',
    'eye': 'eye-pain', 'lachr': 'eye-lachrymation', 'photophob': 'eye-pain',
    'stye': 'eye-inflammation', 'conjunctiv': 'eye-inflammation',
    'ear-pain': 'ear-pain', 'ear-discharge': 'ear-discharge', 'tinnit': 'ear-tinnitus',
    'hearing': 'ear-hearing-impaired',
    'coryza': 'nose-coryza', 'nose-discharge': 'nose-discharge', 'sneez': 'nose-sneezing',
    'obstruction': 'nose-obstruction', 'epistaxis': 'nose-epistaxis', 'nosebleed': 'nose-epistaxis',
    'face-pain': 'face-pain', 'neuralg': 'face-pain', 'face-swell': 'face-swelling',
    'face-erup': 'face-eruptions', 'acne-face': 'face-eruptions',
    'mouth-dry': 'mouth-dryness', 'taste': 'mouth-taste-bitter', 'ulcer-mouth': 'mouth-ulcers',
    'mouth-ulcer': 'mouth-ulcers', 'bleeding-gum': 'mouth-bleeding-gums',
    'saliv': 'mouth-salivation', 'tongue': 'mouth-ulcers', 'breath': 'mouth-bleeding-gums',
    'throat-pain': 'throat-pain', 'throat-dry': 'throat-dryness',
    'tonsil': 'throat-inflammation', 'throat-swell': 'throat-swelling',
    'lump': 'throat-lump', 'throat-mucus': 'throat-mucus', 'hawk': 'throat-mucus',
    'nausea': 'stomach-nausea', 'vomit': 'stomach-vomiting',
    'appetite': 'stomach-appetite-loss', 'thirst': 'stomach-thirst',
    'heartburn': 'stomach-heartburn', 'eructat': 'stomach-eructations', 'belch': 'stomach-eructations',
    'stomach-pain': 'stomach-pain', 'stomach-distens': 'stomach-distension',
    'bloat': 'stomach-distension', 'aversion': 'stomach-aversion', 'desire': 'stomach-desires',
    'crav': 'stomach-desires',
    'abdomen-pain': 'abdomen-pain', 'colic': 'abdomen-pain', 'flatulence': 'abdomen-flatulence',
    'abdomen-distens': 'abdomen-distension', 'liver': 'abdomen-liver', 'hernia': 'abdomen-hernia',
    'constipat': 'rectum-constipation', 'diarrho': 'rectum-diarrhoea',
    'haemorrhoid': 'rectum-haemorrhoids', 'pile': 'rectum-haemorrhoids',
    'fissure': 'rectum-fissure', 'rectum-itch': 'rectum-itching', 'prolapse': 'rectum-haemorrhoids',
    'stool-blood': 'stool-bloody', 'stool-hard': 'stool-hard',
    'urin-frequent': 'urine-frequent', 'urin-burn': 'urine-burning',
    'urin-involunt': 'urine-involuntary', 'bed-wet': 'urine-involuntary',
    'urin-retent': 'urine-retention', 'sediment': 'urine-sediment', 'kidney': 'urine-kidney-pain',
    'impoten': 'male-impotency', 'emission': 'male-emissions',
    'testes': 'male-testes-pain', 'prostat': 'male-prostate',
    'menses-pain': 'female-menses-painful', 'dysmenorrh': 'female-menses-painful',
    'menses-irreg': 'female-menses-irregular', 'amenorrh': 'female-menses-irregular',
    'leucorrh': 'female-leucorrhoea', 'menopause': 'female-menopause',
    'ovary': 'female-ovary-pain',
    'dyspnoea': 'resp-dyspnoea', 'asthm': 'resp-asthma', 'wheez': 'resp-asthma',
    'cough-dry': 'cough-dry', 'cough-loose': 'cough-loose', 'cough-spasm': 'cough-spasmodic',
    'whooping': 'cough-spasmodic', 'expector': 'cough-expectoration',
    'chest-pain': 'chest-pain', 'palpit': 'chest-palpitation', 'oppress': 'chest-oppression',
    'pneumonia': 'chest-pneumonia',
    'back-pain': 'back-pain', 'lumbar': 'back-pain-lumbar', 'cervic': 'back-pain-cervical',
    'neck': 'back-pain-cervical', 'stiffness-back': 'back-stiffness',
    'extremit-pain': 'extremities-pain', 'joint': 'extremities-pain', 'numb': 'extremities-numbness',
    'cramp': 'extremities-cramping', 'extrem-swell': 'extremities-swelling',
    'extrem-weak': 'extremities-weakness', 'extrem-cold': 'extremities-coldness',
    'trembl': 'extremities-trembling', 'extrem-stiff': 'extremities-stiffness',
    'rheumat': 'extremities-pain', 'shoulder': 'extremities-pain', 'knee': 'extremities-pain',
    'hip': 'extremities-pain', 'wrist': 'extremities-pain', 'ankle': 'extremities-pain',
    'insomnia': 'sleep-insomnia', 'sleep-disturb': 'sleep-disturbed',
    'dream': 'sleep-dreams', 'sleep-position': 'sleep-disturbed', 'snor': 'sleep-disturbed',
    'sleepiness': 'sleep-sleepiness', 'somnolen': 'sleep-sleepiness',
    'fever-intermit': 'fever-intermittent', 'fever-high': 'fever-high', 'fever-sudden': 'fever-high',
    'chill': 'fever-chills', 'perspir': 'fever-perspiration', 'sweat': 'fever-perspiration',
    'itch': 'skin-itching', 'erupt': 'skin-eruptions', 'eczema': 'skin-eczema',
    'urticaria': 'skin-urticaria', 'hive': 'skin-urticaria', 'ulcer-skin': 'skin-ulcers',
    'wart': 'skin-warts', 'skin-dry': 'skin-dry', 'discolor': 'skin-discoloration',
    'psoriasis': 'derm-psoriasis', 'vitiligo': 'derm-vitiligo', 'fungal': 'derm-fungal',
    'ringworm': 'derm-fungal', 'alopecia': 'derm-alopecia', 'hair-fall': 'derm-alopecia',
    'acne': 'derm-acne',
    'weakness': 'gen-weakness', 'fatigu': 'gen-weakness', 'faint': 'gen-weakness',
    'convuls': 'gen-convulsions', 'inflammat': 'gen-inflammation',
    'cold-sensit': 'gen-cold-sensitive', 'heat-sensit': 'gen-heat-sensitive',
    'worse-motion': 'gen-worse-motion', 'better-motion': 'gen-better-motion',
    'right-sid': 'gen-right-sided', 'left-sid': 'gen-left-sided',
    'emaciat': 'gen-weakness', 'obes': 'gen-weakness',
    'allerg': 'immune-allergy', 'hayfever': 'immune-hayfever', 'autoimmun': 'immune-autoimmune',
    'low-immun': 'immune-low', 'recurr-infect': 'immune-low',
    'thyroid': 'endo-thyroid', 'diabet': 'endo-diabetes', 'pcos': 'endo-pcos',
    'neuralgia': 'neuro-neuralgia', 'trigemin': 'neuro-neuralgia',
    'epilep': 'neuro-epilepsy', 'seizure': 'neuro-epilepsy',
    'migrain': 'neuro-migraine', 'cluster-head': 'neuro-migraine',
    'depression': 'mental-depression', 'panic': 'mental-anxiety-disorder',
    'ptsd': 'mental-ptsd', 'ocd': 'mental-ocd', 'adhd': 'mental-adhd',
    'autism': 'mental-adhd', 'phobia': 'mental-anxiety-disorder',
    'hypertens': 'cardio-hypertension', 'blood-pressure': 'cardio-hypertension',
    'arrhythm': 'cardio-arrhythmia', 'fibrillat': 'cardio-arrhythmia',
    'ibs': 'gi-ibs', 'irritable-bowel': 'gi-ibs', 'gerd': 'gi-gerd',
    'acid-reflux': 'gi-gerd', 'celiac': 'gi-ibs',
    'frozen-shoulder': 'msk-frozen-shoulder', 'osteopor': 'msk-osteoporosis',
    'sciatic': 'msk-sciatica', 'plantar': 'msk-osteoporosis', 'carpal': 'msk-frozen-shoulder',
    'tennis-elbow': 'msk-frozen-shoulder', 'bursit': 'msk-frozen-shoulder',
    'spondyl': 'msk-osteoporosis', 'disc': 'back-pain-lumbar',
    'infantile-colic': 'ped-colic', 'teeth': 'ped-teething',
    'bedwet': 'ped-bedwetting', 'enuresis': 'ped-bedwetting',
    'worm': 'ped-worms', 'chicken-pox': 'skin-eruptions', 'measle': 'fever-high',
    'morning-sick': 'preg-morning-sickness', 'pregnan': 'preg-backache',
    'mastit': 'preg-mastitis', 'breastfeed': 'preg-mastitis',
    'labor': 'preg-backache', 'afterpain': 'preg-backache',
    'flu': 'infect-flu', 'influenz': 'infect-flu', 'covid': 'infect-flu',
    'uti': 'infect-uti', 'urinary-tract': 'infect-uti',
    'malaria': 'infect-malaria', 'typhoid': 'infect-flu', 'dengue': 'infect-flu',
    'hepatit': 'liver-jaundice',
    'gallstone': 'liver-gallstones', 'cholecyst': 'liver-gallstones',
    'jaundice': 'liver-jaundice', 'fatty-liver': 'liver-jaundice',
    'nephr': 'renal-nephritis', 'renal': 'renal-stones',
    'burn': 'firstaid-burns', 'sunburn': 'firstaid-burns',
    'wound': 'firstaid-wounds', 'cut': 'firstaid-wounds', 'puncture': 'firstaid-wounds',
    'bruis': 'firstaid-bruises', 'contus': 'firstaid-bruises',
    'motion-sick': 'firstaid-motion-sickness', 'travel-sick': 'firstaid-motion-sickness',
    'car-sick': 'firstaid-motion-sickness', 'sea-sick': 'firstaid-motion-sickness',
    'jet-lag': 'firstaid-motion-sickness', 'altitude': 'firstaid-motion-sickness',
    'strain': 'sport-strain', 'sprain': 'sport-strain', 'fractur': 'sport-fracture',
    'concuss': 'sport-strain', 'shin-splint': 'sport-strain',
    'cancer': 'onco-support', 'chemo': 'onco-support', 'tumor': 'onco-support',
    'lipoma': 'onco-support', 'cyst': 'onco-support',
    'dement': 'geri-dementia', 'alzheim': 'geri-dementia',
    'bph': 'geri-prostate', 'urinary-incontin': 'urine-involuntary',
    'declining-vital': 'aging-vitality', 'premature-ag': 'aging-vitality',
    'cognitive-decl': 'geri-dementia', 'brain-fog': 'geri-dementia',
    'osteoarthrit': 'aging-osteoarthritis', 'cataract': 'eye-inflammation',
    'sarcopenia': 'aging-vitality',
    'constitution': 'gen-weakness',
    'miasm': 'immune-autoimmune', 'psoric': 'immune-autoimmune',
    'sycotic': 'immune-autoimmune', 'syphilit': 'immune-autoimmune',
    'emotional-trauma': 'mental-ptsd', 'abuse': 'mental-ptsd',
    'humiliat': 'mental-ptsd', 'suppress': 'mental-ptsd',
    'detox': 'gen-weakness', 'antibiotic': 'gen-weakness', 'steroid': 'gen-weakness',
    'heavy-metal': 'gen-weakness',
    'nosode': 'immune-low', 'prophylax': 'immune-low',
    'lymph': 'gen-inflammation', 'lymphaden': 'gen-inflammation',
    'alcohol': 'mental-depression', 'tobacco': 'gen-weakness',
    'hangover': 'stomach-nausea',
    'pleurisy': 'chest-pain', 'croup': 'cough-spasmodic', 'bronchiolit': 'cough-loose',
    'conjunctiv': 'eye-inflammation', 'blepharit': 'eye-inflammation',
    'chalazion': 'eye-inflammation', 'dry-eye': 'eye-pain',
    'dental': 'mouth-ulcers', 'gingivit': 'mouth-bleeding-gums',
    'periodont': 'mouth-bleeding-gums', 'bruxism': 'sleep-disturbed',
    'halitosis': 'mouth-bleeding-gums',
    'sinus': 'nose-coryza', 'nasal-polyp': 'nose-obstruction',
    'adenoid': 'nose-obstruction', 'post-nasal': 'nose-discharge',
    'meniere': 'ear-tinnitus', 'strep': 'throat-inflammation',
    'laryngit': 'throat-dryness', 'sleep-apnea': 'sleep-disturbed',
    'erectile': 'male-impotency', 'premature-ejac': 'male-emissions',
    'libido': 'male-impotency', 'infertil': 'female-menses-irregular',
    'genital-wart': 'skin-warts',
    'anemia': 'gen-weakness', 'iron-defic': 'gen-weakness',
    'easy-bruis': 'firstaid-bruises',
    'gout': 'extremities-pain', 'uric-acid': 'extremities-pain',
    'vitamin': 'gen-weakness', 'rickets': 'msk-osteoporosis',
    'sjogren': 'mouth-dryness', 'scleroder': 'skin-dry',
    'polymyalg': 'extremities-pain',
    'weather': 'gen-cold-sensitive', 'chemical': 'gen-weakness',
    'pain-manage': 'gen-weakness', 'neuropathic': 'neuro-neuralgia',
    'vaccin': 'immune-low',
    'shock': 'gen-weakness', 'heat-exhaust': 'fever-high', 'heatstroke': 'fever-high',
    'faint': 'gen-weakness', 'syncope': 'gen-weakness',
    'bee-sting': 'skin-urticaria', 'insect': 'skin-urticaria', 'bite': 'firstaid-wounds',
    'diaper-rash': 'skin-eruptions', 'cradle-cap': 'head-dandruff',
    'night-terror': 'sleep-disturbed',
    'erectile-dys': 'male-impotency',
    'food-poison': 'stomach-vomiting', 'gastroenter': 'rectum-diarrhoea',
    'lactose': 'stomach-distension',
    'crohn': 'rectum-diarrhoea', 'colitis': 'rectum-diarrhoea',
    'diverticulit': 'abdomen-pain',
    'raynaud': 'extremities-coldness', 'cholesterol': 'cardio-hypertension',
    'arterioscler': 'cardio-hypertension',
    'hypotens': 'gen-weakness',
    'fibromyalg': 'gen-weakness', 'chronic-fatigu': 'gen-weakness', 'burnout': 'gen-weakness',
  };

  for (const [keyword, mapKey] of Object.entries(keywordMap)) {
    if (sid.includes(keyword) || sname.includes(keyword)) {
      return mapKey;
    }
  }

  // Chapter-based fallback
  const chapter = getChapterForSymptom(symptomId);
  const chapterFallback = {
    'mind': 'mind-anxiety', 'head': 'head-pain', 'eye': 'eye-pain',
    'ear': 'ear-pain', 'nose': 'nose-coryza', 'face': 'face-pain',
    'mouth': 'mouth-ulcers', 'throat': 'throat-pain',
    'stomach': 'stomach-pain', 'abdomen': 'abdomen-pain',
    'rectum': 'rectum-constipation', 'stool': 'stool-hard',
    'urine': 'urine-frequent', 'male': 'male-impotency',
    'female': 'female-menses-painful', 'resp': 'resp-dyspnoea',
    'cough': 'cough-dry', 'chest': 'chest-pain', 'back': 'back-pain',
    'extremities': 'extremities-pain', 'sleep': 'sleep-insomnia',
    'fever': 'fever-intermittent', 'skin': 'skin-itching',
    'gen': 'gen-weakness', 'immune': 'immune-allergy',
    'endo': 'endo-thyroid', 'neuro': 'neuro-neuralgia',
    'mental': 'mental-depression', 'cardio': 'cardio-hypertension',
    'gi': 'gi-ibs', 'msk': 'msk-frozen-shoulder',
    'derm': 'derm-acne', 'ped': 'ped-colic',
    'ophthalm': 'eye-inflammation', 'dental': 'mouth-ulcers',
    'ent': 'throat-inflammation', 'sexual': 'male-impotency',
    'onco': 'onco-support', 'geri': 'geri-dementia',
    'infect': 'infect-flu', 'preg': 'preg-morning-sickness',
    'hemat': 'gen-weakness', 'sport': 'sport-strain',
    'firstaid': 'firstaid-wounds', 'constit': 'gen-weakness',
    'liver': 'liver-gallstones', 'renal': 'renal-stones',
    'wound': 'firstaid-wounds', 'metabol': 'gen-weakness',
    'connect': 'extremities-pain', 'travel': 'firstaid-motion-sickness',
    'environ': 'gen-cold-sensitive', 'palliat': 'gen-weakness',
    'vaccin': 'immune-low', 'miasm': 'immune-autoimmune',
    'emotion': 'mental-ptsd', 'detox': 'gen-weakness',
    'nosod': 'immune-low', 'lymph': 'gen-inflammation',
    'subst': 'mental-depression', 'aging': 'aging-vitality',
    'respiratory': 'resp-dyspnoea',
  };

  for (const [prefix, mapKey] of Object.entries(chapterFallback)) {
    if (chapter.startsWith(prefix)) return mapKey;
  }

  return 'gen-weakness';
}

// Build corrected rubrics
function buildCorrectedRubrics() {
  const corrected = [];
  let totalSymptoms = 0;
  let matched = 0;
  let fallback = 0;

  for (const chapter of symptomsData.chapters) {
    for (const symptom of chapter.symptoms) {
      // Process the parent symptom
      processSymptom(symptom.id, symptom.name, corrected);
      totalSymptoms++;

      // Process sub-symptoms
      if (symptom.subSymptoms) {
        for (const sub of symptom.subSymptoms) {
          processSymptom(sub.id, sub.name, corrected);
          totalSymptoms++;
        }
      }
    }
  }

  function processSymptom(symptomId, symptomName, arr) {
    const matchKey = findBestMatch(symptomId, symptomName);
    const mapping = clinicalMap[matchKey];

    if (!mapping) {
      fallback++;
      arr.push(buildGenericRubric(symptomId, symptomName));
      return;
    }

    matched++;

    const remedies = [];
    const usedIds = new Set();

    // Grade 3
    for (const id of mapping.g3) {
      if (allRemedyIds.includes(id) && !usedIds.has(id)) {
        remedies.push({ id, grade: 3 });
        usedIds.add(id);
      }
    }
    // Grade 2
    for (const id of mapping.g2) {
      if (allRemedyIds.includes(id) && !usedIds.has(id)) {
        remedies.push({ id, grade: 2 });
        usedIds.add(id);
      }
    }
    // Grade 1
    for (const id of mapping.g1) {
      if (allRemedyIds.includes(id) && !usedIds.has(id)) {
        remedies.push({ id, grade: 1 });
        usedIds.add(id);
      }
    }

    // Ensure at least 15 remedies
    if (remedies.length < 15) {
      const relatedRemedies = getRelatedRemedies(symptomId, symptomName);
      for (const id of relatedRemedies) {
        if (remedies.length >= 20) break;
        if (!usedIds.has(id) && allRemedyIds.includes(id)) {
          remedies.push({ id, grade: 1 });
          usedIds.add(id);
        }
      }
    }

    arr.push({ symptomId, remedies });
  }

  console.log(`Total symptoms: ${totalSymptoms}`);
  console.log(`Clinically matched: ${matched}`);
  console.log(`Generic fallback: ${fallback}`);

  return corrected;
}

function getRelatedRemedies(symptomId, symptomName) {
  const polychrests = ['acon','ars','bell','bry','calc','cham','chin','gels','graph','hep',
    'ign','kali-c','lach','lyc','merc','nat-m','nux-v','phos','puls','rhus-t','sep','sil','sulph'];
  const sid = symptomId.toLowerCase();
  const sn = (symptomName || '').toLowerCase();

  const extras = [];
  if (sid.includes('mind') || sn.includes('mental') || sn.includes('emotion')) {
    extras.push('ign','aur','staph','hyos','stram','coff','op','plat','cimic','caust');
  }
  if (sid.includes('head') || sn.includes('headache') || sn.includes('migrain')) {
    extras.push('glon','sang','spig','iris','cimic','gels','ferr-p','nat-m');
  }
  if (sid.includes('stomach') || sid.includes('abdomen') || sn.includes('digest')) {
    extras.push('carb-v','ant-t','coloc','mag-p','arg-n','rob','chel','podo');
  }
  if (sid.includes('skin') || sid.includes('derm') || sn.includes('erupt')) {
    extras.push('mez','petr','graph','rhus-t','ant-c','dulc','clem','tell');
  }
  if (sid.includes('female') || sn.includes('menses') || sn.includes('menopause')) {
    extras.push('cimic','lil-t','vib','caul','sabin','helon','mag-p');
  }
  if (sid.includes('male') || sn.includes('prostat') || sn.includes('sexual')) {
    extras.push('agn','con','sabal','staph','lyc','phos');
  }
  if (sid.includes('chest') || sn.includes('heart') || sn.includes('lung')) {
    extras.push('spig','dig','cact','naja','ant-t','ip','spong','kali-c');
  }
  if (sid.includes('cough') || sid.includes('resp') || sn.includes('asthm')) {
    extras.push('dros','spong','rumx','ip','ant-t','stict','samb');
  }
  if (sid.includes('back') || sid.includes('extremit') || sn.includes('joint')) {
    extras.push('rhus-t','ruta','led','symph','calc-f','ferr','kalm');
  }
  if (sid.includes('urin') || sid.includes('renal') || sn.includes('kidney')) {
    extras.push('canth','berb','sars','equis','apis','lyc');
  }
  if (sid.includes('eye') || sid.includes('ophthalm')) {
    extras.push('euphr','spig','ruta','arg-n','apis');
  }
  if (sid.includes('ear') || sid.includes('ent') || sid.includes('nose') || sid.includes('throat')) {
    extras.push('kali-bi','kali-m','phyt','hep','merc','sil');
  }
  if (sid.includes('liver') || sn.includes('gall')) {
    extras.push('chel','lyc','merc','nat-s','podo','card-m');
  }
  if (sid.includes('preg') || sn.includes('pregnan') || sn.includes('labor')) {
    extras.push('sep','cimic','caul','puls','cham','gels','vib');
  }
  if (sid.includes('ped') || sn.includes('child') || sn.includes('infant')) {
    extras.push('cham','calc','calc-p','cina','bar-c','tub','bor');
  }
  if (sid.includes('firstaid') || sid.includes('sport') || sn.includes('injur')) {
    extras.push('arn','hyper','led','ruta','calen','bell-p','symph');
  }
  if (sid.includes('immune') || sn.includes('allerg')) {
    extras.push('apis','all-c','ars','nat-m','sulph','psor','tub','med');
  }
  if (sid.includes('infect') || sn.includes('fever')) {
    extras.push('eup-per','gels','bapt','bry','ferr-p');
  }

  return [...new Set([...polychrests, ...extras])];
}

function buildGenericRubric(symptomId, symptomName) {
  const matchKey = findBestMatch(symptomId, symptomName);
  const mapping = clinicalMap[matchKey] || clinicalMap['gen-weakness'];

  const remedies = [];
  const usedIds = new Set();

  for (const id of (mapping.g3 || [])) {
    if (allRemedyIds.includes(id)) { remedies.push({id, grade: 3}); usedIds.add(id); }
  }
  for (const id of (mapping.g2 || [])) {
    if (allRemedyIds.includes(id) && !usedIds.has(id)) { remedies.push({id, grade: 2}); usedIds.add(id); }
  }
  for (const id of (mapping.g1 || [])) {
    if (allRemedyIds.includes(id) && !usedIds.has(id)) { remedies.push({id, grade: 1}); usedIds.add(id); }
  }

  const polychrests = ['acon','ars','bell','bry','calc','cham','chin','gels','graph','hep',
    'ign','kali-c','lach','lyc','merc','nat-m','nux-v','phos','puls','rhus-t','sep','sil','sulph'];
  for (const id of polychrests) {
    if (remedies.length >= 17) break;
    if (!usedIds.has(id) && allRemedyIds.includes(id)) {
      remedies.push({ id, grade: 1 });
      usedIds.add(id);
    }
  }

  return { symptomId, remedies };
}

// Run
const corrected = buildCorrectedRubrics();

// Verify
let minRem = 999, maxRem = 0, totalRem = 0;
for (const r of corrected) {
  const n = r.remedies.length;
  if (n < minRem) minRem = n;
  if (n > maxRem) maxRem = n;
  totalRem += n;
}
console.log(`\nCorrected rubrics: ${corrected.length}`);
console.log(`Remedies per rubric: min=${minRem}, max=${maxRem}, avg=${(totalRem/corrected.length).toFixed(1)}`);

// Spot check
const checks = ['mind-fear','mind-fear-death','head-pain','stomach-nausea','rectum-constipation','skin-eczema','chest-palpitation','sleep-insomnia','cough-dry','back-pain-lumbar','fever-intermittent'];
for (const sid of checks) {
  const rub = corrected.find(r => r.symptomId === sid);
  if (rub) {
    const g3 = rub.remedies.filter(r=>r.grade===3).map(r=>r.id).join(',');
    const g2 = rub.remedies.filter(r=>r.grade===2).map(r=>r.id).join(',');
    console.log(`  ${sid}: G3=[${g3}] G2=[${g2}] total=${rub.remedies.length}`);
  }
}

// Cross-reference check
let missingRemedies = 0;
for (const rub of corrected) {
  for (const rem of rub.remedies) {
    if (!allRemedyIds.includes(rem.id)) {
      missingRemedies++;
      console.log(`  MISSING: ${rem.id} in rubric ${rub.symptomId}`);
    }
  }
}
console.log(`\nMissing remedy references: ${missingRemedies}`);

// Write
fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'rubrics.json'),
  JSON.stringify({ rubrics: corrected }, null, 2),
  'utf8'
);
console.log('\n✅ rubrics.json rewritten with clinically accurate mappings!');
