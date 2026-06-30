"use client";

import { useRef, useState } from "react";
import { PlusIcon, MicIcon, ChevronDownIcon, ArrowUpIcon } from "./icons";

interface ComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** taille du texte du placeholder (home = 19px, chat = 18px) */
  variant?: "home" | "chat";
}

export default function Composer({
  onSend,
  disabled,
  placeholder = "Demander à Jean",
  variant = "home",
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

  const minH = variant === "home" ? "min-h-[66px]" : "min-h-[62px]";
  const bg = variant === "home" ? "bg-[rgba(20,20,21,0.66)]" : "bg-[rgba(22,22,23,0.82)]";
  const textSize = variant === "home" ? "text-[19px]" : "text-[18px]";

  return (
    <div
      className={`flex w-full items-center gap-[14px] rounded-[33px] ${bg} ${minH} border border-white/[0.08] py-2 pl-[22px] pr-[14px] shadow-[0_14px_50px_rgba(0,0,0,0.45)] backdrop-blur-[14px]`}
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

      <div className="flex items-center gap-[5px] rounded-[14px] px-[10px] py-2 text-[17px] font-medium text-[#dcdcdc]">
        Pro
        <span className="text-[#9c9c9c]">
          <ChevronDownIcon size={16} />
        </span>
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
