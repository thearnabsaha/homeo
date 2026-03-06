import { NextResponse } from "next/server";
import { remediesData } from "@/data/loader";

export function GET() {
  const remedies = remediesData.remedies.map((r) => ({
    id: r.id,
    name: r.name,
    abbr: r.abbr,
    description: r.description,
    symptomCount: r.commonSymptoms.length,
  }));

  return NextResponse.json({ remedies });
}
