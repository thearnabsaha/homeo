"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock, Trash2, Pill, HeartPulse, ChevronDown, ChevronUp,
  Activity, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { useTranslation } from "@/i18n/useTranslation";
import { translateRepertory, toBengaliNumeral } from "@/i18n/repertoryBn";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useNeoDoctorHistory, DoctorHistoryEntry } from "@/hooks/useNeoDoctorHistory";
import { cn } from "@/lib/utils";

function timeAgo(ts: number, isBn: boolean): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return isBn ? "এইমাত্র" : "Just now";
  if (mins < 60) return isBn ? `${toBengaliNumeral(mins)} মিনিট আগে` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return isBn ? `${toBengaliNumeral(hrs)} ঘণ্টা আগে` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return isBn ? `${toBengaliNumeral(days)} দিন আগে` : `${days}d ago`;
  const months = Math.floor(days / 30);
  return isBn ? `${toBengaliNumeral(months)} মাস আগে` : `${months}mo ago`;
}

function formatDate(ts: number, isBn: boolean): string {
  const d = new Date(ts);
  if (isBn) {
    const day = toBengaliNumeral(d.getDate());
    const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    const month = months[d.getMonth()];
    const year = toBengaliNumeral(d.getFullYear());
    const hour = toBengaliNumeral(d.getHours() % 12 || 12);
    const min = toBengaliNumeral(d.getMinutes()).padStart(2, "০");
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    return `${day} ${month} ${year}, ${hour}:${min} ${ampm}`;
  }
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function DoctorHistoryPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const bn = (s: string) => (isBn ? translateRepertory(s) : s);
  const num = (n: number) => (isBn ? toBengaliNumeral(n) : String(n));

  const { entries, removeEntry, clearAll } = useNeoDoctorHistory();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 h-14 max-w-4xl mx-auto w-full">
          <Link href="/neo/doctor" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Clock className="h-5 w-5 text-primary" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">
              {isBn ? "পরামর্শের ইতিহাস" : "Consultation History"}
            </h1>
            <p className="text-[10px] text-muted-foreground">
              {isBn ? `${toBengaliNumeral(entries.length)}টি পরামর্শ` : `${entries.length} consultation${entries.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          {entries.length > 0 && (
            confirmClear ? (
              <div className="flex items-center gap-1.5">
                <Button variant="destructive" size="sm" onClick={() => { clearAll(); setConfirmClear(false); }} className="text-xs h-7 px-2">
                  {isBn ? "নিশ্চিত" : "Confirm"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)} className="text-xs h-7 px-2">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)} className="gap-1.5 text-xs text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isBn ? "সব মুছুন" : "Clear All"}</span>
              </Button>
            )
          )}
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center text-center pt-16 animate-fade-in">
              <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h2 className="text-lg font-semibold mb-2">
                {isBn ? "কোনো পরামর্শের ইতিহাস নেই" : "No Consultation History"}
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                {isBn
                  ? "NeoAI ডাক্তার থেকে পরামর্শ নিলে এখানে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।"
                  : "Consultations from NeoAI Doctor will be automatically saved here."}
              </p>
              <Link href="/neo/doctor">
                <Button className="gap-2 rounded-xl">
                  <HeartPulse className="h-4 w-4" />
                  {isBn ? "NeoAI ডাক্তার শুরু করুন" : "Start NeoAI Doctor"}
                </Button>
              </Link>
            </div>
          ) : (
            entries.map((entry) => (
              <HistoryCard
                key={entry.id}
                entry={entry}
                expanded={expandedId === entry.id}
                onToggle={() => toggle(entry.id)}
                onDelete={() => removeEntry(entry.id)}
                isBn={isBn}
                bn={bn}
                num={num}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryCard({
  entry, expanded, onToggle, onDelete, isBn, bn, num,
}: {
  entry: DoctorHistoryEntry;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isBn: boolean;
  bn: (s: string) => string;
  num: (n: number) => string;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const rec = entry.recommendation;
  const primaryName = rec.primaryRemedy?.name || "—";

  return (
    <div className={cn(
      "rounded-xl border transition-all animate-fade-in",
      expanded ? "border-primary/30 bg-card shadow-sm" : "border-border bg-card/50 hover:border-border/80"
    )}>
      {/* Collapsed header */}
      <button onClick={onToggle} className="w-full text-left px-4 py-3 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Pill className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{bn(primaryName)}</span>
            {rec.primaryRemedy && (
              <Badge variant="secondary" className="text-[9px] shrink-0">{num(rec.primaryRemedy.confidence)}%</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground truncate">
              {entry.complaints.map((c) => c).join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground/60">{timeAgo(entry.timestamp, isBn)}</span>
            {entry.complaints.length > 1 && (
              <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                {isBn ? `${toBengaliNumeral(entry.complaints.length)} লক্ষণ` : `${entry.complaints.length} symptoms`}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!expanded && (
            confirmDelete ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="destructive" size="sm" onClick={onDelete} className="text-[10px] h-6 px-2">
                  {isBn ? "মুছুন" : "Delete"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} className="h-6 px-1">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost" size="sm"
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                className="h-7 w-7 p-0 text-muted-foreground/40 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3 animate-fade-in">
          {/* Date */}
          <p className="text-[10px] text-muted-foreground/60">{formatDate(entry.timestamp, isBn)}</p>

          {/* Symptoms analyzed */}
          <div className="flex flex-wrap gap-1.5">
            {entry.complaints.map((c, i) => (
              <Badge key={i} className="text-[10px] bg-primary/10 text-primary border-primary/20">{c}</Badge>
            ))}
          </div>

          {/* AI message */}
          {rec.message && (
            <p className="text-xs text-muted-foreground leading-relaxed">{rec.message}</p>
          )}

          {/* Primary remedy */}
          {rec.primaryRemedy && (
            <div className="p-3 rounded-lg bg-background border border-primary/20">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {isBn ? "প্রধান ওষুধ" : "Primary Remedy"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold">{bn(rec.primaryRemedy.name)}</span>
                {!isBn && <Badge variant="secondary" className="text-[9px]">{rec.primaryRemedy.abbr}</Badge>}
              </div>
              <ConfidenceBar value={rec.primaryRemedy.confidence} className="mb-2" />
              {rec.primaryRemedy.explanation && (
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{rec.primaryRemedy.explanation}</p>
              )}
              <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                {rec.primaryRemedy.dosage && (
                  <span><span className="font-medium">{isBn ? "মাত্রা:" : "Dosage:"}</span> {rec.primaryRemedy.dosage}</span>
                )}
              </div>
              {rec.primaryRemedy.keyIndications?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {rec.primaryRemedy.keyIndications.map((ind, i) => (
                    <Badge key={i} variant="secondary" className="text-[9px]">{ind}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Alternative remedies */}
          {rec.alternativeRemedies?.length > 0 && (
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {isBn ? "বিকল্প ওষুধ" : "Alternatives"} ({num(rec.alternativeRemedies.length)})
                </span>
              </div>
              <div className="space-y-1">
                {rec.alternativeRemedies.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span className="text-muted-foreground/50 w-4 text-right shrink-0">{num(i + 2)}</span>
                    <span className="font-medium truncate">{bn(r.name)}</span>
                    <span className="text-muted-foreground/50 shrink-0">{num(r.confidence)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General advice */}
          {rec.generalAdvice && (
            <div className="p-2.5 rounded-lg bg-background border border-border">
              <span className="text-[10px] font-medium text-muted-foreground">{isBn ? "সাধারণ পরামর্শ" : "General Advice"}</span>
              <p className="text-[11px] mt-0.5 text-muted-foreground leading-relaxed">{rec.generalAdvice}</p>
            </div>
          )}

          {/* When to seek help */}
          {rec.whenToSeekHelp && (
            <div className="p-2.5 rounded-lg bg-background border border-yellow-900/20">
              <div className="flex items-center gap-1.5 mb-0.5">
                <ShieldAlert className="h-3 w-3 text-yellow-500" />
                <span className="text-[10px] font-medium text-yellow-500">{isBn ? "কখন ডাক্তার দেখাবেন" : "When to See a Doctor"}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{rec.whenToSeekHelp}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Link href="/neo/doctor" className="flex-1">
              <Button size="sm" className="w-full gap-1.5 text-xs rounded-lg h-8">
                <HeartPulse className="h-3 w-3" />
                {isBn ? "নতুন পরামর্শ" : "New Consultation"}
              </Button>
            </Link>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <Button variant="destructive" size="sm" onClick={onDelete} className="text-xs h-8 px-3 rounded-lg">
                  {isBn ? "নিশ্চিত করুন" : "Confirm Delete"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} className="h-8 px-2 rounded-lg">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline" size="sm"
                onClick={() => setConfirmDelete(true)}
                className="gap-1.5 text-xs h-8 rounded-lg text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                {isBn ? "মুছুন" : "Delete"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
