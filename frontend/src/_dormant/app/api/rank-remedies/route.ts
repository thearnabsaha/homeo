import { NextRequest, NextResponse } from "next/server";
import { rubrics, remedyById, symptomById } from "@/data/loader";

function findMatchingRubrics(symptomId: string) {
  const direct = rubrics[symptomId];
  if (direct && direct.length > 0) return [{ symptomId, remedies: direct }];

  const parts = symptomId.split("-");
  while (parts.length > 2) {
    parts.pop();
    const parentId = parts.join("-");
    const parent = rubrics[parentId];
    if (parent && parent.length > 0) return [{ symptomId: parentId, remedies: parent }];
  }
  return [];
}

export function POST(request: NextRequest) {
  return request.json().then((body) => {
    const { symptomIds, topN: rawTopN } = body;

    if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
      return NextResponse.json({ error: "Please provide an array of symptom IDs" }, { status: 400 });
    }

    const topN = Math.min(Math.max(rawTopN || 20, 5), 30);
    const scores = new Map<string, { totalScore: number; symptomsCovered: number; maxGrade: number; details: { symptomId: string; symptomName: string; grade: number }[] }>();

    for (const symId of symptomIds) {
      for (const rubric of findMatchingRubrics(symId)) {
        for (const rem of rubric.remedies) {
          let entry = scores.get(rem.remedyId);
          if (!entry) {
            entry = { totalScore: 0, symptomsCovered: 0, maxGrade: 0, details: [] };
            scores.set(rem.remedyId, entry);
          }
          entry.totalScore += rem.grade;
          entry.symptomsCovered++;
          if (rem.grade > entry.maxGrade) entry.maxGrade = rem.grade;
          const sym = symptomById.get(rubric.symptomId);
          entry.details.push({ symptomId: rubric.symptomId, symptomName: sym?.name || rubric.symptomId, grade: rem.grade });
        }
      }
    }

    const totalSymptoms = symptomIds.length;
    const maxPossibleScore = totalSymptoms * 3;

    const ranked = [];
    for (const [remedyId, entry] of scores) {
      const remedy = remedyById.get(remedyId);
      if (!remedy) continue;
      const coverageRatio = entry.symptomsCovered / totalSymptoms;
      const scoreRatio = entry.totalScore / maxPossibleScore;
      ranked.push({
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
        confidence: Math.min(98, Math.round((coverageRatio * 60 + scoreRatio * 40) * 100) / 100),
        coverageDetails: entry.details,
        rank: 0,
      });
    }

    ranked.sort((a, b) => {
      if (b.symptomsCovered !== a.symptomsCovered) return b.symptomsCovered - a.symptomsCovered;
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return b.maxGrade - a.maxGrade;
    });

    const result = ranked.slice(0, topN).map((e, i) => ({ ...e, rank: i + 1 }));

    return NextResponse.json({
      totalSymptomsAnalyzed: symptomIds.length,
      totalRemediesFound: result.length,
      rankedRemedies: result,
    });
  });
}
