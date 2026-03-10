"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send, Loader2, RotateCcw, ArrowLeft, Sparkles, HeartPulse,
  CheckCircle2, AlertTriangle, Pill, Activity, ShieldAlert, ChevronRight, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { VoiceInput } from "@/components/VoiceInput";
import { useTranslation } from "@/i18n/useTranslation";
import { neoApi } from "@/lib/neoApi";
import type { DoctorQuestion, DoctorQuestionsResponse, DoctorRecommendationResponse, DoctorResponse } from "@/lib/neoApi";
import { translateRepertory, toBengaliNumeral } from "@/i18n/repertoryBn";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";

type Phase = "complaint" | "questions" | "recommendation";

interface AnswerSet {
  round: number;
  answers: Record<string, string>;
}

export default function NeoDoctorPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const bn = (s: string) => (isBn ? translateRepertory(s) : s);
  const num = (n: number) => (isBn ? toBengaliNumeral(n) : String(n));

  const [phase, setPhase] = useState<Phase>("complaint");
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [questions, setQuestions] = useState<DoctorQuestion[]>([]);
  const [qMessage, setQMessage] = useState("");
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [recommendation, setRecommendation] = useState<DoctorRecommendationResponse | null>(null);
  const [completedRounds, setCompletedRounds] = useState<AnswerSet[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const totalRounds = 3;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [phase, questions, recommendation, loading, completedRounds]);

  const submitComplaint = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setComplaint(trimmed);
    setLoading(true);
    try {
      const res = await neoApi.doctor({ complaint: trimmed, round: 1, answers: {}, history: [], language });
      const data = res as DoctorResponse;
      if (data.type === "questions") {
        const qd = data as DoctorQuestionsResponse;
        setQuestions(qd.questions || []);
        setQMessage(qd.message || "");
        setCurrentRound(1);
        setPhase("questions");
        setHistory([{ role: "user", content: trimmed }, { role: "assistant", content: JSON.stringify(data) }]);
      }
    } catch {
      setQuestions([]);
      setQMessage(isBn ? "দুঃখিত, সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Sorry, something went wrong. Please try again.");
      setPhase("questions");
    }
    setLoading(false);
  }, [loading, language, isBn]);

  const submitAnswers = useCallback(async () => {
    if (loading) return;
    const merged = { ...allAnswers, ...currentAnswers };
    setAllAnswers(merged);
    setCompletedRounds((prev) => [...prev, { round: currentRound, answers: { ...currentAnswers } }]);

    const nextRound = currentRound + 1;
    setLoading(true);

    const newHistory = [
      ...history,
      { role: "user", content: `Round ${currentRound} answers: ${JSON.stringify(currentAnswers)}` },
    ];

    try {
      const res = await neoApi.doctor({ complaint, round: nextRound, answers: merged, history: newHistory, language });
      const data = res as DoctorResponse;

      if (data.type === "recommendation") {
        setRecommendation(data as DoctorRecommendationResponse);
        setPhase("recommendation");
      } else if (data.type === "questions") {
        const qd = data as DoctorQuestionsResponse;
        setQuestions(qd.questions || []);
        setQMessage(qd.message || "");
        setCurrentRound(nextRound);
        setCurrentAnswers({});
        setHistory([...newHistory, { role: "assistant", content: JSON.stringify(data) }]);
      }
    } catch {
      setRecommendation(null);
      setPhase("recommendation");
    }
    setLoading(false);
  }, [loading, currentRound, currentAnswers, allAnswers, complaint, history, language]);

  const reset = () => {
    setPhase("complaint");
    setComplaint("");
    setQuestions([]);
    setQMessage("");
    setCurrentAnswers({});
    setAllAnswers({});
    setHistory([]);
    setRecommendation(null);
    setCompletedRounds([]);
    setCurrentRound(1);
    setLoading(false);
  };

  const allQuestionsAnswered = questions.length > 0 && questions.every((q) => currentAnswers[q.id]);

  const roundLabels = isBn
    ? ["প্রধান লক্ষণ", "মডালিটিজ", "সাংবিধানিক"]
    : ["Primary", "Modalities", "Constitutional"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 h-14 max-w-4xl mx-auto w-full">
          <Link href="/neo" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <HeartPulse className="h-5 w-5 text-primary" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">{isBn ? "NeoAI ডাক্তার" : "NeoAI Doctor"}</h1>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((r) => (
                <div key={r} className={cn("h-1.5 rounded-full transition-all", r <= currentRound && phase !== "complaint" ? "w-8 bg-primary" : "w-4 bg-muted-foreground/20")} />
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isBn ? "নতুন শুরু" : "Start Over"}</span>
          </Button>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>

      {/* Progress bar */}
      {phase !== "complaint" && (
        <div className="border-b border-border bg-card/50">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-2">
              {roundLabels.map((label, i) => {
                const rn = i + 1;
                const done = rn < currentRound || phase === "recommendation";
                const active = rn === currentRound && phase === "questions";
                return (
                  <div key={i} className="flex items-center gap-2 flex-1">
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all",
                      done ? "bg-primary/15 text-primary" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {done ? <Check className="h-2.5 w-2.5" /> : <span>{num(rn)}</span>}
                      <span className="hidden sm:inline">{label}</span>
                    </div>
                    {i < 2 && <ChevronRight className="h-3 w-3 text-muted-foreground/30 shrink-0" />}
                  </div>
                );
              })}
              {phase === "recommendation" && (
                <>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-green-500/15 text-green-500">
                    <Pill className="h-2.5 w-2.5" />
                    <span className="hidden sm:inline">{isBn ? "ওষুধ" : "Result"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* Completed rounds summary */}
          {completedRounds.map((cr) => (
            <div key={cr.round} className="p-3 rounded-xl border border-border bg-card/50 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">{isBn ? `ধাপ ${toBengaliNumeral(cr.round)} সম্পন্ন` : `Round ${cr.round} complete`}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(cr.answers).map(([qId, val]) => (
                  <Badge key={qId} variant="secondary" className="text-[10px]">{val}</Badge>
                ))}
              </div>
            </div>
          ))}

          {/* PHASE: Complaint */}
          {phase === "complaint" && !loading && (
            <div className="flex flex-col items-center text-center pt-8 sm:pt-16 animate-fade-in">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <HeartPulse className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                {isBn ? "NeoAI ডাক্তার" : "NeoAI Doctor"}
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mb-2">
                {isBn
                  ? "আপনার সমস্যা বলুন। আমি ৩টি ধাপে প্রশ্ন করব, তারপর আপনার জন্য সঠিক হোমিওপ্যাথিক ওষুধ খুঁজে দেব।"
                  : "Describe your problem. I'll ask questions in 3 rounds, then find the right homeopathic medicine for you."}
              </p>
              <p className="text-xs text-muted-foreground/60 mb-8">
                {isBn ? "প্রতিটি প্রশ্নের পাশে সিলেক্ট বক্স থাকবে — টাইপ করতে হবে না!" : "Each question has a selection box — no typing needed!"}
              </p>
            </div>
          )}

          {/* PHASE: Questions */}
          {phase === "questions" && !loading && (
            <div className="animate-slide-up">
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">
                    {isBn ? `ধাপ ${toBengaliNumeral(currentRound)} / ${toBengaliNumeral(totalRounds)}` : `Round ${currentRound} of ${totalRounds}`}
                  </span>
                </div>
                {qMessage && <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{qMessage}</p>}

                <div className="space-y-5">
                  {questions.map((q, qi) => (
                    <div key={q.id} className="animate-fade-in" style={{ animationDelay: `${qi * 80}ms` }}>
                      <p className="text-sm font-medium mb-2.5">{q.text}</p>
                      <div className={cn("grid gap-2", q.type === "yesno" ? "grid-cols-2" : q.options.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3")}>
                        {q.options.map((opt) => {
                          const selected = currentAnswers[q.id] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setCurrentAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                              className={cn(
                                "relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                                selected
                                  ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10"
                                  : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:bg-accent/50"
                              )}
                            >
                              {selected && <Check className="h-3.5 w-3.5 absolute top-1 right-1 text-primary" />}
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={submitAnswers}
                  disabled={!allQuestionsAnswered || loading}
                  className="w-full mt-6 gap-2 h-12 rounded-xl text-sm"
                >
                  {currentRound < totalRounds ? (
                    <>{isBn ? "পরবর্তী ধাপ" : "Next Round"} <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>{isBn ? "ওষুধ দেখুন" : "Get Medicines"} <Pill className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-12 animate-fade-in">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {phase === "complaint"
                  ? (isBn ? "আপনার সমস্যা বিশ্লেষণ করছি..." : "Analyzing your complaint...")
                  : currentRound >= totalRounds
                    ? (isBn ? "ওষুধ খুঁজছি..." : "Finding medicines...")
                    : (isBn ? "পরবর্তী প্রশ্ন তৈরি করছি..." : "Preparing next questions...")}
              </p>
            </div>
          )}

          {/* PHASE: Recommendation */}
          {phase === "recommendation" && recommendation && (
            <div className="space-y-4 animate-slide-up">
              <div className="p-4 rounded-xl bg-card border border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{isBn ? "পরামর্শকৃত ওষুধ" : "Recommended Remedy"}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{recommendation.message}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="h-5 w-5 text-foreground" />
                  <span className="text-lg font-bold">{bn(recommendation.primaryRemedy.name)}</span>
                  {!isBn && <Badge variant="secondary">{recommendation.primaryRemedy.abbr}</Badge>}
                </div>
                <ConfidenceBar value={recommendation.primaryRemedy.confidence} className="mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{recommendation.primaryRemedy.explanation}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{isBn ? "মাত্রা" : "Dosage"}</span>
                    <p className="text-xs mt-1">{recommendation.primaryRemedy.dosage}</p>
                  </div>
                  {recommendation.primaryRemedy.keyIndications?.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-background border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{isBn ? "মূল ইঙ্গিত" : "Key Indications"}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {recommendation.primaryRemedy.keyIndications.map((ind, i) => (<Badge key={i} variant="secondary" className="text-[10px]">{ind}</Badge>))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {recommendation.alternativeRemedies?.length > 0 && (
                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">{isBn ? "বিকল্প ওষুধ" : "Alternative Remedies"} ({num(recommendation.alternativeRemedies.length)})</span>
                  </div>
                  <div className="space-y-1.5">
                    {recommendation.alternativeRemedies.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border">
                        <span className="text-[10px] font-bold text-muted-foreground w-5 text-center shrink-0">{num(i + 2)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium truncate">{bn(r.name)}</span>
                            {!isBn && <Badge variant="secondary" className="text-[10px] shrink-0">{r.abbr}</Badge>}
                          </div>
                          {r.brief && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{r.brief}</p>}
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground shrink-0">{num(r.confidence)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendation.generalAdvice && (
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-xs font-medium text-muted-foreground">{isBn ? "সাধারণ পরামর্শ" : "General Advice"}</span>
                  <p className="text-xs mt-1 text-muted-foreground leading-relaxed">{recommendation.generalAdvice}</p>
                </div>
              )}

              {recommendation.whenToSeekHelp && (
                <div className="p-3 rounded-xl bg-card border border-yellow-900/30">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-xs font-medium text-yellow-400">{isBn ? "কখন ডাক্তার দেখাবেন" : "When to See a Doctor"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{recommendation.whenToSeekHelp}</p>
                </div>
              )}

              <div className="flex items-start gap-2 p-3 rounded-xl bg-card border border-border">
                <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">{t("consult.disclaimer")}</p>
              </div>

              <Button onClick={reset} variant="outline" className="w-full gap-2 h-11 rounded-xl">
                <RotateCcw className="h-3.5 w-3.5" />
                {isBn ? "নতুন পরামর্শ নিন" : "Start New Consultation"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Input area - only for complaint phase */}
      {phase === "complaint" && (
        <div className="border-t border-border bg-background/95 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitComplaint(complaint); } }}
                  placeholder={isBn ? "আপনার সমস্যা বর্ণনা করুন... (যেমন: মাথাব্যথা, পেটে ব্যথা)" : "Describe your problem... (e.g., headache, stomach pain)"}
                  className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[48px] max-h-[120px]"
                  rows={1}
                  disabled={loading}
                />
                <div className="absolute right-2 bottom-2">
                  <VoiceInput onResult={(text) => { setComplaint(text); submitComplaint(text); }} />
                </div>
              </div>
              <Button onClick={() => submitComplaint(complaint)} disabled={!complaint.trim() || loading} className="h-12 w-12 rounded-xl shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 text-center mt-2">{t("consult.disclaimer")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
