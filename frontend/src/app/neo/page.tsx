"use client";

import Link from "next/link";
import {
  Stethoscope,
  BookOpen,
  Globe,
  Mic,
  Zap,
  Smartphone,
  ArrowRight,
  MessageCircle,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { toBengaliNum } from "@/i18n/dataTranslations";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function NeoLandingPage() {
  const { t, language } = useTranslation();
  const n = (v: string) => toBengaliNum(v, language);
  const isBn = language === "bn";

  const features = [
    { icon: Stethoscope, title: isBn ? "NeoAI ডায়াগনস্টিক চ্যাট" : "NeoAI Diagnostic Chat", desc: isBn ? "NeoAI চিকিৎসকের সাথে কথা বলুন। ক্লাসিক্যাল রেপার্টরি থেকে সঠিক ওষুধ খুঁজুন।" : "Chat with NeoAI physician. Find the right remedy from the classical repertory." },
    { icon: BookOpen, title: isBn ? "ক্লাসিক্যাল রেপার্টরি" : "Classical Repertory", desc: isBn ? "৪৩টি রেপার্টরি বিভাগ, ৭২৩৯টি লক্ষণ এবং ১১০৩টি ওষুধ।" : "43 repertory sections, 7,239 symptoms and 1,103 medicines." },
    { icon: Globe, title: isBn ? "দ্বিভাষী সহায়তা" : "Bilingual Support", desc: isBn ? "বাংলা ও ইংরেজি উভয় ভাষায় ব্যবহার করুন।" : "Use in both Bengali and English." },
    { icon: Mic, title: isBn ? "ভয়েস ইনপুট" : "Voice Input", desc: isBn ? "কথা বলে লক্ষণ জানান, লিখতে হবে না।" : "Describe symptoms by voice, no typing needed." },
    { icon: Zap, title: isBn ? "দ্রুত বিশ্লেষণ" : "Fast Analysis", desc: isBn ? "AI-চালিত দ্রুত ওষুধ খোঁজ।" : "AI-powered fast remedy search." },
    { icon: Smartphone, title: isBn ? "মোবাইল ফ্রেন্ডলি" : "Mobile Friendly", desc: isBn ? "ফোন, ট্যাবলেট সব ডিভাইসে চলবে।" : "Works on phone, tablet and all devices." },
  ];

  const steps = [
    { icon: MessageCircle, num: n("01"), title: isBn ? "লক্ষণ বলুন" : "Describe Symptoms", desc: isBn ? "আপনার সমস্যা বর্ণনা করুন।" : "Describe your problems." },
    { icon: Search, num: n("02"), title: isBn ? "NeoAI বিশ্লেষণ" : "NeoAI Analysis", desc: isBn ? "NeoAI ক্লাসিক্যাল রেপার্টরি থেকে বিশ্লেষণ করবে।" : "NeoAI analyzes from the classical repertory." },
    { icon: CheckCircle2, num: n("03"), title: isBn ? "ওষুধ পান" : "Get Remedies", desc: isBn ? "১০-১৫টি প্রাসঙ্গিক ওষুধের পরামর্শ পান।" : "Get 10-15 relevant remedy suggestions." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">{isBn ? "নিও জোন" : "Neo Zone"}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/neo/explorer">
              <Button variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">
                {t("nav.explorer")}
              </Button>
            </Link>
            <Link href="/neo/repertory">
              <Button variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">
                {t("nav.repertory")}
              </Button>
            </Link>
            <Link href="/neo/consult">
              <Button size="sm" className="text-xs gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" />
                {isBn ? "NeoAI পরামর্শ" : "NeoAI Consult"}
              </Button>
            </Link>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center pt-16 sm:pt-24 pb-16 sm:pb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary mb-8 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              {isBn ? "নিও জোন — ক্লাসিক্যাল রেপার্টরি" : "Neo Zone — Classical Repertory"}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-3xl animate-fade-in">
              {isBn ? "NeoAI হোমিওপ্যাথিক চিকিৎসক" : "NeoAI Homeopathic Physician"}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-in">
              {isBn
                ? "ক্লাসিক্যাল রেপার্টরি ডাটাবেসে প্রশিক্ষিত NeoAI। ৪৩টি রেপার্টরি, ১১০৩টি ওষুধ এবং ৯৫,৯০৭টি ওষুধ-লক্ষণ সম্পর্ক।"
                : "NeoAI trained on classical repertory database. 43 repertories, 1,103 medicines and 95,907 medicine-symptom relationships."}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-16 animate-fade-in">
              <Link href="/neo/consult">
                <Button size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl w-full sm:w-auto">
                  <Sparkles className="h-4 w-4" />
                  {isBn ? "NeoAI পরামর্শ শুরু করুন" : "Start NeoAI Consultation"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/neo/explorer">
                <Button variant="outline" size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl w-full sm:w-auto">
                  <BookOpen className="h-4 w-4" />
                  {isBn ? "রেপার্টরি দেখুন" : "Explore Repertory"}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-lg animate-fade-in">
              {[
                { val: n("1103"), label: isBn ? "ওষুধ" : "Medicines" },
                { val: n("7239"), label: isBn ? "লক্ষণ" : "Symptoms" },
                { val: n("43"), label: isBn ? "রেপার্টরি" : "Repertories" },
                { val: n("95907"), label: isBn ? "সম্পর্ক" : "Relations" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{s.val}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* How it works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">
            {isBn ? "কিভাবে কাজ করে" : "How It Works"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl border border-border bg-card">
                <div className="text-[10px] font-mono text-muted-foreground/40 mb-4">{step.num}</div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 h-4 w-4 text-muted-foreground/30 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, i) => (
              <div key={i} className="group p-5 sm:p-6 rounded-2xl border border-border hover:border-primary/30 transition-colors bg-card">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feat.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold mb-2">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {isBn ? "NeoAI পরামর্শ শুরু করুন" : "Start NeoAI Consultation"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
            {isBn ? "ক্লাসিক্যাল রেপার্টরিতে প্রশিক্ষিত AI থেকে পরামর্শ নিন।" : "Get consultation from AI trained on classical repertory."}
          </p>
          <Link href="/neo/consult">
            <Button size="lg" className="gap-2 text-sm px-8 h-12 rounded-xl">
              <Sparkles className="h-4 w-4" />
              {isBn ? "NeoAI পরামর্শ" : "NeoAI Consult"}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] text-muted-foreground/50 text-center leading-relaxed max-w-xl mx-auto mb-4">
            {isBn
              ? "এটি শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে। পেশাদার হোমিওপ্যাথিক পরামর্শের বিকল্প নয়।"
              : "For educational purposes only. Not a substitute for professional homeopathic advice."}
          </p>
          <p className="text-[10px] text-muted-foreground/30 text-center">
            NeoAI &mdash; {isBn ? "ক্লাসিক্যাল রেপার্টরি দ্বারা চালিত" : "Powered by Classical Repertory"}
          </p>
        </div>
      </footer>
    </div>
  );
}
