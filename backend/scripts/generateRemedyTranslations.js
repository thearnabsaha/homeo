const fs = require('fs');
const path = require('path');

const scrapedPath = path.join(__dirname, 'scrapedRemedies.json');
const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));

const dtPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'i18n', 'dataTranslations.ts');
const dtContent = fs.readFileSync(dtPath, 'utf8');

const alreadyTranslated = new Set();
const transRegex = /"([^"]+)":\s*"/g;
let m;
while ((m = transRegex.exec(dtContent)) !== null) {
  alreadyTranslated.add(m[1]);
}

const translitMap = {
  'pha': 'ফা', 'phe': 'ফে', 'phi': 'ফি', 'pho': 'ফো', 'phu': 'ফু', 'ph': 'ফ',
  'sha': 'শা', 'she': 'শে', 'shi': 'শি', 'sho': 'শো', 'shu': 'শু', 'sh': 'শ',
  'tha': 'থা', 'the': 'দ্য', 'thi': 'থি', 'tho': 'থো', 'thu': 'থু', 'th': 'থ',
  'cha': 'চা', 'che': 'কে', 'chi': 'কি', 'cho': 'কো', 'chu': 'চু', 'ch': 'চ',
  'kha': 'খা', 'khe': 'খে', 'khi': 'খি', 'kho': 'খো', 'khu': 'খু', 'kh': 'খ',
  'gha': 'ঘা', 'ghe': 'ঘে', 'ghi': 'ঘি', 'gho': 'ঘো', 'ghu': 'ঘু', 'gh': 'ঘ',
  'bha': 'ভা', 'bhe': 'ভে', 'bhi': 'ভি', 'bho': 'ভো', 'bhu': 'ভু', 'bh': 'ভ',
  'dha': 'ধা', 'dhe': 'ধে', 'dhi': 'ধি', 'dho': 'ধো', 'dhu': 'ধু', 'dh': 'ধ',
  'tra': 'ট্রা', 'tre': 'ট্রে', 'tri': 'ট্রি', 'tro': 'ট্রো', 'tru': 'ট্রু', 'tr': 'ট্র',
  'dra': 'ড্রা', 'dre': 'ড্রে', 'dri': 'ড্রি', 'dro': 'ড্রো', 'dru': 'ড্রু', 'dr': 'ড্র',
  'gra': 'গ্রা', 'gre': 'গ্রে', 'gri': 'গ্রি', 'gro': 'গ্রো', 'gru': 'গ্রু', 'gr': 'গ্র',
  'pra': 'প্রা', 'pre': 'প্রে', 'pri': 'প্রি', 'pro': 'প্রো', 'pru': 'প্রু', 'pr': 'প্র',
  'bra': 'ব্রা', 'bre': 'ব্রে', 'bri': 'ব্রি', 'bro': 'ব্রো', 'bru': 'ব্রু', 'br': 'ব্র',
  'cra': 'ক্রা', 'cre': 'ক্রে', 'cri': 'ক্রি', 'cro': 'ক্রো', 'cru': 'ক্রু', 'cr': 'ক্র',
  'fra': 'ফ্রা', 'fre': 'ফ্রে', 'fri': 'ফ্রি', 'fro': 'ফ্রো', 'fru': 'ফ্রু', 'fr': 'ফ্র',
  'sta': 'স্টা', 'ste': 'স্টে', 'sti': 'স্টি', 'sto': 'স্টো', 'stu': 'স্টু', 'st': 'স্ট',
  'spa': 'স্পা', 'spe': 'স্পে', 'spi': 'স্পি', 'spo': 'স্পো', 'spu': 'স্পু', 'sp': 'স্প',
  'sca': 'স্কা', 'sce': 'সে', 'sci': 'সি', 'sco': 'স্কো', 'scu': 'স্কু', 'sc': 'স্ক',
  'sla': 'স্লা', 'sle': 'স্লে', 'sli': 'স্লি', 'slo': 'স্লো', 'slu': 'স্লু', 'sl': 'স্ল',
  'sma': 'স্মা', 'sme': 'স্মে', 'smi': 'স্মি', 'smo': 'স্মো', 'smu': 'স্মু', 'sm': 'স্ম',
  'sna': 'স্না', 'sne': 'স্নে', 'sni': 'স্নি', 'sno': 'স্নো', 'snu': 'স্নু', 'sn': 'স্ন',
  'swi': 'সুই', 'swa': 'স্বা', 'swe': 'সোয়ে', 'sw': 'স্ব',
  'fla': 'ফ্লা', 'fle': 'ফ্লে', 'fli': 'ফ্লি', 'flo': 'ফ্লো', 'flu': 'ফ্লু', 'fl': 'ফ্ল',
  'pla': 'প্লা', 'ple': 'প্লে', 'pli': 'প্লি', 'plo': 'প্লো', 'plu': 'প্লু', 'pl': 'প্ল',
  'bla': 'ব্লা', 'ble': 'ব্লে', 'bli': 'ব্লি', 'blo': 'ব্লো', 'blu': 'ব্লু', 'bl': 'ব্ল',
  'cla': 'ক্লা', 'cle': 'ক্লে', 'cli': 'ক্লি', 'clo': 'ক্লো', 'clu': 'ক্লু', 'cl': 'ক্ল',
  'gla': 'গ্লা', 'gle': 'গ্লে', 'gli': 'গ্লি', 'glo': 'গ্লো', 'glu': 'গ্লু', 'gl': 'গ্ল',
  'wra': 'র‍্যা', 'wre': 'রে', 'wri': 'রি', 'wr': 'র',
  'qua': 'কোয়া', 'que': 'কুই', 'qui': 'কুই', 'quo': 'কোয়ো', 'qu': 'কু',
  'sch': 'স্ক',
  'tia': 'শিয়া', 'tio': 'শিও', 'tiu': 'শিউ', 'tion': 'শন',
  'cia': 'শিয়া', 'cio': 'শিও', 'ciu': 'শিউ',

  'ka': 'কা', 'ke': 'কে', 'ki': 'কি', 'ko': 'কো', 'ku': 'কু', 'k': 'ক',
  'ga': 'গা', 'ge': 'জে', 'gi': 'জি', 'go': 'গো', 'gu': 'গু', 'g': 'গ',
  'ca': 'কা', 'ce': 'সে', 'ci': 'সি', 'co': 'কো', 'cu': 'কু', 'c': 'ক',
  'ta': 'টা', 'te': 'টে', 'ti': 'টি', 'to': 'টো', 'tu': 'টু', 't': 'ট',
  'da': 'ডা', 'de': 'ডে', 'di': 'ডি', 'do': 'ডো', 'du': 'ডু', 'd': 'ড',
  'pa': 'পা', 'pe': 'পে', 'pi': 'পি', 'po': 'পো', 'pu': 'পু', 'p': 'প',
  'ba': 'বা', 'be': 'বে', 'bi': 'বি', 'bo': 'বো', 'bu': 'বু', 'b': 'ব',
  'na': 'না', 'ne': 'নে', 'ni': 'নি', 'no': 'নো', 'nu': 'নু', 'n': 'ন',
  'ma': 'মা', 'me': 'মে', 'mi': 'মি', 'mo': 'মো', 'mu': 'মু', 'm': 'ম',
  'la': 'লা', 'le': 'লে', 'li': 'লি', 'lo': 'লো', 'lu': 'লু', 'l': 'ল',
  'ra': 'রা', 're': 'রে', 'ri': 'রি', 'ro': 'রো', 'ru': 'রু', 'r': 'র',
  'sa': 'সা', 'se': 'সে', 'si': 'সি', 'so': 'সো', 'su': 'সু', 's': 'স',
  'ja': 'জা', 'je': 'জে', 'ji': 'জি', 'jo': 'জো', 'ju': 'জু', 'j': 'জ',
  'va': 'ভা', 've': 'ভে', 'vi': 'ভি', 'vo': 'ভো', 'vu': 'ভু', 'v': 'ভ',
  'wa': 'ওয়া', 'we': 'ওয়ে', 'wi': 'উই', 'wo': 'ওয়ো', 'wu': 'উ', 'w': 'উ',
  'ha': 'হা', 'he': 'হে', 'hi': 'হি', 'ho': 'হো', 'hu': 'হু', 'h': 'হ',
  'ya': 'ইয়া', 'ye': 'ইয়ে', 'yi': 'ইয়ি', 'yo': 'ইয়ো', 'yu': 'ইউ', 'y': 'ই',
  'za': 'জা', 'ze': 'জে', 'zi': 'জি', 'zo': 'জো', 'zu': 'জু', 'z': 'জ',
  'fa': 'ফা', 'fe': 'ফে', 'fi': 'ফি', 'fo': 'ফো', 'fu': 'ফু', 'f': 'ফ',
  'xa': 'ক্সা', 'xe': 'ক্সে', 'xi': 'ক্সি', 'xo': 'ক্সো', 'xu': 'ক্সু', 'x': 'ক্স',
  'aa': 'আ', 'ae': 'ই', 'ai': 'আই', 'ao': 'আও', 'au': 'অ', 'ay': 'এ',
  'ea': 'ইয়া', 'ee': 'ই', 'ei': 'আই', 'eo': 'ইও', 'eu': 'ইউ', 'ey': 'ই',
  'ia': 'িয়া', 'ie': 'ি', 'io': 'িও', 'iu': 'িউ',
  'oa': 'ওয়া', 'oe': 'ও', 'oi': 'অয়', 'oo': 'উ', 'ou': 'আউ', 'oy': 'অয়',
  'ua': 'ুয়া', 'ue': 'ু', 'ui': 'ুই', 'uo': 'ুও', 'uy': 'ুই',

  'a': 'া', 'e': 'ে', 'i': 'ি', 'o': 'ো', 'u': 'ু',
};

