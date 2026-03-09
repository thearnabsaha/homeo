"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { translateRepertory, toBengaliNumeral } from "@/i18n/repertoryBn";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Layers,
  FolderOpen,
  Stethoscope,
  Pill,
  Star,
  RotateCcw,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Repertory {
  id: number;
  name: string;
  conditionCount: number;
}
interface Condition {
  id: number;
  name: string;
  symptomCount: number;
}
interface Symptom {
  id: number;
  name: string;
  hasSubSymptoms: boolean;
  medicineCount: number;
}
interface SubSymptom {
  id: number;
  name: string;
  symptomsTypeID: number;
}
interface Medicine {
  id: number;
  name: string;
  rank: number;
  repertory: string;
  condition: string;
  symptom: string;
  subSymptom: string;
}
interface SelectedMedicine {
  symptomName: string;
  subSymptomName?: string;
  medicines: Medicine[];
}

export default function RepertoryPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const bn = useCallback(
    (text: string) => (isBn ? translateRepertory(text) : text),
    [isBn]
  );
  const num = useCallback(
    (n: number) => (isBn ? toBengaliNumeral(n) : String(n)),
    [isBn]
  );

  const [repertories, setRepertories] = useState<Repertory[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [subSymptoms, setSubSymptoms] = useState<SubSymptom[]>([]);

  const [selectedRep, setSelectedRep] = useState<Repertory | null>(null);
  const [selectedCond, setSelectedCond] = useState<Condition | null>(null);
  const [selectedSymp, setSelectedSymp] = useState<Symptom | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubSymptom | null>(null);

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [allSelections, setAllSelections] = useState<SelectedMedicine[]>([]);
  const [aggregated, setAggregated] = useState<
    { name: string; rank: number; count: number }[]
  >([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/repertory")
      .then((r) => r.json())
      .then((d) => setRepertories(d.repertories || []));
  }, []);

  const sortedRepertories = useMemo(
    () =>
      [...repertories].sort((a, b) =>
        bn(a.name).localeCompare(bn(b.name), isBn ? "bn" : "en")
      ),
    [repertories, bn, isBn]
  );
  const sortedConditions = useMemo(
    () =>
      [...conditions].sort((a, b) =>
        bn(a.name).localeCompare(bn(b.name), isBn ? "bn" : "en")
      ),
    [conditions, bn, isBn]
  );
  const sortedSymptoms = useMemo(
    () =>
      [...symptoms].sort((a, b) =>
        bn(a.name).localeCompare(bn(b.name), isBn ? "bn" : "en")
      ),
    [symptoms, bn, isBn]
  );
  const sortedSubSymptoms = useMemo(
    () =>
      [...subSymptoms].sort((a, b) =>
        bn(a.name).localeCompare(bn(b.name), isBn ? "bn" : "en")
      ),
    [subSymptoms, bn, isBn]
  );

  const selectRepertory = useCallback(async (rep: Repertory) => {
    setSelectedRep(rep);
    setSelectedCond(null);
    setSelectedSymp(null);
    setSelectedSub(null);
    setConditions([]);
    setSymptoms([]);
    setSubSymptoms([]);
    setMedicines([]);
    setLoading(true);
    const res = await fetch(`/api/repertory?repertoryId=${rep.id}`);
    const data = await res.json();
    setConditions(data.conditions || []);
    setLoading(false);
  }, []);

  const selectCondition = useCallback(
    async (cond: Condition) => {
      setSelectedCond(cond);
      setSelectedSymp(null);
      setSelectedSub(null);
      setSymptoms([]);
      setSubSymptoms([]);
      setMedicines([]);
      if (!selectedRep) return;
      setLoading(true);
      const res = await fetch(
        `/api/repertory?repertoryId=${selectedRep.id}&conditionId=${cond.id}`
      );
      const data = await res.json();
      setSymptoms(data.symptoms || []);
      setLoading(false);
    },
    [selectedRep]
  );

  const selectSymptom = useCallback(
    async (symp: Symptom) => {
      setSelectedSymp(symp);
      setSelectedSub(null);
      setSubSymptoms([]);
      setMedicines([]);
      if (!selectedRep || !selectedCond) return;
      setLoading(true);
      const res = await fetch(
        `/api/repertory?repertoryId=${selectedRep.id}&conditionId=${selectedCond.id}&symptomId=${symp.id}`
      );
      const data = await res.json();
      if (data.subSymptoms && data.subSymptoms.length > 0) {
        setSubSymptoms(data.subSymptoms);
      }
      if (data.medicines && data.medicines.length > 0) {
        setMedicines(data.medicines);
        addToSelections(symp.name, undefined, data.medicines);
      }
      setLoading(false);
    },
    [selectedRep, selectedCond]
  );

  const selectSubSymptom = useCallback(
    async (sub: SubSymptom) => {
      setSelectedSub(sub);
      setMedicines([]);
      if (!selectedRep || !selectedCond || !selectedSymp) return;
      setLoading(true);
      const res = await fetch(
        `/api/repertory?repertoryId=${selectedRep.id}&conditionId=${selectedCond.id}&symptomId=${selectedSymp.id}&subSymptomId=${sub.id}`
      );
      const data = await res.json();
      if (data.medicines && data.medicines.length > 0) {
        setMedicines(data.medicines);
        addToSelections(selectedSymp.name, sub.name, data.medicines);
      }
      setLoading(false);
    },
    [selectedRep, selectedCond, selectedSymp]
  );

  const addToSelections = (
    symptomName: string,
    subSymptomName: string | undefined,
    meds: Medicine[]
  ) => {
    setAllSelections((prev) => {
      const next = [...prev, { symptomName, subSymptomName, medicines: meds }];
      aggregateResults(next);
      return next;
    });
  };

  const aggregateResults = (selections: SelectedMedicine[]) => {
    const map = new Map<string, { rank: number; count: number }>();
    for (const sel of selections) {
      for (const med of sel.medicines) {
        const existing = map.get(med.name);
        if (existing) {
          existing.rank += med.rank;
          existing.count += 1;
        } else {
          map.set(med.name, { rank: med.rank, count: 1 });
        }
      }
    }
    const arr = Array.from(map.entries())
      .map(([name, { rank, count }]) => ({ name, rank, count }))
      .sort((a, b) => b.count - a.count || b.rank - a.rank);
    setAggregated(arr);
  };

  const resetAll = () => {
    setSelectedRep(null);
    setSelectedCond(null);
    setSelectedSymp(null);
    setSelectedSub(null);
    setConditions([]);
    setSymptoms([]);
    setSubSymptoms([]);
    setMedicines([]);
    setAllSelections([]);
    setAggregated([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <BookOpen className="h-5 w-5 text-foreground" />
            <span className="font-bold text-sm">{t("repertory.title")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={resetAll}
            >
              <RotateCcw className="h-3 w-3" />
              {t("repertory.reset")}
            </Button>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card px-3 sm:px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          <button
            onClick={resetAll}
            className="hover:text-foreground transition-colors"
          >
            {t("repertory.allRepertories")}
          </button>
          {selectedRep && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <button
                onClick={() => selectRepertory(selectedRep)}
                className="hover:text-foreground transition-colors text-foreground font-medium"
              >
                {bn(selectedRep.name)}
              </button>
            </>
          )}
          {selectedCond && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <button
                onClick={() => selectCondition(selectedCond)}
                className="hover:text-foreground transition-colors text-foreground font-medium"
              >
                {bn(selectedCond.name)}
              </button>
            </>
          )}
          {selectedSymp && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-foreground font-medium">
                {bn(selectedSymp.name)}
              </span>
            </>
          )}
          {selectedSub && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-foreground font-medium">
                {bn(selectedSub.name)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left: Navigation columns */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border min-h-[60vh]">
            {/* Column 1: Repertories */}
            <div className="overflow-y-auto max-h-[40vh] sm:max-h-[calc(100vh-8rem)]">
              <div className="sticky top-0 bg-card border-b border-border px-3 py-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Layers className="h-3.5 w-3.5" />
                  {t("repertory.repertories")} ({num(repertories.length)})
                </div>
              </div>
              <div className="p-1">
                {sortedRepertories.map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => selectRepertory(rep)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                      selectedRep?.id === rep.id
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="truncate">{bn(rep.name)}</span>
                    <span
                      className={`text-[10px] shrink-0 ml-1 ${
                        selectedRep?.id === rep.id
                          ? "text-background/60"
                          : "text-muted-foreground"
                      }`}
                    >
                      {num(rep.conditionCount)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Conditions */}
            <div className="overflow-y-auto max-h-[40vh] sm:max-h-[calc(100vh-8rem)]">
              <div className="sticky top-0 bg-card border-b border-border px-3 py-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <FolderOpen className="h-3.5 w-3.5" />
                  {t("repertory.conditions")} ({num(conditions.length)})
                </div>
              </div>
              <div className="p-1">
                {conditions.length === 0 && !loading && (
                  <p className="text-xs text-muted-foreground p-3">
                    {t("repertory.selectRepertory")}
                  </p>
                )}
                {sortedConditions.map((cond) => (
                  <button
                    key={cond.id}
                    onClick={() => selectCondition(cond)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      selectedCond?.id === cond.id
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="truncate">{bn(cond.name)}</span>
                    <span
                      className={`text-[10px] shrink-0 ml-1 ${
                        selectedCond?.id === cond.id
                          ? "text-background/60"
                          : "text-muted-foreground"
                      }`}
                    >
                      {num(cond.symptomCount)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Symptoms */}
            <div className="overflow-y-auto max-h-[40vh] sm:max-h-[calc(100vh-8rem)]">
              <div className="sticky top-0 bg-card border-b border-border px-3 py-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {t("repertory.symptoms")} ({num(symptoms.length)})
                </div>
              </div>
              <div className="p-1">
                {symptoms.length === 0 && !loading && (
                  <p className="text-xs text-muted-foreground p-3">
                    {t("repertory.selectCondition")}
                  </p>
                )}
                {sortedSymptoms.map((symp) => (
                  <button
                    key={symp.id}
                    onClick={() => selectSymptom(symp)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      selectedSymp?.id === symp.id
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="truncate">{bn(symp.name)}</span>
                    {symp.hasSubSymptoms && (
                      <ChevronRight
                        className={`h-3 w-3 shrink-0 ${
                          selectedSymp?.id === symp.id
                            ? "text-background/60"
                            : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 4: Sub-symptoms */}
            <div className="overflow-y-auto max-h-[40vh] sm:max-h-[calc(100vh-8rem)]">
              <div className="sticky top-0 bg-card border-b border-border px-3 py-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Pill className="h-3.5 w-3.5" />
                  {t("repertory.subSymptoms")} ({num(subSymptoms.length)})
                </div>
              </div>
              <div className="p-1">
                {subSymptoms.length === 0 && !loading && (
                  <p className="text-xs text-muted-foreground p-3">
                    {t("repertory.selectSymptom")}
                  </p>
                )}
                {sortedSubSymptoms.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => selectSubSymptom(sub)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSub?.id === sub.id
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    }`}
                  >
                    {bn(sub.name)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current medicines */}
          {medicines.length > 0 && (
            <div className="border-t border-border p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Pill className="h-4 w-4" />
                {t("repertory.medicinesFor")}:{" "}
                {selectedSub ? bn(selectedSub.name) : selectedSymp ? bn(selectedSymp.name) : ""}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 font-medium text-muted-foreground">
                        #
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground">
                        {t("repertory.medicine")}
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground">
                        {t("repertory.rank")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 text-muted-foreground">
                          {num(i + 1)}
                        </td>
                        <td className="py-2 font-medium">{med.name}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({
                              length: Math.min(med.rank, 5),
                            }).map((_, j) => (
                              <Star
                                key={j}
                                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Aggregated results */}
        {allSelections.length > 0 && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-8rem)]">
            <div className="sticky top-0 bg-card border-b border-border px-4 py-3 z-10">
              <h3 className="text-sm font-bold">
                {t("repertory.recommended")}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {num(allSelections.length)} {t("repertory.selections")}{" "}
                {isBn ? "ভিত্তিতে" : "based on"}
              </p>
            </div>
            <div className="p-3">
              {aggregated.slice(0, 20).map((med, i) => (
                <div
                  key={med.name}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-xs font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        i < 3
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {num(i + 1)}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {med.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground">
                      {num(med.count)}x
                    </span>
                    <span className="text-xs font-semibold bg-secondary px-1.5 py-0.5 rounded">
                      {num(med.rank)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection history */}
            <div className="border-t border-border px-4 py-3">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                {t("repertory.history")}
              </h4>
              {allSelections.map((sel, i) => (
                <div
                  key={i}
                  className="text-[10px] text-muted-foreground py-1 border-b border-border/30 last:border-0"
                >
                  {bn(sel.symptomName)}
                  {sel.subSymptomName
                    ? ` > ${bn(sel.subSymptomName)}`
                    : ""}{" "}
                  <span className="text-foreground font-medium">
                    ({num(sel.medicines.length)} {t("repertory.medicines")})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
