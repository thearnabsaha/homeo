import { NextRequest, NextResponse } from "next/server";
import { getNeoSymptomSearchIndex } from "@/data/neoLoader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
};

export function GET(request: NextRequest) {
  const raw = (request.nextUrl.searchParams.get("q") || "").trim();
  if (!raw || raw.length < 2) {
    return NextResponse.json({ results: [] }, { headers: CACHE_HEADERS });
  }

  const query = raw.toLowerCase();
  const searchIndex = getNeoSymptomSearchIndex();
  const results = [];

  for (const entry of searchIndex) {
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
