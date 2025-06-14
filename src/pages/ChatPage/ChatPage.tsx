import { providerIconPaths } from "@/assets/icons/ai-providers";
import { SidebarContext } from "@/components/Layout/Layout";
import { LoadingDots } from "@/components/LoadingDots/LoadingDots";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import { Portal } from "@/components/Portal/Portal";
import { useAuth } from "@/context/AuthContext";
import ChatInput from "@/features/chat/components/ChatInput/ChatInput";
import Pane, {
  type ChatMessageWithDate,
} from "@/features/chat/components/Pane/Pane";
import useChatSender from "@/features/chat/hooks/useChatSender";
import { useHotkey } from "@/hooks/general";
import type { StreamEvent } from "@/utils/apiUtils";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UseChatsServiceGetApiChatsKeyFn } from "~/openapi/queries/common";
import {
  useAiModelsServiceGetApiAiModels,
  useChatsServiceGetApiChatsByChatIdMessages,
  useChatsServicePatchApiChatsByChatIdMessagesByMessageIdSelect,
} from "~/openapi/queries/queries";
import type { AiModelResponseSchema } from "~/openapi/requests/types.gen";
import { responseWasSelected } from "@/lib/utils";

const useInitialMessages = ({
  chatId,
}: {
  chatId: string | undefined;
}) => {
  const { data: chatMessages, isLoading } =
    useChatsServiceGetApiChatsByChatIdMessages(
      { chatId: chatId || "" },
      undefined,
      { enabled: !!chatId, placeholderData: keepPreviousData },
    );
  const previousChatIdRef = useRef<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessageWithDate[] | undefined>(
    undefined,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!!previousChatIdRef.current && previousChatIdRef.current !== chatId) {
      setMessages(undefined);
    }
    previousChatIdRef.current = chatId;
  }, [chatId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (messages?.length) return;

    if (!chatId && !messages) {
      setMessages([]);
      return;
    }

    if (chatId && !chatMessages?.messages.length && !isLoading) {
      navigate("/");
      return;
    }
    if (!chatMessages?.messages) return;
    setMessages(
      chatMessages.messages.map((m) => ({
        ...m,
        created_at: new Date(m.created_at),
        done: true,
      })),
    );
  }, [chatMessages, messages, chatId, isLoading]);
  return { messages, setMessages };
};

