import { NextResponse } from "next/server";
import { symptomsData } from "@/data/loader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

let cached: ReturnType<typeof buildResponse> | null = null;

function buildResponse() {
  return symptomsData.chapters.map((ch) => ({
    id: ch.id,
    name: ch.name,
    order: ch.order,
    symptomCount: ch.symptoms.reduce(
      (acc: number, s: { subSymptoms?: unknown[] }) =>
        acc + 1 + (s.subSymptoms?.length || 0),
      0
    ),
    symptoms: ch.symptoms.map((s) => ({
      id: s.id,
      name: s.name,
      hasSubSymptoms: !!(s as { subSymptoms?: unknown[] }).subSymptoms?.length,
      subSymptomCount: ((s as { subSymptoms?: unknown[] }).subSymptoms?.length) || 0,
    })),
  }));
}

export function GET() {
  if (!cached) cached = buildResponse();
  return NextResponse.json({ chapters: cached }, { headers: CACHE_HEADERS });
}
