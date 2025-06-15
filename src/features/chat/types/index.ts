export interface ChatMessage {
  id?: string;
  role?: "user" | "assistant";
  content: string;
  attachments?: string[] | null;
  previous_message_id?: string;
  created_at?: Date;
  chat_id?: string;
  model_id?: number;
  selected?: boolean;
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
