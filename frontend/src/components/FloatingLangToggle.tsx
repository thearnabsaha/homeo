"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { Globe } from "lucide-react";

export function FloatingLangToggle() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      className="fixed bottom-6 left-6 z-50 h-10 px-3 rounded-full bg-card border border-border shadow-lg flex items-center gap-2 hover:bg-secondary transition-colors group"
      aria-label={t("language.toggleLabel")}
    >
      <Globe className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-xs font-semibold">
        {language === "en" ? "বাংলা" : "ইংরেজি"}
      </span>
    </button>
  );
}
