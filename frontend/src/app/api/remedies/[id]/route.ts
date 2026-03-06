import { NextRequest, NextResponse } from "next/server";
import { remediesData, rubrics } from "@/data/loader";

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return params.then(({ id }) => {
    const remedy = remediesData.remedies.find((r) => r.id === id);

    if (!remedy) {
      const bn =
        (request.nextUrl.searchParams.get("language") || "bn") === "bn";
      return NextResponse.json(
        { error: bn ? "ওষুধ পাওয়া যায়নি" : "Remedy not found" },
        { status: 404 }
      );
    }

    const symptomIds: string[] = [];
    for (const [symId, entries] of Object.entries(rubrics)) {
      if (Array.isArray(entries) && entries.some((r) => r.remedyId === id)) {
        symptomIds.push(symId);
      }
    }

    const relatedRemedyIds = new Set<string>();
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
      .map((rid) => {
        const r = remediesData.remedies.find((rem) => rem.id === rid);
        return r ? { id: r.id, name: r.name, abbr: r.abbr } : null;
      })
      .filter(Boolean);

    return NextResponse.json({
      remedy: { ...remedy, relatedRemedies },
    });
  });
}
