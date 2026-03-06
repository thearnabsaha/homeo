const symptomsData = require('../data/symptoms.json');
const remediesData = require('../data/remedies.json');

function globalSearch(query) {
  if (!query || query.length < 2) return { symptoms: [], remedies: [] };

  const q = query.toLowerCase().trim();

  const symptoms = [];
  for (const ch of symptomsData.chapters) {
    for (const sym of ch.symptoms) {
      if (sym.name.toLowerCase().includes(q)) {
        symptoms.push({
          id: sym.id,
          name: sym.name,
          chapter: ch.name,
          type: 'symptom',
        });
      }
      if (sym.subSymptoms) {
        for (const sub of sym.subSymptoms) {
          if (sub.name.toLowerCase().includes(q)) {
            symptoms.push({
              id: sub.id,
              name: sub.name,
              chapter: ch.name,
              parent: sym.name,
              type: 'subSymptom',
            });
          }
        }
      }
    }
  }

  const remedies = remediesData.remedies
    .filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.abbr.toLowerCase().includes(q)
    )
    .map(r => ({
      id: r.id,
      name: r.name,
      abbr: r.abbr,
      type: 'remedy',
    }));

  return {
    symptoms: symptoms.slice(0, 10),
    remedies: remedies.slice(0, 10),
  };
}

module.exports = { globalSearch };
