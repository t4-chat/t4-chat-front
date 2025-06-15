import { Button } from "@/components/ui/button";
import MenuIcon from "@/assets/icons/chats/menu.svg?react";

interface ChatSidebarToggleProps {
  onClick: () => void;
}

const ChatSidebarToggle = ({ onClick }: ChatSidebarToggleProps) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={onClick}
      aria-label="Open sidebar"
      className="top-4 left-4 z-[9] fixed shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] rounded-full w-10 h-10"
    >
      <MenuIcon width={20} height={20} />
    </Button>
  );
};

export default ChatSidebarToggle;
