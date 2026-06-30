// app/api/chat/route.ts
import type { Message } from "@/app/types";

const BACKEND = process.env.LLM_BACKEND ;
const OLLAMA_URL = process.env.OLLAMA_URL;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ;


export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };

  return streamOllama(messages);
}

// ── Ollama ────────────────────────────────────────────────
async function streamOllama(messages: Message[]) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: true,
    }),
  });

  if (!res.ok || !res.body)
    return new Response("Ollama error: " + res.status, { status: 502 });

  // Ollama sends newline-delimited JSON — extract just the token text
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) return controller.close();

      const lines = decoder.decode(value).split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          const token = json.message?.content ?? "";
          if (token) controller.enqueue(new TextEncoder().encode(token));
        } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

