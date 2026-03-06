"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Clock, ArrowLeft, Pill, Stethoscope } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { api } from "@/lib/api";
import { VoiceInput } from "@/components/VoiceInput";
import { translateData } from "@/i18n/dataTranslations";

interface SearchBarProps {
  onSelectSymptom?: (id: string) => void;
  onSelectRemedy?: (id: string) => void;
}

export function SearchBar({ onSelectSymptom, onSelectRemedy }: SearchBarProps) {
  const { t, language } = useTranslation();
  const { searches, addSearch } = useRecentSearches();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{
    symptoms: { id: string; name: string; chapter: string }[];
    remedies: { id: string; name: string; abbr: string }[];
  }>({ symptoms: [], remedies: [] });
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults({ symptoms: [], remedies: [] });
      return;
    }
    setLoading(true);
    try {
      const [symRes, remRes] = await Promise.all([
        api.searchSymptoms(q),
        api.searchRemedies(q),
      ]);
      setResults({
        symptoms: symRes.results.slice(0, 8),
        remedies: remRes.results.slice(0, 8),
      });
    } catch {
      setResults({ symptoms: [], remedies: [] });
    }
    setLoading(false);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const selectSymptom = (id: string, name: string) => {
    addSearch(name);
    setQuery("");
    setIsOpen(false);
    setMobileOpen(false);
    onSelectSymptom?.(id);
  };

  const selectRemedy = (id: string, name: string) => {
    addSearch(name);
    setQuery("");
    setIsOpen(false);
    setMobileOpen(false);
    onSelectRemedy?.(id);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setQuery("");
    setResults({ symptoms: [], remedies: [] });
  };

  const hasResults = results.symptoms.length > 0 || results.remedies.length > 0;
  const showRecent = query.length === 0 && searches.length > 0;

  const renderResults = (isMobile: boolean) => (
    <>
      {loading && (
        <div className="px-4 py-4 text-sm text-muted-foreground text-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {t("common.loading")}
          </div>
        </div>
      )}

      {showRecent && (
        <div className={isMobile ? "px-4 py-2" : "p-2"}>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("search.recent")}
          </div>
          {searches.map((s, i) => (
            <button
              key={i}
              onClick={() => handleChange(s)}
              className={`flex items-center gap-3 w-full px-3 text-left hover:bg-accent rounded-lg transition-colors ${
                isMobile ? "py-3" : "py-1.5"
              }`}
            >
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className={isMobile ? "text-base" : "text-sm"}>{s}</span>
            </button>
          ))}
        </div>
      )}

      {results.symptoms.length > 0 && (
        <div className={isMobile ? "px-4 py-2" : "p-2"}>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="h-3 w-3" />
            {t("search.symptoms")}
          </div>
          {results.symptoms.map((s) => (
            <button
              key={s.id}
              onClick={() => selectSymptom(s.id, s.name)}
              className={`flex flex-col w-full px-3 text-left hover:bg-accent rounded-lg transition-colors ${
                isMobile ? "py-3" : "py-1.5"
              }`}
            >
              <span className={isMobile ? "text-base" : "text-sm"}>
                {translateData(s.name, language)}
              </span>
              <span className="text-xs text-muted-foreground">
                {translateData(s.chapter, language)}
              </span>
            </button>
          ))}
        </div>
      )}

      {results.remedies.length > 0 && (
        <div
          className={
            isMobile
              ? "px-4 py-2 border-t border-border"
              : "p-2 border-t border-border"
          }
        >
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="h-3 w-3" />
            {t("search.remedies")}
          </div>
          {results.remedies.map((r) => (
            <button
              key={r.id}
              onClick={() => selectRemedy(r.id, r.name)}
              className={`flex items-center gap-3 w-full px-3 text-left hover:bg-accent rounded-lg transition-colors ${
                isMobile ? "py-3" : "py-1.5"
              }`}
            >
              <span className={isMobile ? "text-base flex-1" : "text-sm"}>
                {translateData(r.name, language)}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                {r.abbr}
              </span>
            </button>
          ))}
        </div>
      )}

      {!loading && query.length >= 2 && !hasResults && (
        <div className="px-4 py-8 text-center">
          <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("search.noResults")}
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile: tap opens full-screen search */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden flex items-center gap-2 w-full max-w-[200px] px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground text-sm"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate">{t("search.placeholder")}</span>
      </button>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background flex flex-col animate-fade-in">
          {/* Search header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-background safe-top">
            <button
              onClick={closeMobile}
              className="p-2 -ml-1 text-muted-foreground hover:text-foreground rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={mobileInputRef}
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full pl-10 pr-16 py-3 rounded-xl border border-border bg-card text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
                enterKeyHint="search"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setResults({ symptoms: [], remedies: [] });
                      mobileInputRef.current?.focus();
                    }}
                    className="p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <VoiceInput
                  onResult={(text) => {
                    setQuery(text);
                    handleChange(text);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">{renderResults(true)}</div>
        </div>
      )}

      {/* Desktop: inline search with dropdown */}
      <div ref={wrapperRef} className="relative w-full max-w-md hidden md:block">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={t("search.placeholder")}
            className="w-full pl-9 pr-16 py-2 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="absolute right-1 flex items-center gap-1">
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults({ symptoms: [], remedies: [] });
                }}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <VoiceInput
              onResult={(text) => {
                setQuery(text);
                handleChange(text);
              }}
            />
          </div>
        </div>

        {isOpen &&
          (hasResults || (isOpen && showRecent) || loading || (query.length >= 2 && !hasResults)) && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-card shadow-xl max-h-[70vh] overflow-y-auto">
              {renderResults(false)}
            </div>
          )}
      </div>
    </>
  );
}
