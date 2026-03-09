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
    conditionCount: ch.conditions.length,
    conditions: ch.conditions.map((cond) => ({
      id: cond.id,
      name: cond.name,
      symptomCount: cond.symptoms.length,
      symptoms: cond.symptoms.map((sym) => ({
        id: sym.id,
        name: sym.name,
        hasSubSymptoms: sym.subSymptoms.length > 0,
        subSymptomCount: sym.subSymptoms.length,
        subSymptoms: sym.subSymptoms.map((sub) => ({
          id: sub.id,
          name: sub.name,
        })),
      })),
    })),
  }));
}

export function GET() {
  if (!cached) cached = buildResponse();
  return NextResponse.json({ chapters: cached }, { headers: CACHE_HEADERS });
}
