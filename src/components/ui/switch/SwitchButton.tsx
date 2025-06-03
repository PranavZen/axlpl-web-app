import React from "react";

interface SwitchButtonProps {
  id?: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  className = "",
}) => {
  // Use provided id or fallback to name
  const switchId = id || name;

  return (
    <div className="form-check form-switch">
      <input
        className={`form-check-input ${className}`}
        type="checkbox"
        role="switch"
        name={name}
        id={switchId}
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={switchId}>
        {label}
      </label>
    </div>
  );
};

export default SwitchButton;
