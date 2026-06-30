export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export type ModelId = "medical" | "finance";

export const MODELS: { id: ModelId; label: string }[] = [
  { id: "medical", label: "Médical" },
  { id: "finance", label: "Finance" },
];
