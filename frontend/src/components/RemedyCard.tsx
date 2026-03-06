"use client";

import { ConfidenceBar } from "@/components/ConfidenceBar";
import { AudioReader } from "@/components/AudioReader";
import { BookmarkButton } from "@/components/BookmarkButton";
import { useTranslation } from "@/i18n/useTranslation";
import { translateData } from "@/i18n/dataTranslations";

interface RemedyCardProps {
  name: string;
  abbr: string;
  confidence: number;
  explanation: string;
  dosage?: string;
  keyFeatures?: string[];
  onClick?: () => void;
}

export function RemedyCard({
  name,
  abbr,
  confidence,
  explanation,
  dosage,
  keyFeatures,
  onClick,
}: RemedyCardProps) {
  const { t, language } = useTranslation();

  return (
    <div
      className="rounded-lg border border-border p-4 hover:border-muted-foreground/30 transition-colors cursor-pointer animate-slide-up"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick?.(); }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-semibold">{translateData(name, language)}</h4>
          <span className="text-xs text-muted-foreground">{abbr}</span>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <AudioReader text={`${name}. ${explanation}`} />
          <BookmarkButton
            id={abbr.toLowerCase().replace(/[^a-z]/g, "")}
            name={name}
            type="remedy"
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{t("remedy.confidence")}</span>
        </div>
        <ConfidenceBar value={confidence} />
      </div>

      <p className="text-xs text-muted-foreground mb-2 line-clamp-3">{explanation}</p>

      {dosage && (
        <div className="mb-2">
          <span className="text-xs font-medium">{t("remedy.dosage")}: </span>
          <span className="text-xs text-muted-foreground">{dosage}</span>
        </div>
      )}

      {keyFeatures && keyFeatures.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {keyFeatures.map((f, i) => (
            <span
              key={i}
              className="inline-block px-1.5 py-0.5 text-[10px] bg-secondary rounded"
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
