import type { Message } from "@/app/types";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };

  const res = await fetch(`${process.env.OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || "phi35-finance",
      messages,
      stream: false,
    }),
  });

  if (!res.ok) {
    return new Response(await res.text(), { status: 500 });
  }

  const data = await res.json();

  return new Response(data.message.content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
    console.log("API CHAT CALLED");
}
