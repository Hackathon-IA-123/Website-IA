"use client";

import { useEffect, useRef, useState } from "react";
import { PlusIcon, MicIcon, ChevronDownIcon, ArrowUpIcon } from "./icons";
import { MODELS, type ModelId } from "@/app/types";

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

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
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
  const bg = variant === "home" ? "bg-[rgba(20,20,21,0.90)]" : "bg-[rgba(22,22,23,0.90)]";
  const textSize = variant === "home" ? "text-[19px]" : "text-[18px]";

  return (
    <div
      className={`animate-ui-soft-float animate-ui-soft-glow flex w-full items-center gap-[14px] rounded-[33px] ${bg} ${minH} border border-white/8 py-2 pl-[22px] pr-[14px] backdrop-blur-[14px]`}
    >
      <span className="text-[#cfcfcf]">
        <PlusIcon size={26} />
      </span>

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
          className="flex items-center gap-[5px] rounded-[14px] px-[10px] py-2 text-[17px] font-medium text-[#dcdcdc] transition-colors hover:bg-white/6"
        >
          {currentModel.label}
          <span
            className={`text-[#9c9c9c] transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDownIcon size={16} />
          </span>
        </button>

        {menuOpen && (
          <ul
            role="listbox"
            className="absolute bottom-full right-0 z-30 mb-3 min-w-[180px] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(24,24,26,0.96)] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-[14px]"
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
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors hover:bg-white/[0.07] ${
                    m.id === model ? "text-accent" : "text-[#dcdcdc]"
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

      {hasText ? (
        <button
          onClick={submit}
          disabled={disabled}
          aria-label="Envoyer"
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink transition-opacity disabled:opacity-40"
        >
          <ArrowUpIcon size={22} />
        </button>
      ) : (
        <button
          aria-label="Dictée vocale"
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-[#cfcfcf]"
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
