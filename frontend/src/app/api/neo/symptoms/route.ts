import { NextRequest, NextResponse } from "next/server";
import { neoSymptomsData } from "@/data/neoLoader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

let cachedTop: unknown[] | null = null;
const childrenCache = new Map<string, unknown>();

function buildTopLevel() {
  return neoSymptomsData.chapters.map((ch) => ({
    id: ch.id,
    name: ch.name,
    order: ch.order,
    conditionCount: ch.conditions.length,
  }));
}

export function GET(request: NextRequest) {
  const parentId = request.nextUrl.searchParams.get("parent");

  if (!parentId) {
    if (!cachedTop) cachedTop = buildTopLevel();
    return NextResponse.json({ chapters: cachedTop }, { headers: CACHE_HEADERS });
  }

  const hit = childrenCache.get(parentId);
  if (hit) {
    return NextResponse.json(hit, { headers: CACHE_HEADERS });
  }

  const chapters = neoSymptomsData.chapters;

  const chapter = chapters.find((c) => c.id === parentId);
  if (chapter) {
    const conditions = chapter.conditions.map((cond) => ({
      id: cond.id,
      name: cond.name,
      symptomCount: cond.symptoms.length,
    }));
    const body = { children: conditions, type: "conditions" };
    childrenCache.set(parentId, body);
    return NextResponse.json(body, { headers: CACHE_HEADERS });
  }

  for (const ch of chapters) {
    const cond = ch.conditions.find((c) => c.id === parentId);
    if (cond) {
      const symptoms = cond.symptoms.map((sym) => ({
        id: sym.id,
        name: sym.name,
        hasSubSymptoms: sym.subSymptoms.length > 0,
        subSymptomCount: sym.subSymptoms.length,
      }));
      const body = { children: symptoms, type: "symptoms" };
      childrenCache.set(parentId, body);
      return NextResponse.json(body, { headers: CACHE_HEADERS });
    }

    for (const co of ch.conditions) {
      const sym = co.symptoms.find((s) => s.id === parentId);
      if (sym) {
        const subs = sym.subSymptoms.map((sub) => ({
          id: sub.id,
          name: sub.name,
        }));
        const body = { children: subs, type: "subSymptoms" };
        childrenCache.set(parentId, body);
        return NextResponse.json(body, { headers: CACHE_HEADERS });
      }
    }
  }

  return NextResponse.json({ children: [], type: "unknown" }, { headers: CACHE_HEADERS });
}
