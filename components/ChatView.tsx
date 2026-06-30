"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/app/types";
import Composer from "./Composer";
import Logo from "./Logo";
import {
  ChevronDownIcon,
  ShareIcon,
  DotsIcon,
  CopyIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  RegenIcon,
} from "./icons";

interface ChatViewProps {
  title: string;
  messages: Message[];
  loading: boolean;
  onSend: (text: string) => void;
}

export default function ChatView({
  title,
  messages,
  loading,
  onSend,
}: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const waiting = loading && messages[messages.length - 1]?.role === "user";

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
                  {!loading && (
                    <div className="mt-[18px] flex gap-[18px] text-[#8a8a8a]">
                      <button className="hover:text-white" aria-label="Copier">
                        <CopyIcon />
                      </button>
                      <button className="hover:text-white" aria-label="J'aime">
                        <ThumbUpIcon />
                      </button>
                      <button
                        className="hover:text-white"
                        aria-label="Je n'aime pas"
                      >
                        <ThumbDownIcon />
                      </button>
                      <button
                        className="hover:text-white"
                        aria-label="Régénérer"
                      >
                        <RegenIcon />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
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
          />
        </div>
      </div>
    </div>
  );
}
