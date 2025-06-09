import { useState, useRef, ChangeEvent } from "react";
import "./FileUpload.scss";

export interface FileUploadProps {
	onFilesSelected: (files: File[]) => void;
	maxFiles?: number;
	accept?: string;
	disabled?: boolean;
}

export const FileUpload = ({
	onFilesSelected,
	maxFiles = 3,
	accept = "*",
	disabled = false,
}: FileUploadProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		if (selectedFiles.length > 0) {
			// Take only up to maxFiles
			const limitedFiles = selectedFiles.slice(0, maxFiles);
			onFilesSelected(limitedFiles);

			// Reset input so the same file can be selected again if removed
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleClick = () => {
		if (!disabled && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className={`file-upload ${disabled ? "disabled" : ""}`}>
			<button
				type="button"
				className="file-upload-button"
				onClick={handleClick}
				disabled={disabled}
				aria-label="Attach files"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M21 12.5V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4H11"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M17 8V2M14 5H20"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
			<input
				ref={fileInputRef}
				type="file"
				accept={accept}
				onChange={handleFileInputChange}
				style={{ display: "none" }}
				multiple={maxFiles > 1}
				disabled={disabled}
			/>
		</div>
	);
};
