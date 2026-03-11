"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTranslation } from "@/i18n/useTranslation";

interface HeaderProps {
  onToggleSidebar: () => void;
  onSelectSymptom?: (id: string) => void;
  onSelectRemedy?: (id: string) => void;
}

export function Header({ onToggleSidebar, onSelectSymptom, onSelectRemedy }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center gap-2 px-2 sm:px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-bold">{t("app.logo")}</span>
          </div>
          <span className="font-semibold text-sm hidden sm:inline">{t("app.name")}</span>
        </div>

        <div className="flex-1 flex justify-center min-w-0 px-1">
          <SearchBar
            onSelectSymptom={onSelectSymptom}
            onSelectRemedy={onSelectRemedy}
          />
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
