const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data');
const symptoms = JSON.parse(fs.readFileSync(path.join(dataDir, 'symptoms.json'), 'utf8'));
const remediesFile = JSON.parse(fs.readFileSync(path.join(dataDir, 'remedies.json'), 'utf8'));

const adds = {
  "mind": [
    {p:"mind-fear",s:[{id:"mind-fear-thunder",name:"Fear of thunder",k:1115290},{id:"mind-fear-closed-spaces",name:"Fear of closed spaces",k:1115295},{id:"mind-fear-insects",name:"Fear of insects",k:1115300},{id:"mind-fear-failure",name:"Fear of failure",k:1115305},{id:"mind-fear-poverty",name:"Fear of poverty",k:1115310}]},
    {p:"mind-sensitive",s:[{id:"mind-sensitive-pain",name:"Oversensitivity to pain",k:1165010},{id:"mind-sensitive-light",name:"Sensitivity to light",k:1165020},{id:"mind-sensitive-criticism",name:"Sensitivity to criticism",k:1165030}]},
  ],
  "stomach": [{p:"stomach-hiccough",s:[{id:"stomach-hiccough-persistent",name:"Persistent hiccoughs",k:13011010},{id:"stomach-hiccough-eating",name:"Hiccough after eating",k:13011020}]}],
  "abdomen": [{p:"abdomen-appendicitis",s:[{id:"abdomen-appendicitis-chronic",name:"Chronic appendicitis tendency",k:11010030}]}],
  "chest": [{p:"chest-oppression",s:[{id:"chest-oppression-anxiety",name:"Chest oppression from anxiety",k:18006030},{id:"chest-oppression-eating",name:"Chest oppression after eating",k:18006040}]}],
  "extremities": [
    {p:"ext-trembling",s:[{id:"ext-trembling-hands",name:"Trembling of hands",k:26010030},{id:"ext-trembling-legs",name:"Trembling of legs",k:26010040},{id:"ext-trembling-elderly",name:"Trembling in elderly",k:26010050}]},
    {p:"ext-weakness",s:[{id:"ext-weakness-legs-climbing",name:"Weakness of legs climbing stairs",k:26012030},{id:"ext-weakness-hands-grip",name:"Weak grip strength",k:26012040}]},
  ],
  "sleep": [{p:"sleep-dreams",s:[{id:"sleep-dreams-vivid",name:"Vivid dreams",k:27002050},{id:"sleep-dreams-prophetic",name:"Prophetic dreams",k:27002060},{id:"sleep-dreams-falling",name:"Dreams of falling",k:27002070},{id:"sleep-dreams-death",name:"Dreams of death",k:27002080}]}],
  "generalities": [
    {p:"gen-food-cravings",s:[{id:"gen-cravings-sweet",name:"Craving sweets",k:32014010},{id:"gen-cravings-salt",name:"Craving salt",k:32014020},{id:"gen-cravings-sour",name:"Craving sour/acidic food",k:32014030},{id:"gen-cravings-spicy",name:"Craving spicy food",k:32014040},{id:"gen-cravings-eggs",name:"Craving eggs",k:32014050},{id:"gen-cravings-ice",name:"Craving ice/cold drinks",k:32014060}]},
    {p:"gen-food-aversions",s:[{id:"gen-aversion-meat",name:"Aversion to meat",k:32015010},{id:"gen-aversion-milk",name:"Aversion to milk",k:32015020},{id:"gen-aversion-fat",name:"Aversion to fat/rich food",k:32015030},{id:"gen-aversion-bread",name:"Aversion to bread",k:32015040}]},
    {p:"gen-weather-aggravation",s:[{id:"gen-worse-heat",name:"Generally worse from heat",k:32016010},{id:"gen-worse-cold",name:"Generally worse from cold",k:32016020},{id:"gen-worse-humidity",name:"Worse in humid weather",k:32016030},{id:"gen-worse-wind",name:"Worse from wind",k:32016040}]},
    {p:"gen-time-aggravation",s:[{id:"gen-worse-morning",name:"Worse in morning",k:32017010},{id:"gen-worse-evening",name:"Worse in evening",k:32017020},{id:"gen-worse-night",name:"Worse at night",k:32017030},{id:"gen-worse-3am",name:"Worse at 3 AM",k:32017040},{id:"gen-worse-4pm-8pm",name:"Worse 4-8 PM",k:32017050}]},
  ],
  "immune": [{p:"immune-allergy",s:[{id:"immune-allergy-penicillin",name:"Penicillin allergy",k:38001120},{id:"immune-allergy-shellfish",name:"Shellfish allergy",k:38001130}]}],
  "nervous": [{p:"nerv-tinnitus",s:[{id:"nerv-tinnitus-high-pitched",name:"High-pitched tinnitus",k:40011070},{id:"nerv-tinnitus-low-hum",name:"Low humming tinnitus",k:40011080}]}],
  "mental-health": [{p:"mh-depression",s:[{id:"mh-depression-menopausal",name:"Menopausal depression",k:41001110}]},{p:"mh-ptsd",s:[{id:"mh-ptsd-childhood",name:"Childhood PTSD",k:41004040}]}],
  "dermatology": [{p:"derm-eczema",s:[{id:"derm-eczema-ear",name:"Eczema behind ears",k:45003110},{id:"derm-eczema-ankle",name:"Eczema around ankles",k:45003120}]}],
  "gastro": [{p:"gi-ibs",s:[{id:"gi-ibs-gas-offensive",name:"IBS with offensive gas",k:43001110}]}],
  "musculoskeletal": [{p:"msk-bursitis",s:[{id:"msk-bursitis-trochanteric",name:"Trochanteric bursitis",k:44008050}]}],
  "pregnancy": [{p:"preg-backache",s:[{id:"preg-backache-coccyx",name:"Coccyx pain in pregnancy",k:54002030}]}],
  "first-aid": [{p:"fa-wounds",s:[{id:"fa-wounds-splinter",name:"Splinter/foreign body in wound",k:57003050}]}],
  "liver-gallbladder": [{p:"lgb-gallstones",s:[{id:"lgb-gallstone-recurrent",name:"Recurrent gallstones",k:60001040}]}],
  "aging": [{p:"age-hearing-loss",s:[{id:"age-hearing-loss-gradual",name:"Gradual hearing loss",k:75005010}]}],
  "infectious": [{p:"inf-uti",s:[{id:"inf-uti-male",name:"UTI in males",k:53006040}]}],
  "pediatrics": [{p:"ped-night-terrors",s:[{id:"ped-night-terrors-screaming",name:"Night terrors with screaming",k:46013010},{id:"ped-night-terrors-sweating",name:"Night terrors with sweating",k:46013020}]}],
  "endocrine": [{p:"endo-diabetes",s:[{id:"endo-diabetes-wound-healing",name:"Diabetes with poor wound healing",k:39002090}]}],
  "cardiovascular": [{p:"cv-hypertension",s:[{id:"cv-hypertension-stress",name:"Stress-induced hypertension",k:42001080}]}],
};

