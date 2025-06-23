import React from "react";
import "./Button.scss";

interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string; // For tooltip when using icon-only buttons
}

const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  type = "button",
  onClick,
  disabled,
  className,
  title,
}) => {
  // Ensure at least one of text or icon is provided
  if (!text && !icon) {
    console.warn(
      "Button component: Either text or icon prop should be provided"
    );
  }

  return (
    <button
      type={type}
      className={`${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {text && <span className="button-text">{text}</span>}
    </button>
  );
};

export default Button;
