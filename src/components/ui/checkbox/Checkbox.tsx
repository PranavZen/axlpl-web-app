import React from "react";
import "./Checkbox.scss";

interface CheckboxProps {
  id: string;
  name?: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "card" | "inline";
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  className = "",
  disabled = false,
  variant = "default",
}) => {
  return (
    <div className={`custom-checkbox-wrapper ${variant} ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="custom-checkbox-input"
      />
      <label htmlFor={id} className="custom-checkbox-label">
        <span className="custom-checkbox-indicator">
          <svg
            className="custom-checkbox-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </span>
        <span className="custom-checkbox-text">{label}</span>
      </label>
    </div>
  );
};

export default Checkbox;
