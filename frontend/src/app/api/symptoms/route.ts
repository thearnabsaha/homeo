import { NextResponse } from "next/server";
import { symptomsData } from "@/data/loader";

export function GET() {
  const chapters = symptomsData.chapters.map((ch) => ({
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
      subSymptomCount:
        ((s as { subSymptoms?: unknown[] }).subSymptoms?.length) || 0,
    })),
  }));

  return NextResponse.json({ chapters });
}
