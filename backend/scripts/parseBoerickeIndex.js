const fs = require('fs');
const path = require('path');

const indexPath = path.join('C:\\Users\\asaha245\\.cursor\\projects\\c-Users-asaha245-OneDrive-PwC-Desktop-homeo\\agent-tools\\9cccd6a5-91e5-4cac-8c52-26aa907c534e.txt');
const indexText = fs.readFileSync(indexPath, 'utf8');

const remediesData = require('../data/remedies.json');
const existingIds = new Set(remediesData.remedies.map(r => r.id));
const existingNames = new Set(remediesData.remedies.map(r => r.name.toLowerCase()));

const urlPattern = /\[([A-Z][A-Z0-9-]*)\]\((https:\/\/www\.homeoint\.org\/books\/boericmm\/[a-z]\/[a-z0-9-]+\.htm)\)------>\s+([A-Z][A-Z\s,.'()\/\-]+)/g;

const boerickeRemedies = [];
let match;
while ((match = urlPattern.exec(indexText)) !== null) {
  const abbr = match[1];
  const url = match[2];
  let fullName = match[3].trim();
  if (fullName.includes('(')) {
    fullName = fullName.split('(')[0].trim();
  }
  fullName = fullName.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  
  const abbrLower = abbr.toLowerCase().replace(/_/g, '-');
  
  boerickeRemedies.push({ abbr, abbrLower, fullName, url });
}

console.log('Total Boericke remedies parsed:', boerickeRemedies.length);
console.log('Existing remedies:', existingIds.size);

const missing = boerickeRemedies.filter(r => {
  if (existingIds.has(r.abbrLower)) return false;
  if (existingNames.has(r.fullName.toLowerCase())) return false;
  const variants = [
    r.abbrLower,
    r.abbrLower.replace(/-/g, ''),
    r.abbr.toLowerCase(),
  ];
  for (const v of variants) {
    if (existingIds.has(v)) return false;
  }
  return true;
});

console.log('Missing remedies:', missing.length);
console.log('');

const output = missing.map(r => ({
  id: r.abbrLower,
  abbr: r.abbr,
  name: r.fullName,
  url: r.url,
}));

fs.writeFileSync(path.join(__dirname, 'missingRemedies.json'), JSON.stringify(output, null, 2));
console.log('Written to missingRemedies.json');

output.forEach((r, i) => {
  console.log(`${i + 1}. ${r.id} - ${r.name} (${r.url})`);
});
