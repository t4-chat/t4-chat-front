import { useState, useRef, useEffect } from 'react';
import SendIcon  from '@/assets/icons/send.svg?react';
import { Select, SelectOption } from '@/components/ui-kit/Select/Select';
import { FileUpload } from '@/components/ui-kit/FileUpload/FileUpload';
import { FilePreview } from '@/components/ui-kit/FilePreview/FilePreview';
import './ChatInput.scss';

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
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
  const [files, setFiles] = useState<File[]>([]);
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
    if ((message.trim() || files.length > 0) && !isLoading) {
      onSend(message, files.length > 0 ? files : undefined);
      setMessage('');
      setFiles([]);
      
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

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles((prevFiles) => {
      // Check if adding these files would exceed the limit
      const remainingSlots = 3 - prevFiles.length;
      
      if (remainingSlots <= 0) {
        return prevFiles; // Already at max
      }
      
      // Only take as many new files as we have slots for
      const newFiles = selectedFiles.slice(0, remainingSlots);
      
      return [...prevFiles, ...newFiles];
    });
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  return (
    <div className="chat-input-integrated-wrapper">
      {files.length > 0 && (
        <div className="file-previews">
          {files.map((file, index) => (
            <FilePreview 
              key={`${file.name}-${index}`} 
              file={file} 
              onRemove={() => handleRemoveFile(index)} 
            />
          ))}
        </div>
      )}
      
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

        <div className="input-action-buttons">
          <FileUpload 
            onFilesSelected={handleFilesSelected}
            maxFiles={3 - files.length}
            disabled={isLoading || files.length >= 3}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <button 
            className={`send-button ${(message.trim() || files.length > 0) && !isLoading ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!message.trim() && files.length === 0 || isLoading}
            aria-label="Send message"
            type="button"
          >
            <SendIcon width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
}; 