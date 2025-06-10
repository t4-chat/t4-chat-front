import type { Chat } from "@/features/chat/types";
import { tokenService } from "~/openapi/requests/core/OpenAPI";
import { api } from "@/services/api";
import {
  ChatCompletionRequestSchema,
  ChatMessageRequestSchema,
} from "~/openapi/requests/types.gen";

export interface ChatMessageRequest {
  role: string;
  content: string;
  attachments?: string[];
}

export interface StreamRequestBody {
  message: ChatMessageRequest;
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

export class ChatService {
  private baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

  private getAuthHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenService.getToken()}`,
    };
  }

  streamChat({
    message,
    modelId,
    onEvent,
    onError,
    onDone,
    options,
  }: {
    message: ChatMessageRequestSchema;
    modelId: number;
    onEvent: StreamEventCallback;
    onError: ErrorCallback;
    onDone: DoneCallback;
    options?: {
      chatId?: string | null;
      abortSignal?: AbortSignal;
    };
  }): () => void {
    const { abortSignal } = options || {};

    const body: ChatCompletionRequestSchema = {
      message,
      model_id: modelId,
    };

    const controller = new AbortController();
    const signal = abortSignal || controller.signal;

    (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/api/chats/conversation`, {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(body),
          signal,
        });

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
        if (error.name !== "AbortError") {
          onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    })();

    return () => controller.abort();
  }

  async getChat(id: string): Promise<Chat> {
    const response = await api.get(`/api/chats/${id}`);

    return response.data;
  }
}
