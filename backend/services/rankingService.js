/**
 * Repertorization Ranking Service
 * Implements Kent-style repertorization: for each symptom selected,
 * look up the rubric and collect matching remedies with grades.
 * The total score = sum of grades across all matching symptoms.
 * Also counts how many of the selected symptoms each remedy covers.
 */

const rubrics = require('../data/rubrics.json');
const remediesData = require('../data/remedies.json');
const symptomsData = require('../data/symptoms.json');

function findAllMatchingRubrics(symptomId) {
  const direct = rubrics.rubrics.filter(r => r.symptomId === symptomId);
  if (direct.length > 0) return direct;

  const parts = symptomId.split('-');
  while (parts.length > 2) {
    parts.pop();
    const parentId = parts.join('-');
    const parent = rubrics.rubrics.filter(r => r.symptomId === parentId);
    if (parent.length > 0) return parent;
  }

  return [];
}

function findSymptomName(symptomId) {
  for (const ch of symptomsData.chapters) {
    for (const sym of ch.symptoms) {
      if (sym.id === symptomId) return sym.name;
      for (const sub of (sym.subSymptoms || [])) {
        if (sub.id === symptomId) return sub.name;
      }
    }
  }
  return symptomId;
}

function rankRemedies(symptomIds, topN = 20) {
  const remedyScores = {};

  for (const symId of symptomIds) {
    const matchingRubrics = findAllMatchingRubrics(symId);
    for (const rubric of matchingRubrics) {
      for (const rem of rubric.remedies) {
        if (!remedyScores[rem.id]) {
          remedyScores[rem.id] = {
            id: rem.id,
            totalScore: 0,
            symptomsCovered: 0,
            coverageDetails: [],
            maxGrade: 0,
          };
        }
        remedyScores[rem.id].totalScore += rem.grade;
        remedyScores[rem.id].symptomsCovered += 1;
        if (rem.grade > remedyScores[rem.id].maxGrade) {
          remedyScores[rem.id].maxGrade = rem.grade;
        }
        remedyScores[rem.id].coverageDetails.push({
          symptomId: rubric.symptomId || symId,
          symptomName: findSymptomName(rubric.symptomId || symId),
          grade: rem.grade,
        });
      }
    }
  }

  const totalSymptoms = symptomIds.length;

  const ranked = Object.values(remedyScores)
    .map(entry => {
      const remedy = remediesData.remedies.find(r => r.id === entry.id);
      if (!remedy) return null;

      const maxPossibleScore = totalSymptoms * 3;
      const coverageRatio = entry.symptomsCovered / totalSymptoms;
      const scoreRatio = entry.totalScore / maxPossibleScore;
      const confidence = Math.min(98, Math.round((coverageRatio * 60 + scoreRatio * 40) * 100) / 100);

      return {
        id: remedy.id,
        name: remedy.name,
        abbr: remedy.abbr,
        description: remedy.description,
        dosage: remedy.dosage,
        modalities: remedy.modalities,
        totalScore: entry.totalScore,
        symptomsCovered: entry.symptomsCovered,
        totalSymptoms,
        maxGrade: entry.maxGrade,
        confidence,
        coverageDetails: entry.coverageDetails,
        rank: 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.symptomsCovered !== a.symptomsCovered) return b.symptomsCovered - a.symptomsCovered;
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return b.maxGrade - a.maxGrade;
    })
    .slice(0, topN)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  return ranked;
}

module.exports = { rankRemedies };
