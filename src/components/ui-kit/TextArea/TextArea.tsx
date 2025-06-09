import React from "react";
import "./TextArea.scss";

interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: string;
	label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
	error,
	label,
	className = "",
	...props
}) => {
	return (
		<div className="textarea-wrapper">
			{label && <label className="textarea-label">{label}</label>}
			<textarea
				className={`ui-textarea ${error ? "error" : ""} ${className}`}
				{...props}
			/>
			{error && <span className="textarea-error">{error}</span>}
		</div>
	);
};
