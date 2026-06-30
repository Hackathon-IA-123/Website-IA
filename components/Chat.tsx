"use client";

import type { Message, ModelId } from "@/app/types";
import { useState } from "react";
import ChatView from "./ChatView";
import DotField from "./DotField";
import Home from "./Home";
import Rail from "./Rail";
import { PenIcon } from "./icons";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Nouveau fil");
  const [model, setModel] = useState<ModelId>("medical");
  const [temporary, setTemporary] = useState(false);

  const isEmpty = messages.length === 0;


  function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return makeId();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}


  function newChat() {
    setMessages([]);
    setLoading(false);
    setTitle("Nouveau fil");
    setTemporary(false);
  }

  // Active/désactive le chat temporaire et démarre une conversation vierge.
  function toggleTemporary() {
    setMessages([]);
    setLoading(false);
    setTemporary((v) => !v);
  }

  // Envoie `history` au modèle et streame une réponse de l'assistant.
  async function streamReply(history: Message[]) {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, model, temporary }),
      });
      if (!res.body) throw new Error("Pas de réponse");

      const assistantId = makeId();
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
          id: makeId(),
          role: "assistant",
          content: "Une erreur est survenue. Réessaie.",
        },
      ]);
    } finally {
      console.log("FETCH /api/chat");	    
      setLoading(false);
    }
  }

  async function sendMessage(text: string) {
    if (loading) return;
    const userMessage: Message = {
      id: makeId(),
      role: "user",
      content: text,
    };
    const history = [...messages, userMessage];
    setMessages(history);
    if (messages.length === 0) {
      setTitle(text.length > 38 ? text.slice(0, 38) + "…" : text);
    }
    console.log("SEND MESSAGE:", text);
    await streamReply(history);
  }

  // Régénère une réponse : on repart de l'historique jusqu'au message
  // utilisateur qui la précède, puis on re-streame.
  async function regenerate(assistantId: string) {
    if (loading) return;
    const idx = messages.findIndex((m) => m.id === assistantId);
    if (idx <= 0) return;
    const history = messages.slice(0, idx); // garde tout jusqu'au message user inclus
    setMessages(history);
    await streamReply(history);
  }

  // Foyer lumineux : centre pour l'accueil (2a), bas pour la conversation (2c).
  const focus = isEmpty
    ? { x: 0.5, y: 0.6, rad: 0.4, str: 1 }
    : { x: 0.5, y: 1.14, rad: 0.55, str: 0.7 };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <DotField focus={focus} />

      {/* Chat temporaire (haut droite) - accueil uniquement */}
      {isEmpty && (
        <button
          onClick={toggleTemporary}
          aria-label="Chat temporaire"
          aria-pressed={temporary}
          title={
            temporary ? "Désactiver le chat temporaire" : "Chat temporaire"
          }
          className={`absolute right-[30px] top-[30px] z-20 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            temporary
              ? "bg-accent/15 text-accent ring-1 ring-accent/40"
              : "text-[#cfcfcf] hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <PenIcon size={20} />
        </button>
      )}

      <Rail onNewChat={newChat} />

      <main className="animate-ui-fade-up relative z-10 min-w-0 flex-1">
        {isEmpty ? (
          <Home
            onSend={sendMessage}
            model={model}
            onModelChange={setModel}
          />
        ) : (
          <ChatView
            title={title}
            messages={messages}
            loading={loading}
            onSend={sendMessage}
            onRegenerate={regenerate}
            model={model}
            onModelChange={setModel}
          />
        )}
      </main>
    </div>
  );
}
