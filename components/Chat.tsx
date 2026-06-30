"use client";

import type { Message } from "@/app/types";
import { useState } from "react";
import ChatView from "./ChatView";
import DotField from "./DotField";
import Home from "./Home";
import { PenIcon } from "./icons";
import Rail from "./Rail";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Nouveau fil");

  const isEmpty = messages.length === 0;

  function newChat() {
    setMessages([]);
    setLoading(false);
    setTitle("Nouveau fil");
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
    if (messages.length === 0) {
      setTitle(text.length > 38 ? text.slice(0, 38) + "…" : text);
    }

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
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
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

  // Foyer lumineux : centre pour l'accueil (2a), bas pour la conversation (2c).
  const focus = isEmpty
    ? { x: 0.5, y: 0.6, rad: 0.4, str: 1 }
    : { x: 0.5, y: 1.14, rad: 0.55, str: 0.7 };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <DotField focus={focus} />

      {/* Édition (haut droite) - accueil uniquement */}
      {isEmpty && (
        <button
          aria-label="Composer"
          className="absolute right-[30px] top-[30px] z-20 flex h-10 w-10 items-center justify-center rounded-full border-[1.4px] border-dashed border-white/[0.28] text-[#cfcfcf] hover:text-white"
        >
          <PenIcon size={20} />
        </button>
      )}

      <Rail onNewChat={newChat} />

      <main className="relative z-10 min-w-0 flex-1">
        {isEmpty ? (
          <Home onSend={sendMessage} />
        ) : (
          <ChatView
            title={title}
            messages={messages}
            loading={loading}
            onSend={sendMessage}
          />
        )}
      </main>
    </div>
  );
}
