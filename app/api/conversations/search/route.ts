import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Recherche dans l'historique : par titre OU contenu des messages.
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { messages: { some: { content: { contains: q, mode: "insensitive" } } } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      model: true,
      messages: {
        where: { content: { contains: q, mode: "insensitive" } },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { content: true },
      },
    },
  });

  const results = conversations.map((c) => ({
    id: c.id,
    title: c.title,
    model: c.model,
    snippet: c.messages[0]?.content.slice(0, 140) ?? null,
  }));

  return NextResponse.json({ results });
}
