"use client";

import Composer from "./Composer";
import type { ModelId } from "@/app/types";
import { TemporaryChatIcon } from "./icons";

const SUGGESTIONS = [
  "✦ Résumer un document",
  "Idées de week-end",
  "Coder une fonction",
];

interface HomeProps {
  onSend: (text: string) => void;
  model: ModelId;
  onModelChange: (model: ModelId) => void;
  temporary: boolean;
}

export default function Home({
  onSend,
  model,
  onModelChange,
  temporary,
}: HomeProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <h1 className="text-center text-[clamp(34px,5vw,56px)] font-light leading-[1.1] tracking-[-0.015em] text-foreground">
        Bonsoir Thomas, on <span className="text-accent">explore</span> ?
      </h1>

      <div className="mt-[46px] w-full max-w-[860px]">
        <Composer
          onSend={onSend}
          variant="home"
          placeholder="Demander à Jean"
          model={model}
          onModelChange={onModelChange}
        />
      </div>

      <div className="mt-[30px] flex flex-wrap justify-center gap-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSend(s.replace(/^✦\s*/, ""))}
            className="rounded-[30px] border border-(--border-soft) bg-(--chip-bg) px-[18px] py-[11px] text-[15px] text-(--ink) shadow-[0_8px_30px_var(--composer-shadow)] backdrop-blur-[14px] transition-colors hover:bg-(--chip-hover)"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
