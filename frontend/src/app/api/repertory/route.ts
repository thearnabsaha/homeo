import { NextRequest, NextResponse } from "next/server";
import oldRepertory from "@/data/oldRepertory.json";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

type RepertoryData = typeof oldRepertory;
type Repertory = RepertoryData["repertories"][number];
type Condition = Repertory["conditions"][number];
type Symptom = Condition["symptoms"][number];
type SubSymptom = Symptom["subSymptoms"][number];

const sortByName = <T extends { name: string }>(arr: T[]): T[] =>
  [...arr].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

let cachedRepertories: { id: number; name: string; conditionCount: number }[] | null = null;

export function GET(request: NextRequest) {
  const repertoryId = request.nextUrl.searchParams.get("repertoryId");
  const conditionId = request.nextUrl.searchParams.get("conditionId");
  const symptomId = request.nextUrl.searchParams.get("symptomId");
  const subSymptomId = request.nextUrl.searchParams.get("subSymptomId");

  if (symptomId && conditionId) {
    const rid = parseInt(repertoryId || "0");
    const cid = parseInt(conditionId);
    const sid = parseInt(symptomId);
    const subId = subSymptomId ? parseInt(subSymptomId) : 0;

    const rep = (oldRepertory as RepertoryData).repertories.find((r) => r.id === rid);
    if (!rep) return NextResponse.json({ error: "Repertory not found" }, { status: 404 });

    const cond = rep.conditions.find((c) => c.id === cid);
    if (!cond) return NextResponse.json({ error: "Condition not found" }, { status: 404 });

    const symp = cond.symptoms.find((s) => s.id === sid);
    if (!symp) return NextResponse.json({ error: "Symptom not found" }, { status: 404 });

    if (subId > 0) {
      const sub = symp.subSymptoms.find((s: SubSymptom) => s.id === subId);
      const meds = ((sub as SubSymptom & { medicines?: { name: string }[] })?.medicines || []);
      return NextResponse.json(
        { medicines: sortByName(meds) },
        { headers: CACHE_HEADERS }
      );
    }

    const result: Record<string, unknown> = {};
    if (symp.subSymptoms.length > 0) {
      result.subSymptoms = sortByName(symp.subSymptoms);
    }
    if (symp.medicines) {
      result.medicines = sortByName(symp.medicines as { name: string }[]);
    } else {
      result.medicines = [];
    }
    return NextResponse.json(result, { headers: CACHE_HEADERS });
  }

  if (conditionId) {
    const rid = parseInt(repertoryId || "0");
    const cid = parseInt(conditionId);
    const rep = (oldRepertory as RepertoryData).repertories.find((r) => r.id === rid);
    if (!rep) return NextResponse.json({ error: "Repertory not found" }, { status: 404 });
    const cond = rep.conditions.find((c) => c.id === cid);
    if (!cond) return NextResponse.json({ error: "Condition not found" }, { status: 404 });
    const symptoms = sortByName(cond.symptoms).map((s) => ({
      id: s.id,
      name: s.name,
      hasSubSymptoms: s.subSymptoms.length > 0,
      medicineCount: s.medicines?.length || 0,
    }));
    return NextResponse.json({ symptoms }, { headers: CACHE_HEADERS });
  }

  if (repertoryId) {
    const rid = parseInt(repertoryId);
    const rep = (oldRepertory as RepertoryData).repertories.find((r) => r.id === rid);
    if (!rep) return NextResponse.json({ error: "Repertory not found" }, { status: 404 });
    const conditions = sortByName(rep.conditions).map((c) => ({
      id: c.id,
      name: c.name,
      symptomCount: c.symptoms.length,
    }));
    return NextResponse.json({ conditions }, { headers: CACHE_HEADERS });
  }

  if (!cachedRepertories) {
    cachedRepertories = sortByName(
      (oldRepertory as RepertoryData).repertories.map((r) => ({
        id: r.id,
        name: r.name,
        conditionCount: r.conditions.length,
      }))
    );
  }
  return NextResponse.json({ repertories: cachedRepertories }, { headers: CACHE_HEADERS });
}
