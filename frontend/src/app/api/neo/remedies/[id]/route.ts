import { NextRequest, NextResponse } from "next/server";
import { getNeoRemedyById, getNeoRemedyToSymptoms, getNeoRubrics } from "@/data/neoLoader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return params.then(({ id }) => {
    const remedyById = getNeoRemedyById();
    const remedyToSymptoms = getNeoRemedyToSymptoms();
    const rubrics = getNeoRubrics();

    const remedy = remedyById.get(id);
    if (!remedy) {
      return NextResponse.json({ error: "Remedy not found" }, { status: 404 });
    }

    const symptomIds = remedyToSymptoms.get(id) || [];
    const relatedIds = new Set<string>();
    for (const symId of symptomIds) {
      const entries = rubrics[symId];
      if (!Array.isArray(entries)) continue;
      for (const rem of entries) {
        if (rem.remedyId !== id) {
          relatedIds.add(rem.remedyId);
          if (relatedIds.size >= 8) break;
        }
      }
      if (relatedIds.size >= 8) break;
    }

    const relatedRemedies = [];
    for (const rid of relatedIds) {
      const r = remedyById.get(rid);
      if (r) relatedRemedies.push({ id: r.id, name: r.name, abbr: r.abbr });
    }

    return NextResponse.json(
      { remedy: { ...remedy, relatedRemedies } },
      { headers: CACHE_HEADERS }
    );
  });
}
