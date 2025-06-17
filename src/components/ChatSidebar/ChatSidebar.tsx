import MenuIcon from "@/assets/icons/chats/menu.svg?react";
import MoreIcon from "@/assets/icons/chats/more.svg?react";
import NewChatIcon from "@/assets/icons/chats/new-chat.svg?react";
import PinIcon from "@/assets/icons/chats/pin.svg?react";
import RenameIcon from "@/assets/icons/chats/rename.svg?react";
import SearchIcon from "@/assets/icons/chats/search.svg?react";
import TrashIcon from "@/assets/icons/chats/trash.svg?react";
import Logo from "@/assets/icons/logo.png";
import DropdownMenu from "@/components/DropdownMenu/DropdownMenu";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import ShareChatModal from "@/components/Modal/ShareChatModal";
import { Button } from "@/components/ui/button";
import type { Chat } from "@/types/chat";
import { useMutationErrorHandler } from "@/utils/hooks";
import { cn } from "@/utils/generalUtils";
import { useChats } from "@/utils/apiUtils";
import { useQueryClient } from "@tanstack/react-query";
import { Share2 } from "lucide-react";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  UseChatsServiceGetApiChatsKeyFn,
  UseChatsServiceGetApiChatsSharedKeyFn,
} from "~/openapi/queries/common";
import {
  useChatsServiceDeleteApiChats,
  useChatsServiceGetApiChatsSharedBySharedConversationId,
  useChatsServicePatchApiChatsByChatIdPin,
  useChatsServicePatchApiChatsByChatIdTitle,
} from "~/openapi/queries/queries";
// import "./ChatSidebar.scss";

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

