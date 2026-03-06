"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const themes = [
    { id: "light", icon: Sun, label: t("theme.light") },
    { id: "dark", icon: Moon, label: t("theme.dark") },
    { id: "system", icon: Monitor, label: t("theme.system") },
  ] as const;

  return (
    <div className="flex items-center gap-0.5 bg-secondary rounded-lg p-0.5">
      {themes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          title={label}
          className={`p-1.5 rounded-md transition-colors ${
            theme === id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
