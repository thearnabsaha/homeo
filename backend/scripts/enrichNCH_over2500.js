const fs=require('fs'),path=require('path');
const d=path.join(__dirname,'..','data');
const sy=JSON.parse(fs.readFileSync(path.join(d,'symptoms.json'),'utf8'));
const re=JSON.parse(fs.readFileSync(path.join(d,'remedies.json'),'utf8'));

const a={
  "mind":[{p:"mind-weeping",s:[{id:"mind-weeping-anger",n:"Weeping from anger",k:1180090},{id:"mind-weeping-sleep",n:"Weeping in sleep",k:1180100}]},
    {p:"mind-restlessness",s:[{id:"mind-restlessness-night",n:"Restlessness at night",k:1140010},{id:"mind-restlessness-bed",n:"Restlessness tossing in bed",k:1140020},{id:"mind-restlessness-anxiety",n:"Anxious restlessness",k:1140030}]}],
  "head":[{p:"head-pain-throbbing",s:[{id:"head-pain-throbbing-temples",n:"Throbbing in temples",k:3008040},{id:"head-pain-throbbing-vertex",n:"Throbbing at vertex",k:3008050}]}],
  "stomach":[{p:"stomach-thirst",s:[{id:"stomach-thirst-large-quantity",n:"Thirst for large quantities",k:13013010},{id:"stomach-thirst-small-sips",n:"Thirst for small sips",k:13013020},{id:"stomach-thirst-ice-cold",n:"Thirst for ice-cold water",k:13013030},{id:"stomach-thirstless",n:"Complete absence of thirst",k:13013040}]}],
  "generalities":[
    {p:"gen-periodicity",s:[{id:"gen-periodic-daily",n:"Daily periodicity of symptoms",k:32018010},{id:"gen-periodic-weekly",n:"Weekly periodicity",k:32018020},{id:"gen-periodic-annual",n:"Annual periodicity",k:32018030}]},
    {p:"gen-laterality",s:[{id:"gen-left-to-right",n:"Symptoms moving left to right",k:32023010},{id:"gen-right-to-left",n:"Symptoms moving right to left",k:32023020},{id:"gen-alternating-sides",n:"Symptoms alternating sides",k:32023030}]},
    {p:"gen-convalescence",s:[{id:"gen-conval-slow",n:"Slow convalescence",k:32025010},{id:"gen-conval-relapse",n:"Tendency to relapse",k:32025020}]},
  ],
  "skin":[{p:"skin-dryness",s:[{id:"skin-dryness-winter",n:"Skin dryness worse in winter",k:31008010},{id:"skin-dryness-cracking",n:"Dry cracking skin",k:31008020},{id:"skin-dryness-elderly",n:"Dry skin in elderly",k:31008030}]}],
  "female":[{p:"female-menses-painful",s:[{id:"female-dysmenorrhea-spasmodic",n:"Spasmodic dysmenorrhea",k:19004060},{id:"female-dysmenorrhea-membranous",n:"Membranous dysmenorrhea",k:19004070}]}],
  "sleep":[{p:"sleep-position",s:[{id:"sleep-position-left",n:"Can only sleep on left side",k:27007010},{id:"sleep-position-back",n:"Can only sleep on back",k:27007020},{id:"sleep-position-abdomen",n:"Sleeps on abdomen",k:27007030}]}],
  "nervous":[{p:"nerv-neuralgia",s:[{id:"nerv-neuralgia-weather",n:"Neuralgia worse in weather change",k:40001070}]}],
  "respiratory":[{p:"resp-asthma",s:[{id:"resp-asthma-midnight",n:"Asthma worse at midnight",k:24001090},{id:"resp-asthma-autumn",n:"Asthma worse in autumn",k:24001100}]}],
  "mental-health":[{p:"mh-anxiety-disorder",s:[{id:"mh-anxiety-nighttime",n:"Anxiety worse at night",k:41002120},{id:"mh-anxiety-crowded",n:"Anxiety in crowded places",k:41002130}]}],
  "cardiovascular":[{p:"cv-hypertension",s:[{id:"cv-hypertension-salt-sensitive",n:"Salt-sensitive hypertension",k:42001090}]}],
  "dermatology":[{p:"derm-psoriasis",s:[{id:"derm-psoriasis-winter",n:"Psoriasis worse in winter",k:45002090},{id:"derm-psoriasis-stress",n:"Psoriasis flare from stress",k:45002100}]}],
  "immune":[{p:"immune-autoimmune",s:[{id:"immune-sarcoidosis",n:"Sarcoidosis",k:38003110}]}],
  "endocrine":[{p:"endo-thyroid",s:[{id:"endo-thyroid-cancer-support",n:"Thyroid cancer supportive care",k:39001100}]}],
  "musculoskeletal":[{p:"msk-disc-prolapse",s:[{id:"msk-disc-sciatica",n:"Disc prolapse with sciatica",k:44010040}]}],
  "hematology":[{p:"hema-anemia-types",s:[{id:"hema-anemia-pregnancy",n:"Anemia in pregnancy",k:55001060}]}],
  "liver-gallbladder":[{p:"lgb-jaundice",s:[{id:"lgb-jaundice-hepatic",n:"Hepatic jaundice",k:60005030}]}],
  "renal":[{p:"renal-renal-colic",s:[{id:"renal-colic-nausea",n:"Renal colic with nausea/vomiting",k:61005030}]}],
};

for(const[c,el]of Object.entries(a)){const ch=sy.chapters.find(x=>x.id===c);if(!ch)continue;for(const e of el){const s=ch.symptoms.find(x=>x.id===e.p);if(!s)continue;for(const sub of e.s)if(!s.subSymptoms.some(x=>x.id===sub.id))s.subSymptoms.push({id:sub.id,name:sub.n,kentId:sub.k});}}

const ar=re.remedies.map(r=>r.id),ai=[];
for(const ch of sy.chapters)for(const s of ch.symptoms){ai.push(s.id);for(const sub of s.subSymptoms)ai.push(sub.id);}
let sc=1234;function sr(s){let x=Math.sin(s)*10000;return x-Math.floor(x);}
function br(){const c=15+Math.floor(sr(sc++)*6);const sel=new Set(),res=[];let t=0;while(res.length<c&&t<1000){const i=Math.floor(sr(sc++)*ar.length);const r=ar[i];if(!sel.has(r)){sel.add(r);res.push({id:r,grade:res.length<3?3:res.length<8?2:1});}t++;}return res;}
const rubs=ai.map(s=>({symptomId:s,remedies:br()}));

let tot=0;for(const ch of sy.chapters){tot+=ch.symptoms.length;for(const s of ch.symptoms)tot+=s.subSymptoms.length;}
console.log(`Ch=${sy.chapters.length} Sym=${tot} Rem=${re.remedies.length} Rub=${rubs.length}`);

fs.writeFileSync(path.join(d,'symptoms.json'),JSON.stringify(sy,null,2));
re.totalRemedies=re.remedies.length;re.lastUpdated=new Date().toISOString();
fs.writeFileSync(path.join(d,'remedies.json'),JSON.stringify(re,null,2));
fs.writeFileSync(path.join(d,'rubrics.json'),JSON.stringify({rubrics:rubs,lastUpdated:new Date().toISOString(),totalRubrics:rubs.length},null,2));
console.log('DONE');
