import SendIcon from "@/assets/icons/send.svg?react";
import { FilePreview } from "@/components/FilePreview/FilePreview";
import { FileUpload } from "@/components/FileUpload/FileUpload";
import type { ModelSelectOption } from "@/components/ModelSelect/ModelSelect";
import ModelSelect from "@/components/ModelSelect/ModelSelect";
import { AnimatePresence, motion } from "framer-motion";
import { type FC, useEffect, useRef, useState } from "react";
import { Switch } from "~/components/ui/switch";
import "./ChatInput.scss";

interface IChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  modelOptions?: ModelSelectOption[];
  selectedModel?: string;
  onModelChange?: (value: string) => void;
  isSplitMode?: boolean;
  onSplitToggle?: (value: boolean) => void;
  paneCount: number;
  onPaneCountChange?: (count: number) => void;
  responseWasSelected?: boolean;
}

const ChatInput: FC<IChatInputProps> = ({
  onSend,
  isLoading = false,
  placeholder = "Type a message...",
  modelOptions,
  onSplitToggle,
  selectedModel,
  onModelChange,
  responseWasSelected,
  isSplitMode = false,
  paneCount,
  onPaneCountChange,
}: IChatInputProps) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSplitToggle = (value: boolean) => {
    onSplitToggle?.(value);
  };

  const handlePaneCountChange = (count: number) => {
    onPaneCountChange?.(count);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(window.innerWidth <= 768 ? 150 : 450, textareaRef.current.scrollHeight)}px`;
    }
  };

  const handleSend = () => {
    if ((message.trim() || files.length > 0) && !isLoading) {
      onSend(message, files.length > 0 ? files : undefined);
      setMessage("");
      setFiles([]);

      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
    <div
      className="chat-input-integrated-wrapper"
      onClick={() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }}
      onKeyDown={() => {
        if (isLoading) {
          return;
        }

        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }}
    >
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
      />

      <div className="chat-input-actions">
        {!responseWasSelected && !!textareaRef.current?.value.length && (
          <div className="flex items-center gap-1.5 bg-amber-300/20 shadow-sm px-3 py-1.5 rounded-lg font-bold text-amber-300 text-xs">
            <span>💡</span>
            <span>First response will be used by default</span>
          </div>
        )}
        <div className="model-selector-container">
          <AnimatePresence mode="wait">
            {modelOptions && selectedModel && onModelChange && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ transformOrigin: "left center" }}
              >
                <ModelSelect
                  options={modelOptions}
                  value={selectedModel}
                  onChange={onModelChange}
                  className="chat-model-select"
                  dropdownPosition="top"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="input-action-buttons">
          <AnimatePresence>
            {/* {isSplitMode && onPaneCountChange && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ transformOrigin: "left center" }}
              >
                <ModelSelect
                  options={[
                    { value: "2", label: "2 panes" },
                    { value: "3", label: "3 panes" },
                    { value: "4", label: "4 panes" },
                    { value: "6", label: "6 panes" },
                  ]}
                  value={paneCount.toString()}
                  onChange={(v) =>
                    handlePaneCountChange(Number.parseInt(v, 10))
                  }
                  disabled={!responseWasSelected}
                />
              </motion.div>
            )} */}
          </AnimatePresence>
          <div className="flex gap-2 split-toggle">
            <Switch
              id="split-mode"
              checked={isSplitMode}
              onCheckedChange={handleSplitToggle}
              data-e2e="split-toggle"
              disabled={!responseWasSelected}
            />
            <label htmlFor="split-mode" className="cursor-pointer">
              Split view
            </label>
          </div>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            maxFiles={3 - files.length}
            disabled={isLoading || files.length >= 3}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <button
            className={`send-button ${(message.trim() || files.length > 0) && !isLoading ? "active" : ""}`}
            onClick={handleSend}
            disabled={(!message.trim() && files.length === 0) || isLoading}
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

export default ChatInput;
