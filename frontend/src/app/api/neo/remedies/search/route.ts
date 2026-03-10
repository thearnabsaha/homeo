import { NextRequest, NextResponse } from "next/server";
import { getNeoRemedySearchIndex, getNeoBnToEn } from "@/data/neoLoader";

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
  const bnToEn = getNeoBnToEn();

  let englishQuery = "";
  if (bengali && bnToEn[raw]) {
    englishQuery = bnToEn[raw].toLowerCase();
  }

  const searchIndex = getNeoRemedySearchIndex();
  const results = [];

  for (const entry of searchIndex) {
    const match = bengali
      ? entry.bnLower.includes(query) || (englishQuery && (entry.lower.includes(englishQuery) || entry.descLower.includes(englishQuery)))
      : entry.lower.includes(query) || entry.abbrLower.includes(query) || entry.descLower.includes(query) || entry.bnLower.includes(query);

    if (match) {
      results.push({
        id: entry.r.id,
        name: entry.r.name,
        abbr: entry.r.abbr,
        type: "remedy",
      });
      if (results.length >= 50) break;
    }
  }

  return NextResponse.json({ results }, { headers: CACHE_HEADERS });
}
