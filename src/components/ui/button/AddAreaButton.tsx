import React from "react";
import "./AddAreaButton.scss";

interface AddAreaButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success" | "danger";
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  id?: string;
  ariaLabel?: string;
}

const AddAreaButton: React.FC<AddAreaButtonProps> = ({
  text = "Add Area",
  onClick,
  disabled = false,
  loading = false,
  size = "md",
  variant = "primary",
  icon,
  className = "",
  type = "button",
  id,
  ariaLabel,
}) => {
  // Default plus icon if no icon is provided
  const defaultIcon = (
    <svg
      className="add-area-icon"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Loading spinner icon
  const loadingIcon = (
    <svg
      className="add-area-icon"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v11H4V4z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Determine which icon to show
  const displayIcon = loading ? loadingIcon : (icon || defaultIcon);

  // Build CSS classes
  const buttonClasses = [
    "add-area-button",
    size !== "md" ? `size-${size}` : "",
    variant !== "primary" ? `variant-${variant}` : "",
    loading ? "loading" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      id={id}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || text}
      aria-busy={loading}
    >
      {displayIcon}
      <span className="add-area-text">{text}</span>
    </button>
  );
};

export default AddAreaButton;
