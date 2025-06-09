export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: Date;
  attachments?: string[];
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
}
