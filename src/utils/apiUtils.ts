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

export const useStreamChat = () => {
  const { mutateAsync: streamChat } = useChatsServicePostApiChatsConversation();

  return async (
    messages: ChatMessageRequest[],
    modelId: number,
    onEvent: StreamEventCallback,
    onError: ErrorCallback,
    onDone: DoneCallback,
    options?: {
      chatId?: string | null;
      abortSignal?: AbortSignal;
    },
  ) => {
    const { chatId } = options || {};
    const body: StreamRequestBody = {
      messages,
      model_id: modelId,
    };

    if (chatId) {
      body.chat_id = chatId;
    }
    try {
      const response = await streamChat({
        requestBody: {
          messages: body.messages,
          model_id: body.model_id,
          chat_id: body.chat_id,
        },
      });
      debugger;
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onDone();
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);

            try {
              const data = JSON.parse(jsonStr);
              onEvent(data as StreamEvent);

              if (data.type === "done") {
                onDone();
                return;
              }
            } catch (error) {
              console.error("Error parsing JSON:", error, "Line:", jsonStr);
            }
          }
        }
      }
    } catch (error: any) {
      debugger;
      if (error.name !== "AbortError") {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };
};

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
