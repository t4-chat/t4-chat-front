import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ChatMessage as ChatMessageType } from "@/features/chat/types";
import { fileService } from "@/services/fileService";
import { cn } from "@/lib/utils";

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

const ChatMessage = ({
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
    <div
      className={cn(
        "group relative p-4 my-4 rounded-2xl max-w-[85%] animate-[fadeIn_0.3s_ease-in-out] shadow-[0_0.5rem_1rem_rgba(0,0,0,0.05)]",
        role === "user"
          ? "bg-[var(--message-user-bg-color)] ml-auto mr-6 rounded-br-sm after:content-[''] after:absolute after:bottom-0 after:right-[-0.4rem] after:w-2 after:h-2 after:bg-[var(--message-user-bg-color)] after:[clip-path:polygon(0_0,0%_100%,100%_100%)]"
          : "bg-[var(--message-assistant-bg-color)] mr-auto ml-6 rounded-bl-sm after:content-[''] after:absolute after:bottom-0 after:left-[-0.4rem] after:w-2 after:h-2 after:bg-[var(--message-assistant-bg-color)] after:[clip-path:polygon(100%_0,0%_100%,100%_100%)]",
      )}
      ref={messageRef}
    >
      <button
        className={cn(
          "absolute bg-transparent border-none text-[var(--text-secondary-color)] cursor-pointer p-2 rounded-sm opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-75 hover:bg-black/5",
          placement === "top" && "-top-10",
          placement === "bottom" && "-bottom-10",
          placement === "side" && "top-1/2 -translate-y-1/2",
          role === "user"
            ? placement === "side"
              ? "-left-10"
              : "-right-4"
            : placement === "side"
              ? "-right-10"
              : "-left-4",
        )}
        style={placement === "side" ? { top: sideOffset } : undefined}
        onClick={handleCopy}
        aria-label="Copy message"
        type="button"
      >
        {copied ? (
          <div className="flex items-center gap-1">
            <p className="text-xs">Copied</p>
            <Check size={16} />
          </div>
        ) : (
          <div>
            <Copy size={16} />
          </div>
        )}
      </button>
      <div className="text-[var(--text-primary-color)] text-base break-words leading-6 whitespace-pre-wrap">
        {disableMarkdown ? (
          <div>{content}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mt-6 mb-2 font-semibold text-[1.6em] leading-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-6 mb-2 font-semibold text-[1.4em] leading-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-6 mb-2 font-semibold text-[1.2em] leading-tight">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="mt-6 mb-2 font-semibold text-[1.1em] leading-tight">
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 className="mt-6 mb-2 font-semibold text-[1em] leading-tight">
                  {children}
                </h5>
              ),
              h6: ({ children }) => (
                <h6 className="mt-6 mb-2 font-semibold text-[1em] leading-tight">
                  {children}
                </h6>
              ),
              ul: ({ children }) => (
                <ul className="mt-2 mb-2 pl-6">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mt-2 mb-2 pl-6">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-[var(--primary-color)] hover:underline no-underline"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-2 px-4 py-2 border-[var(--border-color)] border-l-4 text-[var(--text-secondary-color)]">
                  {children}
                </blockquote>
              ),
              p: ({ children }) => <p className="mb-1">{children}</p>,
              table: ({ children }) => (
                <table className="my-4 w-full border-collapse">
                  {children}
                </table>
              ),
              th: ({ children }) => (
                <th className="bg-black/[0.03] p-2 border border-[var(--border-color)] font-semibold text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="p-2 border border-[var(--border-color)] text-left">
                  {children}
                </td>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="rounded-sm max-w-full" />
              ),
              hr: () => (
                <hr className="my-4 border-[var(--border-color)] border-0 border-t" />
              ),
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
                  <div className="bg-black/[0.05] my-4 p-4 rounded-md overflow-x-auto">
                    <SyntaxHighlighter
                      // @ts-ignore
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className="bg-black/[0.05] px-2 py-1 rounded-sm font-mono text-[0.9em]"
                    {...props}
                  >
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
          <div className="flex flex-wrap gap-4 mt-4">
            {attachmentInfo.map((info) => (
              <div
                key={info.fileId}
                className={cn(
                  "flex items-center transition-all duration-75 cursor-pointer",
                  info.isImage
                    ? "p-0 overflow-hidden max-w-[200px] max-h-[200px] cursor-default rounded-md hover:bg-black/[0.05]"
                    : "py-2 px-4 bg-black/[0.05] rounded-md hover:bg-black/[0.08]",
                  isDownloading[info.fileId] &&
                    "bg-[rgba(var(--primary-color-rgb),0.1)] cursor-default",
                )}
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
                  <div className="p-2 text-[var(--text-secondary-color)] text-sm">
                    Loading...
                  </div>
                ) : info.isImage && info.imageUrl ? (
                  <div className="group relative flex justify-center items-center w-full h-full">
                    <img
                      src={info.imageUrl}
                      alt={info.filename || "Image attachment"}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="right-2 bottom-2 absolute flex justify-center items-center bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 border-none rounded-full w-7 h-7 text-white transition-opacity duration-100 cursor-pointer"
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
                    <div className="mr-2 text-[var(--text-secondary-color)]">
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
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isDownloading[info.fileId]
                          ? "text-[var(--primary-color)]"
                          : "text-[var(--text-secondary-color)]",
                      )}
                    >
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
          <div className="flex items-center gap-1 opacity-70 mt-4 pt-3 border-[var(--border-color)] border-t">
            {modelIconPath && (
              <img
                src={modelIconPath}
                alt={modelName || "AI Model"}
                className="rounded-sm w-4 h-4 object-contain"
              />
            )}
            {modelName && (
              <span className="font-medium text-[var(--text-secondary-color)] text-xs">
                {modelName}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
