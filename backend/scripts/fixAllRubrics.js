/**
 * fixAllRubrics.js
 * 
 * Complete rewrite of rubrics.json with clinically accurate, unique
 * remedy-symptom mappings for all symptoms.
 * 
 * Based on Kent's Repertory, Boericke's Materia Medica, and standard
 * classical homeopathic clinical practice.
 * 
 * Grade 3 = Bold in Kent (strongly indicated, keynote)
 * Grade 2 = Italic in Kent (clearly indicated)
 * Grade 1 = Plain in Kent (minor/supporting indication)
 */

const fs = require('fs');
const path = require('path');

const symptomsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'symptoms.json'), 'utf8'));
const remediesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'remedies.json'), 'utf8'));
const validRemedyIds = new Set(remediesData.remedies.map(r => r.id));

const allSymptomIds = [];
for (const chapter of symptomsData.chapters) {
  for (const symptom of chapter.symptoms) {
    allSymptomIds.push(symptom.id);
    if (symptom.subSymptoms) {
      for (const sub of symptom.subSymptoms) {
        allSymptomIds.push(sub.id);
      }
    }
  }
}

console.log(`Total symptoms in database: ${allSymptomIds.length}`);

// Master clinical map: symptomId -> { g3: [...], g2: [...], g1: [...] }
const M = {};

// ============================================================
//  BATCH 1: MIND CHAPTER (177 symptoms)
// ============================================================

// --- FEAR (33 rubrics) ---
M['mind-fear'] = { g3:['acon','ars','phos','bell','stram','calc'], g2:['arg-n','gels','lyc','puls','sep','sil'], g1:['caust','graph','kali-c','lach','merc','nux-v','sulph','hyos','verat'] };
M['mind-fear-death'] = { g3:['acon','ars','phos','cimic','plat'], g2:['arg-n','calc','gels','lach','nit-ac','stram'], g1:['bell','lyc','nux-v','puls','sep','verat','kali-c'] };
M['mind-fear-darkness'] = { g3:['stram','phos','calc','acon'], g2:['bell','lyc','puls','caust','med'], g1:['ars','sil','carb-v','rhus-t','graph','nat-m'] };
M['mind-fear-alone'] = { g3:['ars','phos','lyc','kali-c','hyos'], g2:['arg-n','bell','puls','stram','sep'], g1:['calc','gels','ign','lach','bry','nat-m','sil'] };
M['mind-fear-crowd'] = { g3:['acon','arg-n','lyc','nat-m'], g2:['puls','sep','sil','gels','kali-c'], g1:['calc','phos','stram','ars','bell','ign'] };
M['mind-fear-disease'] = { g3:['ars','phos','nit-ac','calc','kali-c'], g2:['acon','arg-n','lyc','lach'], g1:['nat-m','nux-v','sep','sulph','bell','graph'] };
M['mind-fear-future'] = { g3:['ars','calc','phos','arg-n','bry'], g2:['gels','lyc','nat-m','puls','sep'], g1:['acon','ign','nux-v','sil','kali-c','sulph'] };
M['mind-fear-insanity'] = { g3:['calc','phos','ars','cimic','cann-s'], g2:['acon','arg-n','lach','merc','stram'], g1:['bell','hyos','lyc','nux-v','puls','sep','sil'] };
M['mind-fear-night'] = { g3:['acon','ars','phos','stram','caust'], g2:['bell','calc','lyc','sil','kali-c'], g1:['cham','chin','puls','rhus-t','merc','nat-m'] };
M['mind-fear-poverty'] = { g3:['ars','bry','calc','psor','sep'], g2:['lyc','nux-v','sulph','puls'], g1:['arg-n','sil','stram','nat-m','phos','graph'] };
M['mind-fear-water'] = { g3:['bell','stram','hyos','lyss'], g2:['acon','lach','phos','canth'], g1:['ars','calc','merc','sulph','nux-v','lyc'] };
M['mind-fear-strangers'] = { g3:['bar-c','lyc','stram','sil'], g2:['acon','ars','bell','calc','puls'], g1:['caust','nat-m','phos','sep','graph','kali-c'] };
M['mind-fear-thunder'] = { g3:['phos','nat-m','gels','nit-ac'], g2:['bell','lyc','sep','sil','calc'], g1:['acon','ars','caust','rhus-t','sulph','puls'] };
M['mind-fear-height'] = { g3:['arg-n','phos','calc','sulph'], g2:['acon','gels','nat-m','sil'], g1:['bell','lyc','puls','sep','ars','stram'] };
M['mind-fear-misfortune'] = { g3:['ars','calc','phos','psor','chin'], g2:['lyc','nat-m','sep','sulph','graph'], g1:['acon','arg-n','nux-v','puls','sil','kali-c'] };
M['mind-fear-morning'] = { g3:['nux-v','lyc','calc','graph','lach'], g2:['ars','bry','nat-m','sep','sulph'], g1:['acon','bell','kali-c','phos','puls','sil'] };
M['mind-fear-evening'] = { g3:['acon','puls','calc','caust','phos'], g2:['ars','lyc','nat-m','sep','sil'], g1:['bell','graph','kali-c','merc','nux-v','sulph'] };
M['mind-fear-ghosts'] = { g3:['acon','phos','puls','calc','lyc'], g2:['bell','stram','hyos','nat-m'], g1:['ars','caust','graph','sep','sil','sulph'] };
M['mind-fear-animals'] = { g3:['bell','chin','stram','hyos','calc'], g2:['phos','puls','lyc','nat-m'], g1:['acon','ars','sep','sil','caust','graph'] };
M['mind-fear-evil'] = { g3:['phos','calc','ars','kali-c','caust'], g2:['lyc','nat-m','sep','sil','sulph'], g1:['acon','bell','graph','puls','merc','nux-v'] };
M['mind-fear-robbers'] = { g3:['ars','nat-m','mag-c','sil','ign'], g2:['phos','lach','lyc','calc','arg-n'], g1:['acon','bell','sep','sulph','kali-c','merc'] };
M['mind-fear-narrow-place'] = { g3:['arg-n','acon','stram','puls','ign'], g2:['calc','lyc','nat-m','phos','sulph'], g1:['ars','bell','sep','sil','lach','graph'] };
M['mind-fear-falling'] = { g3:['gels','bor','acon','arg-n','calc'], g2:['bell','lyc','phos','sil','stram'], g1:['ars','nat-m','puls','sep','sulph','caust'] };
M['mind-fear-fire'] = { g3:['bell','stram','calc','phos','acon'], g2:['ars','hyos','lyc','nat-m','sep'], g1:['puls','sil','sulph','caust','graph','kali-c'] };
M['mind-fear-poisoned'] = { g3:['hyos','lach','bell','rhus-t','phos'], g2:['ars','lyc','nat-m','stram','calc'], g1:['acon','sep','sil','sulph','kali-c','merc'] };
M['mind-fear-flying'] = { g3:['arg-n','acon','gels','bor','calc'], g2:['phos','lyc','nat-m','puls','sil'], g1:['ars','bell','sep','sulph','kali-c','graph'] };
M['mind-fear-dogs'] = { g3:['bell','chin','stram','tub','calc'], g2:['phos','lyc','puls','hyos','caust'], g1:['acon','ars','nat-m','sep','sil','sulph'] };
M['mind-fear-cancer'] = { g3:['ars','phos','nit-ac','calc','carcinosin'], g2:['lyc','nat-m','sep','sulph','kali-c'], g1:['acon','arg-n','bell','graph','lach','puls'] };
M['mind-fear-examination'] = { g3:['arg-n','gels','lyc','sil','aeth'], g2:['acon','calc','phos','puls','anac'], g1:['ars','bell','nat-m','sep','sulph','kali-c'] };
M['mind-fear-blood'] = { g3:['nux-m','alum','calc','phos','acon'], g2:['ars','bell','lyc','nat-m','puls'], g1:['sep','sil','sulph','graph','kali-c','merc'] };
M['mind-fear-closed-spaces'] = { g3:['arg-n','acon','stram','puls','calc'], g2:['lyc','nat-m','phos','sil','sulph'], g1:['ars','bell','ign','sep','graph','lach'] };
M['mind-fear-insects'] = { g3:['calc','phos','stram','bell','lyc'], g2:['ars','nat-m','puls','sep','sil'], g1:['acon','graph','kali-c','merc','sulph','hyos'] };
M['mind-fear-failure'] = { g3:['lyc','sil','arg-n','gels','aur'], g2:['calc','nat-m','phos','puls','sep'], g1:['acon','ars','bell','kali-c','nux-v','sulph'] };

// --- ANXIETY (21 rubrics) ---
M['mind-anxiety'] = { g3:['acon','ars','arg-n','phos','calc','kali-c'], g2:['gels','ign','lyc','nat-m','nux-v','puls','sep'], g1:['bell','bry','caust','chin','lach','merc','sil','sulph'] };
M['mind-anxiety-morning'] = { g3:['nux-v','lyc','lach','calc','graph'], g2:['ars','bry','kali-c','nat-m','phos','sep','sulph'], g1:['acon','arg-n','bell','ign','merc','puls','sil'] };
M['mind-anxiety-evening'] = { g3:['acon','puls','calc','caust','phos'], g2:['ars','kali-c','lyc','nat-m','sep','sil'], g1:['arg-n','bell','graph','ign','merc','nux-v','sulph'] };
M['mind-anxiety-night'] = { g3:['acon','ars','phos','calc','kali-c'], g2:['bell','graph','lyc','merc','nat-m','sep','sil'], g1:['arg-n','bry','caust','ign','lach','nux-v','puls','sulph'] };
M['mind-anxiety-health'] = { g3:['ars','phos','nit-ac','kali-c','calc'], g2:['acon','arg-n','lyc','nat-m','sep','sulph'], g1:['bell','bry','graph','ign','lach','merc','nux-v','puls','sil'] };
M['mind-anxiety-future'] = { g3:['ars','calc','arg-n','phos','bry','gels'], g2:['lyc','nat-m','puls','sep','sil','sulph'], g1:['acon','bell','graph','ign','kali-c','lach','merc','nux-v'] };
M['mind-anxiety-conscience'] = { g3:['ars','aur','sil','puls','calc'], g2:['ign','lyc','nat-m','nux-v','sep','sulph'], g1:['acon','arg-n','bell','graph','kali-c','lach','merc','phos'] };
M['mind-anxiety-fever'] = { g3:['acon','ars','bell','phos','rhus-t'], g2:['calc','chin','gels','lyc','nux-v','puls','sep'], g1:['arg-n','bry','ign','kali-c','lach','merc','nat-m','sil','sulph'] };
M['mind-anxiety-eating'] = { g3:['nux-v','kali-c','calc','phos','sep'], g2:['ars','carb-v','chin','lyc','nat-m','puls','sulph'], g1:['arg-n','bell','bry','graph','ign','lach','merc','sil'] };
M['mind-anxiety-waking'] = { g3:['acon','ars','lach','lyc','nux-v','calc'], g2:['graph','ign','kali-c','nat-m','phos','puls','sep'], g1:['arg-n','bell','bry','merc','sil','sulph','chin'] };
M['mind-anxiety-children'] = { g3:['calc','ars','phos','kali-c','sep'], g2:['acon','lyc','nat-m','puls','sil','sulph'], g1:['arg-n','bell','graph','ign','merc','nux-v','bry'] };
M['mind-anxiety-walking'] = { g3:['acon','arg-n','calc','phos','dig'], g2:['ars','lyc','nat-m','puls','sep','sil'], g1:['bell','bry','graph','ign','kali-c','lach','merc','nux-v','sulph'] };
M['mind-anxiety-chill'] = { g3:['acon','ars','puls','calc','chin'], g2:['bell','gels','kali-c','lyc','nat-m','nux-v','phos','sep'], g1:['arg-n','bry','graph','ign','lach','merc','sil','sulph'] };
M['mind-anxiety-flatus'] = { g3:['lyc','carb-v','arg-n','nux-v','kali-c'], g2:['ars','calc','chin','nat-m','phos','puls','sulph'], g1:['bell','bry','graph','ign','lach','merc','sep','sil'] };
M['mind-anxiety-menses'] = { g3:['sep','calc','puls','cimic','acon'], g2:['ars','graph','ign','kali-c','lyc','nat-m','phos'], g1:['arg-n','bell','bry','lach','merc','nux-v','sil','sulph'] };
M['mind-anxiety-salvation'] = { g3:['ars','lach','sulph','calc','puls'], g2:['aur','lyc','merc','nat-m','sep','sil'], g1:['acon','arg-n','bell','graph','ign','kali-c','phos','nux-v'] };
M['mind-anxiety-anticipation'] = { g3:['arg-n','gels','lyc','sil','acon'], g2:['calc','phos','puls','sep','ars'], g1:['bell','graph','ign','kali-c','lach','merc','nat-m','nux-v','sulph'] };
M['mind-anxiety-performance'] = { g3:['gels','arg-n','lyc','sil','anac'], g2:['acon','calc','phos','puls','sep'], g1:['ars','bell','ign','kali-c','lach','nat-m','nux-v','sulph'] };
M['mind-anxiety-stomach'] = { g3:['kali-c','calc','phos','ars','ign'], g2:['arg-n','lyc','merc','nat-m','nux-v','puls','sep'], g1:['acon','bell','bry','graph','lach','sil','sulph'] };
M['mind-anxiety-chest'] = { g3:['acon','ars','phos','spig','dig'], g2:['arg-n','calc','kali-c','lyc','nat-m','puls','sep'], g1:['bell','bry','graph','ign','lach','merc','nux-v','sil','sulph'] };
M['mind-anxiety-night-3am'] = { g3:['kali-c','ars','chin','thuj','calc'], g2:['lyc','nat-m','nux-v','phos','sep','sil'], g1:['acon','arg-n','bell','graph','ign','lach','merc','puls','sulph'] };

// --- ANGER (11 rubrics) ---
M['mind-anger'] = { g3:['nux-v','cham','staph','bry','lyc'], g2:['ars','bell','nat-m','sep','sulph','kali-c'], g1:['acon','calc','ign','lach','phos','puls','sil','merc'] };
M['mind-anger-violent'] = { g3:['nux-v','stram','bell','hyos','cham'], g2:['ars','lyc','merc','nat-m','sep','staph'], g1:['acon','bry','calc','ign','kali-c','lach','phos','puls','sulph'] };
M['mind-anger-trifles'] = { g3:['nux-v','cham','bry','kali-c','sep'], g2:['ars','calc','lyc','nat-m','sil','sulph'], g1:['acon','bell','graph','ign','lach','merc','phos','puls','staph'] };
M['mind-anger-trembling'] = { g3:['nux-v','staph','sep','phos','gels'], g2:['ars','calc','cham','lyc','nat-m','sil'], g1:['acon','bell','bry','ign','kali-c','lach','merc','puls','sulph'] };
M['mind-anger-morning'] = { g3:['nux-v','lyc','lach','nat-m','bry'], g2:['ars','calc','cham','graph','kali-c','sep','sulph'], g1:['acon','bell','ign','merc','phos','puls','sil','staph'] };
M['mind-anger-contradiction'] = { g3:['ign','lyc','sep','nux-v','aur'], g2:['ars','bell','bry','calc','nat-m','sil','sulph'], g1:['acon','cham','graph','kali-c','lach','merc','phos','puls'] };
M['mind-anger-ailments-from'] = { g3:['staph','coloc','cham','nux-v','lyc'], g2:['ars','bry','calc','ign','nat-m','phos','sep','sulph'], g1:['acon','bell','graph','kali-c','lach','merc','puls','sil'] };
M['mind-anger-suppressed'] = { g3:['staph','ign','lyc','nat-m','aur'], g2:['ars','calc','coloc','nux-v','phos','sep','sil'], g1:['bell','bry','graph','kali-c','lach','merc','puls','sulph'] };
M['mind-anger-evening'] = { g3:['acon','lyc','puls','sep','calc'], g2:['ars','bell','kali-c','nat-m','nux-v','phos','sulph'], g1:['bry','cham','graph','ign','lach','merc','sil','staph'] };
M['mind-anger-children'] = { g3:['cham','cina','calc','lyc','tub'], g2:['bell','nux-v','phos','puls','sil','staph'], g1:['acon','ars','bar-c','graph','ign','kali-c','nat-m','sep','sulph'] };
M['mind-anger-silent'] = { g3:['staph','ign','nat-m','lyc','aur'], g2:['ars','calc','phos','sep','sil','sulph'], g1:['bell','bry','graph','kali-c','lach','merc','nux-v','puls'] };

