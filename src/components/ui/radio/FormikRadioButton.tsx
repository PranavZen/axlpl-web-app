import React from "react";
import { useField } from "formik";
import RadioButton from "./RadioButton";

interface FormikRadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "card" | "inline";
  onCustomChange?: (value: string) => void;
}

const FormikRadioButton: React.FC<FormikRadioButtonProps> = ({
  id,
  name,
  value,
  label,
  className = "",
  disabled = false,
  variant = "default",
  onCustomChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    helpers.setValue(newValue);
    helpers.setTouched(true);
    // Clear any validation error when user makes a selection
    if (meta.error) {
      helpers.setError(undefined);
    }

    // Call custom change handler if provided
    if (onCustomChange) {
      onCustomChange(newValue);
    }
  };

  return (
    <div className="formik-radio-wrapper">
      <RadioButton
        id={id}
        name={name}
        value={value}
        label={label}
        checked={field.value === value}
        onChange={handleChange}
        className={`${className} ${meta.error && meta.touched ? 'error' : ''}`}
        disabled={disabled}
        variant={variant}
      />
      {/* Show validation errors for radio buttons when touched and has error */}
      {meta.error && meta.touched && (
        <div className="radio-error-text" style={{
          color: '#ff0000',
          fontSize: '1.2rem',
          marginTop: '0.5rem',
          fontWeight: '500'
        }}>
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default FormikRadioButton;
