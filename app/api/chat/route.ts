// app/api/chat/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Message } from "@/app/types";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen2:0.5b";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Non authentifié" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const userId = session.user.id;

  const body = await req.json();
  const messages: Message[] = Array.isArray(body.messages) ? body.messages : [];
  const model: string = body.model === "finance" ? "finance" : "medical";
  const temporary = Boolean(body.temporary);
  const regenerate = Boolean(body.regenerate);

  // Mode temporaire : on répond sans rien enregistrer.
  if (temporary) {
    return streamOllama(messages, null);
  }

  // Récupère ou crée la conversation, liée au compte.
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  let conversationId: string | undefined = body.conversationId ?? undefined;

  if (conversationId) {
    const owned = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });
    if (!owned) conversationId = undefined;
  }
  if (!conversationId) {
    const src = lastUser?.content ?? "Nouveau fil";
    const created = await prisma.conversation.create({
      data: {
        userId,
        model,
        title: src.length > 38 ? src.slice(0, 38) + "…" : src,
      },
      select: { id: true },
    });
    conversationId = created.id;
  }

  if (regenerate) {
    // Supprime la dernière réponse de l'assistant avant d'en générer une autre.
    const last = await prisma.message.findFirst({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
    });
    if (last?.role === "assistant") {
      await prisma.message.delete({ where: { id: last.id } });
    }
  } else if (lastUser) {
    // Enregistre le nouveau message utilisateur.
    await prisma.message.create({
      data: { conversationId, role: "user", content: lastUser.content },
    });
  }

  return streamOllama(messages, conversationId, model);
}

// ── Ollama ────────────────────────────────────────────────
async function streamOllama(
  messages: Message[],
  conversationId: string | null,
  model?: string,
) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    return new Response("Ollama error: " + res.status, { status: 502 });
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let full = "";

  // Ollama renvoie du JSON ligne par ligne : on extrait juste le texte.
  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        // Persiste la réponse complète une fois le flux terminé.
        if (conversationId) {
          try {
            await prisma.message.create({
              data: { conversationId, role: "assistant", content: full },
            });
            await prisma.conversation.update({
              where: { id: conversationId },
              data: { model: model ?? "medical" },
            });
          } catch {
            /* la persistance ne doit pas casser la réponse */
          }
        }
        return controller.close();
      }

      const lines = decoder.decode(value).split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          const token = json.message?.content ?? "";
          if (token) {
            full += token;
            controller.enqueue(encoder.encode(token));
          }
        } catch {
          /* ligne partielle : ignorée */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Conversation-Id": conversationId ?? "temp",
    },
  });
}
