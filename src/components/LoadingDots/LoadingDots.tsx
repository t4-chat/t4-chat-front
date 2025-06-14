import type { FC } from "react";
import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots: FC<LoadingDotsProps> = ({ className = "" }) => {
  return (
    <div className={cn("inline-flex items-center ml-1", className)}>
      <span className="inline-block opacity-60 mx-0.5 rounded-full w-1.5 h-1.5 bg-[var(--text-secondary-color)] animate-[dot-pulse_1s_infinite_ease-in-out]" />
      <span className="inline-block opacity-60 mx-0.5 rounded-full w-1.5 h-1.5 bg-[var(--text-secondary-color)] animate-[dot-pulse_1s_infinite_ease-in-out] [animation-delay:0.2s]" />
      <span className="inline-block opacity-60 mx-0.5 rounded-full w-1.5 h-1.5 bg-[var(--text-secondary-color)] animate-[dot-pulse_1s_infinite_ease-in-out] [animation-delay:0.4s]" />
    </div>
  );
};
