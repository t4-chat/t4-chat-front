import { useEffect, useRef, useState, type FC } from "react";
import "./Select.scss";

export interface SelectOption {
  value: string;
  label: string;
  iconPath?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  variant?: "default" | "minimal";
  dropdownPosition?: "bottom" | "top";
}

export const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = "Select option",
  className = "",
  searchable = false,
  searchPlaceholder = "Search...",
  disabled = false,
  variant = "default",
  dropdownPosition = "bottom",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectId = useRef(`select-${Math.random().toString(36).substr(2, 9)}`);

  // Get the selected option
  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search term
  const filteredOptions =
    searchable && searchTerm
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        toggleDropdown();
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    optionValue: string,
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleOptionSelect(optionValue);
        break;
    }
  };

  return (
    <div className={`select-wrapper ${className}`} ref={selectRef}>
      {label && (
        <label htmlFor={selectId.current} className="select-label">
          {label}
        </label>
      )}

      <div
        id={selectId.current}
        className={`enhanced-select ${isOpen ? "open" : ""} ${error ? "error" : ""} ${disabled ? "disabled" : ""} ${variant}`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${selectId.current}-listbox`}
        aria-labelledby={label ? undefined : selectId.current}
        aria-describedby={error ? `${selectId.current}-error` : undefined}
        tabIndex={disabled ? -1 : 0}
      >
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
            <span className="placeholder">{placeholder}</span>
          )}
        </div>

        {isOpen && (
          <div
            id={`${selectId.current}-listbox`}
            className={`select-dropdown ${dropdownPosition}`}
            role="listbox"
            tabIndex={-1}
          >
            {searchable && (
              <div className="search-container">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={searchPlaceholder}
                />
              </div>
            )}

            {filteredOptions.length > 0 ? (
              <div className="options-list">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`select-option ${option.value === value ? "selected" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionSelect(option.value);
                    }}
                    onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                    role="option"
                    aria-selected={option.value === value}
                    tabIndex={0}
                  >
                    {option.iconPath && (
                      <span className="option-icon">
                        <img
                          src={option.iconPath}
                          alt=""
                          className="model-icon"
                        />
                      </span>
                    )}
                    <span className="option-label">{option.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">No options found</div>
            )}
          </div>
        )}
      </div>

      {error && (
        <span id={`${selectId.current}-error`} className="select-error">
          {error}
        </span>
      )}
    </div>
  );
};
