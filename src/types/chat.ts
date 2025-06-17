import type { ChatMessageResponseSchema } from "~/openapi/requests/types.gen";

export interface ChatMessage extends ChatMessageResponseSchema {
  done?: boolean;
  reasoning?: string;
}

export interface AIModel {
  value: string;
  label: string;
}

export interface Chat {
  id: string;
  title: string;
  pinned: boolean;
  created_at: Date;
  updated_at: Date;
  messages?: ChatMessage[];
  shared_conversation?: {
    id: string;
  } | null;
}
