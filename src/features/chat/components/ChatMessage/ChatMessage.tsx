import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ChatMessage as ChatMessageType } from "@/features/chat/types";
import { fileService } from "@/services/fileService";
import "./ChatMessage.scss";

interface ChatMessageProps extends Omit<ChatMessageType, "id"> {
  disableMarkdown?: boolean;
  modelName?: string;
  modelIconPath?: string;
}

interface AttachmentInfo {
  fileId: string;
  isImage: boolean;
  imageUrl?: string;
  filename?: string;
  isLoading: boolean;
}

export const ChatMessage = ({
  content,
  role,
  attachments,
  disableMarkdown = false,
  modelName,
  modelIconPath,
}: ChatMessageProps) => {
  const hasAttachments = attachments && attachments.length > 0;
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>(
    {},
  );
  const [attachmentInfo, setAttachmentInfo] = useState<AttachmentInfo[]>([]);
  const imageUrlsRef = useRef<string[]>([]);
  const isMountedRef = useRef(true);
  const messageRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"top" | "bottom" | "side">(
    "bottom",
  );
  const [sideOffset, setSideOffset] = useState(8);
  const [copied, setCopied] = useState(false);

  // Reset on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      imageUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // Silent error handling
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!hasAttachments) return;

    // Initialize attachment info
    const initialInfo: AttachmentInfo[] = attachments.map((fileId) => ({
      fileId,
      isImage: false,
      isLoading: true,
      filename: undefined,
      imageUrl: undefined,
    }));
    setAttachmentInfo(initialInfo);

    // Load attachment info for each file
    const loadAttachmentInfo = async () => {
      const updatedInfo = [...initialInfo];

      for (let i = 0; i < attachments.length; i++) {
        if (!isMountedRef.current) return;

        const fileId = attachments[i];
        try {
          const fileInfo = await fileService.getFile(fileId);
          const isImage = fileService.isImageFile(
            fileInfo.filename,
            fileInfo.contentType,
          );

          if (!isMountedRef.current) return;

          let imageUrl: string | undefined;
          if (isImage && fileInfo.blob) {
            // Direct approach using blob URL
            imageUrl = URL.createObjectURL(fileInfo.blob);
            imageUrlsRef.current.push(imageUrl);

            // Force a small delay to ensure the image URL is processed
            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          if (!isMountedRef.current) {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            return;
          }

          updatedInfo[i] = {
            fileId,
            isImage,
            filename: fileInfo.filename,
            imageUrl,
            isLoading: false,
          };

          if (isMountedRef.current) {
            setAttachmentInfo((prev) => {
              const newInfo = [...prev];
              newInfo[i] = updatedInfo[i];
              return newInfo;
            });
          }
        } catch (error) {
          if (!isMountedRef.current) return;

          updatedInfo[i] = {
            fileId,
            isImage: false,
            isLoading: false,
            filename: undefined,
            imageUrl: undefined,
          };

          setAttachmentInfo((prev) => {
            const newInfo = [...prev];
            newInfo[i] = updatedInfo[i];
            return newInfo;
          });
        }
      }
    };

    loadAttachmentInfo();
  }, [attachments, hasAttachments]);

  useEffect(() => {
    const el = messageRef.current;
    if (!el) return;

    const scrollContainer = el.closest(".chat-messages") as HTMLElement | null;

    const updatePosition = () => {
      const rect = el.getBoundingClientRect();
      const containerRect = scrollContainer?.getBoundingClientRect() ?? {
        top: 0,
        bottom: window.innerHeight,
      };

      const topVisible =
        rect.top >= containerRect.top && rect.top < containerRect.bottom;
      const bottomVisible =
        rect.bottom > containerRect.top && rect.bottom <= containerRect.bottom;

      if (!bottomVisible && topVisible) {
        setPlacement("top");
      } else if (!topVisible && bottomVisible) {
        setPlacement("bottom");
      } else if (!topVisible && !bottomVisible) {
        setPlacement("side");
        const visibleTop = Math.max(containerRect.top, rect.top);
        setSideOffset(visibleTop - rect.top + 32);
      } else {
        setPlacement("bottom");
      }
    };

    updatePosition();
    scrollContainer?.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      scrollContainer?.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  const downloadFile = async (fileId: string) => {
    if (isDownloading[fileId]) return;

    try {
      setIsDownloading((prev) => ({ ...prev, [fileId]: true }));
      await fileService.downloadFile(fileId);
    } catch (error) {
      // Silent error handling
    } finally {
      if (isMountedRef.current) {
        setIsDownloading((prev) => ({ ...prev, [fileId]: false }));
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      // Silent error handling
    }
  };

  return (
    <div className={`chat-message ${role}`} ref={messageRef}>
      <button
        className={`copy-button ${placement}`}
        style={placement === "side" ? { top: sideOffset } : undefined}
        onClick={handleCopy}
        aria-label="Copy message"
        type="button"
      >
        {copied ? (
          <div className="flex items-center gap-1 copied">
            <p className="text-xs">Copied</p>
            <Check size={16} />
          </div>
        ) : (
          <div className="copy-button-icon">
            <Copy size={16} />
          </div>
        )}
      </button>
      <div className="message-content">
        {disableMarkdown ? (
          <div>{content}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({
                inline,
                className,
                children,
                ...props
              }: {
                inline?: boolean;
                className?: string;
                children?: React.ReactNode;
              }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    // @ts-ignore
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        )}

        {hasAttachments && (
          <div className="attachments">
            {attachmentInfo.map((info) => (
              <div
                key={info.fileId}
                className={`attachment-item ${isDownloading[info.fileId] ? "downloading" : ""} ${info.isImage ? "image-attachment" : ""}`}
                onClick={() => !info.isImage && downloadFile(info.fileId)}
                role={!info.isImage ? "button" : undefined}
                tabIndex={!info.isImage ? 0 : undefined}
                onKeyDown={(e) => {
                  if (!info.isImage && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    downloadFile(info.fileId);
                  }
                }}
              >
                {info.isLoading ? (
                  <div className="attachment-loading">Loading...</div>
                ) : info.isImage && info.imageUrl ? (
                  <div className="attachment-image">
                    <img
                      src={info.imageUrl}
                      alt={info.filename || "Image attachment"}
                    />
                    <button
                      type="button"
                      className="download-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(info.fileId);
                      }}
                      aria-label="Download image"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Download image"
                      >
                        <path
                          d="M12 15V3M12 15L8 11M12 15L16 11M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="attachment-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Download attachment"
                        role="img"
                      >
                        <path
                          d="M20 8.5V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2H13.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="attachment-label">
                      {isDownloading[info.fileId]
                        ? "Downloading..."
                        : info.filename || "Attachment"}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {role === "assistant" && (modelName || modelIconPath) && (
          <div className="model-info">
            {modelIconPath && (
              <img
                src={modelIconPath}
                alt={modelName || "AI Model"}
                className="model-icon"
              />
            )}
            {modelName && <span className="model-name">{modelName}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
