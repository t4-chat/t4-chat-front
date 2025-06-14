import MenuIcon from "@/assets/icons/chats/menu.svg?react";
import MoreIcon from "@/assets/icons/chats/more.svg?react";
import NewChatIcon from "@/assets/icons/chats/new-chat.svg?react";
import PinIcon from "@/assets/icons/chats/pin.svg?react";
import RenameIcon from "@/assets/icons/chats/rename.svg?react";
import SearchIcon from "@/assets/icons/chats/search.svg?react";
import TrashIcon from "@/assets/icons/chats/trash.svg?react";
import { DropdownMenu } from "@/components/DropdownMenu/DropdownMenu";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { TextInputModal } from "@/components/Modal/TextInputModal";
import { Checkbox } from "@/components/ui/checkbox";
import type { Chat } from "@/features/chat/types";
import { useHotkey } from "@/hooks/general";
import { cn } from "@/lib/utils";
import { useChats } from "@/utils/apiUtils";
import { useQueryClient } from "@tanstack/react-query";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseChatsServiceGetApiChatsKeyFn } from "~/openapi/queries/common";
import {
  useChatsServiceDeleteApiChats,
  useChatsServicePatchApiChatsByChatIdPin,
  useChatsServicePatchApiChatsByChatIdTitle,
} from "~/openapi/queries/queries";
import { useMutationErrorHandler } from "@/hooks/useMutationErrorHandler";
import "./ChatSidebar.scss";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeChat?: string | null;
  isStreaming?: boolean;
}

const useUpdateBrowserTitle = ({
  chats,
}: {
  chats: { title: string; id: string }[];
}) => {
  const { chatId: activeChatId } = useParams();

  useEffect(() => {
    const baseTitle = "T4 Chat";
    if (activeChatId) {
      const chatTitle = chats.find((c) => c.id === activeChatId)?.title;
      document.title = chatTitle ? `${chatTitle} - ${baseTitle}` : baseTitle;
    } else {
      document.title = baseTitle;
    }

    return () => {
      document.title = baseTitle;
    };
  }, [activeChatId, chats]);
};

