"use client";

import { useState, useEffect } from "react";
import { ChevronRight, BookmarkIcon, History, Clock, Pill, Layers, FolderOpen, Stethoscope } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/i18n/useTranslation";
import { useNeoBookmarks } from "@/hooks/useNeoBookmarks";
import { neoApi } from "@/lib/neoApi";
import type { NeoRepertorySummary } from "@/lib/neoApi";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { translateRepertory, toBengaliNumeral } from "@/i18n/repertoryBn";
import type { NeoHistoryEntry } from "@/context/NeoExplorerContext";

interface NeoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeChapter: string | null;
  onSelectChapter: (id: string) => void;
  onSelectSymptom: (id: string) => void;
  history?: NeoHistoryEntry[];
  onRestoreHistory?: (entry: NeoHistoryEntry) => void;
}

function formatTimestamp(ts: string, language: string) {
  try {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (language === "bn") {
      if (mins < 1) return "এইমাত্র";
      if (mins < 60) return `${mins} মিনিট আগে`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
      const days = Math.floor(hrs / 24);
      if (days < 7) return `${days} দিন আগে`;
      return d.toLocaleDateString("bn-BD");
    }
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  } catch {
    return ts;
  }
}

export function NeoSidebar({
  isOpen,
  onClose,
  activeChapter,
  onSelectChapter,
  onSelectSymptom,
  history = [],
  onRestoreHistory,
}: NeoSidebarProps) {
  const { t, language } = useTranslation();
  const { bookmarks } = useNeoBookmarks();
  const [repertories, setRepertories] = useState<NeoRepertorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRep, setExpandedRep] = useState<string | null>(null);
  const [expandedCond, setExpandedCond] = useState<string | null>(null);
  const [expandedSym, setExpandedSym] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [filter, setFilter] = useState("");

  const isBn = language === "bn";
  const tr = (s: string) => (isBn ? translateRepertory(s) : s);
  const num = (n: number) => (isBn ? toBengaliNumeral(n) : String(n));

  useEffect(() => {
    neoApi.getSymptoms().then((data) => {
      setRepertories(data.chapters);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const sortedName = (a: string, b: string) => tr(a).localeCompare(tr(b), isBn ? "bn" : "en");

  const filteredReps = filter
    ? repertories.filter(r => tr(r.name).toLowerCase().includes(filter.toLowerCase()))
    : repertories;

  const sorted = [...filteredReps].sort((a, b) => sortedName(a.name, b.name));

  const handleRepClick = (id: string) => {
    setExpandedRep(expandedRep === id ? null : id);
    setExpandedCond(null);
    setExpandedSym(null);
    onSelectChapter(id);
  };

  const handleCondClick = (id: string) => {
    setExpandedCond(expandedCond === id ? null : id);
    setExpandedSym(null);
    onSelectSymptom(id);
  };

  const handleSymClick = (id: string, hasSubSymptoms: boolean) => {
    if (hasSubSymptoms) {
      setExpandedSym(expandedSym === id ? null : id);
    }
    onSelectSymptom(id);
  };

  const handleSubClick = (id: string) => {
    onSelectSymptom(id);
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-background/80 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-72 border-r border-border bg-background transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full">
          <div className="p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              <Layers className="h-3 w-3" />
              {t("repertory.repertories")} ({num(repertories.length)})
            </div>

            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={t("symptom.filterChapters")}
              className="w-full px-2 py-1.5 mb-2 text-xs rounded border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
            />

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-full" />
                ))}
              </div>
            ) : (
              <nav className="space-y-0.5">
                {sorted.map((rep) => {
                  const isRepExpanded = expandedRep === rep.id;
                  const sortedConds = [...rep.conditions].sort((a, b) => sortedName(a.name, b.name));

                  return (
                    <div key={rep.id}>
                      {/* Level 1: Repertory */}
                      <button
                        onClick={() => handleRepClick(rep.id)}
                        className={cn(
                          "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded transition-colors",
                          activeChapter === rep.id
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <Layers className="h-3 w-3 shrink-0 opacity-50" />
                          {tr(rep.name)}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-muted-foreground">{num(rep.conditionCount)}</span>
                          <ChevronRight className={cn("h-3 w-3 transition-transform", isRepExpanded && "rotate-90")} />
                        </div>
                      </button>

                      {/* Level 2: Conditions */}
                      {isRepExpanded && (
                        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-1.5 animate-fade-in">
                          {sortedConds.map((cond) => {
                            const isCondExpanded = expandedCond === cond.id;
                            const sortedSyms = [...cond.symptoms].sort((a, b) => sortedName(a.name, b.name));

                            return (
                              <div key={cond.id}>
                                <button
                                  onClick={() => handleCondClick(cond.id)}
                                  className={cn(
                                    "flex items-center justify-between w-full px-2 py-1 text-xs rounded transition-colors",
                                    expandedCond === cond.id
                                      ? "bg-accent/80 text-accent-foreground font-medium"
                                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                                  )}
                                >
                                  <span className="truncate flex items-center gap-1.5">
                                    <FolderOpen className="h-2.5 w-2.5 shrink-0 opacity-50" />
                                    {tr(cond.name)}
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <span className="text-[9px] text-muted-foreground">{num(cond.symptomCount)}</span>
                                    <ChevronRight className={cn("h-2.5 w-2.5 transition-transform", isCondExpanded && "rotate-90")} />
                                  </div>
                                </button>

                                {/* Level 3: Symptoms */}
                                {isCondExpanded && (
                                  <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/60 pl-1.5 animate-fade-in">
                                    {sortedSyms.map((sym) => {
                                      const isSymExpanded = expandedSym === sym.id;
                                      const sortedSubs = [...sym.subSymptoms].sort((a, b) => sortedName(a.name, b.name));

                                      return (
                                        <div key={sym.id}>
                                          <button
                                            onClick={() => handleSymClick(sym.id, sym.hasSubSymptoms)}
                                            className={cn(
                                              "flex items-center justify-between w-full px-1.5 py-0.5 text-[11px] rounded transition-colors",
                                              "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                                            )}
                                          >
                                            <span className="truncate flex items-center gap-1">
                                              <Stethoscope className="h-2.5 w-2.5 shrink-0 opacity-40" />
                                              {tr(sym.name)}
                                            </span>
                                            {sym.hasSubSymptoms && (
                                              <ChevronRight className={cn("h-2.5 w-2.5 shrink-0 transition-transform", isSymExpanded && "rotate-90")} />
                                            )}
                                          </button>

                                          {/* Level 4: Sub-symptoms */}
                                          {isSymExpanded && sortedSubs.length > 0 && (
                                            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/40 pl-1.5 animate-fade-in">
                                              {sortedSubs.map((sub) => (
                                                <button
                                                  key={sub.id}
                                                  onClick={() => handleSubClick(sub.id)}
                                                  className="block w-full text-left px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground rounded hover:bg-accent/25 truncate transition-colors"
                                                >
                                                  {tr(sub.name)}
                                                </button>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            )}

            {bookmarks.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BookmarkIcon className="h-3 w-3" />
                  {t("nav.bookmarks")}
                </h2>
                <div className="space-y-0.5">
                  {bookmarks.slice(0, 8).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => onSelectSymptom(b.id)}
                      className="block w-full text-left px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded hover:bg-accent/50 truncate"
                    >
                      {tr(b.name)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
                >
                  <span className="flex items-center gap-1.5">
                    <History className="h-3 w-3" />
                    {t("history.title")} ({num(history.length)})
                  </span>
                  <ChevronRight className={cn("h-3 w-3 transition-transform", showHistory && "rotate-90")} />
                </button>

                {showHistory && (
                  <div className="space-y-1.5 animate-fade-in">
                    {history.slice(0, 10).map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => onRestoreHistory?.(entry)}
                        className="w-full text-left p-2 rounded border border-border hover:border-foreground/20 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Pill className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-[11px] font-medium truncate">{tr(entry.topRemedy)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {entry.symptoms.slice(0, 3).map((s) => (
                            <span key={s.id} className="text-[9px] px-1 py-0.5 bg-secondary rounded truncate max-w-[100px]">
                              {tr(s.name)}
                            </span>
                          ))}
                          {entry.symptoms.length > 3 && (
                            <span className="text-[9px] text-muted-foreground">+{num(entry.symptoms.length - 3)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                          <Clock className="h-2 w-2" />
                          {formatTimestamp(entry.timestamp, language)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
