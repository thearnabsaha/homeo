"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronDown, Square, CheckSquare, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { neoApi } from "@/lib/neoApi";
import { cn } from "@/lib/utils";
import { translateRepertory, medDescBn } from "@/i18n/repertoryBn";
import { useNeoBookmarks } from "@/hooks/useNeoBookmarks";
import type { SymptomDetail, RemedyMatch } from "@/lib/types";

interface NeoSymptomTreeProps {
  selectedSymptomId: string | null;
  selectedSymptoms: string[];
  onToggleSymptom: (id: string, name: string) => void;
  onViewRemedies: (symptomId: string) => void;
  onViewRemedy?: (remedyId: string) => void;
}

function NeoBookmarkButton({ id, name, type }: { id: string; name: string; type: "symptom" | "remedy" }) {
  const { isBookmarked, toggleBookmark } = useNeoBookmarks();
  const { t } = useTranslation();
  const bookmarked = isBookmarked(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleBookmark(id, name, type);
      }}
      className={cn(
        "p-1.5 rounded transition-colors",
        bookmarked ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
      title={bookmarked ? t("bookmark.remove") : t("bookmark.add")}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function NeoSymptomTree({
  selectedSymptomId,
  selectedSymptoms,
  onToggleSymptom,
  onViewRemedies,
  onViewRemedy,
}: NeoSymptomTreeProps) {
  const { t, language } = useTranslation();
  const [symptomDetail, setSymptomDetail] = useState<SymptomDetail | null>(null);
  const [loading, setLoading] = useState(false);
  // Sub-symptoms are expanded by default; toggled via the down-arrow on the symptom heading.
  const [subsExpanded, setSubsExpanded] = useState(true);
  // Per-sub-symptom inline-expand state and lazily-loaded remedies cache.
  const [expandedSubIds, setExpandedSubIds] = useState<Set<string>>(new Set());
  const [subRemediesCache, setSubRemediesCache] = useState<Record<string, RemedyMatch[]>>({});
  const [loadingSubId, setLoadingSubId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSymptomId) {
      setSymptomDetail(null);
      return;
    }
    setLoading(true);
    setSubsExpanded(true); // reset: new symptom → show its sub-symptoms by default
    setExpandedSubIds(new Set()); // collapse any previously expanded sub-symptom rows
    neoApi
      .getSymptomById(selectedSymptomId)
      .then((data) => {
        setSymptomDetail(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedSymptomId]);

  // Toggle inline expansion of a sub-symptom; lazy-loads its remedies on first expand.
  const toggleSubExpand = useCallback(
    (subId: string) => {
      setExpandedSubIds((prev) => {
        const next = new Set(prev);
        if (next.has(subId)) {
          next.delete(subId);
          return next;
        }
        next.add(subId);
        if (!subRemediesCache[subId]) {
          setLoadingSubId(subId);
          neoApi
            .getSymptomById(subId)
            .then((data) => {
              setSubRemediesCache((cache) => ({ ...cache, [subId]: data.remedies }));
            })
            .catch(() => {
              setSubRemediesCache((cache) => ({ ...cache, [subId]: [] }));
            })
            .finally(() => setLoadingSubId((id) => (id === subId ? null : id)));
        }
        return next;
      });
    },
    [subRemediesCache]
  );

  if (!selectedSymptomId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <div className="h-16 w-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium mb-1">{t("symptom.explorer")}</h3>
        <p className="text-xs text-muted-foreground max-w-xs">{t("symptom.selectMultiple")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!symptomDetail) return null;

  const { symptom, breadcrumb, remedies } = symptomDetail;

  const tr = (text: string) => (language === "bn" ? translateRepertory(text) : text);

  const sortedSubSymptoms = symptom.subSymptoms
    ? [...symptom.subSymptoms]
        .map((s) => ({ ...s, _sort: tr(s.name) }))
        .sort((a, b) => a._sort.localeCompare(b._sort))
    : [];

  const sortedRemedies = remedies;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border text-xs text-muted-foreground">
        {breadcrumb.map((b, i) => (
          <span key={b.id} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            <button
              onClick={() => onViewRemedies(b.id)}
              className={cn(
                "hover:text-foreground transition-colors",
                i === breadcrumb.length - 1 && "text-foreground font-medium"
              )}
            >
              {tr(b.name)}
            </button>
          </span>
        ))}
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={() => onToggleSymptom(symptom.id, symptom.name)}
                className="p-0.5 text-muted-foreground hover:text-foreground shrink-0"
              >
                {selectedSymptoms.includes(symptom.id) ? (
                  <CheckSquare className="h-5 w-5 text-foreground" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>
              <h2 className="text-lg font-semibold truncate">{tr(symptom.name)}</h2>
              {sortedSubSymptoms.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSubsExpanded((v) => !v)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors shrink-0"
                  aria-expanded={subsExpanded}
                  aria-label={
                    subsExpanded ? t("symptom.collapseSubs") : t("symptom.expandSubs")
                  }
                  title={
                    subsExpanded ? t("symptom.collapseSubs") : t("symptom.expandSubs")
                  }
                >
                  {subsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            <NeoBookmarkButton id={symptom.id} name={symptom.name} type="symptom" />
          </div>

          {/* Sub-symptoms (collapsible via the chevron next to the symptom title) */}
          {sortedSubSymptoms.length > 0 && subsExpanded && (
            <div className="mb-6 animate-fade-in">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {t("symptom.subSymptoms")}
                <span className="ml-1 text-muted-foreground/60">({sortedSubSymptoms.length})</span>
              </h3>
              <div className="space-y-1">
                {sortedSubSymptoms.map((sub) => {
                  const isSelected = selectedSymptoms.includes(sub.id);
                  const isExpanded = expandedSubIds.has(sub.id);
                  const subRemedies = subRemediesCache[sub.id];
                  const isLoadingThis = loadingSubId === sub.id;
                  return (
                    <div key={sub.id}>
                      <div className="flex items-center gap-2 group">
                        <button
                          onClick={() => onToggleSymptom(sub.id, sub.name)}
                          className="p-0.5 text-muted-foreground hover:text-foreground"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-foreground" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onViewRemedies(sub.id)}
                          className="flex-1 text-left text-sm py-1.5 px-2 rounded hover:bg-accent/50 transition-colors"
                        >
                          {tr(sub.name)}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSubExpand(sub.id)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors shrink-0"
                          aria-expanded={isExpanded}
                          aria-label={
                            isExpanded ? t("symptom.collapseRemedies") : t("symptom.expandRemedies")
                          }
                          title={
                            isExpanded ? t("symptom.collapseRemedies") : t("symptom.expandRemedies")
                          }
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="ml-6 mt-1 mb-2 pl-3 border-l border-border/60 animate-fade-in">
                          {isLoadingThis && !subRemedies && (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground py-2">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              {t("common.loading")}
                            </div>
                          )}
                          {subRemedies && subRemedies.length === 0 && (
                            <p className="text-[11px] text-muted-foreground py-2">
                              {t("symptom.noRemedies")}
                            </p>
                          )}
                          {subRemedies && subRemedies.length > 0 && (
                            <div className="space-y-1 py-1">
                              {subRemedies.map((rem, idx) => {
                                const rankNum = rem.rawRank ?? rem.strength;
                                const strengthLabel =
                                  rem.strength >= 3
                                    ? t("remedy.high")
                                    : rem.strength >= 2
                                      ? t("remedy.medium")
                                      : t("remedy.low");
                                return (
                                  <button
                                    key={rem.id}
                                    onClick={() =>
                                      onViewRemedy ? onViewRemedy(rem.id) : onViewRemedies(rem.id)
                                    }
                                    className="flex items-center w-full gap-2 px-2 py-1.5 rounded border border-border/60 hover:border-muted-foreground/30 hover:bg-accent/30 transition-colors text-left"
                                  >
                                    <div
                                      className={cn(
                                        "h-5 w-5 shrink-0 rounded-full border flex items-center justify-center text-[9px] font-bold",
                                        idx < 3
                                          ? "bg-primary/15 text-primary border-primary/30"
                                          : "bg-muted text-muted-foreground border-border"
                                      )}
                                    >
                                      {idx + 1}
                                    </div>
                                    <span className="text-xs font-medium truncate flex-1">
                                      {tr(rem.name)}
                                    </span>
                                    <span
                                      className={cn(
                                        "text-xs font-bold tabular-nums min-w-[1.25rem] text-center shrink-0",
                                        rem.strength >= 3
                                          ? "text-green-500"
                                          : rem.strength >= 2
                                            ? "text-yellow-500"
                                            : "text-red-400"
                                      )}
                                    >
                                      {rankNum}
                                    </span>
                                    <Badge
                                      variant={rem.strength >= 3 ? "default" : "secondary"}
                                      className={cn(
                                        "text-[9px] px-1.5 py-0 shrink-0",
                                        rem.strength >= 3
                                          ? "bg-green-500/15 text-green-500 border-green-500/30 hover:bg-green-500/20"
                                          : rem.strength >= 2
                                            ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20"
                                            : "bg-red-400/15 text-red-400 border-red-400/30 hover:bg-red-400/20"
                                      )}
                                    >
                                      {strengthLabel}
                                    </Badge>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remedies */}
          {sortedRemedies.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {t("symptom.remediesFor")} {tr(symptom.name)}
                <span className="ml-1 text-muted-foreground/60">({sortedRemedies.length})</span>
              </h3>
              <div className="space-y-2">
                {sortedRemedies.map((rem, idx) => {
                  const rankNum = rem.rawRank ?? rem.strength;
                  const strengthLabel = rem.strength >= 3
                    ? t("remedy.high")
                    : rem.strength >= 2
                      ? t("remedy.medium")
                      : t("remedy.low");
                  return (
                    <button
                      key={rem.id}
                      onClick={() => (onViewRemedy ? onViewRemedy(rem.id) : onViewRemedies(rem.id))}
                      className="flex items-center w-full p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors text-left gap-3"
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-bold",
                          idx < 3
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium">{tr(rem.name)}</span>
                          <span className="text-xs text-muted-foreground">({rem.abbr})</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {language === "bn" ? (medDescBn[rem.name.toUpperCase()] || medDescBn[rem.name] || tr(rem.description)) : rem.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className={cn(
                          "text-sm font-bold tabular-nums min-w-[1.5rem] text-center",
                          rem.strength >= 3 ? "text-green-500" : rem.strength >= 2 ? "text-yellow-500" : "text-red-400"
                        )}>
                          {rankNum}
                        </span>
                        <Badge
                          variant={rem.strength >= 3 ? "default" : "secondary"}
                          className={cn(
                            rem.strength >= 3
                              ? "bg-green-500/15 text-green-500 border-green-500/30 hover:bg-green-500/20"
                              : rem.strength >= 2
                                ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20"
                                : "bg-red-400/15 text-red-400 border-red-400/30 hover:bg-red-400/20"
                          )}
                        >
                          {strengthLabel}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {remedies.length === 0 && (!symptom.subSymptoms || symptom.subSymptoms.length === 0) && (
            <p className="text-sm text-muted-foreground">{t("symptom.noRemedies")}</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
