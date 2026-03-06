const remediesData = require('../data/remedies.json');
const rubrics = require('../data/rubrics.json');

function getAllRemedies(req, res) {
  const remedies = remediesData.remedies.map(r => ({
    id: r.id,
    name: r.name,
    abbr: r.abbr,
    description: r.description,
    symptomCount: r.commonSymptoms.length,
  }));

  res.json({ remedies });
}

function getRemedyById(req, res) {
  const { id } = req.params;
  const remedy = remediesData.remedies.find(r => r.id === id);

  if (!remedy) {
    const bn = (req.query?.language || 'bn') === 'bn';
    return res.status(404).json({ error: bn ? 'ওষুধ পাওয়া যায়নি' : 'Remedy not found' });
  }

  const symptomIds = [];
  for (const [symId, entries] of Object.entries(rubrics)) {
    if (Array.isArray(entries) && entries.some(r => r.remedyId === id)) {
      symptomIds.push(symId);
    }
  }

  const relatedRemedyIds = new Set();
  for (const symId of symptomIds) {
    const entries = rubrics[symId];
    if (Array.isArray(entries)) {
      for (const rem of entries) {
        if (rem.remedyId !== id) relatedRemedyIds.add(rem.remedyId);
      }
    }
  }

  const relatedRemedies = [...relatedRemedyIds]
    .slice(0, 8)
    .map(rid => {
      const r = remediesData.remedies.find(rem => rem.id === rid);
      return r ? { id: r.id, name: r.name, abbr: r.abbr } : null;
    })
    .filter(Boolean);

  res.json({
    remedy: {
      ...remedy,
      relatedRemedies,
    },
  });
}

function searchRemedies(req, res) {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query || query.length < 2) {
    return res.json({ results: [] });
  }

  const results = remediesData.remedies
    .filter(
      r =>
        r.name.toLowerCase().includes(query) ||
        r.abbr.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    )
    .slice(0, 50)
    .map(r => ({
      id: r.id,
      name: r.name,
      abbr: r.abbr,
      description: r.description.substring(0, 100) + '...',
    }));

  res.json({ results });
}

module.exports = { getAllRemedies, getRemedyById, searchRemedies };
