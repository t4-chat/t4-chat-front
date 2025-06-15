import { useEffect, type FC, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import Portal from "@/components/Portal/Portal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

const Modal: FC<ModalProps> = ({
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
        event.stopPropagation();
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
    <Portal>
      <div
        className="top-0 right-0 bottom-0 left-0 z-50 fixed flex justify-center items-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClose();
          }
        }}
        tabIndex={-1}
      >
        <dialog
          open={isOpen}
          className={cn(
            "bg-[var(--component-bg-color)] rounded-xl p-4 max-w-[90%] w-[480px] max-h-[90vh] overflow-y-auto relative shadow-[0_0.5rem_1rem_rgba(0,0,0,0.2)] border-0",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
            }
          }}
        >
          <div className="flex justify-between items-center mb-4">
            {title && (
              <h2 className="m-0 text-[var(--text-color)] text-2xl">{title}</h2>
            )}
            <Button
              variant="text"
              size="icon"
              onClick={onClose}
              className="p-1 text-2xl leading-none"
            >
              <XIcon size={16} />
            </Button>
          </div>
          <div className="text-[var(--text-color)]">{children}</div>
        </dialog>
      </div>
    </Portal>
  );
};

export default Modal;
