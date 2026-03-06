"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseVoiceInputOptions {
  language?: string;
  onResult?: (text: string) => void;
}

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
  resultIndex: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export function useVoiceInput({ language = "en-US", onResult }: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new (SpeechRecognition as new () => SpeechRecognitionInstance)();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === "bn" ? "bn-BD" : "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      let finalTranscript = "";
      for (let i = event.resultIndex; i < Object.keys(results).length; i++) {
        finalTranscript += results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (recognitionRef.current) {
        const lastTranscript = transcript;
        if (lastTranscript && onResult) {
          onResult(lastTranscript);
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    setTranscript("");
    recognition.start();
  }, [language, onResult, transcript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    if (transcript && onResult) {
      onResult(transcript);
    }
  }, [transcript, onResult]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return { isListening, transcript, isSupported, startListening, stopListening, toggleListening };
}