const sortedKeys = Object.keys(translitMap).sort((a, b) => b.length - a.length);

const vowelStandalone = {
  'া': 'আ', 'ে': 'এ', 'ি': 'ই', 'ো': 'ও', 'ু': 'উ',
};

function transliterate(word) {
  let result = '';
  let i = 0;
  const lower = word.toLowerCase();
  
  while (i < lower.length) {
    let matched = false;
    for (const key of sortedKeys) {
      if (lower.startsWith(key, i)) {
        let val = translitMap[key];
        if (i === 0 && val.length === 1 && vowelStandalone[val]) {
          val = vowelStandalone[val];
        }
        result += val;
        i += key.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += lower[i];
      i++;
    }
  }
  
  return result;
}

function transliterateName(name) {
  const parts = name.split(/[\s-]+/);
  return parts.map(p => {
    if (p.length === 0) return '';
    return transliterate(p);
  }).join(' ');
}

const newTranslations = [];
const missing = [];

for (const r of scraped) {
  if (alreadyTranslated.has(r.name)) continue;
  
  const bengali = transliterateName(r.name);
  newTranslations.push({ name: r.name, bengali });
}

console.log(`Already translated: ${scraped.filter(r => alreadyTranslated.has(r.name)).length}`);
console.log(`New translations needed: ${newTranslations.length}`);

const lines = newTranslations.map(t => `  "${t.name}": "${t.bengali}",`);
const block = '\n  // ========== BOERICKE MATERIA MEDICA REMEDIES ==========\n' + lines.join('\n') + '\n';

fs.writeFileSync(path.join(__dirname, 'remedyTranslationBlock.txt'), block, 'utf8');
console.log('Written to remedyTranslationBlock.txt');

console.log('\nSample translations:');
newTranslations.slice(0, 20).forEach(t => {
  console.log(`  ${t.name} -> ${t.bengali}`);
});