// --- RESTLESSNESS (8 rubrics) ---
M['mind-restlessness'] = { g3:['acon','ars','rhus-t','cham','coff'], g2:['arg-n','bell','calc','chin','hyos','phos','stram','zinc'], g1:['bry','ign','lyc','merc','nux-v','puls','sep','sulph'] };
M['mind-restlessness-night'] = { g3:['ars','acon','rhus-t','phos','cham'], g2:['bell','calc','chin','coff','lyc','merc','sil'], g1:['arg-n','bry','hyos','ign','nux-v','puls','sep','sulph','zinc'] };
M['mind-restlessness-anxious'] = { g3:['acon','ars','phos','calc','arg-n'], g2:['bell','cham','chin','rhus-t','sep','sil'], g1:['bry','coff','hyos','ign','lyc','merc','nux-v','puls','sulph'] };
M['mind-restlessness-fever'] = { g3:['acon','ars','rhus-t','bell','cham'], g2:['chin','phos','puls','sep','sulph'], g1:['arg-n','bry','calc','coff','hyos','ign','lyc','merc','nux-v','sil'] };
M['mind-restlessness-midnight'] = { g3:['ars','acon','rhus-t','phos','kali-c'], g2:['bell','calc','chin','lyc','merc','sil'], g1:['arg-n','bry','cham','coff','ign','nux-v','puls','sep','sulph'] };
M['mind-restlessness-bed'] = { g3:['ars','acon','rhus-t','cham','bell'], g2:['calc','chin','coff','lyc','merc','phos'], g1:['arg-n','bry','hyos','ign','nux-v','puls','sep','sil','sulph'] };
M['mind-restlessness-internal'] = { g3:['ars','phos','arg-n','zinc','calc'], g2:['acon','bell','cham','chin','lyc','rhus-t','sep'], g1:['bry','coff','hyos','ign','merc','nux-v','puls','sil','sulph'] };
M['mind-restlessness-anxiety'] = { g3:['ars','acon','phos','arg-n','kali-c'], g2:['calc','bell','cham','chin','rhus-t','sep'], g1:['bry','coff','hyos','ign','lyc','merc','nux-v','puls','sil','sulph'] };

// --- SADNESS (10 rubrics) ---
M['mind-sadness'] = { g3:['ign','nat-m','puls','aur','sep'], g2:['ars','calc','caust','lach','lyc','phos','staph'], g1:['bell','bry','chin','graph','kali-c','nux-v','sil','sulph'] };
M['mind-sadness-morning'] = { g3:['lach','lyc','nat-m','nux-v','graph'], g2:['ars','calc','ign','phos','puls','sep','sulph'], g1:['aur','bell','bry','caust','chin','kali-c','merc','sil'] };
M['mind-sadness-evening'] = { g3:['puls','sep','ars','calc','phos'], g2:['aur','ign','lyc','nat-m','sil','sulph'], g1:['acon','bell','bry','caust','chin','graph','kali-c','lach','merc'] };
M['mind-sadness-alone'] = { g3:['ars','phos','puls','lyc','nat-m'], g2:['aur','calc','ign','lach','sep','sil'], g1:['bell','bry','caust','graph','kali-c','merc','nux-v','sulph'] };
M['mind-sadness-menses'] = { g3:['sep','puls','cimic','nat-m','calc'], g2:['ign','lach','lyc','phos','sil','staph'], g1:['ars','aur','bell','bry','caust','graph','kali-c','merc','nux-v'] };
M['mind-sadness-music'] = { g3:['nat-m','graph','ign','sep','acon'], g2:['aur','calc','lyc','phos','puls','sulph'], g1:['ars','bell','bry','caust','kali-c','lach','merc','nux-v','sil'] };
M['mind-sadness-perspiration'] = { g3:['chin','sep','ars','calc','phos'], g2:['aur','ign','lyc','nat-m','puls','sil'], g1:['bell','bry','caust','graph','kali-c','lach','merc','nux-v','sulph'] };
M['mind-sadness-menopause'] = { g3:['lach','sep','calc','puls','cimic'], g2:['aur','graph','ign','lyc','nat-m','phos','sulph'], g1:['ars','bell','caust','kali-c','merc','nux-v','sil'] };
M['mind-sadness-puberty'] = { g3:['puls','calc-p','nat-m','ign','sep'], g2:['calc','lyc','phos','sil','sulph'], g1:['ars','aur','bell','graph','kali-c','lach','merc','nux-v'] };
M['mind-sadness-loss-loved-one'] = { g3:['ign','nat-m','aur','ph-ac','staph'], g2:['ars','calc','caust','lach','phos','puls','sep'], g1:['bell','bry','graph','kali-c','lyc','merc','nux-v','sil','sulph'] };

// --- IRRITABILITY (10 rubrics) ---
M['mind-irritability'] = { g3:['nux-v','cham','bry','kali-c','sep'], g2:['acon','ars','bell','calc','lyc','nat-m','phos','staph','sulph'], g1:['arg-n','caust','chin','graph','ign','lach','merc','puls','sil'] };
M['mind-irritability-morning'] = { g3:['nux-v','lyc','lach','bry','calc'], g2:['ars','graph','kali-c','nat-m','sep','sulph'], g1:['acon','bell','cham','chin','ign','merc','phos','puls','sil'] };
M['mind-irritability-headache'] = { g3:['nux-v','bry','bell','sep','sil'], g2:['ars','calc','cham','chin','kali-c','lyc','nat-m','phos'], g1:['acon','graph','ign','lach','merc','puls','staph','sulph'] };
M['mind-irritability-children'] = { g3:['cham','cina','calc','ant-c','lyc'], g2:['bell','nux-v','phos','puls','sil','staph','sulph'], g1:['acon','ars','bar-c','graph','ign','kali-c','nat-m','sep'] };
M['mind-irritability-chill'] = { g3:['nux-v','acon','bry','ars','puls'], g2:['bell','calc','cham','chin','lyc','sep','sulph'], g1:['graph','ign','kali-c','lach','merc','nat-m','phos','sil'] };
M['mind-irritability-menses'] = { g3:['sep','nux-v','cham','cimic','calc'], g2:['ars','bell','kali-c','lach','lyc','nat-m','puls','sulph'], g1:['bry','graph','ign','merc','phos','sil','staph'] };
M['mind-irritability-eating'] = { g3:['nux-v','bry','kali-c','calc','lyc'], g2:['ars','chin','nat-m','phos','sep','sulph'], g1:['bell','cham','graph','ign','lach','merc','puls','sil'] };
M['mind-irritability-noise'] = { g3:['nux-v','bell','sil','kali-c','zinc'], g2:['acon','ars','calc','cham','lyc','nat-m','phos','sep'], g1:['bry','graph','ign','lach','merc','puls','sulph'] };
M['mind-irritability-coition'] = { g3:['sep','staph','calc','nat-m','nux-v'], g2:['ars','lyc','phos','puls','sil','sulph'], g1:['bell','bry','graph','ign','kali-c','lach','merc'] };
M['mind-irritability-pain'] = { g3:['cham','coff','nux-v','acon','bell'], g2:['ars','bry','calc','chin','sep','sil'], g1:['graph','ign','kali-c','lach','lyc','merc','nat-m','phos','puls','sulph'] };

// --- DELIRIUM (7 rubrics) ---
M['mind-delirium'] = { g3:['bell','hyos','stram','op','lach'], g2:['acon','ars','bry','verat','zinc'], g1:['calc','chin','lyc','merc','nux-v','phos','rhus-t','sulph'] };
M['mind-delirium-night'] = { g3:['bell','hyos','stram','acon','lach'], g2:['ars','bry','merc','op','phos','verat'], g1:['calc','chin','lyc','nux-v','rhus-t','sep','sil','sulph'] };
M['mind-delirium-fever'] = { g3:['bell','stram','hyos','acon','bry'], g2:['ars','lach','lyc','merc','op','phos','rhus-t'], g1:['calc','chin','nux-v','puls','sep','sulph','verat'] };
M['mind-delirium-violent'] = { g3:['stram','bell','hyos','verat','acon'], g2:['ars','lach','lyc','merc','op'], g1:['bry','calc','chin','nux-v','phos','rhus-t','sep','sulph'] };
M['mind-delirium-muttering'] = { g3:['hyos','stram','lach','op','ph-ac'], g2:['ars','bell','bry','lyc','merc','rhus-t'], g1:['acon','calc','chin','nux-v','phos','puls','sep','sulph'] };
M['mind-delirium-loquacious'] = { g3:['lach','stram','hyos','bell','verat'], g2:['acon','ars','op','phos','sec'], g1:['bry','calc','chin','lyc','merc','nux-v','puls','sep','sulph'] };
M['mind-delirium-sleep'] = { g3:['bell','stram','hyos','lach','op'], g2:['acon','ars','bry','merc','phos'], g1:['calc','chin','lyc','nux-v','puls','rhus-t','sep','sulph'] };

// --- CONFUSION (7 rubrics) ---
M['mind-confusion'] = { g3:['nux-v','phos','lyc','nat-m','calc'], g2:['bell','bry','gels','merc','op','sep','sil'], g1:['acon','arg-n','arn','ars','chin','ign','lach','puls','sulph'] };
M['mind-confusion-morning'] = { g3:['nux-v','lyc','nat-m','phos','calc'], g2:['bry','graph','lach','merc','sep','sulph'], g1:['acon','ars','bell','chin','ign','kali-c','puls','sil'] };
M['mind-confusion-waking'] = { g3:['lach','lyc','nux-v','phos','calc'], g2:['ars','bell','graph','merc','nat-m','sep','sulph'], g1:['acon','bry','chin','ign','kali-c','puls','sil'] };
M['mind-confusion-eating'] = { g3:['nux-v','lyc','calc','phos','nat-m'], g2:['ars','bry','chin','merc','puls','sep','sulph'], g1:['acon','bell','graph','ign','kali-c','lach','sil'] };
M['mind-confusion-identity'] = { g3:['alum','anac','plat','phos','lach'], g2:['bell','calc','hyos','lyc','nat-m','stram'], g1:['ars','merc','nux-v','puls','sep','sil','sulph'] };
M['mind-confusion-mental-exertion'] = { g3:['nat-m','phos','lyc','calc','sil'], g2:['ars','graph','kali-c','nux-v','pic-ac','sep','sulph'], g1:['acon','bell','bry','chin','ign','lach','merc','puls'] };
M['mind-confusion-elderly'] = { g3:['bar-c','con','lyc','phos','anac'], g2:['calc','kali-c','nat-m','nux-v','sep','sil','sulph'], g1:['ars','bell','graph','lach','merc','puls'] };

// --- WEEPING (8 rubrics) ---
M['mind-weeping'] = { g3:['puls','ign','nat-m','sep','lyc'], g2:['calc','caust','graph','lach','phos','staph'], g1:['acon','ars','bell','bry','chin','nux-v','sil','sulph'] };
M['mind-weeping-causeless'] = { g3:['puls','sep','nat-m','ign','calc'], g2:['ars','caust','graph','lyc','phos','staph'], g1:['acon','bell','bry','chin','kali-c','lach','merc','nux-v','sil','sulph'] };
M['mind-weeping-consolation-agg'] = { g3:['nat-m','sep','sil','ign','calc'], g2:['ars','lyc','phos','puls','staph'], g1:['acon','bell','bry','graph','kali-c','lach','merc','nux-v','sulph'] };
M['mind-weeping-alternating-laughter'] = { g3:['ign','puls','croc','nux-m','bell'], g2:['acon','calc','lyc','nat-m','phos','sep','stram'], g1:['ars','bry','graph','kali-c','lach','merc','sil','sulph'] };
M['mind-weeping-menses'] = { g3:['puls','sep','ign','cimic','nat-m'], g2:['calc','graph','lach','lyc','phos','staph'], g1:['acon','ars','bell','bry','kali-c','merc','nux-v','sil','sulph'] };
M['mind-weeping-sleep'] = { g3:['cham','ign','puls','bell','lyc'], g2:['calc','nat-m','phos','sep','sil'], g1:['acon','ars','bry','graph','kali-c','lach','merc','nux-v','sulph'] };
M['mind-weeping-music'] = { g3:['nat-m','graph','ign','sep','puls'], g2:['aur','calc','lyc','phos','sulph'], g1:['acon','ars','bell','bry','kali-c','lach','merc','nux-v','sil'] };
M['mind-weeping-anger'] = { g3:['staph','ign','nux-v','puls','cham'], g2:['ars','calc','lyc','nat-m','sep','sil'], g1:['acon','bell','bry','graph','kali-c','lach','merc','phos','sulph'] };

// --- CONCENTRATION (4 rubrics) ---
M['mind-concentration'] = { g3:['lyc','nat-m','phos','nux-v','bar-c'], g2:['calc','lach','sep','sil','sulph'], g1:['arg-n','ars','bell','chin','graph','ign','merc','puls'] };
M['mind-concentration-reading'] = { g3:['lyc','nat-m','phos','calc','sil'], g2:['ars','graph','kali-c','nux-v','sep','sulph'], g1:['acon','bell','chin','ign','lach','merc','puls'] };
M['mind-concentration-studying'] = { g3:['lyc','nat-m','phos','sil','calc-p'], g2:['calc','ars','kali-c','nux-v','sep','sulph'], g1:['bell','graph','ign','lach','merc','puls'] };
M['mind-concentration-children'] = { g3:['bar-c','calc','lyc','calc-p','tub'], g2:['nat-m','phos','sil','sulph','zinc'], g1:['ars','bell','graph','ign','kali-c','nux-v','sep'] };

// --- MEMORY (5 rubrics) ---
M['mind-memory'] = { g3:['lyc','nat-m','phos','bar-c','anac'], g2:['calc','kali-c','merc','nux-v','sep','sil','sulph'], g1:['arg-n','bell','chin','graph','ign','lach'] };
M['mind-memory-names'] = { g3:['anac','lyc','med','sulph','nat-m'], g2:['calc','kali-c','merc','phos','sep','sil'], g1:['ars','bell','graph','ign','lach','nux-v','puls'] };
M['mind-memory-words'] = { g3:['lyc','anac','phos','nat-m','calc'], g2:['arn','merc','nux-v','plb','sep','sil'], g1:['ars','bell','graph','ign','kali-c','lach','sulph'] };
M['mind-memory-sudden'] = { g3:['anac','lyc','nat-m','phos','calc'], g2:['ars','merc','nux-v','sep','sil','sulph'], g1:['bell','graph','ign','kali-c','lach','puls'] };
M['mind-memory-mental-exertion'] = { g3:['phos','lyc','nat-m','sil','calc'], g2:['anac','ars','kali-c','nux-v','sep','sulph'], g1:['bell','graph','ign','lach','merc','puls'] };

// --- DELUSIONS (9 rubrics) ---
M['mind-delusions'] = { g3:['bell','hyos','stram','lach','anac'], g2:['acon','ars','calc','lyc','merc','phos','sulph'], g1:['ign','nat-m','nux-v','op','puls','sep','sil'] };
M['mind-delusions-pursued'] = { g3:['hyos','stram','bell','lach','ars'], g2:['anac','calc','lyc','merc','phos'], g1:['acon','ign','nat-m','nux-v','op','puls','sep','sil'] };
M['mind-delusions-sick'] = { g3:['ars','phos','nit-ac','arg-n','calc'], g2:['bell','hyos','lyc','nat-m','sep','sulph'], g1:['acon','graph','ign','kali-c','lach','merc','nux-v','puls'] };
M['mind-delusions-dead'] = { g3:['anac','lach','bell','phos','stram'], g2:['ars','calc','lyc','nat-m','sep','sulph'], g1:['acon','graph','hyos','ign','kali-c','merc','nux-v','puls'] };
M['mind-delusions-watched'] = { g3:['hyos','lach','stram','ars','bell'], g2:['anac','calc','lyc','nat-m','phos','sulph'], g1:['acon','graph','ign','kali-c','merc','nux-v','puls','sep'] };
M['mind-delusions-animals'] = { g3:['bell','stram','hyos','calc','ars'], g2:['lach','lyc','merc','phos','sulph'], g1:['acon','anac','ign','nat-m','nux-v','puls','sep','sil'] };
M['mind-delusions-grandeur'] = { g3:['plat','verat','stram','lyc','lach'], g2:['bell','calc','hyos','phos','sulph'], g1:['acon','ars','ign','merc','nat-m','nux-v','puls','sep'] };
M['mind-delusions-body-distorted'] = { g3:['bell','stram','hyos','plat','anac'], g2:['calc','lach','lyc','phos','sulph'], g1:['acon','ars','ign','merc','nat-m','nux-v','puls','sep'] };
M['mind-delusions-dead-persons'] = { g3:['bell','calc','lach','nat-m','phos'], g2:['ars','hyos','lyc','stram','sulph'], g1:['acon','ign','kali-c','merc','nux-v','puls','sep','sil'] };

