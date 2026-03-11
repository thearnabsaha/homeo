"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "repertoryai-recent-searches";
const MAX_ITEMS = 10;

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSearches(JSON.parse(stored));
    } catch {}
  }, []);

  const addSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      const updated = [trimmed, ...searches.filter((s) => s !== trimmed)].slice(0, MAX_ITEMS);
      setSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [searches]
  );

  const clearSearches = useCallback(() => {
    setSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { searches, addSearch, clearSearches };
}
