import type { FC } from "react";
import { Modal } from "@/components/Modal/Modal";
import { Button } from "@/components/Button/Button";
import "./InfoModal.scss";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  closeLabel?: string;
}

const InfoModal: FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  closeLabel = "OK",
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="info-modal">
      <p className="info-message">{message}</p>
      <div className="info-actions">
        <Button onClick={onClose}>{closeLabel}</Button>
      </div>
    </div>
  </Modal>
);

export default InfoModal;
