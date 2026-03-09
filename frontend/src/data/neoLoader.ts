import * as fs from "fs";
import * as path from "path";

export type NeoSymptomSearchEntry = {
  id: string;
  name: string;
  nameLower: string;
  type: string;
  chapter: string;
  parent?: string;
};

interface NeoChapter {
  id: string;
  name: string;
  order: number;
  symptoms: { id: string; name: string; subSymptoms: { id: string; name: string }[] }[];
}

interface NeoRemedy {
  id: string;
  name: string;
  abbr: string;
  description: string;
  dosage: string;
  commonSymptoms: string[];
  modalities: { worse: string[]; better: string[] };
}

type NeoRubrics = Record<string, { remedyId: string; grade: number }[]>;
type SymEntry = { id: string; name: string; type: string; chapterName: string; parentName?: string };

let _data: {
  chapters: NeoChapter[];
  remedies: NeoRemedy[];
  rubrics: NeoRubrics;
  remedyById: Map<string, NeoRemedy>;
  symptomById: Map<string, SymEntry>;
  chapterById: Map<string, NeoChapter>;
  remedyToSymptoms: Map<string, string[]>;
  symptomSearchIndex: NeoSymptomSearchEntry[];
  remedySearchIndex: { lower: string; abbrLower: string; descLower: string; r: NeoRemedy }[];
} | null = null;

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").slice(0, 60);
}

function loadData() {
  if (_data) return _data;

  const jsonPath = path.join(process.cwd(), "src", "data", "oldRepertory.json");
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as {
    repertories: {
      id: number; name: string;
      conditions: {
        id: number; name: string;
        symptoms: {
          id: number; name: string;
          medicines?: { id: number; name: string; rank: number }[];
          subSymptoms: {
            id: number; name: string;
            medicines?: { id: number; name: string; rank: number }[];
          }[];
        }[];
      }[];
    }[];
  };

  const chapters: NeoChapter[] = [];
  const remedyMap = new Map<string, NeoRemedy>();
  const remedySymMap = new Map<string, Set<string>>();
  const rubrics: NeoRubrics = {};
  let order = 1;

  for (const rep of raw.repertories) {
    const chId = `neo-${slugify(rep.name)}`;
    const symptoms: NeoChapter["symptoms"] = [];

    for (const cond of rep.conditions) {
      const symId = `${chId}-${slugify(cond.name)}`;
      const subs: { id: string; name: string }[] = [];

      for (const symp of cond.symptoms) {
        const subId = `${symId}-${slugify(symp.name)}`;

        if (symp.subSymptoms?.length) {
          subs.push({ id: subId, name: symp.name });
          for (const sub of symp.subSymptoms) {
            const ssId = `${subId}-${slugify(sub.name)}`;
            subs.push({ id: ssId, name: `${symp.name} > ${sub.name}` });
            if (sub.medicines) regMeds(ssId, sub.medicines, remedyMap, remedySymMap, rubrics);
          }
        } else {
          subs.push({ id: subId, name: symp.name });
        }

        if (symp.medicines) regMeds(subId, symp.medicines, remedyMap, remedySymMap, rubrics);
      }

      symptoms.push({ id: symId, name: cond.name, subSymptoms: subs });
    }

    chapters.push({ id: chId, name: rep.name, order: order++, symptoms });
  }

  const remedies: NeoRemedy[] = [];
  for (const [, rem] of remedyMap) {
    const sIds = remedySymMap.get(rem.id);
    rem.commonSymptoms = sIds ? [...sIds].slice(0, 20) : [];
    remedies.push(rem);
  }

  const symptomById = new Map<string, SymEntry>();
  const chapterById = new Map<string, NeoChapter>();
  for (const ch of chapters) {
    chapterById.set(ch.id, ch);
    symptomById.set(ch.id, { id: ch.id, name: ch.name, type: "chapter", chapterName: ch.name });
    for (const s of ch.symptoms) {
      symptomById.set(s.id, { id: s.id, name: s.name, type: "symptom", chapterName: ch.name });
      for (const sub of s.subSymptoms) {
        symptomById.set(sub.id, { id: sub.id, name: sub.name, type: "subSymptom", chapterName: ch.name, parentName: s.name });
      }
    }
  }

  const remedyToSymptoms = new Map<string, string[]>();
  for (const [symId, entries] of Object.entries(rubrics)) {
    for (const e of entries) {
      let arr = remedyToSymptoms.get(e.remedyId);
      if (!arr) { arr = []; remedyToSymptoms.set(e.remedyId, arr); }
      arr.push(symId);
    }
  }

  const symptomSearchIndex: NeoSymptomSearchEntry[] = [];
  for (const ch of chapters) {
    symptomSearchIndex.push({ id: ch.id, name: ch.name, nameLower: ch.name.toLowerCase(), type: "chapter", chapter: ch.name });
    for (const s of ch.symptoms) {
      symptomSearchIndex.push({ id: s.id, name: s.name, nameLower: s.name.toLowerCase(), type: "symptom", chapter: ch.name });
      for (const sub of s.subSymptoms) {
        symptomSearchIndex.push({ id: sub.id, name: sub.name, nameLower: sub.name.toLowerCase(), type: "subSymptom", chapter: ch.name, parent: s.name });
      }
    }
  }

  const remedySearchIndex = remedies.map((r) => ({
    lower: r.name.toLowerCase(),
    abbrLower: r.abbr.toLowerCase(),
    descLower: r.description.toLowerCase(),
    r,
  }));

  _data = {
    chapters, remedies, rubrics,
    remedyById: new Map(remedies.map((r) => [r.id, r])),
    symptomById, chapterById, remedyToSymptoms,
    symptomSearchIndex, remedySearchIndex,
  };

  return _data;
}

function regMeds(
  symId: string,
  meds: { id: number; name: string; rank: number }[],
  rMap: Map<string, NeoRemedy>,
  rSym: Map<string, Set<string>>,
  rub: NeoRubrics
) {
  if (!rub[symId]) rub[symId] = [];
  for (const m of meds) {
    const rid = `neo-med-${m.id}`;
    if (!rMap.has(rid)) {
      rMap.set(rid, {
        id: rid, name: m.name,
        abbr: m.name.split(" ").map((w) => w[0]).join("").slice(0, 6) + ".",
        description: `${m.name} - Classical homeopathic remedy from the repertory database.`,
        dosage: "30C or as directed by physician",
        commonSymptoms: [], modalities: { worse: [], better: [] },
      });
    }
    if (!rSym.has(rid)) rSym.set(rid, new Set());
    rSym.get(rid)!.add(symId);
    rub[symId].push({ remedyId: rid, grade: Math.min(3, Math.max(1, m.rank)) });
  }
}

export const neoSymptomsData = { get chapters() { return loadData().chapters; } };
export const neoRemediesData = { get remedies() { return loadData().remedies; } };
export function getNeoRubrics() { return loadData().rubrics; }
export function getNeoRemedyById() { return loadData().remedyById; }
export function getNeoSymptomById() { return loadData().symptomById; }
export function getNeoChapterById() { return loadData().chapterById; }
export function getNeoRemedyToSymptoms() { return loadData().remedyToSymptoms; }
export function getNeoSymptomSearchIndex() { return loadData().symptomSearchIndex; }
export function getNeoRemedySearchIndex() { return loadData().remedySearchIndex; }
