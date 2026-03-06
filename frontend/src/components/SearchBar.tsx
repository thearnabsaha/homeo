"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{
    symptoms: { id: string; name: string; chapter: string }[];
    remedies: { id: string; name: string; abbr: string }[];
  }>({ symptoms: [], remedies: [] });
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const doSearch = useCallback(
    async (q: string) => {
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
          symptoms: symRes.results.slice(0, 6),
          remedies: remRes.results.slice(0, 6),
        });
      } catch {
        setResults({ symptoms: [], remedies: [] });
      }
      setLoading(false);
    },
    []
  );

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
    onSelectSymptom?.(id);
  };

  const selectRemedy = (id: string, name: string) => {
    addSearch(name);
    setQuery("");
    setIsOpen(false);
    onSelectRemedy?.(id);
  };

  const hasResults = results.symptoms.length > 0 || results.remedies.length > 0;
  const showRecent = isOpen && query.length === 0 && searches.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={t("search.placeholder")}
          className="pl-9 pr-16 bg-card border-border"
        />
        <div className="absolute right-1 flex items-center gap-1">
          {query && (
            <button
              onClick={() => { setQuery(""); setResults({ symptoms: [], remedies: [] }); }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <VoiceInput onResult={(text) => { setQuery(text); handleChange(text); }} />
        </div>
      </div>

      {isOpen && (hasResults || showRecent || loading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-card shadow-lg animate-fade-in max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-muted-foreground">{t("common.loading")}</div>
          )}

          {showRecent && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">{t("search.recent")}</div>
              {searches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleChange(s)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-left hover:bg-accent rounded"
                >
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {results.symptoms.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">{t("search.symptoms")}</div>
              {results.symptoms.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectSymptom(s.id, s.name)}
                  className="flex flex-col w-full px-2 py-1.5 text-left hover:bg-accent rounded"
                >
                  <span className="text-sm">{translateData(s.name, language)}</span>
                  <span className="text-xs text-muted-foreground">{translateData(s.chapter, language)}</span>
                </button>
              ))}
            </div>
          )}

          {results.remedies.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">{t("search.remedies")}</div>
              {results.remedies.map((r) => (
                <button
                  key={r.id}
                  onClick={() => selectRemedy(r.id, r.name)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-left hover:bg-accent rounded"
                >
                  <span className="text-sm">{translateData(r.name, language)}</span>
                  <span className="text-xs text-muted-foreground">({r.abbr})</span>
                </button>
              ))}
            </div>
          )}

          {!loading && query.length >= 2 && !hasResults && (
            <div className="px-4 py-3 text-sm text-muted-foreground">{t("search.noResults")}</div>
          )}
        </div>
      )}
    </div>
  );
}