const useInitialModelIds = ({
  modelIds,
  messages,
  availableModels,
  paneCount,
}: {
  modelIds: string[] | undefined;
  messages: ChatMessageWithDate[] | undefined;
  availableModels: AiModelResponseSchema[] | undefined;
  paneCount: number | undefined;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  //   Initialize Selected Models
  // - If the panes === 1 and messages.length > 0, set model id in URL to last one used by assistant
  // - If the panes === 1 and !messages.length, set model id in URL to modelOptions[0]
  // - If the panes > 1 and !messages.length, use model id from previous pane + 1, set them in URL
  // - If the panes > 1 and messages.length, find all of the assistant messages where "previous_message_id" === LAST_USER_MESSAGE_ID. Use the model_id field to set model ids in URL
  useEffect(() => {
    if (!availableModels?.length || modelIds?.length || !paneCount || !messages)
      return;

    const currentSearchParams = new URLSearchParams(searchParams);

    if (messages.length) {
      if (paneCount === 1) {
        const lastSelectedMessage = [...messages].findLast(
          (v) =>
            v.role === "assistant" &&
            (v.selected === true || v.selected === null),
        );

        if (lastSelectedMessage) {
          currentSearchParams.set(
            "modelIds",
            lastSelectedMessage.model_id?.toString() ?? "",
          );
          setSearchParams(currentSearchParams);
        } else {
          const lastMessage = messages.findLast((v) => v.role === "assistant");
          if (lastMessage) {
            currentSearchParams.set(
              "modelIds",
              lastMessage.model_id?.toString() ?? "",
            );
            setSearchParams(currentSearchParams);
          } else {
            currentSearchParams.set(
              "modelIds",
              availableModels[0].id.toString(),
            );
            setSearchParams(currentSearchParams);
          }
        }
      } else {
        const lastUserMessage = messages.findLast((v) => v.role === "user");
        if (lastUserMessage) {
          const assistantMessages = messages.filter(
            (m) =>
              m.previous_message_id === lastUserMessage.id &&
              m.role === "assistant",
          );
          const lastUsedModelIds = assistantMessages.map((m) => m.model_id);
          currentSearchParams.set("modelIds", lastUsedModelIds.join(","));
          setSearchParams(currentSearchParams);
        } else {
          const firstModelIds = availableModels
            .slice(0, paneCount)
            .map((m) => m.id.toString());
          currentSearchParams.set("modelIds", firstModelIds.join(","));
          setSearchParams(currentSearchParams);
        }
      }
    } else {
      currentSearchParams.set(
        "modelIds",
        availableModels
          .slice(0, paneCount)
          .map((m) => m.id.toString())
          .join(","),
      );
      setSearchParams(currentSearchParams);
    }
  }, [
    messages,
    availableModels,
    paneCount,
    setSearchParams,
    modelIds,
    searchParams,
  ]);
};

const useInitialPanes = ({
  messages,
  paneCount,
}: {
  messages: ChatMessageWithDate[] | undefined;
  paneCount: number | undefined;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // - Find all of the assistant messages where "previous_message_id" === LAST_USER_MESSAGE_ID
    // - Then if .some selected === true || selected === null, set the panes to the amount of these assistant messages
    // - Otherwise, set panes to 1
    if (paneCount || !messages) return;
    const currentSearchParams = new URLSearchParams(searchParams);
    if (!messages.length) {
      currentSearchParams.set("panes", "1");
      setSearchParams(currentSearchParams);
      return;
    }

    const lastUserMessage = messages.findLast((v) => v.role === "user");
    if (!lastUserMessage) {
      currentSearchParams.set("panes", "1");
      setSearchParams(currentSearchParams);
      return;
    }

    const assistantMessages = messages.filter(
      (m) =>
        m.previous_message_id === lastUserMessage.id && m.role === "assistant",
    );
    const selectedMessages = assistantMessages.filter(
      (m) => m.selected === true || m.selected === null,
    );
    if (selectedMessages.length) {
      currentSearchParams.set("panes", "1");
      setSearchParams(currentSearchParams);
    } else {
      currentSearchParams.delete("modelIds");
      currentSearchParams.set("panes", assistantMessages.length.toString());
      setSearchParams(currentSearchParams);
    }
  }, [messages, setSearchParams, paneCount, searchParams]);
};

const useSyncModelIdsWithPaneCount = ({
  paneCount,
  modelIds,
  availableModels,
}: {
  paneCount: number | undefined;
  modelIds: string[] | undefined;
  availableModels: AiModelResponseSchema[] | undefined;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (paneCount && modelIds?.length && modelIds.length < paneCount) {
      // see how many N models are already in url, find the next N models in availableModels
      const newModelIds = [...modelIds];
      for (let i = modelIds.length; newModelIds.length < paneCount; i++) {
        // check if this model's id already in url, if so skip
        if (!newModelIds.includes(availableModels?.[i]?.id?.toString() || "")) {
          newModelIds.push(availableModels?.[i]?.id?.toString() || "");
        }
      }
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("modelIds", newModelIds.join(","));
      setSearchParams(newSearchParams);
    }
    if (paneCount && modelIds?.length && modelIds.length > paneCount) {
      const newModelIds = modelIds.slice(0, paneCount);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("modelIds", newModelIds.join(","));
      setSearchParams(newSearchParams);
    }
  }, [paneCount, availableModels, modelIds, searchParams, setSearchParams]);
};

