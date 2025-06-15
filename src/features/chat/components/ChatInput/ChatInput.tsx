import SendIcon from "@/assets/icons/send.svg?react";
import FilePreview from "@/components/FilePreview/FilePreview";
import FileUpload from "@/components/FileUpload/FileUpload";
import type { ModelSelectOption } from "@/components/ModelSelect/ModelSelect";
import ModelSelect from "@/components/ModelSelect/ModelSelect";
import { AnimatePresence, motion } from "framer-motion";
import { type FC, useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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
      className="pb-[env(safe-area-inset-bottom)] relative flex flex-col bg-[var(--background-color)] focus-within:shadow-[0_0_0_0.125rem_rgba(var(--primary-color-rgb),0.2)] border border-[var(--border-color)] focus-within:border-[var(--primary-color)] rounded-3xl w-full max-w-5xl transition-all duration-100"
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
        <div className="flex flex-wrap gap-2 p-2 px-4 pt-2">
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
        className="bg-transparent disabled:opacity-70 px-4 py-3 border-none outline-none min-h-11 max-h-36 md:max-h-60 text-[var(--text-primary-color)] placeholder:text-[var(--text-placeholder-color)] text-sm leading-6 resize-none disabled:cursor-not-allowed"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      <div className="flex justify-between items-center px-2 py-1 pb-2 pl-3 border-t-0">
        {!responseWasSelected && !!textareaRef.current?.value.length && (
          <div className="flex items-center gap-1.5 bg-amber-300/20 shadow-sm px-3 py-1.5 rounded-lg font-bold text-amber-300 text-xs">
            <span>💡</span>
            <span>First response will be used by default</span>
          </div>
        )}
        <div className="relative flex items-center min-w-40">
          <AnimatePresence mode="wait">
            {modelOptions && selectedModel && onModelChange && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                style={{ transformOrigin: "left center" }}
                className="min-w-40"
              >
                <ModelSelect
                  options={modelOptions}
                  value={selectedModel}
                  onChange={onModelChange}
                  className="min-w-40"
                  dropdownPosition="top"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1">
          <AnimatePresence>
            {isSplitMode && onPaneCountChange && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
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
            )}
          </AnimatePresence>
          <div className="flex items-center gap-2 text-xs">
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

          <Button
            variant={
              (message.trim() || files.length > 0) && !isLoading
                ? "primary"
                : "text"
            }
            size="icon"
            onClick={handleSend}
            disabled={(!message.trim() && files.length === 0) || isLoading}
            aria-label="Send message"
            className="rounded-full w-10 h-10"
          >
            <SendIcon width={20} height={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
