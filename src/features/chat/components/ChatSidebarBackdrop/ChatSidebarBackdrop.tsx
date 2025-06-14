interface ChatSidebarBackdropProps {
  onClick: () => void;
}

export const ChatSidebarBackdrop = ({ onClick }: ChatSidebarBackdropProps) => {
  return (
    <div
      className="md:hidden top-0 right-0 bottom-0 left-0 z-[8] fixed bg-black/50 animate-[fadeIn_0.2s_ease]"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Escape" && onClick()}
      aria-hidden="true"
    />
  );
};
