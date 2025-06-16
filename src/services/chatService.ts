import type { Chat } from "@/features/chat/types";
import { tokenService } from "~/openapi/requests/core/OpenAPI";
import { api } from "@/services/api";
import type {
  MultiModelCompletionRequestSchema,
  ChatMessageRequestSchema,
} from "~/openapi/requests/types.gen";
import { queryClient } from "@/App";
import { UseChatsServiceGetApiChatsByChatIdMessagesKeyFn } from "~/openapi/queries/common";
import type {
  DoneCallback,
  StreamEvent,
  StreamEventCallback,
} from "@/utils/apiUtils";

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
    modelIds,
    onEvent,
    onError,
    onDone,
    options,
  }: {
    message: ChatMessageRequestSchema;
    modelIds: string[];
    onEvent: StreamEventCallback;
    onError: ErrorCallback;
    onDone: DoneCallback;
    options?: {
      chatId?: string | null;
      sharedConversationId?: string | null;
      abortSignal?: AbortSignal;
      tools?: string[];
    };
  }): () => void {
    const { abortSignal, sharedConversationId, tools } = options || {};

    const body: MultiModelCompletionRequestSchema = {
      message,
      model_ids: modelIds,
      shared_conversation_id: sharedConversationId || undefined,
      options: tools && tools.length > 0 ? { tools } : undefined,
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
                  queryClient.invalidateQueries({
                    queryKey: UseChatsServiceGetApiChatsByChatIdMessagesKeyFn({
                      chatId: options?.chatId || "",
                    }),
                  });
                  onDone();

                  return;
                }
              } catch (error) {
                console.error("Error parsing JSON:", error, "Line:", jsonStr);
              }
            }
          }
        }
      } catch (error: unknown) {
        const e = error as Error & { name?: string };
        if (e.name !== "AbortError") {
          onError(e instanceof Error ? e : new Error(String(error)));
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
