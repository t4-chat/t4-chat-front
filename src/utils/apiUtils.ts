import { useMemo } from "react";
import { useChatsServiceGetApiChats } from "~/openapi/queries/queries";
import { useAiModelsServiceGetApiAiModels } from "../../openapi/queries/queries";
import type { AiModelResponseSchema } from "../../openapi/requests/types.gen";
import { useAuth } from "../contexts/AuthContext";

export const useFilteredAiModels = () => {
  const { data: models = [], ...modelsQuery } =
    useAiModelsServiceGetApiAiModels();

  const filteredModels = useMemo(() => {
    return models.filter((model: AiModelResponseSchema) => {
      if (!model.modalities.includes("text")) return false;
      // Show model if it doesn't require BYOK or if user has an API key for it
      return !model.only_with_byok || model.has_api_key;
    });
  }, [models]);

  return {
    ...modelsQuery,
    data: filteredModels,
  };
};

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

export interface ErrorStreamEvent {
  type: "error";
  error: string;
  code?: number;
}

export interface ReasoningContentEvent {
  type: "reasoning_content";
  model_id: string;
  message_id: string;
  content: { text: string; type: string };
}

export type StreamEvent =
  | MessageStartEvent
  | MessageContentEvent
  | MessageContentStopEvent
  | ChatMetadataEvent
  | MessageStopEvent
  | DoneEvent
  | ErrorStreamEvent
  | ReasoningContentEvent;

export type StreamEventCallback = (event: StreamEvent) => void;
export type ErrorCallback = (error: Error) => void;
export type DoneCallback = () => void;

export const useChats = () => {
  const { isAuthenticated } = useAuth();
  const { data: chats, ...other } = useChatsServiceGetApiChats(undefined, {
    enabled: isAuthenticated,
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