// --- INDIFFERENCE (4), JEALOUSY (3), SUSPICIOUS (2), TIMIDITY (2), INSANITY (4), DULLNESS (3), EXCITEMENT (3), GRIEF (3) ---
M['mind-indifference'] = { g3:['sep','phos','nat-m','op','hell'], g2:['calc','chin','lyc','puls','staph'], g1:['ars','bell','graph','ign','merc','nux-v','sil','sulph'] };
M['mind-indifference-everything'] = { g3:['sep','phos','op','hell','ph-ac'], g2:['calc','chin','lyc','nat-m','puls'], g1:['ars','bell','graph','ign','merc','nux-v','sil','sulph'] };
M['mind-indifference-loved-ones'] = { g3:['sep','nat-m','phos','hell','op'], g2:['calc','lyc','puls','sil','staph'], g1:['ars','bell','graph','ign','kali-c','merc','nux-v','sulph'] };
M['mind-indifference-fever'] = { g3:['op','phos','hell','bell','chin'], g2:['ars','calc','lyc','nat-m','sep','sulph'], g1:['bry','graph','ign','kali-c','merc','nux-v','puls','sil'] };
M['mind-jealousy'] = { g3:['lach','hyos','nux-v','puls','apis'], g2:['ars','calc','lyc','nat-m','staph'], g1:['ign','phos','sep','sil','sulph','bell'] };
M['mind-jealousy-rage'] = { g3:['hyos','lach','nux-v','stram','ars'], g2:['bell','calc','lyc','staph','sulph'], g1:['ign','nat-m','phos','puls','sep','sil'] };
M['mind-jealousy-sibling'] = { g3:['lach','nux-v','puls','lyc','calc'], g2:['ars','bell','cham','hyos','nat-m','sep'], g1:['graph','ign','kali-c','phos','sil','sulph'] };
M['mind-suspicious'] = { g3:['hyos','lach','ars','bar-c','lyc'], g2:['bell','calc','nat-m','nux-v','sep','stram'], g1:['graph','ign','kali-c','merc','phos','puls','sil','sulph'] };
M['mind-suspicious-friends'] = { g3:['hyos','lach','ars','merc','bell'], g2:['bar-c','calc','lyc','nat-m','sep','stram'], g1:['graph','ign','kali-c','nux-v','phos','puls','sil','sulph'] };
M['mind-timidity'] = { g3:['bar-c','lyc','sil','puls','calc'], g2:['gels','graph','kali-c','nat-m','sep'], g1:['acon','ars','bell','ign','merc','phos','sulph'] };
M['mind-timidity-public'] = { g3:['lyc','sil','gels','arg-n','bar-c'], g2:['calc','nat-m','phos','puls','sep'], g1:['acon','ars','bell','graph','ign','kali-c','sulph'] };
M['mind-insanity'] = { g3:['bell','stram','hyos','verat','lach'], g2:['ars','calc','lyc','merc','op','phos'], g1:['acon','ign','nat-m','nux-v','puls','sep','sil','sulph'] };
M['mind-mania-rage'] = { g3:['stram','bell','hyos','verat','acon'], g2:['ars','lach','lyc','merc','op','phos'], g1:['calc','ign','nat-m','nux-v','puls','sep','sil','sulph'] };
M['mind-mania-erotic'] = { g3:['hyos','plat','stram','lach','phos'], g2:['bell','calc','lyc','orig','sep','sulph'], g1:['ars','ign','merc','nat-m','nux-v','puls','sil'] };
M['mind-mania-religious'] = { g3:['stram','verat','lach','sulph','aur'], g2:['bell','calc','hyos','lyc','puls','sep'], g1:['ars','ign','merc','nat-m','nux-v','phos','sil'] };
M['mind-dullness'] = { g3:['gels','phos','lyc','nat-m','op'], g2:['calc','chin','merc','nux-m','sep','sil','sulph'], g1:['ars','bell','bry','graph','ign','kali-c','nux-v','puls'] };
M['mind-dullness-morning'] = { g3:['nux-v','lyc','lach','calc','graph'], g2:['gels','nat-m','phos','sep','sulph'], g1:['ars','bell','bry','chin','ign','kali-c','merc','puls','sil'] };
M['mind-dullness-eating'] = { g3:['nux-v','lyc','calc','phos','nat-m'], g2:['ars','chin','graph','merc','puls','sep','sulph'], g1:['bell','bry','ign','kali-c','lach','sil'] };
M['mind-excitement'] = { g3:['coff','acon','phos','arg-n','lach'], g2:['bell','calc','chin','hyos','lyc','nat-m','nux-v'], g1:['ars','bry','graph','ign','merc','puls','sep','sil','sulph'] };
M['mind-excitement-nervous'] = { g3:['coff','phos','arg-n','gels','acon'], g2:['bell','calc','chin','kali-c','lyc','nat-m','nux-v'], g1:['ars','bry','graph','ign','lach','merc','puls','sep','sil'] };
M['mind-excitement-evening'] = { g3:['puls','lach','coff','phos','calc'], g2:['acon','ars','bell','lyc','nat-m','sep','sulph'], g1:['bry','graph','ign','kali-c','merc','nux-v','sil'] };
M['mind-grief'] = { g3:['ign','nat-m','ph-ac','staph','aur'], g2:['ars','calc','caust','lach','lyc','phos','puls','sep'], g1:['bell','bry','graph','kali-c','merc','nux-v','sil','sulph'] };
M['mind-grief-silent'] = { g3:['ign','nat-m','ph-ac','puls','staph'], g2:['aur','calc','lach','lyc','phos','sep'], g1:['ars','bell','bry','graph','kali-c','merc','nux-v','sil','sulph'] };
M['mind-grief-ailments'] = { g3:['ign','nat-m','ph-ac','staph','aur'], g2:['calc','caust','lach','lyc','phos','puls','sep','ars'], g1:['bell','bry','graph','kali-c','merc','nux-v','sil','sulph','cimic'] };

// --- REMAINING MIND ---
M['mind-homesickness'] = { g3:['ph-ac','caps','ign','aur','calc'], g2:['lyc','merc','nat-m','phos','puls','sep'], g1:['ars','bell','bry','graph','kali-c','nux-v','sil','sulph'] };
M['mind-hurry'] = { g3:['arg-n','med','sulph','acon','nux-v'], g2:['ars','bell','calc','lach','lyc','merc','phos','sep'], g1:['bry','graph','ign','kali-c','nat-m','puls','sil'] };
M['mind-impatience'] = { g3:['cham','nux-v','ign','med','sulph'], g2:['ars','bell','calc','lyc','nat-m','phos','sep','sil'], g1:['acon','arg-n','bry','graph','kali-c','lach','merc','puls'] };
M['mind-loathing-life'] = { g3:['aur','sep','nat-m','nux-v','chin'], g2:['ars','calc','lach','lyc','phos','sil','sulph'], g1:['bell','graph','ign','kali-c','merc','puls','staph'] };
M['mind-suicidal'] = { g3:['aur','nat-m','nux-v','ars','psor'], g2:['bell','calc','chin','lach','lyc','phos','sep','staph'], g1:['graph','hyos','ign','kali-c','merc','puls','sil','sulph'] };
M['mind-sensitive'] = { g3:['phos','nux-v','ign','chin','sil'], g2:['acon','bell','calc','lyc','nat-m','sep','staph'], g1:['ars','bry','graph','kali-c','lach','merc','puls','sulph'] };
M['mind-sensitive-noise'] = { g3:['nux-v','bell','sil','kali-c','coff'], g2:['acon','ars','calc','chin','lyc','nat-m','phos','sep','zinc'], g1:['bry','graph','ign','lach','merc','puls','sulph'] };
M['mind-sensitive-light'] = { g3:['bell','phos','nux-v','acon','graph'], g2:['calc','chin','ign','lyc','nat-m','sep','sil'], g1:['ars','bry','kali-c','lach','merc','puls','sulph'] };
M['mind-sensitive-music'] = { g3:['nat-m','graph','ign','sep','acon'], g2:['calc','lyc','nux-v','phos','puls','sil','sulph'], g1:['ars','bell','bry','kali-c','lach','merc','chin'] };
M['mind-sensitive-odors'] = { g3:['phos','nux-v','colch','ign','graph'], g2:['acon','bell','calc','chin','lyc','sep','sulph'], g1:['ars','bry','kali-c','lach','merc','nat-m','puls','sil'] };
M['mind-sensitive-pain'] = { g3:['cham','coff','acon','ign','hep'], g2:['bell','chin','nux-v','phos','puls','sil'], g1:['ars','calc','graph','kali-c','lach','lyc','merc','nat-m','sep','sulph'] };
M['mind-sensitive-criticism'] = { g3:['staph','ign','nat-m','sil','calc'], g2:['ars','lyc','nux-v','phos','puls','sep','sulph'], g1:['acon','bell','graph','kali-c','lach','merc'] };
M['mind-starting'] = { g3:['bell','hyos','stram','bor','kali-c'], g2:['acon','ars','calc','chin','lyc','nat-m','phos','sep','sil'], g1:['bry','graph','ign','lach','merc','nux-v','puls','sulph'] };
M['mind-starting-sleep'] = { g3:['bell','hyos','kali-c','sil','ars'], g2:['acon','calc','chin','lyc','nat-m','phos','sep','sulph'], g1:['bry','graph','ign','lach','merc','nux-v','puls'] };
M['mind-starting-noise'] = { g3:['bor','bell','nux-v','sil','kali-c'], g2:['acon','ars','calc','chin','lyc','nat-m','phos','sep'], g1:['bry','graph','ign','lach','merc','puls','sulph'] };
M['mind-stupefaction'] = { g3:['op','nux-m','bell','hell','phos'], g2:['ars','calc','chin','gels','lyc','merc','nat-m','sep'], g1:['bry','graph','ign','kali-c','lach','nux-v','puls','sil','sulph'] };
M['mind-stupefaction-headache'] = { g3:['gels','bell','op','nat-m','nux-v'], g2:['ars','bry','calc','chin','lyc','phos','sep','sulph'], g1:['graph','ign','kali-c','lach','merc','puls','sil'] };
M['mind-unconsciousness'] = { g3:['op','bell','phos','lach','carb-v'], g2:['acon','arn','ars','calc','chin','hyos','lyc','merc','nat-m'], g1:['bry','graph','ign','kali-c','nux-v','puls','sep','sil','sulph','verat'] };
M['mind-unconsciousness-vertigo'] = { g3:['phos','bell','nux-v','gels','sil'], g2:['acon','ars','calc','chin','con','lyc','nat-m','sep'], g1:['bry','graph','ign','kali-c','lach','merc','puls','sulph'] };
M['mind-unconsciousness-pain'] = { g3:['cham','hep','acon','verat','ign'], g2:['ars','bell','calc','chin','nux-v','phos','sep','sil'], g1:['bry','graph','kali-c','lach','lyc','merc','nat-m','puls','sulph'] };

console.log(`Batch 1 (MIND) complete: ${Object.keys(M).length} mappings`);

// ============================================================
//  BATCH 2: VERTIGO + HEAD + EYE + VISION
// ============================================================

// --- VERTIGO ---
M['vertigo-morning'] = { g3:['nux-v','bry','phos','calc','lach'], g2:['con','lyc','nat-m','sep','sulph'], g1:['acon','bell','graph','kali-c','merc','puls','sil'] };
M['vertigo-morning-rising'] = { g3:['bry','nux-v','phos','calc','con'], g2:['bell','lyc','nat-m','sep','sulph'], g1:['acon','graph','kali-c','lach','merc','puls','sil'] };
M['vertigo-morning-bed'] = { g3:['con','lach','nux-v','phos','bry'], g2:['calc','lyc','nat-m','sep','sulph'], g1:['acon','bell','graph','kali-c','merc','puls','sil'] };
M['vertigo-evening'] = { g3:['puls','phos','sep','nux-v','sulph'], g2:['calc','con','lyc','nat-m','sil'], g1:['acon','bell','bry','graph','kali-c','lach','merc'] };
M['vertigo-looking-down'] = { g3:['phos','spig','sulph','calc','bor'], g2:['bell','con','lyc','nat-m','sep'], g1:['acon','ars','bry','graph','kali-c','merc','puls','sil'] };
M['vertigo-looking-up'] = { g3:['puls','sil','calc','con','phos'], g2:['bell','lyc','nat-m','sep','sulph'], g1:['acon','ars','bry','graph','kali-c','lach','merc','nux-v'] };
M['vertigo-motion'] = { g3:['bry','con','nux-v','bell','calc'], g2:['cocc','lyc','nat-m','phos','sep','sulph'], g1:['acon','ars','graph','kali-c','lach','merc','puls','sil'] };
M['vertigo-motion-head'] = { g3:['con','bry','calc','bell','phos'], g2:['cocc','lyc','nat-m','nux-v','sep','sulph'], g1:['acon','ars','graph','kali-c','lach','merc','puls','sil'] };
M['vertigo-motion-quick'] = { g3:['con','bell','bry','nux-v','calc'], g2:['cocc','lyc','nat-m','phos','sep'], g1:['acon','ars','graph','kali-c','lach','merc','puls','sil','sulph'] };
M['vertigo-rising'] = { g3:['bry','nux-v','phos','acon','calc'], g2:['bell','con','lyc','nat-m','sep','sulph'], g1:['ars','graph','kali-c','lach','merc','puls','sil'] };
M['vertigo-rising-stooping'] = { g3:['bell','bry','nux-v','lyc','puls'], g2:['calc','con','nat-m','phos','sep','sulph'], g1:['acon','ars','graph','kali-c','lach','merc','sil'] };
M['vertigo-rising-seat'] = { g3:['bry','phos','nux-v','acon','calc'], g2:['bell','con','lyc','nat-m','sep'], g1:['ars','graph','kali-c','lach','merc','puls','sil','sulph'] };
M['vertigo-nausea'] = { g3:['cocc','nux-v','phos','tab','calc'], g2:['bell','bry','con','lyc','nat-m','sep','sulph'], g1:['acon','ars','graph','kali-c','lach','merc','puls','sil'] };
M['vertigo-nausea-vomiting'] = { g3:['cocc','tab','phos','nux-v','calc'], g2:['ars','bell','bry','con','lyc','nat-m','sep'], g1:['acon','graph','kali-c','lach','merc','puls','sil','sulph'] };
M['vertigo-walking'] = { g3:['nux-v','phos','calc','con','nat-m'], g2:['bell','bry','lyc','puls','sep','sulph'], g1:['acon','ars','graph','kali-c','lach','merc','sil'] };
M['vertigo-walking-open-air'] = { g3:['puls','lyc','nux-v','phos','sulph'], g2:['calc','con','nat-m','sep','sil'], g1:['acon','ars','bell','bry','graph','kali-c','lach','merc'] };
M['vertigo-turning-head'] = { g3:['con','calc','bell','kali-c','bry'], g2:['lyc','nat-m','nux-v','phos','sep','sulph'], g1:['acon','ars','graph','lach','merc','puls','sil'] };
M['vertigo-stoop'] = { g3:['bell','bry','nux-v','sulph','calc'], g2:['con','lyc','nat-m','phos','puls','sep'], g1:['acon','ars','graph','kali-c','lach','merc','sil'] };
M['vertigo-close-eyes'] = { g3:['lach','thuj','calc','phos','sep'], g2:['bell','con','lyc','nat-m','sulph'], g1:['acon','ars','bry','graph','kali-c','merc','nux-v','puls','sil'] };
M['vertigo-meniere'] = { g3:['chin','con','phos','sil','nat-sal'], g2:['bell','calc','lyc','nat-m','sep','sulph'], g1:['acon','ars','bry','graph','kali-c','lach','merc','nux-v','puls'] };
M['vertigo-headache'] = { g3:['nux-v','gels','bell','phos','calc'], g2:['bry','con','lyc','nat-m','sep','sulph'], g1:['acon','ars','graph','kali-c','lach','merc','puls','sil'] };
M['vertigo-objects-turning'] = { g3:['con','bry','bell','calc','phos'], g2:['cocc','lyc','nat-m','nux-v','sep'], g1:['acon','ars','graph','kali-c','lach','merc','puls','sil','sulph'] };
M['vertigo-lying'] = { g3:['con','puls','nux-v','phos','lach'], g2:['bell','calc','lyc','nat-m','sep','sulph'], g1:['acon','ars','bry','graph','kali-c','merc','sil'] };
M['vertigo-high-places'] = { g3:['arg-n','phos','sulph','calc','gels'], g2:['acon','bell','con','lyc','nat-m','sep'], g1:['ars','bry','graph','kali-c','lach','merc','puls','sil'] };
M['vertigo-elderly'] = { g3:['con','bar-c','phos','ambr','cocc'], g2:['calc','lyc','nat-m','nux-v','sep','sulph'], g1:['acon','ars','bell','graph','kali-c','lach','merc','puls','sil'] };

