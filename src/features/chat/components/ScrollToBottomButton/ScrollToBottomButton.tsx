import { FC } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface IScrollToBottomButton {
  onClick: () => void;
  show: boolean;
}

const ScrollToBottomButton: FC<IScrollToBottomButton> = ({ onClick, show }) => {
  if (!show) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to bottom"
      className={cn(
        "right-4 bottom-4 absolute flex justify-center items-center bg-[var(--component-bg-color)] hover:bg-[var(--hover-color)] border border-[var(--border-color)] shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] rounded-full w-8 h-8 text-[var(--text-secondary-color)] hover:text-[var(--primary-color)] transition-all duration-100",
      )}
    >
      <ChevronDown size={16} />
    </button>
  );
};

export default ScrollToBottomButton;
