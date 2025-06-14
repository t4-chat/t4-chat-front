import MenuIcon from "@/assets/icons/chats/menu.svg?react";

interface ChatSidebarToggleProps {
  onClick: () => void;
}

export const ChatSidebarToggle = ({ onClick }: ChatSidebarToggleProps) => {
  return (
    <button
      type="button"
      className="top-4 left-4 z-[9] fixed flex justify-center items-center bg-[var(--component-bg-color)] hover:bg-[var(--hover-color)] shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] border border-[var(--border-color)] rounded-full w-10 h-10 text-[var(--text-secondary-color)] hover:text-[var(--primary-color)] transition-all duration-100 cursor-pointer"
      onClick={onClick}
      aria-label="Open sidebar"
    >
      <MenuIcon width={20} height={20} />
    </button>
  );
};
