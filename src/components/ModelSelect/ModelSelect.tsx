import { type FC, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import "../Select/Select.scss";

export interface ModelSelectOption {
  value: string;
  label: string;
  iconPath?: string;
}

interface IModelSelectProps {
  options: ModelSelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  dropdownPosition?: "bottom" | "top";
  placeholder?: string;
  disabled?: boolean;
}

const ModelSelect: FC<IModelSelectProps> = ({
  options,
  placeholder = "Search models...",
  value,
  onChange,
  className = "",
  dropdownPosition = "bottom",
  disabled = false,
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
      <div className={cn("select-wrapper chat-model-select", className)}>
        <SelectTrigger className="enhanced-select minimal">
          <div className="selected-option">
            {selectedOption ? (
              <>
                {selectedOption.iconPath && (
                  <span className="option-icon">
                    <img
                      src={selectedOption.iconPath}
                      alt=""
                      className="model-icon"
                    />
                  </span>
                )}
                <span className="option-label">{selectedOption.label}</span>
              </>
            ) : (
              <span className="placeholder">Select model</span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent
          className={cn("select-dropdown", dropdownPosition)}
          side={dropdownPosition}
          position="popper"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
          }}
          onCloseAutoFocus={() => setSearchTerm("")}
          onKeyDown={handleContentKeyDown}
        >
          <div className="top-0 z-10 sticky bg-[var(--component-bg-color)] search-container">
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
              className="search-input"
              data-e2e="model-select-search"
            />
          </div>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="select-option"
              >
                {option.iconPath && (
                  <span className="option-icon">
                    <img src={option.iconPath} alt="" className="model-icon" />
                  </span>
                )}
                <span className="option-label">{option.label}</span>
              </SelectItem>
            ))
          ) : (
            <div className="no-results">No options found</div>
          )}
        </SelectContent>
      </div>
    </Select>
  );
};

export default ModelSelect;
