import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "~/openapi/requests";
import { useFilesServicePostApiFilesUpload } from "~/openapi/queries/queries";
import { ChatService } from "@/services/chatService";
import type { StreamEvent } from "@/utils/apiUtils";

interface UseChatSenderOptions {
  onEvent: (
    event: StreamEvent & { message_id?: string; model_id?: number },
  ) => void;
  onError: (error: unknown) => void;
  onDone: () => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

export const useChatSender = ({
  onEvent,
  onError,
  onDone,
  onUploadingChange,
}: UseChatSenderOptions) => {
  const { handleError, handleSuccess } = useMutationErrorHandler();
  const { mutateAsync: upload } = useFilesServicePostApiFilesUpload({
    onSuccess: () => handleSuccess("File uploaded successfully"),
    onError: (error) => handleError(error, "Failed to upload file"),
  });
  const send = async (
    content: string,
    files: File[] | undefined,
    modelIds: string[],
    tools: string[] | undefined,
    chatId?: string | null,
    sharedConversationId?: string | null,
  ) => {
    let attachmentIds: string[] = [];
    if (files && files.length > 0) {
      onUploadingChange?.(true);
      try {
        const results = await Promise.all(
          files.map((file) => upload({ formData: { file } })),
        );
        attachmentIds = results.map((r) => r.file_id);
      } finally {
        onUploadingChange?.(false);
      }
    }

    const abort = new ChatService().streamChat({
      message: {
        content,
        // role: "user",
        attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
        chat_id: chatId || undefined,
      },
      modelIds,
      onEvent,
      onError,
      onDone,
      options: { chatId, sharedConversationId, tools },
    });

    return { abort };
  };

  return { send };
};

export default useChatSender;

interface LegacyApiError {
  message?: string;
  detail?: string;
  status?: number;
  response?: {
    data?: {
      detail?: string | { msg?: string; type?: string }[];
      message?: string;
      error?: string;
      errors?: Array<string | { message?: string; msg?: string }>;
    };
    status?: number;
    statusText?: string;
  };
}

export const useMutationErrorHandler = () => {
  const handleError = (error: unknown, customMessage?: string) => {
    let errorMessage = customMessage || "An unexpected error occurred";

    console.log("Error object:", error); // Debug logging

    if (error instanceof ApiError) {
      // Handle OpenAPI generated ApiError class
      console.log("ApiError body:", error.body); // Debug the body content

      // Try to extract detailed message from the response body
      if (error.body && typeof error.body === "object") {
        const body = error.body as Record<string, unknown>;

        if (typeof body.detail === "string") {
          errorMessage = body.detail;
        } else if (Array.isArray(body.detail) && body.detail.length > 0) {
          // Handle validation errors
          errorMessage = body.detail
            .map((err: unknown) => {
              if (typeof err === "object" && err !== null) {
                const errorObj = err as Record<string, unknown>;
                return (
                  (errorObj.msg as string) ||
                  (errorObj.type as string) ||
                  "Validation error"
                );
              }
              return "Validation error";
            })
            .join(", ");
        } else if (typeof body.message === "string") {
          errorMessage = body.message;
        } else if (typeof body.error === "string") {
          errorMessage = body.error;
        } else if (Array.isArray(body.errors) && body.errors.length > 0) {
          errorMessage = body.errors
            .map((err: unknown) => {
              if (typeof err === "string") {
                return err;
              } else if (typeof err === "object" && err !== null) {
                const errorObj = err as Record<string, unknown>;
                return (
                  (errorObj.message as string) ||
                  (errorObj.msg as string) ||
                  "Error"
                );
              }
              return "Error";
            })
            .join(", ");
        }

        // Fallback to status information if no error message found
        if (
          errorMessage === (customMessage || "An unexpected error occurred")
        ) {
          errorMessage = `${error.statusText || error.status || "Request failed"}`;
        }
      } else {
        // If no body or body is not an object, use status info
        errorMessage = `${error.statusText || error.status || "Request failed"}`;
      }
    } else if (error && typeof error === "object") {
      // Handle legacy error format (keeping for backward compatibility)
      const apiError = error as LegacyApiError;

      if (apiError.response?.data?.detail) {
        const detail = apiError.response.data.detail;
        if (typeof detail === "string") {
          errorMessage = detail;
        } else if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail
            .map((err) => err.msg || err.type || "Validation error")
            .join(", ");
        }
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.response?.data?.error) {
        errorMessage = apiError.response.data.error;
      } else if (
        apiError.response?.data?.errors &&
        Array.isArray(apiError.response.data.errors) &&
        apiError.response.data.errors.length > 0
      ) {
        errorMessage = apiError.response.data.errors
          .map((err) =>
            typeof err === "string" ? err : err.message || err.msg || "Error",
          )
          .join(", ");
      } else if (apiError.message) {
        errorMessage = apiError.message;
      } else if (apiError.detail) {
        errorMessage = apiError.detail;
      } else if (apiError.response?.status) {
        errorMessage = `Request failed with status ${apiError.response.status}${
          apiError.response.statusText
            ? ` (${apiError.response.statusText})`
            : ""
        }`;
      } else if (apiError.status) {
        errorMessage = `Request failed with status ${apiError.status}`;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Don't repeat the custom message if it's already part of the error message
    if (
      customMessage &&
      errorMessage !== customMessage &&
      !errorMessage.includes(customMessage)
    ) {
      errorMessage = `${customMessage}: ${errorMessage}`;
    }

    console.log("Final error message:", errorMessage); // Debug logging
    toast.error(errorMessage);
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  return { handleError, handleSuccess };
};

interface UseMinimumLoadingOptions {
  minimumDuration?: number;
  initialLoading?: boolean;
}

export const useMinimumLoading = ({
  minimumDuration = 300,
  initialLoading = false,
}: UseMinimumLoadingOptions = {}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isMinimumLoading, setIsMinimumLoading] = useState(initialLoading);
  const loadingStartTime = useRef<number | null>(null);

  // Update internal loading state when external loading state changes
  useEffect(() => {
    setIsLoading(initialLoading);
  }, [initialLoading]);

  useEffect(() => {
    if (isLoading) {
      loadingStartTime.current = Date.now();
      setIsMinimumLoading(true);
    } else if (loadingStartTime.current) {
      const elapsedTime = Date.now() - loadingStartTime.current;
      const remainingTime = Math.max(0, minimumDuration - elapsedTime);

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setIsMinimumLoading(false);
        }, remainingTime);
        return () => clearTimeout(timer);
      }
      setIsMinimumLoading(false);
    }
  }, [isLoading, minimumDuration]);

  return {
    isLoading,
    isMinimumLoading,
    setLoading: (loading: boolean) => setIsLoading(loading),
  };
};

