import "./ChatSidebarBackdrop.scss";

interface ChatSidebarBackdropProps {
	isVisible: boolean;
	onClick: () => void;
}

export const ChatSidebarBackdrop = ({
	isVisible,
	onClick,
}: ChatSidebarBackdropProps) => {
	if (!isVisible) return null;

	return (
		<div
			className="chat-sidebar-backdrop"
			onClick={onClick}
			aria-hidden="true"
		/>
	);
};
