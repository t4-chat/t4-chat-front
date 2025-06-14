import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Create a preview URL for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  // Get the file extension
  const getFileExtension = (filename: string) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  // Shorten the filename if it's too long
  const displayName =
    file.name.length > 20
      ? `${file.name.substring(0, 10)}...${file.name.substring(file.name.length - 10)}`
      : file.name;

  return (
    <div className="flex justify-between items-center bg-black/5 mr-2 mb-2 p-2 rounded-lg max-w-[200px]">
      <div className="flex flex-1 items-center min-w-0">
        {previewUrl ? (
          <div className="flex-shrink-0 mr-2 rounded w-7 h-7 overflow-hidden">
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-shrink-0 justify-center items-center bg-gray-200 mr-2 rounded w-7 h-7">
            <span className="font-semibold text-[10px] text-[var(--text-secondary-color)] uppercase">
              {getFileExtension(file.name)}
            </span>
          </div>
        )}
        <div className="flex flex-col min-w-0 overflow-hidden">
          <span className="overflow-hidden text-[var(--text-primary-color)] text-xs text-ellipsis whitespace-nowrap">
            {displayName}
          </span>
          <span className="text-[10px] text-[var(--text-secondary-color)]">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>
      </div>
      <Button
        variant="text"
        size="icon"
        onClick={onRemove}
        aria-label="Remove file"
        className="flex-shrink-0 ml-2 p-0 w-5 h-5"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Remove file"
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
};
