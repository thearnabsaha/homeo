"use client";

import { Mic, MicOff } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useTranslation } from "@/i18n/useTranslation";

interface VoiceInputProps {
  onResult: (text: string) => void;
}

export function VoiceInput({ onResult }: VoiceInputProps) {
  const { language, t } = useTranslation();
  const { isListening, isSupported, toggleListening } = useVoiceInput({
    language,
    onResult,
  });

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleListening}
      className={`p-1.5 rounded transition-colors ${
        isListening
          ? "text-red-400 bg-red-400/10 animate-pulse"
          : "text-muted-foreground hover:text-foreground"
      }`}
      title={isListening ? t("voice.listening") : t("voice.listen")}
    >
      {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
    </button>
  );
}
