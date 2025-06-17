import type { FC } from "react";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-0 px-4 pb-4">
        <p className="mb-5 text-[var(--text-primary-color)] text-base leading-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary">
            {cancelLabel}
          </Button>

          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant={isDanger ? "destructive" : "primary"}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
