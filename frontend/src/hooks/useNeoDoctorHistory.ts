"use client";

import { useState, useCallback, useEffect } from "react";

export interface DoctorHistoryEntry {
  id: string;
  timestamp: number;
  complaints: string[];
  cycles: { complaint: string; answers: Record<string, string> }[];
  recommendation: {
    message: string;
    primaryRemedy: { name: string; abbr: string; confidence: number; explanation: string; dosage: string; keyIndications: string[] };
    alternativeRemedies: { name: string; abbr: string; confidence: number; brief: string }[];
    generalAdvice: string;
    whenToSeekHelp: string;
    symptomsIdentified: string[];
  };
}

const STORAGE_KEY = "neoai-doctor-history";
const MAX_ITEMS = 50;

export function useNeoDoctorHistory() {
  const [entries, setEntries] = useState<DoctorHistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch {}
  }, []);

  const save = useCallback((items: DoctorHistoryEntry[]) => {
    setEntries(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addEntry = useCallback(
    (entry: Omit<DoctorHistoryEntry, "id" | "timestamp">) => {
      const newEntry: DoctorHistoryEntry = {
        ...entry,
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...entries].slice(0, MAX_ITEMS);
      save(updated);
      return newEntry.id;
    },
    [entries, save]
  );

  const removeEntry = useCallback(
    (id: string) => {
      save(entries.filter((e) => e.id !== id));
    },
    [entries, save]
  );

  const clearAll = useCallback(() => {
    save([]);
  }, [save]);

  const getEntry = useCallback(
    (id: string) => entries.find((e) => e.id === id) || null,
    [entries]
  );

  return { entries, addEntry, removeEntry, clearAll, getEntry };
}
