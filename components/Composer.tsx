"use client";

import { MODELS, type ModelId } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ArrowUpIcon, ChevronDownIcon, MicIcon, PlusIcon } from "./icons";

interface ComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** taille du texte du placeholder (home = 19px, chat = 18px) */
  variant?: "home" | "chat";
  model: ModelId;
  onModelChange: (model: ModelId) => void;
}

export default function Composer({
  onSend,
  disabled,
  placeholder = "Demander à Jean",
  variant = "home",
  model,
  onModelChange,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  // --- Dictée vocale (Web Speech API via react-speech-recognition) ---
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const dictationBase = useRef("");

  // Pendant l'écoute, on reflète la transcription dans le champ.
  useEffect(() => {
    if (listening) setValue(dictationBase.current + transcript);
  }, [transcript, listening]);

  function toggleDictation() {
    if (listening) {
      SpeechRecognition.stopListening();
      return;
    }
    dictationBase.current = value.trim() ? value.trim() + " " : "";
    resetTranscript();
    SpeechRecognition.startListening({ language: "fr-FR", continuous: true });
  }

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    if (listening) SpeechRecognition.stopListening();
    onSend(text);
    setValue("");
    resetTranscript();
    if (ref.current) ref.current.style.height = "auto";
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function grow(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const currentModel = MODELS.find((m) => m.id === model) ?? MODELS[0];

  const minH = variant === "home" ? "min-h-[66px]" : "min-h-[62px]";
  const bg =
    variant === "home" ? "bg-(--composer-bg-home)" : "bg-(--composer-bg-chat)";
  const textSize = variant === "home" ? "text-[19px]" : "text-[18px]";

  return (
    <div
      className={`animate-ui-soft-float animate-ui-soft-glow flex w-full items-center gap-[14px] rounded-[33px] ${bg} ${minH} border border-(--border-soft) py-2 pl-[22px] pr-[14px] backdrop-blur-[14px]`}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={grow}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={placeholder}
        className={`flex-1 resize-none self-center bg-transparent ${textSize} font-normal text-foreground placeholder:text-muted focus:outline-none`}
      />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          className="flex items-center gap-[5px] rounded-[14px] px-[10px] py-2 text-[17px] font-medium text-(--ink-strong) transition-colors hover:bg-(--surface-soft)"
        >
          {currentModel.label}
          <span
            className={`text-(--ink-dim) transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDownIcon size={16} />
          </span>
        </button>

        {menuOpen && (
          <ul
            role="listbox"
            className="absolute bottom-full right-0 z-30 mb-3 min-w-[180px] overflow-hidden rounded-2xl border border-(--border-soft) bg-(--menu-bg) p-1.5 shadow-[0_18px_50px_var(--composer-shadow)] backdrop-blur-[14px]"
          >
            {MODELS.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={m.id === model}
                  onClick={() => {
                    onModelChange(m.id);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors hover:bg-(--surface) ${
                    m.id === model ? "text-accent" : "text-(--ink-strong)"
                  }`}
                >
                  {m.label}
                  {m.id === model && <CheckMark />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {listening ? (
        <button
          type="button"
          onClick={toggleDictation}
          aria-label="Arrêter la dictée"
          title="Arrêter la dictée"
          className="flex h-[42px] w-[42px] shrink-0 animate-pulse items-center justify-center rounded-full bg-accent text-accent-ink ring-2 ring-accent/40"
        >
          <MicIcon size={22} />
        </button>
      ) : hasText ? (
        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          aria-label="Envoyer"
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink transition-opacity disabled:opacity-40"
        >
          <ArrowUpIcon size={22} />
        </button>
      ) : (
        <button
          type="button"
          onClick={toggleDictation}
          disabled={!browserSupportsSpeechRecognition}
          aria-label="Dictée vocale"
          title={
            browserSupportsSpeechRecognition
              ? "Dictée vocale"
              : "Dictée non supportée par ce navigateur"
          }
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-(--ink) transition-colors hover:bg-(--surface-soft) disabled:opacity-40"
        >
          <MicIcon size={22} />
        </button>
      )}
    </div>
  );
}

function CheckMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}
