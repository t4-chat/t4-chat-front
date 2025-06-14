import MenuIcon from "@/assets/icons/chats/menu.svg?react";
import NewChatIcon from "@/assets/icons/chats/new-chat.svg?react";
import { useNavigate } from "react-router-dom";

interface ChatSidebarFloatingButtonsProps {
  onToggle: () => void;
}

export const ChatSidebarFloatingButtons = ({
  onToggle,
}: ChatSidebarFloatingButtonsProps) => {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate("/chat");
  };

  return (
    <div className="top-3 left-3 z-[9] fixed flex items-center gap-2">
      <button
        type="button"
        className="flex justify-center items-center bg-[var(--component-bg-color)] hover:bg-[var(--hover-color)] shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] border border-[var(--border-color)] rounded-full w-10 h-10 text-[var(--text-secondary-color)] hover:text-[var(--primary-color)] transition-all duration-100 cursor-pointer"
        onClick={onToggle}
        aria-label="Open sidebar"
      >
        <MenuIcon width={20} height={20} />
      </button>
      <button
        type="button"
        className="flex justify-center items-center bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] border-none rounded-full w-10 h-10 text-white transition-all duration-100 cursor-pointer"
        onClick={handleNewChat}
        aria-label="New chat"
      >
        <NewChatIcon width={18} height={18} />
      </button>
    </div>
  );
};
