import { NextRequest, NextResponse } from "next/server";
import { remedySearchIndex } from "@/data/loader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
};

export function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "").toLowerCase().trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] }, { headers: CACHE_HEADERS });
  }

  const results = [];
  for (const entry of remedySearchIndex) {
    if (entry.lower.includes(query) || entry.abbrLower.includes(query) || entry.descLower.includes(query)) {
      results.push({
        id: entry.r.id,
        name: entry.r.name,
        abbr: entry.r.abbr,
        description: entry.r.description.substring(0, 100) + "...",
      });
      if (results.length >= 50) break;
    }
  }

  return NextResponse.json({ results }, { headers: CACHE_HEADERS });
}
