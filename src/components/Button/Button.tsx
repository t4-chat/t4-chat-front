import type { FC } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
}

const buttonVariants = {
  primary: "bg-[var(--primary-color)] text-white hover:opacity-90",
  secondary:
    "bg-[var(--component-bg-color)] text-[var(--text-primary-color)] border border-[var(--border-color)]",
  ghost: "bg-transparent text-[var(--primary-color)]",
  danger: "bg-[var(--error-color)] text-white",
};

const buttonSizes = {
  small: "px-3 py-1 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-5 py-3 text-lg",
};

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "rounded-lg font-medium cursor-pointer transition-all duration-200 inline-flex items-center justify-center border-none",
        buttonVariants[variant],
        buttonSizes[size],
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
