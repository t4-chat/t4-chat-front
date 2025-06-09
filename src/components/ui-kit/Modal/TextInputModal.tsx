import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";
import "./TextInputModal.scss";

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

export const TextInputModal: React.FC<TextInputModalProps> = ({
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
      <div className="text-input-modal">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            className={`text-input ${error ? "error" : ""}`}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          {error && <p className="error-message">{error}</p>}
          <p className="character-count">
            {value.length} / {maxLength}
          </p>
        </div>

        <div className="input-modal-actions">
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
