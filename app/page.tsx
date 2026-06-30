import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Chat from "@/components/Chat";
import Login from "@/components/Login";
import type { ModelId } from "@/app/types";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ conversation_id?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return <Login />;
  }

  const { conversation_id } = await searchParams;

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, model: true },
  });

  return (
    <Chat
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
      initialConversations={conversations.map((c) => ({
        id: c.id,
        title: c.title,
        model: c.model as ModelId,
      }))}
      initialConversationId={conversation_id ?? null}
    />
  );
}
