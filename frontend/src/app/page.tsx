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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { toBengaliNum } from "@/i18n/dataTranslations";

export default function LandingPage() {
  const { t, language } = useTranslation();
  const n = (v: string) => toBengaliNum(v, language);

  const features = [
    { icon: Stethoscope, title: t("landing.feat1Title"), desc: t("landing.feat1Desc") },
    { icon: BookOpen, title: t("landing.feat2Title"), desc: t("landing.feat2Desc") },
    { icon: Globe, title: t("landing.feat3Title"), desc: t("landing.feat3Desc") },
    { icon: Mic, title: t("landing.feat4Title"), desc: t("landing.feat4Desc") },
    { icon: Zap, title: t("landing.feat5Title"), desc: t("landing.feat5Desc") },
    { icon: Smartphone, title: t("landing.feat6Title"), desc: t("landing.feat6Desc") },
  ];

  const steps = [
    { icon: MessageCircle, num: n("01"), title: t("landing.how1"), desc: t("landing.how1d") },
    { icon: Search, num: n("02"), title: t("landing.how2"), desc: t("landing.how2d") },
    { icon: CheckCircle2, num: n("03"), title: t("landing.how3"), desc: t("landing.how3d") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background text-sm font-bold">{t("app.logo")}</span>
            </div>
            <span className="font-bold text-sm">{t("app.name")}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/explorer">
              <Button variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">
                {t("nav.explorer")}
              </Button>
            </Link>
            <Link href="/repertory">
              <Button variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">
                {t("nav.repertory")}
              </Button>
            </Link>
            <Link href="/neo/repertory">
              <Button variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">
                {t("nav.neoRepertory")}
              </Button>
            </Link>
            <Link href="/consult">
              <Button size="sm" className="text-xs gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" />
                {t("nav.consult")}
              </Button>
            </Link>
            <Link href="/neo">
              <Button size="sm" className="text-xs gap-1.5 bg-violet-600 hover:bg-violet-700 text-white border-0">
                <Sparkles className="h-3.5 w-3.5" />
                NEO
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center pt-16 sm:pt-24 pb-16 sm:pb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground mb-8 animate-fade-in">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              {t("landing.badge")}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-3xl animate-fade-in">
              {t("landing.hero")}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-in">
              {t("landing.heroSub")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-16 animate-fade-in">
              <Link href="/consult">
                <Button size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl w-full sm:w-auto">
                  <Stethoscope className="h-4 w-4" />
                  {t("landing.ctaConsult")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explorer">
                <Button variant="outline" size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl w-full sm:w-auto">
                  <BookOpen className="h-4 w-4" />
                  {t("landing.ctaExplore")}
                </Button>
              </Link>
              <Link href="/neo">
                <Button size="lg" className="gap-2 text-sm px-6 h-12 rounded-xl w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-lg shadow-violet-500/25">
                  <Sparkles className="h-4 w-4" />
                  {t("landing.ctaNeo")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-lg animate-fade-in">
              {[
                { val: n("733+"), label: t("landing.stats1") },
                { val: n("2500+"), label: t("landing.stats2") },
                { val: n("75"), label: t("landing.stats3") },
                { val: n("2"), label: t("landing.stats4") },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">{s.val}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* How it works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">
            {t("landing.howTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl border border-border bg-card">
                <div className="text-[10px] font-mono text-muted-foreground/40 mb-4">{step.num}</div>
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <step.icon className="h-5 w-5 text-foreground" />
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

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Features grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="group p-5 sm:p-6 rounded-2xl border border-border hover:border-muted-foreground/20 transition-colors bg-card"
              >
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t("landing.ctaConsult")}</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">{t("landing.heroSub")}</p>
          <Link href="/consult">
            <Button size="lg" className="gap-2 text-sm px-8 h-12 rounded-xl">
              <Stethoscope className="h-4 w-4" />
              {t("landing.ctaConsult")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] text-muted-foreground/50 text-center leading-relaxed max-w-xl mx-auto mb-4">
            {t("landing.disclaimer")}
          </p>
          <p className="text-[10px] text-muted-foreground/30 text-center">
            {t("landing.footer")}
          </p>
        </div>
      </footer>
    </div>
  );
}
