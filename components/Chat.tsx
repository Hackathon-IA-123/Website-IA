"use client";

import { useState } from "react";
import type { Message } from "@/app/types";
import Sidebar from "./Sidebar";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const SUGGESTIONS = [
  "Explique-moi un concept simplement",
  "Aide-moi à rédiger un email",
  "Donne-moi des idées de projet",
  "Résume un texte long",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  function newChat() {
    setMessages([]);
    setLoading(false);
  }

  async function sendMessage(text: string) {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const history = [...messages, userMessage];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.body) throw new Error("Pas de réponse");

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Une erreur est survenue. Réessaie.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar onNewChat={newChat} />

      <main className="flex h-full flex-1 flex-col">
        <header className="flex items-center px-6 py-4 text-xl font-medium text-muted">
          Website-IA
        </header>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <h1 className="brand-gradient text-center text-4xl font-semibold sm:text-5xl">
              Bonjour
            </h1>
            <p className="mt-2 text-center text-2xl text-muted sm:text-3xl">
              Comment puis-je t&apos;aider aujourd&apos;hui&nbsp;?
            </p>

            <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-xl bg-surface p-4 text-left text-sm text-foreground transition-colors hover:bg-surface-hover"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ChatMessages messages={messages} loading={loading} />
        )}

        <ChatInput onSend={sendMessage} disabled={loading} />
      </main>
    </div>
  );
}
