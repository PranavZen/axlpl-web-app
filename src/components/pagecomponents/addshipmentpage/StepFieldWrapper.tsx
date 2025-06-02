import React from "react";
import { ErrorMessage, Field } from "formik";
import Input from "../../ui/input/Input";
import Label from "../../ui/label/Label";

interface StepFieldWrapperProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  as?: any;
  component?: any;
  children?: React.ReactNode;
  disabled?: boolean;
  suppressErrors?: boolean;
  id?: string; // Optional custom ID
}

const StepFieldWrapper = ({
  name,
  label,
  type = "text",
  placeholder,
  as = Input,
  children,
  disabled = false,
  suppressErrors = false,
  id,
}: StepFieldWrapperProps) => {
  // Generate unique ID: use custom ID if provided, otherwise use name as fallback
  const fieldId = id || name;

  return (
    <>
      <Label className="form-label innerLabel" htmlFor={fieldId} text={label} />
      {children ? (
        // Render children with proper ID handling
        <div>{children}</div>
      ) : (
        <Field
          name={name}
          id={fieldId}
          as={as}
          type={type}
          placeholder={placeholder}
          className="form-control innerFormControll"
          disabled={disabled}
        />
      )}
      {!suppressErrors && (
        <ErrorMessage name={name} component="div" className="errorText" />
      )}
    </>
  );
};

export default StepFieldWrapper;