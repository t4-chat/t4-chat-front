import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { TextInputModal } from "@/components/Modal/TextInputModal";
import { Chat } from "@/features/chat/components/Chat/Chat";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar/ChatSidebar";
import { ChatSidebarBackdrop } from "@/features/chat/components/ChatSidebarBackdrop/ChatSidebarBackdrop";
import { ChatSidebarToggle } from "@/features/chat/components/ChatSidebarToggle/ChatSidebarToggle";
import { useChats } from "@/utils/apiUtils";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useChatsServiceDeleteApiChatsByChatId,
  useChatsServicePatchApiChatsByChatIdPin,
  useChatsServicePatchApiChatsByChatIdTitle,
} from "~/openapi/queries/queries";
import "./ChatPage.scss";

export const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { chatId: activeChatId } = useParams();
  const navigate = useNavigate();

  // Chat action modals
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    chatId: string | null;
  }>({
    isOpen: false,
    chatId: null,
  });
  const [renameModalState, setRenameModalState] = useState<{
    isOpen: boolean;
    chatId: string | null;
    currentTitle: string;
  }>({
    isOpen: false,
    chatId: null,
    currentTitle: "",
  });

  const { chats, refetch: refetchChats, isLoading } = useChats();

  const { mutateAsync: pinChat } = useChatsServicePatchApiChatsByChatIdPin({
    onSuccess: () => {
      refetchChats();
    },
  });
  const { mutateAsync: deleteChat } = useChatsServiceDeleteApiChatsByChatId({
    onSuccess: () => {
      refetchChats();
    },
  });

  const { mutateAsync: updateChatTitle } =
    useChatsServicePatchApiChatsByChatIdTitle({
      onSuccess: () => {
        refetchChats();
      },
    });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChatSelect = async (chatId: string) => {
    navigate(`/chat/${chatId}`);

    // On mobile, close the sidebar after selection
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    navigate("/chat");

    // On mobile, close the sidebar after creating a new chat
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteModal = (chatId: string) => {
    setDeleteModalState({ isOpen: true, chatId });
  };

  const handleRenameModal = (chatId: string, currentTitle: string) => {
    setRenameModalState({ isOpen: true, chatId, currentTitle });
  };

  const handleDeleteChat = async () => {
    try {
      if (deleteModalState.chatId) {
        await deleteChat({ chatId: deleteModalState.chatId });
        // If the deleted chat is the active one, navigate to the chat list
        if (activeChatId === deleteModalState.chatId) {
          navigate("/chat");
        }
      }
      setDeleteModalState({ isOpen: false, chatId: null });
    } catch (error) {
      console.error("Failed to delete chat:", error);
      setDeleteModalState({ isOpen: false, chatId: null });
    }
  };

  const handleRenameChat = async (newTitle: string) => {
    try {
      if (renameModalState.chatId) {
        await updateChatTitle({
          chatId: renameModalState.chatId,
          requestBody: { title: newTitle },
        });
      }
      setRenameModalState({ isOpen: false, chatId: null, currentTitle: "" });
    } catch (error) {
      console.error("Failed to rename chat:", error);
      setRenameModalState({ isOpen: false, chatId: null, currentTitle: "" });
    }
  };

  const handlePinChat = async (chatId: string) => {
    try {
      await pinChat({ chatId });
    } catch (error) {
      console.error("Failed to pin/unpin chat:", error);
    }
  };

  // Add keyboard support to close sidebar with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <div className={`chat-page ${isSidebarOpen ? "with-sidebar" : ""}`}>
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        chats={chats}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        activeChat={activeChatId || null}
        onDeleteChat={handleDeleteModal}
        onRenameChat={handleRenameModal}
        onPinChat={handlePinChat}
        isLoading={isLoading}
      />

      {!isSidebarOpen && <ChatSidebarToggle onClick={toggleSidebar} />}
      {isSidebarOpen && <ChatSidebarBackdrop onClick={toggleSidebar} />}
      <div className="chat-container">
        <Chat
          chatId={activeChatId || null}
          onChatCreated={(newChatId) => {
            navigate(`/chat/${newChatId}`);
            refetchChats();
          }}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, chatId: null })}
        onConfirm={handleDeleteChat}
        title="Delete chat"
        message="Are you sure you want to delete this chat? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger={true}
      />

      <TextInputModal
        isOpen={renameModalState.isOpen}
        onClose={() =>
          setRenameModalState({ isOpen: false, chatId: null, currentTitle: "" })
        }
        onSave={handleRenameChat}
        title="Rename chat"
        initialValue={renameModalState.currentTitle}
        placeholder="Enter a new name for this chat"
        saveLabel="Save"
        cancelLabel="Cancel"
        maxLength={50}
        validator={(value) =>
          value.trim().length > 0 && value.trim().length <= 50
        }
        errorMessage="Chat name must be between 1 and 50 characters"
      />
    </div>
  );
};
