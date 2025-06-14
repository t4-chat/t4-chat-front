import { useEffect, type FC, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="top-0 right-0 bottom-0 left-0 z-10 fixed flex justify-center items-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-[var(--component-bg-color)] rounded-xl p-4 max-w-[90%] w-[480px] max-h-[90vh] overflow-y-auto relative shadow-[0_0.5rem_1rem_rgba(0,0,0,0.2)]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h2 className="m-0 text-[var(--text-color)] text-2xl">{title}</h2>
          )}
          <button
            type="button"
            className="hover:bg-[var(--hover-color)] bg-none p-1 border-none rounded text-[var(--text-color)] text-2xl leading-none transition-colors duration-200 cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="text-[var(--text-color)]">{children}</div>
      </div>
    </div>
  );
};
