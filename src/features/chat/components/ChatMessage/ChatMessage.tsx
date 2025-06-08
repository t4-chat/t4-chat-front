import { ChatMessage as ChatMessageType } from 'src/features/chat/types';
import './ChatMessage.scss';

interface ChatMessageProps extends Omit<ChatMessageType, 'id'> {}

export const ChatMessage = ({ content, role }: ChatMessageProps) => {
  return (
    <div className={`chat-message ${role}`}>
      <div className="message-content">
        {content}
      </div>
    </div>
  );
}; 