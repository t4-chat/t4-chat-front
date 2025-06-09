import React from "react";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";
import "./ConfirmationModal.scss";

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

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
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
			<div className="confirmation-modal">
				<p className="confirmation-message">{message}</p>

				<div className="confirmation-actions">
					<Button onClick={onClose} variant="secondary">
						{cancelLabel}
					</Button>

					<Button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						variant={isDanger ? "danger" : "primary"}
					>
						{confirmLabel}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
