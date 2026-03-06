"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useAudioReader } from "@/hooks/useAudioReader";
import { useTranslation } from "@/i18n/useTranslation";
import { type MouseEvent } from "react";

interface AudioReaderProps {
  text: string;
}

export function AudioReader({ text }: AudioReaderProps) {
  const { language, t } = useTranslation();
  const { isSpeaking, isSupported, toggle } = useAudioReader({ language });

  if (!isSupported) return null;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(text);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      className={`p-1.5 rounded transition-colors ${
        isSpeaking
          ? "text-foreground bg-accent"
          : "text-muted-foreground hover:text-foreground"
      }`}
      title={isSpeaking ? t("voice.stop") : t("voice.speak")}
    >
      {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
    </button>
  );
}
