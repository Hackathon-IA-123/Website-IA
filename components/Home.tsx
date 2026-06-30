"use client";

import type { ModelId } from "@/app/types";
import Composer from "./Composer";
import { TemporaryChatIcon } from "./icons";

const SUGGESTIONS: Record<ModelId, string[]> = {
  medical: [
    "Expliquer mes symptômes",
    "Interactions entre médicaments",
    "Comprendre une analyse de sang",
  ],
  finance: [
    "Construire un budget mensuel",
    "Comprendre un placement",
    "Optimiser mes impôts",
  ],
};

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
      {temporary && (
        <div className="mb-7 flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-[14px] text-accent">
          <TemporaryChatIcon size={18} />
          Chat temporaire — cette conversation ne sera pas enregistrée
        </div>
      )}

      <h1 className="text-center text-[clamp(34px,5vw,56px)] font-light leading-[1.1] tracking-[-0.015em] text-foreground">
        {temporary ? (
          <>
            Un échange <span className="text-accent">éphémère</span> ?
          </>
        ) : (
          <>
            Bonsoir Thomas, on <span className="text-accent">explore</span> ?
          </>
        )}
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
        {(SUGGESTIONS[model] ?? SUGGESTIONS.medical).map((s) => (
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
