import React from "react";
import "./RadioButton.scss";

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "card" | "inline";
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  className = "",
  disabled = false,
  variant = "default",
}) => {
  const hasError = className.includes('error');

  return (
    <div className={`custom-radio-wrapper ${variant} ${className} ${hasError ? 'has-error' : ''}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="custom-radio-input"
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      <label htmlFor={id} className={`custom-radio-label ${disabled ? 'disabled' : ''}`}>
        <span className={`custom-radio-indicator ${hasError ? 'error' : ''}`}>
          <span className="custom-radio-dot"></span>
        </span>
        <span className="custom-radio-text">{label}</span>
      </label>
    </div>
  );
};

export default RadioButton;
