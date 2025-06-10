import MenuIcon from "@/assets/icons/chats/menu.svg?react";
import "./ChatSidebarToggle.scss";

interface ChatSidebarToggleProps {
  onClick: () => void;
}

export const ChatSidebarToggle = ({ onClick }: ChatSidebarToggleProps) => {
  return (
    <button
      type="button"
      className="chat-sidebar-toggle"
      onClick={onClick}
      aria-label="Open sidebar"
    >
      <MenuIcon width={20} height={20} />
    </button>
  );
};
