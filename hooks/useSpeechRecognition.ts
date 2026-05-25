"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }

  /** Chromium / WebSpeech API subset */
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    item(index: number): SpeechRecognitionAlternative;
    readonly length: number;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }
}

export function getSpeechRecognitionConstructor():
  | (new () => SpeechRecognition)
  | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

export function isSpeechRecognitionSupported(): boolean {
  return !!getSpeechRecognitionConstructor();
}

export interface UseSpeechRecognitionOptions {
  lang?: string;
  /** Called with the merged baseline + dictated text (respects textarea maxLength). */
  onTranscript: (fullAnswerText: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  /** Current textarea content before dictated text is merged in. */
  start: (baselineText: string) => void;
  stop: () => void;
  toggle: (baselineText: string) => void;
  errorMessage: string | null;
}

const MAX_CONTENT_LEN = 3000;

/**
 * Browser Web Speech API dictation — works in Chromium (Chrome / Edge).
 * Not supported in Safari / Firefox on most desktops.
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions
): UseSpeechRecognitionReturn {
  const { lang = "en-US", onTranscript } = options;

  const [isSupported] = useState(() => isSpeechRecognitionSupported());
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const baselineRef = useRef("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const detachRecognition = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    r.onresult = null;
    r.onerror = null;
    r.onend = null;
    recognitionRef.current = null;
  }, []);

  const abortRecognition = useCallback(() => {
    const r = recognitionRef.current;
    if (r) {
      try {
        r.abort();
      } catch {
        /* ignore */
      }
    }
    detachRecognition();
  }, [detachRecognition]);

  const stop = useCallback(() => {
    const r = recognitionRef.current;
    if (r) {
      try {
        r.stop();
      } catch {
        abortRecognition();
      }
    } else {
      baselineRef.current = "";
      setIsListening(false);
    }
  }, [abortRecognition]);

  const start = useCallback(
    (baselineText: string) => {
      if (!isSupported) return;

      abortRecognition();
      baselineRef.current = baselineText.trimEnd();

      const Ctor = getSpeechRecognitionConstructor();
      if (!Ctor) return;

      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event) => {
        let fullFinal = "";
        for (let i = 0; i < event.results.length; i++) {
          const row = event.results.item(i);
          if (row?.isFinal) {
            fullFinal += row.item(0).transcript;
          }
        }

        let interim = "";
        for (let i = 0; i < event.results.length; i++) {
          const row = event.results.item(i);
          if (row && !row.isFinal) {
            interim += row.item(0).transcript;
          }
        }

        const finalTrim = fullFinal.trim();
        const interimTrim = interim.trimEnd();
        const sessionText = interimTrim
          ? finalTrim
            ? `${finalTrim} ${interimTrim}`
            : interimTrim
          : finalTrim;

        const base = baselineRef.current;
        const combined =
          base && sessionText
            ? `${base} ${sessionText}`
            : base || sessionText;

        const clipped =
          combined.length > MAX_CONTENT_LEN
            ? combined.slice(0, MAX_CONTENT_LEN)
            : combined;

        onTranscriptRef.current(clipped);
      };

      recognition.onerror = (event) => {
        setErrorMessage(event.error ?? "Speech recognition failed");
        detachRecognition();
        baselineRef.current = "";
        setIsListening(false);
      };

      recognition.onend = () => {
        detachRecognition();
        baselineRef.current = "";
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setErrorMessage(null);
      setIsListening(true);

      try {
        recognition.start();
      } catch {
        setErrorMessage("Could not start microphone");
        detachRecognition();
        baselineRef.current = "";
        setIsListening(false);
      }
    },
    [abortRecognition, detachRecognition, isSupported, lang]
  );

  const toggle = useCallback(
    (baselineText: string) => {
      if (isListening) {
        stop();
      } else {
        start(baselineText);
      }
    },
    [isListening, start, stop]
  );

  useEffect(() => () => abortRecognition(), [abortRecognition]);

  return {
    isSupported,
    isListening,
    start,
    stop,
    toggle,
    errorMessage,
  };
}
