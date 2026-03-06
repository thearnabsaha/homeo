const symptomsData = require('../data/symptoms.json');
const rubrics = require('../data/rubrics.json');
const remediesData = require('../data/remedies.json');

function getAllSymptoms(req, res) {
  const chapters = symptomsData.chapters.map(ch => ({
    id: ch.id,
    name: ch.name,
    order: ch.order,
    symptomCount: ch.symptoms.reduce(
      (acc, s) => acc + 1 + (s.subSymptoms?.length || 0),
      0
    ),
    symptoms: ch.symptoms.map(s => ({
      id: s.id,
      name: s.name,
      hasSubSymptoms: s.subSymptoms && s.subSymptoms.length > 0,
      subSymptomCount: s.subSymptoms?.length || 0,
    })),
  }));

  res.json({ chapters });
}

function getSymptomById(req, res) {
  const { id } = req.params;

  let found = null;
  let parentChapter = null;
  let parentSymptom = null;

  for (const ch of symptomsData.chapters) {
    if (ch.id === id) {
      found = { ...ch, type: 'chapter' };
      break;
    }
    for (const sym of ch.symptoms) {
      if (sym.id === id) {
        found = { ...sym, type: 'symptom' };
        parentChapter = { id: ch.id, name: ch.name };
        break;
      }
      if (sym.subSymptoms) {
        for (const sub of sym.subSymptoms) {
          if (sub.id === id) {
            found = { ...sub, type: 'subSymptom' };
            parentChapter = { id: ch.id, name: ch.name };
            parentSymptom = { id: sym.id, name: sym.name };
            break;
          }
        }
      }
      if (found) break;
    }
    if (found) break;
  }

  if (!found) {
    const bn = (req.query?.language || 'bn') === 'bn';
    return res.status(404).json({ error: bn ? 'লক্ষণ পাওয়া যায়নি' : 'Symptom not found' });
  }

  const rubricEntries = rubrics[id];
  const symptomRemedies = rubricEntries
    ? rubricEntries
        .map(r => {
          const remedy = remediesData.remedies.find(rem => rem.id === r.remedyId);
          return remedy
            ? {
                id: remedy.id,
                name: remedy.name,
                abbr: remedy.abbr,
                strength: r.grade,
                description: remedy.description,
              }
            : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.strength - a.strength)
    : [];

  res.json({
    symptom: found,
    breadcrumb: [
      parentChapter,
      parentSymptom,
      { id: found.id, name: found.name },
    ].filter(Boolean),
    remedies: symptomRemedies,
  });
}

function searchSymptoms(req, res) {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query || query.length < 2) {
    return res.json({ results: [] });
  }

  const results = [];

  for (const ch of symptomsData.chapters) {
    if (ch.name.toLowerCase().includes(query)) {
      results.push({ id: ch.id, name: ch.name, type: 'chapter', chapter: ch.name });
    }
    for (const sym of ch.symptoms) {
      if (sym.name.toLowerCase().includes(query)) {
        results.push({ id: sym.id, name: sym.name, type: 'symptom', chapter: ch.name });
      }
      if (sym.subSymptoms) {
        for (const sub of sym.subSymptoms) {
          if (sub.name.toLowerCase().includes(query)) {
            results.push({
              id: sub.id,
              name: sub.name,
              type: 'subSymptom',
              chapter: ch.name,
              parent: sym.name,
            });
          }
        }
      }
    }
  }

  res.json({ results: results.slice(0, 75) });
}

module.exports = { getAllSymptoms, getSymptomById, searchSymptoms };
