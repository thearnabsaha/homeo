import { NextResponse } from "next/server";
import { remediesData } from "@/data/loader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

let cached: { id: string; name: string; abbr: string; description: string; symptomCount: number }[] | null = null;

export function GET() {
  if (!cached) {
    cached = remediesData.remedies.map((r) => ({
      id: r.id,
      name: r.name,
      abbr: r.abbr,
      description: r.description,
      symptomCount: r.commonSymptoms.length,
    }));
  }
  return NextResponse.json({ remedies: cached }, { headers: CACHE_HEADERS });
}
