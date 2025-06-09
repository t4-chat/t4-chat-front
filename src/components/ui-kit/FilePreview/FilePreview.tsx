import { useState, useEffect } from "react";
import "./FilePreview.scss";

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
    <div className="file-preview">
      <div className="file-preview-content">
        {previewUrl ? (
          <div className="file-preview-image">
            <img src={previewUrl} alt={file.name} />
          </div>
        ) : (
          <div className="file-preview-icon">
            <span className="file-extension">
              {getFileExtension(file.name)}
            </span>
          </div>
        )}
        <div className="file-preview-info">
          <span className="file-name">{displayName}</span>
          <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      </div>
      <button
        className="file-remove-button"
        onClick={onRemove}
        aria-label="Remove file"
        type="button"
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
      </button>
    </div>
  );
};
