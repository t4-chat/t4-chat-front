"use client";

import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  type InputHTMLAttributes,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChipsInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxChips?: number;
  allowDuplicates?: boolean;
}

const ChipsInput: FC<ChipsInputProps> = ({
  value = [],
  onValueChange,
  placeholder = "Add items...",
  className,
  maxChips,
  allowDuplicates = false,
  disabled,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      if (maxChips && value.length >= maxChips) {
        return;
      }

      if (!allowDuplicates && value.includes(inputValue.trim())) {
        return;
      }

      onValueChange([...value, inputValue.trim()]);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onValueChange(value.slice(0, -1));
    }
  };

  const removeChip = (index: number) => {
    if (disabled) return;
    const newValue = [...value];
    newValue.splice(index, 1);
    onValueChange(newValue);
  };

  const focusInput = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const handleContainerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focusInput();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-wrap items-center gap-1.5 min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={focusInput}
      onKeyDown={handleContainerKeyDown}
      tabIndex={disabled ? -1 : 0}
      aria-label="Add tags"
    >
      {value.map((chip, index) => (
        <div
          key={chip}
          className="inline-flex items-center gap-1 bg-primary/10 px-2 py-1 border border-primary/20 rounded-md font-medium text-primary text-xs"
        >
          <span>{chip}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeChip(index);
            }}
            disabled={disabled}
            className="flex justify-center items-center hover:bg-primary/20 disabled:opacity-50 ml-1 rounded-full focus:outline-none focus:ring-1 focus:ring-ring w-3.5 h-3.5 disabled:cursor-not-allowed"
            aria-label={`Remove ${chip}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none min-w-[120px] placeholder:font-normal placeholder:text-muted-foreground/60 disabled:cursor-not-allowed"
        placeholder={value.length === 0 ? placeholder : ""}
        {...props}
      />
    </div>
  );
};

export default ChipsInput;
