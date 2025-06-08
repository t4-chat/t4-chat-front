import { useState, useRef, useEffect } from 'react';
import { ReactComponent as SendIcon } from 'src/assets/icons/send.svg';
import { Select, SelectOption } from 'src/components/ui-kit/Select/Select';
import './ChatInput.scss';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  modelOptions?: SelectOption[];
  selectedModel?: string;
  onModelChange?: (value: string) => void;
}

export const ChatInput = ({ 
  onSend, 
  isLoading = false, 
  placeholder = 'Type a message...',
  modelOptions,
  selectedModel,
  onModelChange
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(150, textareaRef.current.scrollHeight)}px`;
    }
  };
  
  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
      
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    // Focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  return (
    <div className="chat-input-integrated-wrapper">
      <textarea
        ref={textareaRef}
        className="chat-input"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
      />

      <div className="chat-input-actions">
        {modelOptions && selectedModel && onModelChange && (
          <div className="model-selector-container">
            <Select
              options={modelOptions}
              value={selectedModel}
              onChange={onModelChange}
              className="chat-model-select"
              disabled={isLoading}
              variant="minimal"
              dropdownPosition="top"
              searchable={true}
            />
          </div>
        )}

        <button 
          className={`send-button ${message.trim() && !isLoading ? 'active' : ''}`}
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
          type="button"
        >
          <SendIcon width={20} height={20} />
        </button>
      </div>
    </div>
  );
}; 