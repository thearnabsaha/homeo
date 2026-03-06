import { NextRequest, NextResponse } from "next/server";
import { symptomsData } from "@/data/loader";

export function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "")
    .toLowerCase()
    .trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  type Result = {
    id: string;
    name: string;
    type: string;
    chapter: string;
    parent?: string;
  };
  const results: Result[] = [];

  for (const ch of symptomsData.chapters) {
    if (ch.name.toLowerCase().includes(query)) {
      results.push({
        id: ch.id,
        name: ch.name,
        type: "chapter",
        chapter: ch.name,
      });
    }
    for (const sym of ch.symptoms) {
      if (sym.name.toLowerCase().includes(query)) {
        results.push({
          id: sym.id,
          name: sym.name,
          type: "symptom",
          chapter: ch.name,
        });
      }
      const sub = (sym as { subSymptoms?: { id: string; name: string }[] })
        .subSymptoms;
      if (sub) {
        for (const s of sub) {
          if (s.name.toLowerCase().includes(query)) {
            results.push({
              id: s.id,
              name: s.name,
              type: "subSymptom",
              chapter: ch.name,
              parent: sym.name,
            });
          }
        }
      }
    }
  }

  return NextResponse.json({ results: results.slice(0, 75) });
}
