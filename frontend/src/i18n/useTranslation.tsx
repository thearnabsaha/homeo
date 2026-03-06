"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import en from "./en.json";
import bn from "./bn.json";

type Language = "en" | "bn";

const translations: Record<Language, Record<string, unknown>> = { en, bn };

interface TranslationContext {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<TranslationContext>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bn");

  useEffect(() => {
    const saved = localStorage.getItem("repertoryai-lang") as Language;
    if (saved && (saved === "en" || saved === "bn")) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = "bn";
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("repertoryai-lang", lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string) => getNestedValue(translations[language], key),
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
