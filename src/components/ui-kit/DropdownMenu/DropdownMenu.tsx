import React, { useState, useRef, useEffect } from "react";
import "./DropdownMenu.scss";

export interface DropdownMenuItem {
	id: string;
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	isDanger?: boolean;
}

interface DropdownMenuProps {
	trigger: React.ReactNode;
	items: DropdownMenuItem[];
	position?: "left" | "right";
	className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
	trigger,
	items,
	position = "right",
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);

	const toggleMenu = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsOpen(!isOpen);
	};

	const handleItemClick = (e: React.MouseEvent, item: DropdownMenuItem) => {
		e.stopPropagation();
		if (item.onClick) {
			item.onClick();
		}
		setIsOpen(false);
	};

	// Prevent click from propagating to underlying elements
	const handleMenuClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Close menu when pressing Escape
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen]);

	return (
		<div
			className={`dropdown-menu-container ${isOpen ? "menu-open" : ""} ${className}`}
		>
			<div className="dropdown-trigger" onClick={toggleMenu} ref={triggerRef}>
				{trigger}
			</div>

			{isOpen && (
				<div
					className={`dropdown-menu ${position}`}
					ref={menuRef}
					onClick={handleMenuClick}
				>
					<ul className="dropdown-menu-list">
						{items.map((item) => (
							<li key={item.id} className="dropdown-menu-item">
								<button
									className={`dropdown-menu-button ${item.isDanger ? "danger" : ""}`}
									onClick={(e) => handleItemClick(e, item)}
								>
									{item.icon && (
										<span className="dropdown-menu-icon">{item.icon}</span>
									)}
									<span className="dropdown-menu-label">{item.label}</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
