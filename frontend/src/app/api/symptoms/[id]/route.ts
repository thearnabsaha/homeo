import { NextRequest, NextResponse } from "next/server";
import { symptomsData, rubrics, remediesData } from "@/data/loader";

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return params.then(({ id }) => {
    type Found = {
      id: string;
      name: string;
      type: string;
      [key: string]: unknown;
    };
    let found: Found | null = null;
    let parentChapter: { id: string; name: string } | null = null;
    let parentSymptom: { id: string; name: string } | null = null;

    for (const ch of symptomsData.chapters) {
      if (ch.id === id) {
        found = { ...ch, type: "chapter" } as Found;
        break;
      }
      for (const sym of ch.symptoms) {
        if (sym.id === id) {
          found = { ...sym, type: "symptom" } as Found;
          parentChapter = { id: ch.id, name: ch.name };
          break;
        }
        const subs = (sym as { subSymptoms?: { id: string; name: string }[] })
          .subSymptoms;
        if (subs) {
          for (const sub of subs) {
            if (sub.id === id) {
              found = { ...sub, type: "subSymptom" } as Found;
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
      const bn =
        (request.nextUrl.searchParams.get("language") || "bn") === "bn";
      return NextResponse.json(
        { error: bn ? "লক্ষণ পাওয়া যায়নি" : "Symptom not found" },
        { status: 404 }
      );
    }

    const rubricEntries = rubrics[id];
    const symptomRemedies = rubricEntries
      ? rubricEntries
          .map((r) => {
            const remedy = remediesData.remedies.find(
              (rem) => rem.id === r.remedyId
            );
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
          .sort(
            (a, b) => (b as { strength: number }).strength - (a as { strength: number }).strength
          )
      : [];

    return NextResponse.json({
      symptom: found,
      breadcrumb: [parentChapter, parentSymptom, { id: found.id, name: found.name }].filter(
        Boolean
      ),
      remedies: symptomRemedies,
    });
  });
}
