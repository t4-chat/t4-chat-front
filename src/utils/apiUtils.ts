import { providerIconPaths } from "@/assets/icons/ai-providers";
import { type SetStateAction, useEffect, useState } from "react";
import {
  useAiModelsServiceGetApiAiModels,
  useChatsServiceGetApiChats,
  useChatsServicePostApiChatsConversation,
} from "~/openapi/queries/queries";

export interface ChatMessageRequest {
  role: "user" | "assistant";
  content: string;
  attachments?: string[];
}

export interface StreamRequestBody {
  messages: ChatMessageRequest[];
  chat_id?: string;
  model_id: number;
}

export interface MessageStartEvent {
  type: "message_start";
  message: { id: string; role: string };
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

export type StreamEvent =
  | MessageStartEvent
  | MessageContentEvent
  | ChatMetadataEvent
  | DoneEvent;

export type StreamEventCallback = (event: StreamEvent) => void;
export type ErrorCallback = (error: Error) => void;
export type DoneCallback = () => void;

export const getProviderIconPath = (provider: string): string => {
  return (
    providerIconPaths[
      provider.toLowerCase() as keyof typeof providerIconPaths
    ] || providerIconPaths.default
  );
};

export const useAIModelsForChat = () => {
  const { data: models, ...other } = useAiModelsServiceGetApiAiModels();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const options =
    models?.map((model) => ({
      value: model.id.toString(),
      label: model.name,
      iconPath: getProviderIconPath(model.provider.slug),
    })) || [];

  useEffect(() => {
    if (!options?.length || selectedModel) return;
    setSelectedModel(options[0].value);
  }, [selectedModel, options]);

  return {
    ...other,
    modelOptions: options,
    selectedModel,
    setSelectedModel,
  };
};

export const useChats = () => {
  const { data: chats, ...other } = useChatsServiceGetApiChats();

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