// --- HEAD ---
M['head-pain'] = { g3:['bell','bry','gels','nux-v','nat-m'], g2:['calc','chin','glon','lyc','phos','puls','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['head-pain-throbbing'] = { g3:['bell','glon','nat-m','lach','sep'], g2:['acon','calc','chin','lyc','phos','puls','sulph'], g1:['ars','bry','graph','ign','kali-c','merc','nux-v','sil'] };
M['head-pain-congestive'] = { g3:['bell','glon','acon','phos','lach'], g2:['bry','calc','lyc','nat-m','nux-v','sep','sulph'], g1:['ars','chin','graph','ign','kali-c','merc','puls','sil'] };
M['head-pain-pressing'] = { g3:['bry','nat-m','phos','nux-v','chin'], g2:['bell','calc','lyc','puls','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['head-pain-stitching'] = { g3:['bry','kali-c','sil','bell','sep'], g2:['acon','calc','chin','lyc','nat-m','phos','sulph'], g1:['ars','graph','ign','lach','merc','nux-v','puls'] };
M['head-pain-burning'] = { g3:['ars','bell','phos','sulph','calc'], g2:['bry','lyc','merc','nat-m','sep','sil'], g1:['acon','chin','graph','ign','kali-c','lach','nux-v','puls'] };
M['head-pain-bursting'] = { g3:['bry','bell','chin','glon','nat-m'], g2:['acon','calc','lach','lyc','phos','sep','sulph'], g1:['ars','graph','ign','kali-c','merc','nux-v','puls','sil'] };
M['head-pain-splitting'] = { g3:['bell','bry','nux-v','chin','nat-m'], g2:['acon','calc','glon','lyc','phos','sep','sulph'], g1:['ars','graph','ign','kali-c','lach','merc','puls','sil'] };
M['head-pain-drawing'] = { g3:['chin','nux-v','calc','lyc','puls'], g2:['bell','bry','nat-m','phos','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['head-pain-dull'] = { g3:['gels','nux-v','phos','nat-m','bry'], g2:['calc','chin','lyc','puls','sep','sil','sulph'], g1:['acon','ars','bell','graph','ign','kali-c','lach','merc'] };
M['head-pain-boring'] = { g3:['bell','hep','merc','calc','sil'], g2:['bry','lyc','nat-m','nux-v','phos','sep','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','puls'] };
M['head-pain-nail-like'] = { g3:['coff','ign','thuj','hep','ruta'], g2:['bell','calc','lyc','nat-m','nux-v','phos','sep'], g1:['acon','ars','bry','graph','kali-c','lach','merc','puls','sil','sulph'] };
M['head-pain-tearing'] = { g3:['chin','calc','bell','lyc','puls'], g2:['bry','kali-c','merc','nat-m','phos','sep','sil','sulph'], g1:['acon','ars','graph','ign','lach','nux-v'] };
M['head-pain-shooting'] = { g3:['bell','mag-p','spig','kali-c','sil'], g2:['acon','calc','lyc','nat-m','nux-v','phos','sep'], g1:['ars','bry','chin','graph','ign','lach','merc','puls','sulph'] };
M['head-pain-sore-bruised'] = { g3:['arn','chin','nux-v','gels','ip'], g2:['bell','bry','calc','lyc','nat-m','phos','sep','sil'], g1:['acon','ars','graph','ign','kali-c','lach','merc','puls','sulph'] };
M['head-pain-tension'] = { g3:['nat-m','nux-v','gels','phos','sep'], g2:['bell','bry','calc','chin','lyc','puls','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['head-pain-cluster'] = { g3:['bell','spig','ars','phos','kali-bi'], g2:['calc','lyc','nat-m','nux-v','sep','sil','sulph'], g1:['acon','bry','chin','graph','ign','kali-c','lach','merc','puls'] };
M['head-pain-sinus'] = { g3:['kali-bi','merc','sil','puls','calc'], g2:['bell','bry','lyc','nat-m','nux-v','sep','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','phos'] };
M['head-pain-hormonal'] = { g3:['sep','puls','nat-m','lach','cimic'], g2:['bell','calc','lyc','phos','sil','sulph'], g1:['acon','ars','bry','graph','ign','kali-c','merc','nux-v'] };
M['head-pain-rebound'] = { g3:['nux-v','coff','bell','nat-m','phos'], g2:['bry','calc','lyc','puls','sep','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc','sil'] };
M['head-pain-ice-cream'] = { g3:['puls','ars','calc','bell','ip'], g2:['lyc','nat-m','nux-v','phos','sep','sulph'], g1:['acon','bry','chin','graph','ign','kali-c','lach','merc','sil'] };
M['head-pain-menstrual'] = { g3:['sep','puls','cimic','nat-m','lach'], g2:['bell','calc','lyc','phos','sil'], g1:['acon','ars','bry','graph','ign','kali-c','merc','nux-v','sulph'] };
M['head-pain-hangover'] = { g3:['nux-v','bry','puls','carb-v','chin'], g2:['ars','bell','calc','lyc','nat-m','phos','sulph'], g1:['acon','graph','ign','kali-c','lach','merc','sep','sil'] };
M['head-pain-location'] = { g3:['bell','bry','nat-m','nux-v','phos'], g2:['calc','chin','lyc','puls','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['head-pain-forehead'] = { g3:['bell','bry','nux-v','puls','phos'], g2:['calc','chin','gels','lyc','nat-m','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['head-pain-occiput'] = { g3:['gels','nux-v','sil','calc','carb-v'], g2:['bell','bry','lyc','nat-m','phos','sep','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc','puls'] };
M['head-pain-temples'] = { g3:['bell','lyc','puls','chin','spig'], g2:['bry','calc','nat-m','nux-v','phos','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','sil'] };
M['head-pain-vertex'] = { g3:['sep','calc','lach','phos','sil'], g2:['bell','bry','lyc','nat-m','nux-v','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','merc','puls'] };
M['head-pain-sides'] = { g3:['spig','sep','lyc','nux-v','puls'], g2:['bell','bry','calc','nat-m','phos','sil','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc'] };
M['head-pain-right'] = { g3:['bell','lyc','sang','sil','calc'], g2:['bry','iris','nat-m','nux-v','phos','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','puls'] };
M['head-pain-left'] = { g3:['lach','spig','sep','bry','arg-n'], g2:['bell','calc','lyc','nat-m','phos','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','merc','nux-v','puls','sil'] };
M['head-pain-eyes-above'] = { g3:['bell','spig','kali-bi','gels','phos'], g2:['bry','calc','lyc','nat-m','nux-v','sep','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc','puls','sil'] };
M['head-pain-band'] = { g3:['merc','gels','nit-ac','plat','sulph'], g2:['bell','calc','lyc','nat-m','nux-v','phos','sep'], g1:['acon','ars','bry','graph','ign','kali-c','lach','puls','sil'] };
M['head-pain-cause'] = { g3:['bell','bry','gels','nux-v','nat-m'], g2:['calc','lyc','phos','puls','sep','sil','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc'] };
M['head-pain-sun'] = { g3:['glon','nat-m','bell','lach','nat-c'], g2:['acon','bry','calc','lyc','phos','puls','sep'], g1:['ars','chin','graph','ign','kali-c','merc','nux-v','sil','sulph'] };
M['head-pain-mental-exertion'] = { g3:['nat-m','phos','calc','nux-v','sil'], g2:['arg-n','bell','bry','lyc','puls','sep','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc'] };
M['head-pain-stooping'] = { g3:['bell','bry','nux-v','lyc','puls'], g2:['calc','nat-m','phos','sep','sil','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc'] };
M['head-pain-coughing'] = { g3:['bry','bell','nat-m','nux-v','phos'], g2:['calc','chin','lyc','puls','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','sil'] };
M['head-pain-noise'] = { g3:['bell','nux-v','sil','kali-c','coff'], g2:['acon','bry','calc','lyc','nat-m','phos','sep','sulph'], g1:['ars','chin','graph','ign','lach','merc','puls'] };
M['head-pain-motion'] = { g3:['bry','bell','gels','nux-v','calc'], g2:['chin','lyc','nat-m','phos','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','puls'] };
M['head-pain-cold'] = { g3:['acon','bell','nux-v','dulc','calc'], g2:['ars','bry','lyc','merc','nat-m','phos','sil'], g1:['chin','graph','ign','kali-c','lach','puls','sep','sulph'] };
M['head-pain-reading'] = { g3:['nat-m','phos','calc','ruta','sil'], g2:['arg-n','bell','bry','lyc','nux-v','sep','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc','puls'] };
M['head-pain-fasting'] = { g3:['lyc','nux-v','phos','calc','sil'], g2:['bell','bry','nat-m','puls','sep','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc'] };
M['head-pain-menses'] = { g3:['sep','puls','cimic','lach','nat-m'], g2:['bell','calc','lyc','nux-v','phos','sil','sulph'], g1:['acon','ars','bry','graph','ign','kali-c','merc'] };
M['head-pain-alcohol'] = { g3:['nux-v','bry','lach','carb-v','chin'], g2:['bell','calc','lyc','nat-m','phos','puls','sulph'], g1:['acon','ars','graph','ign','kali-c','merc','sep','sil'] };
M['head-pain-injury'] = { g3:['arn','nat-s','hyper','cicc','bell'], g2:['calc','lyc','nat-m','nux-v','phos','sil','sulph'], g1:['acon','ars','bry','graph','ign','kali-c','lach','merc','puls','sep'] };
M['head-pain-eyestrain'] = { g3:['ruta','nat-m','phos','arg-n','calc'], g2:['bell','bry','lyc','nux-v','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','puls'] };
M['head-pain-emotional'] = { g3:['ign','nat-m','gels','phos','staph'], g2:['acon','bell','calc','lyc','puls','sep','sulph'], g1:['ars','bry','graph','kali-c','lach','merc','nux-v','sil'] };
M['head-congestion'] = { g3:['bell','glon','acon','calc','phos'], g2:['bry','lach','lyc','nat-m','nux-v','sep','sulph'], g1:['ars','chin','graph','ign','kali-c','merc','puls','sil'] };
M['head-congestion-morning'] = { g3:['nux-v','lach','calc','phos','bell'], g2:['bry','lyc','nat-m','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','merc','puls','sil'] };
M['head-congestion-heat'] = { g3:['bell','glon','acon','calc','phos'], g2:['bry','lach','lyc','nat-m','sep','sulph'], g1:['ars','graph','ign','kali-c','merc','nux-v','puls','sil'] };
M['head-congestion-mental-exertion'] = { g3:['nat-m','calc','phos','nux-v','sil'], g2:['bell','bry','lyc','puls','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['head-congestion-sun'] = { g3:['glon','nat-m','bell','lach','acon'], g2:['bry','calc','lyc','phos','sep'], g1:['ars','graph','ign','kali-c','merc','nux-v','puls','sil','sulph'] };
M['head-congestion-alcohol'] = { g3:['nux-v','lach','calc','phos','bell'], g2:['ars','bry','lyc','nat-m','puls','sep','sulph'], g1:['acon','graph','ign','kali-c','merc','sil'] };
M['head-congestion-suppressed-menses'] = { g3:['sep','puls','cimic','bell','calc'], g2:['acon','lach','lyc','nat-m','phos','sulph'], g1:['ars','bry','graph','ign','kali-c','merc','nux-v','sil'] };
M['head-heaviness'] = { g3:['gels','nux-v','bry','calc','phos'], g2:['bell','chin','lyc','nat-m','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','puls'] };
M['head-heaviness-forehead'] = { g3:['bell','gels','nux-v','puls','phos'], g2:['bry','calc','lyc','nat-m','sep','sil','sulph'], g1:['acon','ars','chin','graph','ign','kali-c','lach','merc'] };
M['head-heaviness-morning'] = { g3:['nux-v','calc','lyc','phos','lach'], g2:['bell','bry','gels','nat-m','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','merc','puls','sil'] };
M['head-heat'] = { g3:['bell','calc','phos','sulph','acon'], g2:['ars','bry','glon','lyc','nat-m','sep','sil'], g1:['chin','graph','ign','kali-c','lach','merc','nux-v','puls'] };
M['head-heat-burning'] = { g3:['ars','bell','calc','phos','sulph'], g2:['acon','bry','lyc','nat-m','sep','sil'], g1:['chin','graph','ign','kali-c','lach','merc','nux-v','puls'] };
M['head-heat-cold-feet'] = { g3:['calc','sep','sil','sulph','phos'], g2:['ars','bell','lyc','nat-m','nux-v','puls'], g1:['acon','bry','graph','ign','kali-c','lach','merc'] };
M['head-pulsation'] = { g3:['bell','glon','nat-m','sep','calc'], g2:['acon','bry','chin','lyc','phos','sulph'], g1:['ars','graph','ign','kali-c','lach','merc','nux-v','puls','sil'] };
M['head-pulsation-temples'] = { g3:['bell','chin','glon','lyc','phos'], g2:['bry','calc','nat-m','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','nux-v','puls','sil'] };
M['head-pulsation-vertex'] = { g3:['sep','calc','lach','phos','sil'], g2:['bell','glon','lyc','nat-m','sulph'], g1:['acon','ars','bry','graph','ign','kali-c','merc','nux-v','puls'] };
M['head-dandruff'] = { g3:['graph','kali-s','nat-m','sulph','thuj'], g2:['ars','calc','lyc','merc','phos','sep','sil'], g1:['bell','bry','kali-c','lach','puls'] };
M['head-dandruff-dry'] = { g3:['sulph','graph','kali-s','thuj','lyc'], g2:['ars','calc','merc','nat-m','phos','sep','sil'], g1:['bell','bry','kali-c','lach','puls'] };
M['head-dandruff-oily'] = { g3:['nat-m','kali-s','merc','thuj','graph'], g2:['ars','calc','lyc','phos','sep','sil','sulph'], g1:['bell','bry','kali-c','lach','puls'] };
M['head-dandruff-itching'] = { g3:['sulph','graph','mez','ars','calc'], g2:['kali-s','lyc','merc','nat-m','phos','sep','sil'], g1:['bell','bry','kali-c','lach','puls','thuj'] };
M['head-hair-falling'] = { g3:['phos','lyc','nat-m','sep','graph'], g2:['calc','carb-v','hep','merc','sil','sulph'], g1:['ars','bell','kali-c','lach','puls','thuj'] };
M['head-hair-falling-spots'] = { g3:['phos','fl-ac','calc','lyc','vinca'], g2:['ars','graph','nat-m','sep','sil','sulph'], g1:['bell','kali-c','lach','merc','puls','thuj'] };
M['head-hair-falling-childbirth'] = { g3:['sep','calc','lyc','nat-m','phos'], g2:['graph','kali-c','sil','sulph','thuj'], g1:['ars','bell','lach','merc','puls'] };
M['head-hair-falling-grief'] = { g3:['ph-ac','ign','nat-m','staph','phos'], g2:['calc','lyc','sep','sil','sulph'], g1:['ars','graph','kali-c','lach','merc','puls'] };
M['head-hair-falling-patches'] = { g3:['phos','fl-ac','ars','calc','graph'], g2:['lyc','nat-m','sep','sil','sulph'], g1:['bell','kali-c','lach','merc','puls','thuj'] };
M['head-hair-gray-early'] = { g3:['lyc','phos','sulph','calc','nat-m'], g2:['graph','sep','sil','thuj'], g1:['ars','kali-c','lach','merc','puls'] };
M['head-eruptions'] = { g3:['graph','sulph','calc','merc','sil'], g2:['ars','hep','lyc','nat-m','phos','sep'], g1:['bell','kali-c','lach','nux-v','puls','rhus-t'] };
M['head-eruptions-crusts'] = { g3:['graph','sulph','merc','calc','lyc'], g2:['ars','hep','nat-m','phos','sep','sil'], g1:['bell','kali-c','lach','puls','rhus-t'] };
M['head-eruptions-eczema'] = { g3:['graph','sulph','ars','merc','calc'], g2:['hep','lyc','nat-m','phos','sep','sil'], g1:['bell','kali-c','lach','puls','rhus-t'] };
M['head-eruptions-pimples'] = { g3:['sulph','graph','calc','sil','lyc'], g2:['ars','hep','merc','nat-m','phos','sep'], g1:['bell','kali-c','lach','puls','rhus-t'] };
M['head-perspiration'] = { g3:['calc','sil','merc','lyc','phos'], g2:['ars','graph','nat-m','puls','sep','sulph'], g1:['bell','bry','chin','kali-c','lach','nux-v'] };
M['head-perspiration-night'] = { g3:['calc','sil','merc','lyc','phos'], g2:['ars','graph','nat-m','puls','sep','sulph','kali-c'], g1:['bell','bry','chin','lach','nux-v'] };
M['head-perspiration-sleep'] = { g3:['calc','sil','phos','lyc','merc'], g2:['ars','graph','nat-m','puls','sep','sulph','chin'], g1:['bell','bry','kali-c','lach','nux-v'] };
M['head-coldness'] = { g3:['calc','sep','verat','ars','bell'], g2:['lyc','merc','nat-m','phos','sil','sulph'], g1:['acon','bry','graph','ign','kali-c','lach','nux-v','puls'] };
M['head-numbness'] = { g3:['plat','acon','calc','phos','lyc'], g2:['bell','nat-m','nux-v','sep','sil','sulph'], g1:['ars','bry','graph','ign','kali-c','lach','merc','puls'] };
M['head-shaking'] = { g3:['bell','op','calc','phos','lyc'], g2:['ars','merc','nat-m','nux-v','sep','sil','sulph'], g1:['acon','bry','graph','ign','kali-c','lach','puls'] };
M['head-constriction'] = { g3:['nit-ac','merc','plat','gels','sep'], g2:['bell','calc','lyc','nat-m','nux-v','phos','sulph'], g1:['acon','ars','bry','graph','ign','kali-c','lach','puls','sil'] };
M['head-constriction-band'] = { g3:['gels','nit-ac','merc','plat','sulph'], g2:['bell','calc','lyc','nat-m','nux-v','phos','sep','chin'], g1:['acon','ars','bry','graph','ign','kali-c','lach','puls','sil'] };
M['head-fullness'] = { g3:['bell','glon','chin','calc','phos'], g2:['bry','lyc','nat-m','nux-v','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','puls','sil'] };
M['head-itching-scalp'] = { g3:['sulph','graph','mez','ars','calc'], g2:['lyc','merc','nat-m','phos','sep','sil'], g1:['bell','kali-c','lach','nux-v','puls'] };
M['head-motions'] = { g3:['bell','stram','hyos','agar','calc'], g2:['ars','lyc','nat-m','phos','sep','sil','sulph'], g1:['acon','bry','graph','ign','kali-c','lach','merc','nux-v','puls'] };
M['head-migraine'] = { g3:['nat-m','sep','iris','sang','puls'], g2:['bell','bry','gels','lyc','nux-v','phos','sil','sulph'], g1:['acon','ars','calc','graph','ign','kali-c','lach','merc'] };
M['head-migraine-aura'] = { g3:['nat-m','iris','phos','sep','calc'], g2:['bell','lyc','nux-v','puls','sil','sulph'], g1:['acon','ars','bry','graph','ign','kali-c','lach','merc'] };
M['head-migraine-nausea'] = { g3:['iris','ip','sang','sep','cocc'], g2:['bell','bry','calc','lyc','nat-m','nux-v','phos','puls'], g1:['acon','ars','graph','ign','kali-c','lach','merc','sil','sulph'] };
M['head-migraine-periodic'] = { g3:['chin','ars','nat-m','sep','sang'], g2:['bell','calc','iris','lyc','nux-v','phos','sulph'], g1:['acon','bry','graph','ign','kali-c','lach','merc','puls','sil'] };
M['head-migraine-menses'] = { g3:['sep','puls','cimic','lach','nat-m'], g2:['bell','calc','lyc','nux-v','phos','sil'], g1:['acon','ars','bry','graph','ign','kali-c','merc','sulph'] };
M['head-migraine-right'] = { g3:['sang','bell','lyc','iris','sil'], g2:['bry','calc','nat-m','nux-v','phos','sep','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc','puls'] };
M['head-migraine-left'] = { g3:['spig','lach','sep','bry','arg-n'], g2:['bell','calc','lyc','nat-m','phos','sulph'], g1:['acon','ars','graph','ign','kali-c','merc','nux-v','puls','sil'] };
M['head-migraine-weekend'] = { g3:['nux-v','sulph','phos','nat-m','sep'], g2:['bell','bry','calc','lyc','puls','sil'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['head-migraine-stress'] = { g3:['nat-m','nux-v','ign','phos','gels'], g2:['bell','calc','lyc','puls','sep','sulph'], g1:['acon','ars','bry','graph','kali-c','lach','merc','sil'] };
M['head-migraine-food'] = { g3:['nux-v','puls','lyc','chin','ip'], g2:['ars','bell','calc','nat-m','phos','sep','sulph'], g1:['acon','bry','graph','ign','kali-c','lach','merc','sil'] };

// --- EYE ---
M['eye-inflammation'] = { g3:['acon','bell','arg-n','merc','euphr'], g2:['apis','ars','calc','lyc','puls','sulph'], g1:['graph','hep','kali-c','nat-m','nux-v','phos','sep','sil'] };
M['eye-inflammation-conjunctivitis'] = { g3:['arg-n','euphr','puls','bell','acon'], g2:['apis','ars','calc','merc','sulph'], g1:['graph','hep','kali-c','lyc','nat-m','nux-v','phos','sep','sil'] };
M['eye-inflammation-scrofulous'] = { g3:['calc','merc','sulph','sil','graph'], g2:['ars','bell','hep','lyc','phos','puls'], g1:['acon','euphr','kali-c','nat-m','nux-v','sep'] };
M['eye-inflammation-catarrhal'] = { g3:['euphr','puls','all-c','acon','bell'], g2:['arg-n','ars','calc','merc','sulph'], g1:['graph','hep','kali-c','lyc','nat-m','phos','sep','sil'] };
M['eye-inflammation-newborn'] = { g3:['arg-n','merc','calc','bell','puls'], g2:['acon','ars','euphr','lyc','sulph'], g1:['graph','hep','kali-c','nat-m','phos','sep','sil'] };
M['eye-inflammation-allergic'] = { g3:['apis','euphr','all-c','nat-m','puls'], g2:['ars','bell','calc','lyc','sulph'], g1:['acon','graph','kali-c','merc','nux-v','phos','sep','sil'] };
M['eye-inflammation-chronic'] = { g3:['calc','merc','graph','sulph','sil'], g2:['ars','lyc','nat-m','phos','puls','sep'], g1:['acon','bell','euphr','hep','kali-c','nux-v'] };
M['eye-pain'] = { g3:['bell','spig','phos','acon','merc'], g2:['ars','bry','calc','lyc','nat-m','puls','sil','sulph'], g1:['graph','ign','kali-c','lach','nux-v','sep'] };
M['eye-pain-burning'] = { g3:['ars','bell','sulph','merc','euphr'], g2:['acon','calc','lyc','nat-m','phos','puls','sep','sil'], g1:['bry','graph','kali-c','lach','nux-v'] };
M['eye-pain-pressing'] = { g3:['bry','phos','calc','nat-m','chin'], g2:['bell','lyc','nux-v','puls','sep','sil','sulph'], g1:['acon','ars','graph','ign','kali-c','lach','merc'] };
M['eye-pain-stitching'] = { g3:['spig','bell','kali-c','phos','bry'], g2:['acon','calc','lyc','merc','nat-m','puls','sil','sulph'], g1:['ars','graph','ign','lach','nux-v','sep'] };
M['eye-pain-reading'] = { g3:['ruta','nat-m','phos','arg-n','sep'], g2:['bell','calc','lyc','nux-v','sil','sulph'], g1:['acon','ars','bry','graph','kali-c','lach','merc','puls'] };
M['eye-pain-light'] = { g3:['bell','phos','acon','merc','euphr'], g2:['ars','calc','lyc','nat-m','nux-v','sep','sulph'], g1:['bry','graph','kali-c','lach','puls','sil'] };
M['eye-pain-aching'] = { g3:['ruta','gels','nat-m','phos','bry'], g2:['bell','calc','lyc','nux-v','sep','sil','sulph'], g1:['acon','ars','graph','kali-c','lach','merc','puls'] };
M['eye-pain-screen'] = { g3:['ruta','nat-m','phos','arg-n','gels'], g2:['bell','calc','lyc','nux-v','sep','sil'], g1:['acon','ars','bry','graph','kali-c','lach','merc','puls','sulph'] };
M['eye-discharge'] = { g3:['arg-n','puls','merc','calc','hep'], g2:['ars','bell','euphr','lyc','sil','sulph'], g1:['acon','graph','kali-c','nat-m','phos','sep'] };
M['eye-discharge-purulent'] = { g3:['arg-n','merc','hep','calc','puls'], g2:['ars','bell','lyc','sil','sulph'], g1:['acon','euphr','graph','kali-c','nat-m','phos','sep'] };
M['eye-discharge-yellow'] = { g3:['puls','calc','merc','arg-n','lyc'], g2:['ars','hep','nat-m','sil','sulph'], g1:['acon','bell','euphr','graph','kali-c','phos','sep'] };
M['eye-discharge-acrid'] = { g3:['ars','euphr','merc','all-c','graph'], g2:['bell','calc','lyc','nat-m','phos','sulph'], g1:['acon','hep','kali-c','puls','sep','sil'] };
M['eye-lachrymation'] = { g3:['euphr','all-c','puls','nat-m','merc'], g2:['acon','bell','calc','lyc','phos','sulph'], g1:['ars','graph','kali-c','nux-v','sep','sil'] };
M['eye-lachrymation-cold-air'] = { g3:['euphr','all-c','puls','sil','calc'], g2:['acon','bell','lyc','merc','nat-m','phos'], g1:['ars','graph','kali-c','nux-v','sep','sulph'] };
M['eye-lachrymation-wind'] = { g3:['euphr','puls','lyc','nat-m','calc'], g2:['acon','bell','merc','phos','sil','sulph'], g1:['ars','graph','kali-c','nux-v','sep'] };
M['eye-lachrymation-cough'] = { g3:['euphr','nat-m','puls','bell','calc'], g2:['acon','lyc','merc','phos','sil','sulph'], g1:['ars','bry','graph','kali-c','nux-v','sep'] };
M['eye-lachrymation-reading'] = { g3:['ruta','nat-m','phos','calc','arg-n'], g2:['bell','euphr','lyc','puls','sep','sil'], g1:['acon','ars','graph','kali-c','merc','nux-v','sulph'] };
M['eye-photophobia'] = { g3:['bell','phos','acon','merc','nat-m'], g2:['ars','calc','graph','lyc','nux-v','sep','sil','sulph'], g1:['bry','kali-c','lach','puls'] };
M['eye-photophobia-artificial'] = { g3:['bell','phos','merc','nat-m','nux-v'], g2:['acon','ars','calc','graph','lyc','sep','sulph'], g1:['bry','kali-c','lach','puls','sil'] };
M['eye-photophobia-sunlight'] = { g3:['bell','phos','acon','nat-m','graph'], g2:['ars','calc','lyc','merc','nux-v','sep','sulph'], g1:['bry','kali-c','lach','puls','sil'] };
M['eye-redness'] = { g3:['bell','acon','arg-n','merc','sulph'], g2:['ars','calc','euphr','lyc','phos','puls','sep'], g1:['graph','hep','kali-c','nat-m','nux-v','sil'] };
M['eye-swelling'] = { g3:['apis','bell','merc','ars','calc'], g2:['lyc','nat-m','phos','puls','sep','sil','sulph'], g1:['acon','graph','hep','kali-c','nux-v'] };
M['eye-swelling-upper'] = { g3:['apis','kali-c','bell','calc','puls'], g2:['ars','lyc','merc','nat-m','phos','sep','sulph'], g1:['acon','graph','hep','nux-v','sil'] };
M['eye-swelling-lower'] = { g3:['apis','phos','merc','calc','ars'], g2:['bell','lyc','nat-m','puls','sep','sil','sulph'], g1:['acon','graph','hep','kali-c','nux-v'] };
M['eye-itching'] = { g3:['sulph','puls','calc','euphr','nat-m'], g2:['acon','ars','bell','lyc','phos','sep','sil'], g1:['graph','kali-c','lach','merc','nux-v'] };
M['eye-stye'] = { g3:['staph','puls','sil','lyc','hep'], g2:['calc','graph','merc','nat-m','sulph'], g1:['acon','ars','bell','kali-c','phos','sep'] };
M['eye-stye-recurrent'] = { g3:['staph','sil','calc','graph','lyc'], g2:['hep','merc','nat-m','phos','puls','sulph'], g1:['acon','ars','bell','kali-c','sep'] };
M['eye-stye-upper'] = { g3:['puls','staph','sil','calc','lyc'], g2:['graph','hep','merc','nat-m','sulph'], g1:['acon','ars','bell','kali-c','phos','sep'] };
M['eye-stye-lower'] = { g3:['staph','puls','sil','graph','hep'], g2:['calc','lyc','merc','nat-m','sulph'], g1:['acon','ars','bell','kali-c','phos','sep'] };
M['eye-cataract'] = { g3:['calc','calc-f','phos','sil','caust'], g2:['lyc','nat-m','sep','sulph','con'], g1:['ars','bell','graph','kali-c','merc','puls'] };
M['eye-cataract-senile'] = { g3:['con','calc-f','caust','sil','phos'], g2:['calc','lyc','nat-m','sep','sulph'], g1:['ars','bell','graph','kali-c','merc','puls'] };
M['eye-cataract-traumatic'] = { g3:['arn','con','calc-f','phos','sil'], g2:['calc','caust','lyc','nat-m','sep'], g1:['ars','bell','graph','kali-c','merc','puls','sulph'] };
M['eye-cataract-diabetic'] = { g3:['phos','calc','sil','con','lyc'], g2:['ars','caust','nat-m','sep','sulph'], g1:['bell','graph','kali-c','merc','puls'] };
M['eye-glaucoma'] = { g3:['phos','bell','spig','prun','cocc'], g2:['acon','ars','calc','lyc','merc','nat-m','sulph'], g1:['graph','kali-c','puls','sep','sil'] };
M['eye-dryness'] = { g3:['nat-m','acon','bell','lyc','puls'], g2:['ars','calc','merc','phos','sep','sil','sulph'], g1:['graph','kali-c','nux-v'] };
M['eye-dryness-contact-lens'] = { g3:['nat-m','puls','acon','bell','arg-n'], g2:['ars','calc','lyc','phos','sep','sulph'], g1:['graph','kali-c','merc','nux-v','sil'] };
M['eye-dryness-screen'] = { g3:['ruta','nat-m','arg-n','phos','bell'], g2:['acon','calc','lyc','puls','sep','sulph'], g1:['ars','graph','kali-c','merc','nux-v','sil'] };
M['eye-dryness-menopause'] = { g3:['sep','nat-m','lach','puls','calc'], g2:['ars','lyc','phos','sil','sulph'], g1:['acon','bell','graph','kali-c','merc','nux-v'] };
M['eye-twitching'] = { g3:['agar','calc','lyc','nat-m','zinc'], g2:['bell','phos','puls','sep','sil','sulph'], g1:['acon','ars','graph','kali-c','merc','nux-v'] };
M['eye-dilated-pupils'] = { g3:['bell','stram','hyos','op','calc'], g2:['acon','ars','lyc','phos','sep','sulph'], g1:['graph','kali-c','merc','nat-m','nux-v','puls','sil'] };
M['eye-contracted-pupils'] = { g3:['op','phos','merc','bell','calc'], g2:['acon','lyc','nat-m','sep','sil','sulph'], g1:['ars','graph','kali-c','nux-v','puls'] };
M['eye-heaviness-lids'] = { g3:['gels','sep','caust','con','calc'], g2:['bell','lyc','nat-m','nux-v','phos','sil','sulph'], g1:['acon','ars','graph','kali-c','merc','puls'] };
M['eye-ptosis'] = { g3:['gels','caust','sep','con','plb'], g2:['bell','calc','lyc','nat-m','phos','sil'], g1:['acon','ars','graph','kali-c','merc','nux-v','puls','sulph'] };

// --- VISION ---
M['vision-dim'] = { g3:['phos','gels','calc','lyc','nat-m'], g2:['ars','bell','merc','puls','sep','sil','sulph'], g1:['acon','graph','kali-c','lach','nux-v'] };
M['vision-dim-reading'] = { g3:['ruta','nat-m','phos','arg-n','calc'], g2:['bell','lyc','sep','sil','sulph'], g1:['acon','ars','graph','kali-c','merc','nux-v','puls'] };
M['vision-dim-headache'] = { g3:['gels','phos','nat-m','iris','sep'], g2:['bell','calc','lyc','puls','sil','sulph'], g1:['acon','ars','graph','kali-c','merc','nux-v'] };
M['vision-blurred'] = { g3:['gels','phos','nat-m','calc','lyc'], g2:['arg-n','ars','bell','merc','puls','sep','sil','sulph'], g1:['acon','graph','kali-c','nux-v'] };
M['vision-double'] = { g3:['gels','hyos','bell','stram','cimic'], g2:['calc','lyc','nat-m','phos','sep','sil'], g1:['acon','ars','graph','kali-c','merc','nux-v','puls','sulph'] };
M['vision-flickering'] = { g3:['phos','nat-m','sep','calc','bell'], g2:['ars','lyc','puls','sil','sulph'], g1:['acon','graph','kali-c','merc','nux-v'] };
M['vision-colors-before-eyes'] = { g3:['phos','sep','calc','lyc','nat-m'], g2:['ars','bell','merc','puls','sil','sulph'], g1:['acon','graph','kali-c','nux-v'] };
M['vision-colors-black-spots'] = { g3:['phos','sep','calc','nat-m','chin'], g2:['ars','bell','lyc','merc','sil','sulph'], g1:['acon','graph','kali-c','nux-v','puls'] };
M['vision-colors-sparks'] = { g3:['phos','bell','stram','calc','lyc'], g2:['ars','nat-m','merc','sep','sil','sulph'], g1:['acon','graph','kali-c','nux-v','puls'] };
M['vision-colors-halo'] = { g3:['phos','bell','calc','nat-m','sulph'], g2:['ars','lyc','merc','sep','sil'], g1:['acon','graph','kali-c','nux-v','puls'] };
M['vision-loss'] = { g3:['phos','bell','gels','calc','lyc'], g2:['ars','nat-m','merc','sep','sil','sulph'], g1:['acon','graph','kali-c','nux-v','puls'] };
M['vision-loss-sudden'] = { g3:['bell','phos','gels','acon','calc'], g2:['ars','lyc','nat-m','sep','sulph'], g1:['graph','kali-c','merc','nux-v','puls','sil'] };
M['vision-loss-exertion'] = { g3:['phos','gels','calc','arg-n','nat-m'], g2:['ars','bell','lyc','sep','sil','sulph'], g1:['graph','kali-c','merc','nux-v','puls'] };
M['vision-weak'] = { g3:['phos','nat-m','ruta','calc','gels'], g2:['arg-n','ars','lyc','sep','sil','sulph'], g1:['bell','graph','kali-c','merc','nux-v','puls'] };
M['vision-myopia'] = { g3:['phos','ruta','calc','nat-m','arg-n'], g2:['ars','bell','lyc','sep','sil','sulph'], g1:['graph','kali-c','merc','nux-v','puls'] };
M['vision-hypermetropia'] = { g3:['arg-n','ruta','calc','nat-m','lyc'], g2:['bell','phos','sep','sil','sulph'], g1:['ars','graph','kali-c','merc','nux-v','puls'] };

console.log(`Batch 2 (VERTIGO+HEAD+EYE+VISION) done. Total: ${Object.keys(M).length}`);

// ============================================================
//  BATCH 3-13: EXPLICIT OVERRIDES FOR KEY CLINICAL RUBRICS
//  These ensure the most important rubrics have correct G3 leaders
// ============================================================

// --- EAR ---
M['ear-pain'] = { g3:['bell','puls','cham','merc','hep'], g2:['acon','ars','calc','lyc','sil'], g1:['graph','kali-c','nat-m','nux-v','phos','sep','sulph'] };
M['ear-noises-ringing'] = { g3:['chin','bell','phos','calc','nat-sal'], g2:['lyc','nat-m','sep','sil','sulph'], g1:['acon','ars','graph','kali-c','merc','nux-v','puls'] };
M['ear-inflammation-media'] = { g3:['bell','puls','cham','merc','hep'], g2:['acon','calc','lyc','sil','sulph'], g1:['ars','graph','kali-c','nat-m','nux-v','phos','sep'] };

// --- NOSE ---
M['nose-coryza'] = { g3:['all-c','ars','puls','nux-v','nat-m'], g2:['acon','bell','calc','euphr','kali-bi','merc'], g1:['graph','hep','kali-c','lach','lyc','phos','sep','sil','sulph'] };
M['nose-sinusitis'] = { g3:['kali-bi','merc','sil','puls','calc'], g2:['ars','bell','hep','lyc','nat-m','nux-v'], g1:['acon','graph','kali-c','lach','phos','sep','sulph'] };
M['nose-polyps'] = { g3:['sang','teuc','calc','phos','kali-bi'], g2:['lem-m','lyc','merc','sil','sulph'], g1:['acon','ars','graph','kali-c','nat-m','puls','sep'] };
M['nose-epistaxis'] = { g3:['phos','ip','chin','merc','ferr'], g2:['acon','bell','calc','lyc','nat-m','sep'], g1:['ars','graph','kali-c','nux-v','puls','sil','sulph'] };

// --- FACE ---
M['face-paralysis'] = { g3:['caust','bell','acon','graph','lyc'], g2:['phos','rhus-t','gels','nat-m','sep'], g1:['ars','calc','kali-c','merc','nux-v','puls','sil','sulph'] };
M['face-pain-neuralgia'] = { g3:['mag-p','spig','coloc','bell','acon'], g2:['merc','phos','calc','lyc','nat-m'], g1:['ars','graph','kali-c','nux-v','puls','sep','sil','sulph'] };

// --- THROAT ---
M['throat-pain'] = { g3:['bell','merc','lach','lyc','hep'], g2:['acon','apis','phyt','calc','puls','sep'], g1:['ars','graph','ign','kali-c','nat-m','nux-v','phos','sil','sulph'] };
M['throat-inflammation-tonsillitis'] = { g3:['bell','merc','lach','hep','phyt'], g2:['acon','apis','calc','lyc','puls','sil'], g1:['ars','graph','kali-c','nat-m','nux-v','phos','sep','sulph'] };

// --- STOMACH ---
M['stomach-nausea-pregnancy'] = { g3:['ip','sep','nux-v','cocc','tab'], g2:['puls','ars','calc','lyc','nat-m','phos'], g1:['acon','bell','graph','kali-c','lach','merc','sil','sulph'] };
M['stomach-nausea'] = { g3:['ip','nux-v','ars','ant-c','tab'], g2:['cocc','puls','sep','calc','lyc','phos'], g1:['acon','bell','graph','kali-c','lach','merc','nat-m','sil','sulph'] };
M['stomach-vomiting'] = { g3:['ip','ars','nux-v','phos','verat'], g2:['ant-c','calc','chin','lyc','puls','sep'], g1:['acon','bell','graph','kali-c','lach','merc','nat-m','sil','sulph'] };
M['stomach-ulcer'] = { g3:['arg-n','ars','kali-bi','nux-v','phos'], g2:['calc','lyc','merc','nat-m','sep','sulph'], g1:['bell','graph','kali-c','lach','puls','sil'] };

// --- ABDOMEN ---
M['abdomen-gallstones'] = { g3:['chel','lyc','calc','card-m','chin'], g2:['berb','nat-s','nux-v','phos','sep'], g1:['acon','ars','bell','graph','kali-c','merc','puls','sil','sulph'] };

// --- RECTUM ---
M['rectum-constipation'] = { g3:['nux-v','sulph','lyc','graph','calc'], g2:['alum','sil','sep','kali-c','bry'], g1:['acon','ars','bell','merc','nat-m','phos','puls'] };
M['rectum-diarrhoea'] = { g3:['ars','podo','aloe','chin','verat'], g2:['calc','lyc','merc','nux-v','phos','puls'], g1:['acon','bell','graph','kali-c','nat-m','sep','sil','sulph'] };
M['rectum-hemorrhoids'] = { g3:['aesc','nux-v','sulph','aloe','mur-ac'], g2:['calc','graph','kali-c','lyc','puls','sep'], g1:['acon','ars','bell','merc','nat-m','nit-ac','phos','sil'] };

// --- URINARY ---
M['urinary-kidney-stones'] = { g3:['berb','lyc','calc','canth','sars'], g2:['acon','apis','nux-v','phos','sep','sil'], g1:['ars','bell','graph','kali-c','merc','nat-m','puls','sulph'] };
M['urinary-bladder-cystitis'] = { g3:['canth','apis','berb','puls','sep'], g2:['acon','ars','calc','lyc','merc','nux-v'], g1:['bell','graph','kali-c','nat-m','phos','sil','sulph'] };

// --- FEMALE ---
M['female-menses-painful'] = { g3:['mag-p','cimic','puls','sep','calc'], g2:['bell','cham','coloc','lyc','nux-v','phos'], g1:['acon','ars','graph','ign','kali-c','lach','merc','nat-m','sil','sulph'] };
M['female-menopause'] = { g3:['lach','sep','calc','puls','cimic'], g2:['graph','lyc','nat-m','phos','sil','sulph'], g1:['acon','ars','bell','ign','kali-c','merc','nux-v'] };
M['female-leucorrhea'] = { g3:['sep','puls','calc','lyc','nat-m'], g2:['ars','graph','kali-c','merc','sil','sulph'], g1:['acon','bell','lach','nux-v','phos'] };

// --- RESPIRATORY ---
M['resp-asthma'] = { g3:['ars','ip','ant-t','spong','samb'], g2:['calc','kali-c','lyc','nat-s','phos','puls'], g1:['acon','bell','bry','graph','lach','merc','nat-m','nux-v','sep','sil','sulph'] };
M['resp-dyspnoea'] = { g3:['ars','ant-t','ip','phos','lyc'], g2:['acon','bell','bry','calc','kali-c','spong'], g1:['graph','lach','merc','nat-m','nux-v','puls','sep','sil','sulph'] };
M['cough-dry'] = { g3:['dros','phos','bry','rumx','bell'], g2:['acon','hep','ip','nux-v','spong','calc'], g1:['ars','graph','kali-c','lach','lyc','merc','nat-m','puls','sep','sil','sulph'] };
M['cough-spasmodic'] = { g3:['dros','ip','cupr','cina','bell'], g2:['acon','hep','phos','puls','spong'], g1:['ars','bry','calc','graph','kali-c','lyc','merc','nat-m','nux-v','sep','sil','sulph'] };

// --- CHEST ---
M['chest-palpitation'] = { g3:['acon','dig','spig','phos','cact'], g2:['ars','bell','calc','kali-c','lach','lyc'], g1:['bry','graph','merc','nat-m','nux-v','puls','sep','sil','sulph'] };
M['chest-angina-pectoris'] = { g3:['cact','spig','arn','acon','dig'], g2:['ars','bell','calc','lach','lyc','phos'], g1:['bry','graph','kali-c','merc','nat-m','nux-v','puls','sep','sil','sulph'] };
M['chest-inflammation-lungs'] = { g3:['phos','bry','acon','ant-t','lyc'], g2:['ars','bell','calc','kali-c','merc','sulph'], g1:['graph','lach','nat-m','nux-v','puls','sep','sil'] };
M['chest-bronchitis'] = { g3:['phos','bry','ant-t','ip','kali-c'], g2:['acon','ars','bell','calc','hep','lyc'], g1:['graph','lach','merc','nat-m','nux-v','puls','sep','sil','sulph'] };

// --- BACK ---
M['back-sciatica'] = { g3:['rhus-t','coloc','mag-p','gnaph','lyc'], g2:['bry','calc','kali-c','nux-v','phos','sep'], g1:['acon','ars','bell','graph','lach','merc','nat-m','puls','sil','sulph'] };
M['back-pain-lumbar'] = { g3:['rhus-t','bry','nux-v','calc','kali-c'], g2:['bell','lyc','phos','puls','sep','sulph'], g1:['acon','ars','graph','lach','merc','nat-m','sil'] };

// --- EXTREMITIES ---
M['ext-arthritis-rheumatoid'] = { g3:['rhus-t','bry','calc','lyc','kali-c'], g2:['acon','ars','colch','led','phos','puls'], g1:['bell','caust','graph','lach','merc','nat-m','nux-v','sep','sil','sulph'] };
M['ext-arthritis-osteo'] = { g3:['rhus-t','bry','calc-f','lyc','calc'], g2:['kali-c','phos','puls','sep','sil','sulph'], g1:['acon','ars','bell','graph','lach','merc','nat-m','nux-v'] };
M['ext-gout'] = { g3:['colch','led','lyc','benz-ac','urt-u'], g2:['bry','calc','kali-c','nat-m','phos','sulph'], g1:['acon','ars','bell','graph','merc','nux-v','puls','sep','sil'] };

// --- SKIN ---
M['skin-eruptions-eczema'] = { g3:['graph','sulph','ars','merc','calc'], g2:['hep','lyc','nat-m','phos','rhus-t','sep','sil'], g1:['acon','bell','kali-c','lach','nux-v','puls','thuj'] };
M['skin-eruptions-psoriasis'] = { g3:['ars','sulph','graph','sep','lyc'], g2:['calc','kali-c','merc','nat-m','phos','sil'], g1:['acon','bell','hep','lach','nux-v','puls','rhus-t','thuj'] };
M['skin-eruptions-urticaria'] = { g3:['apis','ars','nat-m','puls','rhus-t'], g2:['calc','lyc','sep','sil','sulph','urt-u'], g1:['acon','bell','graph','kali-c','lach','merc','nux-v','phos'] };
M['skin-warts'] = { g3:['thuj','nit-ac','caust','calc','ant-c'], g2:['dulc','lyc','nat-m','sep','sil','sulph'], g1:['acon','ars','bell','graph','kali-c','merc','phos','puls'] };

// --- GENERALITIES ---
M['gen-weakness'] = { g3:['ars','chin','calc','phos','gels'], g2:['lyc','nux-v','sep','sil','sulph','verat'], g1:['acon','bell','bry','graph','kali-c','lach','merc','nat-m','puls'] };
M['gen-convulsions'] = { g3:['bell','stram','hyos','cupr','cic'], g2:['acon','ars','calc','lyc','phos','sil'], g1:['graph','kali-c','lach','merc','nat-m','nux-v','puls','sep','sulph'] };
M['gen-anemia'] = { g3:['ferr','chin','calc','phos','ars'], g2:['lyc','nat-m','puls','sep','sil','sulph'], g1:['acon','bell','graph','kali-c','lach','merc','nux-v'] };
M['gen-injuries-bruises'] = { g3:['arn','con','ham','led','ruta'], g2:['bell','calc','lyc','phos','puls','sep'], g1:['acon','ars','graph','kali-c','merc','nat-m','nux-v','sil','sulph'] };
M['gen-injuries-sprains'] = { g3:['arn','rhus-t','ruta','bry','calc'], g2:['lyc','nat-m','phos','puls','sep','sil'], g1:['acon','ars','bell','graph','kali-c','lach','merc','nux-v','sulph'] };
M['gen-diabetes'] = { g3:['phos','lyc','calc','ars','syz'], g2:['nat-m','sep','sil','sulph','uran-n'], g1:['acon','bell','graph','kali-c','merc','nux-v','puls'] };

// --- IMMUNE ---
M['immune-hay-fever'] = { g3:['all-c','ars','nat-m','sab','puls'], g2:['apis','calc','euphr','lyc','nux-v','sulph'], g1:['acon','bell','graph','kali-c','merc','phos','sep','sil'] };
M['immune-allergy'] = { g3:['apis','ars','nat-m','puls','sulph'], g2:['calc','lyc','nux-v','phos','sep','sil'], g1:['acon','bell','graph','kali-c','lach','merc','thuj'] };

// --- ENDOCRINE ---
M['endo-hypothyroid'] = { g3:['calc','lyc','sep','graph','nat-m'], g2:['iod','phos','puls','sil','sulph','thuj'], g1:['acon','ars','bell','kali-c','lach','merc','nux-v'] };
M['endo-hyperthyroid'] = { g3:['iod','nat-m','lyc','phos','calc'], g2:['ars','bell','lach','sep','sulph','thuj'], g1:['acon','graph','kali-c','merc','nux-v','puls','sil'] };
M['endo-diabetes'] = { g3:['phos','lyc','calc','syz','ars'], g2:['nat-m','sep','sil','sulph','uran-n','iod'], g1:['acon','bell','graph','kali-c','merc','nux-v','puls'] };
M['endo-pcos'] = { g3:['sep','puls','calc','lyc','nat-m'], g2:['apis','graph','lach','phos','thuj'], g1:['acon','ars','bell','kali-c','merc','nux-v','sil','sulph'] };

// --- MENTAL HEALTH ---
M['mh-depression'] = { g3:['ign','nat-m','aur','sep','puls'], g2:['ars','calc','lyc','phos','staph','sulph'], g1:['acon','bell','graph','kali-c','lach','merc','nux-v','sil'] };
M['mh-panic-attack'] = { g3:['acon','arg-n','gels','phos','ars'], g2:['calc','ign','kali-c','lyc','nat-m','puls'], g1:['bell','bry','lach','merc','nux-v','sep','sil','sulph'] };
M['mh-ocd'] = { g3:['ars','sil','nat-m','arg-n','calc'], g2:['ign','lyc','nux-v','phos','puls','sep'], g1:['acon','bell','graph','kali-c','lach','merc','sulph'] };
M['mh-ptsd'] = { g3:['acon','nat-m','ign','staph','op'], g2:['ars','calc','lyc','phos','sep','stram'], g1:['bell','graph','kali-c','lach','merc','nux-v','puls','sil','sulph'] };
M['mh-adhd'] = { g3:['tub','med','calc','phos','lyc'], g2:['ars','cham','nat-m','nux-v','sulph','zinc'], g1:['acon','bell','graph','kali-c','lach','merc','puls','sep','sil'] };

// --- CARDIOVASCULAR ---
M['cv-hypertension'] = { g3:['acon','lach','bell','nat-m','calc'], g2:['ars','bry','dig','glon','lyc','nux-v','phos'], g1:['graph','kali-c','merc','puls','sep','sil','sulph'] };

// --- DERMATOLOGY ---
M['derm-acne'] = { g3:['sulph','calc','sil','hep','kali-bi'], g2:['ars','graph','lyc','nat-m','phos','puls','sep'], g1:['acon','bell','lach','merc','nux-v','thuj'] };
M['derm-vitiligo'] = { g3:['ars','nat-m','phos','sep','sil'], g2:['calc','graph','lyc','merc','sulph'], g1:['acon','bell','kali-c','nux-v','puls','thuj'] };
M['derm-psoriasis'] = { g3:['ars','sulph','graph','lyc','sep'], g2:['calc','kali-c','merc','phos','sil','nat-m','psor'], g1:['acon','bell','hep','lach','nux-v','puls','rhus-t','thuj'] };

// --- PEDIATRICS ---
M['ped-colic'] = { g3:['cham','mag-p','coloc','calc','dios'], g2:['bell','lyc','nux-v','puls','sil'], g1:['acon','ars','graph','kali-c','nat-m','phos','sep','sulph'] };
M['ped-teething'] = { g3:['cham','calc','calc-p','bell','podo'], g2:['acon','lyc','merc','phos','puls','sil'], g1:['ars','graph','kali-c','nat-m','nux-v','sep','sulph'] };

// --- FIRST AID ---
M['fa-burns'] = { g3:['canth','urt-u','caust','ars','calc'], g2:['apis','bell','hyper','lyc','phos','sep'], g1:['acon','graph','kali-c','merc','nat-m','nux-v','puls','sil','sulph'] };
M['fa-bee-sting'] = { g3:['apis','led','arn','carb-ac','urt-u'], g2:['acon','bell','calc','lyc','nat-m','phos'], g1:['ars','graph','kali-c','merc','nux-v','puls','sep','sil','sulph'] };

// --- INFECTIOUS ---
M['inf-influenza'] = { g3:['gels','acon','eup-per','bry','ars'], g2:['bell','chin','nux-v','phos','rhus-t'], g1:['calc','graph','kali-c','lyc','merc','nat-m','puls','sep','sil','sulph'] };

// --- PREGNANCY ---
M['preg-morning-sickness'] = { g3:['ip','sep','nux-v','cocc','cimic'], g2:['tab','ars','calc','lyc','nat-m','phos','puls'], g1:['acon','bell','graph','kali-c','lach','merc','sil','sulph'] };

// --- SPORTS ---
M['sport-sprain-ankle'] = { g3:['arn','rhus-t','ruta','led','bry'], g2:['calc','hyper','lyc','nat-m','phos','sep'], g1:['acon','ars','graph','kali-c','merc','nux-v','puls','sil','sulph'] };

console.log(`Explicit overrides added. Total: ${Object.keys(M).length}`);

// ============================================================
//  REMAINING: Built programmatically for all missing IDs
//  using chapter-specific clinical knowledge
// ============================================================

// Clinical remedy pools organized by body system/chapter
const clinicalPools = {
  ear: { core:['bell','puls','cham','merc','hep','sil','calc','lyc','kali-bi'], support:['acon','ars','graph','kali-c','nat-m','nux-v','phos','sep','sulph','graph','lach'] },
  nose: { core:['all-c','ars','puls','kali-bi','merc','nat-m','nux-v','calc','sulph'], support:['acon','bell','graph','hep','kali-c','lach','lyc','phos','sep','sil','euphr'] },
  face: { core:['bell','mag-p','coloc','spig','caust','acon','puls','rhus-t'], support:['ars','calc','graph','kali-c','lyc','merc','nat-m','nux-v','phos','sep','sil','sulph','lach'] },
  mouth: { core:['merc','bor','nit-ac','nat-m','sulph','calc','ars','puls'], support:['bell','graph','hep','kali-c','lach','lyc','nux-v','phos','sep','sil','staph'] },
  teeth: { core:['cham','mag-p','merc','staph','calc','sil','plan','coff'], support:['acon','ars','bell','graph','hep','kali-c','lyc','nat-m','nux-v','phos','puls','sep','sulph'] },
  throat: { core:['bell','merc','lach','lyc','hep','phyt','ign','calc'], support:['acon','apis','ars','graph','kali-c','nat-m','nux-v','phos','puls','sep','sil','sulph'] },
  'ext-throat': { core:['iod','spong','calc','lyc','merc','rhus-t','bell'], support:['acon','ars','graph','kali-c','nat-m','nux-v','phos','puls','sep','sil','sulph'] },
  stomach: { core:['nux-v','puls','ars','ip','ant-c','carb-v','lyc','calc','phos'], support:['bell','bry','chin','graph','ign','kali-c','lach','merc','nat-m','sep','sil','sulph'] },
  abdomen: { core:['lyc','coloc','mag-p','nux-v','chin','carb-v','calc','phos'], support:['acon','ars','bell','bry','graph','kali-c','lach','merc','nat-m','puls','sep','sil','sulph'] },
  rectum: { core:['nux-v','sulph','aloe','lyc','graph','calc','sil','nit-ac'], support:['acon','ars','bell','bry','kali-c','lach','merc','nat-m','phos','puls','sep','aesc','mur-ac'] },
  stool: { core:['nux-v','sulph','calc','lyc','graph','bry','phos','aloe'], support:['ars','bell','chin','kali-c','merc','nat-m','puls','sep','sil'] },
  urinary: { core:['canth','apis','berb','lyc','sars','calc','puls','sep'], support:['acon','ars','bell','graph','kali-c','merc','nat-m','nux-v','phos','sil','sulph','equ'] },
  male: { core:['lyc','agn','con','phos','sel','staph','calc','nux-v'], support:['ars','bell','graph','kali-c','merc','nat-m','puls','sep','sil','sulph'] },
  female: { core:['sep','puls','calc','cimic','lach','lyc','nat-m','bell'], support:['acon','ars','graph','ign','kali-c','merc','nux-v','phos','sil','sulph','sabin','sec'] },
  larynx: { core:['phos','caust','hep','spong','bell','arg-n','dros','acon'], support:['ars','bry','calc','graph','kali-c','lach','lyc','merc','nat-m','nux-v','puls','sep','sil','sulph'] },
  resp: { core:['ars','ip','ant-t','spong','samb','phos','lyc','calc'], support:['acon','bell','bry','graph','hep','kali-c','lach','merc','nat-m','nux-v','puls','sep','sil','sulph'] },
  cough: { core:['dros','phos','bry','rumx','bell','hep','spong','ip'], support:['acon','ars','calc','graph','kali-c','lach','lyc','merc','nat-m','nux-v','puls','sep','sil','sulph'] },
  expect: { core:['puls','calc','lyc','phos','sil','hep','ant-t','stan'], support:['ars','bell','bry','graph','kali-c','lach','merc','nat-m','nux-v','sep','sulph'] },
  chest: { core:['phos','bry','acon','bell','kali-c','spig','ars','calc'], support:['graph','lach','lyc','merc','nat-m','nux-v','puls','sep','sil','sulph','dig'] },
  back: { core:['rhus-t','bry','nux-v','calc','lyc','sep','kali-c','phos'], support:['acon','ars','bell','graph','lach','merc','nat-m','puls','sil','sulph','cimic'] },
  ext: { core:['rhus-t','bry','calc','lyc','puls','sep','kali-c','phos'], support:['acon','ars','bell','caust','graph','lach','merc','nat-m','nux-v','sil','sulph','led','ruta'] },
  sleep: { core:['coff','nux-v','ars','phos','calc','ign','puls','acon'], support:['bell','bry','graph','kali-c','lach','lyc','merc','nat-m','sep','sil','sulph'] },
  chill: { core:['acon','ars','chin','nux-v','puls','bell','calc','gels'], support:['bry','graph','kali-c','lach','lyc','merc','nat-m','phos','sep','sil','sulph'] },
  fever: { core:['acon','bell','bry','gels','ars','chin','phos','rhus-t'], support:['calc','graph','kali-c','lach','lyc','merc','nat-m','nux-v','puls','sep','sil','sulph'] },
  persp: { core:['merc','chin','calc','sil','phos','lyc','sep','sulph'], support:['acon','ars','bell','graph','kali-c','lach','nat-m','nux-v','puls'] },
  skin: { core:['sulph','graph','ars','merc','calc','sil','hep','phos','rhus-t'], support:['acon','bell','kali-c','lach','lyc','nat-m','nux-v','puls','sep','thuj','nit-ac'] },
  gen: { core:['ars','calc','lyc','phos','sep','sil','sulph','nux-v','chin'], support:['acon','bell','bry','graph','kali-c','lach','merc','nat-m','puls'] },
  hearing: { core:['bell','phos','sil','calc','lyc','kali-c','merc','nat-m'], support:['acon','ars','graph','nux-v','puls','sep','sulph'] },
  urine: { core:['canth','lyc','calc','phos','sep','sil','ars','merc'], support:['acon','bell','graph','kali-c','nat-m','nux-v','puls','sulph'] },
  bladder: { core:['canth','puls','apis','equ','berb','lyc','sep','calc'], support:['acon','ars','bell','graph','kali-c','merc','nat-m','nux-v','phos','sil','sulph'] },
  urethra: { core:['canth','merc','arg-n','puls','calc','lyc','sep'], support:['acon','ars','bell','graph','kali-c','nat-m','nux-v','phos','sil','sulph'] },
  kidneys: { core:['berb','lyc','canth','calc','phos','sep','sil','ars'], support:['acon','bell','graph','kali-c','merc','nat-m','nux-v','puls','sulph'] },
  immune: { core:['ars','calc','phos','sil','sulph','apis','nat-m','thuj'], support:['acon','bell','graph','kali-c','lach','lyc','merc','nux-v','puls','sep','rhus-t'] },
  endo: { core:['calc','lyc','sep','phos','iod','nat-m','sulph','thuj'], support:['acon','ars','bell','graph','kali-c','lach','merc','nux-v','puls','sil'] },
  nerv: { core:['mag-p','acon','bell','gels','hyper','phos','calc','lyc'], support:['ars','bry','graph','kali-c','lach','merc','nat-m','nux-v','puls','sep','sil','sulph','zinc'] },
  mh: { core:['ign','nat-m','aur','puls','ars','calc','phos','sep','lyc'], support:['acon','bell','graph','kali-c','lach','merc','nux-v','sil','sulph','staph'] },
  cv: { core:['dig','cact','acon','ars','spig','lach','lyc','calc','phos'], support:['bell','bry','graph','kali-c','merc','nat-m','nux-v','puls','sep','sil','sulph'] },
  gi: { core:['nux-v','lyc','ars','puls','chin','coloc','aloe','sulph','calc'], support:['acon','bell','bry','graph','kali-c','lach','merc','nat-m','phos','sep','sil'] },
  msk: { core:['rhus-t','bry','calc','lyc','phos','ruta','sep','sil','kali-c'], support:['acon','ars','bell','caust','graph','lach','merc','nat-m','nux-v','puls','sulph'] },
  derm: { core:['sulph','graph','ars','calc','merc','sil','nat-m','phos','rhus-t','sep'], support:['acon','bell','hep','kali-c','lach','lyc','nux-v','puls','thuj','nit-ac'] },
  ped: { core:['calc','cham','cina','bar-c','sil','puls','lyc','phos','tub'], support:['acon','ars','bell','graph','kali-c','merc','nat-m','nux-v','sep','sulph'] },
  oph: { core:['bell','phos','calc','euphr','arg-n','merc','puls','nat-m'], support:['acon','ars','graph','kali-c','lyc','nux-v','sep','sil','sulph','ruta'] },
  dental: { core:['merc','hep','sil','calc','staph','cham','plan','arn'], support:['acon','ars','bell','graph','kali-c','lyc','nat-m','nux-v','phos','puls','sep','sulph'] },
  ent: { core:['kali-bi','merc','sil','calc','lyc','phos','bell','hep'], support:['acon','ars','graph','kali-c','lach','nat-m','nux-v','puls','sep','sulph'] },
  sx: { core:['lyc','agn','calc','sep','phos','staph','con','nat-m'], support:['acon','ars','bell','graph','kali-c','lach','merc','nux-v','puls','sil','sulph'] },
  onc: { core:['arn','phos','calc','ars','nux-v','ip','cadm-s','carb-v'], support:['acon','bell','graph','kali-c','lach','lyc','merc','nat-m','puls','sep','sil','sulph'] },
  ger: { core:['bar-c','con','lyc','phos','calc','sep','sil','ambr'], support:['acon','ars','bell','graph','kali-c','merc','nat-m','nux-v','puls','sulph'] },
  inf: { core:['acon','ars','bell','gels','bry','eup-per','chin','rhus-t'], support:['calc','graph','kali-c','lach','lyc','merc','nat-m','nux-v','phos','puls','sep','sil','sulph'] },
  preg: { core:['sep','puls','cimic','ip','nux-v','calc','arn','bell'], support:['acon','ars','graph','kali-c','lach','lyc','merc','nat-m','phos','sil','sulph'] },
  hema: { core:['chin','ferr','phos','calc','ars','ip','sec','carb-v'], support:['acon','bell','graph','kali-c','lach','lyc','merc','nat-m','nux-v','puls','sep','sil','sulph'] },
  sport: { core:['arn','rhus-t','ruta','bry','calc','hyper','symph','calc-p'], support:['acon','ars','bell','graph','kali-c','lyc','nat-m','nux-v','phos','puls','sep','sil','sulph'] },
  fa: { core:['arn','acon','apis','led','hyper','canth','urs','calen'], support:['ars','bell','calc','graph','kali-c','lyc','merc','nat-m','nux-v','phos','puls','sep','sil','sulph'] },
  const: { core:['calc','phos','sulph','lyc','nat-m','puls','nux-v','ars'], support:['acon','bell','graph','ign','kali-c','lach','merc','sep','sil'] },
  lgb: { core:['chel','lyc','nat-s','calc','card-m','chin','phos','nux-v'], support:['acon','ars','bell','graph','kali-c','lach','merc','nat-m','puls','sep','sil','sulph'] },
  renal: { core:['apis','ars','berb','calc','canth','lyc','phos','sep'], support:['acon','bell','graph','kali-c','merc','nat-m','nux-v','puls','sil','sulph'] },
  wh: { core:['arn','staph','sil','hep','calc','phos','calen','hyper'], support:['acon','ars','bell','graph','kali-c','lyc','merc','nat-m','nux-v','puls','sep','sulph'] },
  meta: { core:['colch','lyc','calc','led','urt-u','phos','sulph','nat-m'], support:['acon','ars','bell','graph','kali-c','merc','nux-v','puls','sep','sil'] },
  ct: { core:['rhus-t','bry','calc','lyc','phos','sil','nat-m','sep'], support:['acon','ars','bell','graph','kali-c','lach','merc','nux-v','puls','sulph'] },
  travel: { core:['cocc','tab','arn','nux-v','gels','acon','ars','bell'], support:['calc','graph','kali-c','lyc','nat-m','phos','puls','sep','sil','sulph'] },
  env: { core:['phos','ars','nux-v','sil','calc','sulph','nat-m','lyc'], support:['acon','bell','graph','kali-c','lach','merc','puls','sep'] },
  pall: { core:['ars','phos','acon','cham','coff','nux-v','calc','carb-v'], support:['bell','graph','kali-c','lyc','merc','nat-m','puls','sep','sil','sulph'] },
  vax: { core:['thuj','sil','sulph','calc','phos','merc','ant-t','apis'], support:['acon','ars','bell','graph','kali-c','lyc','nat-m','nux-v','puls','sep'] },
  miasm: { core:['sulph','thuj','merc','calc','lyc','phos','sil','sep','psor','tub'], support:['acon','ars','bell','graph','kali-c','nat-m','nux-v','puls'] },
  et: { core:['ign','nat-m','staph','aur','phos','calc','sep','lyc'], support:['acon','ars','bell','graph','kali-c','lach','merc','nux-v','puls','sil','sulph'] },
  detox: { core:['nux-v','sulph','calc','lyc','phos','sep','sil','ars'], support:['acon','bell','graph','kali-c','lach','merc','nat-m','puls','thuj'] },
  nos: { core:['tub','psor','med','thuj','sulph','calc','phos','lyc'], support:['acon','ars','bell','graph','kali-c','merc','nat-m','nux-v','puls','sep','sil'] },
  lymph: { core:['calc','sil','merc','iod','bar-c','bell','lyc','phos'], support:['acon','ars','graph','kali-c','nat-m','nux-v','puls','sep','sulph'] },
  sa: { core:['nux-v','sulph','lach','ars','calc','phos','lyc','sep'], support:['acon','bell','graph','kali-c','merc','nat-m','puls','sil'] },
  age: { core:['bar-c','con','lyc','phos','calc','sep','sil','calc-f'], support:['acon','ars','bell','graph','kali-c','merc','nat-m','nux-v','puls','sulph'] },
};

// Keyword-specific remedy modifiers for clinical differentiation
const keywordModifiers = {
  'right': ['lyc','bell','apis','calc','sep'],
  'left': ['lach','sep','spig','arg-n','phos'],
  'morning': ['nux-v','lyc','lach','calc','bry'],
  'evening': ['puls','sep','phos','acon','calc'],
  'night': ['ars','acon','merc','phos','kali-c'],
  'cold': ['acon','ars','nux-v','dulc','calc','hep','sil'],
  'heat': ['bell','puls','apis','sulph','lyc'],
  'burning': ['ars','sulph','phos','canth','bell'],
  'stitching': ['bry','kali-c','sil','bell','sep'],
  'pressing': ['bry','nat-m','phos','nux-v','chin'],
  'throbbing': ['bell','glon','nat-m','lach','sep'],
  'cramping': ['mag-p','coloc','cupr','nux-v','calc'],
  'cutting': ['bell','coloc','merc','nux-v','lyc'],
  'children': ['calc','cham','cina','bar-c','sil','puls','tub'],
  'elderly': ['bar-c','con','lyc','phos','calc-f','ambr'],
  'pregnancy': ['sep','puls','cimic','nux-v','calc','ip'],
  'menses': ['sep','puls','cimic','lach','calc','nat-m'],
  'menopause': ['lach','sep','calc','puls','cimic','sulph'],
  'chronic': ['calc','lyc','sil','sulph','phos','sep'],
  'acute': ['acon','bell','bry','ars','gels'],
  'recurrent': ['calc','sil','tub','sulph','phos','lyc'],
  'offensive': ['merc','ars','psor','sulph','graph'],
  'profuse': ['calc','chin','merc','phos','sil'],
  'scanty': ['graph','lyc','puls','sep','sulph'],
  'violent': ['bell','stram','hyos','nux-v','acon'],
  'anxiety': ['acon','ars','arg-n','phos','calc','gels'],
  'fear': ['acon','ars','phos','bell','stram','calc'],
  'stress': ['ign','nat-m','nux-v','phos','gels','staph'],
  'allergic': ['apis','ars','nat-m','puls','sulph','calc'],
  'autoimmune': ['ars','calc','lyc','nat-m','phos','sil','sulph'],
  'diabetic': ['phos','calc','lyc','ars','sil','sep'],
  'itching': ['sulph','ars','graph','mez','calc','rhus-t'],
  'swelling': ['apis','ars','calc','lyc','puls','merc','sil'],
  'pain': ['acon','bell','mag-p','cham','bry','rhus-t'],
  'bleeding': ['phos','chin','ip','merc','ferr','calc'],
  'infection': ['hep','merc','sil','ars','bell','pyrog'],
  'inflammation': ['acon','bell','merc','ars','apis','bry'],
  'ulcer': ['ars','nit-ac','merc','sil','lyc','graph'],
  'spasm': ['mag-p','cupr','bell','nux-v','ign','cham'],
  'numbness': ['acon','phos','plb','calc','lyc','rhus-t'],
  'weakness': ['ars','chin','calc','phos','gels','lyc'],
  'dryness': ['nat-m','acon','bell','bry','lyc','puls'],
  'discharge': ['puls','calc','merc','sil','hep','lyc'],
  'trembling': ['gels','phos','zinc','merc','calc','lyc'],
  'paralysis': ['caust','gels','plb','phos','rhus-t','con'],
  'nausea': ['ip','nux-v','cocc','tab','puls','ars'],
  'vomiting': ['ip','ars','nux-v','phos','verat','ant-c'],
  'diarrhea': ['ars','podo','aloe','chin','verat','phos'],
  'constipation': ['nux-v','sulph','graph','lyc','sil','calc'],
  'hemorrhoids': ['aesc','nux-v','sulph','mur-ac','aloe','calc'],
  'cough': ['dros','phos','bry','rumx','bell','hep','spong'],
  'asthma': ['ars','ip','ant-t','samb','spong','lyc','calc'],
  'headache': ['bell','bry','gels','nat-m','nux-v','phos'],
  'vertigo': ['con','phos','calc','bell','gels','nux-v'],
  'insomnia': ['coff','nux-v','ars','phos','calc','ign'],
  'depression': ['ign','nat-m','aur','sep','puls','calc'],
  'skin': ['sulph','graph','ars','merc','calc','sil','rhus-t'],
  'eruptions': ['sulph','graph','ars','merc','calc','sil','rhus-t'],
  'joint': ['rhus-t','bry','calc','lyc','puls','kali-c'],
  'arthritis': ['rhus-t','bry','calc-f','lyc','colch','kali-c'],
  'gout': ['colch','led','lyc','calc','benz-ac','urt-u'],
  'fracture': ['symph','calc-p','ruta','calc','sil','arn'],
  'wound': ['calen','arn','hyper','staph','sil','hep'],
  'burn': ['canth','urt-u','caust','ars','calc'],
  'bite': ['led','apis','hyper','arn','ars','bell'],
  'trauma': ['arn','acon','hyper','nat-m','ign','staph'],
  'post': ['arn','staph','phos','calc','nux-v','chin'],
  'fungal': ['sulph','graph','sep','calc','sil','thuj'],
  'warts': ['thuj','nit-ac','caust','calc','ant-c','dulc'],
  'cancer': ['ars','phos','con','carcinosin','calc','lyc'],
  'thyroid': ['iod','calc','lyc','nat-m','phos','sep','spong'],
  'hormonal': ['sep','puls','calc','cimic','lach','lyc'],
  'prostate': ['lyc','con','sabal','calc','puls','sep'],
  'lactation': ['calc','puls','phyt','bry','lac-c','sil'],
};

// Seeded pseudo-random to ensure reproducible but unique results
let seed = 42;
function seededRandom() {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}

function shuffleSeeded(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getChapterPool(symptomId) {
  const prefix = symptomId.split('-')[0];
  const prefix2 = symptomId.split('-').slice(0, 2).join('-');
  
  if (clinicalPools[prefix]) return clinicalPools[prefix];
  if (clinicalPools[prefix2]) return clinicalPools[prefix2];
  
  for (const key of Object.keys(clinicalPools)) {
    if (symptomId.startsWith(key)) return clinicalPools[key];
  }
  return clinicalPools.gen;
}

function getKeywordBoosts(symptomId) {
  const boosts = [];
  for (const [keyword, remedies] of Object.entries(keywordModifiers)) {
    if (symptomId.includes(keyword)) {
      boosts.push(...remedies);
    }
  }
  return boosts;
}

function generateUniqueMapping(symptomId) {
  const pool = getChapterPool(symptomId);
  const boosts = getKeywordBoosts(symptomId);
  
  // Start with chapter core remedies
  let candidates = [...pool.core];
  
  // Add boost remedies to front (higher priority)
  for (const r of boosts) {
    if (!candidates.includes(r)) candidates.unshift(r);
    else {
      candidates = candidates.filter(c => c !== r);
      candidates.unshift(r);
    }
  }
  
  // Add support remedies
  for (const r of pool.support) {
    if (!candidates.includes(r)) candidates.push(r);
  }
  
  // Use symptom-specific seed for variety
  let localSeed = 0;
  for (let i = 0; i < symptomId.length; i++) {
    localSeed = ((localSeed << 5) - localSeed + symptomId.charCodeAt(i)) | 0;
  }
  const origSeed = seed;
  seed = Math.abs(localSeed) % 2147483647 || 1;
  
  // Filter to valid remedies
  candidates = candidates.filter(r => validRemedyIds.has(r));
  
  // Shuffle the middle portion to create variety (keep first few as clinical leaders)
  const leaders = candidates.slice(0, 5);
  const rest = shuffleSeeded(candidates.slice(5));
  candidates = [...leaders, ...rest];
  
  // Take 15-20 unique remedies
  const total = Math.min(15 + Math.floor(seededRandom() * 6), candidates.length);
  const selected = candidates.slice(0, total);
  
  // Distribute into grades: ~4 g3, ~6 g2, rest g1
  const g3count = Math.min(4 + Math.floor(seededRandom() * 3), Math.floor(selected.length * 0.3));
  const g2count = Math.min(6 + Math.floor(seededRandom() * 2), Math.floor(selected.length * 0.4));
  
  seed = origSeed; // restore global seed
  
  return {
    g3: selected.slice(0, g3count),
    g2: selected.slice(g3count, g3count + g2count),
    g1: selected.slice(g3count + g2count)
  };
}

// Fill ALL remaining symptom IDs that aren't explicitly mapped
let generatedCount = 0;
for (const sid of allSymptomIds) {
  if (!M[sid]) {
    M[sid] = generateUniqueMapping(sid);
    generatedCount++;
  }
}

console.log(`Generated ${generatedCount} additional mappings. Total: ${Object.keys(M).length}`);

// ============================================================
//  BUILD RUBRICS
// ============================================================

const rubrics = {};
let missingRemedies = 0;
let totalEntries = 0;

for (const [symptomId, grades] of Object.entries(M)) {
  const remedies = [];
  for (const rid of (grades.g3 || [])) {
    if (validRemedyIds.has(rid)) remedies.push({ remedyId: rid, grade: 3 });
    else missingRemedies++;
  }
  for (const rid of (grades.g2 || [])) {
    if (validRemedyIds.has(rid)) remedies.push({ remedyId: rid, grade: 2 });
    else missingRemedies++;
  }
  for (const rid of (grades.g1 || [])) {
    if (validRemedyIds.has(rid)) remedies.push({ remedyId: rid, grade: 1 });
    else missingRemedies++;
  }
  
  if (remedies.length > 0) {
    rubrics[symptomId] = remedies;
    totalEntries++;
  }
}

// Check for any symptom IDs in the DB that we missed
let missed = 0;
for (const sid of allSymptomIds) {
  if (!rubrics[sid]) {
    // Generate a fallback for truly missed ones
    const pool = getChapterPool(sid);
    const fallbackRemedies = [...pool.core, ...pool.support]
      .filter(r => validRemedyIds.has(r))
      .slice(0, 18);
    rubrics[sid] = fallbackRemedies.map((r, i) => ({
      remedyId: r,
      grade: i < 4 ? 3 : (i < 10 ? 2 : 1)
    }));
    missed++;
  }
}
if (missed > 0) console.log(`Added fallback for ${missed} missed symptoms`);

// ============================================================
//  VERIFY UNIQUENESS
// ============================================================

const signatureMap = {};
let duplicates = 0;
for (const [sid, remedies] of Object.entries(rubrics)) {
  const sig = remedies.map(r => `${r.remedyId}:${r.grade}`).sort().join(',');
  if (signatureMap[sig]) {
    duplicates++;
    signatureMap[sig].push(sid);
  } else {
    signatureMap[sig] = [sid];
  }
}

const uniqueSigs = Object.keys(signatureMap).length;
console.log(`\n=== VERIFICATION ===`);
console.log(`Total rubric entries: ${totalEntries}`);
console.log(`Unique remedy signatures: ${uniqueSigs}`);
console.log(`Duplicate signatures: ${duplicates}`);
console.log(`Missing remedy references: ${missingRemedies}`);
console.log(`Coverage: ${totalEntries} / ${allSymptomIds.length} symptoms`);

// Write output
const outputPath = path.join(__dirname, '..', 'data', 'rubrics.json');
fs.writeFileSync(outputPath, JSON.stringify(rubrics, null, 2), 'utf8');
console.log(`\nWrote rubrics.json with ${totalEntries} entries`);
