import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/generalUtils";

const buttonVariants = cva(
  "flex justify-center items-center disabled:opacity-50 rounded-lg focus-visible:outline-none focus-visible:ring-[var(--primary-color)] focus-visible:ring-2 focus-visible:ring-offset-0 font-medium [&_svg]:text-current text-sm transition-all duration-100 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary-color)] text-[var(--text-primary-color)] hover:bg-[var(--primary-color-hover)] disabled:bg-[var(--component-bg-color)] disabled:text-[var(--text-secondary-color)] disabled:hover:bg-[var(--component-bg-color)] shadow-sm",
        secondary:
          "bg-[var(--component-bg-color)] text-[var(--text-primary-color)] border border-[var(--border-color)] hover:bg-[var(--hover-color)] disabled:bg-[var(--component-bg-color)] disabled:text-[var(--text-secondary-color)] disabled:hover:bg-[var(--component-bg-color)] shadow-sm",
        text: "bg-transparent backdrop-blur-sm text-[var(--text-primary-color)] hover:bg-[var(--hover-color)] disabled:bg-transparent disabled:text-[var(--text-secondary-color)] disabled:hover:bg-transparent",
        destructive:
          "bg-[var(--component-bg-color)] text-[var(--error-color)] border border-[var(--border-color)] hover:bg-[rgba(var(--error-color-rgb),0.1)] disabled:bg-[var(--component-bg-color)] disabled:text-[var(--text-secondary-color)] disabled:hover:bg-[var(--component-bg-color)] shadow-sm",
        muted:
          "bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600",
        link: "text-[var(--primary-color)] underline-offset-4 hover:underline disabled:hover:no-underline disabled:text-[var(--text-secondary-color)] bg-transparent",
      },
      size: {
        sm: "h-8 px-3 py-1 text-sm",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  ),
);
Button.displayName = "Button";

export { buttonVariants };
