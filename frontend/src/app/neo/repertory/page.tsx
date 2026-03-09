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
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Repertory { id: number; name: string; conditionCount: number; }
interface Condition { id: number; name: string; symptomCount: number; }
interface Symptom { id: number; name: string; hasSubSymptoms: boolean; medicineCount: number; }
interface SubSymptom { id: number; name: string; symptomsTypeID: number; }
interface Medicine { id: number; name: string; rank: number; repertory: string; condition: string; symptom: string; subSymptom: string; }
interface SelectedMedicine { symptomName: string; subSymptomName?: string; medicines: Medicine[]; }

export default function NeoRepertoryPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const bn = useCallback((text: string) => (isBn ? translateRepertory(text) : text), [isBn]);
  const num = useCallback((n: number) => (isBn ? toBengaliNumeral(n) : String(n)), [isBn]);

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
  const [aggregated, setAggregated] = useState<{ name: string; rank: number; count: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/repertory").then((r) => r.json()).then((d) => setRepertories(d.repertories || []));
  }, []);

  const sorted = <T extends { name: string }>(arr: T[]) =>
    [...arr].sort((a, b) => bn(a.name).localeCompare(bn(b.name), isBn ? "bn" : "en"));

  const sortedRepertories = useMemo(() => sorted(repertories), [repertories, bn, isBn]);
  const sortedConditions = useMemo(() => sorted(conditions), [conditions, bn, isBn]);
  const sortedSymptoms = useMemo(() => sorted(symptoms), [symptoms, bn, isBn]);
  const sortedSubSymptoms = useMemo(() => sorted(subSymptoms), [subSymptoms, bn, isBn]);

  const selectRepertory = useCallback(async (rep: Repertory) => {
    setSelectedRep(rep); setSelectedCond(null); setSelectedSymp(null); setSelectedSub(null);
    setConditions([]); setSymptoms([]); setSubSymptoms([]); setMedicines([]);
    setLoading(true);
    const res = await fetch(`/api/repertory?repertoryId=${rep.id}`);
    setConditions((await res.json()).conditions || []);
    setLoading(false);
  }, []);

  const selectCondition = useCallback(async (cond: Condition) => {
    setSelectedCond(cond); setSelectedSymp(null); setSelectedSub(null);
    setSymptoms([]); setSubSymptoms([]); setMedicines([]);
    if (!selectedRep) return;
    setLoading(true);
    const res = await fetch(`/api/repertory?repertoryId=${selectedRep.id}&conditionId=${cond.id}`);
    setSymptoms((await res.json()).symptoms || []);
    setLoading(false);
  }, [selectedRep]);

  const selectSymptom = useCallback(async (symp: Symptom) => {
    setSelectedSymp(symp); setSelectedSub(null); setSubSymptoms([]); setMedicines([]);
    if (!selectedRep || !selectedCond) return;
    setLoading(true);
    const res = await fetch(`/api/repertory?repertoryId=${selectedRep.id}&conditionId=${selectedCond.id}&symptomId=${symp.id}`);
    const data = await res.json();
    if (data.subSymptoms?.length > 0) setSubSymptoms(data.subSymptoms);
    if (data.medicines?.length > 0) { setMedicines(data.medicines); addSel(symp.name, undefined, data.medicines); }
    setLoading(false);
  }, [selectedRep, selectedCond]);

  const selectSubSymptom = useCallback(async (sub: SubSymptom) => {
    setSelectedSub(sub); setMedicines([]);
    if (!selectedRep || !selectedCond || !selectedSymp) return;
    setLoading(true);
    const res = await fetch(`/api/repertory?repertoryId=${selectedRep.id}&conditionId=${selectedCond.id}&symptomId=${selectedSymp.id}&subSymptomId=${sub.id}`);
    const data = await res.json();
    if (data.medicines?.length > 0) { setMedicines(data.medicines); addSel(selectedSymp.name, sub.name, data.medicines); }
    setLoading(false);
  }, [selectedRep, selectedCond, selectedSymp]);

  const addSel = (sn: string, ssn: string | undefined, m: Medicine[]) => {
    setAllSelections((prev) => { const next = [...prev, { symptomName: sn, subSymptomName: ssn, medicines: m }]; aggregate(next); return next; });
  };

  const aggregate = (sels: SelectedMedicine[]) => {
    const map = new Map<string, { rank: number; count: number }>();
    for (const s of sels) for (const m of s.medicines) {
      const e = map.get(m.name);
      if (e) { e.rank += m.rank; e.count += 1; } else map.set(m.name, { rank: m.rank, count: 1 });
    }
    setAggregated(Array.from(map.entries()).map(([name, { rank, count }]) => ({ name, rank, count })).sort((a, b) => b.count - a.count || b.rank - a.rank));
  };

  const resetAll = () => {
    setSelectedRep(null); setSelectedCond(null); setSelectedSymp(null); setSelectedSub(null);
    setConditions([]); setSymptoms([]); setSubSymptoms([]); setMedicines([]);
    setAllSelections([]); setAggregated([]);
  };

  const Col = ({ icon: Icon, label, count, items, selected, onSelect, placeholder }: {
    icon: React.ElementType; label: string; count: number;
    items: { id: number; name: string; extra?: string | number; arrow?: boolean }[];
    selected: number | null; onSelect: (item: { id: number; name: string }) => void; placeholder: string;
  }) => (
    <div className="overflow-y-auto max-h-[40vh] sm:max-h-[calc(100vh-8rem)]">
      <div className="sticky top-0 bg-card border-b border-border px-3 py-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Icon className="h-3.5 w-3.5" /> {label} ({num(count)})
        </div>
      </div>
      <div className="p-1">
        {items.length === 0 && !loading && <p className="text-xs text-muted-foreground p-3">{placeholder}</p>}
        {items.map((item) => (
          <button key={item.id} onClick={() => onSelect(item as { id: number; name: string })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
              selected === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}>
            <span className="truncate">{bn(item.name)}</span>
            {item.extra !== undefined && <span className={`text-[10px] shrink-0 ml-1 ${selected === item.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{typeof item.extra === 'number' ? num(item.extra) : item.extra}</span>}
            {item.arrow && <ChevronRight className={`h-3 w-3 shrink-0 ${selected === item.id ? "text-primary-foreground/60" : "text-muted-foreground"}`} />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <Link href="/neo"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">{isBn ? "নিও রেপার্টরি" : "Neo Repertory"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={resetAll}>
              <RotateCcw className="h-3 w-3" /> {t("repertory.reset")}
            </Button>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-card px-3 sm:px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          <button onClick={resetAll} className="hover:text-foreground">{t("repertory.allRepertories")}</button>
          {selectedRep && <><ChevronRight className="h-3 w-3" /><button onClick={() => selectRepertory(selectedRep)} className="text-foreground font-medium">{bn(selectedRep.name)}</button></>}
          {selectedCond && <><ChevronRight className="h-3 w-3" /><button onClick={() => selectCondition(selectedCond)} className="text-foreground font-medium">{bn(selectedCond.name)}</button></>}
          {selectedSymp && <><ChevronRight className="h-3 w-3" /><span className="text-foreground font-medium">{bn(selectedSymp.name)}</span></>}
          {selectedSub && <><ChevronRight className="h-3 w-3" /><span className="text-foreground font-medium">{bn(selectedSub.name)}</span></>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border min-h-[60vh]">
            <Col icon={Layers} label={t("repertory.repertories")} count={repertories.length}
              items={sortedRepertories.map((r) => ({ ...r, extra: r.conditionCount }))}
              selected={selectedRep?.id ?? null} onSelect={(r) => selectRepertory(r as Repertory)} placeholder={t("repertory.selectRepertory")} />
            <Col icon={FolderOpen} label={t("repertory.conditions")} count={conditions.length}
              items={sortedConditions.map((c) => ({ ...c, extra: (c as Condition).symptomCount }))}
              selected={selectedCond?.id ?? null} onSelect={(c) => selectCondition(c as Condition)} placeholder={t("repertory.selectRepertory")} />
            <Col icon={Stethoscope} label={t("repertory.symptoms")} count={symptoms.length}
              items={sortedSymptoms.map((s) => ({ ...s, arrow: (s as Symptom).hasSubSymptoms }))}
              selected={selectedSymp?.id ?? null} onSelect={(s) => selectSymptom(s as Symptom)} placeholder={t("repertory.selectCondition")} />
            <Col icon={Pill} label={t("repertory.subSymptoms")} count={subSymptoms.length}
              items={sortedSubSymptoms.map((s) => ({ ...s }))}
              selected={selectedSub?.id ?? null} onSelect={(s) => selectSubSymptom(s as SubSymptom)} placeholder={t("repertory.selectSymptom")} />
          </div>

          {medicines.length > 0 && (
            <div className="border-t border-border p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Pill className="h-4 w-4" /> {t("repertory.medicinesFor")}: {selectedSub ? bn(selectedSub.name) : selectedSymp ? bn(selectedSymp.name) : ""}
              </h3>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">#</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t("repertory.medicine")}</th>
                  <th className="pb-2 font-medium text-muted-foreground">{t("repertory.rank")}</th>
                </tr></thead>
                <tbody>
                  {medicines.map((med, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground">{num(i + 1)}</td>
                      <td className="py-2 font-medium">{med.name}</td>
                      <td className="py-2"><div className="flex gap-0.5">{Array.from({ length: Math.min(med.rank, 5) }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-primary text-primary" />
                      ))}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {allSelections.length > 0 && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-8rem)]">
            <div className="sticky top-0 bg-card border-b border-border px-4 py-3 z-10">
              <h3 className="text-sm font-bold">{t("repertory.recommended")}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{num(allSelections.length)} {t("repertory.selections")}</p>
            </div>
            <div className="p-3">
              {aggregated.slice(0, 20).map((med, i) => (
                <div key={med.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${i < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{num(i + 1)}</span>
                    <span className="text-sm font-medium truncate">{med.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground">{num(med.count)}x</span>
                    <span className="text-xs font-semibold bg-secondary px-1.5 py-0.5 rounded">{num(med.rank)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-4 py-3">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">{t("repertory.history")}</h4>
              {allSelections.map((sel, i) => (
                <div key={i} className="text-[10px] text-muted-foreground py-1 border-b border-border/30 last:border-0">
                  {bn(sel.symptomName)}{sel.subSymptomName ? ` > ${bn(sel.subSymptomName)}` : ""} <span className="text-foreground font-medium">({num(sel.medicines.length)} {t("repertory.medicines")})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
