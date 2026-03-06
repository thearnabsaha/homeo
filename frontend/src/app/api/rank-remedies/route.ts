import { NextRequest, NextResponse } from "next/server";
import { rubrics, remediesData, symptomsData } from "@/data/loader";

function findSymptomName(symptomId: string): string {
  for (const ch of symptomsData.chapters) {
    for (const sym of ch.symptoms) {
      if (sym.id === symptomId) return sym.name;
      const subs = (sym as { subSymptoms?: { id: string; name: string }[] })
        .subSymptoms;
      if (subs) {
        for (const sub of subs) {
          if (sub.id === symptomId) return sub.name;
        }
      }
    }
  }
  return symptomId;
}

function findMatchingRubrics(symptomId: string) {
  const direct = rubrics[symptomId];
  if (direct && direct.length > 0) {
    return [{ symptomId, remedies: direct }];
  }

  const parts = symptomId.split("-");
  while (parts.length > 2) {
    parts.pop();
    const parentId = parts.join("-");
    const parent = rubrics[parentId];
    if (parent && parent.length > 0) {
      return [{ symptomId: parentId, remedies: parent }];
    }
  }
  return [];
}

export function POST(request: NextRequest) {
  return request.json().then((body) => {
    const { symptomIds, topN: rawTopN } = body;

    if (
      !symptomIds ||
      !Array.isArray(symptomIds) ||
      symptomIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Please provide an array of symptom IDs" },
        { status: 400 }
      );
    }

    const topN = Math.min(Math.max(rawTopN || 20, 5), 30);
    const remedyScores: Record<
      string,
      {
        id: string;
        totalScore: number;
        symptomsCovered: number;
        coverageDetails: {
          symptomId: string;
          symptomName: string;
          grade: number;
        }[];
        maxGrade: number;
      }
    > = {};

    for (const symId of symptomIds) {
      const matching = findMatchingRubrics(symId);
      for (const rubric of matching) {
        for (const rem of rubric.remedies) {
          if (!remedyScores[rem.remedyId]) {
            remedyScores[rem.remedyId] = {
              id: rem.remedyId,
              totalScore: 0,
              symptomsCovered: 0,
              coverageDetails: [],
              maxGrade: 0,
            };
          }
          remedyScores[rem.remedyId].totalScore += rem.grade;
          remedyScores[rem.remedyId].symptomsCovered += 1;
          if (rem.grade > remedyScores[rem.remedyId].maxGrade) {
            remedyScores[rem.remedyId].maxGrade = rem.grade;
          }
          remedyScores[rem.remedyId].coverageDetails.push({
            symptomId: rubric.symptomId,
            symptomName: findSymptomName(rubric.symptomId),
            grade: rem.grade,
          });
        }
      }
    }

    const totalSymptoms = symptomIds.length;

    const ranked = Object.values(remedyScores)
      .map((entry) => {
        const remedy = remediesData.remedies.find((r) => r.id === entry.id);
        if (!remedy) return null;

        const maxPossibleScore = totalSymptoms * 3;
        const coverageRatio = entry.symptomsCovered / totalSymptoms;
        const scoreRatio = entry.totalScore / maxPossibleScore;
        const confidence = Math.min(
          98,
          Math.round((coverageRatio * 60 + scoreRatio * 40) * 100) / 100
        );

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
        if (!a || !b) return 0;
        if (b.symptomsCovered !== a.symptomsCovered)
          return b.symptomsCovered - a.symptomsCovered;
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return b.maxGrade - a.maxGrade;
      })
      .slice(0, topN)
      .map((entry, i) => (entry ? { ...entry, rank: i + 1 } : null))
      .filter(Boolean);

    return NextResponse.json({
      totalSymptomsAnalyzed: symptomIds.length,
      totalRemediesFound: ranked.length,
      rankedRemedies: ranked,
    });
  });
}
