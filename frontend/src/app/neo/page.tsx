"use client";

import Link from "next/link";
import {
  Stethoscope, BookOpen, Globe, Mic, Zap, Smartphone, Clock,
  ArrowRight, MessageCircle, Search, CheckCircle2, Sparkles, ArrowLeft, HeartPulse,
  LogIn, LogOut, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { toBengaliNumeral } from "@/i18n/repertoryBn";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useNeoAuth } from "@/hooks/useNeoAuth";

export default function NeoLandingPage() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const { user, logout } = useNeoAuth();
  const n = (v: string) => {
    if (!isBn) return v;
    return v.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  };

  const features = [
    { icon: Stethoscope, title: isBn ? "NeoAI ডায়াগনস্টিক চ্যাট" : "NeoAI Diagnostic Chat", desc: isBn ? "NeoAI চিকিৎসকের সাথে কথা বলুন। ক্লাসিক্যাল রেপার্টরি থেকে সঠিক ওষুধ খুঁজুন।" : "Chat with NeoAI physician. Find the right remedy from the classical repertory." },
    { icon: BookOpen, title: isBn ? "ক্লাসিক্যাল রেপার্টরি" : "Classical Repertory", desc: isBn ? "৪৩টি রেপার্টরি বিভাগ, ৭২৩৯টি লক্ষণ এবং ১১০৩টি ওষুধ।" : "43 repertory sections, 7,239 symptoms and 1,103 medicines." },
    { icon: Globe, title: isBn ? "দ্বিভাষী সহায়তা" : "Bilingual Support", desc: isBn ? "বাংলা ও ইংরেজি উভয় ভাষায় ব্যবহার করুন।" : "Use in both Bengali and English." },
    { icon: Mic, title: isBn ? "ভয়েস ইনপুট" : "Voice Input", desc: isBn ? "কথা বলে লক্ষণ জানান, লিখতে হবে না।" : "Describe symptoms by voice, no typing needed." },
    { icon: Zap, title: isBn ? "দ্রুত বিশ্লেষণ" : "Fast Analysis", desc: isBn ? "AI-চালিত দ্রুত ওষুধ খোঁজ।" : "AI-powered fast remedy search." },
    { icon: Smartphone, title: isBn ? "মোবাইল ফ্রেন্ডলি" : "Mobile Friendly", desc: isBn ? "ফোন, ট্যাবলেট সব ডিভাইসে চলবে।" : "Works on phone, tablet and all devices." },
  ];

  const steps = [
    { icon: MessageCircle, num: n("01"), title: isBn ? "সমস্যা বলুন" : "Describe Problem", desc: isBn ? "আপনার সমস্যা বর্ণনা করুন, NeoAI ডাক্তার প্রশ্ন করবে।" : "Describe your problem, NeoAI Doctor will ask questions." },
    { icon: Search, num: n("02"), title: isBn ? "৩ ধাপে প্রশ্ন-উত্তর" : "3-Round Q&A", desc: isBn ? "হ্যাঁ/না, সংখ্যা বা সিলেক্ট বক্স থেকে উত্তর দিন — টাইপ করতে হবে না!" : "Answer with Yes/No, numbers, or selection boxes — no typing!" },
    { icon: CheckCircle2, num: n("03"), title: isBn ? "ওষুধ পান" : "Get Medicines", desc: isBn ? "১০-১৫টি প্রাসঙ্গিক ওষুধের পরামর্শ পান।" : "Get 10-15 relevant medicine suggestions." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Link href="/"><Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">{isBn ? "নিও জোন" : "Neo Zone"}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/neo/explorer">
              <Button variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">{t("nav.explorer")}</Button>
            </Link>
            <Link href="/neo/repertory">
              <Button variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">{t("nav.repertory")}</Button>
            </Link>
            <Link href="/neo/doctor">
              <Button size="sm" className="text-xs gap-1.5">
                <HeartPulse className="h-3.5 w-3.5" />
                {isBn ? "NeoAI ডাক্তার" : "NeoAI Doctor"}
              </Button>
            </Link>
            <Link href="/neo/doctor/history">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 hidden sm:inline-flex">
                <Clock className="h-3.5 w-3.5" />
                {isBn ? "ইতিহাস" : "History"}
              </Button>
            </Link>
            <Link href="/neo/consult">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 hidden sm:inline-flex">
                <Stethoscope className="h-3.5 w-3.5" />
                {isBn ? "পরামর্শ" : "Consult"}
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                  <User className="h-3 w-3" />
                  {user.name.split(" ")[0]}
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-xs gap-1.5">
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{isBn ? "লগআউট" : "Logout"}</span>
                </Button>
              </div>
            ) : (
              <Link href="/neo/login">
                <Button variant="ghost" size="sm" className="text-xs gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  {isBn ? "লগইন" : "Login"}
                </Button>
              </Link>
            )}
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      <section className="pt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center pt-16 sm:pt-24 pb-16 sm:pb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary mb-8 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 animate-pulse-slow" />
              {isBn ? "নিও জোন — ক্লাসিক্যাল রেপার্টরি" : "Neo Zone — Classical Repertory"}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-3xl animate-fade-in bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text">
              {isBn ? "NeoAI হোমিওপ্যাথিক চিকিৎসক" : "NeoAI Homeopathic Physician"}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-in">
              {isBn
                ? "ক্লাসিক্যাল রেপার্টরি ডাটাবেসে প্রশিক্ষিত NeoAI। ৪৩টি রেপার্টরি, ১১০৩টি ওষুধ এবং ৯৫,৯০৭টি ওষুধ-লক্ষণ সম্পর্ক।"
                : "NeoAI trained on classical repertory database. 43 repertories, 1,103 medicines and 95,907 medicine-symptom relationships."}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-16 animate-fade-in">
              <Link href="/neo/doctor">
                <Button size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  <HeartPulse className="h-4 w-4" />
                  {isBn ? "NeoAI ডাক্তার শুরু করুন" : "Start NeoAI Doctor"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/neo/consult">
                <Button variant="outline" size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl w-full sm:w-auto hover:bg-primary/5 transition-colors">
                  <Stethoscope className="h-4 w-4" />
                  {isBn ? "ফ্রি-ফর্ম পরামর্শ" : "Free-form Consult"}
                </Button>
              </Link>
              <Link href="/neo/explorer">
                <Button variant="outline" size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl w-full sm:w-auto hover:bg-primary/5 transition-colors">
                  <BookOpen className="h-4 w-4" />
                  {isBn ? "রেপার্টরি দেখুন" : "Explore Repertory"}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-lg animate-fade-in">
              {[
                { val: n("1103"), label: isBn ? "ওষুধ" : "Medicines" },
                { val: n("7239"), label: isBn ? "লক্ষণ" : "Symptoms" },
                { val: n("43"), label: isBn ? "রেপার্টরি" : "Repertories" },
                { val: n("95907"), label: isBn ? "সম্পর্ক" : "Relations" },
              ].map((s, i) => (
                <div key={i} className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-primary group-hover:scale-105 transition-transform">{s.val}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">
            {isBn ? "কিভাবে কাজ করে" : "How It Works"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                <div className="text-[10px] font-mono text-muted-foreground/40 mb-4">{step.num}</div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <step.icon className="h-5 w-5" />
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

      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, i) => (
              <div key={i} className="group p-5 sm:p-6 rounded-2xl border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 bg-card">
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

      <section className="py-16 sm:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {isBn ? "NeoAI ডাক্তার শুরু করুন" : "Start NeoAI Doctor"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
            {isBn ? "৩টি ধাপে প্রশ্ন-উত্তর — টাইপ ছাড়াই সিলেক্ট বক্স দিয়ে। ক্লাসিক্যাল রেপার্টরিতে প্রশিক্ষিত AI।" : "3 rounds of Q&A with selection boxes — no typing needed. AI trained on classical repertory."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/neo/doctor">
              <Button size="lg" className="gap-2 text-sm px-8 h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                <HeartPulse className="h-4 w-4" />{isBn ? "NeoAI ডাক্তার" : "NeoAI Doctor"}
              </Button>
            </Link>
            <Link href="/neo/consult">
              <Button variant="outline" size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl">
                <Stethoscope className="h-4 w-4" />{isBn ? "ফ্রি-ফর্ম পরামর্শ" : "Free-form Consult"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] text-muted-foreground/50 text-center leading-relaxed max-w-xl mx-auto mb-4">
            {isBn ? "এটি শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে। পেশাদার হোমিওপ্যাথিক পরামর্শের বিকল্প নয়।" : "For educational purposes only. Not a substitute for professional homeopathic advice."}
          </p>
          <p className="text-[10px] text-muted-foreground/30 text-center">
            NeoAI &mdash; {isBn ? "ক্লাসিক্যাল রেপার্টরি দ্বারা চালিত" : "Powered by Classical Repertory"}
          </p>
        </div>
      </footer>
    </div>
  );
}
