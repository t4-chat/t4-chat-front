import { cn } from "@/utils/utils";
import { useState, useRef, useEffect, type FC } from "react";

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isDanger?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  position?: "left" | "right";
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenu: FC<DropdownMenuProps> = ({
  trigger,
  items,
  position = "right",
  className = "",
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      const newOpen = !isOpen;
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    }
  };

  const handleItemClick = (e: React.MouseEvent, item: DropdownMenuItem) => {
    e.stopPropagation();
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
    onOpenChange?.(false);
  };

  // Prevent click from propagating to underlying elements
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        onOpenChange?.(false);
        event.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        className="flex justify-center items-center bg-transparent p-0 border-none cursor-pointer"
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        ref={triggerRef}
        aria-expanded={isOpen}
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-1 bg-[var(--component-bg-color)] rounded-md shadow-lg min-w-40 overflow-hidden z-50 border border-[var(--border-color)]",
            {
              "right-0": position === "left",
              "left-0": position === "right",
            },
          )}
          ref={menuRef}
          onClick={handleMenuClick}
        >
          <ul className="bg-[var(--component-bg-color)] m-0 p-0 list-none">
            {items.map((item) => (
              <li key={item.id} className="bg-[var(--component-bg-color)]">
                <button
                  type="button"
                  className={`flex items-center w-full py-3 px-4 bg-[var(--component-bg-color)] border-none text-left cursor-pointer text-sm transition-colors duration-100 ${
                    item.isDanger
                      ? "text-[var(--error-color)] hover:bg-[rgba(var(--error-color-rgb),0.1)]"
                      : "text-[var(--text-primary-color)] hover:bg-[var(--hover-color)]"
                  }`}
                  onClick={(e) => handleItemClick(e, item)}
                >
                  {item.icon && (
                    <span className="flex items-center mr-3 text-inherit">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