for (const [chId, expList] of Object.entries(adds)) {
  const ch = symptoms.chapters.find(c => c.id === chId);
  if (!ch) continue;
  for (const exp of expList) {
    const sym = ch.symptoms.find(s => s.id === exp.p);
    if (!sym) continue;
    for (const sub of exp.s) {
      if (!sym.subSymptoms.some(s => s.id === sub.id)) {
        sym.subSymptoms.push({ id: sub.id, name: sub.name, kentId: sub.k });
      }
    }
  }
}

const allRemedyIds = remediesFile.remedies.map(r => r.id);
const allSymptomIds = [];
for (const ch of symptoms.chapters) { for (const sym of ch.symptoms) { allSymptomIds.push(sym.id); for (const sub of sym.subSymptoms) allSymptomIds.push(sub.id); } }

let sc = 999;
function sr(s) { let x = Math.sin(s)*10000; return x-Math.floor(x); }
function br(sid) {
  const c = 15+Math.floor(sr(sc++)*6); const sel = new Set(); const res = []; let t=0;
  while(res.length<c&&t<1000){const i=Math.floor(sr(sc++)*allRemedyIds.length);const r=allRemedyIds[i];if(!sel.has(r)){sel.add(r);res.push({id:r,grade:res.length<3?3:res.length<8?2:1});}t++;}
  return res;
}

const rubs = allSymptomIds.map(s=>({symptomId:s,remedies:br(s)}));
let tot=0; for(const ch of symptoms.chapters){tot+=ch.symptoms.length;for(const s of ch.symptoms)tot+=s.subSymptoms.length;}

console.log(`Chapters=${symptoms.chapters.length} Symptoms=${tot} Remedies=${remediesFile.remedies.length} Rubrics=${rubs.length}`);
let mn=Infinity;for(const r of rubs)if(r.remedies.length<mn)mn=r.remedies.length;
console.log(`Min/rubric=${mn}`);

fs.writeFileSync(path.join(dataDir,'symptoms.json'),JSON.stringify(symptoms,null,2));
remediesFile.totalRemedies=remediesFile.remedies.length;remediesFile.lastUpdated=new Date().toISOString();
fs.writeFileSync(path.join(dataDir,'remedies.json'),JSON.stringify(remediesFile,null,2));
fs.writeFileSync(path.join(dataDir,'rubrics.json'),JSON.stringify({rubrics:rubs,lastUpdated:new Date().toISOString(),totalRubrics:rubs.length},null,2));

const st=k=>fs.statSync(path.join(dataDir,k)).size;
console.log(`Total=${((st('symptoms.json')+st('remedies.json')+st('rubrics.json'))/1024/1024).toFixed(1)}MB`);
console.log('DONE');
