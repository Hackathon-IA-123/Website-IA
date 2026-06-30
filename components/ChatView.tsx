"use client";

import type { Message, ModelId } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import Composer from "./Composer";
import Logo from "./Logo";
import {
  ChevronDownIcon,
  CopyIcon,
  DotsIcon,
  RegenIcon,
  ShareIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "./icons";

interface ChatViewProps {
  title: string;
  messages: Message[];
  loading: boolean;
  onSend: (text: string) => void;
  onRegenerate: (assistantId: string) => void;
  model: ModelId;
  onModelChange: (model: ModelId) => void;
}

type Feedback = "up" | "down";

export default function ChatView({
  title,
  messages,
  loading,
  onSend,
  onRegenerate,
  model,
  onModelChange,
}: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const waiting = loading && messages[messages.length - 1]?.role === "user";

  async function copy(m: Message) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(m.content);
      ok = true;
    } catch {
      // Fallback (presse-papiers async indisponible ou document non focalisé).
      try {
        const ta = document.createElement("textarea");
        ta.value = m.content;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopiedId(m.id);
      setTimeout(() => setCopiedId((id) => (id === m.id ? null : id)), 1500);
    }
  }

  function vote(id: string, value: Feedback) {
    setFeedback((prev) => {
      const next = { ...prev };
      if (next[id] === value) delete next[id];
      else next[id] = value;
      return next;
    });
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Barre supérieure */}
      <div className="z-10 flex h-[72px] shrink-0 items-center justify-between bg-gradient-to-b from-[#060606] to-transparent px-[30px]">
        <div className="flex items-center gap-2 text-[20px] font-medium text-[#ededed]">
          {title}
          <span className="text-[#7a7a7a]">
            <ChevronDownIcon size={16} />
          </span>
        </div>
        <div className="flex items-center gap-5 text-[#9c9c9c]">
          <button aria-label="Partager" className="hover:text-white">
            <ShareIcon />
          </button>
          <button aria-label="Plus" className="hover:text-white">
            <DotsIcon />
          </button>
        </div>
      </div>

      {/* Fil de conversation */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[760px] px-6 pb-10 pt-[18px]">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="mb-[34px] flex justify-end">
                <div className="max-w-[74%] whitespace-pre-wrap rounded-[22px_22px_7px_22px] border border-white/5 bg-white/[0.07] px-5 py-[14px] text-[17px] leading-[1.55] text-[#ededed]">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={m.id} className="mb-6 flex gap-4">
                <span className="mt-0.5 shrink-0">
                  <Logo size={30} />
                </span>
                <div className="flex-1 text-[17px] leading-[1.65] text-[#e6e6e6]">
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {!loading && m.content && (
                    <div className="mt-[18px] flex gap-[18px] text-[#8a8a8a]">
                      <ActionButton
                        label={copiedId === m.id ? "Copié" : "Copier"}
                        active={copiedId === m.id}
                        onClick={() => copy(m)}
                      >
                        {copiedId === m.id ? <CheckIcon /> : <CopyIcon />}
                      </ActionButton>
                      <ActionButton
                        label="J'aime"
                        active={feedback[m.id] === "up"}
                        onClick={() => vote(m.id, "up")}
                      >
                        <ThumbUpIcon />
                      </ActionButton>
                      <ActionButton
                        label="Je n'aime pas"
                        active={feedback[m.id] === "down"}
                        onClick={() => vote(m.id, "down")}
                      >
                        <ThumbDownIcon />
                      </ActionButton>
                      <ActionButton
                        label="Régénérer"
                        onClick={() => onRegenerate(m.id)}
                      >
                        <RegenIcon />
                      </ActionButton>
                    </div>
                  )}
                </div>
              </div>
            ),
          )}

          {waiting && (
            <div className="mb-6 flex gap-4">
              <span className="mt-0.5 shrink-0">
                <Logo size={30} />
              </span>
              <div className="flex items-center gap-1 pt-3">
                <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
                <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
                <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Champ ancré en bas */}
      <div className="shrink-0 px-6 pb-[38px] pt-2">
        <div className="mx-auto w-full max-w-[760px]">
          <Composer
            onSend={onSend}
            disabled={loading}
            variant="chat"
            placeholder="Répondre à Jean"
            model={model}
            onModelChange={onModelChange}
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`transition-colors ${
        active ? "text-accent" : "hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}
