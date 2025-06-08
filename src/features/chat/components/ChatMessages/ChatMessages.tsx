import { useRef, useEffect, useMemo } from 'react';
import { ChatMessage as ChatMessageType } from 'src/features/chat/types';
import { ChatMessage } from 'src/features/chat/components/ChatMessage/ChatMessage';
import { LoadingDots } from 'src/components/ui-kit';
import './ChatMessages.scss';

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
}

export const ChatMessages = ({ messages, isLoading = false }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use a small timeout to ensure DOM has updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end' 
        });
      }, 100);
    }
  }, [messages]);

  // Initial scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {!hasMessages && (
        <div className="empty-chat">
          <div className="empty-chat-content">
            <h2>Start a new conversation</h2>
            <p>Type a message below to begin</p>
          </div>
        </div>
      )}

      {hasMessages && (
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message-wrapper ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <ChatMessage 
                content={message.content} 
                role={message.role} 
                created_at={message.created_at} 
              />
              {isLoading && 
               message.role === 'assistant' && 
               message === messages[messages.length - 1] && (
                <div className="message-loading">
                  <LoadingDots />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} style={{ height: '1rem' }} />
        </div>
      )}
    </div>
  );
}; 