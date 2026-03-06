"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      className="gap-2 text-muted-foreground hover:text-foreground"
      title={t("language.switch")}
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium">
        {language === "en" ? "বাং" : "ইং"}
      </span>
    </Button>
  );
}
