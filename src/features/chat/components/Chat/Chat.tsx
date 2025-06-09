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
  useStreamChat,
} from "@/utils/apiUtils";
import { useEffect, useRef, useState } from "react";
import {
  useChatsServiceGetApiChatsByChatId,
  useFilesServicePostApiFilesUpload,
} from "~/openapi/queries/queries";
import "./Chat.scss";
// import { useChatsServiceGetApiChatsByChatId } from "../../../../../openapi/queries/queries";

interface ChatProps {
  className?: string;
  chatId?: string | null;
  onChatCreated?: (chatId: string) => void;
}

export const Chat = ({
  className = "",
  chatId = null,
  onChatCreated,
}: ChatProps) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // const chatServiceRef = useRef(new ChatService());
  const abortFunctionRef = useRef<(() => void) | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);
  const messageContentRef = useRef<string>("");

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
  } = useAIModelsForChat();

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

  const streamChat = useStreamChat();

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

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      created_at: new Date(),
      attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    const updatedMessages = [...messages, userMessage];
    const messageHistory: ChatMessageRequest[] = updatedMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      attachments: msg.attachments,
    }));

    // abortFunctionRef.current = chatServiceRef.current.streamChat(
    //   messageHistory,
    //   Number.parseInt(selectedModel),
    //   (event: StreamEvent) => onStreamEvent(event),
    //   (error) => onStreamError(error, assistantMessageIdRef.current),
    //   () => onStreamDone(),
    //   { chatId: currentChatId },
    // );
    streamChat(
      messageHistory,
      Number.parseInt(selectedModel),
      (event: StreamEvent) => onStreamEvent(event),
      (error) => onStreamError(error, assistantMessageIdRef.current),
      () => onStreamDone(),
      { chatId: currentChatId },
    );
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
        console.log("Unknown event type:", (event as any).type);
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

  const onStreamError = (error: any, messageId?: string | null) => {
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
