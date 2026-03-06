"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Square, CheckSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { useTranslation } from "@/i18n/useTranslation";
import { api, type SymptomDetail } from "@/lib/api";
import { cn } from "@/lib/utils";
import { translateData } from "@/i18n/dataTranslations";

interface SymptomTreeProps {
  selectedSymptomId: string | null;
  selectedSymptoms: string[];
  onToggleSymptom: (id: string, name: string) => void;
  onViewRemedies: (symptomId: string) => void;
  onViewRemedy?: (remedyId: string) => void;
}

export function SymptomTree({
  selectedSymptomId,
  selectedSymptoms,
  onToggleSymptom,
  onViewRemedies,
  onViewRemedy,
}: SymptomTreeProps) {
  const { t, language } = useTranslation();
  const [symptomDetail, setSymptomDetail] = useState<SymptomDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedSymptomId) {
      setSymptomDetail(null);
      return;
    }
    setLoading(true);
    api.getSymptomById(selectedSymptomId).then((data) => {
      setSymptomDetail(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedSymptomId]);

  if (!selectedSymptomId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <div className="h-16 w-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium mb-1">{t("symptom.explorer")}</h3>
        <p className="text-xs text-muted-foreground max-w-xs">
          {t("symptom.selectMultiple")}
        </p>
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
              {translateData(b.name, language)}
            </button>
          </span>
        ))}
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{translateData(symptom.name, language)}</h2>
            <BookmarkButton id={symptom.id} name={symptom.name} type="symptom" />
          </div>

          {/* Sub-symptoms */}
          {symptom.subSymptoms && symptom.subSymptoms.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {t("symptom.subSymptoms")}
              </h3>
              <div className="space-y-1">
                {symptom.subSymptoms.map((sub) => {
                  const isSelected = selectedSymptoms.includes(sub.name);
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center gap-2 group"
                    >
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
                        {translateData(sub.name, language)}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remedies */}
          {remedies.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {t("symptom.remediesFor")} {translateData(symptom.name, language)}
              </h3>
              <div className="space-y-2">
                {remedies.map((rem) => (
                  <button
                    key={rem.id}
                    onClick={() => (onViewRemedy ? onViewRemedy(rem.id) : onViewRemedies(rem.id))}
                    className="flex items-center justify-between w-full p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium">{translateData(rem.name, language)}</span>
                        <span className="text-xs text-muted-foreground">({rem.abbr})</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {translateData(rem.description, language)}
                      </p>
                    </div>
                    <Badge
                      variant={rem.strength >= 3 ? "default" : "secondary"}
                      className="ml-2 flex-shrink-0"
                    >
                      {rem.strength >= 3 ? t("remedy.high") : rem.strength >= 2 ? t("remedy.medium") : t("remedy.low")}
                    </Badge>
                  </button>
                ))}
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
