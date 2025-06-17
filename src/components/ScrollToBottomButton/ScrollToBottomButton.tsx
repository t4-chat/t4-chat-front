import type { FC } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IScrollToBottomButton {
  onClick: () => void;
  show: boolean;
}

const ScrollToBottomButton: FC<IScrollToBottomButton> = ({ onClick, show }) => {
  if (!show) return null;

  return (
    <Button
      variant="text"
      size="icon"
      onClick={onClick}
      aria-label="Scroll to bottom"
      className="bottom-4 left-1/2 z-10 absolute shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] rounded-full w-8 h-8 -translate-x-1/2 transform"
    >
      <ChevronDown size={16} />
    </Button>
  );
};

export default ScrollToBottomButton;
