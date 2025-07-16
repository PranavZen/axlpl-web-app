import React from "react";
import "../input/Input.scss";

interface InputProps {
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeHolder?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number; // Added
  readOnly?: boolean; // Added
}

const Input: React.FC<InputProps> = ({
  type,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeHolder,
  className,
  disabled,
  maxLength, // Added
  readOnly // Added
}) => {
  return (
    <>
      <input
        type={type}
        id={id}
        name={name}
        className={`${className} ${touched && error ? "is-invalid input-error" : ""}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeHolder}
        autoComplete="on"
        disabled={disabled}
        maxLength={maxLength} // Added
        readOnly={readOnly} // Added
      />
      {/* {touched && error && <div className="errorText">{error}</div>} */}
    </>
  );
};

export default Input;
