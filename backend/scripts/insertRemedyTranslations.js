const fs = require('fs');
const path = require('path');

const dtPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'i18n', 'dataTranslations.ts');
const blockPath = path.join(__dirname, 'remedyTranslationBlock.txt');

let dt = fs.readFileSync(dtPath, 'utf8');
const block = fs.readFileSync(blockPath, 'utf8');

const marker = '// ========== REMEDY NAMES ==========';
const insertIdx = dt.indexOf(marker);

if (insertIdx === -1) {
  console.error('Could not find REMEDY NAMES marker');
  process.exit(1);
}

const lineStart = dt.lastIndexOf('\n', insertIdx);
dt = dt.slice(0, lineStart) + '\n' + block + '\n' + dt.slice(lineStart);

fs.writeFileSync(dtPath, dt, 'utf8');
console.log('Inserted Boericke remedy translations into dataTranslations.ts');

const lines = block.split('\n').filter(l => l.includes('":"')).length;
console.log(`Added ${lines} new remedy translations`);
