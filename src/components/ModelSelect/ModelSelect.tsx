import { type FC, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Key } from "lucide-react";

export interface ModelSelectOption {
  value: string;
  label: string;
  iconPath?: string;
  hasApiKey?: boolean;
}

interface IModelSelectProps {
  options: ModelSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  dropdownPosition?: "bottom" | "top";
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "input";
}

const ModelSelect: FC<IModelSelectProps> = ({
  options,
  placeholder = "Search models...",
  value,
  onChange,
  className = "",
  dropdownPosition = "bottom",
  disabled = false,
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  const handleContentKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!searchInputRef.current) return;
    if (e.target !== searchInputRef.current && e.key.length === 1) {
      searchInputRef.current.focus();
      setSearchTerm((prev) => `${prev}${e.key}`);
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === "Backspace") {
      setSearchTerm((prev) => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <TooltipProvider>
      <Select
        value={value}
        onValueChange={(val) => {
          onChange(val);
          setSearchTerm("");
        }}
        disabled={options.length === 0 || disabled}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearchTerm("");
          }
        }}
      >
        <div
          className={cn(
            "flex flex-col gap-1 relative [&_.select-dropdown]:min-w-60 [&_.select-dropdown]:w-auto",
            className,
          )}
        >
          <SelectTrigger
            className={cn(
              "relative flex justify-start items-center min-h-8 text-sm transition-all duration-100 cursor-pointer",
              variant === "default" &&
                "[&>svg:last-child]:hidden bg-transparent hover:bg-[rgba(var(--primary-color-rgb),0.1)] data-[state=open]:shadow-none px-2 py-0.5 border data-[state=open]:border-[var(--primary-color)] hover:border-[rgba(var(--primary-color-rgb),0.2)] border-transparent text-[var(--text-secondary-color)] hover:text-[var(--primary-color)]",
              variant === "input" &&
                "h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--component-bg-color)] px-3 py-2 text-[var(--text-primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-0 focus:border-[var(--primary-color)]",
            )}
          >
            <div className="flex flex-1 items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedOption ? (
                <>
                  {selectedOption.iconPath && (
                    <img
                      src={selectedOption.iconPath}
                      alt=""
                      className="inline-block mr-0 w-5 h-5 object-contain align-middle"
                    />
                  )}
                  <span className="flex-1 overflow-hidden text-start text-ellipsis whitespace-nowrap">
                    {selectedOption.label}
                  </span>
                  {selectedOption.hasApiKey && (
                    <Tooltip>
                      <TooltipTrigger className="flex flex-shrink-0 justify-center items-center bg-green-100 dark:bg-green-900/50 rounded-sm w-4 h-4">
                        <Key className="w-2.5 h-2.5 text-green-600 dark:text-green-400 shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Using your API key</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </>
              ) : (
                <span className="text-[var(--text-placeholder-color)]">
                  {placeholder}
                </span>
              )}
            </div>
          </SelectTrigger>
          <SelectContent
            className={cn(
              "bg-[var(--component-bg-color)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 min-w-[var(--radix-select-trigger-width)] max-h-80 overflow-hidden data-[state=open]:animate-[dropdown-slide-down_200ms_both] data-[state=closed]:animate-[dropdown-slide-up_200ms_both]",
              dropdownPosition,
            )}
            side={dropdownPosition}
            position="popper"
            onCloseAutoFocus={() => setSearchTerm("")}
            onKeyDown={handleContentKeyDown}
          >
            <div className="top-0 z-20 sticky bg-[var(--component-bg-color)] p-1 border-[var(--border-color)] border-b">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className="flex bg-[var(--background-color)] px-3 py-2 border border-[var(--border-color)] focus-visible:border-[var(--primary-color)] rounded-lg focus-visible:outline-none focus-visible:ring-[var(--primary-color)] focus-visible:ring-2 focus-visible:ring-offset-0 w-full h-9 text-[var(--text-primary-color)] placeholder:text-[var(--text-placeholder-color)] text-sm transition-all duration-100"
                data-e2e="model-select-search"
              />
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="[&_.absolute]:!hidden relative !flex [&>span]:!flex !flex-row [&>span]:!flex-row !items-center [&>span]:!items-center gap-2 [&>span]:gap-2 data-[highlighted]:bg-[rgba(var(--primary-color-rgb),0.05)] data-[state=checked]:bg-[rgba(var(--primary-color-rgb),0.1)] hover:bg-[rgba(var(--primary-color-rgb),0.05)] !px-3 !py-2.5 border-[var(--border-color)] border-b last:border-b-0 outline-none [&>span]:w-full data-[state=checked]:font-medium text-[var(--text-primary-color)] data-[state=checked]:text-[var(--primary-color)] transition-colors duration-100 cursor-pointer"
                  >
                    <div className="flex flex-1 items-center gap-2">
                      {option.iconPath && (
                        <img
                          src={option.iconPath}
                          alt=""
                          className="inline-block flex-shrink-0 mr-0 w-5 h-5 object-contain align-middle"
                        />
                      )}
                      <span className="flex-1 overflow-hidden text-start text-ellipsis whitespace-nowrap">
                        {option.label}
                      </span>
                      {option.hasApiKey && (
                        <Tooltip>
                          <TooltipTrigger className="flex flex-shrink-0 justify-center items-center bg-green-100 dark:bg-green-900/50 rounded-sm w-4 h-4">
                            <Key className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Using your API key</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-[var(--text-secondary-color)] text-sm text-center">
                  No options found
                </div>
              )}
            </div>
          </SelectContent>
        </div>
      </Select>
    </TooltipProvider>
  );
};

export default ModelSelect;
