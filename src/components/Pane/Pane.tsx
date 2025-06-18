import ModelSelect, {
  type SearchableSelectOption,
} from "@/components/ModelSelect/ModelSelect";

// import { LoadingDots } from "@/components/LoadingDots/LoadingDots";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import ScrollToBottomButton from "@/components/ScrollToBottomButton/ScrollToBottomButton";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { type FC, memo, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessageResponseSchema } from "~/openapi/requests/types.gen";
import { cn } from "@/utils/generalUtils";

interface ModelOption {
  value: string;
  label: string;
  iconPath: string;
}

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  modelOptions?: ModelOption[];
}

export type ChatMessageWithDate = Omit<
  ChatMessageResponseSchema,
  "created_at"
> & {
  created_at: Date;
  done?: boolean;
  reasoning?: string;
  tool_calls?: string[];
  isWaitingForContent?: boolean;
};

type PaneProps = {
  messages: ChatMessageWithDate[];
  showModelSelectorTop: boolean;
  modelId: string;
  modelOptions: SearchableSelectOption[];
  isUploading?: boolean;
} & (
  | {
      showModelSelectorTop: false;
    }
  | {
      showModelSelectorTop: true;
      onModelChange: (modelId: string) => void;
    }
);

const useScrollToBottom = (messages: ChatMessageWithDate[]) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, clientHeight, scrollHeight } = container;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(atBottom);
  };

  const lastMessageKey =
    messages.length > 0
      ? `${messages[messages.length - 1].id}-${messages[messages.length - 1].content.length}-${messages[messages.length - 1].done}`
      : "";

  // Scroll to bottom when the last message changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to react to last message updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [lastMessageKey]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
    // biome-ignore lint/correctness/useExhaustiveDependencies: container ref is stable
  }, [messagesContainerRef]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return { messagesEndRef, messagesContainerRef, isAtBottom, scrollToBottom };
};

const Pane: FC<PaneProps> = ({
  messages,
  showModelSelectorTop,
  modelId,
  modelOptions,
  isUploading = false,
  ...props
}) => {
  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const getModelInfo = useMemo(() => {
    return (modelId?: string | null) => {
      if (!modelId || !modelOptions?.length) {
        return { name: undefined, iconPath: undefined };
      }

      const model = modelOptions?.find(
        (option) => option.value === modelId.toString(),
      );

      return {
        name: model?.label,
        iconPath: model?.iconPath,
      };
    };
  }, [modelOptions]);

  const { messagesEndRef, messagesContainerRef, isAtBottom, scrollToBottom } =
    useScrollToBottom(messages);

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-[var(--chat-bg-color)] relative overflow-visible min-h-0",
      )}
    >
      {showModelSelectorTop && modelOptions && modelId && (
        <div className="top-3 left-3 z-10 absolute flex items-center bg-transparent backdrop-blur-[10px] border-[var(--border-color)] border-b border-none rounded-md">
          <ModelSelect
            options={modelOptions}
            value={modelId}
            onChange={(modelId) => {
              if ("onModelChange" in props) {
                props.onModelChange(modelId);
              }
            }}
            className="max-w-48"
          />
        </div>
      )}
      <div
        ref={messagesContainerRef}
        className="flex-1 py-6 overflow-x-hidden overflow-y-auto scroll-smooth"
      >
        {!hasMessages && (
          <div className="flex flex-col justify-center items-center h-full text-[var(--text-secondary-color)]">
            <div className="text-center">
              <h2 className="mb-2 font-medium text-xl">
                Start a new conversation
              </h2>
              <p className="opacity-80 text-base">
                Type a message below to begin
              </p>
            </div>
          </div>
        )}

        {hasMessages && (
          <div className="flex flex-col mx-auto px-2 w-full max-w-5xl">
            {messages.map((message) => {
              const modelInfo = getModelInfo(message.model_id);
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col w-full mb-4",
                    message.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <ChatMessage
                    content={message.content}
                    role={message.role}
                    created_at={message.created_at}
                    attachments={message.attachments}
                    modelName={modelInfo.name}
                    modelIconPath={modelInfo.iconPath}
                    scrollContainer={messagesContainerRef.current}
                    reasoning={message.reasoning}
                    tool_calls={message.tool_calls}
                    isWaitingForContent={message.isWaitingForContent}
                  />
                  {/* TODO: add loading indicator 
                   {isLoading &&
                    message.role === "assistant" &&
                    message === messages[messages.length - 1] && (
                      <div className="mt-5 ml-6 h-4">
                        <LoadingDots />
                      </div>
                    )} */}
                </div>
              );
            })}
            <div ref={messagesEndRef} style={{ height: "1rem" }} />
          </div>
        )}
        <ScrollToBottomButton onClick={scrollToBottom} show={!isAtBottom} />
      </div>

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="top-4 left-1/2 z-20 absolute -translate-x-1/2 transform">
          <div className="flex items-center gap-2 bg-[var(--component-bg-color)] shadow-lg backdrop-blur-sm px-4 py-2 border border-[var(--border-color)] rounded-full">
            <div className="border-[var(--primary-color)] border-2 border-t-transparent rounded-full w-4 h-4 animate-spin" />
            <span className="font-medium text-[var(--text-primary-color)] text-sm">
              Uploading files...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Pane);
