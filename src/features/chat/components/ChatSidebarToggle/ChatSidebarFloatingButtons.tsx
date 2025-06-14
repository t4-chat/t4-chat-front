import MenuIcon from "@/assets/icons/chats/menu.svg?react";
import NewChatIcon from "@/assets/icons/chats/new-chat.svg?react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      <Button
        variant="secondary"
        size="icon"
        onClick={onToggle}
        aria-label="Open sidebar"
        className="shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] rounded-full w-10 h-10"
      >
        <MenuIcon width={20} height={20} />
      </Button>
      <Button
        variant="primary"
        size="icon"
        onClick={handleNewChat}
        aria-label="New chat"
        className="shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] rounded-full w-10 h-10"
      >
        <NewChatIcon width={18} height={18} />
      </Button>
    </div>
  );
};
