"use client";

import { useState, useEffect } from "react";
import { ChevronRight, BookmarkIcon, History, Clock, Pill } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/i18n/useTranslation";
import { useNeoBookmarks } from "@/hooks/useNeoBookmarks";
import { neoApi } from "@/lib/neoApi";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { translateRepertory, toBengaliNumeral } from "@/i18n/repertoryBn";
import type { NeoHistoryEntry } from "@/context/NeoExplorerContext";
import type { Chapter } from "@/lib/api";

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
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [chapterFilter, setChapterFilter] = useState("");

  const isBn = language === "bn";
  const num = (n: number) => (isBn ? toBengaliNumeral(n) : String(n));

  useEffect(() => {
    neoApi.getSymptoms().then((data) => {
      setChapters(data.chapters);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredChapters = chapterFilter
    ? chapters.filter(ch =>
        (isBn ? translateRepertory(ch.name) : ch.name).toLowerCase().includes(chapterFilter.toLowerCase())
      )
    : chapters;

  const sortedChapters = [...filteredChapters].sort((a, b) => {
    const aName = isBn ? translateRepertory(a.name) : a.name;
    const bName = isBn ? translateRepertory(b.name) : b.name;
    return aName.localeCompare(bName);
  });

  const handleChapterClick = (id: string) => {
    setExpandedChapter(expandedChapter === id ? null : id);
    onSelectChapter(id);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-background transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t("symptom.categories")} ({num(chapters.length)})
            </h2>

            <input
              type="text"
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              placeholder={t("symptom.filterChapters")}
              className="w-full px-2 py-1.5 mb-2 text-xs rounded border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
            />

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <nav className="space-y-0.5">
                {sortedChapters.map((ch) => {
                  const sortedSymptoms = [...(ch.symptoms || [])].sort((a, b) => {
                    const aName = isBn ? translateRepertory(a.name) : a.name;
                    const bName = isBn ? translateRepertory(b.name) : b.name;
                    return aName.localeCompare(bName);
                  });
                  return (
                    <div key={ch.id}>
                      <button
                        onClick={() => handleChapterClick(ch.id)}
                        className={cn(
                          "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded transition-colors",
                          activeChapter === ch.id
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <span className="truncate">{isBn ? translateRepertory(ch.name) : ch.name}</span>
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 transition-transform flex-shrink-0",
                            expandedChapter === ch.id && "rotate-90"
                          )}
                        />
                      </button>

                      {expandedChapter === ch.id && (
                        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2 animate-fade-in">
                          {sortedSymptoms.map((sym) => (
                            <button
                              key={sym.id}
                              onClick={() => onSelectSymptom(sym.id)}
                              className="block w-full text-left px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded hover:bg-accent/50 truncate"
                            >
                              {isBn ? translateRepertory(sym.name) : sym.name}
                            </button>
                          ))}
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
                      {isBn ? translateRepertory(b.name) : b.name}
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
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 transition-transform",
                      showHistory && "rotate-90"
                    )}
                  />
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
                          <span className="text-[11px] font-medium truncate">
                            {isBn ? translateRepertory(entry.topRemedy) : entry.topRemedy}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {entry.symptoms.slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className="text-[9px] px-1 py-0.5 bg-secondary rounded truncate max-w-[100px]"
                            >
                              {isBn ? translateRepertory(s.name) : s.name}
                            </span>
                          ))}
                          {entry.symptoms.length > 3 && (
                            <span className="text-[9px] text-muted-foreground">
                              +{num(entry.symptoms.length - 3)}
                            </span>
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
