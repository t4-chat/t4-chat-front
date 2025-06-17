import * as React from "react";

import { cn } from "@/utils/generalUtils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--component-bg-color)] px-3 py-2 text-sm text-[var(--text-primary-color)] transition-all duration-100",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--text-primary-color)]",
          "placeholder:text-[var(--text-placeholder-color)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-0 focus-visible:border-[var(--primary-color)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
