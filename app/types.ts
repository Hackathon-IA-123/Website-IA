export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  model: ModelId;
}

export interface SessionUser {
  name: string | null;
  email: string | null;
  image: string | null;
}

export type ModelId = "medical" | "finance";

export const MODELS: { id: ModelId; label: string }[] = [
  { id: "medical", label: "Médical" },
  { id: "finance", label: "Finance" },
];
