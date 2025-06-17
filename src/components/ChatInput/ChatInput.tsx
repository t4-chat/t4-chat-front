import SendIcon from "@/assets/icons/send.svg?react";
import FilePreview from "@/components/FilePreview/FilePreview";
import FileUpload from "@/components/FileUpload/FileUpload";
import type { SearchableSelectOption } from "@/components/ModelSelect/ModelSelect";
import ModelSelect from "@/components/ModelSelect/ModelSelect";
import { AnimatePresence, motion } from "framer-motion";
import { type FC, useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Search, Image } from "lucide-react";
import { cn } from "@/utils/generalUtils";

interface IChatInputProps {
  onSend: (message: string, files?: File[], tools?: string[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  modelOptions?: SearchableSelectOption[];
  selectedModel?: string;
  onModelChange?: (value: string) => void;
  selectedTools?: string[];
  onToolsChange?: (value: string[]) => void;
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
  selectedTools = [],
  onToolsChange,
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
      onSend(
        message,
        files.length > 0 ? files : undefined,
        selectedTools.length > 0 ? selectedTools : undefined,
      );
      setMessage("");
      setFiles([]);

      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const toggleTool = (tool: string) => {
    if (!onToolsChange) return;

    const newTools = selectedTools.includes(tool)
      ? selectedTools.filter((t) => t !== tool)
      : [...selectedTools, tool];

    onToolsChange(newTools);
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
      className="pb-[env(safe-area-inset-bottom)] relative flex flex-col bg-[var(--background-color)] focus-within:shadow-[0_0_0_0.125rem_rgba(var(--primary-color-rgb),0.2)] border border-[var(--border-color)] focus-within:border-[var(--primary-color)] rounded-[12px] w-full max-w-5xl transition-all duration-100"
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

      <div className="flex justify-between items-center px-2 py-2 border-t-0">
        {!responseWasSelected && !!textareaRef.current?.value.length && (
          <div className="flex items-center gap-1.5 bg-amber-300/20 shadow-sm px-3 py-1.5 rounded-lg font-bold text-amber-300 text-xs">
            <span>💡</span>
            <span>First response will be used by default</span>
          </div>
        )}
        <div className="relative flex items-center gap-2">
          <AnimatePresence mode="wait">
            {modelOptions && selectedModel && onModelChange && (
              <motion.div
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 10 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
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
          {onToolsChange && (
            <motion.div
              initial={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 10 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              className="flex gap-2"
            >
              <Button
                variant={
                  selectedTools.includes("web_search") ? "text" : "secondary"
                }
                size="sm"
                onClick={() => toggleTool("web_search")}
                className={cn(
                  "gap-2 h-10",
                  selectedTools.includes("web_search") &&
                    "text-primary border-transparent border",
                )}
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
              {/* <Button
                  variant={selectedTools.includes("image") ? "primary" : "text"}
                  size="sm"
                  onClick={() => toggleTool("image")}
                  className="gap-2"
                >
                  <Image className="w-4 h-4" />
                  Image
                </Button> */}
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <AnimatePresence>
            {isSplitMode && onPaneCountChange && (
              <motion.div
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 10 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <ModelSelect
                  options={[
                    { value: "2", label: "2 panes" },
                    { value: "3", label: "3 panes" },
                    { value: "4", label: "4 panes" },
                    { value: "6", label: "6 panes" },
                  ]}
                  placeholder="Select number of panes"
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
