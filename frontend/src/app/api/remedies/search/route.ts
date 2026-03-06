import { NextRequest, NextResponse } from "next/server";
import { remediesData } from "@/data/loader";

export function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "")
    .toLowerCase()
    .trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = remediesData.remedies
    .filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.abbr.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    )
    .slice(0, 50)
    .map((r) => ({
      id: r.id,
      name: r.name,
      abbr: r.abbr,
      description: r.description.substring(0, 100) + "...",
    }));

  return NextResponse.json({ results });
}