export const ChatSidebar = ({
  isOpen,
  onToggle,
  isStreaming,
}: ChatSidebarProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { chatId: activeChatId } = useParams();
  const { handleError, handleSuccess } = useMutationErrorHandler();
  const [renameModalState, setRenameModalState] = useState<{
    isOpen: boolean;
    chatId: string | null;
    currentTitle: string;
  }>({
    isOpen: false,
    chatId: null,
    currentTitle: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    chatIds: string[];
  }>({
    isOpen: false,
    chatIds: [],
  });

  const toggleSidebar = useCallback(() => {
    if (isOpen) {
      onToggle();
    }
  }, [isOpen, onToggle]);
  useHotkey("Escape", toggleSidebar);

  const { chats, isLoading } = useChats();
  useUpdateBrowserTitle({ chats });

  const { mutateAsync: updateChatTitle } =
    useChatsServicePatchApiChatsByChatIdTitle({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: UseChatsServiceGetApiChatsKeyFn(),
        });
        handleSuccess("Chat title updated successfully");
      },
      onError: (error) => handleError(error, "Failed to update chat title"),
    });
  const { mutateAsync: pinChat } = useChatsServicePatchApiChatsByChatIdPin();

  const handleTogglePinChat = async (chatId: string, isPinned: boolean) => {
    try {
      await pinChat(
        { chatId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: UseChatsServiceGetApiChatsKeyFn(),
            });
            handleSuccess(
              isPinned
                ? "Chat unpinned successfully"
                : "Chat pinned successfully",
            );
          },
          onError: (error) =>
            handleError(
              error,
              isPinned ? "Failed to unpin chat" : "Failed to pin chat",
            ),
        },
      );
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };
  const { mutateAsync: deleteChats } = useChatsServiceDeleteApiChats({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: UseChatsServiceGetApiChatsKeyFn(),
      });
      handleSuccess("Chat(s) deleted successfully");
    },
    onError: (error) => handleError(error, "Failed to delete chat(s)"),
  });

  const filteredChats = useMemo(() => {
    if (searchTerm.trim() === "") {
      // Ensure dates are Date objects and sort by updated_at descending
      return chats
        .map((chat) => ({
          ...chat,
          created_at:
            chat.created_at instanceof Date
              ? chat.created_at
              : new Date(chat.created_at),
          updated_at:
            chat.updated_at instanceof Date
              ? chat.updated_at
              : new Date(chat.updated_at),
        }))
        .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
    }
    return chats
      .map((chat) => ({
        ...chat,
        created_at:
          chat.created_at instanceof Date
            ? chat.created_at
            : new Date(chat.created_at),
        updated_at:
          chat.updated_at instanceof Date
            ? chat.updated_at
            : new Date(chat.updated_at),
      }))
      .filter((chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
  }, [searchTerm, chats]);
  const pinnedChats = filteredChats.filter((chat) => chat.pinned);
  const unpinnedChats = filteredChats.filter((chat) => !chat.pinned);
  const isAllSelected =
    filteredChats.length > 0 && selectedChatIds.length === filteredChats.length;

  const handleNewChat = () => {
    navigate("/chat");

    // On mobile, close the sidebar after creating a new chat
    if (window.innerWidth <= 768) {
      onToggle();
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
  const handleChatSelect = async (chatId: string) => {
    if (chatId === activeChatId) {
      return;
    }
    navigate(`/chat/${chatId}`);

    // On mobile, close the sidebar after selection
    if (window.innerWidth <= 768) {
      onToggle();
    }
  };
  const handleRenameModal = (chatId: string, currentTitle: string) => {
    setRenameModalState({ isOpen: true, chatId, currentTitle });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleDeleteModal = (chatIds: string | string[]) => {
    const ids = Array.isArray(chatIds) ? chatIds : [chatIds];
    setDeleteModalState({ isOpen: true, chatIds: ids });
  };
  const handleDeleteChat = async () => {
    try {
      if (deleteModalState.chatIds.length > 0) {
        await deleteChats({
          requestBody: { chat_ids: deleteModalState.chatIds },
        });
        if (deleteModalState.chatIds.includes(activeChatId || "")) {
          navigate("/chat");
        }
      }
      setDeleteModalState({ isOpen: false, chatIds: [] });
    } catch (error) {
      console.error("Failed to delete chat:", error);
      setDeleteModalState({ isOpen: false, chatIds: [] });
    }
  };
  const toggleChatSelection = (chatId: string, selected: boolean) => {
    setSelectedChatIds((prev) => {
      if (selected) {
        return [...prev, chatId];
      }
      return prev.filter((id) => id !== chatId);
    });
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedChatIds(filteredChats.map((chat) => chat.id));
    } else {
      setSelectedChatIds([]);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayInMs = 86400000;

    if (diff < dayInMs) {
      // Today - show time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (diff < dayInMs * 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: "short" });
    }
    // Older - show date
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div
      className={cn("chat-sidebar", {
        "pointer-events-none cursor-not-allowed": isStreaming,
        open: isOpen,
      })}
    >
      <div className="sidebar-header">
        <button
          type="button"
          className="toggle-button"
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <MenuIcon width={24} height={24} />
        </button>
        <h2 className="sidebar-title">Chats</h2>
        <button
          type="button"
          className="new-chat-button"
          onClick={handleNewChat}
          aria-label="New chat"
        >
          <NewChatIcon width={20} height={20} />
        </button>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <SearchIcon width={16} height={16} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {/* {filteredChats.length > 0 && (
        <div className="select-all-container">
          <div className="select-all-controls">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <button
              type="button"
              className="py-2! select-all-label"
              onClick={() => handleSelectAll(!isAllSelected)}
              aria-label={
                isAllSelected ? "Deselect all chats" : "Select all chats"
              }
            >
              {isAllSelected ? "Deselect all" : "Select all"}
            </button>
          </div>
          {selectedChatIds.length > 0 && (
            <button
              type="button"
              className="bulk-delete-button-inline"
              onClick={() => {
                handleDeleteModal(selectedChatIds);
                setSelectedChatIds([]);
              }}
              aria-label={`Delete ${selectedChatIds.length} selected chats`}
            >
              Delete ({selectedChatIds.length})
            </button>
          )}
        </div>
      )} */}

      <div className="chats-list">
        {isLoading ? (
          <div className="loading-state">
            <p>Loading chats...</p>
          </div>
        ) : (
          <>
            {filteredChats.length === 0 && (
              <div className="no-chats">
                <p>{searchTerm ? "No chats found" : "No recent chats"}</p>
              </div>
            )}

            {/* Pinned chats section */}
            {pinnedChats.length > 0 && (
              <div className="chat-section">
                <h3 className="section-title">Pinned</h3>
                {pinnedChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    isSelected={selectedChatIds.includes(chat.id)}
                    onSelect={() => handleChatSelect?.(chat.id)}
                    onDelete={() => handleDeleteModal(chat.id)}
                    onRename={() => handleRenameModal(chat.id, chat.title)}
                    onTogglePin={() =>
                      handleTogglePinChat(chat.id, chat.pinned)
                    }
                    onSelectChange={(checked) =>
                      toggleChatSelection(chat.id, checked)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}

            {/* Other chats section */}
            {unpinnedChats.length > 0 && (
              <div className="chat-section">
                {/* <h3 className="section-title">All chats</h3> */}
                {unpinnedChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    isSelected={selectedChatIds.includes(chat.id)}
                    onSelect={() => handleChatSelect?.(chat.id)}
                    onDelete={() => handleDeleteModal(chat.id)}
                    onRename={() => handleRenameModal(chat.id, chat.title)}
                    onTogglePin={() =>
                      handleTogglePinChat(chat.id, chat.pinned)
                    }
                    onSelectChange={(checked) =>
                      toggleChatSelection(chat.id, checked)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, chatIds: [] })}
        onConfirm={handleDeleteChat}
        title="Delete chat"
        message="Are you sure you want to delete the selected chat(s)? This action cannot be undone."
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

// ChatListItem component to keep the main component cleaner
interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: () => void;
  onTogglePin: () => void;
  onSelectChange: (checked: boolean) => void;
  formatDate: (date: Date) => string;
}

const ChatListItem: FC<ChatListItemProps> = ({
  chat,
  isActive,
  isSelected,
  onSelect,
  onDelete,
  onRename,
  onTogglePin,
  onSelectChange,
  formatDate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`chat-item flex gap-3 ${isActive ? "active" : ""} ${isMenuOpen ? "menu-open" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Select chat: ${chat.title}`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelectChange}
        onClick={stopPropagation}
        className="cursor-pointer"
      />

      <button
        type="button"
        className="flex items-center gap-1 text-left line-clamp-1 cursor-pointer"
        aria-label={`Select chat: ${chat.title}`}
      >
        {chat.pinned && (
          <PinIcon
            className="text-(--primary) pin-icon"
            width={14}
            height={14}
          />
        )}
        <div className="truncate chat-item-title">{chat.title}</div>
      </button>

      <DropdownMenu
        className="chat-item-menu"
        trigger={<MoreIcon width={16} height={16} />}
        position="left"
        onOpenChange={setIsMenuOpen}
        items={[
          {
            id: "pin",
            label: chat.pinned ? "Unpin" : "Pin",
            icon: <PinIcon width={16} height={16} />,
            onClick: onTogglePin,
          },
          {
            id: "rename",
            label: "Rename",
            icon: <RenameIcon width={16} height={16} />,
            onClick: onRename,
          },
          {
            id: "delete",
            label: "Delete",
            icon: <TrashIcon width={16} height={16} />,
            onClick: onDelete,
            isDanger: true,
          },
        ]}
      />
    </div>
  );
};
