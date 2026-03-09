import { NextRequest, NextResponse } from "next/server";
import { getNeoSymptomById, getNeoRubrics, getNeoRemedyById } from "@/data/neoLoader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return params.then(({ id }) => {
    const symptomById = getNeoSymptomById();
    const rubrics = getNeoRubrics();
    const remedyById = getNeoRemedyById();

    const found = symptomById.get(id);
    if (!found) {
      return NextResponse.json({ error: "Symptom not found" }, { status: 404 });
    }

    const rubricEntries = rubrics[id];
    const symptomRemedies = rubricEntries
      ? rubricEntries
          .map((r) => {
            const remedy = remedyById.get(r.remedyId);
            return remedy
              ? { id: remedy.id, name: remedy.name, abbr: remedy.abbr, strength: r.grade, description: remedy.description }
              : null;
          })
          .filter(Boolean)
          .sort((a, b) => (b as { strength: number }).strength - (a as { strength: number }).strength)
      : [];

    const breadcrumb = [
      found.chapterName !== found.name ? { id: found.chapterName, name: found.chapterName } : null,
      found.parentName ? { id: found.parentName, name: found.parentName } : null,
      { id: found.id, name: found.name },
    ].filter(Boolean);

    return NextResponse.json({ symptom: found, breadcrumb, remedies: symptomRemedies }, { headers: CACHE_HEADERS });
  });
}
