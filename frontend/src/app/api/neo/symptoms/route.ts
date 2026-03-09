import { NextResponse } from "next/server";
import { neoSymptomsData } from "@/data/neoLoader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

let cached: unknown[] | null = null;

function buildResponse() {
  return neoSymptomsData.chapters.map((ch) => ({
    id: ch.id,
    name: ch.name,
    order: ch.order,
    symptomCount: ch.symptoms.reduce(
      (acc, s) => acc + 1 + (s.subSymptoms?.length || 0),
      0
    ),
    symptoms: ch.symptoms.map((s) => ({
      id: s.id,
      name: s.name,
      hasSubSymptoms: !!s.subSymptoms?.length,
      subSymptomCount: s.subSymptoms?.length || 0,
    })),
  }));
}

export function GET() {
  if (!cached) cached = buildResponse();
  return NextResponse.json({ chapters: cached }, { headers: CACHE_HEADERS });
}
