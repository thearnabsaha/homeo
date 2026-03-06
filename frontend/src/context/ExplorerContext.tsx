"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { RankingResult, AIAnalysis } from "@/lib/api";

const STORAGE_KEY = "repertoryai-explorer-state";
const HISTORY_KEY = "repertoryai-history";

export interface HistoryEntry {
  id: string;
  symptoms: { id: string; name: string }[];
  ranking: RankingResult | null;
  aiAnalysis: AIAnalysis | null;
  topRemedy: string;
  timestamp: string;
}

interface ExplorerState {
  selectedSymptoms: { id: string; name: string }[];
  activeChapter: string | null;
  selectedSymptomId: string | null;
  ranking: RankingResult | null;
  aiAnalysis: AIAnalysis | null;
}

interface ExplorerContextValue extends ExplorerState {
  setSelectedSymptoms: (s: { id: string; name: string }[]) => void;
  toggleSymptom: (id: string, name: string) => void;
  removeSymptom: (id: string) => void;
  clearSymptoms: () => void;
  setActiveChapter: (id: string | null) => void;
  setSelectedSymptomId: (id: string | null) => void;
  setRanking: (r: RankingResult | null) => void;
  setAiAnalysis: (a: AIAnalysis | null) => void;
  saveToHistory: () => void;
  history: HistoryEntry[];
  restoreHistory: (entry: HistoryEntry) => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null);

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [selectedSymptoms, setSelectedSymptomsRaw] = useState<{ id: string; name: string }[]>([]);
  const [activeChapter, setActiveChapterRaw] = useState<string | null>(null);
  const [selectedSymptomId, setSelectedSymptomIdRaw] = useState<string | null>(null);
  const [ranking, setRankingRaw] = useState<RankingResult | null>(null);
  const [aiAnalysis, setAiAnalysisRaw] = useState<AIAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedSymptoms) setSelectedSymptomsRaw(parsed.selectedSymptoms);
        if (parsed.activeChapter) setActiveChapterRaw(parsed.activeChapter);
        if (parsed.selectedSymptomId) setSelectedSymptomIdRaw(parsed.selectedSymptomId);
        if (parsed.ranking) setRankingRaw(parsed.ranking);
        if (parsed.aiAnalysis) setAiAnalysisRaw(parsed.aiAnalysis);
      }
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setHistory(JSON.parse(hist));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((state: Partial<ExplorerState>) => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...state }));
    } catch {
      // storage full or unavailable
    }
  }, []);

  const setSelectedSymptoms = useCallback((s: { id: string; name: string }[]) => {
    setSelectedSymptomsRaw(s);
    persist({ selectedSymptoms: s });
  }, [persist]);

  const toggleSymptom = useCallback((id: string, name: string) => {
    setSelectedSymptomsRaw((prev) => {
      const exists = prev.find((s) => s.id === id);
      const next = exists ? prev.filter((s) => s.id !== id) : [...prev, { id, name }];
      persist({ selectedSymptoms: next });
      return next;
    });
  }, [persist]);

  const removeSymptom = useCallback((id: string) => {
    setSelectedSymptomsRaw((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persist({ selectedSymptoms: next });
      return next;
    });
  }, [persist]);

  const clearSymptoms = useCallback(() => {
    setSelectedSymptomsRaw([]);
    setRankingRaw(null);
    setAiAnalysisRaw(null);
    persist({ selectedSymptoms: [], ranking: null, aiAnalysis: null });
  }, [persist]);

  const setActiveChapter = useCallback((id: string | null) => {
    setActiveChapterRaw(id);
    persist({ activeChapter: id });
  }, [persist]);

  const setSelectedSymptomId = useCallback((id: string | null) => {
    setSelectedSymptomIdRaw(id);
    persist({ selectedSymptomId: id });
  }, [persist]);

  const setRanking = useCallback((r: RankingResult | null) => {
    setRankingRaw(r);
    persist({ ranking: r });
  }, [persist]);

  const setAiAnalysis = useCallback((a: AIAnalysis | null) => {
    setAiAnalysisRaw(a);
    persist({ aiAnalysis: a });
  }, [persist]);

  const saveToHistory = useCallback(() => {
    if (selectedSymptoms.length === 0) return;
    const topRemedy = ranking?.rankedRemedies?.[0]?.name
      || aiAnalysis?.remedies?.[0]?.name
      || "—";
    const entry: HistoryEntry = {
      id: Date.now().toString(36),
      symptoms: [...selectedSymptoms],
      ranking: ranking,
      aiAnalysis: aiAnalysis,
      topRemedy,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [selectedSymptoms, ranking, aiAnalysis]);

  const restoreHistory = useCallback((entry: HistoryEntry) => {
    setSelectedSymptomsRaw(entry.symptoms);
    setRankingRaw(entry.ranking);
    setAiAnalysisRaw(entry.aiAnalysis);
    persist({
      selectedSymptoms: entry.symptoms,
      ranking: entry.ranking,
      aiAnalysis: entry.aiAnalysis,
    });
  }, [persist]);

  const deleteHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
  }, []);

  if (!hydrated) return null;

  return (
    <ExplorerContext.Provider
      value={{
        selectedSymptoms,
        activeChapter,
        selectedSymptomId,
        ranking,
        aiAnalysis,
        setSelectedSymptoms,
        toggleSymptom,
        removeSymptom,
        clearSymptoms,
        setActiveChapter,
        setSelectedSymptomId,
        setRanking,
        setAiAnalysis,
        saveToHistory,
        history,
        restoreHistory,
        deleteHistory,
        clearHistory,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
}

export function useExplorer() {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error("useExplorer must be used within ExplorerProvider");
  return ctx;
}
