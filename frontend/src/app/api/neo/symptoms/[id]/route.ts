import { NextRequest, NextResponse } from "next/server";
import {
  getNeoSymptomById,
  getNeoRubrics,
  getNeoRemedyById,
  getNeoChapterById,
  neoSymptomsData,
} from "@/data/neoLoader";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

function collectChildRubrics(
  symptoms: { id: string; subSymptoms: { id: string }[] }[],
  rubrics: Record<string, { remedyId: string; grade: number }[]>,
  out: { remedyId: string; grade: number }[]
) {
  for (const sym of symptoms) {
    const r = rubrics[sym.id];
    if (r) out.push(...r);
    for (const sub of sym.subSymptoms) {
      const sr = rubrics[sub.id];
      if (sr) out.push(...sr);
    }
  }
}

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return params.then(({ id }) => {
    const symptomById = getNeoSymptomById();
    const rubrics = getNeoRubrics();
    const remedyById = getNeoRemedyById();
    const chapterById = getNeoChapterById();
    const chapters = neoSymptomsData.chapters;

    const found = symptomById.get(id);
    if (!found) {
      return NextResponse.json({ error: "Symptom not found" }, { status: 404 });
    }

    let subSymptoms: { id: string; name: string }[] = [];
    const allRubricEntries: { remedyId: string; grade: number }[] = [];

    if (found.type === "repertory") {
      const ch = chapterById.get(id);
      if (ch) {
        subSymptoms = ch.conditions.map((c) => ({ id: c.id, name: c.name }));
        for (const cond of ch.conditions) collectChildRubrics(cond.symptoms, rubrics, allRubricEntries);
      }
    } else if (found.type === "condition") {
      outer_cond: for (const ch of chapters) {
        for (const cond of ch.conditions) {
          if (cond.id === id) {
            subSymptoms = cond.symptoms.map((s) => ({ id: s.id, name: s.name }));
            collectChildRubrics(cond.symptoms, rubrics, allRubricEntries);
            break outer_cond;
          }
        }
      }
    } else if (found.type === "symptom") {
      outer_sym: for (const ch of chapters) {
        for (const cond of ch.conditions) {
          for (const sym of cond.symptoms) {
            if (sym.id === id) {
              subSymptoms = sym.subSymptoms.map((s) => ({ id: s.id, name: s.name }));
              const r = rubrics[sym.id];
              if (r) allRubricEntries.push(...r);
              for (const sub of sym.subSymptoms) {
                const sr = rubrics[sub.id];
                if (sr) allRubricEntries.push(...sr);
              }
              break outer_sym;
            }
          }
        }
      }
    } else if (found.type === "subSymptom") {
      const r = rubrics[id];
      if (r) allRubricEntries.push(...r);
    }

    // Aggregate: highest grade per remedy
    const remedyGrades = new Map<string, number>();
    for (const entry of allRubricEntries) {
      const existing = remedyGrades.get(entry.remedyId) || 0;
      if (entry.grade > existing) remedyGrades.set(entry.remedyId, entry.grade);
    }

    const symptomRemedies = [...remedyGrades.entries()]
      .map(([remedyId, grade]) => {
        const remedy = remedyById.get(remedyId);
        return remedy
          ? { id: remedy.id, name: remedy.name, abbr: remedy.abbr, strength: grade, description: remedy.description }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b as { strength: number }).strength - (a as { strength: number }).strength)
      .slice(0, 200);

    const symptomData = { id: found.id, name: found.name, type: found.type, subSymptoms };

    // Breadcrumb with navigable IDs
    const breadcrumb: { id: string; name: string }[] = [];
    if (found.type === "repertory") {
      breadcrumb.push({ id: found.id, name: found.name });
    } else if (found.type === "condition") {
      for (const ch of chapters) {
        if (ch.name === found.repertoryName) { breadcrumb.push({ id: ch.id, name: ch.name }); break; }
      }
      breadcrumb.push({ id: found.id, name: found.name });
    } else if (found.type === "symptom") {
      for (const ch of chapters) {
        if (ch.name === found.repertoryName) {
          breadcrumb.push({ id: ch.id, name: ch.name });
          for (const cond of ch.conditions) {
            if (cond.name === found.conditionName) { breadcrumb.push({ id: cond.id, name: cond.name }); break; }
          }
          break;
        }
      }
      breadcrumb.push({ id: found.id, name: found.name });
    } else if (found.type === "subSymptom") {
      for (const ch of chapters) {
        if (ch.name === found.repertoryName) {
          breadcrumb.push({ id: ch.id, name: ch.name });
          for (const cond of ch.conditions) {
            if (cond.name === found.conditionName) {
              breadcrumb.push({ id: cond.id, name: cond.name });
              for (const sym of cond.symptoms) {
                if (sym.name === found.symptomName) { breadcrumb.push({ id: sym.id, name: sym.name }); break; }
              }
              break;
            }
          }
          break;
        }
      }
      breadcrumb.push({ id: found.id, name: found.name });
    }

    return NextResponse.json(
      { symptom: symptomData, breadcrumb, remedies: symptomRemedies },
      { headers: CACHE_HEADERS }
    );
  });
}
