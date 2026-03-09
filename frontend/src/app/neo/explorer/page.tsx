"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Home,
  Check,
  Pill,
  Star,
  Trash2,
  Loader2,
  Zap,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useNeoExplorer } from "@/context/NeoExplorerContext";
import { neoApi } from "@/lib/neoApi";
import type { Chapter, SymptomDetail, RankingResult, AIAnalysis } from "@/lib/api";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { translateRepertory } from "@/i18n/repertoryBn";

export default function NeoExplorerPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const isBn = language === "bn";
  const bn = (text: string) => (isBn ? translateRepertory(text) : text);
  const {
    selectedSymptoms,
    activeChapter,
    selectedSymptomId,
    setActiveChapter,
    setSelectedSymptomId,
    toggleSymptom,
    removeSymptom,
    clearSymptoms,
    ranking,
    aiAnalysis,
    setRanking,
    setAiAnalysis,
    saveToHistory,
  } = useNeoExplorer();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [symptomDetail, setSymptomDetail] = useState<SymptomDetail | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingRank, setLoadingRank] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    neoApi.getSymptoms().then((d) => setChapters(d.chapters));
  }, []);

  useEffect(() => {
    if (!selectedSymptomId) { setSymptomDetail(null); return; }
    setLoadingDetail(true);
    neoApi.getSymptomById(selectedSymptomId)
      .then(setSymptomDetail)
      .catch(() => setSymptomDetail(null))
      .finally(() => setLoadingDetail(false));
  }, [selectedSymptomId]);

  const handleFindBest = useCallback(async () => {
    if (selectedSymptoms.length === 0) return;
    setLoadingRank(true);
    try {
      const result = await neoApi.rankRemedies(selectedSymptoms.map((s) => s.id));
      setRanking(result);
    } catch { /* */ }
    setLoadingRank(false);
  }, [selectedSymptoms, setRanking]);

  const handleAIAnalyze = useCallback(async () => {
    if (selectedSymptoms.length === 0) return;
    setLoadingAI(true);
    try {
      const result = await neoApi.analyzeSymptoms(selectedSymptoms.map((s) => s.name), language);
      setAiAnalysis(result);
    } catch { /* */ }
    setLoadingAI(false);
  }, [selectedSymptoms, language, setAiAnalysis]);

  const isSelected = (id: string) => selectedSymptoms.some((s) => s.id === id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <Link href="/neo">
              <Button variant="ghost" size="icon"><Home className="h-4 w-4" /></Button>
            </Link>
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">{isBn ? "নিও এক্সপ্লোরার" : "Neo Explorer"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/neo/consult">
              <Button size="sm" className="text-xs gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" />
                {isBn ? "পরামর্শ" : "Consult"}
              </Button>
            </Link>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "fixed inset-0 z-50 block" : "hidden"} sm:relative sm:block sm:z-auto w-72 border-r border-border bg-background shrink-0`}>
          {sidebarOpen && (
            <div className="flex items-center justify-between p-3 border-b border-border sm:hidden">
              <span className="text-sm font-semibold">{isBn ? "বিভাগসমূহ" : "Chapters"}</span>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
          )}
          <div className="overflow-y-auto h-[calc(100vh-3.5rem)]">
            {chapters.map((ch) => (
              <div key={ch.id}>
                <button
                  onClick={() => { setActiveChapter(ch.id); setSelectedSymptomId(ch.id); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                    activeChapter === ch.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                  }`}
                >
                  <span className="truncate">{bn(ch.name)}</span>
                  <span className="text-[10px] text-muted-foreground">{ch.symptomCount}</span>
                </button>
                {activeChapter === ch.id && (
                  <div className="pl-4 border-l-2 border-primary/20 ml-3">
                    {ch.symptoms.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedSymptomId(s.id); setSidebarOpen(false); }}
                        className={`w-full text-left px-2 py-1.5 text-xs transition-colors truncate ${
                          selectedSymptomId === s.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {bn(s.name)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {!selectedSymptomId ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6 text-center">
              <Sparkles className="h-12 w-12 text-primary/30 mb-4" />
              <h2 className="text-2xl font-bold tracking-tight mb-3">
                {isBn ? "নিও এক্সপ্লোরার" : "Neo Explorer"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBn ? "বাম পাশ থেকে একটি বিভাগ নির্বাচন করুন।" : "Select a chapter from the sidebar."}
              </p>
            </div>
          ) : loadingDetail ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : symptomDetail ? (
            <div className="p-4 sm:p-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4 flex-wrap">
                {symptomDetail.breadcrumb.map((b, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="h-3 w-3" />}
                    <span className={i === symptomDetail.breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                      {bn(b.name)}
                    </span>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold">{bn(symptomDetail.symptom.name)}</h2>
                <button
                  onClick={() => toggleSymptom(symptomDetail.symptom.id, symptomDetail.symptom.name)}
                  className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected(symptomDetail.symptom.id)
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {isSelected(symptomDetail.symptom.id) && <Check className="h-3 w-3" />}
                </button>
              </div>

              {/* Sub-symptoms */}
              {symptomDetail.symptom.subSymptoms && symptomDetail.symptom.subSymptoms.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">{isBn ? "উপ-লক্ষণ" : "Sub-symptoms"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {symptomDetail.symptom.subSymptoms.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSymptomId(sub.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted text-left transition-colors"
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSymptom(sub.id, sub.name); }}
                          className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected(sub.id) ? "bg-primary border-primary text-primary-foreground" : "border-border"
                          }`}
                        >
                          {isSelected(sub.id) && <Check className="h-3 w-3" />}
                        </button>
                        <span className="truncate">{bn(sub.name)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Remedies */}
              {symptomDetail.remedies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    {isBn ? "ওষুধসমূহ" : "Remedies"} ({symptomDetail.remedies.length})
                  </h3>
                  <div className="space-y-1">
                    {symptomDetail.remedies.map((rem) => (
                      <button
                        key={rem.id}
                        onClick={() => router.push(`/neo/remedies/${rem.id}`)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted text-left transition-colors"
                      >
                        <div className="min-w-0">
                          <span className="text-sm font-medium">{bn(rem.name)}</span>
                          <span className="text-xs text-muted-foreground ml-2">{isBn ? "" : rem.abbr}</span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {Array.from({ length: Math.min(rem.strength, 3) }).map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-primary text-primary" />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>

        {/* Right panel */}
        {selectedSymptoms.length > 0 && (
          <aside className="hidden lg:block w-80 border-l border-border bg-card shrink-0 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">{isBn ? "নির্বাচিত লক্ষণ" : "Selected"} ({selectedSymptoms.length})</h3>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={clearSymptoms}>
                  <Trash2 className="h-3 w-3 mr-1" /> {isBn ? "মুছুন" : "Clear"}
                </Button>
              </div>
              <div className="space-y-1 mb-4">
                {selectedSymptoms.map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-muted text-xs">
                    <span className="truncate">{bn(s.name)}</span>
                    <button onClick={() => removeSymptom(s.id)} className="text-muted-foreground hover:text-destructive shrink-0 ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <Button size="sm" className="flex-1 text-xs gap-1" onClick={handleFindBest} disabled={loadingRank}>
                  {loadingRank ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                  {isBn ? "সেরা ওষুধ" : "Find Best"}
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={handleAIAnalyze} disabled={loadingAI}>
                  {loadingAI ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {isBn ? "AI বিশ্লেষণ" : "AI Analyze"}
                </Button>
              </div>

              <Button size="sm" variant="ghost" className="w-full text-xs mb-4" onClick={saveToHistory}>
                {isBn ? "ইতিহাসে সংরক্ষণ" : "Save to History"}
              </Button>

              {ranking && ranking.rankedRemedies.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">{isBn ? "র্যাঙ্কড ওষুধ" : "Ranked Remedies"}</h4>
                  {ranking.rankedRemedies.slice(0, 10).map((r, i) => (
                    <button
                      key={r.id}
                      onClick={() => router.push(`/neo/remedies/${r.id}`)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-left transition-colors"
                    >
                      <span className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                        i < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium truncate block">{bn(r.name)}</span>
                        <ConfidenceBar confidence={r.confidence} />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {aiAnalysis && aiAnalysis.remedies.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">{isBn ? "AI বিশ্লেষণ" : "AI Analysis"}</h4>
                  <p className="text-[10px] text-muted-foreground mb-2">{aiAnalysis.analysis}</p>
                  {aiAnalysis.remedies.map((r, i) => (
                    <div key={i} className="px-2 py-1.5 rounded-lg hover:bg-muted text-xs mb-1">
                      <span className="font-medium">{bn(r.name)}</span>
                      <span className="text-muted-foreground ml-1">({r.confidence}%)</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{r.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