// Global registry to manage hotkey handlers with priorities
const hotkeyRegistry: Record<
  string,
  Array<{ callback: () => void; priority: number; id: string }>
> = {};
const hotkeyListeners: Record<string, (e: KeyboardEvent) => void> = {};

export const useHotkey = (key: string, callback: () => void, priority = 0) => {
  useEffect(() => {
    const id = Math.random().toString(36).substr(2, 9);

    // Initialize registry for this key if it doesn't exist
    if (!hotkeyRegistry[key]) {
      hotkeyRegistry[key] = [];
    }

    // Add the handler
    hotkeyRegistry[key].push({ callback, priority, id });

    // Sort by priority (higher first)
    hotkeyRegistry[key].sort((a, b) => b.priority - a.priority);

    // Create or update the global listener for this key
    if (!hotkeyListeners[key]) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === key &&
          hotkeyRegistry[key] &&
          hotkeyRegistry[key].length > 0
        ) {
          // Execute only the highest priority handler
          const highestPriorityHandler = hotkeyRegistry[key][0];
          highestPriorityHandler.callback();
        }
      };

      hotkeyListeners[key] = handleKeyDown;
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      // Remove this specific handler
      if (hotkeyRegistry[key]) {
        hotkeyRegistry[key] = hotkeyRegistry[key].filter((h) => h.id !== id);

        // If no more handlers, remove the global listener
        if (hotkeyRegistry[key].length === 0) {
          const handler = hotkeyListeners[key];
          if (handler) {
            window.removeEventListener("keydown", handler);
            delete hotkeyListeners[key];
          }
          delete hotkeyRegistry[key];
        } else {
          // Re-sort remaining handlers
          hotkeyRegistry[key].sort((a, b) => b.priority - a.priority);
        }
      }
    };
  }, [key, callback, priority]);
};
