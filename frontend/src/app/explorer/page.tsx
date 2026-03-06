"use client";

import { useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import { SymptomTree } from "@/components/SymptomTree";
import { ChatWidget } from "@/components/ChatWidget";
import { useTranslation } from "@/i18n/useTranslation";
import { useExplorer } from "@/context/ExplorerContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExplorerPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    selectedSymptoms,
    activeChapter,
    selectedSymptomId,
    setActiveChapter,
    setSelectedSymptomId,
    toggleSymptom,
    removeSymptom,
    clearSymptoms,
    ranking,
    aiAnalysis,
    setRanking,
    setAiAnalysis,
    saveToHistory,
    history,
    restoreHistory,
  } = useExplorer();

  const handleSelectChapter = useCallback((id: string) => {
    setActiveChapter(id);
    setSelectedSymptomId(id);
    setSidebarOpen(false);
  }, [setActiveChapter, setSelectedSymptomId]);

  const handleSelectSymptom = useCallback((id: string) => {
    setSelectedSymptomId(id);
    setSidebarOpen(false);
  }, [setSelectedSymptomId]);

  const handleViewRemedy = useCallback(
    (id: string) => {
      router.push(`/remedies/${id}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSelectSymptom={handleSelectSymptom}
        onSelectRemedy={handleViewRemedy}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeChapter={activeChapter}
          onSelectChapter={handleSelectChapter}
          onSelectSymptom={handleSelectSymptom}
          history={history}
          onRestoreHistory={restoreHistory}
        />

        <main className="flex-1 min-w-0">
          {!selectedSymptomId ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6 text-center">
              <div className="max-w-lg animate-fade-in">
                <h2 className="text-2xl font-bold tracking-tight mb-3">{t("symptom.explorer")}</h2>
                <p className="text-sm text-muted-foreground mb-4">{t("symptom.selectMultiple")}</p>
                <p className="text-xs text-muted-foreground/50">
                  {t("ai.noSelection")}
                </p>
              </div>
            </div>
          ) : (
            <SymptomTree
              selectedSymptomId={selectedSymptomId}
              selectedSymptoms={selectedSymptoms.map((s) => s.name)}
              onToggleSymptom={toggleSymptom}
              onViewRemedies={handleSelectSymptom}
              onViewRemedy={handleViewRemedy}
            />
          )}
        </main>

        <RightPanel
          selectedSymptoms={selectedSymptoms}
          onRemoveSymptom={removeSymptom}
          onClearSymptoms={clearSymptoms}
          onViewRemedy={handleViewRemedy}
          ranking={ranking}
          aiAnalysis={aiAnalysis}
          onRankingChange={setRanking}
          onAiAnalysisChange={setAiAnalysis}
          onSaveHistory={saveToHistory}
        />
      </div>

      <ChatWidget />
    </div>
  );
}
