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
      variant="secondary"
      size="icon"
      onClick={onClick}
      aria-label="Scroll to bottom"
      className="right-4 bottom-4 absolute shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)] hover:shadow-[0_0.25rem_0.5rem_rgba(0,0,0,0.15)] rounded-full w-8 h-8"
    >
      <ChevronDown size={16} />
    </Button>
  );
};

export default ScrollToBottomButton;
