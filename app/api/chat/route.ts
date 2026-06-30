import type { Message } from "@/app/types";

/**
 * Mock de l'endpoint de chat.
 *
 * Pour l'instant on renvoie une réponse factice en streaming (SSE-like via
 * ReadableStream) afin de pouvoir tester l'UI sans modèle réel.
 *
 * Plus tard : remplacer le contenu de cette fonction par un appel au modèle IA
 * (Anthropic, OpenAI, etc.) et streamer ses tokens à la place.
 */
export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };
  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  const reply = `Ceci est une réponse de démonstration. La connexion au modèle IA sera branchée ici.\n\nTu as écrit : « ${lastUser?.content ?? ""} »`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Streame mot par mot pour simuler une génération token par token.
      const words = reply.split(" ");
      for (const word of words) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 30));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