const ChatSidebar = ({ isOpen, onToggle, isStreaming }: ChatSidebarProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { chatId: activeChatId, sharedConversationId } = useParams();
  const { handleError, handleSuccess } = useMutationErrorHandler();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    chatIds: string[];
  }>({
    isOpen: false,
    chatIds: [],
  });

  const [shareModalState, setShareModalState] = useState<{
    isOpen: boolean;
    chatId: string | null;
    sharedConversationId?: string | null;
  }>({
    isOpen: false,
    chatId: null,
    sharedConversationId: null,
  });

  const toggleSidebar = useCallback(() => {
    if (isOpen) {
      onToggle();
    }
  }, [isOpen, onToggle]);

  const { chats, isLoading } = useChats();
  useUpdateBrowserTitle({ chats });

  // Fetch shared conversation data when viewing a shared chat
  const { data: sharedChatData } =
    useChatsServiceGetApiChatsSharedBySharedConversationId(
      { sharedConversationId: sharedConversationId || "" },
      undefined,
      { enabled: !!sharedConversationId },
    );

  // Create a mock chat object for the shared conversation
  const sharedChat: Chat | null = useMemo(() => {
    if (!sharedChatData || !sharedConversationId) return null;

    return {
      id: `shared-${sharedConversationId}`,
      title: sharedChatData.title || "Shared Conversation",
      pinned: false,
      created_at: new Date(sharedChatData.created_at),
      updated_at: new Date(sharedChatData.updated_at),
      messages: sharedChatData.messages?.map((msg) => ({
        ...msg,
        previous_message_id: msg.previous_message_id || undefined,
        created_at: new Date(msg.created_at),
        model_id: msg.model_id ? msg.model_id.toString() : undefined,
        attachments: msg.attachments || undefined,
        selected: msg.selected || undefined,
      })),
      shared_conversation: {
        id: sharedConversationId,
      },
    };
  }, [sharedChatData, sharedConversationId]);

  const { mutateAsync: updateChatTitle } =
    useChatsServicePatchApiChatsByChatIdTitle({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: UseChatsServiceGetApiChatsKeyFn(),
        });
        queryClient.invalidateQueries({
          queryKey: UseChatsServiceGetApiChatsSharedKeyFn(),
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

  const groupChatsByDate = (chats: typeof filteredChats) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const thisWeek = new Date(today.getTime() - today.getDay() * 86400000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const groups = {
      today: [] as typeof filteredChats,
      yesterday: [] as typeof filteredChats,
      thisWeek: [] as typeof filteredChats,
      thisMonth: [] as typeof filteredChats,
      older: [] as typeof filteredChats,
    };

    chats.forEach((chat) => {
      const chatDate = new Date(
        chat.updated_at.getFullYear(),
        chat.updated_at.getMonth(),
        chat.updated_at.getDate(),
      );

      if (chatDate.getTime() === today.getTime()) {
        groups.today.push(chat);
      } else if (chatDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(chat);
      } else if (chatDate >= thisWeek && chatDate < today) {
        groups.thisWeek.push(chat);
      } else if (chatDate >= thisMonth && chatDate < thisWeek) {
        groups.thisMonth.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  const pinnedChats = filteredChats.filter((chat) => chat.pinned);
  const unpinnedChats = filteredChats.filter((chat) => !chat.pinned);
  const unpinnedChatGroups = groupChatsByDate(unpinnedChats);
  const isAllSelected =
    filteredChats.length > 0 && selectedChatIds.length === filteredChats.length;

  const handleNewChat = () => {
    navigate("/chat");

    // On mobile, close the sidebar after creating a new chat
    if (window.innerWidth <= 768) {
      onToggle();
    }
  };
  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      await updateChatTitle({
        chatId,
        requestBody: { title: newTitle },
      });
    } catch (error) {
      console.error("Failed to rename chat:", error);
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

  const handleShareModal = (
    chatId: string,
    sharedConversationId?: string | null,
  ) => {
    setShareModalState({
      isOpen: true,
      chatId,
      sharedConversationId,
    });
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
      className={cn(
        "fixed top-0 left-0 bottom-0 w-full md:w-64 bg-[var(--component-bg-color)] z-20 border-r border-[var(--border-color)] transition-all duration-75 flex flex-col -translate-x-full overflow-hidden",
        isOpen && "translate-x-0 shadow-[0.25rem_0_1rem_rgba(0,0,0,0.1)]",
        isStreaming && "pointer-events-none cursor-not-allowed",
      )}
    >
      <div className="flex items-center px-3 py-3 border-[var(--border-color)] border-b">
        <Button
          variant="text"
          size="icon"
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="mr-2 rounded-full w-10 h-10"
        >
          <MenuIcon width={20} height={20} />
        </Button>
        <Link
          to="/"
          className="flex flex-1 items-center gap-2 hover:opacity-80 no-underline transition-opacity duration-100"
        >
          <img src={Logo} alt="T4 Chat Logo" className="w-auto h-5" />
          <span className="font-semibold text-[var(--text-color)] text-md">
            T4 Chat
          </span>
        </Link>
        <Button
          variant="primary"
          size="icon"
          onClick={handleNewChat}
          aria-label="New chat"
          className="rounded-full w-10 h-10"
        >
          <NewChatIcon width={18} height={18} />
        </Button>
      </div>

      <div className="px-2 py-2 border-[var(--border-color)] border-b">
        <div className="flex items-center bg-[var(--hover-color)] px-3 py-1.5 rounded-lg">
          <SearchIcon
            width={16}
            height={16}
            className="mr-3 text-[var(--text-secondary-color)]"
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary-color)] placeholder:text-[var(--text-placeholder-color)] text-sm"
          />
        </div>
      </div>

      <div className="isolate flex-1 py-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-6 min-h-20 text-[var(--text-secondary-color)] text-sm text-center">
            <p>Loading chats...</p>
          </div>
        ) : (
          <>
            {filteredChats.length === 0 && !sharedChat && (
              <div className="p-6 text-[var(--text-secondary-color)] text-sm text-center">
                <p>{searchTerm ? "No chats found" : "No recent chats"}</p>
              </div>
            )}

            {/* Current shared chat section */}
            {sharedChat && (
              <div className="mb-2">
                <h3 className="m-0 px-4 py-2 font-medium text-[var(--primary-color)] text-xs uppercase tracking-wider">
                  Current Shared Chat
                </h3>
                <ChatListItem
                  key={sharedChat.id}
                  chat={sharedChat}
                  isActive={true}
                  isSelected={false}
                  onSelect={() => {}} // No action needed, already viewing
                  onDelete={() => {}} // Shared chats can't be deleted from sidebar
                  onRenameSubmit={() => {}} // Shared chats can't be renamed from sidebar
                  onTogglePin={() => {}} // Shared chats can't be pinned from sidebar
                  onSelectChange={() => {}} // Shared chats can't be selected for bulk operations
                  onShare={() =>
                    handleShareModal(sharedChat.id, sharedConversationId)
                  }
                  formatDate={formatDate}
                  showDropdown={false}
                />
              </div>
            )}

            {/* Pinned chats section */}
            {pinnedChats.length > 0 && (
              <div className="mb-2">
                <h3 className="m-0 px-4 py-2 font-medium text-[var(--text-secondary-color)] text-xs uppercase tracking-wider">
                  Pinned
                </h3>
                {pinnedChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    isSelected={selectedChatIds.includes(chat.id)}
                    onSelect={() => handleChatSelect?.(chat.id)}
                    onDelete={() => handleDeleteModal(chat.id)}
                    onRenameSubmit={(id, title) => handleRenameChat(id, title)}
                    onTogglePin={() =>
                      handleTogglePinChat(chat.id, chat.pinned)
                    }
                    onSelectChange={(checked) =>
                      toggleChatSelection(chat.id, checked)
                    }
                    onShare={() =>
                      handleShareModal(chat.id, chat.shared_conversation?.id)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}

            {/* Date-organized chats sections */}
            {unpinnedChatGroups.today.length > 0 && (
              <div className="mb-2">
                <h3 className="m-0 px-4 py-2 font-medium text-[var(--text-secondary-color)] text-xs uppercase tracking-wider">
                  Today
                </h3>
                {unpinnedChatGroups.today.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    isSelected={selectedChatIds.includes(chat.id)}
                    onSelect={() => handleChatSelect?.(chat.id)}
                    onDelete={() => handleDeleteModal(chat.id)}
                    onRenameSubmit={(id, title) => handleRenameChat(id, title)}
                    onTogglePin={() =>
                      handleTogglePinChat(chat.id, chat.pinned)
                    }
                    onSelectChange={(checked) =>
                      toggleChatSelection(chat.id, checked)
                    }
                    onShare={() =>
                      handleShareModal(chat.id, chat.shared_conversation?.id)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}

            {unpinnedChatGroups.yesterday.length > 0 && (
              <div className="mb-2">
                <h3 className="m-0 px-4 py-2 font-medium text-[var(--text-secondary-color)] text-xs uppercase tracking-wider">
                  Yesterday
                </h3>
                {unpinnedChatGroups.yesterday.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    isSelected={selectedChatIds.includes(chat.id)}
                    onSelect={() => handleChatSelect?.(chat.id)}
                    onDelete={() => handleDeleteModal(chat.id)}
                    onRenameSubmit={(id, title) => handleRenameChat(id, title)}
                    onTogglePin={() =>
                      handleTogglePinChat(chat.id, chat.pinned)
                    }
                    onSelectChange={(checked) =>
                      toggleChatSelection(chat.id, checked)
                    }
                    onShare={() =>
                      handleShareModal(chat.id, chat.shared_conversation?.id)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}

            {unpinnedChatGroups.thisWeek.length > 0 && (
              <div className="mb-2">
                <h3 className="m-0 px-4 py-2 font-medium text-[var(--text-secondary-color)] text-xs uppercase tracking-wider">
                  This Week
                </h3>
                {unpinnedChatGroups.thisWeek.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    isSelected={selectedChatIds.includes(chat.id)}
                    onSelect={() => handleChatSelect?.(chat.id)}
                    onDelete={() => handleDeleteModal(chat.id)}
                    onRenameSubmit={(id, title) => handleRenameChat(id, title)}
                    onTogglePin={() =>
                      handleTogglePinChat(chat.id, chat.pinned)
                    }
                    onSelectChange={(checked) =>
                      toggleChatSelection(chat.id, checked)
                    }
                    onShare={() =>
                      handleShareModal(chat.id, chat.shared_conversation?.id)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}

            {unpinnedChatGroups.thisMonth.length > 0 && (
              <div className="mb-2">
                <h3 className="m-0 px-4 py-2 font-medium text-[var(--text-secondary-color)] text-xs uppercase tracking-wider">
                  This Month
                </h3>
                {unpinnedChatGroups.thisMonth.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    isSelected={selectedChatIds.includes(chat.id)}
                    onSelect={() => handleChatSelect?.(chat.id)}
                    onDelete={() => handleDeleteModal(chat.id)}
                    onRenameSubmit={(id, title) => handleRenameChat(id, title)}
                    onTogglePin={() =>
                      handleTogglePinChat(chat.id, chat.pinned)
                    }
                    onSelectChange={(checked) =>
                      toggleChatSelection(chat.id, checked)
                    }
                    onShare={() =>
                      handleShareModal(chat.id, chat.shared_conversation?.id)
                    }
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}

            {unpinnedChatGroups.older.length > 0 && (
              <div className="mb-2">
                <h3 className="m-0 px-4 py-2 font-medium text-[var(--text-secondary-color)] text-xs uppercase tracking-wider">
                  Older
                </h3>
                {unpinnedChatGroups.older.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    isSelected={selectedChatIds.includes(chat.id)}
                    onSelect={() => handleChatSelect?.(chat.id)}
                    onDelete={() => handleDeleteModal(chat.id)}
                    onRenameSubmit={(id, title) => handleRenameChat(id, title)}
                    onTogglePin={() =>
                      handleTogglePinChat(chat.id, chat.pinned)
                    }
                    onSelectChange={(checked) =>
                      toggleChatSelection(chat.id, checked)
                    }
                    onShare={() =>
                      handleShareModal(chat.id, chat.shared_conversation?.id)
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
      {shareModalState.chatId && (
        <ShareChatModal
          isOpen={shareModalState.isOpen}
          onClose={() =>
            setShareModalState({
              isOpen: false,
              chatId: null,
              sharedConversationId: null,
            })
          }
          chatId={shareModalState.chatId}
          existingSharedConversationId={shareModalState.sharedConversationId}
        />
      )}
    </div>
  );
};

export default ChatSidebar;

// ChatListItem component to keep the main component cleaner
interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRenameSubmit: (chatId: string, newTitle: string) => void;
  onTogglePin: () => void;
  onSelectChange: (checked: boolean) => void;
  onShare: () => void;
  formatDate: (date: Date) => string;
  showDropdown?: boolean;
}

const ChatListItem: FC<ChatListItemProps> = ({
  chat,
  isActive,
  isSelected,
  onSelect,
  onDelete,
  onRenameSubmit,
  onTogglePin,
  onSelectChange,
  onShare,
  formatDate,
  showDropdown = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(chat.title);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTitleInput(chat.title);
  };

  const finishEditing = async () => {
    const newTitle = titleInput.trim();
    setIsEditing(false);
    if (newTitle && newTitle !== chat.title) {
      onRenameSubmit(chat.id, newTitle);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await finishEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(false);
      setTitleInput(chat.title);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "w-full cursor-pointer border-l-4 border-transparent transition-all duration-75 relative flex items-center hover:bg-[var(--hover-color)] text-left bg-transparent border-t-0 border-r-0 border-b-0",
        isActive &&
          "bg-[rgba(var(--primary-color-rgb),0.1)] border-l-[var(--primary-color)]",
        "gap-2",
        "py-2 px-4",
      )}
      onClick={onSelect}
      aria-label={`Select chat: ${chat.title}`}
    >
      <div className="flex flex-1 items-center gap-1 min-w-0 text-left cursor-pointer">
        {chat.pinned && (
          <PinIcon
            className="flex-shrink-0 mr-1 text-[var(--primary-color)]"
            width={14}
            height={14}
          />
        )}
        <div
          className="flex flex-1 items-center overflow-hidden font-medium text-[var(--text-primary-color)] text-base text-ellipsis whitespace-nowrap"
          onDoubleClick={showDropdown ? startEditing : undefined}
        >
          {isEditing ? (
            <input
              type="text"
              value={titleInput}
              onBlur={finishEditing}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={50}
              className="flex-1 bg-[var(--hover-color)] px-2 py-1 border border-[var(--primary-color)] rounded outline-none font-medium text-[var(--text-primary-color)] text-base"
              ref={(input) => input?.focus()}
            />
          ) : (
            chat.title
          )}
        </div>
      </div>

      {showDropdown && (
        <DropdownMenu
          className="flex-shrink-0 ml-auto"
          trigger={
            <div className="flex justify-center items-center bg-transparent hover:bg-[var(--hover-color)] rounded-full text-[var(--text-secondary-color)] hover:text-[var(--text-primary-color)] transition-colors duration-75">
              <MoreIcon width={16} height={16} />
            </div>
          }
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
              id: "share",
              label: chat.shared_conversation ? "Update Share" : "Share",
              icon: <Share2 width={16} height={16} />,
              onClick: onShare,
            },
            {
              id: "rename",
              label: "Rename",
              icon: <RenameIcon width={16} height={16} />,
              onClick: () => {
                setIsEditing(true);
                setTitleInput(chat.title);
              },
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
      )}
    </button>
  );
};
