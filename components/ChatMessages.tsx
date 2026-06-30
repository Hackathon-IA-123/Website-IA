"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/app/types";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-start gap-4">
            <Avatar role="assistant" />
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
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className="flex items-start gap-4">
      <Avatar role={message.role} />
      <div className="flex-1 pt-1">
        <p className="mb-1 text-sm font-medium text-foreground">
          {isUser ? "Toi" : "IA"}
        </p>
        <div className="whitespace-pre-wrap leading-relaxed text-foreground">
          {message.content}
        </div>
      </div>
    </div>
  );
}

function Avatar({ role }: { role: Message["role"] }) {
  if (role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-sm font-medium text-foreground">
        T
      </div>
    );
  }
  return (
    <div
      className="h-8 w-8 shrink-0 rounded-full"
      style={{
        background:
          "linear-gradient(135deg, #4285f4 0%, #9b72cb 50%, #d96570 100%)",
      }}
    />
  );
}
