import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage as ChatMessageType } from 'src/features/chat/types';
import { fileService } from 'src/services/fileService';
import './ChatMessage.scss';

interface ChatMessageProps extends Omit<ChatMessageType, 'id'> {
  disableMarkdown?: boolean;
}

interface AttachmentInfo {
  fileId: string;
  isImage: boolean;
  imageUrl?: string;
  filename?: string;
  isLoading: boolean;
}

export const ChatMessage = ({ content, role, attachments, disableMarkdown = false }: ChatMessageProps) => {
  const hasAttachments = attachments && attachments.length > 0;
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
  const [attachmentInfo, setAttachmentInfo] = useState<AttachmentInfo[]>([]);
  const imageUrlsRef = useRef<string[]>([]);
  const isMountedRef = useRef(true);
  
  // Reset on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      imageUrlsRef.current.forEach(url => {
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
    const initialInfo: AttachmentInfo[] = attachments!.map(fileId => ({
      fileId,
      isImage: false,
      isLoading: true,
      filename: undefined,
      imageUrl: undefined
    }));
    setAttachmentInfo(initialInfo);
    
    // Load attachment info for each file
    const loadAttachmentInfo = async () => {
      const updatedInfo = [...initialInfo];
      
      for (let i = 0; i < attachments!.length; i++) {
        if (!isMountedRef.current) return;
        
        const fileId = attachments![i];
        try {
          const fileInfo = await fileService.getFile(fileId);
          const isImage = fileService.isImageFile(fileInfo.filename, fileInfo.contentType);
          
          if (!isMountedRef.current) return;
          
          let imageUrl;
          if (isImage && fileInfo.blob) {
            // Direct approach using blob URL
            imageUrl = URL.createObjectURL(fileInfo.blob);
            imageUrlsRef.current.push(imageUrl);
            
            // Force a small delay to ensure the image URL is processed
            await new Promise(resolve => setTimeout(resolve, 50));
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
            isLoading: false
          };
          
          if (isMountedRef.current) {
            setAttachmentInfo(prev => {
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
            imageUrl: undefined
          };
          
          setAttachmentInfo(prev => {
            const newInfo = [...prev];
            newInfo[i] = updatedInfo[i];
            return newInfo;
          });
        }
      }
    };
    
    loadAttachmentInfo();
  }, [attachments, hasAttachments]);
  
  const downloadFile = async (fileId: string) => {
    if (isDownloading[fileId]) return;
    
    try {
      setIsDownloading(prev => ({ ...prev, [fileId]: true }));
      await fileService.downloadFile(fileId);
    } catch (error) {
      // Silent error handling
    } finally {
      if (isMountedRef.current) {
        setIsDownloading(prev => ({ ...prev, [fileId]: false }));
      }
    }
  };
  
  return (
    <div className={`chat-message ${role}`}>
      <div className="message-content">
        {disableMarkdown ? (
          <div>{content}</div>
        ) : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    // @ts-ignore
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
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
                className={`attachment-item ${isDownloading[info.fileId] ? 'downloading' : ''} ${info.isImage ? 'image-attachment' : ''}`}
                onClick={() => !info.isImage && downloadFile(info.fileId)}
              >
                {info.isLoading ? (
                  <div className="attachment-loading">Loading...</div>
                ) : info.isImage && info.imageUrl ? (
                  <div className="attachment-image">
                    <img src={info.imageUrl} alt={info.filename || 'Image attachment'} />
                    <button 
                      className="download-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(info.fileId);
                      }}
                      aria-label="Download image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15V3M12 15L8 11M12 15L16 11M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="attachment-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 8.5V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2H13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="attachment-label">
                      {isDownloading[info.fileId] ? 'Downloading...' : (info.filename || `Attachment`)}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 