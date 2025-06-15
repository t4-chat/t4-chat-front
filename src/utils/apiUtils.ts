import { useChatsServiceGetApiChats } from "~/openapi/queries/queries";
import { tokenService } from "~/openapi/requests/core/OpenAPI";

export interface MessageStartEvent {
  type: "message_start";
  message: {
    id: string;
    role: string;
    model_id: string;
    model_name: string;
    reply_to: string;
  };
}

export interface MessageContentEvent {
  type: "message_content";
  content: { text: string; type: string };
}

export interface ChatMetadataEvent {
  type: "chat_metadata";
  chat: { id: string };
}

export interface DoneEvent {
  type: "done";
}

export interface MessageStopEvent {
  type: "message_stop";
  message: { id: string };
}

export interface MessageContentStopEvent {
  type: "message_content_stop";
  message: { id: string; model_id: string; model_name: string };
}

export type StreamEvent =
  | MessageStartEvent
  | MessageContentEvent
  | MessageContentStopEvent
  | ChatMetadataEvent
  | MessageStopEvent
  | DoneEvent;

export type StreamEventCallback = (event: StreamEvent) => void;
export type ErrorCallback = (error: Error) => void;
export type DoneCallback = () => void;

export const useChats = () => {
  const { data: chats, ...other } = useChatsServiceGetApiChats(undefined, {
    enabled: !!tokenService.getToken(),
  });

  if (!chats) {
    return { ...other, chats: [] };
  }

  const chatsWithDateObjects = chats.map((chat) => ({
    ...chat,
    created_at: new Date(chat.created_at),
    updated_at: new Date(chat.updated_at),
  }));

  return { ...other, chats: chatsWithDateObjects };
};