const usePendingMessageHandler = ({
  isAuthenticated,
  pendingMessage,
  setPendingMessage,
  setIsLoginModalOpen,
  sendMessage,
  modelIds,
  paneCount,
}: {
  isAuthenticated: boolean;
  pendingMessage: string | null;
  setPendingMessage: (message: string | null) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  sendMessage: (msg: string, files?: File[]) => Promise<void>;
  modelIds: string[] | undefined;
  paneCount: number | undefined;
}) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isAuthenticated || !pendingMessage || !modelIds || !paneCount) return;
    sendMessage(pendingMessage);
    setPendingMessage(null);
  }, [isAuthenticated, pendingMessage, modelIds, paneCount]);
};

export const ChatPage = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { isOpen: isSidebarOpen } = useContext(SidebarContext);
  const { isAuthenticated } = useAuth();

  const queryClient = useQueryClient();

  const paneCount = searchParams.get("panes")
    ? Number(searchParams.get("panes"))
    : undefined;
  const modelIds = searchParams.get("modelIds")?.split(",") || undefined;

  const [isStreaming, setIsStreaming] = useState(false);
  const [previewPaneIndex, setPreviewPaneIndex] = useState<number | undefined>(
    undefined,
  );
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const abortStreamingRef = useRef<() => void>(null);

  useEffect(() => {
    if (!chatId) return;
    return () => {
      if (abortStreamingRef.current) {
        abortStreamingRef.current();
      }
    };
  }, [chatId]);

  const { data: availableModels } = useAiModelsServiceGetApiAiModels();
  const { mutateAsync: selectMessage } =
    useChatsServicePatchApiChatsByChatIdMessagesByMessageIdSelect();

  const { messages, setMessages } = useInitialMessages({ chatId });

  useInitialPanes({
    messages,
    paneCount,
  });

  useInitialModelIds({
    modelIds,
    messages,
    availableModels,
    paneCount,
  });

  useSyncModelIdsWithPaneCount({
    paneCount,
    modelIds,
    availableModels,
  });

  const isSplitMode = !!(paneCount && paneCount > 1);

  const handleEscape = useCallback(() => {
    if (previewPaneIndex !== undefined) {
      setPreviewPaneIndex(undefined);
    }
  }, [previewPaneIndex]);

  const handleUseAnswer = async ({
    modelId,
    messageId,
  }: {
    modelId: string;
    messageId: string;
  }) => {
    if (!chatId) return;

    try {
      await selectMessage({ chatId, messageId });
      queryClient.invalidateQueries({
        queryKey: UseChatsServiceGetApiChatsKeyFn(),
      });

      setMessages((prev) => {
        const newMessages = [...(prev || [])];
        const assistantMessage = newMessages.find(
          (msg) => msg.id === messageId,
        );
        if (assistantMessage) {
          assistantMessage.selected = true;
        }
        return newMessages;
      });

      setSearchParams({
        modelIds: modelId,
        panes: "1",
      });
    } catch (error) {
      console.error("Failed to select message", error);
    }
  };

  const updateSelectedModels = (modelId: string, index: number) => {
    if (!modelIds) return;
    const newModelIds = [...modelIds];
    newModelIds[index] = modelId;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("modelIds", newModelIds.join(","));
    setSearchParams(newSearchParams);
  };

  const { send } = useChatSender({
    onEvent: (
      event: StreamEvent & { model_id?: number; message_id?: string },
    ) => {
      if (!paneCount) return;
      switch (event.type) {
        case "message_start":
          setIsStreaming(true);
          setMessages((prev) => {
            const newMessages = [...(prev || [])];
            const lastUserMessage = newMessages.findLast(
              (m) => m.role === "user",
            );
            if (lastUserMessage) {
              lastUserMessage.id = event.message.reply_to;
            }
            return [
              ...newMessages,
              {
                id: event.message.id,
                content: "",
                role: "assistant",
                model_id: event.message.model_id,
                created_at: new Date(),
                selected: paneCount > 1 ? false : null,
                done: false,
                previous_message_id: event.message.reply_to,
              },
            ];
          });

          break;

        case "message_content":
          if (event.message_id) {
            setMessages((prev) => {
              const newMessages = [...(prev || [])];
              const assistantMessage = newMessages.find(
                (msg) => msg.id === event.message_id,
              );
              if (assistantMessage) {
                assistantMessage.content += event.content?.text;
              }
              return newMessages;
            });
          }
          break;
        case "message_content_stop":
          if (event.message_id) {
            setMessages((prev) => {
              const newMessages = [...(prev || [])];
              const assistantMessage = newMessages.find(
                (msg) => msg.id === event.message_id,
              );
              if (assistantMessage) {
                assistantMessage.done = true;
              }
              return newMessages;
            });
          }
          break;
        case "chat_metadata":
          if (chatId !== event.chat.id) {
            navigate(`/chat/${event.chat.id}?${searchParams.toString()}`);
          }

          break;

        default:
          break;
      }
    },
    onError: (err) => {
      // TODO: add alert here to show error
      // think about how to handle when one model returned error, but other models returned content
      console.error("onStreamError", err);
      setIsStreaming(false);
    },
    onDone: () => {
      if (abortStreamingRef.current) {
        abortStreamingRef.current = null;
      }
      // TODO: make it smarter, fetch only when new chat was created
      queryClient.invalidateQueries({
        queryKey: UseChatsServiceGetApiChatsKeyFn(),
      });
      setIsStreaming(false);
    },
  });

  const sendMessage = async (msg: string, files?: File[]) => {
    if (!msg.trim() && (!files || files.length === 0)) return;

    if (!isAuthenticated) {
      setPendingMessage(msg);
      setIsLoginModalOpen(true);
      return;
    }

    try {
      if (!modelIds) return;
      setMessages((prev) => {
        return [
          ...(prev || []),
          {
            id: Date.now().toString(),
            content: msg,
            role: "user",
            created_at: new Date(),
            attachments: files,
          },
        ];
      });

      const { abort } = await send(
        msg,
        files,
        modelIds.slice(0, paneCount),
        chatId,
      );
      abortStreamingRef.current = abort;
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useHotkey("Escape", handleEscape);

  usePendingMessageHandler({
    isAuthenticated,
    pendingMessage,
    setPendingMessage,
    setIsLoginModalOpen,
    sendMessage,
    paneCount,
    modelIds,
  });

  if (!messages || !paneCount || !modelIds || !availableModels) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <LoadingScreen message="Loading chat..." />
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-full flex justify-center bg-[var(--background-color)] overflow-hidden fixed top-0 left-0 right-0 m-0 transition-all duration-75 ${isSidebarOpen ? "md:pl-64" : ""}`}
    >
      <motion.div
        className="flex flex-col w-full max-w-full md:max-w-[90%] lg:max-w-[56.25rem] xl:max-w-[62.5rem] h-full overflow-hidden transition-all duration-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <LayoutGroup id="chat-layout">
          <motion.div
            layout
            key="split"
            className="flex flex-col flex-1 bg-[var(--component-bg-color)] mt-4 rounded-lg h-full min-h-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.1 }}
          >
            <div
              className={`h-full grid gap-4 p-4 min-h-0 ${
                paneCount === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : paneCount === 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : paneCount === 4
                      ? "grid-cols-1 md:grid-cols-2 md:grid-rows-2"
                      : paneCount === 6
                        ? "grid-cols-1 md:grid-cols-3 md:grid-rows-2"
                        : "grid-cols-1"
              }`}
            >
              {Array.from({ length: paneCount }, (_, index) => ({
                id: `split-pane-${index}`,
                index,
              })).map(({ id, index }, paneIndex) => {
                console.log("messages", messages);
                // Displaying messages in Panes
                // - When panes === 1, display all messages but the selected === false
                // - (Optional) For messages where assistantResponse1.selected === false && assistantResponse2.selected === true && assistantResponse1.previous_message_id === assistantResponse2.previous_message_id, show a visible indicator that this message was split previously. We might let users pick another response and "branch out" later
                // - When panes > 1, only display messages in Pane if message.selected === null || message.selected === true || (message.selected === false && message.previous_message_id === LAST_USER_MESSAGE_ID )
                // - // maybe introduce other value in selected to distinguish between doesn't need selection, was selected, wasn't selected and was only shown, but user didn't select it yet
                const lastUserMessage = messages.findLast(
                  (v) => v.role === "user",
                );

                const showNotSelectedResponses = messages
                  .filter((v) => v.previous_message_id === lastUserMessage?.id)
                  .every((m) => m.selected === false);

                const displayedMessages = messages.filter((m) => {
                  if (m.role === "user") return true;

                  if (paneCount === 1) {
                    return m.selected !== false;
                  }

                  return (
                    m.selected === null ||
                    m.selected === true ||
                    (m.selected === false &&
                      m.previous_message_id === lastUserMessage?.id &&
                      showNotSelectedResponses &&
                      m.model_id === modelIds[paneIndex])
                  );
                });

                const lastDisplayedMessage =
                  displayedMessages[displayedMessages.length - 1];

                return (
                  <motion.div
                    className="relative flex flex-colbg-[var(--component-bg-color)] border border-[var(--border-color)] rounded-md min-h-0 overflow-y-auto"
                    key={id}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  >
                    <Pane
                      messages={displayedMessages}
                      showModelSelectorTop={isSplitMode}
                      modelId={modelIds[paneIndex]}
                      modelOptions={availableModels?.map((m) => ({
                        value: m.id.toString(),
                        label: m.name,
                        iconPath:
                          providerIconPaths[
                            m.provider?.slug as keyof typeof providerIconPaths
                          ],
                        hasApiKey: m.has_api_key,
                      }))}
                      onModelChange={(modelId) => {
                        const assistantMessage = messages.find(
                          (v) =>
                            v.previous_message_id === lastUserMessage?.id &&
                            v.model_id === modelIds[0],
                        );
                        if (assistantMessage?.selected === false) {
                          setMessages((prev) => {
                            const newMessages = [...(prev || [])];
                            const assistantMessageToUpdate = newMessages.find(
                              (msg) => msg.id === assistantMessage?.id,
                            );
                            if (assistantMessageToUpdate) {
                              assistantMessageToUpdate.selected = true;
                            }
                            return newMessages;
                          });
                        }

                        updateSelectedModels(modelId, paneIndex);
                      }}
                      // onAssistantDone={(id) => handleAssistantDone(index, id)}
                      // onChatCreated={(newChatId) => {
                      //   navigate(
                      //     `/chat/${newChatId}?${searchParams.toString()}`,
                      //   );
                      //   refetchChats();
                      // }}
                    />
                    {isSplitMode && (
                      <button
                        className="top-2 right-2 z-[2] absolute flex justify-center items-center bg-transparent hover:bg-[var(--hover-color)] backdrop-blur-sm p-1 border-none rounded-sm w-10 h-10 text-[var(--text-secondary-color)] transition-colors duration-100 cursor-pointer"
                        onClick={() => {
                          setPreviewPaneIndex(index);
                        }}
                        aria-label="Preview chat"
                        type="button"
                      >
                        <Maximize2 size={16} />
                      </button>
                    )}

                    {isSplitMode &&
                      lastDisplayedMessage?.selected === false &&
                      lastDisplayedMessage.done && (
                        <div className="right-4 bottom-4 z-10 absolute flex flex-col items-end gap-3">
                          <motion.button
                            className="bg-[var(--sidebar-primary)] hover:opacity-90 shadow-md hover:shadow-lg px-4 py-2 border-none rounded-md font-medium text-[var(--sidebar-primary-foreground)] text-sm transition-all hover:-translate-y-0.5 duration-100 cursor-pointer hover:transform"
                            onClick={() =>
                              handleUseAnswer({
                                modelId:
                                  lastDisplayedMessage.model_id?.toString() ||
                                  "",
                                messageId: lastDisplayedMessage.id,
                              })
                            }
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.1 }}
                          >
                            Use this answer
                          </motion.button>
                        </div>
                      )}
                    <Portal containerId={`preview-pane-${paneIndex}`}>
                      <AnimatePresence>
                        {previewPaneIndex === paneIndex && (
                          <motion.div
                            className="z-[1000] fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur p-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                              setPreviewPaneIndex(undefined);
                            }}
                          >
                            <motion.div
                              className="relative flex flex-col bg-[var(--component-bg-color)] shadow-2xl border border-[var(--border-color)] rounded-lg w-full max-w-[90vw] h-full max-h-[90vh] overflow-hidden"
                              onClick={(e) => e.stopPropagation()}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.1, ease: "easeInOut" }}
                            >
                              <button
                                className="top-4 right-4 z-10 absolute flex justify-center items-center hover:bg-[var(--hover-color)] shadow-md p-2 rounded-full w-10 h-10 text-[var(--text-color)] text-xl leading-none hover:scale-105 transition-all duration-100 cursor-pointer"
                                onClick={() => {
                                  setPreviewPaneIndex(undefined);
                                }}
                                type="button"
                              >
                                ×
                              </button>
                              <Pane
                                modelOptions={availableModels?.map((m) => ({
                                  value: m.id.toString(),
                                  label: m.name,
                                  iconPath:
                                    providerIconPaths[
                                      m.provider
                                        ?.slug as keyof typeof providerIconPaths
                                    ],
                                  hasApiKey: m.has_api_key,
                                }))}
                                showModelSelectorTop={false}
                                modelId={modelIds[paneIndex]}
                                messages={displayedMessages}
                              />
                              {isSplitMode &&
                                lastDisplayedMessage?.selected === false &&
                                lastDisplayedMessage.done && (
                                  <div className="right-4 bottom-4 z-10 absolute flex flex-col items-end gap-3">
                                    <motion.button
                                      className="bg-[var(--sidebar-primary)] hover:opacity-90 shadow-md hover:shadow-lg px-4 py-2 border-none rounded-md font-medium text-[var(--sidebar-primary-foreground)] text-sm transition-all hover:-translate-y-0.5 duration-100 cursor-pointer hover:transform"
                                      onClick={() =>
                                        handleUseAnswer({
                                          modelId:
                                            lastDisplayedMessage.model_id?.toString() ||
                                            "",
                                          messageId: lastDisplayedMessage.id,
                                        })
                                      }
                                      type="button"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      transition={{ duration: 0.1 }}
                                    >
                                      Use this answer
                                    </motion.button>
                                  </div>
                                )}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Portal>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </LayoutGroup>

        <motion.div
          className="flex justify-center mt-4"
          layoutId="chat-input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15, delay: 0.1 }}
        >
          <ChatInput
            onPaneCountChange={(count) => {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("panes", count.toString());
              setSearchParams(newSearchParams);
            }}
            onModelChange={(modelId) => {
              updateSelectedModels(modelId, 0);
            }}
            onSplitToggle={(value) => {
              const newSearchParams = new URLSearchParams(searchParams);
              if (value) {
                newSearchParams.set("panes", "2");
              } else {
                newSearchParams.set("panes", "1");
              }
              setSearchParams(newSearchParams);
            }}
            responseWasSelected={responseWasSelected(messages || [])}
            onSend={(msg, files) => {
              if (!responseWasSelected(messages || [])) {
                setMessages((prev) => {
                  const newMessages = [...(prev || [])];
                  const lastUserMessage = newMessages.findLast(
                    (m) => m.role === "user",
                  );
                  if (lastUserMessage) {
                    const assistantMessage = newMessages.find(
                      (v) => v.previous_message_id === lastUserMessage.id,
                    );
                    if (assistantMessage) {
                      assistantMessage.selected = true;
                    }
                  }
                  return newMessages;
                });
                // setIsSelectModalOpen(true);
              }
              sendMessage(msg, files);
            }}
            isLoading={isStreaming}
            modelOptions={availableModels?.map((m) => ({
              value: m.id.toString(),
              label: m.name,
              iconPath:
                providerIconPaths[
                  m.provider?.slug as keyof typeof providerIconPaths
                ],
              hasApiKey: m.has_api_key,
            }))}
            selectedModel={isSplitMode ? undefined : modelIds[0]}
            isSplitMode={isSplitMode}
            paneCount={paneCount}
          />
        </motion.div>
      </motion.div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
};
