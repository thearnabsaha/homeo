"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Pill, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { neoApi } from "@/lib/neoApi";
import type { RemedyDetail } from "@/lib/api";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { translateRepertory } from "@/i18n/repertoryBn";

export default function NeoRemedyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const bn = (text: string) => (isBn ? translateRepertory(text) : text);
  const [data, setData] = useState<RemedyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    neoApi.getRemedyById(id)
      .then((res) => { setData(res); setLoading(false); })
      .catch(() => { setError(t("common.error")); setLoading(false); });
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-24 w-full" />))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error || t("common.error")}</p>
          <Link href="/neo"><Button variant="outline">{t("common.back")}</Button></Link>
        </div>
      </div>
    );
  }

  const { remedy } = data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-full items-center justify-between px-3 sm:px-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/neo/explorer"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm truncate">{bn(remedy.name)}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{bn(remedy.name)}</h1>
                {!isBn && <span className="text-sm text-muted-foreground">{remedy.abbr}</span>}
              </div>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("remedy.description")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{remedy.description}</p>
        </section>

        {remedy.dosage && (
          <section className="mb-8 p-4 rounded-lg bg-card border border-border">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t("remedy.dosage")}</h2>
            <p className="text-sm">{remedy.dosage}</p>
          </section>
        )}

        {remedy.modalities && (remedy.modalities.worse.length > 0 || remedy.modalities.better.length > 0) && (
          <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {remedy.modalities.worse.length > 0 && (
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t("remedy.worse")}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {remedy.modalities.worse.map((w, i) => (<Badge key={i} variant="secondary" className="text-xs">{bn(w)}</Badge>))}
                </div>
              </div>
            )}
            {remedy.modalities.better.length > 0 && (
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t("remedy.better")}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {remedy.modalities.better.map((b, i) => (<Badge key={i} variant="secondary" className="text-xs">{bn(b)}</Badge>))}
                </div>
              </div>
            )}
          </section>
        )}

        {remedy.relatedRemedies && remedy.relatedRemedies.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("remedy.related")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {remedy.relatedRemedies.map((rel) => (
                <Link key={rel.id} href={`/neo/remedies/${rel.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors">
                  <div>
                    <span className="text-sm font-medium">{bn(rel.name)}</span>
                    {!isBn && <span className="text-xs text-muted-foreground ml-2">({rel.abbr})</span>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">{t("remedy.disclaimer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
