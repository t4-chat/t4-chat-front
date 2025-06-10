import "./ChatSidebarBackdrop.scss";

interface ChatSidebarBackdropProps {
  onClick: () => void;
}

export const ChatSidebarBackdrop = ({ onClick }: ChatSidebarBackdropProps) => {
  return (
    <div
      className="chat-sidebar-backdrop"
      onClick={onClick}
      aria-hidden="true"
    />
  );
};
