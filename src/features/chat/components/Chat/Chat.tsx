import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SelectOption } from "@/components/ui-kit/Select/Select";
import { ChatMessages } from "@/features/chat/components/ChatMessages/ChatMessages";
import { ChatInput } from "@/features/chat/components/ChatInput/ChatInput";
import { ChatMessage } from "@/features/chat/types";
import {
	ChatService,
	ChatMessageRequest,
	StreamEvent,
} from "@/features/chat/services/chatService";
import { aiModelService } from "@/features/ai-providers/services/aiModelService";
import { AiModel } from "@/features/ai-providers/types";
import { providerIconPaths } from "@/assets/icons/ai-providers/index";
import { useAuth } from "@/context/AuthContext";
import { LoginModal } from "@/features/auth/components/LoginModal/LoginModal";
import { fileService } from "@/services/fileService";
import "./Chat.scss";

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
	const location = useLocation();
	const routerState = (location.state as { selectedModelId?: string }) || {};
	const initialModelId = routerState.selectedModelId || null;

	const { isAuthenticated } = useAuth();
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [aiModels, setAiModels] = useState<AiModel[]>([]);
	const [modelOptions, setModelOptions] = useState<SelectOption[]>([]);
	const [selectedModel, setSelectedModel] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [isModelLoading, setIsModelLoading] = useState(true);
	const [currentChatId, setCurrentChatId] = useState<string | null>(chatId);
	const [pendingMessage, setPendingMessage] = useState<string | null>(null);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	const chatServiceRef = useRef(new ChatService());
	const abortFunctionRef = useRef<(() => void) | null>(null);
	const assistantMessageIdRef = useRef<string | null>(null);
	const messageContentRef = useRef<string>("");

	useEffect(() => {
		fetchAiModels();
	}, []);

	const getProviderIconPath = (provider: string): string => {
		return (
			providerIconPaths[
				provider.toLowerCase() as keyof typeof providerIconPaths
			] || providerIconPaths.default
		);
	};

	const fetchAiModels = async () => {
		try {
			setIsModelLoading(true);
			const models = await aiModelService.getAll();
			setAiModels(models);
			const options: SelectOption[] = models.map((model) => ({
				value: model.id.toString(),
				label: model.name,
				iconPath: getProviderIconPath(model.provider.slug),
			}));

			setModelOptions(options);

			// Set the initial model if provided, otherwise use the first model
			if (
				initialModelId &&
				options.some((option) => option.value === initialModelId)
			) {
				setSelectedModel(initialModelId);
			} else if (options.length > 0 && !selectedModel) {
				setSelectedModel(options[0].value);
			}

			setIsModelLoading(false);
		} catch (error) {
			console.error("Failed to fetch AI models:", error);
			setIsModelLoading(false);
		}
	};

	// Load chat when chatId changes
	useEffect(() => {
		if (chatId) {
			loadChat(chatId);
		} else {
			// Reset messages for new chat
			setMessages([]);
			setCurrentChatId(null);
		}
	}, [chatId]);

	const loadChat = async (id: string) => {
		try {
			setIsLoading(true);
			const chat = await chatServiceRef.current.getChat(id);
			setCurrentChatId(id);

			if (chat && chat.messages) {
				// Convert string dates to Date objects
				const messagesWithDateObjects = chat.messages.map((msg) => ({
					...msg,
					created_at: new Date(msg.created_at),
				}));

				setMessages(messagesWithDateObjects);
			}

			setIsLoading(false);
		} catch (error) {
			console.error("Failed to load chat:", error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (abortFunctionRef.current) {
				abortFunctionRef.current();
			}
		};
	}, []);

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

	const sendMessage = async (content: string, files?: File[]) => {
		setIsLoading(true);

		// Upload files first if they exist
		let attachmentIds: string[] = [];
		if (files && files.length > 0) {
			try {
				const uploadPromises = files.map((file) =>
					fileService.uploadFile(file),
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

		abortFunctionRef.current = chatServiceRef.current.streamChat(
			messageHistory,
			parseInt(selectedModel),
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
			<ChatMessages messages={messages} isLoading={isLoading} />

			<ChatInput
				onSend={handleSendMessage}
				isLoading={isLoading || isModelLoading}
				modelOptions={modelOptions}
				selectedModel={selectedModel}
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
