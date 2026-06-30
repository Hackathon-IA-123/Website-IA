"use client";

import type {
  ConversationSummary,
  Message,
  ModelId,
  SessionUser,
} from "@/app/types";
import { useState } from "react";
import ChatView from "./ChatView";
import DotField from "./DotField";
import Home from "./Home";
import Rail from "./Rail";
import { useTheme } from "./ThemeProvider";
import { TemporaryChatIcon } from "./icons";

interface ChatProps {
  user: SessionUser;
  initialConversations: ConversationSummary[];
}

export default function Chat({ user, initialConversations }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Nouveau fil");
  const [model, setModel] = useState<ModelId>("medical");
  const [temporary, setTemporary] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] =
    useState<ConversationSummary[]>(initialConversations);
  const { theme } = useTheme();

  const isEmpty = messages.length === 0;


  function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}


  function newChat() {
    setMessages([]);
    setLoading(false);
    setTitle("Nouveau fil");
    setTemporary(false);
    setConversationId(null);
  }

  function toggleTemporary() {
    setMessages([]);
    setLoading(false);
    setConversationId(null);
    setTemporary((v) => !v);
  }

  async function refreshConversations() {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) return;
      const data = await res.json();
      setConversations(data.conversations);
    } catch {
      /* ignore */
    }
  }

  // Charge une ancienne conversation pour y revenir.
  async function loadConversation(id: string) {
    if (loading || id === conversationId) return;
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) return;
      const { conversation } = await res.json();
      setMessages(conversation.messages);
      setConversationId(conversation.id);
      setTitle(conversation.title);
      setModel(conversation.model as ModelId);
      setTemporary(false);
    } catch {
      /* ignore */
    }
  }

  // Envoie l'historique au backend (Ollama) et streame la réponse.
  async function streamReply(history: Message[], regenerate = false) {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          model,
          temporary,
          conversationId,
          regenerate,
        }),
      });
      if (!res.ok || !res.body) throw new Error("Pas de réponse");

      const cid = res.headers.get("X-Conversation-Id");
      if (cid && cid !== "temp") setConversationId(cid);

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

      if (!temporary) await refreshConversations();
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
    if (messages.length === 0 && !temporary) {
      setTitle(text.length > 38 ? text.slice(0, 38) + "…" : text);
    }
    console.log("SEND MESSAGE:", text);
    await streamReply(history);
  }

  // Régénère la dernière réponse de l'assistant.
  async function regenerate(assistantId: string) {
    if (loading) return;
    const idx = messages.findIndex((m) => m.id === assistantId);
    if (idx <= 0) return;
    const history = messages.slice(0, idx);
    setMessages(history);
    await streamReply(history, true);
  }

  // Foyer lumineux : centre pour l'accueil (2a), bas pour la conversation (2c).
  const focus = isEmpty
    ? { x: 0.5, y: 0.6, rad: 0.4, str: 1 }
    : { x: 0.5, y: 1.14, rad: 0.55, str: 0.7 };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <DotField focus={focus} theme={theme} />

      {/* Chat temporaire (haut droite) - accueil uniquement */}
      {isEmpty && (
        <button
          onClick={toggleTemporary}
          aria-label={
            temporary
              ? "Désactiver le chat temporaire"
              : "Activer le chat temporaire"
          }
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
          <TemporaryChatIcon size={20} />
        </button>
      )}

      <Rail
        user={user}
        conversations={conversations}
        activeId={conversationId}
        onNewChat={newChat}
        onSelect={loadConversation}
      />

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
            temporary={temporary}
            onToggleTemporary={toggleTemporary}
          />
        )}
      </main>
    </div>
  );
}
