import { NextRequest, NextResponse } from "next/server";
import { symptomSearchIndex } from "@/data/loader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
};

export function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "").toLowerCase().trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] }, { headers: CACHE_HEADERS });
  }

  const results = [];
  for (const entry of symptomSearchIndex) {
    if (entry.nameLower.includes(query)) {
      results.push({
        id: entry.id,
        name: entry.name,
        type: entry.type,
        chapter: entry.chapter,
        parent: entry.parent,
      });
      if (results.length >= 75) break;
    }
  }

  return NextResponse.json({ results }, { headers: CACHE_HEADERS });
}
