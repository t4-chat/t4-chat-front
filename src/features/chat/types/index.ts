export interface ChatMessage {
  id?: string;
  content: string;
  attachments?: string[];
  created_at?: Date;
  chat_id?: string;
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
