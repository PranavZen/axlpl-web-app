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
  return (
    <div className={`custom-radio-wrapper ${variant} ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="custom-radio-input"
      />
      <label htmlFor={id} className="custom-radio-label">
        <span className="custom-radio-indicator">
          <span className="custom-radio-dot"></span>
        </span>
        <span className="custom-radio-text">{label}</span>
      </label>
    </div>
  );
};

export default RadioButton;
