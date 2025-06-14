import { useEffect, useRef, useState, type FC } from "react";
import { Button } from "../Button/Button";
import { Modal } from "./Modal";
import { cn } from "@/lib/utils";

interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  initialValue?: string;
  placeholder?: string;
  saveLabel?: string;
  cancelLabel?: string;
  maxLength?: number;
  validator?: (value: string) => boolean;
  errorMessage?: string;
}

export const TextInputModal: FC<TextInputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialValue = "",
  placeholder = "",
  saveLabel = "Save",
  cancelLabel = "Cancel",
  maxLength = 100,
  validator = (value) => value.trim().length > 0,
  errorMessage = "Input cannot be empty",
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the input value when the modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setError("");
      // Focus the input after a short delay to ensure the modal is fully visible
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Clear error if input becomes valid
    if (error && validator(newValue)) {
      setError("");
    }
  };

  const handleSave = () => {
    if (validator(value)) {
      onSave(value);
      onClose();
    } else {
      setError(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-0 px-4 pb-4">
        <div className="relative mb-5">
          <input
            ref={inputRef}
            type="text"
            className={cn(
              "w-full p-3 border border-[var(--border-color)] rounded-lg text-base text-[var(--text-primary-color)] bg-[var(--component-bg-color)] transition-colors duration-100",
              "focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_0.125rem_rgba(var(--primary-color-rgb),0.2)]",
              "placeholder:text-[var(--text-placeholder-color)]",
              error &&
                "border-[var(--error-color)] focus:shadow-[0_0_0_0.125rem_rgba(var(--error-color-rgb),0.2)]",
            )}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          {error && (
            <p className="mt-2 mb-0 text-[var(--error-color)] text-sm">
              {error}
            </p>
          )}
          <p className="right-2 -bottom-6 absolute m-0 text-[var(--text-secondary-color)] text-xs">
            {value.length} / {maxLength}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button onClick={onClose} variant="secondary">
            {cancelLabel}
          </Button>

          <Button
            onClick={handleSave}
            variant="primary"
            disabled={!validator(value)}
          >
            {saveLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
