import { NextRequest, NextResponse } from "next/server";
import { symptomSearchIndex, bnToEn } from "@/data/loader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
};

function isBengali(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

export function GET(request: NextRequest) {
  const raw = (request.nextUrl.searchParams.get("q") || "").trim();
  if (!raw || raw.length < 2) {
    return NextResponse.json({ results: [] }, { headers: CACHE_HEADERS });
  }

  const query = raw.toLowerCase();
  const bengali = isBengali(raw);

  // If Bengali, also try reverse-translating to English for matching
  let englishQuery = "";
  if (bengali && bnToEn[raw]) {
    englishQuery = bnToEn[raw].toLowerCase();
  }

  const results = [];
  for (const entry of symptomSearchIndex) {
    const match = bengali
      ? entry.bnLower.includes(query) || (englishQuery && entry.nameLower.includes(englishQuery))
      : entry.nameLower.includes(query) || entry.bnLower.includes(query);

    if (match) {
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
