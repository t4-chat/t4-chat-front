import ModelSelect, {
  type ModelSelectOption,
} from "@/components/ModelSelect/ModelSelect";

// import { LoadingDots } from "@/components/LoadingDots/LoadingDots";
import { ChatMessage } from "@/features/chat/components/ChatMessage/ChatMessage";
import type { ChatMessage as ChatMessageType } from "@/features/chat/types";
import { type FC, memo, useEffect, useMemo, useRef } from "react";
import type { ChatMessageResponseSchema } from "~/openapi/requests/types.gen";
import "./Pane.scss";

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
};

type PaneProps = {
  messages: ChatMessageWithDate[];
  showModelSelectorTop: boolean;
  modelId: string;
  modelOptions: ModelSelectOption[];
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
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use a small timeout to ensure DOM has updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [messages]);

  // Initial scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  return { messagesEndRef, messagesContainerRef };
};

const Pane: FC<PaneProps> = ({
  messages,
  showModelSelectorTop,
  modelId,
  modelOptions,
  ...props
}) => {
  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const getModelInfo = useMemo(() => {
    return (modelId?: number | null) => {
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

  const { messagesEndRef, messagesContainerRef } = useScrollToBottom(messages);

  return (
    <div
      className={`chat ${
        showModelSelectorTop ? "with-model-selector-top" : ""
      }`}
    >
      {showModelSelectorTop && modelOptions && modelId && (
        <div className="chat-model-top-left chat-model-selector">
          <ModelSelect
            options={modelOptions as ModelSelectOption[]}
            value={modelId}
            onChange={(modelId) => {
              if ("onModelChange" in props) {
                props.onModelChange(modelId);
              }
            }}
            className="model-select"
          />
        </div>
      )}
      <div className="chat-messages" ref={messagesContainerRef}>
        {!hasMessages && (
          <div className="empty-chat">
            <div className="empty-chat-content">
              <h2>Start a new conversation</h2>
              <p>Type a message below to begin</p>
            </div>
          </div>
        )}

        {hasMessages && (
          <div className="messages-container">
            {messages.map((message) => {
              const modelInfo = getModelInfo(message.model_id);
              return (
                <div
                  key={message.id}
                  className={`message-wrapper ${message.role === "user" ? "user-message" : "assistant-message"}`}
                >
                  <ChatMessage
                    content={message.content}
                    role={message.role}
                    created_at={message.created_at}
                    attachments={message.attachments}
                    modelName={modelInfo.name}
                    modelIconPath={modelInfo.iconPath}
                  />
                  {/* TODO: add loading indicator 
                   {isLoading &&
                    message.role === "assistant" &&
                    message === messages[messages.length - 1] && (
                      <div className="message-loading">
                        <LoadingDots />
                      </div>
                    )} */}
                </div>
              );
            })}
            <div ref={messagesEndRef} style={{ height: "1rem" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Pane);
