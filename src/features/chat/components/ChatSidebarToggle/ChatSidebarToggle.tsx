import MenuIcon from "@/assets/icons/chats/menu.svg?react";
import "./ChatSidebarToggle.scss";

interface ChatSidebarToggleProps {
	onClick: () => void;
	isVisible: boolean;
}

export const ChatSidebarToggle = ({
	onClick,
	isVisible,
}: ChatSidebarToggleProps) => {
	if (!isVisible) return null;

	return (
		<button
			className="chat-sidebar-toggle"
			onClick={onClick}
			aria-label="Open sidebar"
		>
			<MenuIcon width={20} height={20} />
		</button>
	);
};
