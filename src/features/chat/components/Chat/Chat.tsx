import { LoginModal } from "@/components/LoginModal/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { ChatInput } from "@/features/chat/components/ChatInput/ChatInput";
import { ChatMessages } from "@/features/chat/components/ChatMessages/ChatMessages";

import type { ChatMessage } from "@/features/chat/types";
// import { ChatService } from "@/services/chatService";
import {
  type ChatMessageRequest,
  type StreamEvent,
  useAIModelsForChat,
} from "@/utils/apiUtils";
import { useEffect, useRef, useState } from "react";
import {
  useChatsServiceGetApiChatsByChatId,
  useFilesServicePostApiFilesUpload,
} from "~/openapi/queries/queries";
import "./Chat.scss";
import { ChatService } from "@/services/chatService";
import type { ChatMessageResponseSchema } from "~/openapi/requests/types.gen";
// import { useChatsServiceGetApiChatsByChatId } from "../../../../../openapi/queries/queries";

interface ChatProps {
  className?: string;
  chatId?: string | null;
  onChatCreated?: (chatId: string) => void;
  initialModelId?: string;
}

export const Chat = ({
  className = "",
  chatId = null,
  onChatCreated,
  initialModelId,
}: ChatProps) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<
    (Omit<ChatMessageResponseSchema, "created_at" | "id"> & {
      created_at: Date;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // const chatServiceRef = useRef(new ChatService());
  const abortFunctionRef = useRef<(() => void) | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);
  const messageContentRef = useRef<string>("");

  useEffect(() => {
    // Update current chat ID whenever the prop changes. If no chatId is
    // provided (e.g., navigating back to the chat index), clear the current
    // chat state so the previous chat does not remain visible. Additionally,
    // clear messages when switching between chats so the previous chat's
    // conversation does not briefly appear in the new chat.
    if (chatId) {
      // If switching to a different chat, clear existing messages first
      setMessages([]);
      setCurrentChatId(chatId);
    } else {
      setCurrentChatId(null);
      setMessages([]);
    }
    // Abort any pending streaming requests when leaving a chat
    if (abortFunctionRef.current) {
      abortFunctionRef.current();
      abortFunctionRef.current = null;
      setIsLoading(false);
    }
  }, [chatId]);

  // Ensure any active stream is cancelled when the component unmounts
  useEffect(() => {
    return () => {
      if (abortFunctionRef.current) {
        abortFunctionRef.current();
        abortFunctionRef.current = null;
      }
    };
  }, []);

  const { data: chat, isLoading: isChatLoading } =
    useChatsServiceGetApiChatsByChatId(
      { chatId: currentChatId || "" },
      undefined,
      { enabled: !!currentChatId },
    );

  const {
    modelOptions,
    selectedModel,
    isLoading: isModelLoading,
    setSelectedModel,
  } = useAIModelsForChat(initialModelId);

  useEffect(() => {
    if (!chat || !chat?.messages) return;
    const messagesWithDateObjects = chat.messages.map((msg) => ({
      ...msg,
      created_at: new Date(msg.created_at),
    }));

    setMessages(messagesWithDateObjects);
  }, [chat]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if ((!content.trim() && (!files || files.length === 0)) || !selectedModel)
      return;

    // If user is not authenticated, store the message and show login modal
    if (!isAuthenticated) {
      setPendingMessage(content);
      setIsLoginModalOpen(true);
      return;
    }

    await sendMessage(content, files);
  };

  const { mutateAsync: uploadFiles } = useFilesServicePostApiFilesUpload();

  const sendMessage = async (content: string, files?: File[]) => {
    setIsLoading(true);

    // Upload files first if they exist
    let attachmentIds: string[] = [];
    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map((file) =>
          uploadFiles({ formData: { file } }),
        );
        const uploadResults = await Promise.all(uploadPromises);
        attachmentIds = uploadResults.map((result) => result.file_id);
      } catch (error) {
        console.error("Failed to upload files:", error);
        setIsLoading(false);
        return;
      }
    }

    const userMessage = {
      content,
      role: "user",
      attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
      chat_id: currentChatId || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    abortFunctionRef.current = new ChatService().streamChat({
      message: userMessage,
      modelId: Number.parseInt(selectedModel),
      onEvent: (event: StreamEvent) => onStreamEvent(event),
      onError: (error) => onStreamError(error, assistantMessageIdRef.current),
      onDone: () => onStreamDone(),
      options: { chatId: currentChatId },
    });
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // If there's a pending message, send it
    if (pendingMessage) {
      sendMessage(pendingMessage);
      setPendingMessage(null);
    }
  };

  const onStreamEvent = (event: StreamEvent) => {
    switch (event.type) {
      case "message_start":
        handleMessageStart(event.message.id);
        break;

      case "message_content":
        handleMessageContent(
          assistantMessageIdRef.current,
          event.content?.text,
        );
        break;

      case "chat_metadata":
        if (event.chat?.id) {
          setCurrentChatId(event.chat.id);
          // Notify parent about new chat created
          if (!currentChatId && onChatCreated) {
            onChatCreated(event.chat.id);
          }
        }
        break;

      case "done":
        if (abortFunctionRef.current) {
          abortFunctionRef.current();
          abortFunctionRef.current = null;
        }
        setIsLoading(false);
        break;

      default:
        console.log("Unknown event type:", (event as { type?: string }).type);
    }
  };

  const handleMessageStart = (messageId: string) => {
    assistantMessageIdRef.current = messageId;
    messageContentRef.current = ""; // Reset content for new message
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        content: "",
        role: "assistant",
        created_at: new Date(),
      },
    ]);
  };

  const handleMessageContent = (messageId: string | null, content: string) => {
    if (!content || !messageId) return;

    // Append the new content to our reference
    messageContentRef.current += content;

    // Set the full concatenated content
    setMessages((prev) => {
      const newMessages = [...prev];
      const assistantMessage = newMessages.find((msg) => msg.id === messageId);

      if (assistantMessage) {
        // Use the full content from our reference
        assistantMessage.content = messageContentRef.current;
      }

      return newMessages;
    });
  };

  const onStreamError = (error: unknown, messageId?: string | null) => {
    console.log("onStreamError", error);
    if (messageId) {
      setMessages((prev) => {
        const newMessages = [...prev];
        const assistantMessage = newMessages.find(
          (msg) => msg.id === messageId,
        );
        if (assistantMessage && !assistantMessage.content) {
          assistantMessage.content =
            "Sorry, there was an error processing your request.";
        }
        return newMessages;
      });
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Sorry, there was an error connecting to the server.",
          role: "assistant",
          created_at: new Date(),
        },
      ]);
    }
  };

  const onStreamDone = () => {
    setIsLoading(false);
    abortFunctionRef.current = null;
    assistantMessageIdRef.current = null;
  };

  return (
    <div className={`chat ${className}`}>
      <ChatMessages
        messages={messages}
        isLoading={isLoading || isChatLoading}
      />

      <ChatInput
        onSend={handleSendMessage}
        isLoading={isLoading || isModelLoading || isChatLoading}
        modelOptions={modelOptions}
        selectedModel={selectedModel || undefined}
        onModelChange={setSelectedModel}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingMessage(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};
