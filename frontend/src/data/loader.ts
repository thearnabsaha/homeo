import symptomsJson from "./symptoms.json";
import remediesJson from "./remedies.json";
import rubricsJson from "./rubrics.json";

export type SymptomsData = typeof symptomsJson;
export type RemediesData = typeof remediesJson;
export type RubricsData = Record<string, { remedyId: string; grade: number }[]>;

export const symptomsData: SymptomsData = symptomsJson;
export const remediesData: RemediesData = remediesJson;
export const rubrics: RubricsData = rubricsJson as unknown as RubricsData;

// Pre-built O(1) lookup maps - computed once at module load, reused across requests
export const remedyById = new Map<string, (typeof remediesJson.remedies)[number]>();
for (const r of remediesData.remedies) {
  remedyById.set(r.id, r);
}

type SymptomEntry = { id: string; name: string; type: string; chapterName: string; parentName?: string; [key: string]: unknown };
export const symptomById = new Map<string, SymptomEntry>();
export const chapterById = new Map<string, (typeof symptomsJson.chapters)[number]>();

for (const ch of symptomsData.chapters) {
  chapterById.set(ch.id, ch);
  symptomById.set(ch.id, { ...ch, type: "chapter", chapterName: ch.name });
  for (const sym of ch.symptoms) {
    symptomById.set(sym.id, { ...sym, type: "symptom", chapterName: ch.name });
    const subs = (sym as { subSymptoms?: { id: string; name: string }[] }).subSymptoms;
    if (subs) {
      for (const sub of subs) {
        symptomById.set(sub.id, { ...sub, type: "subSymptom", chapterName: ch.name, parentName: sym.name });
      }
    }
  }
}

// Reverse index: remedyId -> symptomIds (pre-computed for remedy detail pages)
export const remedyToSymptoms = new Map<string, string[]>();
for (const [symId, entries] of Object.entries(rubrics)) {
  if (!Array.isArray(entries)) continue;
  for (const e of entries) {
    let arr = remedyToSymptoms.get(e.remedyId);
    if (!arr) {
      arr = [];
      remedyToSymptoms.set(e.remedyId, arr);
    }
    arr.push(symId);
  }
}

// Pre-built search index: lowercased name -> remedy for fast search
export const remedySearchIndex: { lower: string; abbrLower: string; descLower: string; r: (typeof remediesJson.remedies)[number] }[] =
  remediesData.remedies.map(r => ({
    lower: r.name.toLowerCase(),
    abbrLower: r.abbr.toLowerCase(),
    descLower: r.description.toLowerCase(),
    r,
  }));

// Pre-built symptom search entries
export type SymptomSearchEntry = { id: string; name: string; nameLower: string; type: string; chapter: string; parent?: string };
export const symptomSearchIndex: SymptomSearchEntry[] = [];
for (const ch of symptomsData.chapters) {
  symptomSearchIndex.push({ id: ch.id, name: ch.name, nameLower: ch.name.toLowerCase(), type: "chapter", chapter: ch.name });
  for (const sym of ch.symptoms) {
    symptomSearchIndex.push({ id: sym.id, name: sym.name, nameLower: sym.name.toLowerCase(), type: "symptom", chapter: ch.name });
    const subs = (sym as { subSymptoms?: { id: string; name: string }[] }).subSymptoms;
    if (subs) {
      for (const s of subs) {
        symptomSearchIndex.push({ id: s.id, name: s.name, nameLower: s.name.toLowerCase(), type: "subSymptom", chapter: ch.name, parent: sym.name });
      }
    }
  }
}
